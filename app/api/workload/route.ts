import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/server'
import { computeNASATLX } from '@/lib/statistics/descriptive'
import { z } from 'zod'

const WorkloadSchema = z.object({
  session_id: z.string().uuid(),
  method: z.enum(['manual', 'ai_assisted']),
  assessment_level: z.enum(['task', 'block']).default('block'),
  task_id: z.string().uuid().optional(),
  mental_demand: z.number().min(0).max(100),
  physical_demand: z.number().min(0).max(100),
  temporal_demand: z.number().min(0).max(100),
  performance: z.number().min(0).max(100),
  effort: z.number().min(0).max(100),
  frustration: z.number().min(0).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: login diperlukan' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = WorkloadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const raw_score = computeNASATLX({
      mental_demand: parsed.data.mental_demand,
      physical_demand: parsed.data.physical_demand,
      temporal_demand: parsed.data.temporal_demand,
      performance: parsed.data.performance,
      effort: parsed.data.effort,
      frustration: parsed.data.frustration,
    })

    const { data, error } = await supabase
      .from('workload_responses')
      .insert({
        session_id: parsed.data.session_id,
        participant_id: user.id,
        method: parsed.data.method,
        assessment_level: parsed.data.assessment_level,
        task_id: parsed.data.task_id || null,
        mental_demand: parsed.data.mental_demand,
        physical_demand: parsed.data.physical_demand,
        temporal_demand: parsed.data.temporal_demand,
        performance: parsed.data.performance,
        effort: parsed.data.effort,
        frustration: parsed.data.frustration,
        raw_tlx_score: parseFloat(raw_score.toFixed(2)),
        is_finalized: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, raw_score }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
