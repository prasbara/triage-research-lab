'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, getStatusColor } from '@/lib/utils/format'
import { X, ShieldCheck, Calendar, User, PhoneCall, Building } from 'lucide-react'

interface ComplaintDetailModalProps {
  complaint: any | null
  onClose: () => void
}

export function ComplaintDetailModal({ complaint, onClose }: ComplaintDetailModalProps) {
  if (!complaint) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--color-smoke)] hover:text-[var(--color-ink)]"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-2.5 py-1 rounded-[4px] bg-[var(--color-linen)] text-[var(--color-electric-violet)] border border-[var(--color-hairline)] tracking-[1.2px]">
            {complaint.case_code}
          </span>
          {complaint.is_gold_standard && (
            <Badge variant="success" className="text-[10px] rounded-[4px] font-mono tracking-[1px] uppercase">
              <ShieldCheck size={12} className="mr-1" /> Gold Standard Verified
            </Badge>
          )}
          <span
            className={`text-[10px] font-mono tracking-[1px] uppercase font-medium px-2.5 py-0.5 rounded-[4px] ${getStatusColor(
              complaint.validation_status || 'pending'
            )}`}
          >
            {complaint.validation_status}
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)] block">
            Narasi Keluhan Pasien / Keluarga:
          </label>
          <div className="p-4 rounded-[4px] bg-[var(--color-linen)]/40 border border-[var(--color-hairline)] text-xs text-[var(--color-ink)] leading-relaxed whitespace-pre-wrap font-light">
            {complaint.complaint_text}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)]">
            <span className="text-[var(--color-smoke)] block text-[10px] font-mono uppercase tracking-[1px]">Kategori</span>
            <span className="font-light text-[var(--color-ink)] mt-0.5 block">
              {complaint.category?.name || 'Belum diisi'}
            </span>
          </div>
          <div className="p-3 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)]">
            <span className="text-[var(--color-smoke)] block text-[10px] font-mono uppercase tracking-[1px]">Prioritas</span>
            <span
              className="font-mono text-[10px] tracking-[1px] uppercase text-white px-2 py-0.5 rounded-[4px] inline-block mt-1"
              style={{ backgroundColor: complaint.priority?.color || '#0007cb' }}
            >
              {complaint.priority?.name || 'P3 (Standar)'}
            </span>
          </div>
          <div className="p-3 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)]">
            <span className="text-[var(--color-smoke)] block text-[10px] font-mono uppercase tracking-[1px]">Unit Terkait</span>
            <span className="font-light text-[var(--color-ink)] mt-0.5 block">
              {complaint.unit?.name || 'Umum'}
            </span>
          </div>
          <div className="p-3 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)]">
            <span className="text-[var(--color-smoke)] block text-[10px] font-mono uppercase tracking-[1px]">Kanal Laporan</span>
            <span className="font-light text-[var(--color-ink)] mt-0.5 block">
              {complaint.channel || 'Kotak Saran'}
            </span>
          </div>
        </div>

        {complaint.notes && (
          <div className="space-y-1 text-xs">
            <span className="text-[var(--color-smoke)] block font-mono text-[10px] uppercase tracking-[1px]">Catatan Adjudikasi:</span>
            <p className="text-[var(--color-iron)] italic">{complaint.notes}</p>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-[var(--color-hairline)]">
          <Button variant="secondary" size="sm" onClick={onClose} className="rounded-[4px]">
            Tutup
          </Button>
        </div>
      </Card>
    </div>
  )
}
