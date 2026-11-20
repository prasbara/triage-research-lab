import { createServerSupabaseClient } from '@/lib/database/server'
import { AppShell } from '@/components/layout/app-shell'
import { ValidationClient } from './validation-client'

export const dynamic = 'force-dynamic'

export default async function ValidationPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch pending or unvalidated cases
  const { data: cases } = await supabase
    .from('complaint_cases')
    .select('*, expert_assessments(*), gold_standards(*)')
    .eq('is_archived', false)
    .order('case_id')

  // Fetch taxonomy
  const [categoriesRes, prioritiesRes, unitsRes] = await Promise.all([
    supabase.from('complaint_categories').select('name').eq('is_active', true),
    supabase.from('priority_levels').select('name').eq('is_active', true),
    supabase.from('hospital_units').select('name').eq('is_active', true),
  ])

  return (
    <AppShell>
      <ValidationClient
        cases={cases || []}
        categories={categoriesRes.data?.map((c) => c.name) || []}
        priorities={prioritiesRes.data?.map((p) => p.name) || []}
        units={unitsRes.data?.map((u) => u.name) || []}
      />
    </AppShell>
  )
}
