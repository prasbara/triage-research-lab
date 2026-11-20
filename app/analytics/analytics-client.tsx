'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DurationChart } from '@/components/dashboard/duration-chart'
import {
  BarChart2,
  TrendingDown,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  Code2,
  FileSpreadsheet,
} from 'lucide-react'

interface AnalyticsClientProps {
  initialSummary: any
}

export function AnalyticsClient({ initialSummary }: AnalyticsClientProps) {
  const summary = initialSummary || {
    manualCount: 0,
    aiCount: 0,
    avgManualDuration: 0,
    avgAIDuration: 0,
    manualAccuracy: 0,
    aiAccuracy: 0,
    timeSavedPercent: 0,
  }

  const durationData = [
    {
      method: 'manual',
      label: 'Manual (Tanpa AI)',
      duration: summary.avgManualDuration,
    },
    {
      method: 'ai_assisted',
      label: 'AI-Assisted (LLM)',
      duration: summary.avgAIDuration,
    },
  ]

  const downloadRScript = () => {
    const script = `# TRIAGE Research Lab — Reproducible R Analysis Script
# Penelitian: Efektivitas Pendampingan LLM dalam Triase Keluhan Rumah Sakit
# Model: Linear Mixed-Effects Model (LMM) & Generalized Linear Mixed Model (GLMM)

library(lme4)
library(lmerTest)
library(emmeans)
library(ggplot2)
library(dplyr)

# 1. Load observation dataset
# data <- read.csv("triage-tasks-observations.csv")

# 2. Primary Hypothesis H1: Waktu Triase (Duration)
# Model LMM dengan random effect participant dan case
# fit_time <- lmer(log(duration_seconds) ~ method + condition_block + (1 | participant_id) + (1 | case_id), data = data)
# summary(fit_time)
# anova(fit_time)

# 3. Secondary Hypothesis H2: Ketepatan (Accuracy - Binary)
# fit_acc <- glmer(category_correct ~ method + (1 | participant_id) + (1 | case_id), data = data, family = binomial)
# summary(fit_acc)

# 4. Hypothesis H3: NASA-TLX Workload
# fit_tlx <- lmer(raw_tlx_score ~ method + (1 | participant_id), data = workload_data)
# summary(fit_tlx)

message("R analysis template successfully configured for TRIAGE Research Lab.")
`
    const blob = new Blob([script], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'research-analysis.R'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Research Analytics & Evaluasi Statistik
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Analisis luaran primer (waktu triase) dan luaran sekunder (akurasi, recall prioritas tinggi, beban kerja)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadRScript}>
            <Code2 size={14} />
            <span>Unduh Skrip R (LMM)</span>
          </Button>
        </div>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold uppercase text-[var(--text-muted)]">
            Observasi Manual
          </span>
          <div className="text-2xl font-bold mt-1 text-[var(--text-primary)] font-mono">
            {summary.manualCount}
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-0.5">
            Avg: {summary.avgManualDuration ? `${summary.avgManualDuration.toFixed(1)}s` : '—'}
          </div>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold uppercase text-[var(--text-muted)]">
            Observasi AI-Assisted
          </span>
          <div className="text-2xl font-bold mt-1 text-[var(--accent)] font-mono">
            {summary.aiCount}
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-0.5">
            Avg: {summary.avgAIDuration ? `${summary.avgAIDuration.toFixed(1)}s` : '—'}
          </div>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold uppercase text-[var(--text-muted)]">
            Efisiensi Waktu (H1)
          </span>
          <div className="text-2xl font-bold mt-1 text-emerald-600 font-mono">
            {summary.timeSavedPercent > 0 ? `-${summary.timeSavedPercent.toFixed(1)}%` : '0%'}
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-0.5">
            Penghematan rata-rata
          </div>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold uppercase text-[var(--text-muted)]">
            Akurasi Kategori (H2)
          </span>
          <div className="text-2xl font-bold mt-1 text-[var(--text-primary)] font-mono">
            {summary.aiAccuracy > 0 ? `${(summary.aiAccuracy * 100).toFixed(1)}%` : '—'}
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-0.5">
            vs Manual: {summary.manualAccuracy > 0 ? `${(summary.manualAccuracy * 100).toFixed(1)}%` : '—'}
          </div>
        </Card>
      </div>

      {/* Primary Outcome: Duration Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <DurationChart data={durationData} />
        </div>
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-sm text-[var(--text-primary)]">
              Pengujian Hipotesis Penelitian
            </h3>
            <div className="mt-3 space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/50">
                <span className="font-bold text-[var(--text-primary)] block">
                  H1: Efisiensi Waktu Triase
                </span>
                <p className="text-[var(--text-secondary)] mt-0.5">
                  LLM assistance signifikan mempercepat waktu triase dari pembacaan hingga verifikasi final human-in-the-loop.
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/50">
                <span className="font-bold text-[var(--text-primary)] block">
                  H2: Ketepatan (Non-Inferiority)
                </span>
                <p className="text-[var(--text-secondary)] mt-0.5">
                  Akurasi klasifikasi unit dan prioritas berbantuan LLM tidak lebih rendah dari pemrosesan manual mandiri.
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/50">
                <span className="font-bold text-[var(--text-primary)] block">
                  H3: Beban Kerja (NASA-TLX)
                </span>
                <p className="text-[var(--text-secondary)] mt-0.5">
                  Pendampingan model menurunkan persepsi beban mental dan tuntutan temporal petugas administrasi.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Statistical Methodology & Reproducibility Notice */}
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-[var(--accent)] shrink-0 mt-0.5">
            <Code2 size={20} />
          </div>
          <div className="space-y-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
            <h3 className="font-bold text-sm text-[var(--text-primary)]">
              Transparansi Inferensial & Integritas Ilmiah
            </h3>
            <p>
              Untuk mempertahankan integritas ilmiah tesis magister dan kompatibilitas serverless Vercel, dashboard ini menyajikan statistika deskriptif secara live dari basis data PostgreSQL.
            </p>
            <p>
              Uji inferensial primer menggunakan <strong>Linear Mixed-Effects Model (LMM)</strong> untuk mengontrol variasi antar-partisipan (within-subject repeated measures) dan variasi karakteristik antar-kasus keluhan, yang dapat dieksekusi secara terverifikasi melalui skrip R yang disediakan.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
