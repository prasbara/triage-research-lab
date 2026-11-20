'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ComposedChart,
} from 'recharts'
import { QQPoint } from '@/lib/statistics/diagnostics/lmm-diagnostics'

interface ResidualQQPlotProps {
  data: QQPoint[]
}

export function ResidualQQPlot({ data }: ResidualQQPlotProps) {
  // Determine min and max for 45-degree diagonal reference line
  const minVal = -3
  const maxVal = 3

  const lineData = [
    { x: minVal, y: minVal },
    { x: maxVal, y: maxVal },
  ]

  return (
    <Card className="p-5 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-hairline)]">
        <div>
          <h4 className="font-light text-sm text-[var(--color-ink)]">
            Normal Q-Q Plot Residual
          </h4>
          <span className="text-[11px] text-[var(--color-graphite)] font-light">
            Kuantil Teoritis N(0,1) vs Residual Terstandarisasi Model LMM
          </span>
        </div>
        <span className="text-[10px] font-mono text-[var(--color-smoke)]">N={data.length}</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline)" />
            <XAxis
              dataKey="theoreticalQuantile"
              type="number"
              domain={[-3.2, 3.2]}
              name="Theoretical Quantiles"
              tick={{ fontSize: 11, fill: 'var(--color-graphite)' }}
              unit=""
            />
            <YAxis
              dataKey="sampleQuantile"
              type="number"
              domain={[-3.5, 3.5]}
              name="Sample Residuals"
              tick={{ fontSize: 11, fill: 'var(--color-graphite)' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: any, name: any) => [value, name === 'sampleQuantile' ? 'Sample Quantile' : 'Theoretical']}
              contentStyle={{
                borderRadius: '4px',
                border: '1px solid var(--color-hairline)',
                boxShadow: 'none',
                fontSize: '11px',
                backgroundColor: '#ffffff',
              }}
            />
            {/* 45-degree reference line */}
            <Line
              data={lineData}
              dataKey="y"
              stroke="#888888"
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={false}
            />
            {/* Observation points */}
            <Scatter
              name="Residuals"
              data={data}
              fill="var(--color-electric-violet)"
              shape="circle"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-[var(--color-smoke)] italic font-light pt-1">
        Titik yang berhimpit pada garis putus-putus 45° mengonfirmasi bahwa asumsi normalitas residual terpenuhi.
      </p>
    </Card>
  )
}
