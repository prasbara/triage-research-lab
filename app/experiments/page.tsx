import { createServerSupabaseClient } from '@/lib/database/server'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, FlaskConical, Users, FileText, ArrowRight, Bot, Cpu } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ExperimentsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: sessions } = await supabase
    .from('experiment_sessions')
    .select('*, session_participants(count), experiment_assignments(count)')
    .order('created_at', { ascending: false })

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Sesi Eksperimen Riset
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              Kelola protokol eksperimen acak (randomized task allocation) manual vs AI-assisted
            </p>
          </div>
          <Link href="/experiments/new">
            <Button size="sm">
              <Plus size={14} />
              <span>Buat Sesi Eksperimen</span>
            </Button>
          </Link>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sessions && sessions.length > 0 ? (
            sessions.map((s) => (
              <Card key={s.id} className="flex flex-col justify-between hover:border-blue-200">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-semibold text-[var(--accent)] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/50">
                      {s.session_code}
                    </span>
                    <Badge
                      variant={
                        s.phase === 'main'
                          ? 'default'
                          : s.phase === 'pilot'
                          ? 'purple'
                          : s.phase === 'completed'
                          ? 'success'
                          : 'muted'
                      }
                    >
                      {s.phase}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight">
                    {s.name}
                  </h3>
                  {s.description && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2">
                      {s.description}
                    </p>
                  )}
                  <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                      <Cpu size={14} className="text-[var(--text-muted)]" />
                      <span className="capitalize">{s.ai_provider}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                      <FileText size={14} className="text-[var(--text-muted)]" />
                      <span>{s.number_of_cases || 0} Kasus</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                      <Users size={14} className="text-[var(--text-muted)]" />
                      <span>{s.session_participants?.[0]?.count || 0} Partisipan</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                      <FlaskConical size={14} className="text-[var(--text-muted)]" />
                      <span>{s.experiment_assignments?.[0]?.count || 0} Penugasan</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {formatDate(s.created_at)}
                  </span>
                  <Link href={`/experiments/${s.id}`}>
                    <Button variant="ghost" size="sm">
                      <span>Detail</span>
                      <ArrowRight size={13} />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-[var(--border-subtle)] p-8">
              <FlaskConical size={36} className="mx-auto text-[var(--text-muted)] mb-3 opacity-50" />
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                Belum ada sesi eksperimen
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-md mx-auto">
                Buat sesi eksperimen baru untuk mengalokasikan kasus keluhan secara acak kepada partisipan petugas.
              </p>
              <Link href="/experiments/new" className="inline-block mt-4">
                <Button size="sm">
                  <Plus size={14} />
                  <span>Buat Sesi Eksperimen Pertama</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
