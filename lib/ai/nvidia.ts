import OpenAI from 'openai'
import { ComplaintClassificationInput, ComplaintClassificationResult, ProviderHealthResult } from '@/types'
import { buildClassificationPrompt, hashPrompt, PROMPT_VERSION } from './prompt'
import { extractAndValidateTriageJSON } from './json-repair'

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
            content: 'Anda adalah asisten klasifikasi keluhan administratif rumah sakit. Output HANYA JSON valid sesuai skema yang diminta tanpa teks tambahan di luar JSON.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 4096,
      })

      const latency_ms = Date.now() - startTime
      const message = completion.choices[0]?.message
      let raw_response = message?.content || null

      // If content is empty/null, check reasoning_content (e.g. Nemotron reasoning models)
      if (!raw_response && (message as any)?.reasoning_content) {
        raw_response = (message as any).reasoning_content
      }

      if (!raw_response) {
        return {
          result: null,
          raw_response: null,
          latency_ms,
          error: 'Model NVIDIA NIM mengembalikan respon kosong atau kehabisan token.',
          validation_status: 'invalid',
          prompt_hash,
        }
      }

      // Universal resilient JSON extraction & repair
      const parsed = extractAndValidateTriageJSON(raw_response, {
        available_categories: input.available_categories,
        available_priorities: input.available_priorities,
        available_units: input.available_units,
      })

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

      return {
        result: parsed,
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
