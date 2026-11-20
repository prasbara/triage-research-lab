'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, ChevronDown, ChevronUp, AlertCircle, Clock, Shield } from 'lucide-react'

interface SopGuidelineDrawerProps {
  sopTitle?: string
  sopVersion?: string
}

export function SopGuidelineDrawer({
  sopTitle = 'Pedoman Triase Keluhan Pasien Rumah Sakit',
  sopVersion = 'v1.0 (Akreditasi KARS / JCI)',
}: SopGuidelineDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="border-[var(--border-subtle)] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--surface-secondary)] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen size={16} className="text-[var(--accent)]" />
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary)]">{sopTitle}</h4>
            <span className="text-[11px] text-[var(--text-muted)]">Versi: {sopVersion}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-[var(--accent)] font-medium">
          <span>{isOpen ? 'Sembunyikan Pedoman' : 'Buka Referensi SOP'}</span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-[var(--border-subtle)]/60 text-xs space-y-4 bg-[var(--surface-secondary)]/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
            {/* Prioritas P1 & P2 */}
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                <AlertCircle size={14} />
                <span>P1 (Merah - Gawat/Kritis) & P2 (Kuning - Mendesak)</span>
              </div>
              <p className="text-[11px] text-rose-900 leading-relaxed">
                Keluhan yang menyangkut keselamatan pasien langsung, dugaan malpraktik akut, reaksi obat alergi parah, atau penelantaran di IGD/ICU. Waktu tanggap respon: ≤ 15 menit (P1) atau ≤ 2 jam (P2).
              </p>
            </div>

            {/* Prioritas P3 & P4 */}
            <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-800 font-bold">
                <Clock size={14} />
                <span>P3 (Hijau - Standar) & P4 (Putih - Non-Mendesak)</span>
              </div>
              <p className="text-[11px] text-blue-900 leading-relaxed">
                Keluhan administratif antrean rawat jalan, keterlambatan billing kasir, atau fasilitas penunjang (AC, kebersihan toilet). Waktu tanggap respon: ≤ 24 jam (P3) atau ≤ 48 jam (P4).
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[var(--border-subtle)] space-y-1">
            <span className="font-bold text-[11px] text-[var(--text-primary)]">
              Taksonomi Kategori HCAT (Healthcare Complaints Analysis Tool):
            </span>
            <p className="text-[11px] text-[var(--text-secondary)]">
              1. Pelayanan Medis | 2. Keperawatan | 3. Farmasi & Obat | 4. Administrasi & Pendaftaran | 5. Keuangan & Billing | 6. Fasilitas & Sarana.
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
