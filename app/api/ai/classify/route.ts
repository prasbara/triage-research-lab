import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/server'
import { classifyWithProvider } from '@/lib/ai/provider'
import { PROMPT_VERSION } from '@/lib/ai/prompt'
import { z } from 'zod'

const ClassifySchema = z.object({
  case_id: z.string(),
  complaint_text: z.string().min(1, 'Teks keluhan tidak boleh kosong'),
  provider: z.enum(['nvidia', 'gemini']),
  model: z.string().optional(),
  session_id: z.string().uuid().optional(),
  task_id: z.string().uuid().optional(),
  available_categories: z.array(z.string()).default([]),
  available_priorities: z.array(z.string()).default([]),
  available_units: z.array(z.string()).default([]),
  sop_context: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await req.json()
    const parsed = ClassifySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    // If categories/priorities/units not supplied in request, fetch active ones from DB
    let categories = parsed.data.available_categories
    let priorities = parsed.data.available_priorities
    let units = parsed.data.available_units

    if (categories.length === 0 || priorities.length === 0 || units.length === 0) {
      const [catRes, prioRes, unitRes] = await Promise.all([
        supabase.from('complaint_categories').select('name').eq('is_active', true),
        supabase.from('priority_levels').select('name').eq('is_active', true),
        supabase.from('hospital_units').select('name').eq('is_active', true),
      ])
      if (categories.length === 0 && catRes.data) categories = catRes.data.map((c) => c.name)
      if (priorities.length === 0 && prioRes.data) priorities = prioRes.data.map((p) => p.name)
      if (units.length === 0 && unitRes.data) units = unitRes.data.map((u) => u.name)
    }

    // Default fallbacks if DB is completely fresh
    if (categories.length === 0) {
      categories = [
        'Administrasi & Pendaftaran',
        'Komunikasi & Informasi Petugas',
        'Sikap & Perilaku Staf Medis',
        'Fasilitas & Sarana Prasarana',
        'Waktu Tunggu & Alur Pelayanan',
        'Keselamatan Pasien & Klinis',
      ]
    }
    if (priorities.length === 0) {
      priorities = ['Rutin', 'Sedang', 'Tinggi / Urgent', 'Kritis / Emergency']
    }
    if (units.length === 0) {
      units = [
        'Bagian Pendaftaran & Admisi',
        'Instalasi Rawat Jalan (Poliklinik)',
        'Instalasi Farmasi',
        'Instalasi Radiologi / Laboratorium',
        'Instalasi Gawat Darurat (IGD)',
        'Customer Care / Humas',
        'Bagian Keuangan / Kasir',
      ]
    }

    const requestTimestamp = new Date().toISOString()

    // Execute real LLM inference using selected provider and model
    const result = await classifyWithProvider(
      parsed.data.provider,
      {
        complaint_text: parsed.data.complaint_text,
        case_id: parsed.data.case_id,
        available_categories: categories,
        available_priorities: priorities,
        available_units: units,
        sop_context: parsed.data.sop_context,
      },
      {
        model: parsed.data.model,
      }
    )

    const responseTimestamp = new Date().toISOString()

    const activeModel =
      parsed.data.model ||
      (parsed.data.provider === 'nvidia'
        ? process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b'
        : process.env.GEMINI_MODEL || 'gemini-2.5-flash')

    // Persist inference audit record to Supabase
    let inferenceId: string | undefined
    try {
      const { data: inference } = await supabase
        .from('ai_inferences')
        .insert({
          task_id: parsed.data.task_id || null,
          session_id: parsed.data.session_id || null,
          case_id: parsed.data.case_id.length === 36 ? parsed.data.case_id : null,
          provider: parsed.data.provider,
          model: activeModel,
          prompt_version: PROMPT_VERSION,
          prompt_hash: result.prompt_hash,
          request_timestamp: requestTimestamp,
          response_timestamp: responseTimestamp,
          latency_ms: result.latency_ms,
          prompt_tokens: result.prompt_tokens || null,
          completion_tokens: result.completion_tokens || null,
          total_tokens: result.total_tokens || null,
          raw_response: result.raw_response,
          parsed_response: result.result as any,
          validation_status: result.validation_status,
          error_message: result.error || null,
          ai_category: result.result?.category || null,
          ai_subcategory: result.result?.subcategory || null,
          ai_priority: result.result?.priority || null,
          ai_target_unit: result.result?.target_unit || null,
          ai_escalation_required: result.result?.escalation_required || false,
          ai_reasoning: result.result?.reasoning || null,
          ai_sop_reference: result.result?.sop_reference || null,
          ai_requires_human_review: result.result?.requires_human_review || false,
        })
        .select('id')
        .single()

      inferenceId = inference?.id
    } catch {
      // Continue even if logging fails
    }

    if (result.validation_status !== 'valid' || !result.result) {
      return NextResponse.json(
        {
          error: result.error || 'Klasifikasi AI gagal menghasilkan struktur output yang valid',
          validation_status: result.validation_status,
          latency_ms: result.latency_ms,
          raw_response: result.raw_response,
          inference_id: inferenceId,
        },
        { status: 422 }
      )
    }

    return NextResponse.json({
      recommendation: result.result,
      inference_id: inferenceId,
      latency_ms: result.latency_ms,
      tokens: {
        prompt: result.prompt_tokens,
        completion: result.completion_tokens,
        total: result.total_tokens,
      },
      provider: parsed.data.provider,
      model: activeModel,
      prompt_hash: result.prompt_hash,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
