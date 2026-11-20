import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/server'
import Papa from 'papaparse'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'File CSV tidak ditemukan' }, { status: 400 })
    }

    const text = await file.text()
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true })

    if (parsed.errors.length > 0 && parsed.data.length === 0) {
      return NextResponse.json(
        { error: `Gagal memproses file CSV: ${parsed.errors[0].message}` },
        { status: 400 }
      )
    }

    const rows = parsed.data as any[]
    let importedCount = 0
    let skippedCount = 0
    const errors: string[] = []

    // Fetch active project
    const { data: project } = await supabase
      .from('research_projects')
      .select('id')
      .eq('is_active', true)
      .maybeSingle()

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const case_id = row.case_id || row['ID Kasus'] || `CASE-${Date.now()}-${i + 1}`
      const complaint_text = row.complaint_text || row['Keluhan'] || row['Teks Keluhan']

      if (!complaint_text || complaint_text.trim().length < 5) {
        skippedCount++
        errors.push(`Baris ${i + 2}: Teks keluhan kosong atau terlalu pendek.`)
        continue
      }

      // Check duplicate
      const { data: existing } = await supabase
        .from('complaint_cases')
        .select('id')
        .eq('case_id', case_id.trim())
        .maybeSingle()

      if (existing) {
        skippedCount++
        errors.push(`Baris ${i + 2}: Case ID "${case_id}" sudah terdaftar.`)
        continue
      }

      const complexity = ['simple', 'moderate', 'complex'].includes(row.case_complexity)
        ? row.case_complexity
        : 'moderate'
      const sourceType = ['real_deidentified', 'synthetic'].includes(row.source_type)
        ? row.source_type
        : 'synthetic'

      const { error: insertErr } = await supabase.from('complaint_cases').insert({
        case_id: case_id.trim(),
        complaint_text: complaint_text.trim(),
        case_complexity: complexity,
        source_type: sourceType,
        complaint_source_type: row.complaint_source_type || 'written',
        notes: row.notes || null,
        validation_status: 'pending',
        project_id: project?.id || null,
        created_by: user?.id || null,
      })

      if (insertErr) {
        skippedCount++
        errors.push(`Baris ${i + 2}: ${insertErr.message}`)
      } else {
        importedCount++
      }
    }

    if (user && importedCount > 0) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'import_csv_complaints',
        resource_type: 'complaint_cases',
        new_values: { imported: importedCount, skipped: skippedCount },
      })
    }

    return NextResponse.json({
      imported: importedCount,
      skipped: skippedCount,
      total_rows: rows.length,
      errors: errors.slice(0, 10), // return top 10 errors
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
