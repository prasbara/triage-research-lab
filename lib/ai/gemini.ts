import { GoogleGenAI } from '@google/genai'
import { ComplaintClassificationInput, ComplaintClassificationResult, ProviderHealthResult } from '@/types'
import { buildClassificationPrompt, hashPrompt } from './prompt'
import { ComplaintClassificationSchema } from './schemas'

function cleanAndParseJSON(str: string): any {
  if (!str) return null
  const trimmed = str.trim()
  try {
    return JSON.parse(trimmed)
  } catch {}

  const noComments = trimmed
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '')

  try {
    return JSON.parse(noComments)
  } catch {}

  const noTrailingCommas = noComments
    .replace(/,\s*([}\]])/g, '$1')

  try {
    return JSON.parse(noTrailingCommas)
  } catch {}

  const quotedKeys = noTrailingCommas
    .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')

  try {
    return JSON.parse(quotedKeys)
  } catch {}

  return null
}

function extractValidJSON(text: string): any {
  if (!text) return null
  let cleaned = text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/Here's a thinking process[\s\S]*?(?=\{|\`\`\`)/gi, '')
    .trim()

  const direct = cleanAndParseJSON(cleaned)
  if (direct && typeof direct === 'object') return direct

  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/gi
  let match: RegExpExecArray | null
  while ((match = codeBlockRegex.exec(cleaned)) !== null) {
    const candidate = match[1]
    const parsed = cleanAndParseJSON(candidate)
    if (parsed && typeof parsed === 'object') return parsed
  }

  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = cleaned.substring(firstBrace, lastBrace + 1)
    const parsed = cleanAndParseJSON(candidate)
    if (parsed && typeof parsed === 'object') return parsed
  }

  return null
}

export class GeminiProvider {
  private client: GoogleGenAI
  private model: string

  constructor(apiKey?: string, model?: string) {
    // Primary key or fallback key
    const key = apiKey || process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_BACKUP
    if (!key) {
      throw new Error('GEMINI_API_KEY is not configured')
    }
    this.model = model || process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    this.client = new GoogleGenAI({ apiKey: key })
  }

  async classifyComplaint(input: ComplaintClassificationInput): Promise<{
    result: ComplaintClassificationResult | null
    raw_response: string | null
    latency_ms: number
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
    error?: string
    validation_status: 'valid' | 'invalid' | 'error' | 'timeout'
    prompt_hash: string
  }> {
    const prompt = buildClassificationPrompt({
      complaint_text: input.complaint_text,
      case_id: input.case_id,
      available_categories: input.available_categories,
      available_priorities: input.available_priorities,
      available_units: input.available_units,
      sop_context: input.sop_context,
    })
    const prompt_hash = hashPrompt(prompt)
    const startTime = Date.now()

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout after 35s')), 35000)
    )

    try {
      const responsePromise = this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          temperature: 0.1,
          maxOutputTokens: 2048,
        },
      })

      const response = await Promise.race([responsePromise, timeoutPromise])
      const latency_ms = Date.now() - startTime
      const raw_response = response.text || null

      if (!raw_response) {
        return {
          result: null,
          raw_response: null,
          latency_ms,
          error: 'Empty response from Gemini',
          validation_status: 'invalid',
          prompt_hash,
        }
      }

      const parsed = extractValidJSON(raw_response)
      if (!parsed) {
        return {
          result: null,
          raw_response,
          latency_ms,
          error: `Gagal mengekstrak format JSON valid dari Gemini (${raw_response.slice(0, 100)}...).`,
          validation_status: 'invalid',
          prompt_hash,
        }
      }

      const validated = ComplaintClassificationSchema.safeParse(parsed)
      if (!validated.success) {
        return {
          result: null,
          raw_response,
          latency_ms,
          error: `Schema validation failed: ${validated.error.message}`,
          validation_status: 'invalid',
          prompt_hash,
        }
      }

      const usageMetadata = response.usageMetadata
      return {
        result: validated.data,
        raw_response,
        latency_ms,
        prompt_tokens: usageMetadata?.promptTokenCount,
        completion_tokens: usageMetadata?.candidatesTokenCount,
        total_tokens: usageMetadata?.totalTokenCount,
        validation_status: 'valid',
        prompt_hash,
      }
    } catch (error: unknown) {
      const latency_ms = Date.now() - startTime
      const isTimeout = error instanceof Error && error.message.includes('timeout')
      return {
        result: null,
        raw_response: null,
        latency_ms,
        error: error instanceof Error ? error.message : 'Unknown Gemini API error',
        validation_status: isTimeout ? 'timeout' : 'error',
        prompt_hash,
      }
    }
  }

  async testConnection(): Promise<ProviderHealthResult> {
    const startTime = Date.now()
    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: 'Reply with JSON: {"status":"ok"}',
        config: { maxOutputTokens: 100, temperature: 0 },
      })
      const latency_ms = Date.now() - startTime
      return {
        provider: 'gemini',
        model: this.model,
        status: response.text ? 'ok' : 'error',
        latency_ms,
      }
    } catch (error: unknown) {
      return {
        provider: 'gemini',
        model: this.model,
        status: 'error',
        latency_ms: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Connection failed',
      }
    }
  }
}
