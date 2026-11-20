import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/server'
import { z } from 'zod'

const AdjudicateSchema = z.object({
  case_id: z.string().uuid(),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  priority: z.string().min(1, 'Prioritas wajib dipilih'),
  target_unit: z.string().optional(),
  rationale: z.string().min(1, 'Notulensi pertimbangan adjudikasi wajib diisi'),
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: login diperlukan' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = AdjudicateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    // 1. Upsert to gold_standards with agreement_status = 'adjudicated'
    const { data: goldStandard, error: gsError } = await supabase
      .from('gold_standards')
      .upsert(
        {
          case_id: parsed.data.case_id,
          category: parsed.data.category,
          priority: parsed.data.priority,
          target_unit: parsed.data.target_unit || 'Umum',
          agreement_status: 'adjudicated',
          adjudicator_id: user.id,
          adjudication_notes: parsed.data.rationale,
          verified_at: new Date().toISOString(),
        },
        { onConflict: 'case_id' }
      )
      .select()
      .single()

    if (gsError) {
      return NextResponse.json({ error: gsError.message }, { status: 500 })
    }

    // 2. Mark complaint case as validated
    await supabase
      .from('complaint_cases')
      .update({
        validation_status: 'validated',
        validated_at: new Date().toISOString(),
        validated_by: user.id,
      })
      .eq('id', parsed.data.case_id)

    return NextResponse.json({
      success: true,
      data: goldStandard,
      message: 'Adjudikasi konsensus berhasil dicatat ke dalam audit trail Standar Emas.',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
