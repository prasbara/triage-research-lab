import { createServerSupabaseClient } from '@/lib/database/server'
import { AppShell } from '@/components/layout/app-shell'
import { AnalyticsClient } from './analytics-client'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch summary data directly on server
  let summary = null
  try {
    const { data: tasks } = await supabase
      .from('triage_tasks')
      .select('*, triage_decisions(*), complaint_cases(case_id)')
      .eq('completion_status', 'completed')

    const { data: goldStandards } = await supabase.from('gold_standards').select('*')
    const gsMap = new Map((goldStandards || []).map((gs) => [gs.case_id, gs]))

    const manual = (tasks || []).filter((t) => t.method === 'manual')
    const ai = (tasks || []).filter((t) => t.method === 'ai_assisted')

    const manualDurations = manual.map((t) => Number(t.duration_seconds)).filter((d) => d > 0)
    const aiDurations = ai.map((t) => Number(t.duration_seconds)).filter((d) => d > 0)

    const avgManual = manualDurations.length > 0 ? manualDurations.reduce((a, b) => a + b, 0) / manualDurations.length : 0
    const avgAI = aiDurations.length > 0 ? aiDurations.reduce((a, b) => a + b, 0) / aiDurations.length : 0

    // Accuracy
    let manualMatches = 0
    let aiMatches = 0
    manual.forEach((t) => {
      const gs = gsMap.get(t.case_id)
      if (gs && t.triage_decisions && t.triage_decisions.final_category === gs.category) manualMatches++
    })
    ai.forEach((t) => {
      const gs = gsMap.get(t.case_id)
      if (gs && t.triage_decisions && t.triage_decisions.final_category === gs.category) aiMatches++
    })

    summary = {
      manualCount: manual.length,
      aiCount: ai.length,
      avgManualDuration: avgManual,
      avgAIDuration: avgAI,
      manualAccuracy: manual.length > 0 ? manualMatches / manual.length : 0,
      aiAccuracy: ai.length > 0 ? aiMatches / ai.length : 0,
      timeSavedPercent: avgManual > 0 ? ((avgManual - avgAI) / avgManual) * 100 : 0,
    }
  } catch {}

  return (
    <AppShell>
      <AnalyticsClient initialSummary={summary} />
    </AppShell>
  )
}
