'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Cpu,
  Bot,
  Play,
  RotateCw,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Split,
} from 'lucide-react'

interface AILabClientProps {
  supportedModels: any
}

export function AILabClient({ supportedModels }: AILabClientProps) {
  const [complaintText, setComplaintText] = useState(
    'Pasien IGD mengeluh telah menunggu 45 menit dengan keluhan nyeri dada menjalar ke punggung dan sesak, namun perawat triase hanya mencatat tensi dan menyuruh duduk di ruang tunggu umum tanpa pemeriksaan EKG segera.'
  )
  const [singleProvider, setSingleProvider] = useState<'nvidia' | 'gemini'>('nvidia')
  const [singleModel, setSingleModel] = useState('nvidia/nemotron-3.5-lightning-30b-a3b')
  const [singleLoading, setSingleLoading] = useState(false)
  const [singleResult, setSingleResult] = useState<any | null>(null)
  const [singleError, setSingleError] = useState<string | null>(null)

  // Comparison Mode States
  const [compareLoading, setCompareLoading] = useState(false)
  const [nvidiaResult, setNvidiaResult] = useState<any | null>(null)
  const [geminiResult, setGeminiResult] = useState<any | null>(null)
  const [nvidiaError, setNvidiaError] = useState<string | null>(null)
  const [geminiError, setGeminiError] = useState<string | null>(null)

  const handleRunSingle = async () => {
    if (!complaintText) return
    setSingleLoading(true)
    setSingleResult(null)
    setSingleError(null)

    try {
      const res = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: 'AI-LAB-TEST',
          complaint_text: complaintText,
          provider: singleProvider,
          model: singleModel,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Inference failed')
      setSingleResult(data)
    } catch (err: any) {
      setSingleError(err.message)
    } finally {
      setSingleLoading(false)
    }
  }

  const handleRunComparison = async () => {
    if (!complaintText) return
    setCompareLoading(true)
    setNvidiaResult(null)
    setGeminiResult(null)
    setNvidiaError(null)
    setGeminiError(null)

    // Call both simultaneously
    const runNvidia = fetch('/api/ai/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        case_id: 'AI-LAB-NVIDIA',
        complaint_text: complaintText,
        provider: 'nvidia',
        model: 'nvidia/nemotron-3.5-lightning-30b-a3b',
      }),
    })
      .then(async (r) => {
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || 'NVIDIA NIM failed')
        setNvidiaResult(d)
      })
      .catch((e) => setNvidiaError(e.message))

    const runGemini = fetch('/api/ai/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        case_id: 'AI-LAB-GEMINI',
        complaint_text: complaintText,
        provider: 'gemini',
        model: 'gemini-2.5-flash',
      }),
    })
      .then(async (r) => {
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || 'Gemini API failed')
        setGeminiResult(d)
      })
      .catch((e) => setGeminiError(e.message))

    await Promise.all([runNvidia, runGemini])
    setCompareLoading(false)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            AI Laboratory
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Eksplorasi inferensi model, uji perbandingan respons ganda (NVIDIA NIM vs Google Gemini), dan inspeksi penalarannya
          </p>
        </div>
        <Badge variant="purple">Dual Provider Testbed</Badge>
      </div>

      {/* Input Complaint */}
      <Card className="p-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2 block">
          Teks Kasus Keluhan Uji Coba (De-Identified)
        </label>
        <textarea
          rows={3}
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] p-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-100 font-medium leading-relaxed"
          placeholder="Tuliskan narasi keluhan rumah sakit untuk dianalisis..."
        />
        <div className="mt-2 text-right">
          <button
            type="button"
            onClick={() =>
              setComplaintText(
                'Pasien rawat jalan poli bedah sudah 3 jam menunggu dipanggil padahal nomor antrean sudah lewat, petugas konter pendaftaran bersikap acuh tak acuh dan mengatakan dokter sedang rapat tanpa pemberitahuan sebelumnya.'
              )
            }
            className="text-xs text-[var(--accent)] hover:underline cursor-pointer"
          >
            Gunakan contoh kasus poliklinik
          </button>
        </div>
      </Card>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList>
          <TabsTrigger value="comparison">Komparasi Ganda (NVIDIA vs Gemini)</TabsTrigger>
          <TabsTrigger value="single">Uji Model Tunggal</TabsTrigger>
        </TabsList>

        {/* COMPARISON TAB */}
        <TabsContent value="comparison" className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <p className="text-xs text-[var(--text-secondary)]">
              Kirim teks keluhan yang sama secara paralel ke kedua endpoint untuk mengevaluasi konsistensi taksonomi dan penalarannya.
            </p>
            <Button size="sm" onClick={handleRunComparison} loading={compareLoading}>
              <Split size={14} />
              <span>Jalankan Komparasi Paralel</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* NVIDIA Column */}
            <Card className="p-5 border-blue-100 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-50 text-[var(--accent)] rounded-xl flex items-center justify-center font-bold text-xs">
                    NV
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">NVIDIA NIM</h3>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Nemotron-3.5 Lightning (30B)
                    </span>
                  </div>
                </div>
                {nvidiaResult?.latency_ms && (
                  <Badge variant="outline">{nvidiaResult.latency_ms}ms</Badge>
                )}
              </div>

              {compareLoading ? (
                <div className="py-12 text-center text-xs text-[var(--text-muted)] animate-pulse">
                  Menjalankan inferensi NVIDIA NIM...
                </div>
              ) : nvidiaError ? (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                  {nvidiaError}
                </div>
              ) : nvidiaResult ? (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-[var(--surface)] rounded-xl">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                        Kategori
                      </span>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">
                        {nvidiaResult.recommendation?.category}
                      </p>
                    </div>
                    <div className="p-2.5 bg-[var(--surface)] rounded-xl">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                        Prioritas
                      </span>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">
                        {nvidiaResult.recommendation?.priority}
                      </p>
                    </div>
                    <div className="p-2.5 bg-[var(--surface)] rounded-xl">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                        Unit
                      </span>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">
                        {nvidiaResult.recommendation?.target_unit}
                      </p>
                    </div>
                    <div className="p-2.5 bg-[var(--surface)] rounded-xl">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                        Eskalasi
                      </span>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">
                        {nvidiaResult.recommendation?.escalation_required ? 'Ya' : 'Tidak'}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-[var(--surface)] rounded-xl">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                      Reasoning
                    </span>
                    <p className="mt-1 text-[var(--text-primary)] leading-relaxed font-sans">
                      {nvidiaResult.recommendation?.reasoning}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-[var(--text-muted)]">
                  Klik "Jalankan Komparasi Paralel" untuk menguji respons.
                </div>
              )}
            </Card>

            {/* Gemini Column */}
            <Card className="p-5 border-purple-100 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold text-xs">
                    GE
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">Google Gemini</h3>
                    <span className="text-[11px] text-[var(--text-muted)]">Gemini 2.5 Flash</span>
                  </div>
                </div>
                {geminiResult?.latency_ms && (
                  <Badge variant="outline">{geminiResult.latency_ms}ms</Badge>
                )}
              </div>

              {compareLoading ? (
                <div className="py-12 text-center text-xs text-[var(--text-muted)] animate-pulse">
                  Menjalankan inferensi Gemini...
                </div>
              ) : geminiError ? (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                  {geminiError}
                </div>
              ) : geminiResult ? (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-[var(--surface)] rounded-xl">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                        Kategori
                      </span>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">
                        {geminiResult.recommendation?.category}
                      </p>
                    </div>
                    <div className="p-2.5 bg-[var(--surface)] rounded-xl">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                        Prioritas
                      </span>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">
                        {geminiResult.recommendation?.priority}
                      </p>
                    </div>
                    <div className="p-2.5 bg-[var(--surface)] rounded-xl">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                        Unit
                      </span>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">
                        {geminiResult.recommendation?.target_unit}
                      </p>
                    </div>
                    <div className="p-2.5 bg-[var(--surface)] rounded-xl">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                        Eskalasi
                      </span>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">
                        {geminiResult.recommendation?.escalation_required ? 'Ya' : 'Tidak'}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-[var(--surface)] rounded-xl">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                      Reasoning
                    </span>
                    <p className="mt-1 text-[var(--text-primary)] leading-relaxed font-sans">
                      {geminiResult.recommendation?.reasoning}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-[var(--text-muted)]">
                  Klik "Jalankan Komparasi Paralel" untuk menguji respons.
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* SINGLE MODEL TAB */}
        <TabsContent value="single" className="space-y-4">
          <Card className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Provider"
                value={singleProvider}
                onChange={(e) => {
                  const p = e.target.value as 'nvidia' | 'gemini'
                  setSingleProvider(p)
                  setSingleModel(
                    p === 'nvidia'
                      ? 'nvidia/nemotron-3.5-lightning-30b-a3b'
                      : 'gemini-2.5-flash'
                  )
                }}
              >
                <option value="nvidia">NVIDIA NIM</option>
                <option value="gemini">Google Gemini</option>
              </Select>
              <Input
                label="Model Identifier"
                value={singleModel}
                onChange={(e) => setSingleModel(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={handleRunSingle} loading={singleLoading}>
                <Play size={14} />
                <span>Uji Inferensi Tunggal</span>
              </Button>
            </div>
          </Card>

          {singleResult && (
            <Card className="p-6 space-y-3">
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Hasil Inferensi ({singleResult.provider} • {singleResult.model})
              </h3>
              <pre className="p-4 bg-[var(--surface)] rounded-2xl text-xs font-mono overflow-x-auto text-[var(--text-primary)]">
                {JSON.stringify(singleResult, null, 2)}
              </pre>
            </Card>
          )}

          {singleError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl">
              {singleError}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
