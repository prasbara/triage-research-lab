import { NvidiaProvider } from './nvidia'
import { GeminiProvider } from './gemini'
import type { AIProvider, ComplaintClassificationInput, ProviderHealthResult } from '@/types'

export interface ProviderOptions {
  model?: string
  apiKey?: string
}

export function getAIProvider(provider: AIProvider, options?: ProviderOptions): NvidiaProvider | GeminiProvider {
  switch (provider) {
    case 'nvidia':
      return new NvidiaProvider(options?.apiKey, options?.model)
    case 'gemini':
      return new GeminiProvider(options?.apiKey, options?.model)
    default:
      throw new Error(`Unsupported AI provider: ${provider}`)
  }
}

export async function classifyWithProvider(
  provider: AIProvider,
  input: ComplaintClassificationInput,
  options?: ProviderOptions
) {
  const p = getAIProvider(provider, options)
  return p.classifyComplaint(input)
}

export async function testProviderConnection(
  provider: AIProvider,
  options?: ProviderOptions
): Promise<ProviderHealthResult> {
  const p = getAIProvider(provider, options)
  return p.testConnection()
}

export const SUPPORTED_MODELS: Record<AIProvider, { id: string; name: string; description: string }[]> = {
  nvidia: [
    {
      id: 'nvidia/nemotron-3.5-lightning-30b-a3b',
      name: 'Nemotron-3.5 Lightning (30B)',
      description: 'NVIDIA Nemotron 3.5 reasoning model with fast inference and deep chain-of-thought analysis',
    },
    {
      id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning',
      name: 'Nemotron-3 Nano Omni (30B)',
      description: 'NVIDIA multi-modal & reasoning engine for nuanced clinical triage classification',
    },
    {
      id: 'google/gemma-3-12b-it',
      name: 'Gemma 3 (12B IT)',
      description: 'Google Gemma instruction-tuned model served on NVIDIA NIM infrastructure',
    },
  ],
  gemini: [
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      description: 'High-speed, high-accuracy multi-task model with native structured JSON output',
    },
    {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      description: 'Advanced reasoning model for complex edge cases and clinical risk assessment',
    },
  ],
}
