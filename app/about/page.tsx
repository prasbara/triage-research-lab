import { AppShell } from '@/components/layout/app-shell'
import { AboutClient } from './about-client'

export const dynamic = 'force-dynamic'

export default function AboutPage() {
  return (
    <AppShell>
      <AboutClient />
    </AppShell>
  )
}
