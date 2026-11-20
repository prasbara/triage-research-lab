'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FlaskConical, Shuffle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface NewExperimentClientProps {
  availableCases: any[]
  availableParticipants: any[]
}

export function NewExperimentClient({
  availableCases,
  availableParticipants,
}: NewExperimentClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: 'Eksperimen Utama — Batch 1',
    description: 'Evaluasi triase administratif manual vs pendampingan LLM Nemotron/Gemini',
    phase: 'main' as 'setup' | 'pilot' | 'main',
    ai_provider: 'nvidia' as 'nvidia' | 'gemini',
    ai_model: 'nvidia/nemotron-3.5-lightning-30b-a3b',
    ai_temperature: 0.1,
    ai_max_tokens: 2048,
    random_seed: Math.floor(Math.random() * 899999) + 100000,
    case_ids: availableCases.map((c) => c.id),
    participant_ids: availableParticipants.map((p) => p.id),
  })

  const handleProviderChange = (p: 'nvidia' | 'gemini') => {
    setForm({
      ...form,
      ai_provider: p,
      ai_model:
        p === 'nvidia'
          ? 'nvidia/nemotron-3.5-lightning-30b-a3b'
          : 'gemini-2.5-flash',
    })
  }

  const toggleCase = (id: string) => {
    setForm((prev) => ({
      ...prev,
      case_ids: prev.case_ids.includes(id)
        ? prev.case_ids.filter((c) => c !== id)
        : [...prev.case_ids, id],
    }))
  }

  const toggleParticipant = (id: string) => {
    setForm((prev) => ({
      ...prev,
      participant_ids: prev.participant_ids.includes(id)
        ? prev.participant_ids.filter((p) => p !== id)
        : [...prev.participant_ids, id],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.case_ids.length === 0) {
      setError('Pilih minimal satu kasus keluhan untuk dievaluasi.')
      return
    }
    if (form.participant_ids.length === 0) {
      setError('Pilih minimal satu partisipan untuk penugasan.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/experiments/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat sesi eksperimen')
      }

      router.push(`/experiments/${data.data.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-2">
        <Link href="/experiments">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={14} />
            <span>Kembali</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Konfigurasi Sesi Eksperimen Baru
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Pengaturan parameter randomisasi terstandar dan counterbalancing
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Identitas Protokol Eksperimen</CardTitle>
            <CardDescription>Nama sesi dan fase riset</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Nama Sesi Eksperimen"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Deskripsi / Catatan Hipotesis"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Fase Riset"
                value={form.phase}
                onChange={(e) => setForm({ ...form, phase: e.target.value as any })}
              >
                <option value="pilot">Uji Coba Terbatas (Pilot Study)</option>
                <option value="main">Eksperimen Utama (Main Experiment)</option>
                <option value="setup">Persiapan (Setup)</option>
              </Select>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center justify-between">
                  <span>Random Seed</span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({ ...form, random_seed: Math.floor(Math.random() * 899999) + 100000 })
                    }
                    className="text-[var(--accent)] text-[11px] lowercase flex items-center gap-1 font-normal cursor-pointer"
                  >
                    <Shuffle size={11} /> acak ulang
                  </button>
                </label>
                <Input
                  type="number"
                  value={form.random_seed}
                  onChange={(e) => setForm({ ...form, random_seed: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Provider Config */}
        <Card>
          <CardHeader>
            <CardTitle>Konfigurasi Engine AI</CardTitle>
            <CardDescription>Pilih provider LLM yang akan mendampingi petugas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleProviderChange('nvidia')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  form.ai_provider === 'nvidia'
                    ? 'border-[#0071e3] bg-blue-50/50 ring-2 ring-blue-100'
                    : 'border-[var(--border)] bg-white hover:bg-[var(--surface)]'
                }`}
              >
                <div className="font-semibold text-sm text-[var(--text-primary)]">NVIDIA NIM</div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  Nemotron-3.5 Lightning (30B Reasoning)
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleProviderChange('gemini')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  form.ai_provider === 'gemini'
                    ? 'border-[#0071e3] bg-blue-50/50 ring-2 ring-blue-100'
                    : 'border-[var(--border)] bg-white hover:bg-[var(--surface)]'
                }`}
              >
                <div className="font-semibold text-sm text-[var(--text-primary)]">Google Gemini</div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  Gemini 2.5 Flash / Pro
                </div>
              </button>
            </div>
            <Input
              label="Model Identifier"
              value={form.ai_model}
              onChange={(e) => setForm({ ...form, ai_model: e.target.value })}
              required
            />
          </CardContent>
        </Card>

        {/* Case Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pilih Kasus Keluhan ({form.case_ids.length} Dipilih)</CardTitle>
                <CardDescription>
                  Kasus yang akan diacak ke dalam blok Manual & AI-Assisted
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setForm({
                    ...form,
                    case_ids:
                      form.case_ids.length === availableCases.length
                        ? []
                        : availableCases.map((c) => c.id),
                  })
                }
              >
                {form.case_ids.length === availableCases.length ? 'Batal Semua' : 'Pilih Semua'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-60 overflow-y-auto divide-y divide-[var(--border-subtle)] border border-[var(--border-subtle)] rounded-xl">
              {availableCases.map((c) => {
                const selected = form.case_ids.includes(c.id)
                return (
                  <div
                    key={c.id}
                    onClick={() => toggleCase(c.id)}
                    className={`p-3 text-xs flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                      selected ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="space-y-0.5 max-w-lg">
                      <span className="font-mono font-bold text-[var(--text-primary)]">
                        {c.case_id}
                      </span>
                      <p className="line-clamp-1 text-[var(--text-secondary)]">{c.complaint_text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{c.case_complexity || 'moderate'}</Badge>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {}}
                        className="rounded accent-[var(--accent)]"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/experiments">
            <Button type="button" variant="secondary">
              Batal
            </Button>
          </Link>
          <Button type="submit" loading={loading}>
            <FlaskConical size={14} />
            <span>Generate & Mulai Eksperimen</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
