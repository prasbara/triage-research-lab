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
  ReferenceLine,
} from 'recharts'
import { ResidualFittedPoint } from '@/lib/statistics/diagnostics/lmm-diagnostics'

interface ResidualFittedPlotProps {
  data: ResidualFittedPoint[]
}

export function ResidualFittedPlot({ data }: ResidualFittedPlotProps) {
  return (
    <Card className="p-5 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-hairline)]">
        <div>
          <h4 className="font-light text-sm text-[var(--color-ink)]">
            Residuals vs Fitted Values Plot
          </h4>
          <span className="text-[11px] text-[var(--color-graphite)] font-light">
            Evaluasi Homoskedastisitas & Linearitas Prediksi Model LMM
          </span>
        </div>
        <span className="text-[10px] font-mono text-[var(--color-smoke)]">N={data.length}</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline)" />
            <XAxis
              dataKey="fittedValue"
              type="number"
              domain={['auto', 'auto']}
              name="Fitted log(Time)"
              tick={{ fontSize: 11, fill: 'var(--color-graphite)' }}
            />
            <YAxis
              dataKey="standardizedResidual"
              type="number"
              domain={[-3.5, 3.5]}
              name="Std Residual"
              tick={{ fontSize: 11, fill: 'var(--color-graphite)' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: any, name: any) => [value, name === 'standardizedResidual' ? 'Std Residual' : 'Fitted']}
              contentStyle={{
                borderRadius: '4px',
                border: '1px solid var(--color-hairline)',
                boxShadow: 'none',
                fontSize: '11px',
                backgroundColor: '#ffffff',
              }}
            />
            {/* Zero reference line */}
            <ReferenceLine y={0} stroke="#111111" strokeWidth={1} />
            {/* Outlier bands +/- 2.5 */}
            <ReferenceLine y={2.5} stroke="#dc2626" strokeDasharray="3 3" />
            <ReferenceLine y={-2.5} stroke="#dc2626" strokeDasharray="3 3" />
            <Scatter
              name="Observations"
              data={data}
              fill="var(--color-electric-violet)"
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-[var(--color-smoke)] italic font-light pt-1">
        Sebaran simetris tanpa pola corong (funnel) menegaskan bahwa tidak terjadi heteroskedastisitas pada durasi triase.
      </p>
    </Card>
  )
}
