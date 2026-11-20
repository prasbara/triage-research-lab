'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, Split, ShieldCheck } from 'lucide-react'

interface ExperimentProgressTrackerProps {
  currentCaseIndex: number
  totalCases: number
  currentPhase: 'manual' | 'ai_assisted'
  timeElapsedSeconds: number
  completedCount: number
}

export function ExperimentProgressTracker({
  currentCaseIndex,
  totalCases,
  currentPhase,
  timeElapsedSeconds,
  completedCount,
}: ExperimentProgressTrackerProps) {
  const percentComplete = totalCases > 0 ? Math.round((completedCount / totalCases) * 100) : 0

  return (
    <Card className="p-5 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--color-hairline)]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-[var(--color-graphite)]">
            Status Sesi Eksperimen
          </span>
          <Badge variant={currentPhase === 'ai_assisted' ? 'purple' : 'outline'}>
            {currentPhase === 'ai_assisted' ? 'AI-Assisted Mode' : 'Manual Baseline Mode'}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[var(--color-smoke)]">
          <div className="flex items-center gap-1.5">
            <Clock size={13} />
            <span>{timeElapsedSeconds}s pada kasus ini</span>
          </div>
          <span>•</span>
          <span>
            {completedCount} dari {totalCases} Selesai ({percentComplete}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-1.5 w-full bg-[var(--color-linen)] rounded-[2px] overflow-hidden">
          <div
            className="h-full bg-[var(--color-ink)] transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[var(--color-smoke)]">
          <span>Kasus {currentCaseIndex + 1}</span>
          <span>Total {totalCases} Kasus Riset</span>
        </div>
      </div>
    </Card>
  )
}
