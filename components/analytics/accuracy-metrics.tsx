'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle2, ShieldCheck, Activity, Target } from 'lucide-react'
import { formatPercentage } from '@/lib/utils/format'

interface AccuracyMetricsProps {
  manualAccuracy: number
  aiAccuracy: number
  manualHighPriorityRecall: number
  aiHighPriorityRecall: number
  totalEvaluated: number
}

export function AccuracyMetrics({
  manualAccuracy,
  aiAccuracy,
  manualHighPriorityRecall,
  aiHighPriorityRecall,
  totalEvaluated,
}: AccuracyMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Manual Overall Accuracy */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
          <span className="text-xs font-medium">Akurasi Manual (Kontrol)</span>
          <Target size={16} />
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {formatPercentage(manualAccuracy)}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">
            Kesesuaian terhadap Gold Standard Adjudikasi
          </p>
        </div>
      </Card>

      {/* AI-Assisted Overall Accuracy */}
      <Card className="p-5 flex flex-col justify-between border-[var(--accent)]/30 bg-blue-50/20">
        <div className="flex items-center justify-between text-[var(--accent)] mb-2">
          <span className="text-xs font-medium">Akurasi AI-Assisted (Intervensi)</span>
          <CheckCircle2 size={16} />
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-[var(--accent)]">
            {formatPercentage(aiAccuracy)}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">
            {aiAccuracy >= manualAccuracy ? 'Meningkat dibanding manual' : 'Evaluasi performa klinis'}
          </p>
        </div>
      </Card>

      {/* High-Priority Recall Manual */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
          <span className="text-xs font-medium">High-Priority Recall (Manual)</span>
          <Activity size={16} />
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {formatPercentage(manualHighPriorityRecall)}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">
            Sensitivitas keluhan kritis P1/P2 tanpa AI
          </p>
        </div>
      </Card>

      {/* High-Priority Recall AI */}
      <Card className="p-5 flex flex-col justify-between border-emerald-300 bg-emerald-50/30">
        <div className="flex items-center justify-between text-emerald-700 mb-2">
          <span className="text-xs font-medium">High-Priority Recall (AI)</span>
          <ShieldCheck size={16} />
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-emerald-700">
            {formatPercentage(aiHighPriorityRecall)}
          </div>
          <p className="text-[11px] text-emerald-900 mt-1">
            Indikator Patient Safety (Deteksi P1/P2)
          </p>
        </div>
      </Card>
    </div>
  )
}
