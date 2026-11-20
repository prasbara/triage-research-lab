'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scale, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react'
import { CohenKappaResult, GwetAC1Result, FleissKappaResult } from '@/lib/validation'

interface ReliabilityOverviewProps {
  cohen?: CohenKappaResult
  gwet?: GwetAC1Result
  fleiss?: FleissKappaResult
  sampleSize: number
  concordanceRate: number
  disagreementsCount: number
}

export function ReliabilityOverview({
  cohen,
  gwet,
  fleiss,
  sampleSize,
  concordanceRate,
  disagreementsCount,
}: ReliabilityOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Cohen's Kappa */}
      <Card className="p-5 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)]">
            Cohen’s Kappa (κ)
          </span>
          <Scale size={15} className="text-[var(--color-electric-violet)]" />
        </div>
        <div className="text-3xl font-light font-mono text-[var(--color-ink)]">
          {cohen ? cohen.kappa.toFixed(3) : '—'}
        </div>
        <div className="text-xs text-[var(--color-graphite)] leading-relaxed">
          {cohen ? (
            <>
              95% CI: <span className="font-mono">[{cohen.confidence_interval_95[0].toFixed(2)}, {cohen.confidence_interval_95[1].toFixed(2)}]</span>
              <p className="text-[11px] text-[var(--color-smoke)] font-mono mt-0.5">{cohen.interpretation}</p>
            </>
          ) : (
            'Memerlukan minimal 2 penilai'
          )}
        </div>
      </Card>

      {/* 2. Gwet's AC1 */}
      <Card className="p-5 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-[1.2px] text-purple-700">
            Gwet’s AC1 (Prevalence-Adjusted)
          </span>
          <ShieldCheck size={15} className="text-purple-600" />
        </div>
        <div className="text-3xl font-light font-mono text-purple-700">
          {gwet ? gwet.ac1.toFixed(3) : '—'}
        </div>
        <div className="text-xs text-[var(--color-graphite)] leading-relaxed">
          {gwet ? (
            <>
              95% CI: <span className="font-mono">[{gwet.confidence_interval_95[0].toFixed(2)}, {gwet.confidence_interval_95[1].toFixed(2)}]</span>
              <p className="text-[11px] text-purple-600/80 font-mono mt-0.5">Kebal Paradoks Prevalensi</p>
            </>
          ) : (
            'Evaluasi resistensi prevalensi'
          )}
        </div>
      </Card>

      {/* 3. Concordance Rate */}
      <Card className="p-5 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-[1.2px] text-emerald-700">
            Konsensus Langsung (Po)
          </span>
          <CheckCircle2 size={15} className="text-emerald-600" />
        </div>
        <div className="text-3xl font-light font-mono text-emerald-600">
          {concordanceRate.toFixed(1)}%
        </div>
        <div className="text-xs text-[var(--color-graphite)] leading-relaxed">
          {sampleSize - disagreementsCount} dari {sampleSize} kasus sepakat penuh tanpa adjudikasi.
        </div>
      </Card>

      {/* 4. Kasus Disputa */}
      <Card className="p-5 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-[1.2px] text-amber-700">
            Disparitas (Adjudikasi)
          </span>
          <AlertTriangle size={15} className="text-amber-600" />
        </div>
        <div className="text-3xl font-light font-mono text-amber-600">
          {disagreementsCount} Kasus
        </div>
        <div className="text-xs text-[var(--color-graphite)] leading-relaxed">
          Memerlukan panel musyawarah adjudikasi sebelum ditetapkan sebagai Standar Emas.
        </div>
      </Card>
    </div>
  )
}
