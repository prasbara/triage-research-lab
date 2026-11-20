import { createServerSupabaseClient } from '@/lib/database/server'
import { AppShell } from '@/components/layout/app-shell'
import { SettingsClient } from './settings-client'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch project settings and taxonomy
  const [projectRes, categoriesRes, prioritiesRes, unitsRes] = await Promise.all([
    supabase.from('research_projects').select('*').eq('is_active', true).maybeSingle(),
    supabase.from('complaint_categories').select('*').order('sort_order'),
    supabase.from('priority_levels').select('*').order('level'),
    supabase.from('hospital_units').select('*').order('sort_order'),
  ])

  return (
    <AppShell>
      <SettingsClient
        project={projectRes.data}
        categories={categoriesRes.data || []}
        priorities={prioritiesRes.data || []}
        units={unitsRes.data || []}
      />
    </AppShell>
  )
}
