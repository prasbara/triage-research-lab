import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/server'
import { generateSessionCode } from '@/lib/utils'
import { generateExperimentAssignments } from '@/lib/experiments/randomization'
import { z } from 'zod'

const SessionSchema = z.object({
  name: z.string().min(1, 'Nama sesi wajib diisi'),
  description: z.string().optional(),
  phase: z.enum(['setup', 'pilot', 'main']),
  ai_provider: z.enum(['nvidia', 'gemini']),
  ai_model: z.string().min(1, 'Model AI wajib dipilih'),
  ai_temperature: z.number().min(0).max(1).default(0.1),
  ai_max_tokens: z.number().int().min(100).max(4096).default(2048),
  random_seed: z.number().int().optional(),
  case_ids: z.array(z.string()).min(1, 'Pilih minimal satu kasus keluhan'),
  participant_ids: z.array(z.string()).min(1, 'Pilih minimal satu partisipan'),
})

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('experiment_sessions')
      .select('*, session_participants(count), experiment_assignments(count)')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await req.json()
    const parsed = SessionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { case_ids, participant_ids, ...sessionData } = parsed.data
    const seed = sessionData.random_seed || Math.floor(Math.random() * 900000) + 100000

    // Fetch active project
    const { data: project } = await supabase
      .from('research_projects')
      .select('id')
      .eq('is_active', true)
      .maybeSingle()

    // 1. Create session
    const { data: session, error: sessionErr } = await supabase
      .from('experiment_sessions')
      .insert({
        ...sessionData,
        session_code: generateSessionCode(),
        project_id: project?.id || null,
        random_seed: seed,
        number_of_cases: case_ids.length,
        prompt_version: '1.0.0',
        created_by: user?.id || null,
      })
      .select()
      .single()

    if (sessionErr) {
      return NextResponse.json({ error: sessionErr.message }, { status: 500 })
    }

    // 2. Add participants to session
    if (participant_ids.length > 0) {
      await supabase.from('session_participants').insert(
        participant_ids.map((pid) => ({
          session_id: session.id,
          participant_id: pid,
        }))
      )
    }

    // 3. Generate randomized allocations (counterbalanced)
    const assignments = generateExperimentAssignments({
      cases: case_ids,
      participants: participant_ids,
      seed,
    })

    // 4. Insert assignments into DB
    if (assignments.length > 0) {
      const { error: assignErr } = await supabase.from('experiment_assignments').insert(
        assignments.map((a) => ({
          session_id: session.id,
          participant_id: a.participant_id,
          case_id: a.case_id,
          task_order: a.task_order,
          method: a.method,
          condition_block: a.condition_block,
          is_completed: false,
        }))
      )

      if (assignErr) {
        return NextResponse.json({ error: assignErr.message }, { status: 500 })
      }
    }

    if (user) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'create_experiment_session',
        resource_type: 'experiment_sessions',
        resource_id: session.id,
        new_values: { session_code: session.session_code, seed, tasks: assignments.length },
      })
    }

    return NextResponse.json({ data: session, assignments_count: assignments.length }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
