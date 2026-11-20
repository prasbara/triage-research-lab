'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { ConfusionMatrixResult } from '@/lib/statistics/classification/confusion-matrix'

interface ClassificationMetricsTableProps {
  data: ConfusionMatrixResult
}

export function ClassificationMetricsTable({ data }: ClassificationMetricsTableProps) {
  const { classMetrics, macroPrecision, macroRecall, macroF1, weightedF1, overallAccuracy, balancedAccuracy } = data
  const entries = Object.values(classMetrics)

  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[var(--color-hairline)]">
        <div>
          <h3 className="text-base font-light text-[var(--color-ink)]">
            Metrik Kinerja Klasifikasi Multikelas Terperinci
          </h3>
          <p className="text-xs text-[var(--color-graphite)] mt-0.5">
            Evaluasi Presisi, Recall (Sensitivitas), Spesifisitas, dan F1-Score per Kategori
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-[4px] bg-[var(--color-linen)] border border-[var(--color-hairline)] text-[var(--color-ink)]">
            Akurasi Total: <strong>{(overallAccuracy * 100).toFixed(1)}%</strong>
          </span>
          <span className="px-2.5 py-1 rounded-[4px] bg-[var(--color-linen)] border border-[var(--color-hairline)] text-[var(--color-ink)]">
            Balanced Acc: <strong>{(balancedAccuracy * 100).toFixed(1)}%</strong>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-[var(--color-linen)]/50 border-b border-[var(--color-hairline)] text-[10px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)]">
              <th className="px-4 py-3">Kelas / Kategori</th>
              <th className="px-4 py-3 text-center">Support (N)</th>
              <th className="px-4 py-3 text-center">Precision (%)</th>
              <th className="px-4 py-3 text-center">Recall (%)</th>
              <th className="px-4 py-3 text-center">Specificity (%)</th>
              <th className="px-4 py-3 text-center">F1-Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-hairline)] font-mono text-[11px]">
            {entries.map((metric) => (
              <tr key={metric.className} className="hover:bg-[var(--color-linen)]/20 transition-colors">
                <td className="px-4 py-3 font-sans font-light text-[var(--color-ink)]">
                  {metric.className}
                </td>
                <td className="px-4 py-3 text-center text-[var(--color-graphite)]">
                  {metric.support}
                </td>
                <td className="px-4 py-3 text-center text-[var(--color-ink)]">
                  {(metric.precision * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-center text-[var(--color-ink)]">
                  {(metric.recall * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-center text-[var(--color-ink)]">
                  {(metric.specificity * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-center font-medium text-[var(--color-electric-violet)]">
                  {metric.f1Score.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[var(--color-linen)]/60 font-mono font-medium text-[11px] text-[var(--color-ink)]">
              <td className="px-4 py-3">Macro Average</td>
              <td className="px-4 py-3 text-center">—</td>
              <td className="px-4 py-3 text-center">{(macroPrecision * 100).toFixed(1)}%</td>
              <td className="px-4 py-3 text-center">{(macroRecall * 100).toFixed(1)}%</td>
              <td className="px-4 py-3 text-center">—</td>
              <td className="px-4 py-3 text-center text-[var(--color-electric-violet)]">
                {macroF1.toFixed(3)}
              </td>
            </tr>
            <tr className="bg-[var(--color-linen)]/80 font-mono font-bold text-[11px] text-[var(--color-ink)]">
              <td className="px-4 py-3">Weighted Average</td>
              <td className="px-4 py-3 text-center">{data.totalObservations}</td>
              <td className="px-4 py-3 text-center">—</td>
              <td className="px-4 py-3 text-center">—</td>
              <td className="px-4 py-3 text-center">—</td>
              <td className="px-4 py-3 text-center text-[var(--color-electric-violet)]">
                {weightedF1.toFixed(3)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  )
}
