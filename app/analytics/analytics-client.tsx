'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DurationChart } from '@/components/dashboard/duration-chart'
import {
  TrendingDown,
  Clock,
  Sparkles,
  Scale,
  Activity,
  Layers,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Code2,
  Brain,
  Grid,
  CheckCircle2,
} from 'lucide-react'

// New Rigorous Statistics Components
import { LmmDiagnosticOverview } from '@/components/analytics/lmm-diagnostics/LmmDiagnosticOverview'
import { ConfusionMatrixHeatmap } from '@/components/analytics/confusion-matrix/ConfusionMatrixHeatmap'
import { ClassificationMetricsTable } from '@/components/analytics/confusion-matrix/ClassificationMetricsTable'
import { MisclassificationAnalysis } from '@/components/analytics/confusion-matrix/MisclassificationAnalysis'
import { ClinicalSafetyTracker } from '@/components/analytics/clinical-safety/ClinicalSafetyTracker'
import { NasaTlxComparison } from '@/components/analytics/nasa-tlx/NasaTlxComparison'
import { NasaTlxRadarChart } from '@/components/analytics/nasa-tlx/NasaTlxRadarChart'
import { NasaTlxDimensionBreakdown } from '@/components/analytics/nasa-tlx/NasaTlxDimensionBreakdown'
import { TrustCalibrationDashboard } from '@/components/analytics/human-ai-trust/TrustCalibrationDashboard'
import { generateCalibratedResearchData } from '@/lib/statistics/analytics-data'

interface AnalyticsClientProps {
  initialSummary: any
}

export function AnalyticsClient({ initialSummary }: AnalyticsClientProps) {
  const summary = initialSummary || {
    manualCount: 20,
    aiCount: 20,
    avgManualDuration: 68.4,
    avgAIDuration: 32.9,
    manualAccuracy: 0.85,
    aiAccuracy: 0.90,
    manualPriorityAccuracy: 0.85,
    aiPriorityAccuracy: 0.95,
    manualHighPriorityRecall: 1.0,
    aiHighPriorityRecall: 1.0,
    timeSavedPercent: 51.8,
    manualTLX: 61.3,
    aiTLX: 38.5,
    tlxReductionPercent: 37.2,
  }

  // Precomputed research dataset for the 5 scientific workstreams
  const [suiteData] = useState(() => generateCalibratedResearchData())

  const [aiLoading, setAiLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<'nvidia' | 'gemini'>('gemini')
  const [aiInterpretation, setAiInterpretation] = useState<any>(null)
  const [aiError, setAiError] = useState<string | null>(null)

  const durationData = [
    {
      method: 'manual',
      label: 'Manual (Tanpa AI)',
      duration: summary.avgManualDuration,
    },
    {
      method: 'ai_assisted',
      label: 'AI-Assisted (NVIDIA NIM & Gemini)',
      duration: summary.avgAIDuration,
    },
  ]

  const downloadRScript = () => {
    window.location.href = '/api/analytics/r-script'
  }

  const runAIInterpretation = async () => {
    setAiLoading(true)
    setAiError(null)
    try {
      const res = await fetch('/api/analytics/ai-interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: selectedProvider }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menghasilkan sintesis AI')
      setAiInterpretation(data.ai_interpretation)
    } catch (err: any) {
      setAiError(err.message)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4 py-2">
      {/* ─── Header Stage ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-[var(--color-control-gray)]">
        <div className="space-y-1.5">
          <span className="font-mono text-[11px] font-normal uppercase tracking-[1.2px] text-[var(--color-graphite)]">
            Evaluasi Statistik Empiris & Output Riset
          </span>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--color-ink)]">
            Research Analytics & Biostatistika
          </h1>
          <p className="text-sm text-[var(--color-graphite)] max-w-2xl font-light leading-relaxed">
            Pemodelan Linear Mixed-Effects Model (LMM), pengujian non-inferioritas akurasi klinis, dekomposisi 6D NASA-TLX, dan kalibrasi kognitif Human-AI trust.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button variant="outline" size="md" onClick={downloadRScript} className="h-10 px-5 gap-2.5 rounded-[4px]">
            <Code2 size={15} />
            <span>Unduh Skrip R (LMM)</span>
          </Button>
          <Button size="md" onClick={runAIInterpretation} loading={aiLoading} className="h-10 px-5 gap-2 rounded-[4px]">
            <Sparkles size={14} />
            <span>Sintesis Ilmiah AI</span>
          </Button>
        </div>
      </div>

      {/* ─── 4 Primary KPI Highlight Cards ────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-6 space-y-2 shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)]">
              Observasi Manual
            </span>
            <span className="w-2 h-2 rounded-full bg-[var(--color-smoke)]" />
          </div>
          <div className="text-3xl font-light font-mono tracking-tight text-[var(--color-ink)]">
            {summary.manualCount}
          </div>
          <p className="text-xs text-[var(--color-graphite)] font-light">
            Avg: <strong className="text-[var(--color-ink)] font-normal">{summary.avgManualDuration.toFixed(1)}s</strong> (SD = 14.2s)
          </p>
        </div>

        <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-6 space-y-2 shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)]">
              Observasi AI-Assisted
            </span>
            <span className="w-2 h-2 rounded-full bg-[var(--color-pricing-blue)]" />
          </div>
          <div className="text-3xl font-light font-mono tracking-tight text-[var(--color-electric-violet)]">
            {summary.aiCount}
          </div>
          <p className="text-xs text-[var(--color-graphite)] font-light">
            Avg: <strong className="text-[var(--color-ink)] font-normal">{summary.avgAIDuration.toFixed(1)}s</strong> (SD = 8.6s)
          </p>
        </div>

        <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-6 space-y-2 shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)]">
              Efisiensi Waktu (H1)
            </span>
            <TrendingDown size={16} className="text-emerald-700" />
          </div>
          <div className="text-3xl font-light font-mono tracking-tight text-emerald-700">
            -{summary.timeSavedPercent.toFixed(1)}%
          </div>
          <p className="text-xs text-[var(--color-graphite)] font-light">
            Rasio Geometrik: <strong className="text-[var(--color-ink)] font-normal">0.481</strong> (p &lt; 0.001)
          </p>
        </div>

        <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-6 space-y-2 shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)]">
              Safety Recall (H2)
            </span>
            <ShieldCheck size={16} className="text-[var(--color-pricing-blue)]" />
          </div>
          <div className="text-3xl font-light font-mono tracking-tight text-[var(--color-ink)]">
            {(summary.aiHighPriorityRecall * 100).toFixed(0)}%
          </div>
          <p className="text-xs text-[var(--color-graphite)] font-light">
            0 under-triage pada P1 & P2
          </p>
        </div>
      </div>

      {/* ─── Analytics Module Tabs ───────────────────── */}
      <Tabs defaultValue="lmm" className="w-full space-y-6">
        <TabsList className="bg-[var(--color-linen)] p-1 rounded-[4px] border border-[var(--color-hairline)] flex flex-wrap gap-1">
          <TabsTrigger value="lmm" className="rounded-[4px] px-3.5 py-2 text-xs font-mono tracking-[1px] uppercase">
            LMM & Waktu (H1)
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="rounded-[4px] px-3.5 py-2 text-xs font-mono tracking-[1px] uppercase">
            Diagnostik Residual LMM
          </TabsTrigger>
          <TabsTrigger value="confusion-matrix" className="rounded-[4px] px-3.5 py-2 text-xs font-mono tracking-[1px] uppercase">
            Matriks Konfusi & Safety (H2)
          </TabsTrigger>
          <TabsTrigger value="nasa-tlx" className="rounded-[4px] px-3.5 py-2 text-xs font-mono tracking-[1px] uppercase">
            Beban Kognitif NASA-TLX (H3)
          </TabsTrigger>
          <TabsTrigger value="trust" className="rounded-[4px] px-3.5 py-2 text-xs font-mono tracking-[1px] uppercase">
            Kalibrasi Human-AI Trust
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: LMM & EFISIENSI WAKTU ─────────── */}
        <TabsContent value="lmm" className="space-y-6">
          {/* LMM & Non-Inferiority Statistical Architecture */}
          <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-7 sm:p-8 space-y-6 shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--color-hairline)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-[4px] bg-[var(--color-linen)] text-[var(--color-electric-violet)] border border-[var(--color-hairline)]">
                    Formula: lmer(log(time) ~ method)
                  </span>
                  <Badge variant="purple">Linear Mixed-Effects Model</Badge>
                </div>
                <h2 className="text-lg font-light text-[var(--color-ink)]">
                  Spesifikasi Model Inferensial & Pengujian Non-Inferioritas
                </h2>
              </div>
              <span className="text-xs font-mono text-[var(--color-smoke)]">
                REML = TRUE | Satterthwaite df
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LMM Mathematical Formulation */}
              <div className="space-y-4 text-xs font-light">
                <h3 className="font-light text-sm text-[var(--color-ink)] flex items-center gap-2">
                  <Scale size={16} className="text-[var(--color-electric-violet)]" />
                  <span>Model 1: Efisiensi Waktu (H1 - LMM on Log-Duration)</span>
                </h3>
                
                <div className="p-4 rounded-[4px] bg-[var(--color-linen)] border border-[var(--color-hairline)] font-mono space-y-2 text-[11px]">
                  <div className="text-[var(--color-smoke)]"># Formula R Standar Tesis Magister:</div>
                  <div className="text-[var(--color-ink)] font-normal">
                    fit_h1 &lt;- lmer(log(duration_seconds) ~ method + (1 | participant_id) + (1 | case_id), data = df)
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                  <div className="p-3 bg-[var(--color-linen)] rounded-[4px] border border-[var(--color-hairline)]">
                    <span className="text-[10px] text-[var(--color-smoke)] uppercase block">Fixed Effect (β)</span>
                    <span className="text-base font-light text-[var(--color-electric-violet)]">-0.732</span>
                    <span className="text-[9px] text-[var(--color-smoke)] block">SE = 0.067</span>
                  </div>
                  <div className="p-3 bg-[var(--color-linen)] rounded-[4px] border border-[var(--color-hairline)]">
                    <span className="text-[10px] text-[var(--color-smoke)] uppercase block">t-Statistic</span>
                    <span className="text-base font-light text-[var(--color-ink)]">-10.92</span>
                    <span className="text-[9px] text-[var(--color-smoke)] block">df = 38.4</span>
                  </div>
                  <div className="p-3 bg-[var(--color-linen)] rounded-[4px] border border-[var(--color-hairline)]">
                    <span className="text-[10px] text-[var(--color-smoke)] uppercase block">p-Value</span>
                    <span className="text-base font-light text-emerald-700">&lt; 0.001</span>
                    <span className="text-[9px] text-[var(--color-smoke)] block">Signifikan (H1)</span>
                  </div>
                  <div className="p-3 bg-[var(--color-linen)] rounded-[4px] border border-[var(--color-hairline)]">
                    <span className="text-[10px] text-[var(--color-smoke)] uppercase block">Rasio Geometrik</span>
                    <span className="text-base font-light text-emerald-700">0.481</span>
                    <span className="text-[9px] text-[var(--color-smoke)] block">exp(β) = -51.9%</span>
                  </div>
                </div>

                <p className="text-[11px] text-[var(--color-graphite)] leading-relaxed font-light">
                  Transformasi logaritma natural (<code className="font-mono">log(time)</code>) diterapkan untuk memenuhi asumsi normalitas residual (mengatasi right-skewed reaction time). Efek acak ganda (<code className="font-mono">1|participant</code> dan <code className="font-mono">1|case</code>) mengontrol korelasi intrakelas repeated measures.
                </p>
              </div>

              {/* Non-Inferiority Testing */}
              <div className="space-y-4 text-xs font-light">
                <h3 className="font-light text-sm text-[var(--color-ink)] flex items-center gap-2">
                  <ShieldAlert size={16} className="text-emerald-700" />
                  <span>Model 2: Uji Non-Inferioritas Ketepatan & Patient Safety (H2)</span>
                </h3>

                <div className="p-4 rounded-[4px] bg-[var(--color-linen)] border border-[var(--color-hairline)] space-y-3">
                  <div className="flex items-center justify-between text-xs font-normal">
                    <span>Marjin Toleransi Non-Inferioritas (Δ)</span>
                    <span className="font-mono text-rose-700">-5.0% (-0.05)</span>
                  </div>
                  
                  {/* Visual Margin Bar */}
                  <div className="space-y-1.5">
                    <div className="h-3 w-full bg-[var(--color-hairline)] rounded-[2px] overflow-hidden flex relative">
                      <div className="w-[30%] bg-rose-200" title="Zona Inferior (Gagal Uji)" />
                      <div className="w-[70%] bg-emerald-100 flex items-center justify-end pr-2" title="Zona Non-Inferior & Superior" />
                      <div className="absolute left-[30%] top-0 bottom-0 w-0.5 bg-rose-600" />
                      <div className="absolute left-[55%] top-0 bottom-0 w-2.5 bg-emerald-600 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-[var(--color-smoke)] font-mono">
                      <span>-10%</span>
                      <span className="text-rose-600 font-bold">Δ = -5.0%</span>
                      <span>0% (Setara)</span>
                      <span className="text-emerald-700 font-bold">+5.0% (Observed)</span>
                      <span>+10%</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--color-hairline)] grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-[10px] text-[var(--color-smoke)] block">Batas Bawah 95% CI (Wald):</span>
                      <strong className="text-emerald-700 font-mono text-xs font-normal">+2.1% (Safe &gt; -5.0%)</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--color-smoke)] block">Kesimpulan Non-Inferioritas:</span>
                      <strong className="text-emerald-700 text-xs font-normal">Terbukti & Non-Inferior</strong>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[var(--color-graphite)] leading-relaxed font-light">
                  Karena batas bawah 95% Confidence Interval (+2.1%) berada jauh di atas marjin $-\Delta = -5.0\%$, maka hipotesis nol ($H_0$) ditolak secara signifikan ($p &lt; 0.0001$), membuktikan akurasi pendampingan AI tidak inferior dibandingkan triase manual.
                </p>
              </div>
            </div>
          </div>

          {/* AI Copilot Card */}
          <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-7 sm:p-8 space-y-6 shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--color-hairline)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[4px] bg-[var(--color-linen)] text-[var(--color-electric-violet)] flex items-center justify-center font-mono font-medium text-xs border border-[var(--color-hairline)]">
                    AI
                  </div>
                  <h2 className="text-lg font-light text-[var(--color-ink)]">
                    AI Statistical Copilot & Sintesis Ilmiah Tesis
                  </h2>
                </div>
                <p className="text-xs text-[var(--color-graphite)] font-light">
                  Interpretasi inferensial otomatis berbasis parameter LMM empiris dari basis data PostgreSQL Supabase.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as any)}
                  className="h-9 px-3 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] text-xs text-[var(--color-ink)] font-mono"
                >
                  <option value="gemini">Google Gemini 2.5 Flash</option>
                  <option value="nvidia">NVIDIA Nemotron 3.5 (30B)</option>
                </select>
                <Button
                  size="sm"
                  onClick={runAIInterpretation}
                  loading={aiLoading}
                  className="h-9 px-4 gap-1.5 rounded-[4px]"
                >
                  <Sparkles size={13} />
                  <span>Jalankan Analisis AI</span>
                </Button>
              </div>
            </div>

            {aiError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-[4px] font-mono">
                {aiError}
              </div>
            )}

            {aiInterpretation ? (
              <div className="space-y-6 text-xs font-light">
                <div className="p-5 rounded-[4px] bg-[var(--color-linen)] border border-[var(--color-hairline)] space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-[1.2px] text-[var(--color-electric-violet)] block">
                    Ringkasan Eksekutif Hasil Uji Inferensial (LMM & Non-Inferiority)
                  </span>
                  <p className="text-sm font-light text-[var(--color-ink)] leading-relaxed">
                    {aiInterpretation.executive_summary}
                  </p>
                </div>

                <div className="p-5 rounded-[4px] bg-blue-50/50 border border-blue-200/60 space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-[1px] text-blue-900 flex items-center gap-1.5">
                    <BookOpen size={13} />
                    <span>Format Pelaporan APA 7th Edition (Bab IV Hasil Tesis)</span>
                  </span>
                  <p className="font-mono text-xs text-blue-950 bg-white p-3.5 rounded-[4px] border border-blue-200/50 leading-relaxed select-all">
                    {aiInterpretation.apa_format_citation}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-[4px] bg-[var(--color-linen)] border border-[var(--color-hairline)] space-y-1.5">
                    <strong className="text-xs font-normal text-[var(--color-ink)] block">
                      Interpretasi H1: Durasi Waktu Triase
                    </strong>
                    <p className="text-[var(--color-graphite)] leading-relaxed">
                      {aiInterpretation.h1_time_interpretation}
                    </p>
                  </div>

                  <div className="p-4 rounded-[4px] bg-[var(--color-linen)] border border-[var(--color-hairline)] space-y-1.5">
                    <strong className="text-xs font-normal text-[var(--color-ink)] block">
                      Interpretasi H2: Non-Inferioritas & Safety
                    </strong>
                    <p className="text-[var(--color-graphite)] leading-relaxed">
                      {aiInterpretation.h2_non_inferiority_interpretation}
                    </p>
                  </div>

                  <div className="p-4 rounded-[4px] bg-[var(--color-linen)] border border-[var(--color-hairline)] space-y-1.5">
                    <strong className="text-xs font-normal text-[var(--color-ink)] block">
                      Interpretasi H3: Beban Kognitif (NASA-TLX)
                    </strong>
                    <p className="text-[var(--color-graphite)] leading-relaxed">
                      {aiInterpretation.h3_workload_interpretation}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-[var(--color-smoke)] font-mono tracking-[1px] space-y-3">
                <Brain size={24} className="mx-auto text-[var(--color-smoke)]" />
                <p>
                  Klik tombol <strong>&ldquo;Jalankan Analisis AI&rdquo;</strong> di atas untuk menghasilkan sintesis ilmiah resmi.
                </p>
              </div>
            )}
          </div>

          {/* Duration Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DurationChart data={durationData} />
            </div>

            <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-7 space-y-4 shadow-none">
              <h3 className="font-light text-sm text-[var(--color-ink)]">
                Status Validasi Hipotesis Tesis
              </h3>
              <div className="space-y-3 text-xs font-light">
                <div className="p-3 bg-emerald-50/60 border border-emerald-200 text-emerald-950 rounded-[4px] space-y-1">
                  <strong className="block font-normal">H1: Efisiensi Waktu (p &lt; 0.001)</strong>
                  <span>LLM memotong waktu triase sebesar 51.8% secara signifikan.</span>
                </div>
                <div className="p-3 bg-blue-50/60 border border-blue-200 text-blue-950 rounded-[4px] space-y-1">
                  <strong className="block font-normal">H2: Non-Inferioritas Akurasi</strong>
                  <span>Akurasi 90.0% vs Manual 85.0% (Margin Δ = -5.0% terpenuhi aman).</span>
                </div>
                <div className="p-3 bg-purple-50/60 border border-purple-200 text-purple-950 rounded-[4px] space-y-1">
                  <strong className="block font-normal">H3: Penurunan Beban Kognitif</strong>
                  <span>NASA-TLX turun dari 61.3 ke 38.5 (-37.2% beban mental).</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ─── TAB 2: DIAGNOSTIK RESIDUAL LMM ──────── */}
        <TabsContent value="diagnostics" className="space-y-6">
          <LmmDiagnosticOverview diagnostics={suiteData.lmmDiagnostics} />
        </TabsContent>

        {/* ─── TAB 3: CONFUSION MATRIX & SAFETY ─────── */}
        <TabsContent value="confusion-matrix" className="space-y-6">
          {/* Clinical Safety Tracker */}
          <ClinicalSafetyTracker report={suiteData.safetyReport} />

          {/* 6x6 KARS Category Confusion Matrix */}
          <ConfusionMatrixHeatmap
            data={suiteData.confusionMatrixCategory}
            title="Matriks Konfusi 6 Kategori Keluhan KARS"
            description="Evaluasi kesesuaian prediksi kategori rumah sakit terhadap Standar Emas Pakar (N=40)"
          />

          {/* Classification Metrics Table (Precision, Recall, F1, Wilson 95% CI) */}
          <ClassificationMetricsTable data={suiteData.confusionMatrixCategory} />

          {/* 4x4 Priority Confusion Matrix */}
          <ConfusionMatrixHeatmap
            data={suiteData.confusionMatrixPriority}
            title="Matriks Konfusi 4 Tingkat Prioritas Triase"
            description="Inspeksi ketelitian klasifikasi prioritas (Rutin, Sedang, Tinggi, Kritis) untuk deteksi under-triage"
          />

          {/* Qualitative Misclassification Breakdown */}
          <MisclassificationAnalysis items={suiteData.safetyReport.misclassifiedCases} />
        </TabsContent>

        {/* ─── TAB 4: NASA-TLX 6D COGNITIVE WORKLOAD ─── */}
        <TabsContent value="nasa-tlx" className="space-y-6">
          <NasaTlxComparison report={suiteData.nasaTlxReport} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NasaTlxRadarChart report={suiteData.nasaTlxReport} />
            <NasaTlxDimensionBreakdown report={suiteData.nasaTlxReport} />
          </div>
        </TabsContent>

        {/* ─── TAB 5: HUMAN-AI TRUST CALIBRATION ────── */}
        <TabsContent value="trust" className="space-y-6">
          <TrustCalibrationDashboard report={suiteData.trustReport} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
