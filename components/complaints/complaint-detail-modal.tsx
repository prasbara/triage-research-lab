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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg bg-blue-50 text-[var(--accent)] border border-blue-200">
            {complaint.case_code}
          </span>
          {complaint.is_gold_standard && (
            <Badge variant="success" className="text-xs">
              <ShieldCheck size={12} className="mr-1" /> Gold Standard Verified
            </Badge>
          )}
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
              complaint.validation_status || 'pending'
            )}`}
          >
            {complaint.validation_status}
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--text-muted)] block">
            Narasi Keluhan Pasien / Keluarga:
          </label>
          <div className="p-4 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
            {complaint.complaint_text}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)] block text-[11px]">Kategori</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {complaint.category?.name || 'Belum diisi'}
            </span>
          </div>
          <div className="p-3 rounded-xl border border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)] block text-[11px]">Prioritas</span>
            <span
              className="font-bold text-white px-2 py-0.5 rounded text-[11px] inline-block mt-0.5"
              style={{ backgroundColor: complaint.priority?.color || '#0071e3' }}
            >
              {complaint.priority?.name || 'P3 (Standar)'}
            </span>
          </div>
          <div className="p-3 rounded-xl border border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)] block text-[11px]">Unit Terkait</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {complaint.unit?.name || 'Umum'}
            </span>
          </div>
          <div className="p-3 rounded-xl border border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)] block text-[11px]">Kanal Laporan</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {complaint.channel || 'Kotak Saran'}
            </span>
          </div>
        </div>

        {complaint.notes && (
          <div className="space-y-1 text-xs">
            <span className="text-[var(--text-muted)] block font-semibold">Catatan Adjudikasi:</span>
            <p className="text-[var(--text-secondary)] italic">{complaint.notes}</p>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-[var(--border-subtle)]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </Card>
    </div>
  )
}
