import { createServerSupabaseClient } from '@/lib/database/server'
import { AppShell } from '@/components/layout/app-shell'
import { NewExperimentClient } from './new-client'

export const dynamic = 'force-dynamic'

export default async function NewExperimentPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch validated complaint cases
  const { data: cases } = await supabase
    .from('complaint_cases')
    .select('id, case_id, complaint_text, case_complexity')
    .eq('is_archived', false)
    .order('case_id')

  // Fetch participants
  const { data: participants } = await supabase
    .from('profiles')
    .select('id, full_name, email, participant_code, department')
    .order('created_at')

  return (
    <AppShell>
      <NewExperimentClient
        availableCases={cases || []}
        availableParticipants={participants || []}
      />
    </AppShell>
  )
}
