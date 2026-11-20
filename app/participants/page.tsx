import { createServerSupabaseClient } from '@/lib/database/server'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, UserPlus, CheckCircle2, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ParticipantsPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch all profiles and their task counts
  const { data: participants } = await supabase
    .from('profiles')
    .select('*, triage_tasks(count), experiment_assignments(count)')
    .order('created_at', { ascending: false })

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Partisipan Penelitian
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              Daftar staf rumah sakit yang terdaftar dalam protokol eksperimen triase keluhan
            </p>
          </div>
          <Badge variant="outline">Studi Kuasi-Eksperimen / Repeated Measures</Badge>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[20px] border border-[var(--border-subtle)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[var(--surface-secondary)] border-b border-[var(--border-subtle)] text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  <th className="px-5 py-3.5">Kode Partisipan</th>
                  <th className="px-5 py-3.5">Nama / Identitas</th>
                  <th className="px-5 py-3.5">Departemen</th>
                  <th className="px-5 py-3.5">Peran</th>
                  <th className="px-5 py-3.5">Status Penugasan</th>
                  <th className="px-5 py-3.5">Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {participants && participants.length > 0 ? (
                  participants.map((p: any) => {
                    const completedTasks = p.triage_tasks?.[0]?.count || 0
                    const totalAssigned = p.experiment_assignments?.[0]?.count || 0
                    return (
                      <tr key={p.id} className="hover:bg-[var(--surface)] transition-colors">
                        <td className="px-5 py-3.5 font-mono font-bold text-[var(--text-primary)]">
                          {p.participant_code || `P-${p.id.substring(0, 5)}`}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-[var(--text-primary)]">
                          {p.full_name || p.email}
                        </td>
                        <td className="px-5 py-3.5 text-[var(--text-secondary)]">
                          {p.department || 'Pelayanan Pelanggan & Admisi'}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={p.role === 'admin' ? 'purple' : p.role === 'expert' ? 'warning' : 'default'}>
                            {p.role}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs">
                            {completedTasks} / {totalAssigned} selesai
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-[var(--text-muted)]">
                          {formatDate(p.created_at)}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-[var(--text-muted)]">
                      Belum ada partisipan yang terdaftar. Pengguna baru yang mendaftar akan otomatis tercatat sebagai partisipan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
