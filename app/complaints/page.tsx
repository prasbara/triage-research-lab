import { createServerSupabaseClient } from '@/lib/database/server'
import { AppShell } from '@/components/layout/app-shell'
import { ComplaintsClient } from './complaints-client'

export const dynamic = 'force-dynamic'

export default async function ComplaintsPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch initial complaint cases
  const { data: cases, count } = await supabase
    .from('complaint_cases')
    .select('*', { count: 'exact' })
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
    .range(0, 19)

  // Fetch active categories and priorities for filter
  const [categoriesRes, prioritiesRes] = await Promise.all([
    supabase.from('complaint_categories').select('name').eq('is_active', true),
    supabase.from('priority_levels').select('name, is_high_priority').eq('is_active', true),
  ])

  return (
    <AppShell>
      <ComplaintsClient
        initialCases={cases || []}
        totalCount={count || 0}
        categories={categoriesRes.data?.map((c) => c.name) || []}
        priorities={prioritiesRes.data?.map((p) => p.name) || []}
      />
    </AppShell>
  )
}
