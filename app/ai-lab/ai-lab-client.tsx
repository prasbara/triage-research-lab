'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select } from '@/components/ui/select'
import {
  Cpu,
  Sparkles,
  Bot,
  Split,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  FileText,
  ShieldCheck,
  Building2,
} from 'lucide-react'

interface AILabClientProps {
  supportedModels?: any
}

export function AILabClient({ supportedModels }: AILabClientProps) {
  const [complaintText, setComplaintText] = useState(
    'Pasien IGD mengeluh telah menunggu 45 menit dengan keluhan nyeri dada menjalar ke punggung dan sesak, namun perawat triase hanya mencatat tensi dan menyuruh duduk di ruang tunggu umum tanpa pemeriksaan EKG segera.'
  )

  // Comparison State
  const [compareLoading, setCompareLoading] = useState(false)
  const [nvidiaResult, setNvidiaResult] = useState<any>(null)
  const [geminiResult, setGeminiResult] = useState<any>(null)
  const [nvidiaError, setNvidiaError] = useState<string | null>(null)
  const [geminiError, setGeminiError] = useState<string | null>(null)

  // Single Model State
  const [selectedProvider, setSelectedProvider] = useState<'nvidia' | 'gemini'>('nvidia')
  const [singleLoading, setSingleLoading] = useState(false)
  const [singleResult, setSingleResult] = useState<any>(null)
  const [singleError, setSingleError] = useState<string | null>(null)

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
          provider: selectedProvider,
          model:
            selectedProvider === 'nvidia'
              ? 'nvidia/nemotron-3.5-lightning-30b-a3b'
              : 'gemini-2.5-flash',
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
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4 py-2">
      {/* ─── Header Stage ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-[var(--color-control-gray)]">
        <div className="space-y-1.5">
          <span className="launch-label text-[11px] font-semibold uppercase tracking-wider">
            Dual Provider LLM Testbed & Reasoner
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
            AI Laboratory
          </h1>
          <p className="text-sm text-[var(--color-slate)] max-w-2xl">
            Eksplorasi inferensi model, evaluasi konsistensi taksonomi ganda (NVIDIA Nemotron 3.5 vs Google Gemini 2.5), dan inspeksi penalarannya.
          </p>
        </div>
        <Badge variant="purple">Dual Provider Testbed</Badge>
      </div>

      {/* ─── Input Complaint Capsule ──────────────────── */}
      <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] p-7 space-y-4">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
          Teks Kasus Keluhan Uji Coba (De-Identified)
        </label>
        <textarea
          rows={3}
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}
          className="w-full rounded-2xl border border-[var(--color-hairline-silver)] p-4 text-xs sm:text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-pricing-blue)] font-medium leading-relaxed"
          placeholder="Tuliskan narasi keluhan rumah sakit untuk dianalisis..."
        />
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-[var(--color-slate)]">
            {complaintText.length} karakter
          </span>
          <button
            type="button"
            onClick={() =>
              setComplaintText(
                'Pasien rawat jalan poli bedah sudah 3 jam menunggu dipanggil padahal nomor antrean sudah lewat, petugas konter pendaftaran bersikap acuh tak acuh dan mengatakan dokter sedang rapat tanpa pemberitahuan sebelumnya.'
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--color-apple-blue)] bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200/50 transition-colors cursor-pointer"
          >
            <FileText size={12} />
            <span>Gunakan contoh kasus poliklinik</span>
          </button>
        </div>
      </div>

      {/* ─── Mode Tabs & Testbed ─────────────────────── */}
      <Tabs defaultValue="comparison" className="w-full space-y-6">
        <TabsList className="bg-[var(--color-studio-mist)] p-1 rounded-full border border-[var(--color-control-gray)]">
          <TabsTrigger value="comparison" className="rounded-full px-5 py-2 text-xs font-medium">
            Komparasi Ganda (NVIDIA vs Gemini)
          </TabsTrigger>
          <TabsTrigger value="single" className="rounded-full px-5 py-2 text-xs font-medium">
            Uji Model Tunggal
          </TabsTrigger>
        </TabsList>

        {/* COMPARISON TAB */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-[var(--color-studio-mist)] border border-[var(--color-control-gray)]">
            <p className="text-xs text-[var(--color-slate)] max-w-xl leading-relaxed">
              Kirim teks narasi keluhan secara paralel ke endpoint NVIDIA Nemotron-3.5 Lightning (30B) dan Google Gemini 2.5 Flash untuk menganalisis akurasi, waktu latensi, dan konsistensi penalaran klinis.
            </p>
            <Button
              size="md"
              onClick={handleRunComparison}
              loading={compareLoading}
              className="shrink-0 h-10 px-6 gap-2"
            >
              <Split size={14} />
              <span>Jalankan Komparasi Paralel</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NVIDIA Column */}
            <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-control-gray)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 text-[var(--color-pricing-blue)] rounded-xl flex items-center justify-center font-bold text-xs border border-blue-100">
                    NV
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[var(--color-ink)]">NVIDIA NIM</h3>
                    <span className="text-[11px] text-[var(--color-slate)]">
                      Nemotron-3.5 Lightning (30B)
                    </span>
                  </div>
                </div>
                {nvidiaResult?.latency_ms && (
                  <Badge variant="outline">{nvidiaResult.latency_ms}ms</Badge>
                )}
              </div>

              {compareLoading ? (
                <div className="py-16 text-center text-xs text-[var(--color-slate)] space-y-2">
                  <div className="w-5 h-5 border-2 border-[var(--color-pricing-blue)] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Menjalankan inferensi penalaran NVIDIA NIM...</p>
                </div>
              ) : nvidiaError ? (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl">
                  {nvidiaError}
                </div>
              ) : nvidiaResult ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-[var(--color-studio-mist)] rounded-2xl space-y-1">
                      <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold">
                        Kategori
                      </span>
                      <p className="font-semibold text-[var(--color-ink)]">
                        {nvidiaResult.recommendation?.category}
                      </p>
                    </div>
                    <div className="p-3.5 bg-[var(--color-studio-mist)] rounded-2xl space-y-1">
                      <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold">
                        Prioritas
                      </span>
                      <p className="font-semibold text-[var(--color-ink)]">
                        {nvidiaResult.recommendation?.priority}
                      </p>
                    </div>
                    <div className="p-3.5 bg-[var(--color-studio-mist)] rounded-2xl space-y-1">
                      <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold">
                        Unit
                      </span>
                      <p className="font-semibold text-[var(--color-ink)]">
                        {nvidiaResult.recommendation?.target_unit}
                      </p>
                    </div>
                    <div className="p-3.5 bg-[var(--color-studio-mist)] rounded-2xl space-y-1">
                      <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold">
                        Eskalasi
                      </span>
                      <p className="font-semibold text-[var(--color-ink)]">
                        {nvidiaResult.recommendation?.escalation_required ? 'Ya' : 'Tidak'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--color-studio-mist)] rounded-2xl border border-[var(--color-control-gray)] space-y-1.5">
                    <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold block">
                      Penalaran Klinis (Reasoning)
                    </span>
                    <p className="text-[var(--color-ink)] leading-relaxed">
                      {nvidiaResult.recommendation?.reasoning}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-14 text-center text-xs text-[var(--color-slate)]">
                  Klik tombol di atas untuk menjalankan inferensi model.
                </div>
              )}
            </div>

            {/* Gemini Column */}
            <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-control-gray)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center font-bold text-xs border border-purple-100">
                    GE
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[var(--color-ink)]">Google Gemini</h3>
                    <span className="text-[11px] text-[var(--color-slate)]">
                      Gemini 2.5 Flash
                    </span>
                  </div>
                </div>
                {geminiResult?.latency_ms && (
                  <Badge variant="outline">{geminiResult.latency_ms}ms</Badge>
                )}
              </div>

              {compareLoading ? (
                <div className="py-16 text-center text-xs text-[var(--color-slate)] space-y-2">
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Menjalankan inferensi penalaran Google Gemini...</p>
                </div>
              ) : geminiError ? (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl">
                  {geminiError}
                </div>
              ) : geminiResult ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-[var(--color-studio-mist)] rounded-2xl space-y-1">
                      <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold">
                        Kategori
                      </span>
                      <p className="font-semibold text-[var(--color-ink)]">
                        {geminiResult.recommendation?.category}
                      </p>
                    </div>
                    <div className="p-3.5 bg-[var(--color-studio-mist)] rounded-2xl space-y-1">
                      <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold">
                        Prioritas
                      </span>
                      <p className="font-semibold text-[var(--color-ink)]">
                        {geminiResult.recommendation?.priority}
                      </p>
                    </div>
                    <div className="p-3.5 bg-[var(--color-studio-mist)] rounded-2xl space-y-1">
                      <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold">
                        Unit
                      </span>
                      <p className="font-semibold text-[var(--color-ink)]">
                        {geminiResult.recommendation?.target_unit}
                      </p>
                    </div>
                    <div className="p-3.5 bg-[var(--color-studio-mist)] rounded-2xl space-y-1">
                      <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold">
                        Eskalasi
                      </span>
                      <p className="font-semibold text-[var(--color-ink)]">
                        {geminiResult.recommendation?.escalation_required ? 'Ya' : 'Tidak'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--color-studio-mist)] rounded-2xl border border-[var(--color-control-gray)] space-y-1.5">
                    <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold block">
                      Penalaran Klinis (Reasoning)
                    </span>
                    <p className="text-[var(--color-ink)] leading-relaxed">
                      {geminiResult.recommendation?.reasoning}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-14 text-center text-xs text-[var(--color-slate)]">
                  Klik tombol di atas untuk menjalankan inferensi model.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* SINGLE MODEL TAB */}
        <TabsContent value="single" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-[var(--color-studio-mist)] border border-[var(--color-control-gray)]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[var(--color-ink)]">Pilih Provider:</span>
              <Select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as any)}
                className="h-10 rounded-xl text-xs w-56"
              >
                <option value="nvidia">NVIDIA NIM (Nemotron 3.5)</option>
                <option value="gemini">Google Gemini (Gemini 2.5)</option>
              </Select>
            </div>
            <Button
              size="md"
              onClick={handleRunSingle}
              loading={singleLoading}
              className="h-10 px-6 gap-2"
            >
              <Play size={14} />
              <span>Jalankan Inferensi Tunggal</span>
            </Button>
          </div>

          {singleResult && (
            <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-control-gray)]">
                <span className="font-semibold text-sm text-[var(--color-ink)]">
                  Hasil Rekomendasi Model ({singleResult.provider})
                </span>
                <Badge variant="outline">{singleResult.latency_ms}ms</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 bg-[var(--color-studio-mist)] rounded-2xl space-y-1">
                  <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold">
                    Kategori
                  </span>
                  <p className="font-semibold text-[var(--color-ink)]">
                    {singleResult.recommendation?.category}
                  </p>
                </div>
                <div className="p-3.5 bg-[var(--color-studio-mist)] rounded-2xl space-y-1">
                  <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold">
                    Prioritas
                  </span>
                  <p className="font-semibold text-[var(--color-ink)]">
                    {singleResult.recommendation?.priority}
                  </p>
                </div>
                <div className="p-3.5 bg-[var(--color-studio-mist)] rounded-2xl space-y-1">
                  <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold">
                    Unit
                  </span>
                  <p className="font-semibold text-[var(--color-ink)]">
                    {singleResult.recommendation?.target_unit}
                  </p>
                </div>
                <div className="p-3.5 bg-[var(--color-studio-mist)] rounded-2xl space-y-1">
                  <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold">
                    Eskalasi
                  </span>
                  <p className="font-semibold text-[var(--color-ink)]">
                    {singleResult.recommendation?.escalation_required ? 'Ya' : 'Tidak'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[var(--color-studio-mist)] rounded-2xl border border-[var(--color-control-gray)] space-y-1.5 text-xs">
                <span className="text-[10px] text-[var(--color-slate)] uppercase font-semibold block">
                  Penalaran Model
                </span>
                <p className="text-[var(--color-ink)] leading-relaxed">
                  {singleResult.recommendation?.reasoning}
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
