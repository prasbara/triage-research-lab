'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MisclassificationItem } from '@/lib/statistics/classification/safety-metrics'
import { AlertCircle, AlertTriangle } from 'lucide-react'

interface MisclassificationAnalysisProps {
  items: MisclassificationItem[]
}

export function MisclassificationAnalysis({ items }: MisclassificationAnalysisProps) {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high_risk' | 'catastrophic'>('all')

  const filtered = items.filter((item) => {
    if (severityFilter === 'high_risk') return item.severity === 'high_risk' || item.severity === 'catastrophic'
    if (severityFilter === 'catastrophic') return item.severity === 'catastrophic'
    return true
  })

  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[var(--color-hairline)]">
        <div>
          <h3 className="text-base font-light text-[var(--color-ink)]">
            Analisis Kualitatif Kasus Salah Sasaran (Misclassification Breakdown)
          </h3>
          <p className="text-xs text-[var(--color-graphite)] mt-0.5">
            Daftar kasus di mana rekomendasi AI menyimpang dari Standar Emas Pakar Medis
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[var(--color-linen)] p-0.5 rounded-[4px] border border-[var(--color-hairline)] text-xs font-mono">
          <button
            type="button"
            onClick={() => setSeverityFilter('all')}
            className={`px-2.5 py-1 rounded-[4px] ${
              severityFilter === 'all'
                ? 'bg-[var(--color-pure-white)] text-[var(--color-ink)] font-medium'
                : 'text-[var(--color-graphite)] hover:text-[var(--color-ink)]'
            }`}
          >
            Semua ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setSeverityFilter('high_risk')}
            className={`px-2.5 py-1 rounded-[4px] ${
              severityFilter === 'high_risk'
                ? 'bg-rose-50 text-rose-800 font-medium'
                : 'text-[var(--color-graphite)] hover:text-rose-700'
            }`}
          >
            Risiko Tinggi ({items.filter((i) => i.severity === 'high_risk' || i.severity === 'catastrophic').length})
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[var(--color-smoke)]">
            Tidak ada kasus salah klasifikasi yang terdeteksi pada filter ini.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.caseId}
              className="p-4 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-linen)]/20 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-[var(--color-electric-violet)]">
                  {item.caseCode}
                </span>
                <Badge
                  variant={
                    item.severity === 'catastrophic'
                      ? 'danger'
                      : item.severity === 'high_risk'
                      ? 'warning'
                      : 'outline'
                  }
                >
                  {item.severity.toUpperCase()}
                </Badge>
              </div>

              <p className="text-[var(--color-iron)] font-light leading-relaxed">
                &ldquo;{item.complaintText}&rdquo;
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 bg-[var(--color-pure-white)] rounded-[4px] border border-[var(--color-hairline)]">
                  <span className="text-[10px] text-[var(--color-smoke)] block">Kategori Gold:</span>
                  <span className="text-[var(--color-ink)]">{item.trueCategory}</span>
                </div>
                <div className="p-2 bg-[var(--color-pure-white)] rounded-[4px] border border-[var(--color-hairline)]">
                  <span className="text-[10px] text-[var(--color-smoke)] block">Prediksi AI:</span>
                  <span className="text-amber-800 font-medium">{item.predCategory}</span>
                </div>
                <div className="p-2 bg-[var(--color-pure-white)] rounded-[4px] border border-[var(--color-hairline)]">
                  <span className="text-[10px] text-[var(--color-smoke)] block">Prioritas Gold:</span>
                  <span className="text-[var(--color-ink)]">{item.truePriority}</span>
                </div>
                <div className="p-2 bg-[var(--color-pure-white)] rounded-[4px] border border-[var(--color-hairline)]">
                  <span className="text-[10px] text-[var(--color-smoke)] block">Prioritas AI:</span>
                  <span className="text-amber-800 font-medium">{item.predPriority}</span>
                </div>
              </div>

              <p className="text-[11px] text-[var(--color-graphite)] italic font-light pt-1">
                <strong>Dampak Klinis:</strong> {item.clinicalImpactDescription}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
