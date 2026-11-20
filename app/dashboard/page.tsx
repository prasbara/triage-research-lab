import { createServerSupabaseClient } from '@/lib/database/server'
import { AppShell } from '@/components/layout/app-shell'
import { SummaryCard } from '@/components/dashboard/summary-card'
import { RecentActivityTable } from '@/components/dashboard/recent-activity'
import { DurationChart } from '@/components/dashboard/duration-chart'
import { FileText, Users, FlaskConical, Clock, CheckCircle2, Bot, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  // Real-time aggregate counts from Supabase
  const [
    { count: totalCases },
    { count: validatedCases },
    { count: totalParticipants },
    { count: completedTasks },
    { data: recentTasks },
    { data: allTaskDurations },
  ] = await Promise.all([
    supabase.from('complaint_cases').select('*', { count: 'exact', head: true }).eq('is_archived', false),
    supabase.from('complaint_cases').select('*', { count: 'exact', head: true }).eq('validation_status', 'validated'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'participant'),
    supabase.from('triage_tasks').select('*', { count: 'exact', head: true }).eq('completion_status', 'completed'),
    supabase
      .from('triage_tasks')
      .select('*, profiles(participant_code, full_name), complaint_cases(case_id)')
      .eq('completion_status', 'completed')
      .order('task_submitted_at', { ascending: false })
      .limit(8),
    supabase
      .from('triage_tasks')
      .select('method, duration_seconds')
      .eq('completion_status', 'completed'),
  ])

  const manualTasks = (allTaskDurations || []).filter((t) => t.method === 'manual')
  const aiTasks = (allTaskDurations || []).filter((t) => t.method === 'ai_assisted')

  const avgManual =
    manualTasks.length > 0
      ? manualTasks.reduce((s, t) => s + (Number(t.duration_seconds) || 0), 0) / manualTasks.length
      : 0
  const avgAI =
    aiTasks.length > 0
      ? aiTasks.reduce((s, t) => s + (Number(t.duration_seconds) || 0), 0) / aiTasks.length
      : 0

  const durationData = [
    { method: 'manual', label: 'Manual (Tanpa AI)', duration: avgManual },
    { method: 'ai_assisted', label: 'AI-Assisted (LLM)', duration: avgAI },
  ]

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Overview Dashboard Riset
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              Ringkasan observasi empiris triase keluhan pasien: efisiensi waktu, akurasi, dan perbandingan kondisi
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/triage/manual">
              <Button variant="outline" size="sm">
                Triase Manual
              </Button>
            </Link>
            <Link href="/triage/ai-assisted">
              <Button size="sm">
                Triase AI-Assisted
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Primary Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Kasus Keluhan"
            value={totalCases ?? 0}
            icon={FileText}
            description="Dataset korpus rumah sakit"
          />
          <SummaryCard
            title="Kasus Tervalidasi"
            value={validatedCases ?? 0}
            icon={CheckCircle2}
            description="Standar Emas disepakati"
            accent="success"
          />
          <SummaryCard
            title="Partisipan Staf"
            value={totalParticipants ?? 0}
            icon={Users}
            description="Petugas administrasi terdaftar"
          />
          <SummaryCard
            title="Observasi Selesai"
            value={completedTasks ?? 0}
            icon={FlaskConical}
            description="Data tugas valid tersimpan"
            accent="blue"
          />
        </div>

        {/* Duration Chart & Fast Action Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <DurationChart data={durationData} />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-[20px] bg-white border border-[var(--border-subtle)] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[var(--accent)] flex items-center justify-center font-bold text-xs">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    Dual Provider AI Aktif
                  </h3>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    NVIDIA NIM & Google Gemini
                  </span>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Platform terhubung langsung ke model <strong>Nemotron-3.5 Lightning</strong> dan <strong>Gemini 2.5 Flash</strong> dengan key server-side.
              </p>
              <div className="pt-2">
                <Link href="/ai-lab">
                  <Button variant="secondary" size="sm" className="w-full">
                    <span>Buka AI Laboratory</span>
                    <ArrowRight size={13} />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-[20px] bg-white border border-[var(--border-subtle)] shadow-xs space-y-2 text-xs">
              <span className="font-bold text-[var(--text-primary)] block">
                Protokol Penelitian Terkunci (v1.0)
              </span>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Observasi dievaluasi menggunakan Standar Emas ganda mandiri dan analisis Linear Mixed-Effects Model.
              </p>
              <Link href="/about" className="text-[var(--accent)] font-semibold inline-block hover:underline pt-1">
                Pelajari Kerangka Teori →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <RecentActivityTable tasks={recentTasks || []} />
      </div>
    </AppShell>
  )
}
