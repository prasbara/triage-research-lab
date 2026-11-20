'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { ShapiroWilkResult } from '@/lib/statistics/diagnostics/shapiro-wilk'

interface NormalityTestCardProps {
  shapiro: ShapiroWilkResult
  outliersCount: number
  isHomoscedastic: boolean
}

export function NormalityTestCard({
  shapiro,
  outliersCount,
  isHomoscedastic,
}: NormalityTestCardProps) {
  const { wStatistic, pValue, isNormal, sampleSize, interpretation } = shapiro

  return (
    <Card className="p-5 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-hairline)]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)] block">
            Asumsi Inferensial LMM
          </span>
          <h4 className="font-light text-sm text-[var(--color-ink)]">
            Uji Normalitas Shapiro-Wilk Residual
          </h4>
        </div>
        <Badge variant={isNormal ? 'success' : 'warning'}>
          {isNormal ? 'Normal (p >= 0.05)' : 'Deviasi Moderat'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-[var(--color-linen)]/40 rounded-[4px] border border-[var(--color-hairline)]">
          <span className="text-[10px] text-[var(--color-smoke)] block uppercase">W Statistik</span>
          <span className="text-base font-light text-[var(--color-ink)]">{wStatistic.toFixed(4)}</span>
        </div>
        <div className="p-3 bg-[var(--color-linen)]/40 rounded-[4px] border border-[var(--color-hairline)]">
          <span className="text-[10px] text-[var(--color-smoke)] block uppercase">p-Value</span>
          <span className={`text-base font-light ${pValue >= 0.05 ? 'text-emerald-700' : 'text-amber-800'}`}>
            {pValue.toFixed(3)}
          </span>
        </div>
        <div className="p-3 bg-[var(--color-linen)]/40 rounded-[4px] border border-[var(--color-hairline)]">
          <span className="text-[10px] text-[var(--color-smoke)] block uppercase">Homoskedastik</span>
          <span className="text-base font-light text-emerald-700">{isHomoscedastic ? 'Ya' : 'Peringatan'}</span>
        </div>
        <div className="p-3 bg-[var(--color-linen)]/40 rounded-[4px] border border-[var(--color-hairline)]">
          <span className="text-[10px] text-[var(--color-smoke)] block uppercase">Outlier (|r| &gt; 2.5)</span>
          <span className="text-base font-light text-[var(--color-ink)]">{outliersCount} Kasus</span>
        </div>
      </div>

      <div className="p-3.5 rounded-[4px] bg-[var(--color-linen)]/20 border border-[var(--color-hairline)] text-xs text-[var(--color-iron)] leading-relaxed font-light">
        <p>{interpretation}</p>
        <p className="text-[11px] text-[var(--color-smoke)] font-mono mt-1">
          Hipotesis Nol (H0): Residual model berdistribusi normal identik independen ~ N(0, σ²).
        </p>
      </div>
    </Card>
  )
}
