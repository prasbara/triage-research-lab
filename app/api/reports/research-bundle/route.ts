import { NextRequest, NextResponse } from 'next/server'
import { generateResearchBundleZip } from '@/lib/research-export/bundle-generator'

export async function GET(req: NextRequest) {
  try {
    const zipBuffer = await generateResearchBundleZip()

    return new NextResponse(zipBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="TRIAGE_Research_Bundle.zip"',
        'Content-Length': zipBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to generate research archive bundle' },
      { status: 500 }
    )
  }
}
