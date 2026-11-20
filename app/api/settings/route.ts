import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/database/server'
import { SUPPORTED_MODELS } from '@/lib/ai/provider'

export async function GET() {
  try {
    const supabase = await createAdminClient()

    // Fetch active project
    const { data: project } = await supabase
      .from('research_projects')
      .select('*')
      .limit(1)
      .single()

    // Fetch active SOP version
    const { data: activeSop } = await supabase
      .from('sop_versions')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    // Fetch taxonomies
    const [categoriesRes, prioritiesRes, unitsRes] = await Promise.all([
      supabase.from('complaint_categories').select('id, code, name, description').order('code'),
      supabase.from('priority_levels').select('id, code, name, color, max_response_time_minutes').order('code'),
      supabase.from('hospital_units').select('id, code, name, description').order('code'),
    ])

    return NextResponse.json({
      project: project || {
        name: 'TRIAGE Research Lab',
        description: 'Efektivitas LLM dalam Triase Keluhan Pasien',
        status: 'active',
      },
      sop: activeSop || {
        version: '1.0',
        title: 'Pedoman Triase Keluhan Pasien RS v1.0',
      },
      taxonomies: {
        categories: categoriesRes.data || [],
        priorities: prioritiesRes.data || [],
        units: unitsRes.data || [],
      },
      ai_config: {
        nvidia_model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b',
        gemini_model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        supported_models: SUPPORTED_MODELS,
        active_keys: {
          nvidia_primary: !!process.env.NVIDIA_API_KEY,
          nvidia_rerank: !!process.env.NVIDIA_KEY_RERANK,
          nvidia_protein: !!process.env.NVIDIA_KEY_PROTEIN,
          gemini_primary: !!process.env.GEMINI_API_KEY,
          gemini_backup: !!process.env.GEMINI_API_KEY_BACKUP,
        },
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = await createAdminClient()

    if (body.action === 'update_project' && body.project_id) {
      const { data, error } = await supabase
        .from('research_projects')
        .update({
          name: body.name,
          description: body.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.project_id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, project: data })
    }

    return NextResponse.json({ error: 'Aksi tidak didukung' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
