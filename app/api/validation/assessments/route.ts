import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/server'
import { computeCohenKappa } from '@/lib/ai/evaluation'
import { z } from 'zod'

const AssessmentSchema = z.object({
  case_id: z.string().uuid(),
  category: z.string().min(1, 'Kategori wajib diisi'),
  subcategory: z.string().optional(),
  priority: z.string().min(1, 'Prioritas wajib diisi'),
  target_unit: z.string().min(1, 'Unit tujuan wajib diisi'),
  escalation_required: z.boolean(),
  reasoning: z.string().min(1, 'Alasan pertimbangan wajib diisi'),
  confidence_level: z.enum(['low', 'medium', 'high']).default('high'),
})

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(req.url)
    const caseId = searchParams.get('case_id')

    let query = supabase
      .from('expert_assessments')
      .select('*, profiles(full_name, role)')
      .order('created_at', { ascending: false })

    if (caseId) query = query.eq('case_id', caseId)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: login diperlukan' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = AssessmentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    // Insert or update expert assessment
    const { data: assessment, error: assessErr } = await supabase
      .from('expert_assessments')
      .upsert({
        case_id: parsed.data.case_id,
        expert_id: user.id,
        assessment_round: 1,
        category: parsed.data.category,
        subcategory: parsed.data.subcategory || null,
        priority: parsed.data.priority,
        target_unit: parsed.data.target_unit,
        escalation_required: parsed.data.escalation_required,
        reasoning: parsed.data.reasoning,
        confidence_level: parsed.data.confidence_level,
        is_submitted: true,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (assessErr) {
      return NextResponse.json({ error: assessErr.message }, { status: 500 })
    }

    // Check if 2 experts have reviewed this case
    const { data: allAssessments } = await supabase
      .from('expert_assessments')
      .select('*')
      .eq('case_id', parsed.data.case_id)
      .eq('is_submitted', true)

    if (allAssessments && allAssessments.length >= 2) {
      const exp1 = allAssessments[0]
      const exp2 = allAssessments[1]

      const categoriesAgree = exp1.category === exp2.category
      const prioritiesAgree = exp1.priority === exp2.priority
      const unitsAgree = exp1.target_unit === exp2.target_unit
      const escalationAgree = exp1.escalation_required === exp2.escalation_required

      const fullAgreement = categoriesAgree && prioritiesAgree && unitsAgree && escalationAgree

      if (fullAgreement) {
        // Auto-create Gold Standard if agreed
        await supabase.from('gold_standards').upsert({
          case_id: parsed.data.case_id,
          category: exp1.category,
          subcategory: exp1.subcategory,
          priority: exp1.priority,
          target_unit: exp1.target_unit,
          escalation_required: exp1.escalation_required,
          high_priority_flag: exp1.priority?.toLowerCase().includes('tinggi') || exp1.priority?.toLowerCase().includes('kritis') || exp1.escalation_required,
          agreement_status: 'agreed',
          expert1_id: exp1.expert_id,
          expert2_id: exp2.expert_id,
          is_locked: true,
        })

        // Update case status to validated
        await supabase
          .from('complaint_cases')
          .update({ validation_status: 'validated' })
          .eq('id', parsed.data.case_id)
      } else {
        // Disagreement: Mark case for adjudication
        await supabase
          .from('complaint_cases')
          .update({ validation_status: 'in_review' })
          .eq('id', parsed.data.case_id)
      }
    }

    return NextResponse.json({ data: assessment }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
