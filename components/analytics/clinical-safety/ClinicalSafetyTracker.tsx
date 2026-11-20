'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldAlert, ShieldCheck, AlertOctagon, CheckCircle2 } from 'lucide-react'
import { ClinicalSafetyReport } from '@/lib/statistics/classification/safety-metrics'

interface ClinicalSafetyTrackerProps {
  report: ClinicalSafetyReport
}

export function ClinicalSafetyTracker({ report }: ClinicalSafetyTrackerProps) {
  const {
    totalHighPriorityCases,
    observedHighPriorityRecall,
    falseNegativesCount,
    wilsonConfidenceInterval95,
    severityDistribution,
    safetyConclusion,
  } = report

  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[var(--color-hairline)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-[var(--color-graphite)]">
              Clinical Safety & Governance
            </span>
            <Badge variant={falseNegativesCount === 0 ? 'success' : 'danger'}>
              {falseNegativesCount === 0 ? 'Zero False Negatives' : `${falseNegativesCount} Under-Triage`}
            </Badge>
          </div>
          <h3 className="text-base font-light text-[var(--color-ink)] mt-1">
            Indikator Keselamatan Klinis: High-Priority Recall Tracker
          </h3>
          <p className="text-xs text-[var(--color-graphite)] mt-0.5">
            Pengawasan ketat terhadap pencegahan under-triage pada kasus kegawatdaruratan klinis pasien
          </p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-light font-mono text-emerald-600">
            {observedHighPriorityRecall.toFixed(1)}%
          </div>
          <span className="text-[11px] font-mono text-[var(--color-smoke)]">
            95% CI: [{wilsonConfidenceInterval95[0].toFixed(1)}%, {wilsonConfidenceInterval95[1].toFixed(1)}%]
          </span>
        </div>
      </div>

      {/* 4 Severity Buckets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-[4px] border border-[var(--color-hairline)] bg-emerald-50/30 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[1px] text-emerald-800 block">
            Benign Discrepancy
          </span>
          <p className="text-xl font-mono text-emerald-700">{severityDistribution.benign}</p>
          <span className="text-[10px] text-[var(--color-smoke)]">Selisih administrasi ringan</span>
        </div>

        <div className="p-3.5 rounded-[4px] border border-[var(--color-hairline)] bg-amber-50/30 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[1px] text-amber-800 block">
            Moderate Discrepancy
          </span>
          <p className="text-xl font-mono text-amber-700">{severityDistribution.moderate}</p>
          <span className="text-[10px] text-[var(--color-smoke)]">Divergensi routing unit</span>
        </div>

        <div className="p-3.5 rounded-[4px] border border-[var(--color-hairline)] bg-rose-50/40 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[1px] text-rose-800 block">
            High-Risk Under-Triage
          </span>
          <p className="text-xl font-mono text-rose-700">{severityDistribution.high_risk}</p>
          <span className="text-[10px] text-[var(--color-smoke)]">Prioritas tinggi tertunda</span>
        </div>

        <div className="p-3.5 rounded-[4px] border border-[var(--color-hairline)] bg-red-100/40 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[1px] text-red-900 block font-bold">
            Catastrophic Under-Triage
          </span>
          <p className="text-xl font-mono text-red-800 font-bold">{severityDistribution.catastrophic}</p>
          <span className="text-[10px] text-red-700">Kritis salah dinilai rutin</span>
        </div>
      </div>

      {/* Safety Conclusion Banner */}
      <div className={`p-4 rounded-[4px] border text-xs leading-relaxed font-light ${
        falseNegativesCount === 0
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
          : 'bg-rose-50 border-rose-200 text-rose-900'
      }`}>
        <div className="flex items-start gap-2.5">
          {falseNegativesCount === 0 ? (
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
          ) : (
            <AlertOctagon size={16} className="shrink-0 mt-0.5 text-rose-600" />
          )}
          <div>
            <span className="font-medium font-mono block mb-0.5">Kesimpulan Audit Keselamatan Pasien:</span>
            <p>{safetyConclusion}</p>
            <p className="text-[11px] text-[var(--color-graphite)] font-mono mt-1">
              Denominator Uji: {totalHighPriorityCases} kasus berprioritas tinggi dari total {report.totalCases} kasus korpus penelitian.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
