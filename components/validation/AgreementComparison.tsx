'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { CohenKappaResult, GwetAC1Result } from '@/lib/validation'
import { Info } from 'lucide-react'

interface AgreementComparisonProps {
  cohen?: CohenKappaResult
  gwet?: GwetAC1Result
}

export function AgreementComparison({ cohen, gwet }: AgreementComparisonProps) {
  if (!cohen || !gwet) return null

  const difference = gwet.ac1 - cohen.kappa
  const isPrevalenceSkewed = Math.abs(difference) > 0.05

  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-hairline)]">
        <div>
          <h3 className="text-base font-light text-[var(--color-ink)]">
            Komparasi Metodologis: Cohen’s Kappa vs Gwet’s AC1
          </h3>
          <p className="text-xs text-[var(--color-graphite)] mt-0.5">
            Analisis resistensi terhadap paradoks prevalensi (*Prevalence Paradox*) pada distribusi keluhan RS
          </p>
        </div>
        <div className="text-xs font-mono text-[var(--color-graphite)]">
          Δ (AC1 - κ) = <strong className="text-[var(--color-ink)]">{difference > 0 ? `+${difference.toFixed(3)}` : difference.toFixed(3)}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="p-4 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-linen)]/30 space-y-2">
          <div className="flex items-center justify-between font-mono">
            <span className="font-medium text-[var(--color-ink)]">Cohen’s Kappa (1960)</span>
            <span className="text-[var(--color-ink)] font-bold">{cohen.kappa.toFixed(3)}</span>
          </div>
          <p className="text-[var(--color-graphite)] leading-relaxed">
            Peluang kebetulan ($P_e = {(cohen.chance_agreement * 100).toFixed(1)}\%$) dihitung dari perkalian distribusi marginal masing-masing penilai. Ketika satu kategori keluhan sangat mendominasi (misal: antrean poli rawat jalan), $P_e$ meningkat drastis sehingga menekan nilai Kappa ke bawah secara artifisial.
          </p>
        </div>

        <div className="p-4 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-linen)]/30 space-y-2">
          <div className="flex items-center justify-between font-mono">
            <span className="font-medium text-purple-800">Gwet’s AC1 (2008)</span>
            <span className="text-purple-800 font-bold">{gwet.ac1.toFixed(3)}</span>
          </div>
          <p className="text-[var(--color-graphite)] leading-relaxed">
            Peluang kebetulan ($P_e = {(gwet.chance_agreement * 100).toFixed(1)}\%$) dihitung menggunakan rata-rata simetris probabilitas kategori $\pi_k$. AC1 memberikan estimasi reliabilitas yang stabil dan objektif bahkan pada korpus klinis dengan rasio kasus gawat darurat yang sangat rendah (*imbalanced data*).
          </p>
        </div>
      </div>

      {isPrevalenceSkewed && (
        <div className="flex items-start gap-2.5 p-3 rounded-[4px] bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
          <Info size={15} className="shrink-0 mt-0.5 text-amber-700" />
          <p className="leading-relaxed font-light">
            <strong>Catatan Metodologi Tesis:</strong> Terdapat selisih signifikan ({Math.abs(difference).toFixed(3)}) antara Cohen's Kappa dan Gwet's AC1. Ini menandakan korpus keluhan memiliki ketimpangan distribusi prevalensi antar kategori. Disarankan melaporkan kedua koefisien secara berdampingan pada naskah tesis sesuai panduan pelaporan epidemiologi klinis.
          </p>
        </div>
      )}
    </Card>
  )
}
