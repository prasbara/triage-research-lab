import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/server'
import { z } from 'zod'

const ComplaintSchema = z.object({
  case_id: z.string().min(1, 'Case ID wajib diisi'),
  complaint_text: z.string().min(10, 'Teks keluhan minimal 10 karakter'),
  complaint_source_type: z.enum(['written', 'verbal', 'online', 'phone', 'other']).optional(),
  case_complexity: z.enum(['simple', 'moderate', 'complex']).optional(),
  source_type: z.enum(['real_deidentified', 'synthetic']).default('synthetic'),
  notes: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const complexity = searchParams.get('complexity') || ''
    const source = searchParams.get('source') || ''

    let query = supabase
      .from('complaint_cases')
      .select('*', { count: 'exact' })
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1)

    if (search) query = query.ilike('complaint_text', `%${search}%`)
    if (status) query = query.eq('validation_status', status)
    if (complexity) query = query.eq('case_complexity', complexity)
    if (source) query = query.eq('source_type', source)

    const { data, count, error } = await query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await req.json()
    const parsed = ComplaintSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    // Check duplicate case_id
    const { data: existing } = await supabase
      .from('complaint_cases')
      .select('id')
      .eq('case_id', parsed.data.case_id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: `Case ID "${parsed.data.case_id}" sudah terdaftar dalam sistem.` },
        { status: 409 }
      )
    }

    // Get active project
    const { data: project } = await supabase
      .from('research_projects')
      .select('id')
      .eq('is_active', true)
      .maybeSingle()

    const insertData: any = {
      ...parsed.data,
      project_id: project?.id || null,
      created_by: user?.id || null,
      validation_status: 'pending',
    }

    const { data, error } = await supabase
      .from('complaint_cases')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Audit log
    if (user) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'create_complaint_case',
        resource_type: 'complaint_cases',
        resource_id: data.id,
        new_values: parsed.data,
      })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
