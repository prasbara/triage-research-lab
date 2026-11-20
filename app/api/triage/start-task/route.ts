import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/server'
import { z } from 'zod'

const StartTaskSchema = z.object({
  assignment_id: z.string().uuid(),
  task_started_at: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = StartTaskSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    // Fetch assignment
    const { data: assignment, error: assignErr } = await supabase
      .from('experiment_assignments')
      .select('*')
      .eq('id', parsed.data.assignment_id)
      .single()

    if (assignErr || !assignment) {
      return NextResponse.json({ error: 'Assignment tidak ditemukan' }, { status: 404 })
    }

    // Check if task record already exists
    const { data: existingTask } = await supabase
      .from('triage_tasks')
      .select('id, completion_status')
      .eq('assignment_id', assignment.id)
      .maybeSingle()

    if (existingTask) {
      return NextResponse.json({
        task_id: existingTask.id,
        status: existingTask.completion_status,
      })
    }

    // Create triage task with in_progress status
    const { data: task, error: taskErr } = await supabase
      .from('triage_tasks')
      .insert({
        assignment_id: assignment.id,
        session_id: assignment.session_id,
        participant_id: user.id,
        case_id: assignment.case_id,
        task_order: assignment.task_order,
        method: assignment.method,
        task_started_at: parsed.data.task_started_at,
        completion_status: 'in_progress',
      })
      .select()
      .single()

    if (taskErr) {
      return NextResponse.json({ error: taskErr.message }, { status: 500 })
    }

    return NextResponse.json({ task_id: task.id, status: 'in_progress' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
