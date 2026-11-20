import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('complaint_cases')
      .select('*, expert_assessments(*), gold_standards(*)')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Kasus keluhan tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await req.json()
    const allowed = [
      'complaint_text',
      'complaint_source_type',
      'case_complexity',
      'source_type',
      'notes',
      'validation_status',
      'is_archived',
    ]
    const updateData: Record<string, any> = {}
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }

    const { data, error } = await supabase
      .from('complaint_cases')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (user) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'update_complaint_case',
        resource_type: 'complaint_cases',
        resource_id: id,
        new_values: updateData,
      })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Soft delete (archive)
    const { data, error } = await supabase
      .from('complaint_cases')
      .update({ is_archived: true })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (user) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'archive_complaint_case',
        resource_type: 'complaint_cases',
        resource_id: id,
      })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
