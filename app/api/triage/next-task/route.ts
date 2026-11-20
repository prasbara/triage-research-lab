import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: login diperlukan' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const method = searchParams.get('method') as 'manual' | 'ai_assisted' | null
    const sessionId = searchParams.get('session_id')

    let query = supabase
      .from('experiment_assignments')
      .select(`
        id,
        session_id,
        participant_id,
        case_id,
        task_order,
        method,
        condition_block,
        is_completed,
        complaint_cases (
          id,
          case_id,
          complaint_text,
          complaint_source_type,
          case_complexity,
          source_type
        ),
        experiment_sessions (
          id,
          session_code,
          name,
          ai_provider,
          ai_model,
          prompt_version
        )
      `)
      .eq('participant_id', user.id)
      .eq('is_completed', false)
      .order('task_order', { ascending: true })
      .limit(1)

    if (method) query = query.eq('method', method)
    if (sessionId) query = query.eq('session_id', sessionId)

    const { data, error } = await query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      // Check total tasks for stats
      const { count: totalTasks } = await supabase
        .from('experiment_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('participant_id', user.id)

      return NextResponse.json({
        task: null,
        message: 'Tidak ada tugas yang tersisa untuk kondisi ini.',
        total_assigned: totalTasks || 0,
      })
    }

    // Get taxonomy values for form selection
    const [categoriesRes, prioritiesRes, unitsRes] = await Promise.all([
      supabase.from('complaint_categories').select('code, name, name_id').eq('is_active', true).order('sort_order'),
      supabase.from('priority_levels').select('code, name, name_id, level, is_high_priority').eq('is_active', true).order('level'),
      supabase.from('hospital_units').select('code, name, name_id').eq('is_active', true).order('sort_order'),
    ])

    return NextResponse.json({
      task: data[0],
      taxonomy: {
        categories: categoriesRes.data || [],
        priorities: prioritiesRes.data || [],
        units: unitsRes.data || [],
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
