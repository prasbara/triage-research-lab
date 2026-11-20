'use client'

import React from 'react'
import { LMMDiagnosticsReport } from '@/lib/statistics/diagnostics/lmm-diagnostics'
import { ResidualQQPlot } from './ResidualQQPlot'
import { ResidualFittedPlot } from './ResidualFittedPlot'
import { NormalityTestCard } from './NormalityTestCard'

interface LmmDiagnosticOverviewProps {
  diagnostics: LMMDiagnosticsReport
}

export function LmmDiagnosticOverview({ diagnostics }: LmmDiagnosticOverviewProps) {
  return (
    <div className="space-y-6">
      <NormalityTestCard
        shapiro={diagnostics.shapiroWilk}
        outliersCount={diagnostics.outliersCount}
        isHomoscedastic={diagnostics.isHomoscedastic}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResidualQQPlot data={diagnostics.qqPlotData} />
        <ResidualFittedPlot data={diagnostics.fittedVsResidualsData} />
      </div>
    </div>
  )
}
