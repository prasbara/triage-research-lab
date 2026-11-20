'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
      <div className="p-6 rounded-[4px] bg-[var(--color-pure-white)] border border-[var(--color-hairline)] space-y-4 shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-[11px] font-normal uppercase tracking-[1.2px] text-[var(--color-graphite)]">
              Adversarial NLP Benchmark Suite
            </span>
            <h3 className="text-xl font-light text-[var(--color-ink)]">
              Uji Ketahanan Linguistik & Dialek Indonesia
            </h3>
            <p className="text-xs text-[var(--color-graphite)] font-light max-w-2xl">
              Evaluasi kebalikan model LLM terhadap dialek daerah (Jawa/Sunda), singkatan chat informal, teks provokatif/marah (hostile ALL-CAPS), dan keluhan bertumpuk (multitopic) untuk menjamin ketiadaan risiko *under-triage*.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              size="md"
              onClick={handleRunSuite}
              loading={running}
              className="h-10 px-6 gap-2 rounded-[4px]"
            >
              <Play size={14} />
              <span>Jalankan Stress Test ({filteredTests.length} Kasus)</span>
            </Button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--color-hairline)]">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-mono tracking-[0.8px] transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[var(--color-ink)] text-white'
                : 'bg-[var(--color-linen)] text-[var(--color-graphite)] hover:bg-[#e7e4dd]'
            }`}
          >
            Semua Tantangan ({ADVERSARIAL_TEST_CASES.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('dialect')}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-mono tracking-[0.8px] flex items-center gap-1.5 transition-colors ${
              selectedCategory === 'dialect'
                ? 'bg-[var(--color-ink)] text-white'
                : 'bg-[var(--color-linen)] text-[var(--color-graphite)] hover:bg-[#e7e4dd]'
            }`}
          >
            <Globe size={12} />
            <span>Dialek Lokal (Jawa / Sunda)</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('slang')}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-mono tracking-[0.8px] flex items-center gap-1.5 transition-colors ${
              selectedCategory === 'slang'
                ? 'bg-[var(--color-ink)] text-white'
                : 'bg-[var(--color-linen)] text-[var(--color-graphite)] hover:bg-[#e7e4dd]'
            }`}
          >
            <MessageSquare size={12} />
            <span>Chat Slang & Singkatan</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('hostile')}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-mono tracking-[0.8px] flex items-center gap-1.5 transition-colors ${
              selectedCategory === 'hostile'
                ? 'bg-[var(--color-ink)] text-white'
                : 'bg-[var(--color-linen)] text-[var(--color-graphite)] hover:bg-[#e7e4dd]'
            }`}
          >
            <Flame size={12} />
            <span>Emosi Tinggi / ALL-CAPS</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('multitopic')}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-mono tracking-[0.8px] flex items-center gap-1.5 transition-colors ${
              selectedCategory === 'multitopic'
                ? 'bg-[var(--color-ink)] text-white'
                : 'bg-[var(--color-linen)] text-[var(--color-graphite)] hover:bg-[#e7e4dd]'
            }`}
          >
            <Layers size={12} />
            <span>Multitopic / Campuran</span>
          </button>
        </div>
      </div>

      {/* ─── Summary Performance Cards ────────────────── */}
      {testedCount > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-[4px] bg-[var(--color-pure-white)] border border-[var(--color-hairline)] space-y-1">
            <span className="text-[10px] font-mono tracking-[1.2px] text-[var(--color-graphite)] uppercase block">
              Kasus Teruji
            </span>
            <div className="text-2xl font-light font-mono text-[var(--color-ink)]">
              {testedCount} / {filteredTests.length}
            </div>
            <span className="text-[11px] font-mono text-[var(--color-smoke)]">
              Dual parallel execution
            </span>
          </div>

          <div className="p-5 rounded-[4px] bg-[var(--color-pure-white)] border border-[var(--color-hairline)] space-y-1">
            <span className="text-[10px] font-mono tracking-[1.2px] text-[var(--color-graphite)] uppercase block">
              Akurasi Kategori (NV vs GE)
            </span>
            <div className="text-2xl font-light font-mono text-[var(--color-ink)]">
              {testedCount > 0 ? ((nvCorrect / testedCount) * 100).toFixed(0) : 0}% vs{' '}
              {testedCount > 0 ? ((geCorrect / testedCount) * 100).toFixed(0) : 0}%
            </div>
            <span className="text-[11px] font-mono text-[var(--color-smoke)]">
              NVIDIA NIM vs Google Gemini
            </span>
          </div>

          <div className="p-5 rounded-[4px] bg-[var(--color-pure-white)] border border-[var(--color-hairline)] space-y-1">
            <span className="text-[10px] font-mono tracking-[1.2px] text-[var(--color-graphite)] uppercase block">
              Insiden Under-Triage
            </span>
            <div
              className={`text-2xl font-light font-mono ${
                nvUnderTriage === 0 && geUnderTriage === 0
                  ? 'text-emerald-700'
                  : 'text-rose-700'
              }`}
            >
              {nvUnderTriage + geUnderTriage === 0 ? '0 Kasus' : `${nvUnderTriage + geUnderTriage} Kasus`}
            </div>
            <span className="text-[11px] font-mono text-[var(--color-smoke)]">
              Zero Under-triage safety goal
            </span>
          </div>

          <div className="p-5 rounded-[4px] bg-[var(--color-pure-white)] border border-[var(--color-hairline)] space-y-1">
            <span className="text-[10px] font-mono tracking-[1.2px] text-[var(--color-graphite)] uppercase block">
              Safety Verification Pass
            </span>
            <div className="text-2xl font-light font-mono text-emerald-700">
              {nvUnderTriage === 0 && geUnderTriage === 0 ? '100% Passed' : 'Warning'}
            </div>
            <span className="text-[11px] font-mono text-[var(--color-smoke)]">
              Kritis/P1 terdeteksi konsisten
            </span>
          </div>
        </div>
      )}

      {/* ─── Test Cases Grid ─────────────────────────── */}
      <div className="space-y-4">
        {filteredTests.map((tc, idx) => {
          const nvRes = results.nvidia[tc.id]
          const geRes = results.gemini[tc.id]
          const isCurrentlyRunning = running && currentRunningIndex === idx

          return (
            <div
              key={tc.id}
              className={`p-6 rounded-[4px] border bg-[var(--color-pure-white)] space-y-4 transition-all ${
                isCurrentlyRunning
                  ? 'border-[var(--color-electric-violet)] ring-1 ring-[var(--color-electric-violet)]'
                  : 'border-[var(--color-hairline)]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--color-hairline)]">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-[4px] bg-[var(--color-linen)] font-mono text-xs text-[var(--color-ink)] border border-[var(--color-hairline)]">
                    {tc.id}
                  </span>
                  <div>
                    <h4 className="font-light text-sm text-[var(--color-ink)]">{tc.title}</h4>
                    <span className="text-[11px] font-mono text-[var(--color-graphite)]">
                      {tc.category_label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {tc.critical_safety && (
                    <span className="px-2 py-0.5 rounded-[4px] bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-mono uppercase tracking-[1px] flex items-center gap-1">
                      <ShieldAlert size={11} />
                      <span>Critical Safety</span>
                    </span>
                  )}
                  {isCurrentlyRunning && (
                    <span className="px-2 py-0.5 rounded-[4px] bg-purple-50 text-[var(--color-electric-violet)] border border-purple-200 text-[10px] font-mono animate-pulse">
                      Inferensi Sedang Berjalan...
                    </span>
                  )}
                </div>
              </div>

              {/* Complaint Text */}
              <div className="p-3.5 rounded-[4px] bg-[var(--color-canvas-cream)] border border-[var(--color-hairline)] space-y-1">
                <span className="text-[10px] font-mono tracking-[1.2px] text-[var(--color-smoke)] uppercase block">
                  Narasi Input Pasien (Tantangan Linguistik)
                </span>
                <p className="text-xs text-[var(--color-ink)] font-light leading-relaxed font-sans">
                  &ldquo;{tc.text}&rdquo;
                </p>
                <p className="text-[11px] text-[var(--color-graphite)] font-light pt-1 border-t border-[var(--color-hairline)] mt-2">
                  <strong className="font-mono text-[10px]">Tantangan:</strong> {tc.challenge_description}
                </p>
              </div>

              {/* Target Gold Standard vs Model Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Expected Standard */}
                <div className="p-3.5 rounded-[4px] bg-[var(--color-linen)]/50 border border-[var(--color-hairline)] space-y-2">
                  <span className="text-[10px] font-mono tracking-[1.2px] text-[var(--color-smoke)] uppercase block">
                    Standar Acuan (Gold Standard)
                  </span>
                  <div className="space-y-1 text-xs">
                    <p className="text-[var(--color-ink)] font-light">
                      <span className="font-mono text-[10px] text-[var(--color-graphite)]">Kat:</span>{' '}
                      {tc.expected_category}
                    </p>
                    <p className="text-[var(--color-ink)] font-light">
                      <span className="font-mono text-[10px] text-[var(--color-graphite)]">Prio:</span>{' '}
                      {tc.expected_priority}
                    </p>
                    <p className="text-[var(--color-ink)] font-light">
                      <span className="font-mono text-[10px] text-[var(--color-graphite)]">Unit:</span>{' '}
                      {tc.expected_target_unit}
                    </p>
                  </div>
                </div>

                {/* NVIDIA NIM Result */}
                <div className="p-3.5 rounded-[4px] bg-[var(--color-pure-white)] border border-[var(--color-hairline)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-[1.2px] text-[var(--color-smoke)] uppercase block">
                      NVIDIA NIM (Nemotron 3.5)
                    </span>
                    {nvRes && (
                      <Badge variant={nvRes.category_correct ? 'success' : 'danger'}>
                        {nvRes.category_correct ? 'Akurat' : 'Meleset'}
                      </Badge>
                    )}
                  </div>
                  {nvRes ? (
                    <div className="space-y-1 text-xs">
                      <p className="text-[var(--color-ink)] font-light truncate">
                        <span className="font-mono text-[10px] text-[var(--color-graphite)]">Kat:</span>{' '}
                        {nvRes.predicted_category}
                      </p>
                      <p className="text-[var(--color-ink)] font-light truncate">
                        <span className="font-mono text-[10px] text-[var(--color-graphite)]">Prio:</span>{' '}
                        {nvRes.predicted_priority}
                      </p>
                      <p className="text-[11px] text-[var(--color-graphite)] font-light line-clamp-2 pt-1 border-t border-[var(--color-hairline)]">
                        {nvRes.reasoning}
                      </p>
                      <span className="font-mono text-[10px] text-[var(--color-smoke)] block pt-1">
                        Latensi: {nvRes.latency_ms}ms
                      </span>
                    </div>
                  ) : (
                    <div className="py-4 text-center font-mono text-[11px] text-[var(--color-smoke)]">
                      Belum dievaluasi
                    </div>
                  )}
                </div>

                {/* Gemini Result */}
                <div className="p-3.5 rounded-[4px] bg-[var(--color-pure-white)] border border-[var(--color-hairline)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-[1.2px] text-[var(--color-smoke)] uppercase block">
                      Google Gemini (2.5 Flash)
                    </span>
                    {geRes && (
                      <Badge variant={geRes.category_correct ? 'success' : 'danger'}>
                        {geRes.category_correct ? 'Akurat' : 'Meleset'}
                      </Badge>
                    )}
                  </div>
                  {geRes ? (
                    <div className="space-y-1 text-xs">
                      <p className="text-[var(--color-ink)] font-light truncate">
                        <span className="font-mono text-[10px] text-[var(--color-graphite)]">Kat:</span>{' '}
                        {geRes.predicted_category}
                      </p>
                      <p className="text-[var(--color-ink)] font-light truncate">
                        <span className="font-mono text-[10px] text-[var(--color-graphite)]">Prio:</span>{' '}
                        {geRes.predicted_priority}
                      </p>
                      <p className="text-[11px] text-[var(--color-graphite)] font-light line-clamp-2 pt-1 border-t border-[var(--color-hairline)]">
                        {geRes.reasoning}
                      </p>
                      <span className="font-mono text-[10px] text-[var(--color-smoke)] block pt-1">
                        Latensi: {geRes.latency_ms}ms
                      </span>
                    </div>
                  ) : (
                    <div className="py-4 text-center font-mono text-[11px] text-[var(--color-smoke)]">
                      Belum dievaluasi
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
