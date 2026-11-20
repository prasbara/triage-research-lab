'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertTriangle, Filter, Search, FileText } from 'lucide-react'
import { PairedRating } from '@/lib/validation'

interface RaterAgreementTableProps {
  cases: PairedRating[]
  onSelectCase?: (caseItem: PairedRating) => void
}

export function RaterAgreementTable({ cases, onSelectCase }: RaterAgreementTableProps) {
  const [filter, setFilter] = useState<'all' | 'agreed' | 'disagreed'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = cases.filter((c) => {
    if (filter === 'agreed' && !c.is_agreed) return false
    if (filter === 'disagreed' && c.is_agreed) return false
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        c.case_code.toLowerCase().includes(term) ||
        c.complaint_text.toLowerCase().includes(term) ||
        c.rating1.toLowerCase().includes(term) ||
        c.rating2.toLowerCase().includes(term)
      )
    }
    return true
  })

  return (
    <Card className="border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none overflow-hidden space-y-0">
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-[var(--color-hairline)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-light text-[var(--color-ink)]">
            Daftar Kasus & Rekonsiliasi Penilaian Antar-Pakar
          </h3>
          <p className="text-xs text-[var(--color-graphite)] mt-0.5">
            Komparasi per kasus antara Pakar 1 dan Pakar 2 beserta status kesepakatan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-smoke)]" />
            <input
              type="text"
              placeholder="Cari kode kasus atau teks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] text-[var(--color-ink)] outline-none focus:border-[var(--color-electric-violet)] font-light w-52"
            />
          </div>

          <div className="flex items-center gap-1 bg-[var(--color-linen)] p-0.5 rounded-[4px] border border-[var(--color-hairline)] text-xs font-mono">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-[4px] ${
                filter === 'all'
                  ? 'bg-[var(--color-pure-white)] text-[var(--color-ink)] font-medium'
                  : 'text-[var(--color-graphite)] hover:text-[var(--color-ink)]'
              }`}
            >
              Semua ({cases.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('disagreed')}
              className={`px-2.5 py-1 rounded-[4px] ${
                filter === 'disagreed'
                  ? 'bg-amber-50 text-amber-900 font-medium'
                  : 'text-[var(--color-graphite)] hover:text-amber-800'
              }`}
            >
              Disparitas ({cases.filter((c) => !c.is_agreed).length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('agreed')}
              className={`px-2.5 py-1 rounded-[4px] ${
                filter === 'agreed'
                  ? 'bg-emerald-50 text-emerald-900 font-medium'
                  : 'text-[var(--color-graphite)] hover:text-emerald-800'
              }`}
            >
              Sepakat ({cases.filter((c) => c.is_agreed).length})
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[var(--color-linen)]/50 border-b border-[var(--color-hairline)] text-[10px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)]">
              <th className="px-5 py-3">Kasus</th>
              <th className="px-5 py-3">Teks Narasi Keluhan</th>
              <th className="px-5 py-3">Pakar 1 (R1)</th>
              <th className="px-5 py-3">Pakar 2 (R2)</th>
              <th className="px-5 py-3">Status Konsensus</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-hairline)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-[var(--color-smoke)] font-mono">
                  Tidak ada kasus yang memenuhi kriteria filter.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.case_id}
                  className="hover:bg-[var(--color-linen)]/20 transition-colors cursor-pointer"
                  onClick={() => onSelectCase?.(item)}
                >
                  <td className="px-5 py-3.5 font-mono text-[var(--color-electric-violet)] font-medium">
                    {item.case_code}
                  </td>
                  <td className="px-5 py-3.5 max-w-xs text-[var(--color-iron)] font-light line-clamp-2 leading-relaxed">
                    {item.complaint_text}
                  </td>
                  <td className="px-5 py-3.5 font-light text-[var(--color-ink)]">
                    {item.rating1}
                  </td>
                  <td className="px-5 py-3.5 font-light text-[var(--color-ink)]">
                    {item.rating2}
                  </td>
                  <td className="px-5 py-3.5">
                    {item.is_agreed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-emerald-50 text-emerald-800 font-mono text-[10px] uppercase border border-emerald-200">
                        <CheckCircle2 size={11} /> Sepakat
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-amber-50 text-amber-900 font-mono text-[10px] uppercase border border-amber-200">
                        <AlertTriangle size={11} /> Perlu Adjudikasi
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono">
                    <button
                      type="button"
                      className="px-2.5 py-1 text-[11px] rounded-[4px] border border-[var(--color-hairline)] hover:bg-[var(--color-linen)] text-[var(--color-ink)] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectCase?.(item)
                      }}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
