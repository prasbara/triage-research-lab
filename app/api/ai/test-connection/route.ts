import { NextRequest, NextResponse } from 'next/server'
import { testProviderConnection, SUPPORTED_MODELS } from '@/lib/ai/provider'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const provider = body.provider as 'nvidia' | 'gemini'
    const model = body.model as string | undefined

    if (!['nvidia', 'gemini'].includes(provider)) {
      return NextResponse.json(
        { error: 'Provider tidak valid. Gunakan "nvidia" atau "gemini".' },
        { status: 400 }
      )
    }

    const health = await testProviderConnection(provider, { model })
    return NextResponse.json(health)
  } catch (err: any) {
    return NextResponse.json(
      {
        provider: 'unknown',
        model: 'unknown',
        status: 'error',
        error: err.message,
      },
      { status: 200 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    models: SUPPORTED_MODELS,
    configured: {
      nvidia: !!process.env.NVIDIA_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
    },
  })
}
