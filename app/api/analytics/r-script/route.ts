import { NextRequest, NextResponse } from 'next/server'
import { generateStandardizedRScript } from '@/lib/statistics/r-script'

export async function GET(req: NextRequest) {
  try {
    const script = generateStandardizedRScript()
    return new NextResponse(script, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="TRIAGE_LMM_Analysis_Script.R"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
