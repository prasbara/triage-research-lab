'use client'

import { Card } from '@/components/ui/card'

interface ConfusionMatrixProps {
  matrix: Record<string, Record<string, number>>
  labels: string[]
  title?: string
  subtitle?: string
}

export function ConfusionMatrixComponent({
  matrix,
  labels,
  title = 'Matriks Konfusi Klasifikasi Prioritas (Confusion Matrix)',
  subtitle = 'Kesesuaian keputusan staf/AI (Prediksi) vs Adjudikasi Gold Standard (Aktual)',
}: ConfusionMatrixProps) {
  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="font-semibold text-base text-[var(--text-primary)]">{title}</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{subtitle}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-2.5 text-left border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-medium">
                Aktual \ Prediksi
              </th>
              {labels.map((lbl) => (
                <th
                  key={lbl}
                  className="p-2.5 text-center border-b border-[var(--border-subtle)] font-semibold text-[var(--text-primary)]"
                >
                  {lbl}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labels.map((actualLbl) => (
              <tr key={actualLbl} className="border-b border-[var(--border-subtle)]/50">
                <td className="p-2.5 font-semibold text-[var(--text-primary)] bg-[var(--surface-secondary)]/50">
                  {actualLbl}
                </td>
                {labels.map((predLbl) => {
                  const val = matrix[actualLbl]?.[predLbl] || 0
                  const isDiagonal = actualLbl === predLbl
                  const isHighPriorityMismatch =
                    (actualLbl === 'P1' || actualLbl === 'P2') && (predLbl === 'P3' || predLbl === 'P4')

                  return (
                    <td
                      key={predLbl}
                      className={`p-2.5 text-center font-mono font-medium transition-colors ${
                        isDiagonal && val > 0
                          ? 'bg-blue-50 text-[var(--accent)] font-bold'
                          : isHighPriorityMismatch && val > 0
                          ? 'bg-rose-50 text-rose-700 font-bold'
                          : val > 0
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {val}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 pt-2 text-[11px] text-[var(--text-muted)]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-50 border border-blue-200"></span>
          <span>Diagonal Utama (Keputusan Tepat)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-rose-50 border border-rose-200"></span>
          <span>Undertriage Kritis (Under-triage Error)</span>
        </div>
      </div>
    </Card>
  )
}
