'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface DurationChartProps {
  data?: {
    method: string
    duration: number
    label: string
  }[]
}

export function DurationChart({ data }: DurationChartProps) {
  const chartData = data && data.length > 0 ? data : [
    { method: 'manual', label: 'Manual (Tanpa AI)', duration: 0 },
    { method: 'ai_assisted', label: 'AI-Assisted (Pendampingan LLM)', duration: 0 },
  ]

  const hasRealData = data && data.some((d) => d.duration > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perbandingan Durasi Triase (Hasil Observasi)</CardTitle>
        <CardDescription>
          Rata-rata waktu penyelesaian triase administratif keluhan (dalam detik)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasRealData ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dedbd6" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: '#585858' }}
                  axisLine={{ stroke: '#dedbd6' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#585858' }}
                  axisLine={{ stroke: '#dedbd6' }}
                  unit="s"
                />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toFixed(1)} detik`, 'Rata-rata Waktu']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: 4,
                    border: '1px solid #dedbd6',
                    boxShadow: 'none',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="duration" radius={[2, 2, 0, 0]} maxBarSize={56}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.method === 'manual' ? '#585858' : '#0007cb'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-center p-6 bg-[var(--color-linen)] rounded-[4px] border border-[var(--color-hairline)]">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Belum ada observasi tugas triage yang tercatat.
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm">
              Grafik komparasi durasi akan dihitung secara otomatis saat partisipan menyelesaikan sesi triase di modul Eksperimen.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
