import { createServerSupabaseClient } from '@/lib/database/server'
import { AppShell } from '@/components/layout/app-shell'
import { ReportsClient } from './reports-client'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const supabase = await createServerSupabaseClient()

  const [
    { count: totalCases },
    { count: completedTasks },
    { count: totalSessions },
  ] = await Promise.all([
    supabase.from('complaint_cases').select('*', { count: 'exact', head: true }).eq('is_archived', false),
    supabase.from('triage_tasks').select('*', { count: 'exact', head: true }).eq('completion_status', 'completed'),
    supabase.from('experiment_sessions').select('*', { count: 'exact', head: true }),
  ])

  return (
    <AppShell>
      <ReportsClient
        stats={{
          cases: totalCases || 0,
          tasks: completedTasks || 0,
          sessions: totalSessions || 0,
        }}
      />
    </AppShell>
  )
}
