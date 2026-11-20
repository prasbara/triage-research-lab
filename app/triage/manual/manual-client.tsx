'use client'

import { useState, useEffect } from 'react'
import { useTaskTimer } from '@/hooks/use-task-timer'
import { useTriageTask } from '@/hooks/use-triage-task'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, AlertTriangle, ArrowRight, ClipboardList } from 'lucide-react'
import Link from 'next/link'

interface ManualTriageClientProps {
  categories: string[]
  priorities: string[]
  units: string[]
}

export function ManualTriageClient({
  categories,
  priorities,
  units,
}: ManualTriageClientProps) {
  const { task, loading, error, hasMore, fetchNextTask } = useTriageTask('manual')
  const timer = useTaskTimer()

  const [form, setForm] = useState({
    final_category: '',
    final_subcategory: '',
    final_priority: '',
    final_target_unit: '',
    final_escalation_required: false,
    reasoning: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [taskStartedAt, setTaskStartedAt] = useState<string | null>(null)
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null)

  // Load first task on mount
  useEffect(() => {
    fetchNextTask()
  }, [fetchNextTask])

  // When a task arrives, start the timer and record task_started_at
  useEffect(() => {
    if (task && !submitting) {
      const now = new Date().toISOString()
      setTaskStartedAt(now)
      timer.start()

      // Inform server task has started
      fetch('/api/triage/start-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignment_id: task.id,
          task_started_at: now,
        }),
      }).catch(() => {})

      // Reset form
      setForm({
        final_category: '',
        final_subcategory: '',
        final_priority: '',
        final_target_unit: '',
        final_escalation_required: false,
        reasoning: '',
      })
      setSubmittedMessage(null)
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task || !taskStartedAt) return

    setSubmitting(true)
    const duration = timer.stop()

    try {
      const res = await fetch('/api/triage/submit-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignment_id: task.id,
          method: 'manual',
          final_category: form.final_category,
          final_subcategory: form.final_subcategory || null,
          final_priority: form.final_priority,
          final_target_unit: form.final_target_unit,
          final_escalation_required: form.final_escalation_required,
          reasoning: form.reasoning,
          task_started_at: taskStartedAt,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan keputusan triase')
      }

      setSubmittedMessage(`Keputusan tersimpan! Durasi: ${duration.toFixed(1)} detik.`)
      setTimeout(() => {
        timer.reset()
        fetchNextTask()
      }, 1200)
    } catch (err: any) {
      alert(`Error: ${err.message}`)
      timer.start() // resume if failed
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && !task) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[var(--text-secondary)]">Memuat penugasan triase manual...</p>
      </div>
    )
  }

  if (!hasMore || !task) {
    return (
      <Card className="max-w-xl mx-auto my-12 p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 size={24} />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Semua Tugas Triase Manual Telah Selesai
        </h2>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Tidak ada tugas triase manual yang tersisa dalam antrean Anda. Silakan lanjutkan ke modul triase berbantuan AI atau tinjau ringkasan di dashboard analitik.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link href="/triage/ai-assisted">
            <Button size="sm">Lanjut ke Triase AI</Button>
          </Link>
          <Link href="/analytics">
            <Button variant="secondary" size="sm">
              Lihat Analitik
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Timer Bar */}
      <div className="bg-white rounded-2xl border border-[var(--border-subtle)] p-3 px-5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <Badge variant="outline">Kondisi A: Manual</Badge>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            Tugas #{task.task_order}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-[var(--accent)] animate-pulse" />
          <span className="font-mono text-base font-bold text-[var(--text-primary)] tracking-tight">
            {timer.formatElapsed()}
          </span>
        </div>
      </div>

      {submittedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold text-center animate-in fade-in">
          {submittedMessage}
        </div>
      )}

      {/* Main Workspace: 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Complaint Details & SOP Reference (NO AI HINTS) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-mono font-bold text-[var(--accent)] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/50">
                {task.complaint_cases?.case_id}
              </span>
              <Badge
                variant={
                  task.complaint_cases?.case_complexity === 'complex'
                    ? 'danger'
                    : task.complaint_cases?.case_complexity === 'moderate'
                    ? 'warning'
                    : 'muted'
                }
              >
                Kompleksitas: {task.complaint_cases?.case_complexity || 'moderate'}
              </Badge>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Teks Narasi Keluhan Pasien
              </label>
              <div className="mt-2 p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm leading-relaxed font-sans font-medium">
                "{task.complaint_cases?.complaint_text}"
              </div>
            </div>

            {/* SOP Reference Guide */}
            <div className="mt-5 p-4 bg-gray-50/70 rounded-2xl border border-gray-200/60 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
                <ClipboardList size={14} className="text-[var(--accent)]" />
                <span>Pedoman SOP Triase Administratif Rumah Sakit</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                1. <strong>Tentukan Kategori:</strong> Kelompokkan masalah utama keluhan (pelayanan, komunikasi, staf, fasilitas, atau keselamatan).<br />
                2. <strong>Tentukan Prioritas:</strong> Kritis (1 jam), Tinggi (4 jam), Sedang (24 jam), Rutin (72 jam).<br />
                3. <strong>Eskalasi:</strong> Centang eskalasi apabila keluhan berisiko membahayakan pasien, memicu konflik hukum, atau membutuhkan intervensi manajemen segera.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column: Decision Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit}>
            <Card className="p-6 space-y-4">
              <CardTitle>Keputusan Triase Petugas</CardTitle>
              <CardDescription>
                Tentukan klasifikasi dan prioritas penanganan awal secara mandiri
              </CardDescription>

              <div className="space-y-3.5 pt-2">
                <Select
                  label="Kategori Keluhan"
                  value={form.final_category}
                  onChange={(e) => setForm({ ...form, final_category: e.target.value })}
                  required
                >
                  <option value="">Pilih Kategori...</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Tingkat Prioritas"
                  value={form.final_priority}
                  onChange={(e) => setForm({ ...form, final_priority: e.target.value })}
                  required
                >
                  <option value="">Pilih Tingkat Prioritas...</option>
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Unit Penanggung Jawab"
                  value={form.final_target_unit}
                  onChange={(e) => setForm({ ...form, final_target_unit: e.target.value })}
                  required
                >
                  <option value="">Pilih Unit Tujuan...</option>
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </Select>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[var(--border)] bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.final_escalation_required}
                      onChange={(e) =>
                        setForm({ ...form, final_escalation_required: e.target.checked })
                      }
                      className="mt-0.5 rounded accent-[var(--accent)]"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-[var(--text-primary)]">
                        Perlu Eskalasi Segera
                      </span>
                      <p className="text-[var(--text-muted)] mt-0.5">
                        Centang jika keluhan membutuhkan disposisi langsung ke Direksi / Komite Medik.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Alasan / Catatan Triase (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    className="w-full rounded-xl border border-[var(--border)] p-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-100"
                    placeholder="Pertimbangan pemilihan kategori/prioritas..."
                    value={form.reasoning}
                    onChange={(e) => setForm({ ...form, reasoning: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)]">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-11 text-xs sm:text-sm font-medium gap-2 justify-center"
                  disabled={
                    submitting ||
                    !form.final_category ||
                    !form.final_priority ||
                    !form.final_target_unit
                  }
                  loading={submitting}
                >
                  <span>Simpan & Lanjut ke Kasus Berikutnya</span>
                  <ArrowRight size={15} />
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
