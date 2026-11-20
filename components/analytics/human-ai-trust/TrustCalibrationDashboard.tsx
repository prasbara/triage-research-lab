'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrustCalibrationReport } from '@/lib/statistics/trust/trust-calibration'
import { Brain, CheckCircle2, AlertTriangle, Eye, ShieldAlert, ArrowRight } from 'lucide-react'

interface TrustCalibrationDashboardProps {
  report: TrustCalibrationReport
}

export function TrustCalibrationDashboard({ report }: TrustCalibrationDashboardProps) {
  const {
    totalAIAssistedTrials,
    acceptanceRate,
    revisionRate,
    aiStandaloneAccuracy,
    humanFinalAccuracy,
    accuracyGain,
    overRelianceCount,
    overRelianceRate,
    algorithmAversionCount,
    algorithmAversionRate,
    appropriateCorrectionCount,
    meanInspectionTimeMs,
    trustProfileConclusion,
  } = report

  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[var(--color-hairline)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-[var(--color-graphite)]">
              Human-AI Interaction Behavior
            </span>
            <Badge variant="purple">Cognitive Calibration</Badge>
          </div>
          <h3 className="text-base font-light text-[var(--color-ink)] mt-1">
            Analisis Kepercayaan Staf: Over-Reliance & Algorithm Aversion
          </h3>
          <p className="text-xs text-[var(--color-graphite)] mt-0.5">
            Mendeteksi bias kognitif penerimaan otomatis (*Automation Bias*) versus penolakan tanpa dasar (*Algorithm Aversion*)
          </p>
        </div>

        <div className="text-xs font-mono text-[var(--color-smoke)]">
          Total Observasi AI: <strong className="text-[var(--color-ink)]">{totalAIAssistedTrials} Tugas</strong>
        </div>
      </div>

      {/* 4 Core Interaction Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 bg-[var(--color-linen)]/30 rounded-[4px] border border-[var(--color-hairline)] space-y-1">
          <span className="text-[10px] uppercase text-[var(--color-smoke)] block">Tingkat Penerimaan AI</span>
          <span className="text-2xl font-light text-[var(--color-ink)]">{acceptanceRate}%</span>
          <p className="text-[10px] text-[var(--color-smoke)] font-sans">Saran AI langsung disetujui</p>
        </div>

        <div className="p-4 bg-[var(--color-linen)]/30 rounded-[4px] border border-[var(--color-hairline)] space-y-1">
          <span className="text-[10px] uppercase text-[var(--color-electric-violet)] block">Tingkat Revisi Staf</span>
          <span className="text-2xl font-light text-[var(--color-electric-violet)]">{revisionRate}%</span>
          <p className="text-[10px] text-[var(--color-smoke)] font-sans">Human-in-the-Loop modifikasi</p>
        </div>

        <div className="p-4 bg-amber-50/40 rounded-[4px] border border-amber-200/80 space-y-1">
          <span className="text-[10px] uppercase text-amber-800 block">Over-Reliance (Bias)</span>
          <span className="text-2xl font-light text-amber-800">{overRelianceRate}%</span>
          <p className="text-[10px] text-amber-700 font-sans">{overRelianceCount} eror AI disetujui petugas</p>
        </div>

        <div className="p-4 bg-purple-50/40 rounded-[4px] border border-purple-200 space-y-1">
          <span className="text-[10px] uppercase text-purple-800 block">Algorithm Aversion</span>
          <span className="text-2xl font-light text-purple-800">{algorithmAversionRate}%</span>
          <p className="text-[10px] text-purple-700 font-sans">{algorithmAversionCount} saran benar ditolak</p>
        </div>
      </div>

      {/* Accuracy Impact Comparison */}
      <div className="p-4 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-linen)]/20 space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--color-hairline)]">
          <span className="font-light text-sm text-[var(--color-ink)]">
            Dampak Kolaborasi Human-in-the-Loop terhadap Ketepatan
          </span>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>Akurasi Model Murni: <strong>{aiStandaloneAccuracy}%</strong></span>
            <ArrowRight size={12} className="text-[var(--color-smoke)]" />
            <span className="text-emerald-700 font-bold">Akurasi Final Verifikasi: <strong>{humanFinalAccuracy}%</strong></span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[4px] border border-emerald-200">
              (Δ +{accuracyGain}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
          <div>
            <span className="font-mono text-[11px] text-[var(--color-smoke)] block mb-1">Koreksi Berhasil (Supervisi Aktif):</span>
            <p className="text-[var(--color-ink)] leading-relaxed">
              Petugas manusia berhasil mendeteksi dan mengoreksi <strong>{appropriateCorrectionCount} ketidaktepatan AI</strong>, membuktikan bahwa peran manusia tetap vital sebagai pengendali keselamatan klinis (*clinical safeguard*).
            </p>
          </div>
          <div>
            <span className="font-mono text-[11px] text-[var(--color-smoke)] block mb-1">Inspeksi Sebelum Keputusan:</span>
            <p className="text-[var(--color-ink)] leading-relaxed">
              Rata-rata waktu inspeksi rekomendasi AI adalah <strong>{(meanInspectionTimeMs / 1000).toFixed(1)} detik</strong> sebelum eksekusi final, menunjukkan keterlibatan kognitif nyata (*active cognitive processing*), bukan sekadar stempel otomatis (*rubber-stamping*).
            </p>
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="p-3.5 rounded-[4px] bg-[var(--color-pure-white)] border border-[var(--color-hairline)] text-xs text-[var(--color-iron)] font-light leading-relaxed">
        <strong>Kesimpulan Kalibrasi Kepercayaan:</strong> {trustProfileConclusion}
      </div>
    </Card>
  )
}
