import { createServerSupabaseClient } from '@/lib/database/server'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, FileText, FlaskConical, Bot, CheckCircle } from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  const supabase = await createServerSupabaseClient()

  // Fetch session details
  const { data: session } = await supabase
    .from('experiment_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  // Fetch assignments with task status
  const { data: assignments } = await supabase
    .from('experiment_assignments')
    .select(`
      id,
      task_order,
      method,
      condition_block,
      is_completed,
      case_id,
      participant_id,
      complaint_cases (case_id, case_complexity),
      profiles (participant_code, full_name),
      triage_tasks (duration_seconds, completion_status)
    `)
    .eq('session_id', sessionId)
    .order('task_order', { ascending: true })

  const completedCount = (assignments || []).filter((a) => a.is_completed).length
  const totalCount = assignments?.length || 0

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <Link href="/experiments">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={14} />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  {session?.name || 'Detail Sesi'}
                </h1>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {session?.session_code}
                </span>
                <Badge variant={session?.phase === 'main' ? 'default' : 'purple'}>
                  {session?.phase}
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Protokol v{session?.protocol_version || '1.0'} • Seed: {session?.random_seed} • Model: {session?.ai_model}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/triage/manual">
              <Button variant="outline" size="sm">
                Mulai Triase Manual
              </Button>
            </Link>
            <Link href="/triage/ai-assisted">
              <Button size="sm">
                Mulai Triase AI
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase">Kemajuan</span>
            <div className="text-2xl font-bold mt-1 text-[var(--text-primary)]">
              {completedCount} / {totalCount}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">
              {totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}% selesai` : '0%'}
            </div>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase">Provider LLM</span>
            <div className="text-xl font-bold mt-1 capitalize text-[var(--text-primary)]">
              {session?.ai_provider}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">
              {session?.ai_model}
            </div>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase">Kasus Unik</span>
            <div className="text-2xl font-bold mt-1 text-[var(--text-primary)]">
              {session?.number_of_cases || 0}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">Kasus keluhan</div>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase">Status Kunci</span>
            <div className="text-xl font-bold mt-1 text-[var(--text-primary)]">
              {session?.is_locked ? 'Terkunci' : 'Aktif (Terbuka)'}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">
              {session?.is_locked ? 'Protokol locked' : 'Observasi berjalan'}
            </div>
          </Card>
        </div>

        {/* Assignment Table */}
        <div className="bg-white rounded-[20px] border border-[var(--border-subtle)] overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">
              Jadwal Alokasi Tugas Acak (Counterbalanced Design)
            </h3>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {assignments?.length || 0} penugasan
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[var(--surface-secondary)] border-b border-[var(--border-subtle)] text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  <th className="px-5 py-3">Urutan</th>
                  <th className="px-5 py-3">Partisipan</th>
                  <th className="px-5 py-3">Kasus Keluhan</th>
                  <th className="px-5 py-3">Metode Alokasi</th>
                  <th className="px-5 py-3">Blok</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Durasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {assignments && assignments.length > 0 ? (
                  assignments.map((a: any) => {
                    const task = Array.isArray(a.triage_tasks)
                      ? a.triage_tasks[0]
                      : a.triage_tasks
                    return (
                      <tr key={a.id} className="hover:bg-[var(--surface)] transition-colors">
                        <td className="px-5 py-3 font-mono font-bold text-[var(--text-muted)]">
                          #{a.task_order}
                        </td>
                        <td className="px-5 py-3 font-semibold text-[var(--text-primary)]">
                          {a.profiles?.participant_code || a.participant_id?.substring(0, 8)}
                        </td>
                        <td className="px-5 py-3 font-mono font-medium text-[var(--text-primary)]">
                          {a.complaint_cases?.case_id || a.case_id}
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={a.method === 'manual' ? 'outline' : 'default'}>
                            {a.method === 'manual' ? 'Manual' : 'AI-Assisted'}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-[var(--text-secondary)]">
                          Blok {a.condition_block}
                        </td>
                        <td className="px-5 py-3">
                          {a.is_completed ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                              <CheckCircle size={13} /> Selesai
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                              <Clock size={13} /> Belum
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right font-mono font-semibold">
                          {task?.duration_seconds ? formatDuration(task.duration_seconds) : '—'}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-[var(--text-muted)]">
                      Belum ada penugasan terdaftar pada sesi ini.
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
