'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Edit3, ArrowRight, AlertCircle } from 'lucide-react'

interface HITLRevisionLoggerProps {
  originalCategory?: string
  modifiedCategory?: string
  originalPriority?: string
  modifiedPriority?: string
  originalUnit?: string
  modifiedUnit?: string
  revisionReason: string
  onReasonChange: (reason: string) => void
}

export function HITLRevisionLogger({
  originalCategory,
  modifiedCategory,
  originalPriority,
  modifiedPriority,
  originalUnit,
  modifiedUnit,
  revisionReason,
  onReasonChange,
}: HITLRevisionLoggerProps) {
  const isCategoryChanged = originalCategory && modifiedCategory && originalCategory !== modifiedCategory
  const isPriorityChanged = originalPriority && modifiedPriority && originalPriority !== modifiedPriority
  const isUnitChanged = originalUnit && modifiedUnit && originalUnit !== modifiedUnit
  const hasModifications = isCategoryChanged || isPriorityChanged || isUnitChanged

  if (!hasModifications) return null

  return (
    <Card className="p-4 border-amber-300 bg-amber-50/20 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-amber-800">
          <Edit3 size={15} />
          <h4 className="font-bold text-xs">Pencatatan Modifikasi Human-in-the-Loop (HITL)</h4>
        </div>
        <Badge variant="warning">Perubahan Terdeteksi</Badge>
      </div>

      <p className="text-[11px] text-[var(--text-secondary)]">
        Sistem mendeteksi Anda mengubah rekomendasi awal dari model AI. Sesuai metodologi riset, log deviasi ini akan dicatat untuk analisis akurasi dan safety.
      </p>

      <div className="space-y-1.5 text-xs">
        {isCategoryChanged && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-amber-200">
            <span className="text-[11px] text-[var(--text-muted)] w-16">Kategori:</span>
            <span className="line-through text-rose-600">{originalCategory}</span>
            <ArrowRight size={12} className="text-[var(--text-muted)]" />
            <span className="font-bold text-emerald-700">{modifiedCategory}</span>
          </div>
        )}

        {isPriorityChanged && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-amber-200">
            <span className="text-[11px] text-[var(--text-muted)] w-16">Prioritas:</span>
            <span className="line-through text-rose-600">{originalPriority}</span>
            <ArrowRight size={12} className="text-[var(--text-muted)]" />
            <span className="font-bold text-emerald-700">{modifiedPriority}</span>
          </div>
        )}

        {isUnitChanged && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-amber-200">
            <span className="text-[11px] text-[var(--text-muted)] w-16">Unit:</span>
            <span className="line-through text-rose-600">{originalUnit}</span>
            <ArrowRight size={12} className="text-[var(--text-muted)]" />
            <span className="font-bold text-emerald-700">{modifiedUnit}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-[var(--text-primary)] block">
          Alasan Klinis / Pertimbangan Modifikasi (Wajib untuk Audit):
        </label>
        <Textarea
          placeholder="Contoh: Pasien memiliki riwayat syok anafilaksis, prioritas dinaikkan dari P3 ke P1..."
          value={revisionReason}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onReasonChange(e.target.value)}
          className="text-xs min-h-[64px]"
        />
      </div>
    </Card>
  )
}
