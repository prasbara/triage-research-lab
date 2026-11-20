'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shuffle, Check, ArrowRight } from 'lucide-react'

export function RandomizationOverview() {
  const sequences = [
    {
      group: 'Kelompok Urutan A (N=10)',
      phase1: 'Manual Baseline (Blok 1)',
      phase2: 'AI-Assisted NIM (Blok 2)',
      washout: 'Istirahat Kognitif 10 Menit',
      order: 'Manual → AI',
    },
    {
      group: 'Kelompok Urutan B (N=10)',
      phase1: 'AI-Assisted NIM (Blok 1)',
      phase2: 'Manual Baseline (Blok 2)',
      washout: 'Istirahat Kognitif 10 Menit',
      order: 'AI → Manual',
    },
  ]

  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--color-hairline)]">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-[var(--color-graphite)]">
            Metodologi Kuasi-Eksperimen
          </span>
          <h4 className="text-base font-light text-[var(--color-ink)] mt-0.5">
            Skema Penyilangan Berimbang (Counterbalanced Latin Square 2x2)
          </h4>
        </div>
        <Badge variant="purple">Controlled Within-Subject</Badge>
      </div>

      <div className="space-y-3">
        {sequences.map((seq) => (
          <div
            key={seq.group}
            className="p-4 rounded-[4px] bg-[var(--color-canvas-cream)] border border-[var(--color-hairline)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <span className="font-mono text-xs font-medium text-[var(--color-ink)] block">
                {seq.group}
              </span>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--color-graphite)]">
                <span className="px-2 py-0.5 rounded-[2px] bg-[var(--color-linen)] border border-[var(--color-hairline)]">
                  {seq.phase1}
                </span>
                <ArrowRight size={12} className="text-[var(--color-smoke)]" />
                <span className="px-2 py-0.5 rounded-[2px] bg-[var(--color-linen)] border border-[var(--color-hairline)]">
                  {seq.phase2}
                </span>
              </div>
            </div>

            <div className="text-right sm:text-right shrink-0">
              <span className="font-mono text-[11px] text-[var(--color-electric-violet)] block font-medium">
                {seq.order}
              </span>
              <span className="text-[10px] text-[var(--color-smoke)] font-mono">
                {seq.washout}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
