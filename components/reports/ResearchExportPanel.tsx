'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Download,
  FileArchive,
  FileSpreadsheet,
  FileCode,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Share2,
  ExternalLink,
  BookOpen,
} from 'lucide-react'

export function ResearchExportPanel() {
  const [downloading, setDownloading] = useState(false)

  const handleDownloadBundle = () => {
    setDownloading(true)
    window.location.href = '/api/reports/research-bundle'
    setTimeout(() => setDownloading(false), 2000)
  }

  const bundledFiles = [
    {
      name: 'lmm_participant_durations.csv',
      desc: 'Dataset durasi berulang per partisipan (within-subject repeated measures) untuk formula lmer.',
      type: 'Tidy CSV',
      size: '12.4 KB',
    },
    {
      name: 'triage_raw_data_deidentified.csv',
      desc: 'Korpus 40 kasus keluhan terverifikasi de-identified (tanpa PHI) dengan label split & provenance.',
      type: 'Tidy CSV',
      size: '18.6 KB',
    },
    {
      name: 'inter_rater_validation_corpus.csv',
      desc: 'Matriks kesepakatan dual-expert dengan skor Cohen\'s Kappa, Gwet\'s AC1, dan jejak adjudikasi.',
      type: 'Tidy CSV',
      size: '8.2 KB',
    },
    {
      name: 'nasa_tlx_workload_responses.csv',
      desc: 'Data penilaian 6 dimensi beban mental (Mental, Physical, Temporal, Performance, Effort, Frustration).',
      type: 'Tidy CSV',
      size: '6.5 KB',
    },
    {
      name: 'data_dictionary_codebook.json',
      desc: 'Metadata mesin dan kamus variabel terstandar NIH/FAIR format untuk interoperabilitas data.',
      type: 'JSON Schema',
      size: '4.1 KB',
    },
    {
      name: 'analysis_script_LMM.R',
      desc: 'Skrip R terstandarisasi untuk eksekusi lmer, uji Wald non-inferioritas, dan visualisasi diagnostik.',
      type: 'R Script',
      size: '11.8 KB',
    },
    {
      name: 'README_RESEARCH_PROTOCOL.md',
      desc: 'Protokol penelitian, kepatuhan prinsip FAIR, pernyataan klirens etik, dan instruksi replikasi.',
      type: 'Markdown',
      size: '5.2 KB',
    },
  ]

  return (
    <div className="space-y-6">
      {/* ─── Bundle Download Card ────────────────────────── */}
      <div className="p-7 sm:p-8 rounded-[4px] bg-[var(--color-pure-white)] border border-[var(--color-hairline)] space-y-5 shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-5 border-b border-[var(--color-hairline)]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-normal uppercase tracking-[1.2px] text-[var(--color-graphite)]">
                FAIR Open Science & Data Replication
              </span>
              <Badge variant="purple">Reproducible Research Bundle</Badge>
            </div>
            <h3 className="text-2xl font-light text-[var(--color-ink)]">
              TRIAGE Research Bundle Archive (.zip)
            </h3>
            <p className="text-xs text-[var(--color-graphite)] font-light max-w-2xl leading-relaxed">
              Paket arsip lengkap open-science berisi seluruh dataset empiris ter-deidentifikasi, kamus data (codebook), skrip analisis R mandiri, dan protokol penelitian untuk keperluan replikasi tesis dan publikasi jurnal terakreditasi internasional.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              size="md"
              onClick={handleDownloadBundle}
              loading={downloading}
              className="h-11 px-6 gap-2.5 rounded-[4px]"
            >
              <FileArchive size={16} />
              <span>Unduh Arsip Lengkap (.zip)</span>
            </Button>
          </div>
        </div>

        {/* FAIR Principles Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-[var(--color-linen)]/40 rounded-[4px] border border-[var(--color-hairline)] space-y-1">
            <span className="text-[10px] text-[var(--color-smoke)] uppercase block">Findable</span>
            <span className="text-xs font-normal text-[var(--color-ink)]">Persistent Case IDs</span>
          </div>
          <div className="p-3 bg-[var(--color-linen)]/40 rounded-[4px] border border-[var(--color-hairline)] space-y-1">
            <span className="text-[10px] text-[var(--color-smoke)] uppercase block">Accessible</span>
            <span className="text-xs font-normal text-[var(--color-ink)]">Open CSV & JSON</span>
          </div>
          <div className="p-3 bg-[var(--color-linen)]/40 rounded-[4px] border border-[var(--color-hairline)] space-y-1">
            <span className="text-[10px] text-[var(--color-smoke)] uppercase block">Interoperable</span>
            <span className="text-xs font-normal text-[var(--color-ink)]">KARS / STARKES Codebook</span>
          </div>
          <div className="p-3 bg-[var(--color-linen)]/40 rounded-[4px] border border-[var(--color-hairline)] space-y-1">
            <span className="text-[10px] text-[var(--color-smoke)] uppercase block">Reusable</span>
            <span className="text-xs font-normal text-emerald-700">R Script + SessionInfo</span>
          </div>
        </div>
      </div>

      {/* ─── Bundled Files Specification ─────────────────── */}
      <div className="rounded-[4px] bg-[var(--color-pure-white)] border border-[var(--color-hairline)] p-6 space-y-4 shadow-none">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-hairline)]">
          <h4 className="text-sm font-light text-[var(--color-ink)]">
            Berkas Terlampir di Dalam Paket Arsip
          </h4>
          <span className="text-xs font-mono text-[var(--color-smoke)]">
            7 Berkas • Total Est. ~67 KB
          </span>
        </div>

        <div className="space-y-2">
          {bundledFiles.map((file) => (
            <div
              key={file.name}
              className="p-3.5 rounded-[4px] bg-[var(--color-canvas-cream)] border border-[var(--color-hairline)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-medium text-[var(--color-ink)]">
                    {file.name}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-[2px] bg-[var(--color-linen)] text-[10px] font-mono text-[var(--color-graphite)] border border-[var(--color-hairline)]">
                    {file.type}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-graphite)] font-light">
                  {file.desc}
                </p>
              </div>

              <span className="font-mono text-[11px] text-[var(--color-smoke)] shrink-0 self-end sm:self-center">
                {file.size}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
