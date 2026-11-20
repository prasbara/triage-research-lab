'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, UserCheck, AlertCircle, CheckCircle2, Award } from 'lucide-react'

interface ValidationClientProps {
  cases: any[]
  categories: string[]
  priorities: string[]
  units: string[]
}

export function ValidationClient({
  cases,
  categories,
  priorities,
  units,
}: ValidationClientProps) {
  const [selectedCase, setSelectedCase] = useState<any | null>(cases[0] || null)
  const [form, setForm] = useState({
    category: '',
    priority: '',
    target_unit: '',
    escalation_required: false,
    reasoning: '',
    confidence_level: 'high' as 'low' | 'medium' | 'high',
  })
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCase) return

    setSubmitting(true)
    setSuccessMessage(null)

    try {
      const res = await fetch('/api/validation/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: selectedCase.id,
          ...form,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan telaah ahli')

      setSuccessMessage('Penilaian ahli berhasil dicatat dan diverifikasi.')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Validasi Ahli & Gold Standard
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Penyusunan referensi standar emas (Gold Standard) melalui telaah independen ganda (inter-rater agreement)
          </p>
        </div>
        <Badge variant="purple">Independent 2-Expert Protocol</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Case List */}
        <div className="lg:col-span-5 space-y-3">
          <Card className="p-4">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Daftar Kasus Keluhan ({cases.length})
            </h3>
            <div className="max-h-[600px] overflow-y-auto space-y-2 pr-1">
              {cases.map((c) => {
                const isSelected = selectedCase?.id === c.id
                const hasGoldStandard = c.gold_standards && c.gold_standards.length > 0
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[var(--accent)] bg-blue-50/40 ring-2 ring-blue-100 shadow-xs'
                        : 'border-[var(--border-subtle)] bg-white hover:bg-[var(--surface)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-[var(--text-primary)]">
                        {c.case_id}
                      </span>
                      {hasGoldStandard ? (
                        <Badge variant="success">Gold Standard Locked</Badge>
                      ) : (
                        <Badge variant={c.validation_status === 'validated' ? 'success' : 'muted'}>
                          {c.validation_status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[var(--text-secondary)] line-clamp-2 mt-1">
                      {c.complaint_text}
                    </p>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right: Expert Review Form & Consensus Status */}
        <div className="lg:col-span-7 space-y-5">
          {selectedCase ? (
            <>
              {/* Selected Case Preview */}
              <Card className="p-6">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <span className="font-mono text-xs font-bold text-[var(--accent)] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    {selectedCase.case_id}
                  </span>
                  <Badge variant="outline">{selectedCase.case_complexity}</Badge>
                </div>
                <div className="mt-3">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Narasi Keluhan
                  </label>
                  <p className="mt-1 text-sm text-[var(--text-primary)] font-medium leading-relaxed bg-[var(--surface)] p-3 rounded-xl">
                    "{selectedCase.complaint_text}"
                  </p>
                </div>
              </Card>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <Card className="p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                    <CardTitle>Formulir Telaah Mandiri Ahli</CardTitle>
                    <UserCheck size={18} className="text-[var(--accent)]" />
                  </div>

                  {successMessage && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                      {successMessage}
                    </div>
                  )}

                  <div className="space-y-3.5">
                    <Select
                      label="Kategori Menurut SOP"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required
                    >
                      <option value="">Pilih Kategori Standar...</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Select>

                    <Select
                      label="Prioritas Administratif"
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      required
                    >
                      <option value="">Pilih Prioritas Standar...</option>
                      {priorities.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </Select>

                    <Select
                      label="Unit Penanggung Jawab"
                      value={form.target_unit}
                      onChange={(e) => setForm({ ...form, target_unit: e.target.value })}
                      required
                    >
                      <option value="">Pilih Unit Terkait...</option>
                      {units.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </Select>

                    <div>
                      <label className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border)] bg-gray-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.escalation_required}
                          onChange={(e) =>
                            setForm({ ...form, escalation_required: e.target.checked })
                          }
                          className="rounded accent-[var(--accent)]"
                        />
                        <span className="text-xs font-medium text-[var(--text-primary)]">
                          Kasus ini memerlukan eskalasi manajemen segera (High Risk)
                        </span>
                      </label>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                        Justifikasi & Rujukan SOP
                      </label>
                      <textarea
                        rows={3}
                        className="w-full rounded-xl border border-[var(--border)] p-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-100"
                        placeholder="Penjelasan dasar ilmiah / SOP mengapa kategori dan prioritas ini ditetapkan..."
                        value={form.reasoning}
                        onChange={(e) => setForm({ ...form, reasoning: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-end">
                    <Button type="submit" loading={submitting}>
                      <ShieldCheck size={14} />
                      <span>Simpan Telaah Ahli</span>
                    </Button>
                  </div>
                </Card>
              </form>
            </>
          ) : (
            <Card className="p-8 text-center text-[var(--text-muted)] text-sm">
              Pilih kasus keluhan dari daftar di sebelah kiri untuk menelaah.
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
