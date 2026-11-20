'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { formatDuration } from '@/lib/utils/format'

interface DurationChartProps {
  manualMean: number
  aiMean: number
  pDifference: number
  manualMedian?: number
  aiMedian?: number
}

export function DurationChart({
  manualMean,
  aiMean,
  pDifference,
  manualMedian,
  aiMedian,
}: DurationChartProps) {
  const chartData = [
    {
      name: 'Triase Manual (Kontrol)',
      mean: parseFloat(manualMean.toFixed(1)),
      median: manualMedian ? parseFloat(manualMedian.toFixed(1)) : undefined,
      fill: '#585858',
    },
    {
      name: 'Triase AI-Assisted (Intervensi)',
      mean: parseFloat(aiMean.toFixed(1)),
      median: aiMedian ? parseFloat(aiMedian.toFixed(1)) : undefined,
      fill: '#0007cb',
    },
  ]

  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-light text-[var(--color-ink)]">
              Perbandingan Waktu Triase Rata-Rata (Detik)
            </CardTitle>
            <CardDescription className="text-xs text-[var(--color-graphite)] mt-0.5">
              Evaluasi Hipotesis H1 (Efisiensi Waktu: Manual vs LLM-Assisted)
            </CardDescription>
          </div>
          {pDifference > 0 && (
            <span className="text-[11px] font-mono tracking-[1px] uppercase font-semibold px-2.5 py-1 rounded-[4px] bg-emerald-50 text-emerald-700 border border-emerald-200">
              Δ -{pDifference.toFixed(1)}% Lebih Cepat
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-hairline)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-graphite)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-graphite)' }} unit="s" />
              <Tooltip
                formatter={(val: any) => [`${val} detik`, 'Rata-rata Waktu']}
                contentStyle={{
                  borderRadius: '4px',
                  border: '1px solid var(--color-hairline)',
                  boxShadow: 'none',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="mean" radius={[2, 2, 0, 0]} maxBarSize={56} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--color-hairline)] grid grid-cols-2 gap-4 text-center">
          <div>
            <span className="text-xs text-[var(--color-smoke)] block">Mean Manual:</span>
            <span className="text-sm font-light text-[var(--color-ink)]">{formatDuration(manualMean)}</span>
          </div>
          <div>
            <span className="text-xs text-[var(--color-smoke)] block">Mean AI-Assisted:</span>
            <span className="text-sm font-light text-[var(--color-ink)]">{formatDuration(aiMean)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
