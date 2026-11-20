import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/database/server'
import { convertToCSV } from '@/lib/utils/export'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'summary'
    const format = searchParams.get('format') || 'json'
    const sessionId = searchParams.get('session_id')

    const supabase = await createAdminClient()

    let dataset: any[] = []
    let filename = `triage-report-${type}-${Date.now()}`

    switch (type) {
      case 'complaints': {
        const { data, error } = await supabase
          .from('complaint_cases')
          .select(`
            id, case_code, complaint_text, date_received, channel, patient_type,
            category:complaint_categories(name),
            priority:priority_levels(name),
            unit:hospital_units(name),
            validation_status, is_gold_standard
          `)
          .order('case_code')
        if (error) throw error
        dataset = (data || []).map((c: any) => ({
          id: c.id,
          case_code: c.case_code,
          text: c.complaint_text,
          date_received: c.date_received,
          channel: c.channel,
          patient_type: c.patient_type,
          category: c.category?.name || 'Unassigned',
          priority: c.priority?.name || 'Unassigned',
          unit: c.unit?.name || 'Unassigned',
          validation_status: c.validation_status,
          is_gold_standard: c.is_gold_standard,
        }))
        break
      }

      case 'decisions': {
        let query = supabase
          .from('triage_decisions')
          .select(`
            id, task_id, method, duration_seconds, confidence_score, is_correct,
            hitl_modified, created_at,
            task:triage_tasks(participant_id, case_id)
          `)
          .order('created_at', { ascending: false })
        
        const { data, error } = await query
        if (error) throw error
        dataset = (data || []).map((d: any) => ({
          decision_id: d.id,
          task_id: d.task_id,
          participant_id: d.task?.participant_id,
          case_id: d.task?.case_id,
          method: d.method,
          duration_seconds: d.duration_seconds,
          confidence_score: d.confidence_score,
          is_correct: d.is_correct,
          hitl_modified: d.hitl_modified,
          timestamp: d.created_at,
        }))
        break
      }

      case 'revisions': {
        const { data, error } = await supabase
          .from('decision_revisions')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        dataset = data || []
        break
      }

      case 'workload': {
        const { data, error } = await supabase
          .from('workload_responses')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        dataset = data || []
        break
      }

      case 'audit': {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(500)
        if (error) throw error
        dataset = data || []
        break
      }

      default: {
        // Summary metrics
        const [complaintsCount, tasksCount, decisionsCount, participantsCount] = await Promise.all([
          supabase.from('complaint_cases').select('id', { count: 'exact', head: true }),
          supabase.from('triage_tasks').select('id', { count: 'exact', head: true }),
          supabase.from('triage_decisions').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
        ])

        return NextResponse.json({
          report: 'TRIAGE Research Lab - System Summary',
          generated_at: new Date().toISOString(),
          metrics: {
            total_cases: complaintsCount.count || 0,
            total_tasks: tasksCount.count || 0,
            total_decisions: decisionsCount.count || 0,
            total_participants: participantsCount.count || 0,
          },
          supported_exports: ['complaints', 'decisions', 'revisions', 'workload', 'audit'],
        })
      }
    }

    if (format === 'csv') {
      const csv = convertToCSV(dataset)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}.csv"`,
        },
      })
    }

    return NextResponse.json({
      type,
      total_records: dataset.length,
      data: dataset,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
