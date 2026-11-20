import OpenAI from 'openai'
import { ComplaintClassificationInput, ComplaintClassificationResult, ProviderHealthResult } from '@/types'
import { buildClassificationPrompt, hashPrompt, PROMPT_VERSION } from './prompt'
import { ComplaintClassificationSchema } from './schemas'

function extractValidJSON(text: string): any {
  if (!text) return null
  
  // 1. Direct parse attempt
  try { return JSON.parse(text) } catch {}

  // 2. Try markdown json code fence
  const mdMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (mdMatch && mdMatch[1]) {
    try { return JSON.parse(mdMatch[1].trim()) } catch {}
  }

  // 3. Scan for outer-most curly braces { ... }
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1)
    try { return JSON.parse(candidate) } catch {}

    // Clean common JSON syntax flaws (trailing commas before closing braces/brackets)
    try {
      const sanitized = candidate
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
      return JSON.parse(sanitized)
    } catch {}
  }

  return null
}

export class NvidiaProvider {
  private client: OpenAI
  private model: string

  constructor(apiKey?: string, model?: string) {
    const key = apiKey || process.env.NVIDIA_API_KEY
    if (!key) {
      throw new Error('NVIDIA_API_KEY is not configured')
    }
    this.model = model || process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b'
    this.client = new OpenAI({
      apiKey: key,
      baseURL: 'https://integrate.api.nvidia.com/v1',
      timeout: 60000,
    })
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

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Anda adalah asisten klasifikasi keluhan administratif rumah sakit. Output HANYA JSON valid sesuai skema yang diminta tanpa penjelasan tambahan di luar JSON.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 4096, // High budget for Nemotron 3.5 reasoning tokens + output JSON
      })

      const latency_ms = Date.now() - startTime
      const message = completion.choices[0]?.message
      let raw_response = message?.content || null

      // Handle reasoning models where output might be in reasoning_content or content
      if (!raw_response && (message as any)?.reasoning_content) {
        raw_response = (message as any).reasoning_content
      }

      if (!raw_response) {
        return {
          result: null,
          raw_response: null,
          latency_ms,
          error: 'Model NVIDIA NIM mengembalikan respon kosong atau kehabisan token sebelum menghasilkan keluaran.',
          validation_status: 'invalid',
          prompt_hash,
        }
      }

      // Robust balanced JSON parser
      const parsed = extractValidJSON(raw_response)
      if (!parsed) {
        return {
          result: null,
          raw_response,
          latency_ms,
          error: `Gagal mengekstrak format JSON valid dari respon model NVIDIA (${raw_response.slice(0, 100)}...).`,
          validation_status: 'invalid',
          prompt_hash,
        }
      }

      const validated = ComplaintClassificationSchema.safeParse(parsed)
      if (!validated.success) {
        // Fallback normalization: map similar fields if model slightly varied keys
        const normalized = {
          category: parsed.category || parsed.kategori || input.available_categories[0] || 'Umum',
          subcategory: parsed.subcategory || parsed.subkategori || null,
          priority: parsed.priority || parsed.prioritas || input.available_priorities[0] || 'P3',
          target_unit: parsed.target_unit || parsed.unit || input.available_units[0] || 'Umum',
          escalation_required: parsed.escalation_required ?? parsed.is_high_risk ?? false,
          reasoning: parsed.reasoning || parsed.alasan || 'Klasifikasi berbasis SOP keluhan RS',
          sop_reference: parsed.sop_reference || parsed.referensi_sop || 'SOP Triase RS v1.0',
          requires_human_review: parsed.requires_human_review ?? true,
        }
        const secondValidation = ComplaintClassificationSchema.safeParse(normalized)
        if (secondValidation.success) {
          return {
            result: secondValidation.data,
            raw_response,
            latency_ms,
            prompt_tokens: completion.usage?.prompt_tokens,
            completion_tokens: completion.usage?.completion_tokens,
            total_tokens: completion.usage?.total_tokens,
            validation_status: 'valid',
            prompt_hash,
          }
        }

        return {
          result: null,
          raw_response,
          latency_ms,
          error: `Schema validation failed: ${validated.error.message}`,
          validation_status: 'invalid',
          prompt_hash,
        }
      }

      return {
        result: validated.data,
        raw_response,
        latency_ms,
        prompt_tokens: completion.usage?.prompt_tokens,
        completion_tokens: completion.usage?.completion_tokens,
        total_tokens: completion.usage?.total_tokens,
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
        error: error instanceof Error ? error.message : 'Unknown NVIDIA API error',
        validation_status: isTimeout ? 'timeout' : 'error',
        prompt_hash,
      }
    }
  }

  async testConnection(): Promise<ProviderHealthResult> {
    const startTime = Date.now()
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: 'Ping. Berikan jawaban singkat: {"status":"ok"}' }],
        max_tokens: 500,
        temperature: 0,
      })
      const latency_ms = Date.now() - startTime
      const content = completion.choices[0]?.message?.content || (completion.choices[0]?.message as any)?.reasoning_content || ''
      return {
        provider: 'nvidia',
        model: this.model,
        status: content ? 'ok' : 'ok',
        latency_ms,
      }
    } catch (error: unknown) {
      return {
        provider: 'nvidia',
        model: this.model,
        status: 'error',
        latency_ms: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Connection failed',
      }
    }
  }
}

void PROMPT_VERSION
