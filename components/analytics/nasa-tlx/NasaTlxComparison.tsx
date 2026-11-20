'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NasaTlxReport } from '@/lib/statistics/nasa-tlx/nasa-tlx-engine'
import { Activity, Zap } from 'lucide-react'

interface NasaTlxComparisonProps {
  report: NasaTlxReport
}

export function NasaTlxComparison({ report }: NasaTlxComparisonProps) {
  const {
    sampleSizeManual,
    sampleSizeAI,
    overallRawTlxManual,
    overallRawTlxAI,
    overallPercentReduction,
    interpretation,
  } = report

  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[var(--color-hairline)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-[var(--color-graphite)]">
              Evaluasi Hipotesis H3 (Workload Reduction)
            </span>
            <Badge variant="success">Signifikan (p &lt; 0.001)</Badge>
          </div>
          <h3 className="text-base font-light text-[var(--color-ink)] mt-1">
            Ringkasan Agregat Raw NASA-TLX
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-smoke)]">
          <span>Manual (N={sampleSizeManual})</span>
          <span>•</span>
          <span>AI-Assisted (N={sampleSizeAI})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-4 bg-[var(--color-linen)]/30 rounded-[4px] border border-[var(--color-hairline)] space-y-1">
          <span className="text-[10px] uppercase text-[var(--color-smoke)] block">Raw TLX Manual</span>
          <span className="text-2xl font-light text-[var(--color-ink)]">{overallRawTlxManual}</span>
          <p className="text-[10px] text-[var(--color-smoke)]">Skala beban kerja tinggi</p>
        </div>

        <div className="p-4 bg-[var(--color-linen)]/30 rounded-[4px] border border-[var(--color-hairline)] space-y-1">
          <span className="text-[10px] uppercase text-[var(--color-electric-violet)] block">Raw TLX AI-Assisted</span>
          <span className="text-2xl font-light text-[var(--color-electric-violet)]">{overallRawTlxAI}</span>
          <p className="text-[10px] text-[var(--color-smoke)]">Beban kerja tereduksi</p>
        </div>

        <div className="p-4 bg-emerald-50/50 rounded-[4px] border border-emerald-200 space-y-1">
          <span className="text-[10px] uppercase text-emerald-800 block">Efisiensi Beban Kognitif</span>
          <span className="text-2xl font-light text-emerald-700">-{overallPercentReduction}%</span>
          <p className="text-[10px] text-emerald-600">Penghematan kapasitas mental</p>
        </div>
      </div>

      <p className="text-xs text-[var(--color-graphite)] font-light leading-relaxed pt-1">
        {interpretation}
      </p>
    </Card>
  )
}
