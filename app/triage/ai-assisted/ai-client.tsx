'use client'

import { useState, useEffect } from 'react'
import { useTaskTimer } from '@/hooks/use-task-timer'
import { useTriageTask } from '@/hooks/use-triage-task'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Bot,
  Sparkles,
  Edit3,
  Check,
  ShieldAlert,
  Cpu,
} from 'lucide-react'
import Link from 'next/link'

interface AIAssistedTriageClientProps {
  categories: string[]
  priorities: string[]
  units: string[]
}

export function AIAssistedTriageClient({
  categories,
  priorities,
  units,
}: AIAssistedTriageClientProps) {
  const { task, loading, hasMore, fetchNextTask } = useTriageTask('ai_assisted')
  const timer = useTaskTimer()

  const [aiLoading, setAiLoading] = useState(false)
  const [aiRecommendation, setAiRecommendation] = useState<any | null>(null)
  const [inferenceId, setInferenceId] = useState<string | null>(null)
  const [aiLatency, setAiLatency] = useState<number | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)

  const [form, setForm] = useState({
    final_category: '',
    final_subcategory: '',
    final_priority: '',
    final_target_unit: '',
    final_escalation_required: false,
    reasoning: '',
  })
  const [isModified, setIsModified] = useState(false)
  const [revisions, setRevisions] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [taskStartedAt, setTaskStartedAt] = useState<string | null>(null)
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null)

  // Load first task on mount
  useEffect(() => {
    fetchNextTask()
  }, [fetchNextTask])

  // When task changes: start timer and auto-request real AI classification
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

      // Reset states
      setAiRecommendation(null)
      setInferenceId(null)
      setAiError(null)
      setIsModified(false)
      setRevisions([])
      setSubmittedMessage(null)
      setForm({
        final_category: '',
        final_subcategory: '',
        final_priority: '',
        final_target_unit: '',
        final_escalation_required: false,
        reasoning: '',
      })

      // Fetch AI recommendation
      const provider = task.experiment_sessions?.ai_provider || 'nvidia'
      const model = task.experiment_sessions?.ai_model || undefined

      setAiLoading(true)
      fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: task.complaint_cases?.case_id || task.case_id,
          complaint_text: task.complaint_cases?.complaint_text,
          provider,
          model,
          session_id: task.session_id,
          available_categories: categories,
          available_priorities: priorities,
          available_units: units,
        }),
      })
        .then(async (res) => {
          const data = await res.json()
          if (!res.ok) {
            throw new Error(data.error || 'AI classification failed')
          }
          setAiRecommendation(data.recommendation)
          setInferenceId(data.inference_id)
          setAiLatency(data.latency_ms)
        })
        .catch((err) => {
          setAiError(err.message)
        })
        .finally(() => {
          setAiLoading(false)
        })
    }
  }, [task])

  // Accept AI recommendation
  const handleAcceptAI = () => {
    if (!aiRecommendation) return
    setForm({
      final_category: aiRecommendation.category,
      final_subcategory: aiRecommendation.subcategory || '',
      final_priority: aiRecommendation.priority,
      final_target_unit: aiRecommendation.target_unit,
      final_escalation_required: !!aiRecommendation.escalation_required,
      reasoning: `[Diterima dari AI]: ${aiRecommendation.reasoning || ''}`,
    })
    setIsModified(false)
    setRevisions([])
  }

  // Pre-fill for modification
  const handleModifyAI = () => {
    if (!aiRecommendation) return
    setForm({
      final_category: aiRecommendation.category,
      final_subcategory: aiRecommendation.subcategory || '',
      final_priority: aiRecommendation.priority,
      final_target_unit: aiRecommendation.target_unit,
      final_escalation_required: !!aiRecommendation.escalation_required,
      reasoning: aiRecommendation.reasoning || '',
    })
    setIsModified(true)
  }

  // Track field changes if modified
  const handleFieldChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (aiRecommendation) {
      setIsModified(true)
      // Check if different from AI
      const aiVal = aiRecommendation[field === 'final_category' ? 'category' : field === 'final_priority' ? 'priority' : field === 'final_target_unit' ? 'target_unit' : 'escalation_required']
      if (String(aiVal) !== String(value)) {
        setRevisions((prev) => {
          const filtered = prev.filter((r) => r.field_name !== field)
          return [
            ...filtered,
            {
              field_name: field,
              ai_value: String(aiVal),
              final_value: String(value),
              revision_reason: 'Koreksi klinis/administratif oleh petugas manusia',
            },
          ]
        })
      }
    }
  }

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
          method: 'ai_assisted',
          final_category: form.final_category,
          final_subcategory: form.final_subcategory || null,
          final_priority: form.final_priority,
          final_target_unit: form.final_target_unit,
          final_escalation_required: form.final_escalation_required,
          reasoning: form.reasoning,
          task_started_at: taskStartedAt,
          inference_id: inferenceId || undefined,
          ai_recommendation_accepted: !isModified,
          revisions: revisions,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan keputusan triase')
      }

      setSubmittedMessage(
        `Keputusan disimpan! Durasi total: ${duration.toFixed(1)}s (${revisions.length} revisi)`
      )
      setTimeout(() => {
        timer.reset()
        fetchNextTask()
      }, 1200)
    } catch (err: any) {
      alert(`Error: ${err.message}`)
      timer.start()
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && !task) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[var(--text-secondary)]">Memuat penugasan triase AI-Assisted...</p>
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
          Semua Tugas Triase AI-Assisted Selesai
        </h2>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Semua kasus dalam alokasi pendampingan LLM telah diselesaikan. Anda dapat melihat perbandingan durasi dan akurasi di halaman Analitik.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link href="/analytics">
            <Button size="sm">Buka Research Analytics</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="sm">
              Kembali ke Overview
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
          <Badge variant="default">Kondisi B: AI-Assisted</Badge>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            Tugas #{task.task_order}
          </span>
          <span className="text-xs text-[var(--text-secondary)] capitalize flex items-center gap-1 font-medium">
            <Cpu size={12} className="text-[var(--accent)]" />
            {task.experiment_sessions?.ai_provider || 'NVIDIA'}
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

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Complaint Details & AI Recommendation Card */}
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
          </Card>

          {/* AI Recommendation Box */}
          <Card className="p-6 border-blue-100 bg-gradient-to-br from-white to-blue-50/20">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-[var(--accent)] flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    Rekomendasi AI ({task.experiment_sessions?.ai_provider?.toUpperCase()})
                  </h3>
                  {aiLatency && (
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">
                      Latency inferensi: {aiLatency}ms
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="purple">Decision Support Only</Badge>
            </div>

            {aiLoading ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[var(--text-secondary)]">
                  Menghubungi endpoint inferensi {task.experiment_sessions?.ai_provider}...
                </p>
              </div>
            ) : aiError ? (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                Gagal memuat rekomendasi: {aiError}. Anda dapat tetap mengklasifikasikan secara manual.
              </div>
            ) : aiRecommendation ? (
              <div className="mt-4 space-y-3.5">
                {/* Clinical Safety Warning if flagged */}
                {aiRecommendation.requires_human_review && (
                  <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                    <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Peringatan Keselamatan / Review Ketat:</span>
                      <p className="mt-0.5 text-amber-800">
                        Model mendeteksi potensi dampak klinis/keselamatan pasien. Pastikan meneliti apakah keluhan membutuhkan penanganan medis segera sesuai SOP.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">
                      Kategori Rekomendasi
                    </span>
                    <span className="font-bold text-[var(--text-primary)] mt-0.5 block">
                      {aiRecommendation.category}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">
                      Prioritas Rekomendasi
                    </span>
                    <span className="font-bold text-[var(--text-primary)] mt-0.5 block">
                      {aiRecommendation.priority}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">
                      Unit Tujuan
                    </span>
                    <span className="font-bold text-[var(--text-primary)] mt-0.5 block">
                      {aiRecommendation.target_unit}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">
                      Status Eskalasi
                    </span>
                    <span className="font-bold text-[var(--text-primary)] mt-0.5 block">
                      {aiRecommendation.escalation_required ? 'Ya (Eskalasi Diperlukan)' : 'Tidak'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[var(--border-subtle)] text-xs">
                  <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">
                    Pertimbangan Model (Reasoning)
                  </span>
                  <p className="text-[var(--text-primary)] mt-1 leading-relaxed">
                    {aiRecommendation.reasoning}
                  </p>
                  {aiRecommendation.sop_reference && (
                    <span className="text-[11px] text-[var(--text-secondary)] italic mt-1 block">
                      Ref: {aiRecommendation.sop_reference}
                    </span>
                  )}
                </div>

                {/* HITL Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    size="md"
                    className="flex-1 h-10 gap-2 font-medium"
                    onClick={handleAcceptAI}
                  >
                    <Check size={15} />
                    <span>Terima Rekomendasi AI</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    className="flex-1 h-10 gap-2 font-medium"
                    onClick={handleModifyAI}
                  >
                    <Edit3 size={15} />
                    <span>Modifikasi / Koreksi Human</span>
                  </Button>
                </div>
              </div>
            ) : null}
          </Card>
        </div>

        {/* Right Column: Final Human Decision Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit}>
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Keputusan Akhir Petugas (HITL)</CardTitle>
                  <CardDescription>
                    {isModified ? 'Mode Koreksi Aktif' : 'Verifikasi atau sesuaikan rekomendasi'}
                  </CardDescription>
                </div>
                {isModified && <Badge variant="warning">Direvisi</Badge>}
              </div>

              <div className="space-y-3.5 pt-2">
                <Select
                  label="Kategori Keluhan"
                  value={form.final_category}
                  onChange={(e) => handleFieldChange('final_category', e.target.value)}
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
                  onChange={(e) => handleFieldChange('final_priority', e.target.value)}
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
                  onChange={(e) => handleFieldChange('final_target_unit', e.target.value)}
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
                        handleFieldChange('final_escalation_required', e.target.checked)
                      }
                      className="mt-0.5 rounded accent-[var(--accent)]"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-[var(--text-primary)]">
                        Perlu Eskalasi Segera
                      </span>
                      <p className="text-[var(--text-muted)] mt-0.5">
                        Centang jika kasus membutuhkan disposisi manajemen langsung.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Catatan Verifikasi / Alasan Revisi
                  </label>
                  <textarea
                    rows={2}
                    className="w-full rounded-xl border border-[var(--border)] p-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-100"
                    placeholder="Alasan penerimaan atau revisi rekomendasi AI..."
                    value={form.reasoning}
                    onChange={(e) => setForm({ ...form, reasoning: e.target.value })}
                  />
                </div>
              </div>

              {revisions.length > 0 && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/50 rounded-xl text-xs space-y-1">
                  <span className="font-semibold text-amber-900">
                    Log Perubahan Petugas ({revisions.length} bidang):
                  </span>
                  {revisions.map((r, i) => (
                    <div key={i} className="text-[11px] text-amber-800">
                      • {r.field_name}: "{r.ai_value}" → "{r.final_value}"
                    </div>
                  ))}
                </div>
              )}

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
                  <span>Simpan Keputusan Final Petugas</span>
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
