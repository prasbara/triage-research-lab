import { AppShell } from '@/components/layout/app-shell'
import { AILabClient } from './ai-lab-client'
import { SUPPORTED_MODELS } from '@/lib/ai/provider'

export const dynamic = 'force-dynamic'

export default function AILabPage() {
  return (
    <AppShell>
      <AILabClient supportedModels={SUPPORTED_MODELS} />
    </AppShell>
  )
}
