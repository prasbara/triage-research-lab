'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  IncidentType,
  INCIDENT_DEFINITIONS,
  RiskSeverityScore,
  RiskProbabilityScore,
  evaluateKarsRiskMatrix,
  PatientSafetyReportPayload,
} from '@/lib/safety/incident-workflow'
import {
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  FileText,
  UserCheck,
  Send,
} from 'lucide-react'

interface PatientSafetyIncidentModalProps {
  caseId: string
  complaintText: string
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess?: (payload: PatientSafetyReportPayload) => void
}

export function PatientSafetyIncidentModal({
  caseId,
  complaintText,
  isOpen,
  onClose,
  onSubmitSuccess,
}: PatientSafetyIncidentModalProps) {
  const [incidentType, setIncidentType] = useState<IncidentType>('KTD')
  const [severity, setSeverity] = useState<RiskSeverityScore>(3)
  const [probability, setProbability] = useState<RiskProbabilityScore>(3)
  const [locationUnit, setLocationUnit] = useState('Instalasi Gawat Darurat (IGD)')
  const [immediateAction, setImmediateAction] = useState(
    'Pasien segera dipindahkan ke ruang resusitasi, tanda vital dievaluasi ulang, dan dokter spesialis jaga dihubungi.'
  )
  const [patientImpact, setPatientImpact] = useState('Potensi perburukan kondisi hemodinamik akibat keterlambatan penanganan.')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const riskEval = evaluateKarsRiskMatrix(severity, probability)

  const getBandBadge = (band: string) => {
    switch (band) {
      case 'BIRU':
        return <span className="px-2.5 py-1 rounded-[4px] bg-blue-100 text-blue-900 border border-blue-300 font-mono text-xs font-medium">GRADING BIRU (Rendah)</span>
      case 'HIJAU':
        return <span className="px-2.5 py-1 rounded-[4px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-xs font-medium">GRADING HIJAU (Sedang)</span>
      case 'KUNING':
        return <span className="px-2.5 py-1 rounded-[4px] bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-medium">GRADING KUNING (Tinggi / RCA)</span>
      case 'MERAH':
        return <span className="px-2.5 py-1 rounded-[4px] bg-rose-100 text-rose-900 border border-rose-300 font-mono text-xs font-medium">GRADING MERAH (Ekstrem / RCA + Direksi)</span>
      default:
        return null
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const payload: PatientSafetyReportPayload = {
      case_id: caseId,
      incident_type: incidentType,
      severity,
      probability,
      incident_description: complaintText,
      immediate_action_taken: immediateAction,
      location_unit: locationUnit,
      patient_impact: patientImpact,
      reported_by: 'Petugas Triase Administratif',
      escalate_to_kprs: riskEval.escalateToDirector,
    }

    try {
      // Send to internal incident submission or mock logger
      await new Promise((r) => setTimeout(r, 600))
      setIsSuccess(true)
      if (onSubmitSuccess) onSubmitSuccess(payload)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-normal uppercase tracking-[1.2px] text-[var(--color-graphite)]">
                Permenkes 11/2017 & KARS STARKES
              </span>
              <Badge variant="danger">Insiden Keselamatan Pasien</Badge>
            </div>
            <h3 className="text-xl font-light text-[var(--color-ink)]">
              Formulir Pelaporan Insiden Keselamatan Pasien (IKP)
            </h3>
            <p className="text-xs text-[var(--color-graphite)] font-light">
              Eskalasi formal kasus keluhan yang berpotensi mencederai atau mengancam keselamatan klinis pasien.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[4px] text-[var(--color-graphite)] hover:bg-[var(--color-linen)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Complaint Context */}
        <div className="p-4 rounded-[4px] bg-[var(--color-linen)]/40 border border-[var(--color-hairline)] space-y-1">
          <span className="text-[10px] font-mono tracking-[1.2px] text-[var(--color-smoke)] uppercase block">
            Kasus Rujukan: {caseId}
          </span>
          <p className="text-xs text-[var(--color-ink)] font-light leading-relaxed">
            &ldquo;{complaintText}&rdquo;
          </p>
        </div>

        {/* 1. Incident Classification */}
        <div className="space-y-3">
          <label className="text-[11px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)] block">
            1. Jenis Insiden Keselamatan Pasien (IKP)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(INCIDENT_DEFINITIONS) as IncidentType[]).map((type) => {
              const def = INCIDENT_DEFINITIONS[type]
              const isSelected = incidentType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setIncidentType(type)}
                  className={`p-3 rounded-[4px] border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--color-ink)] bg-[var(--color-pure-white)] ring-1 ring-[var(--color-ink)]'
                      : 'border-[var(--color-hairline)] bg-[var(--color-linen)]/30 hover:bg-[var(--color-linen)]'
                  }`}
                >
                  <span className="font-mono text-xs font-semibold text-[var(--color-ink)] block">
                    {def.code}
                  </span>
                  <span className="text-[11px] font-light text-[var(--color-graphite)] block mt-0.5 leading-tight">
                    {def.nameIndonesian}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="text-[11px] font-light text-[var(--color-graphite)] bg-[var(--color-linen)]/30 p-2.5 rounded-[4px] border border-[var(--color-hairline)]">
            <strong className="font-mono text-[10px]">Definisi {incidentType}:</strong>{' '}
            {INCIDENT_DEFINITIONS[incidentType].description}
          </p>
        </div>

        {/* 2. Risk Matrix Sliders & Live Band Grading */}
        <div className="space-y-4 pt-2 border-t border-[var(--color-hairline)]">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)] block">
              2. Matriks Grading Risiko KARS
            </label>
            {getBandBadge(riskEval.riskBand)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Severity / Dampak */}
            <div className="p-4 rounded-[4px] bg-[var(--color-linen)]/20 border border-[var(--color-hairline)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[var(--color-graphite)]">Tingkat Dampak (Severity):</span>
                <span className="font-mono font-medium text-[var(--color-ink)]">Skor {severity} / 5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value) as RiskSeverityScore)}
                className="w-full accent-[var(--color-ink)] cursor-pointer"
              />
              <span className="text-[11px] text-[var(--color-graphite)] font-light block leading-tight">
                {riskEval.severityLabel}
              </span>
            </div>

            {/* Probability / Frekuensi */}
            <div className="p-4 rounded-[4px] bg-[var(--color-linen)]/20 border border-[var(--color-hairline)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[var(--color-graphite)]">Tingkat Probabilitas:</span>
                <span className="font-mono font-medium text-[var(--color-ink)]">Skor {probability} / 5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value) as RiskProbabilityScore)}
                className="w-full accent-[var(--color-ink)] cursor-pointer"
              />
              <span className="text-[11px] text-[var(--color-graphite)] font-light block leading-tight">
                {riskEval.probabilityLabel}
              </span>
            </div>
          </div>

          {/* Action Protocol Notice */}
          <div className="p-3.5 rounded-[4px] bg-[var(--color-canvas-cream)] border border-[var(--color-hairline)] space-y-1 text-xs">
            <span className="text-[10px] font-mono tracking-[1px] text-[var(--color-smoke)] uppercase block">
              Protokol Tindakan KARS:
            </span>
            <p className="text-[var(--color-ink)] font-light leading-relaxed">
              {riskEval.actionProtocol}
            </p>
            <span className="text-[11px] font-mono text-[var(--color-smoke)] block pt-1">
              Batas Waktu Investigasi: <strong>{riskEval.investigationDeadlineDays} Hari Kalender</strong>
            </span>
          </div>
        </div>

        {/* 3. Detailed Incident Context */}
        <div className="space-y-3 pt-2 border-t border-[var(--color-hairline)] text-xs">
          <label className="text-[11px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)] block">
            3. Tindakan Awal & Dampak pada Pasien
          </label>
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[var(--color-smoke)] uppercase block">
              Tindakan Penyelamatan Langsung yang Telah Dilakukan:
            </span>
            <input
              type="text"
              value={immediateAction}
              onChange={(e) => setImmediateAction(e.target.value)}
              className="w-full rounded-[4px] border border-[var(--color-hairline)] p-2.5 text-xs text-[var(--color-ink)] font-light outline-none focus:border-[var(--color-electric-violet)] bg-[var(--color-pure-white)]"
            />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[var(--color-smoke)] uppercase block">
              Dampak Klinis Teramati pada Pasien:
            </span>
            <input
              type="text"
              value={patientImpact}
              onChange={(e) => setPatientImpact(e.target.value)}
              className="w-full rounded-[4px] border border-[var(--color-hairline)] p-2.5 text-xs text-[var(--color-ink)] font-light outline-none focus:border-[var(--color-electric-violet)] bg-[var(--color-pure-white)]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-[var(--color-hairline)]">
          <span className="text-[11px] font-mono text-[var(--color-smoke)]">
            Audit logging: Dikirimkan langsung ke Komite Mutu & Keselamatan Pasien RS
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-[4px] h-9 px-4">
              Batal
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              loading={isSubmitting}
              className="rounded-[4px] h-9 px-5 gap-2"
            >
              {isSuccess ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Send size={14} />}
              <span>{isSuccess ? 'Laporan Terkirim!' : 'Kirim Laporan Insiden'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
