import { GoogleGenAI } from '@google/genai'
import { ComplaintClassificationInput, ComplaintClassificationResult, ProviderHealthResult } from '@/types'
import { buildClassificationPrompt, hashPrompt } from './prompt'
import { ComplaintClassificationSchema } from './schemas'

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

      let parsed: unknown
      try {
        const cleaned = raw_response
          .replace(/```json\s*/gi, '')
          .replace(/```\s*/gi, '')
          .trim()
        const match = cleaned.match(/\{[\s\S]*\}/)
        parsed = JSON.parse(match ? match[0] : cleaned)
      } catch (err: any) {
        return {
          result: null,
          raw_response,
          latency_ms,
          error: `Failed to parse JSON from Gemini: ${err.message}`,
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
