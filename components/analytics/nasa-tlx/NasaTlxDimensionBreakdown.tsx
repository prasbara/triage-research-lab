'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { NasaTlxReport } from '@/lib/statistics/nasa-tlx/nasa-tlx-engine'
import { TrendingDown } from 'lucide-react'

interface NasaTlxDimensionBreakdownProps {
  report: NasaTlxReport
}

export function NasaTlxDimensionBreakdown({ report }: NasaTlxDimensionBreakdownProps) {
  const { dimensions } = report

  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-4">
      <div>
        <h3 className="text-base font-light text-[var(--color-ink)]">
          Rincian Reduksi Beban Kognitif per Dimensi (NASA-TLX Subscales)
        </h3>
        <p className="text-xs text-[var(--color-graphite)] mt-0.5">
          Skala pengukuran subjektif 0–100 (Skor lebih rendah menunjukkan beban lebih ringan)
        </p>
      </div>

      <div className="space-y-3.5">
        {dimensions.map((dim) => {
          return (
            <div
              key={dim.dimension_id}
              className="p-3.5 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-linen)]/20 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-light text-sm text-[var(--color-ink)]">{dim.dimension}</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[4px] border border-emerald-200">
                  <TrendingDown size={12} />
                  Δ -{dim.difference.toFixed(1)} (-{dim.percentReduction.toFixed(1)}%)
                </span>
              </div>

              {/* Comparative bars */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-3">
                  <span className="w-16 font-mono text-[10px] text-[var(--color-smoke)] uppercase">Manual:</span>
                  <div className="flex-1 h-2 bg-[var(--color-hairline)] rounded-[2px] overflow-hidden">
                    <div
                      className="h-full bg-[#888888] rounded-[2px]"
                      style={{ width: `${Math.min(100, dim.manualMean)}%` }}
                    />
                  </div>
                  <span className="w-10 font-mono text-[11px] text-right text-[var(--color-graphite)]">
                    {dim.manualMean}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-16 font-mono text-[10px] text-[var(--color-electric-violet)] uppercase">AI:</span>
                  <div className="flex-1 h-2 bg-[var(--color-hairline)] rounded-[2px] overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-electric-violet)] rounded-[2px]"
                      style={{ width: `${Math.min(100, dim.aiMean)}%` }}
                    />
                  </div>
                  <span className="w-10 font-mono text-[11px] text-right text-[var(--color-ink)] font-medium">
                    {dim.aiMean}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
