'use client'

import { ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface ClinicalRiskBadgeProps {
  priorityCode?: string
  priorityName?: string
  confidenceScore?: number
}

export function ClinicalRiskBadge({
  priorityCode,
  priorityName,
  confidenceScore,
}: ClinicalRiskBadgeProps) {
  const isHighRisk = priorityCode === 'P1' || priorityCode === 'P2'

  if (isHighRisk) {
    return (
      <div className="p-3 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 flex items-start gap-2.5">
        <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="font-bold flex items-center gap-2">
            <span>PERINGATAN PATIENT SAFETY: Keluhan Kritis ({priorityCode})</span>
            {confidenceScore !== undefined && (
              <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-rose-200/60">
                Confidence: {(confidenceScore * 100).toFixed(0)}%
              </span>
            )}
          </div>
          <p className="text-[11px] text-rose-750 mt-0.5 leading-relaxed">
            Kasus berpotensi membahayakan keselamatan klinis pasien atau reputasi hukum rumah sakit. Segera eskalasikan ke Dokter Jaga / Komite Medis / Humas Direksi.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 text-blue-800 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <Info size={16} className="text-[var(--accent)] shrink-0" />
        <span>Kategori Rutin / Administratif ({priorityName || priorityCode || 'P3/P4'})</span>
      </div>
      {confidenceScore !== undefined && (
        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-100/70 font-semibold text-[var(--accent)]">
          {(confidenceScore * 100).toFixed(0)}% Match
        </span>
      )}
    </div>
  )
}
