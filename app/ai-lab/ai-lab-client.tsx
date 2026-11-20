'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select } from '@/components/ui/select'
import { RobustnessTestRunner } from '@/components/ai-lab/RobustnessTestRunner'
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
  Tag,
  AlertOctagon,
  ArrowRight,
  ShieldAlert,
  Info,
  Check,
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
      let data: any
      try {
        data = await res.json()
      } catch {
        const text = await res.text().catch(() => '')
        throw new Error(`Respon server tidak valid (${res.status}): ${text.slice(0, 100)}`)
      }
      if (!res.ok) throw new Error(data.error || 'Inferensi gagal dijalankan.')
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
        let d: any
        try {
          d = await r.json()
        } catch {
          const text = await r.text().catch(() => '')
          throw new Error(`Respon server tidak valid (${r.status}): ${text.slice(0, 100)}`)
        }
        if (!r.ok) throw new Error(d.error || 'NVIDIA NIM gagal memproses keluhan')
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
        let d: any
        try {
          d = await r.json()
        } catch {
          const text = await r.text().catch(() => '')
          throw new Error(`Respon server tidak valid (${r.status}): ${text.slice(0, 100)}`)
        }
        if (!r.ok) throw new Error(d.error || 'Google Gemini gagal memproses keluhan')
        setGeminiResult(d)
      })
      .catch((e) => setGeminiError(e.message))

    await Promise.all([runNvidia, runGemini])
    setCompareLoading(false)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4 py-2">
      {/* ─── Header Stage ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
            <Cpu size={12} className="text-blue-600" />
            <span>Dual Provider LLM Testbed &amp; Reasoner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            AI Laboratory
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl font-normal leading-relaxed">
            Eksplorasi inferensi model, evaluasi konsistensi taksonomi ganda (NVIDIA Nemotron 3.5 vs Google Gemini 2.5), dan inspeksi rantai penalaran klinis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="px-3 py-1 text-xs font-semibold rounded-lg">
            Dual Provider Active
          </Badge>
        </div>
      </div>

      {/* ─── Input Complaint Capsule ──────────────────── */}
      <Card className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span>Teks Kasus Keluhan Uji Coba (De-Identified)</span>
          </label>
          <span className="text-xs text-slate-400 font-mono">
            {complaintText.length} karakter
          </span>
        </div>
        <textarea
          rows={3}
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}
          className="w-full rounded-xl border border-slate-200 p-4 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-normal leading-relaxed bg-slate-50/50 focus:bg-white transition-all resize-y"
          placeholder="Tuliskan narasi keluhan rumah sakit untuk dianalisis..."
        />
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setComplaintText(
                  'Pasien IGD mengeluh telah menunggu 45 menit dengan keluhan nyeri dada menjalar ke punggung dan sesak, namun perawat triase hanya mencatat tensi dan menyuruh duduk di ruang tunggu umum tanpa pemeriksaan EKG segera.'
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition-all cursor-pointer"
            >
              <FileText size={12} className="text-rose-500" />
              <span>Contoh Kasus IGD (Emergency)</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setComplaintText(
                  'Pasien rawat jalan poli bedah sudah 3 jam menunggu dipanggil padahal nomor antrean sudah lewat, petugas konter pendaftaran bersikap acuh tak acuh dan mengatakan dokter sedang rapat tanpa pemberitahuan sebelumnya.'
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition-all cursor-pointer"
            >
              <FileText size={12} className="text-blue-500" />
              <span>Contoh Kasus Poliklinik</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setComplaintText('')}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium"
          >
            Bersihkan Teks
          </button>
        </div>
      </Card>

      {/* ─── Mode Tabs & Testbed ─────────────────────── */}
      <Tabs defaultValue="comparison" className="w-full space-y-6">
        <TabsList className="bg-slate-100/80 p-1 rounded-xl border border-slate-200 inline-flex">
          <TabsTrigger
            value="comparison"
            className="rounded-lg px-4 py-2 text-xs font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs"
          >
            Komparasi Ganda (NVIDIA vs Gemini)
          </TabsTrigger>
          <TabsTrigger
            value="single"
            className="rounded-lg px-4 py-2 text-xs font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs"
          >
            Uji Model Tunggal
          </TabsTrigger>
          <TabsTrigger
            value="robustness"
            className="rounded-lg px-4 py-2 text-xs font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs"
          >
            Ketahanan Linguistik &amp; Dialek
          </TabsTrigger>
        </TabsList>

        {/* COMPARISON TAB */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900">
                Uji Paralel Dua Arsitektur LLM
              </h3>
              <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                Kirimkan kasus keluhan secara simultan ke <span className="font-semibold text-emerald-700">NVIDIA Nemotron 3.5 Lightning (30B)</span> dan <span className="font-semibold text-blue-700">Google Gemini 2.5 Flash</span> untuk membandingkan taksonomi, latensi, serta penalarannya.
              </p>
            </div>
            <Button
              size="md"
              onClick={handleRunComparison}
              loading={compareLoading}
              className="shrink-0 h-10 px-5 gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm font-medium cursor-pointer"
            >
              <Split size={14} />
              <span>Jalankan Komparasi Paralel</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NVIDIA Column */}
            <Card className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-5 shadow-xs transition-all hover:shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-xs border border-emerald-200/80 shadow-2xs">
                    NV
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-slate-900">NVIDIA NIM</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                        Reasoning
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Nemotron-3.5 Lightning (30B)
                    </span>
                  </div>
                </div>
                {nvidiaResult?.latency_ms && (
                  <Badge
                    variant="outline"
                    className="font-mono text-xs rounded-lg px-2.5 py-1 bg-slate-50 text-slate-700 border-slate-200"
                  >
                    <Clock size={11} className="mr-1 text-slate-400" />
                    {nvidiaResult.latency_ms}ms
                  </Badge>
                )}
              </div>

              {compareLoading ? (
                <div className="py-20 text-center text-xs text-slate-500 space-y-3">
                  <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-medium text-slate-700">Menjalankan penalaran inferensi NVIDIA NIM...</p>
                  <p className="text-[11px] text-slate-400">Nemotron 3.5 mengevaluasi konteks triase rumah sakit</p>
                </div>
              ) : nvidiaError ? (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-semibold text-rose-900">Kendala Inferensi NVIDIA NIM</h4>
                      <p className="leading-relaxed font-mono text-[11px]">{nvidiaError}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRunComparison}
                    className="w-full text-xs h-8 bg-white hover:bg-rose-100 border-rose-300 text-rose-800 font-medium rounded-lg"
                  >
                    <RotateCcw size={12} className="mr-1.5" />
                    Coba Jalankan Ulang
                  </Button>
                </div>
              ) : nvidiaResult ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Kategori Terpilih
                      </span>
                      <p className="font-semibold text-slate-900">
                        {nvidiaResult.recommendation?.category}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Tingkat Prioritas
                      </span>
                      <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            nvidiaResult.recommendation?.priority?.toLowerCase().includes('kritis') ||
                            nvidiaResult.recommendation?.priority?.toLowerCase().includes('tinggi')
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span>{nvidiaResult.recommendation?.priority}</span>
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Unit Bertanggung Jawab
                      </span>
                      <p className="font-semibold text-slate-900">
                        {nvidiaResult.recommendation?.target_unit}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Status Eskalasi
                      </span>
                      <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                        {nvidiaResult.recommendation?.escalation_required ? (
                          <span className="text-rose-600 flex items-center gap-1">
                            <AlertOctagon size={12} />
                            Wajib Eskalasi Segera
                          </span>
                        ) : (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Tidak Diperlukan
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {nvidiaResult.recommendation?.requires_human_review && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                      <ShieldAlert size={15} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Rekomendasi Human-in-the-Loop</span>
                        <span className="text-amber-800 text-[11px]">
                          Model mendeteksi potensi risiko klinis/keselamatan pasien yang memerlukan verifikasi petugas manusia.
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Penalaran Klinis (Reasoning)
                    </span>
                    <p className="text-slate-800 leading-relaxed font-normal text-xs">
                      {nvidiaResult.recommendation?.reasoning}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                  <Bot size={24} className="mx-auto text-slate-300" />
                  <p className="font-medium">Menunggu perintah inferensi.</p>
                  <p className="text-[11px]">Klik tombol di atas untuk menjalankan pengujian komparatif.</p>
                </div>
              )}
            </Card>

            {/* Gemini Column */}
            <Card className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-5 shadow-xs transition-all hover:shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center font-bold text-xs border border-blue-200/80 shadow-2xs">
                    GE
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-slate-900">Google Gemini</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-semibold">
                        Flash
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Gemini 2.5 Flash
                    </span>
                  </div>
                </div>
                {geminiResult?.latency_ms && (
                  <Badge
                    variant="outline"
                    className="font-mono text-xs rounded-lg px-2.5 py-1 bg-slate-50 text-slate-700 border-slate-200"
                  >
                    <Clock size={11} className="mr-1 text-slate-400" />
                    {geminiResult.latency_ms}ms
                  </Badge>
                )}
              </div>

              {compareLoading ? (
                <div className="py-20 text-center text-xs text-slate-500 space-y-3">
                  <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-medium text-slate-700">Menjalankan inferensi penalaran Google Gemini...</p>
                  <p className="text-[11px] text-slate-400">Gemini 2.5 mengevaluasi konteks triase rumah sakit</p>
                </div>
              ) : geminiError ? (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-semibold text-rose-900">Kendala Inferensi Google Gemini</h4>
                      <p className="leading-relaxed font-mono text-[11px]">{geminiError}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRunComparison}
                    className="w-full text-xs h-8 bg-white hover:bg-rose-100 border-rose-300 text-rose-800 font-medium rounded-lg"
                  >
                    <RotateCcw size={12} className="mr-1.5" />
                    Coba Jalankan Ulang
                  </Button>
                </div>
              ) : geminiResult ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Kategori Terpilih
                      </span>
                      <p className="font-semibold text-slate-900">
                        {geminiResult.recommendation?.category}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Tingkat Prioritas
                      </span>
                      <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            geminiResult.recommendation?.priority?.toLowerCase().includes('kritis') ||
                            geminiResult.recommendation?.priority?.toLowerCase().includes('tinggi')
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span>{geminiResult.recommendation?.priority}</span>
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Unit Bertanggung Jawab
                      </span>
                      <p className="font-semibold text-slate-900">
                        {geminiResult.recommendation?.target_unit}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Status Eskalasi
                      </span>
                      <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                        {geminiResult.recommendation?.escalation_required ? (
                          <span className="text-rose-600 flex items-center gap-1">
                            <AlertOctagon size={12} />
                            Wajib Eskalasi Segera
                          </span>
                        ) : (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Tidak Diperlukan
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {geminiResult.recommendation?.requires_human_review && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                      <ShieldAlert size={15} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Rekomendasi Human-in-the-Loop</span>
                        <span className="text-amber-800 text-[11px]">
                          Model mendeteksi potensi risiko klinis/keselamatan pasien yang memerlukan verifikasi petugas manusia.
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Penalaran Klinis (Reasoning)
                    </span>
                    <p className="text-slate-800 leading-relaxed font-normal text-xs">
                      {geminiResult.recommendation?.reasoning}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                  <Bot size={24} className="mx-auto text-slate-300" />
                  <p className="font-medium">Menunggu perintah inferensi.</p>
                  <p className="text-[11px]">Klik tombol di atas untuk menjalankan pengujian komparatif.</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* SINGLE MODEL TAB */}
        <TabsContent value="single" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Pilih Provider:
              </span>
              <Select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as any)}
                className="h-10 rounded-xl text-xs w-64 border-slate-200 bg-slate-50"
              >
                <option value="nvidia">NVIDIA NIM (Nemotron 3.5 Lightning 30B)</option>
                <option value="gemini">Google Gemini (Gemini 2.5 Flash)</option>
              </Select>
            </div>
            <Button
              size="md"
              onClick={handleRunSingle}
              loading={singleLoading}
              className="h-10 px-5 gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm cursor-pointer"
            >
              <Play size={14} />
              <span>Jalankan Inferensi Tunggal</span>
            </Button>
          </div>

          {singleError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Gagal Melakukan Inferensi</span>
                <span className="font-mono text-[11px]">{singleError}</span>
              </div>
            </div>
          )}

          {singleResult && (
            <Card className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">
                    Hasil Rekomendasi Model ({singleResult.provider?.toUpperCase()})
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Model: {singleResult.model}
                  </span>
                </div>
                <Badge variant="outline" className="font-mono text-xs rounded-lg px-2.5 py-1">
                  <Clock size={11} className="mr-1 text-slate-400" />
                  {singleResult.latency_ms}ms
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Kategori
                  </span>
                  <p className="font-semibold text-slate-900">
                    {singleResult.recommendation?.category}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Prioritas
                  </span>
                  <p className="font-semibold text-slate-900">
                    {singleResult.recommendation?.priority}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Unit
                  </span>
                  <p className="font-semibold text-slate-900">
                    {singleResult.recommendation?.target_unit}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Eskalasi
                  </span>
                  <p className="font-semibold text-slate-900">
                    {singleResult.recommendation?.escalation_required ? 'Ya' : 'Tidak'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Penalaran Model
                </span>
                <p className="text-slate-800 leading-relaxed font-normal">
                  {singleResult.recommendation?.reasoning}
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* ROBUSTNESS & ADVERSARIAL TAB */}
        <TabsContent value="robustness" className="space-y-6">
          <RobustnessTestRunner />
        </TabsContent>
      </Tabs>
    </div>
  )
}
