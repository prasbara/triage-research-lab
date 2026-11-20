import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/server'
import { z } from 'zod'

const DecisionSchema = z.object({
  assignment_id: z.string().uuid(),
  task_id: z.string().uuid().optional(),
  method: z.enum(['manual', 'ai_assisted']),
  final_category: z.string().min(1, 'Kategori wajib dipilih'),
  final_subcategory: z.string().optional(),
  final_priority: z.string().min(1, 'Prioritas wajib dipilih'),
  final_target_unit: z.string().min(1, 'Unit tujuan wajib dipilih'),
  final_escalation_required: z.boolean(),
  reasoning: z.string().optional(),
  task_started_at: z.string(),
  // AI fields (only when method == ai_assisted)
  inference_id: z.string().uuid().optional(),
  ai_recommendation_accepted: z.boolean().optional(),
  revisions: z
    .array(
      z.object({
        field_name: z.string(),
        ai_value: z.string().nullable(),
        final_value: z.string().nullable(),
        revision_reason: z.string().optional(),
      })
    )
    .optional(),
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: login diperlukan' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = DecisionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const submissionTime = new Date()
    const startTime = new Date(parsed.data.task_started_at)
    const duration_seconds = Math.max(0.1, (submissionTime.getTime() - startTime.getTime()) / 1000)

    // Check duplicate completed task
    const { data: existingTask } = await supabase
      .from('triage_tasks')
      .select('id, completion_status')
      .eq('assignment_id', parsed.data.assignment_id)
      .eq('completion_status', 'completed')
      .maybeSingle()

    if (existingTask) {
      return NextResponse.json(
        { error: 'Tugas ini sudah diselesaikan sebelumnya (duplikasi ditolak).' },
        { status: 409 }
      )
    }

    // Get assignment details
    const { data: assignment, error: assignErr } = await supabase
      .from('experiment_assignments')
      .select('*, experiment_sessions(*)')
      .eq('id', parsed.data.assignment_id)
      .single()

    if (assignErr || !assignment) {
      return NextResponse.json({ error: 'Assignment tidak ditemukan' }, { status: 404 })
    }

    if (assignment.participant_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden: bukan penugasan Anda' }, { status: 403 })
    }

    // 1. Upsert triage_task with final timings
    const taskUpsertData: any = {
      assignment_id: assignment.id,
      session_id: assignment.session_id,
      participant_id: user.id,
      case_id: assignment.case_id,
      task_order: assignment.task_order,
      method: parsed.data.method,
      task_started_at: parsed.data.task_started_at,
      task_submitted_at: submissionTime.toISOString(),
      duration_seconds: parseFloat(duration_seconds.toFixed(3)),
      completion_status: 'completed',
    }

    if (parsed.data.task_id) {
      taskUpsertData.id = parsed.data.task_id
    }

    const { data: task, error: taskErr } = await supabase
      .from('triage_tasks')
      .upsert(taskUpsertData)
      .select()
      .single()

    if (taskErr) {
      return NextResponse.json({ error: taskErr.message }, { status: 500 })
    }

    // 2. Fetch gold standard to calculate accuracy match
    const { data: goldStandard } = await supabase
      .from('gold_standards')
      .select('*')
      .eq('case_id', assignment.case_id)
      .maybeSingle()

    const gsCategoryMatch = goldStandard ? goldStandard.category === parsed.data.final_category : null
    const gsPriorityMatch = goldStandard ? goldStandard.priority === parsed.data.final_priority : null
    const gsUnitMatch = goldStandard ? goldStandard.target_unit === parsed.data.final_target_unit : null
    const gsEscalationMatch = goldStandard ? goldStandard.escalation_required === parsed.data.final_escalation_required : null

    // 3. Insert triage_decisions
    const anyFieldRevised = (parsed.data.revisions?.length || 0) > 0
    const { data: decision, error: decErr } = await supabase
      .from('triage_decisions')
      .insert({
        task_id: task.id,
        inference_id: parsed.data.inference_id || null,
        final_category: parsed.data.final_category,
        final_subcategory: parsed.data.final_subcategory || null,
        final_priority: parsed.data.final_priority,
        final_target_unit: parsed.data.final_target_unit,
        final_escalation_required: parsed.data.final_escalation_required,
        reasoning: parsed.data.reasoning || null,
        ai_recommendation_accepted: parsed.data.ai_recommendation_accepted ?? null,
        any_field_revised: anyFieldRevised,
        gs_category_match: gsCategoryMatch,
        gs_priority_match: gsPriorityMatch,
        gs_unit_match: gsUnitMatch,
        gs_escalation_match: gsEscalationMatch,
      })
      .select()
      .single()

    if (decErr) {
      return NextResponse.json({ error: decErr.message }, { status: 500 })
    }

    // 4. Record human-in-the-loop revisions
    if (parsed.data.revisions && parsed.data.revisions.length > 0) {
      await supabase.from('decision_revisions').insert(
        parsed.data.revisions.map((r) => ({
          task_id: task.id,
          decision_id: decision.id,
          field_name: r.field_name,
          ai_value: r.ai_value,
          final_value: r.final_value,
          revision_reason: r.revision_reason || null,
        }))
      )
    }

    // 5. Mark assignment as completed
    await supabase
      .from('experiment_assignments')
      .update({ is_completed: true })
      .eq('id', assignment.id)

    // 6. Audit log
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'submit_triage_decision',
      resource_type: 'triage_decisions',
      resource_id: decision.id,
      new_values: {
        method: parsed.data.method,
        duration_seconds,
        revised: anyFieldRevised,
      },
    })

    return NextResponse.json(
      {
        task,
        decision,
        duration_seconds,
        accuracy_evaluated: !!goldStandard,
      },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
