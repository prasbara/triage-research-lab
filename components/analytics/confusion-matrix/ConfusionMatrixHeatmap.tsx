'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ConfusionMatrixResult } from '@/lib/statistics/classification/confusion-matrix'

interface ConfusionMatrixHeatmapProps {
  data: ConfusionMatrixResult
  title?: string
  description?: string
}

export function ConfusionMatrixHeatmap({
  data,
  title = 'Matriks Kebingungan Klasifikasi (Confusion Matrix)',
  description = 'Pemetaan distribusi prediksi model AI terhadap Standar Emas Pakar',
}: ConfusionMatrixHeatmapProps) {
  const [mode, setMode] = useState<'counts' | 'recall' | 'precision'>('counts')
  const { classes, matrix, rowNormalizedMatrix, colNormalizedMatrix, totalObservations } = data

  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[var(--color-hairline)]">
        <div>
          <h3 className="text-base font-light text-[var(--color-ink)]">{title}</h3>
          <p className="text-xs text-[var(--color-graphite)] mt-0.5">{description}</p>
        </div>

        <div className="flex items-center gap-1 bg-[var(--color-linen)] p-0.5 rounded-[4px] border border-[var(--color-hairline)] text-xs font-mono">
          <button
            type="button"
            onClick={() => setMode('counts')}
            className={`px-2.5 py-1 rounded-[4px] transition-colors ${
              mode === 'counts'
                ? 'bg-[var(--color-pure-white)] text-[var(--color-ink)] font-medium'
                : 'text-[var(--color-graphite)] hover:text-[var(--color-ink)]'
            }`}
          >
            Jumlah (N={totalObservations})
          </button>
          <button
            type="button"
            onClick={() => setMode('recall')}
            className={`px-2.5 py-1 rounded-[4px] transition-colors ${
              mode === 'recall'
                ? 'bg-[var(--color-pure-white)] text-[var(--color-ink)] font-medium'
                : 'text-[var(--color-graphite)] hover:text-[var(--color-ink)]'
            }`}
          >
            Row-Norm (Recall %)
          </button>
          <button
            type="button"
            onClick={() => setMode('precision')}
            className={`px-2.5 py-1 rounded-[4px] transition-colors ${
              mode === 'precision'
                ? 'bg-[var(--color-pure-white)] text-[var(--color-ink)] font-medium'
                : 'text-[var(--color-graphite)] hover:text-[var(--color-ink)]'
            }`}
          >
            Col-Norm (Precision %)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-[var(--color-hairline)] bg-[var(--color-linen)]/60 text-[10px] font-mono uppercase tracking-[1px] text-[var(--color-graphite)]">
                Standar Emas (True) \ Prediksi AI
              </th>
              {classes.map((cls, idx) => (
                <th
                  key={idx}
                  className="p-2 border border-[var(--color-hairline)] bg-[var(--color-linen)]/40 text-[10px] font-mono uppercase tracking-[1px] text-[var(--color-ink)] max-w-[120px] truncate text-center"
                  title={cls}
                >
                  {cls}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classes.map((trueCls, rIdx) => {
              return (
                <tr key={rIdx} className="hover:bg-[var(--color-linen)]/20 transition-colors">
                  <td
                    className="p-2 border border-[var(--color-hairline)] font-medium text-[var(--color-ink)] bg-[var(--color-linen)]/30 max-w-[140px] truncate"
                    title={trueCls}
                  >
                    {trueCls}
                  </td>
                  {classes.map((_, cIdx) => {
                    const count = matrix[rIdx]?.[cIdx] || 0
                    const isDiagonal = rIdx === cIdx
                    const val =
                      mode === 'counts'
                        ? count
                        : mode === 'recall'
                        ? `${(rowNormalizedMatrix[rIdx]?.[cIdx] || 0).toFixed(1)}%`
                        : `${(colNormalizedMatrix[rIdx]?.[cIdx] || 0).toFixed(1)}%`

                    return (
                      <td
                        key={cIdx}
                        className={`p-2 border border-[var(--color-hairline)] text-center font-mono ${
                          isDiagonal
                            ? count > 0
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'bg-emerald-50/20 text-emerald-600'
                            : count > 0
                            ? 'bg-amber-50 text-amber-900 font-medium'
                            : 'text-[var(--color-smoke)]'
                        }`}
                      >
                        {val}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
