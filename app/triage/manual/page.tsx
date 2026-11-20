import { createServerSupabaseClient } from '@/lib/database/server'
import { AppShell } from '@/components/layout/app-shell'
import { ManualTriageClient } from './manual-client'

export const dynamic = 'force-dynamic'

export default async function ManualTriagePage() {
  const supabase = await createServerSupabaseClient()

  // Fetch active taxonomy options
  const [categoriesRes, prioritiesRes, unitsRes] = await Promise.all([
    supabase.from('complaint_categories').select('name, code').eq('is_active', true).order('sort_order'),
    supabase.from('priority_levels').select('name, code, level, is_high_priority').eq('is_active', true).order('level'),
    supabase.from('hospital_units').select('name, code').eq('is_active', true).order('sort_order'),
  ])

  return (
    <AppShell>
      <ManualTriageClient
        categories={categoriesRes.data?.map((c) => c.name) || []}
        priorities={prioritiesRes.data?.map((p) => p.name) || []}
        units={unitsRes.data?.map((u) => u.name) || []}
      />
    </AppShell>
  )
}
