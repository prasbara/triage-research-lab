'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  ADVERSARIAL_TEST_CASES,
  AdversarialTestCase,
  AdversarialEvaluationResult,
  evaluateAdversarialResult,
} from '@/lib/ai/adversarial-suite'
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Globe,
  MessageSquare,
  Flame,
  Layers,
} from 'lucide-react'

export function RobustnessTestRunner() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [running, setRunning] = useState(false)
  const [currentRunningIndex, setCurrentRunningIndex] = useState<number>(-1)
  const [results, setResults] = useState<{
    nvidia: Record<string, AdversarialEvaluationResult>
    gemini: Record<string, AdversarialEvaluationResult>
  }>({ nvidia: {}, gemini: {} })

  const filteredTests =
    selectedCategory === 'all'
      ? ADVERSARIAL_TEST_CASES
      : ADVERSARIAL_TEST_CASES.filter((tc) => tc.category === selectedCategory)

  const handleRunSuite = async () => {
    setRunning(true)
    const newResults = { ...results }

    for (let i = 0; i < filteredTests.length; i++) {
      const tc = filteredTests[i]
      setCurrentRunningIndex(i)

      // Run parallel call to both providers
      const runNv = fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: tc.id,
          complaint_text: tc.text,
          provider: 'nvidia',
          model: 'nvidia/nemotron-3.5-lightning-30b-a3b',
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.recommendation) {
            newResults.nvidia[tc.id] = evaluateAdversarialResult(
              tc,
              data.recommendation,
              'nvidia',
              'nvidia/nemotron-3.5-lightning-30b-a3b',
              data.latency_ms || 0
            )
          }
        })
        .catch(() => {})

      const runGe = fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: tc.id,
          complaint_text: tc.text,
          provider: 'gemini',
          model: 'gemini-2.5-flash',
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.recommendation) {
            newResults.gemini[tc.id] = evaluateAdversarialResult(
              tc,
              data.recommendation,
              'gemini',
              'gemini-2.5-flash',
              data.latency_ms || 0
            )
          }
        })
        .catch(() => {})

      await Promise.all([runNv, runGe])
      setResults({ ...newResults })
    }

    setCurrentRunningIndex(-1)
    setRunning(false)
  }

  // Summary Metrics
  const testedCount = Object.keys(results.nvidia).length
  const nvCorrect = Object.values(results.nvidia).filter((r) => r.category_correct).length
  const geCorrect = Object.values(results.gemini).filter((r) => r.category_correct).length

  const nvUnderTriage = Object.values(results.nvidia).filter((r) => r.under_triage).length
  const geUnderTriage = Object.values(results.gemini).filter((r) => r.under_triage).length

  return (
    <div className="space-y-6">
      {/* ─── Control Header ───────────────────────────── */}
      <Card className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 block">
              Adversarial NLP Benchmark Suite
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Uji Ketahanan Linguistik &amp; Dialek Indonesia
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Evaluasi ketahanan model LLM terhadap dialek daerah (Jawa/Sunda), singkatan chat informal, teks provokatif/marah (hostile ALL-CAPS), dan keluhan bertumpuk (multitopic) untuk menjamin ketiadaan risiko <em>under-triage</em>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              size="md"
              onClick={handleRunSuite}
              loading={running}
              className="h-10 px-6 gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm cursor-pointer"
            >
              <Play size={14} />
              <span>Jalankan Stress Test ({filteredTests.length} Kasus)</span>
            </Button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Semua Tantangan ({ADVERSARIAL_TEST_CASES.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('dialect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedCategory === 'dialect'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Globe size={13} />
            <span>Dialek Lokal (Jawa / Sunda)</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('slang')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedCategory === 'slang'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <MessageSquare size={13} />
            <span>Chat Slang &amp; Singkatan</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('hostile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedCategory === 'hostile'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Flame size={13} />
            <span>Emosi Tinggi / ALL-CAPS</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('multitopic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedCategory === 'multitopic'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Layers size={13} />
            <span>Multitopic / Campuran</span>
          </button>
        </div>
      </Card>

      {/* ─── Summary Performance Cards ────────────────── */}
      {testedCount > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-1 shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Kasus Teruji
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {testedCount} / {filteredTests.length}
            </div>
            <span className="text-[11px] text-slate-400">
              Dual parallel execution
            </span>
          </Card>

          <Card className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-1 shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Akurasi Kategori (NV vs GE)
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {testedCount > 0 ? ((nvCorrect / testedCount) * 100).toFixed(0) : 0}% vs{' '}
              {testedCount > 0 ? ((geCorrect / testedCount) * 100).toFixed(0) : 0}%
            </div>
            <span className="text-[11px] text-slate-400">
              NVIDIA NIM vs Google Gemini
            </span>
          </Card>

          <Card className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-1 shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Insiden Under-Triage
            </span>
            <div
              className={`text-2xl font-bold font-mono ${
                nvUnderTriage === 0 && geUnderTriage === 0
                  ? 'text-emerald-700'
                  : 'text-rose-700'
              }`}
            >
              {nvUnderTriage + geUnderTriage === 0 ? '0 Kasus' : `${nvUnderTriage + geUnderTriage} Kasus`}
            </div>
            <span className="text-[11px] text-slate-400">
              Zero Under-triage safety goal
            </span>
          </Card>

          <Card className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-1 shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Safety Verification Pass
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-700">
              {nvUnderTriage === 0 && geUnderTriage === 0 ? '100% Passed' : 'Warning'}
            </div>
            <span className="text-[11px] text-slate-400">
              Kritis/P1 terdeteksi konsisten
            </span>
          </Card>
        </div>
      )}

      {/* ─── Test Cases Grid ─────────────────────────── */}
      <div className="space-y-4">
        {filteredTests.map((tc, idx) => {
          const nvRes = results.nvidia[tc.id]
          const geRes = results.gemini[tc.id]
          const isCurrentlyRunning = running && currentRunningIndex === idx

          return (
            <Card
              key={tc.id}
              className={`p-6 rounded-2xl border bg-white space-y-4 transition-all shadow-xs ${
                isCurrentlyRunning
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-xs font-semibold text-slate-700 border border-slate-200/80">
                    {tc.id}
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">{tc.title}</h4>
                    <span className="text-[11px] text-slate-500">
                      {tc.category_label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {tc.critical_safety && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                      <ShieldAlert size={12} className="text-rose-600" />
                      <span>Critical Safety</span>
                    </span>
                  )}
                  {isCurrentlyRunning && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold animate-pulse">
                      Inferensi Sedang Berjalan...
                    </span>
                  )}
                </div>
              </div>

              {/* Complaint Text */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Narasi Input Pasien (Tantangan Linguistik)
                </span>
                <p className="text-xs text-slate-900 font-normal leading-relaxed">
                  &ldquo;{tc.text}&rdquo;
                </p>
                <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200/60 mt-2">
                  <strong className="font-semibold text-slate-900">Tantangan:</strong> {tc.challenge_description}
                </div>
              </div>

              {/* Target Gold Standard vs Model Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Expected Standard */}
                <div className="p-4 rounded-xl bg-slate-100/60 border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Standar Acuan (Gold Standard)
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-800 font-medium">
                      <span className="font-semibold text-slate-500">Kat:</span> {tc.expected_category}
                    </p>
                    <p className="text-slate-800 font-medium">
                      <span className="font-semibold text-slate-500">Prio:</span> {tc.expected_priority}
                    </p>
                    <p className="text-slate-800 font-medium">
                      <span className="font-semibold text-slate-500">Unit:</span> {tc.expected_target_unit}
                    </p>
                  </div>
                </div>

                {/* NVIDIA NIM Result */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                      NVIDIA NIM (Nemotron 3.5)
                    </span>
                    {nvRes && (
                      <Badge variant={nvRes.category_correct ? 'success' : 'danger'} className="text-[10px] px-2 py-0.5">
                        {nvRes.category_correct ? 'Akurat' : 'Meleset'}
                      </Badge>
                    )}
                  </div>
                  {nvRes ? (
                    <div className="space-y-1 text-xs">
                      <p className="text-slate-800 font-medium truncate">
                        <span className="font-semibold text-slate-500">Kat:</span> {nvRes.predicted_category}
                      </p>
                      <p className="text-slate-800 font-medium truncate">
                        <span className="font-semibold text-slate-500">Prio:</span> {nvRes.predicted_priority}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 pt-1 border-t border-slate-100">
                        {nvRes.reasoning}
                      </p>
                      <span className="font-mono text-[10px] text-slate-400 block pt-1">
                        Latensi: {nvRes.latency_ms}ms
                      </span>
                    </div>
                  ) : (
                    <div className="py-4 text-center font-mono text-[11px] text-slate-400">
                      Belum dievaluasi
                    </div>
                  )}
                </div>

                {/* Gemini Result */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                      Google Gemini (2.5 Flash)
                    </span>
                    {geRes && (
                      <Badge variant={geRes.category_correct ? 'success' : 'danger'} className="text-[10px] px-2 py-0.5">
                        {geRes.category_correct ? 'Akurat' : 'Meleset'}
                      </Badge>
                    )}
                  </div>
                  {geRes ? (
                    <div className="space-y-1 text-xs">
                      <p className="text-slate-800 font-medium truncate">
                        <span className="font-semibold text-slate-500">Kat:</span> {geRes.predicted_category}
                      </p>
                      <p className="text-slate-800 font-medium truncate">
                        <span className="font-semibold text-slate-500">Prio:</span> {geRes.predicted_priority}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 pt-1 border-t border-slate-100">
                        {geRes.reasoning}
                      </p>
                      <span className="font-mono text-[10px] text-slate-400 block pt-1">
                        Latensi: {geRes.latency_ms}ms
                      </span>
                    </div>
                  ) : (
                    <div className="py-4 text-center font-mono text-[11px] text-slate-400">
                      Belum dievaluasi
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
