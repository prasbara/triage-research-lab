'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PairedRating } from '@/lib/validation'
import { ShieldCheck, CheckCircle2, X, AlertTriangle } from 'lucide-react'

interface AdjudicationPanelProps {
  caseItem: PairedRating | null
  onClose: () => void
  onSaveAdjudication: (caseId: string, category: string, priority: string, rationale: string) => Promise<void>
  availableCategories: string[]
  availablePriorities: string[]
}

export function AdjudicationPanel({
  caseItem,
  onClose,
  onSaveAdjudication,
  availableCategories,
  availablePriorities,
}: AdjudicationPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const [rationale, setRationale] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  if (!caseItem) return null

  const handleSave = async () => {
    if (!selectedCategory || !selectedPriority || !rationale) {
      alert('Silakan pilih kategori, prioritas, dan sertakan alasan adjudikasi panel.')
      return
    }

    setIsSaving(true)
    try {
      await onSaveAdjudication(caseItem.case_id, selectedCategory, selectedPriority, rationale)
      setSavedSuccess(true)
      setTimeout(() => {
        setSavedSuccess(false)
        onClose()
      }, 1200)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--color-smoke)] hover:text-[var(--color-ink)]"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-2.5 py-1 rounded-[4px] bg-[var(--color-linen)] text-[var(--color-electric-violet)] border border-[var(--color-hairline)]">
            {caseItem.case_code}
          </span>
          <Badge variant={caseItem.is_agreed ? 'success' : 'warning'}>
            {caseItem.is_agreed ? 'Konsensus Tercapai' : 'Panel Musyawarah Adjudikasi'}
          </Badge>
        </div>

        <div>
          <label className="text-[11px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)] block mb-1">
            Narasi Kasus Keluhan:
          </label>
          <p className="p-3.5 bg-[var(--color-linen)]/40 rounded-[4px] border border-[var(--color-hairline)] text-xs text-[var(--color-ink)] leading-relaxed font-light">
            {caseItem.complaint_text}
          </p>
        </div>

        {/* Independent Rater Outputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[1px] text-[var(--color-smoke)] block">
              Penilaian {caseItem.rater1_name}
            </span>
            <p className="font-light text-sm text-[var(--color-ink)]">{caseItem.rating1}</p>
          </div>
          <div className="p-3.5 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[1px] text-[var(--color-smoke)] block">
              Penilaian {caseItem.rater2_name}
            </span>
            <p className="font-light text-sm text-[var(--color-ink)]">{caseItem.rating2}</p>
          </div>
        </div>

        {/* Adjudication Form */}
        <div className="space-y-4 pt-3 border-t border-[var(--color-hairline)]">
          <div>
            <h4 className="text-sm font-light text-[var(--color-ink)]">
              Keputusan Final Dewan Pakar (Standar Emas Terverifikasi)
            </h4>
            <p className="text-[11px] text-[var(--color-graphite)] mt-0.5">
              Penetapan ini dicatat ke dalam audit trail tanpa menimpa data penilaian independen rater asli.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-[1px] text-[var(--color-smoke)] block mb-1">
                Kategori Teradjudikasi:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs h-9 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] px-2 outline-none font-light"
              >
                <option value="">-- Pilih Kategori --</option>
                {availableCategories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-[1px] text-[var(--color-smoke)] block mb-1">
                Tingkat Prioritas Teradjudikasi:
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full text-xs h-9 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] px-2 outline-none font-light"
              >
                <option value="">-- Pilih Prioritas --</option>
                {availablePriorities.map((pri, i) => (
                  <option key={i} value={pri}>
                    {pri}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-[1px] text-[var(--color-smoke)] block mb-1">
              Notulensi & Rasionalisasi Medis-Klinis Adjudikasi:
            </label>
            <textarea
              rows={3}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Jelaskan dasar pertimbangan SOP rumah sakit / konsensus klinis..."
              className="w-full text-xs p-3 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] outline-none font-light"
            />
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[4px] font-mono flex items-center gap-2">
              <CheckCircle2 size={14} /> Berhasil mencatat audit adjudikasi ke basis data.
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={onClose} className="rounded-[4px]">
              Batal
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              loading={isSaving}
              className="rounded-[4px] gap-2"
            >
              <ShieldCheck size={14} />
              <span>Tetapkan Standar Emas</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
