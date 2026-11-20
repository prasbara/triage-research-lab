/**
 * PATIENT SAFETY INCIDENT WORKFLOW ENGINE
 * In accordance with:
 * - Permenkes RI No. 11 Tahun 2017 tentang Keselamatan Pasien
 * - Standar Nasional Akreditasi Rumah Sakit (KARS / STARKES)
 */

export type IncidentType = 'KNC' | 'KTC' | 'KTD' | 'KPC' | 'SENTINEL'

export interface IncidentTypeDefinition {
  code: IncidentType
  nameIndonesian: string
  nameEnglish: string
  description: string
  example: string
  requiresImmediateReport: boolean
}

export const INCIDENT_DEFINITIONS: Record<IncidentType, IncidentTypeDefinition> = {
  KNC: {
    code: 'KNC',
    nameIndonesian: 'Kejadian Nyaris Cedera',
    nameEnglish: 'Near Miss',
    description: 'Terjadinya insiden yang belum terpapar ke pasien (tercegah sebelum mengenai pasien).',
    example: 'Perawat mengambil ampul KCl pekat alih-alih NaCl, namun disadari dan diganti sebelum disuntikkan.',
    requiresImmediateReport: false,
  },
  KTC: {
    code: 'KTC',
    nameIndonesian: 'Kejadian Tidak Cedera',
    nameEnglish: 'No Harm Incident',
    description: 'Insiden sudah terpapar ke pasien, tetapi tidak timbul cedera atau dampak klinis.',
    example: 'Pasien meminum obat antihipertensi milik pasien lain, namun observasi 24 jam menunjukkan tanda vital stabil tanpa efek samping.',
    requiresImmediateReport: false,
  },
  KTD: {
    code: 'KTD',
    nameIndonesian: 'Kejadian Tidak Diharapkan',
    nameEnglish: 'Adverse Event',
    description: 'Insiden yang mengakibatkan cedera yang tidak disengaja pada pasien selama proses asuhan medis.',
    example: 'Pasien lansia terjatuh saat menuju toilet karena side-rail bed tidak terpasang kencang, mengakibatkan dislokasi bahu.',
    requiresImmediateReport: true,
  },
  KPC: {
    code: 'KPC',
    nameIndonesian: 'Kondisi Potensial Cedera',
    nameEnglish: 'Reportable Circumstance',
    description: 'Kondisi lingkungan, sarana, atau alur kerja yang sangat berpotensi menimbulkan cedera, namun insiden belum terjadi.',
    example: 'Kabel defibrillator di ruang resusitasi IGD terkelupas dan baterai cadangan ventilator drop.',
    requiresImmediateReport: false,
  },
  SENTINEL: {
    code: 'SENTINEL',
    nameIndonesian: 'Kejadian Sentinel (KPCS)',
    nameEnglish: 'Sentinel Event',
    description: 'Suatu KTD yang mengakibatkan kematian, kehilangan fungsi permanen yang tidak terkait perjalanan alami penyakit, atau operasi salah sisi.',
    example: 'Tertukarnya kantong darah resipien yang berujung syok anafilaktik fatal atau kematian pasien di meja operasi.',
    requiresImmediateReport: true,
  },
}

export type RiskSeverityScore = 1 | 2 | 3 | 4 | 5
export type RiskProbabilityScore = 1 | 2 | 3 | 4 | 5
export type RiskGradingBand = 'BIRU' | 'HIJAU' | 'KUNING' | 'MERAH'

export interface RiskMatrixEvaluation {
  severityScore: RiskSeverityScore
  severityLabel: string
  probabilityScore: RiskProbabilityScore
  probabilityLabel: string
  riskBand: RiskGradingBand
  actionProtocol: string
  investigationDeadlineDays: number
  escalateToDirector: boolean
}

const SEVERITY_LABELS: Record<RiskSeverityScore, string> = {
  1: 'Tidak Signifikan (Tidak ada cedera, kerugian finansial minimal)',
  2: 'Minor (Cedera ringan, luka lecet, dapat diatasi pertolongan pertama)',
  3: 'Moderat (Cedera sedang, berkurangnya fungsi, perlu perpanjangan rawat inap < 4 hari)',
  4: 'Mayor (Cedera berat, kehilangan fungsi organ permanen, perpanjangan rawat > 4 hari)',
  5: 'Katastropik (Kematian pasien yang tidak berhubungan dengan penyakit primer)',
}

const PROBABILITY_LABELS: Record<RiskProbabilityScore, string> = {
  1: 'Sangat Jarang (> 5 tahun sekali)',
  2: 'Jarang (2 - 5 tahun sekali)',
  3: 'Mungkin (1 - 2 tahun sekali)',
  4: 'Sering (Beberapa kali dalam 1 tahun)',
  5: 'Sangat Sering (Hampir setiap bulan / minggu)',
}

// KARS Standard Risk Matrix Mapping: [Severity][Probability] -> Band
const MATRIX_TABLE: Record<RiskSeverityScore, Record<RiskProbabilityScore, RiskGradingBand>> = {
  1: { 1: 'BIRU', 2: 'BIRU', 3: 'BIRU', 4: 'HIJAU', 5: 'HIJAU' },
  2: { 1: 'BIRU', 2: 'BIRU', 3: 'HIJAU', 4: 'HIJAU', 5: 'KUNING' },
  3: { 1: 'BIRU', 2: 'HIJAU', 3: 'KUNING', 4: 'KUNING', 5: 'MERAH' },
  4: { 1: 'HIJAU', 2: 'KUNING', 3: 'KUNING', 4: 'MERAH', 5: 'MERAH' },
  5: { 1: 'KUNING', 2: 'KUNING', 3: 'MERAH', 4: 'MERAH', 5: 'MERAH' },
}

export function evaluateKarsRiskMatrix(
  severity: RiskSeverityScore,
  probability: RiskProbabilityScore
): RiskMatrixEvaluation {
  const band = MATRIX_TABLE[severity][probability]

  let actionProtocol = ''
  let investigationDeadlineDays = 7
  let escalateToDirector = false

  switch (band) {
    case 'BIRU':
      actionProtocol = 'Investigasi Sederhana oleh Kepala Unit / Ka. Instalasi terkait.'
      investigationDeadlineDays = 7
      escalateToDirector = false
      break
    case 'HIJAU':
      actionProtocol = 'Investigasi Sederhana oleh Kepala Unit dengan monitoring Komite Mutu & Keselamatan Pasien (KMKP).'
      investigationDeadlineDays = 14
      escalateToDirector = false
      break
    case 'KUNING':
      actionProtocol = 'Investigasi Komprehensif (Root Cause Analysis / RCA) oleh Tim Keselamatan Pasien RS.'
      investigationDeadlineDays = 45
      escalateToDirector = true
      break
    case 'MERAH':
      actionProtocol = 'Investigasi Komprehensif (RCA Grade Merah) + Laporan Segera 2x24 Jam kepada Direksi RS dan Komite Mutu.'
      investigationDeadlineDays = 45
      escalateToDirector = true
      break
  }

  return {
    severityScore: severity,
    severityLabel: SEVERITY_LABELS[severity],
    probabilityScore: probability,
    probabilityLabel: PROBABILITY_LABELS[probability],
    riskBand: band,
    actionProtocol,
    investigationDeadlineDays,
    escalateToDirector,
  }
}

export interface PatientSafetyReportPayload {
  case_id: string
  incident_type: IncidentType
  severity: RiskSeverityScore
  probability: RiskProbabilityScore
  incident_description: string
  immediate_action_taken: string
  location_unit: string
  patient_impact: string
  reported_by: string
  escalate_to_kprs: boolean
}
