'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts'
import { NasaTlxReport } from '@/lib/statistics/nasa-tlx/nasa-tlx-engine'

interface NasaTlxRadarChartProps {
  report: NasaTlxReport
}

export function NasaTlxRadarChart({ report }: NasaTlxRadarChartProps) {
  const { radarData } = report

  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[var(--color-hairline)]">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-[var(--color-graphite)] block">
            Cognitive Ergonomics
          </span>
          <h3 className="text-base font-light text-[var(--color-ink)]">
            Dekomposisi Radar 6-Dimensi NASA-TLX
          </h3>
          <p className="text-xs text-[var(--color-graphite)] mt-0.5">
            Perbandingan profil beban kerja kognitif subjektif: Triase Manual vs Berbantuan AI
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#888888]" />
            <span className="text-[var(--color-graphite)]">Manual (Raw: {report.overallRawTlxManual})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--color-electric-violet)]" />
            <span className="text-[var(--color-ink)] font-medium">AI-Assisted (Raw: {report.overallRawTlxAI})</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="var(--color-hairline)" />
            <PolarAngleAxis
              dataKey="subscale"
              tick={{ fontSize: 11, fill: 'var(--color-ink)' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'var(--color-smoke)' }}
            />
            <Radar
              name="Triase Manual (Kontrol)"
              dataKey="manual"
              stroke="#888888"
              fill="#888888"
              fillOpacity={0.2}
            />
            <Radar
              name="Triase AI-Assisted (Intervensi)"
              dataKey="aiAssisted"
              stroke="var(--color-electric-violet)"
              fill="var(--color-electric-violet)"
              fillOpacity={0.35}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '4px',
                border: '1px solid var(--color-hairline)',
                boxShadow: 'none',
                fontSize: '11px',
                backgroundColor: '#ffffff',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-[var(--color-graphite)] font-light leading-relaxed pt-1 border-t border-[var(--color-hairline)]">
        <strong>Interpretasi Hasil:</strong> Semakin sempit poligon berwarna ungu (*AI-Assisted*), semakin rendah beban kerja yang dirasakan petugas administrasi rumah sakit dalam menyelesaikan triase keluhan.
      </p>
    </Card>
  )
}
