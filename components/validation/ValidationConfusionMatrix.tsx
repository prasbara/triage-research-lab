'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { CohenKappaResult } from '@/lib/validation'

interface ValidationConfusionMatrixProps {
  cohen?: CohenKappaResult
}

export function ValidationConfusionMatrix({ cohen }: ValidationConfusionMatrixProps) {
  const [viewMode, setViewMode] = useState<'counts' | 'percentages'>('counts')

  if (!cohen || cohen.categories.length === 0) return null

  const { categories, contingency_matrix, sample_size } = cohen

  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--color-hairline)]">
        <div>
          <h3 className="text-base font-light text-[var(--color-ink)]">
            Tabel Kontingensi Penilaian Pakar ({categories.length} × {categories.length})
          </h3>
          <p className="text-xs text-[var(--color-graphite)] mt-0.5">
            Cross-tabulation klasifikasi independen: Pakar 1 (Baris) vs Pakar 2 (Kolom)
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[var(--color-linen)] p-0.5 rounded-[4px] border border-[var(--color-hairline)] text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode('counts')}
            className={`px-3 py-1 rounded-[4px] transition-colors ${
              viewMode === 'counts'
                ? 'bg-[var(--color-pure-white)] text-[var(--color-ink)] font-medium'
                : 'text-[var(--color-graphite)] hover:text-[var(--color-ink)]'
            }`}
          >
            Jumlah Kasus (N)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('percentages')}
            className={`px-3 py-1 rounded-[4px] transition-colors ${
              viewMode === 'percentages'
                ? 'bg-[var(--color-pure-white)] text-[var(--color-ink)] font-medium'
                : 'text-[var(--color-graphite)] hover:text-[var(--color-ink)]'
            }`}
          >
            Persentase (%)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-[var(--color-hairline)] bg-[var(--color-linen)]/60 text-[10px] font-mono uppercase tracking-[1px] text-[var(--color-graphite)]">
                Pakar 1 \ Pakar 2
              </th>
              {categories.map((cat, idx) => (
                <th
                  key={idx}
                  className="p-2 border border-[var(--color-hairline)] bg-[var(--color-linen)]/40 text-[10px] font-mono uppercase tracking-[1px] text-[var(--color-ink)] max-w-[120px] truncate"
                  title={cat}
                >
                  {cat}
                </th>
              ))}
              <th className="p-2 border border-[var(--color-hairline)] bg-[var(--color-linen)]/80 text-[10px] font-mono uppercase font-bold text-[var(--color-ink)]">
                Total R1
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((rCat, rIdx) => {
              const rowSum = contingency_matrix[rIdx]?.reduce((a, b) => a + b, 0) || 0
              return (
                <tr key={rIdx} className="hover:bg-[var(--color-linen)]/20 transition-colors">
                  <td className="p-2 border border-[var(--color-hairline)] font-medium text-[var(--color-ink)] bg-[var(--color-linen)]/30 max-w-[140px] truncate" title={rCat}>
                    {rCat}
                  </td>
                  {categories.map((cCat, cIdx) => {
                    const count = contingency_matrix[rIdx]?.[cIdx] || 0
                    const isDiagonal = rIdx === cIdx
                    const pct = sample_size > 0 ? ((count / sample_size) * 100).toFixed(1) : '0'

                    return (
                      <td
                        key={cIdx}
                        className={`p-2 border border-[var(--color-hairline)] text-center font-mono ${
                          isDiagonal
                            ? count > 0
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'bg-emerald-50/20 text-emerald-600'
                            : count > 0
                            ? 'bg-amber-50 text-amber-900 font-semibold'
                            : 'text-[var(--color-smoke)]'
                        }`}
                      >
                        {viewMode === 'counts' ? count : `${pct}%`}
                      </td>
                    )
                  })}
                  <td className="p-2 border border-[var(--color-hairline)] text-center font-mono font-bold text-[var(--color-ink)] bg-[var(--color-linen)]/30">
                    {viewMode === 'counts' ? rowSum : `${((rowSum / sample_size) * 100).toFixed(1)}%`}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-[var(--color-linen)]/50 font-mono font-bold text-[var(--color-ink)]">
              <td className="p-2 border border-[var(--color-hairline)] text-[10px] uppercase">
                Total R2
              </td>
              {categories.map((_, cIdx) => {
                let colSum = 0
                for (let r = 0; r < categories.length; r++) {
                  colSum += contingency_matrix[r]?.[cIdx] || 0
                }
                return (
                  <td key={cIdx} className="p-2 border border-[var(--color-hairline)] text-center">
                    {viewMode === 'counts' ? colSum : `${((colSum / sample_size) * 100).toFixed(1)}%`}
                  </td>
                )
              })}
              <td className="p-2 border border-[var(--color-hairline)] text-center bg-[var(--color-linen)] text-emerald-800 font-extrabold">
                {viewMode === 'counts' ? sample_size : '100%'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  )
}
