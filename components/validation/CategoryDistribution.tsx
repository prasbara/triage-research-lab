'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { CohenKappaResult } from '@/lib/validation'

interface CategoryDistributionProps {
  cohen?: CohenKappaResult
}

export function CategoryDistribution({ cohen }: CategoryDistributionProps) {
  if (!cohen || !cohen.category_agreement) return null

  const entries = Object.entries(cohen.category_agreement)

  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-4">
      <div>
        <h3 className="text-base font-light text-[var(--color-ink)]">
          Distribusi Per-Kategori & Specific Agreement Index (Dice-Cicchetti)
        </h3>
        <p className="text-xs text-[var(--color-graphite)] mt-0.5">
          Tingkat kesepakatan bersyarat per domain keluhan (Sk = 2A / (R1 + R2))
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(([cat, data]) => {
          const specificPct = (data.specific_agreement * 100).toFixed(1)
          const totalAssigned = data.rater1_count + data.rater2_count

          return (
            <div
              key={cat}
              className="p-4 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-linen)]/20 space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-light text-sm text-[var(--color-ink)] line-clamp-1" title={cat}>
                  {cat}
                </span>
                <span className="font-mono text-[11px] font-medium text-[var(--color-electric-violet)] shrink-0">
                  {specificPct}%
                </span>
              </div>

              <div className="h-1.5 w-full bg-[var(--color-hairline)] rounded-[4px] overflow-hidden">
                <div
                  className="h-full bg-[var(--color-electric-violet)] rounded-[4px]"
                  style={{ width: `${Math.min(100, Math.max(0, data.specific_agreement * 100))}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-[var(--color-smoke)] font-mono pt-1">
                <span>R1: {data.rater1_count}</span>
                <span>Sepakat: {data.agreed_count}</span>
                <span>R2: {data.rater2_count}</span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
