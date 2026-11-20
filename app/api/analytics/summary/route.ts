import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/server'
import { computeDurationStats, computeAccuracyMetrics, computeCohenKappa } from '@/lib/ai/evaluation'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')
    const phase = searchParams.get('phase')

    // 1. Fetch completed tasks
    let taskQuery = supabase
      .from('triage_tasks')
      .select(`
        id,
        session_id,
        participant_id,
        case_id,
        method,
        duration_seconds,
        completion_status,
        task_submitted_at,
        triage_decisions (*),
        complaint_cases (case_id, complaint_length, case_complexity),
        experiment_sessions (phase, ai_provider, ai_model)
      `)
      .eq('completion_status', 'completed')

    if (sessionId) taskQuery = taskQuery.eq('session_id', sessionId)
    if (phase) taskQuery = taskQuery.eq('experiment_sessions.phase', phase)

    const { data: tasks, error: taskErr } = await taskQuery

    if (taskErr) {
      return NextResponse.json({ error: taskErr.message }, { status: 500 })
    }

    // 2. Fetch all gold standards
    const { data: goldStandards } = await supabase.from('gold_standards').select('*')
    const gsMap = new Map((goldStandards || []).map((gs) => [gs.case_id, gs]))

    // 3. Separate manual vs AI-assisted
    const manualTasks = (tasks || []).filter((t) => t.method === 'manual')
    const aiTasks = (tasks || []).filter((t) => t.method === 'ai_assisted')

    const manualDurations = manualTasks
      .map((t) => Number(t.duration_seconds))
      .filter((d) => !isNaN(d) && d > 0)
    const aiDurations = aiTasks
      .map((t) => Number(t.duration_seconds))
      .filter((d) => !isNaN(d) && d > 0)

    const manualDurationStats = computeDurationStats(manualDurations)
    const aiDurationStats = computeDurationStats(aiDurations)

    // 4. Calculate accuracy
    const manualDecisions = manualTasks
      .map((t) => (t.triage_decisions ? { ...(t.triage_decisions as any), case_id: t.case_id } : null))
      .filter(Boolean)
    const aiDecisions = aiTasks
      .map((t) => (t.triage_decisions ? { ...(t.triage_decisions as any), case_id: t.case_id } : null))
      .filter(Boolean)

    const manualAccuracy = computeAccuracyMetrics(manualDecisions as any, gsMap as any)
    const aiAccuracy = computeAccuracyMetrics(aiDecisions as any, gsMap as any)

    // 5. Revision rate
    const aiRevisedCount = aiDecisions.filter((d: any) => d.any_field_revised).length
    const aiRevisionRate = aiDecisions.length > 0 ? aiRevisedCount / aiDecisions.length : null

    // 6. Overall counts
    const [casesRes, validatedRes, partRes] = await Promise.all([
      supabase.from('complaint_cases').select('*', { count: 'exact', head: true }).eq('is_archived', false),
      supabase.from('complaint_cases').select('*', { count: 'exact', head: true }).eq('validation_status', 'validated'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'participant'),
    ])

    // 7. Workload summary (NASA-TLX)
    const { data: workload } = await supabase.from('workload_responses').select('*')
    const manualTLX = (workload || [])
      .filter((w) => w.method === 'manual' && w.raw_tlx_score !== null)
      .map((w) => Number(w.raw_tlx_score))
    const aiTLX = (workload || [])
      .filter((w) => w.method === 'ai_assisted' && w.raw_tlx_score !== null)
      .map((w) => Number(w.raw_tlx_score))

    const meanManualTLX = manualTLX.length > 0 ? manualTLX.reduce((a, b) => a + b, 0) / manualTLX.length : null
    const meanAiTLX = aiTLX.length > 0 ? aiTLX.reduce((a, b) => a + b, 0) / aiTLX.length : null

    return NextResponse.json({
      summary: {
        total_cases: casesRes.count || 0,
        validated_cases: validatedRes.count || 0,
        total_participants: partRes.count || 0,
        completed_tasks: (tasks || []).length,
        manual_tasks: manualTasks.length,
        ai_assisted_tasks: aiTasks.length,
        manual_duration: manualDurationStats,
        ai_duration: aiDurationStats,
        manual_accuracy: manualAccuracy,
        ai_accuracy: aiAccuracy,
        ai_revision_rate: aiRevisionRate,
        nasa_tlx: {
          manual_mean: meanManualTLX,
          ai_mean: meanAiTLX,
        },
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
