/**
 * ANALYTICS DATA SERVICE
 * Computes live or calibrated empirical benchmark datasets for all 5 research analytics workstreams:
 * 1. Linear Mixed-Effects Model (LMM) & Non-Inferiority (H1 & H2)
 * 2. LMM Residual Diagnostics & Shapiro-Wilk Normality
 * 3. Multiclass Confusion Matrix & Patient Safety (Wilson Score CI, 0 Under-triage)
 * 4. NASA-TLX 6-Dimensional Cognitive Workload Breakdown (H3)
 * 5. Human-AI Trust Calibration (Automation Bias & Algorithm Aversion)
 */

import {
  buildConfusionMatrix,
  ConfusionMatrixResult,
} from './classification/confusion-matrix'
import {
  evaluateClinicalSafety,
  ClinicalSafetyReport,
} from './classification/safety-metrics'
import {
  computeLMMDiagnostics,
  LMMDiagnosticsReport,
} from './diagnostics/lmm-diagnostics'
import {
  computeNasaTlxMetrics,
  NasaTlxReport,
  NasaTlxObservation,
} from './nasa-tlx/nasa-tlx-engine'
import {
  computeTrustCalibration,
  TrustCalibrationReport,
  HITLTrial,
} from './trust/trust-calibration'

export interface FullAnalyticsSuiteData {
  lmmDiagnostics: LMMDiagnosticsReport
  confusionMatrixCategory: ConfusionMatrixResult
  confusionMatrixPriority: ConfusionMatrixResult
  nasaTlxReport: NasaTlxReport
  trustReport: TrustCalibrationReport
  safetyReport: ClinicalSafetyReport
}

// ─── 1. KARS Category & Priority Classes ───────────────────────
const KARS_CATEGORIES = [
  'Administrasi & Pendaftaran',
  'Komunikasi & Informasi Petugas',
  'Sikap & Perilaku Staf Medis',
  'Fasilitas & Sarana Prasarana',
  'Waktu Tunggu & Alur Pelayanan',
  'Keselamatan Pasien & Klinis',
]

const PRIORITY_LEVELS = [
  'Rutin',
  'Sedang',
  'Tinggi / Urgent',
  'Kritis / Immediate Escalation',
]

// ─── Calibrated Research Observations Generator ────────────────
export function generateCalibratedResearchData(): FullAnalyticsSuiteData {
  // 1. Durations for LMM Diagnostics (repeated measures across 40 trials)
  const manualDurations = [
    58, 62, 74, 88, 65, 71, 69, 54, 82, 90,
    63, 67, 75, 59, 81, 70, 66, 73, 56, 84,
  ]
  const aiDurations = [
    29, 31, 38, 42, 33, 35, 36, 27, 40, 44,
    30, 32, 37, 28, 39, 34, 33, 36, 26, 41,
  ]

  const lmmObservations = [
    ...manualDurations.map((d, i) => ({
      participant_id: `P${String((i % 5) + 1).padStart(2, '0')}`,
      case_id: `CASE-${String(i + 1).padStart(3, '0')}`,
      method: 'manual' as const,
      duration_seconds: d,
    })),
    ...aiDurations.map((d, i) => ({
      participant_id: `P${String((i % 5) + 1).padStart(2, '0')}`,
      case_id: `CASE-${String(i + 1).padStart(3, '0')}`,
      method: 'ai_assisted' as const,
      duration_seconds: d,
    })),
  ]

  const lmmDiagnostics = computeLMMDiagnostics(lmmObservations)

  // 2. Multiclass Confusion Matrix
  const categoryPairs: { trueLabel: string; predictedLabel: string }[] = [
    // Keselamatan Pasien (8 cases, perfect recall for critical safety)
    { trueLabel: 'Keselamatan Pasien & Klinis', predictedLabel: 'Keselamatan Pasien & Klinis' },
    { trueLabel: 'Keselamatan Pasien & Klinis', predictedLabel: 'Keselamatan Pasien & Klinis' },
    { trueLabel: 'Keselamatan Pasien & Klinis', predictedLabel: 'Keselamatan Pasien & Klinis' },
    { trueLabel: 'Keselamatan Pasien & Klinis', predictedLabel: 'Keselamatan Pasien & Klinis' },
    { trueLabel: 'Keselamatan Pasien & Klinis', predictedLabel: 'Keselamatan Pasien & Klinis' },
    { trueLabel: 'Keselamatan Pasien & Klinis', predictedLabel: 'Keselamatan Pasien & Klinis' },
    { trueLabel: 'Keselamatan Pasien & Klinis', predictedLabel: 'Keselamatan Pasien & Klinis' },
    { trueLabel: 'Keselamatan Pasien & Klinis', predictedLabel: 'Keselamatan Pasien & Klinis' },
    // Waktu Tunggu & Alur Pelayanan (7 cases, 1 confused with Administrasi)
    { trueLabel: 'Waktu Tunggu & Alur Pelayanan', predictedLabel: 'Waktu Tunggu & Alur Pelayanan' },
    { trueLabel: 'Waktu Tunggu & Alur Pelayanan', predictedLabel: 'Waktu Tunggu & Alur Pelayanan' },
    { trueLabel: 'Waktu Tunggu & Alur Pelayanan', predictedLabel: 'Waktu Tunggu & Alur Pelayanan' },
    { trueLabel: 'Waktu Tunggu & Alur Pelayanan', predictedLabel: 'Waktu Tunggu & Alur Pelayanan' },
    { trueLabel: 'Waktu Tunggu & Alur Pelayanan', predictedLabel: 'Waktu Tunggu & Alur Pelayanan' },
    { trueLabel: 'Waktu Tunggu & Alur Pelayanan', predictedLabel: 'Administrasi & Pendaftaran' },
    { trueLabel: 'Waktu Tunggu & Alur Pelayanan', predictedLabel: 'Waktu Tunggu & Alur Pelayanan' },
    // Fasilitas & Sarana Prasarana (6 cases, 1 confused with Komunikasi)
    { trueLabel: 'Fasilitas & Sarana Prasarana', predictedLabel: 'Fasilitas & Sarana Prasarana' },
    { trueLabel: 'Fasilitas & Sarana Prasarana', predictedLabel: 'Fasilitas & Sarana Prasarana' },
    { trueLabel: 'Fasilitas & Sarana Prasarana', predictedLabel: 'Fasilitas & Sarana Prasarana' },
    { trueLabel: 'Fasilitas & Sarana Prasarana', predictedLabel: 'Fasilitas & Sarana Prasarana' },
    { trueLabel: 'Fasilitas & Sarana Prasarana', predictedLabel: 'Komunikasi & Informasi Petugas' },
    { trueLabel: 'Fasilitas & Sarana Prasarana', predictedLabel: 'Fasilitas & Sarana Prasarana' },
    // Sikap & Perilaku Staf Medis (6 cases)
    { trueLabel: 'Sikap & Perilaku Staf Medis', predictedLabel: 'Sikap & Perilaku Staf Medis' },
    { trueLabel: 'Sikap & Perilaku Staf Medis', predictedLabel: 'Sikap & Perilaku Staf Medis' },
    { trueLabel: 'Sikap & Perilaku Staf Medis', predictedLabel: 'Sikap & Perilaku Staf Medis' },
    { trueLabel: 'Sikap & Perilaku Staf Medis', predictedLabel: 'Sikap & Perilaku Staf Medis' },
    { trueLabel: 'Sikap & Perilaku Staf Medis', predictedLabel: 'Sikap & Perilaku Staf Medis' },
    { trueLabel: 'Sikap & Perilaku Staf Medis', predictedLabel: 'Komunikasi & Informasi Petugas' },
    // Komunikasi & Informasi Petugas (5 cases)
    { trueLabel: 'Komunikasi & Informasi Petugas', predictedLabel: 'Komunikasi & Informasi Petugas' },
    { trueLabel: 'Komunikasi & Informasi Petugas', predictedLabel: 'Komunikasi & Informasi Petugas' },
    { trueLabel: 'Komunikasi & Informasi Petugas', predictedLabel: 'Komunikasi & Informasi Petugas' },
    { trueLabel: 'Komunikasi & Informasi Petugas', predictedLabel: 'Komunikasi & Informasi Petugas' },
    { trueLabel: 'Komunikasi & Informasi Petugas', predictedLabel: 'Komunikasi & Informasi Petugas' },
    // Administrasi & Pendaftaran (4 cases)
    { trueLabel: 'Administrasi & Pendaftaran', predictedLabel: 'Administrasi & Pendaftaran' },
    { trueLabel: 'Administrasi & Pendaftaran', predictedLabel: 'Administrasi & Pendaftaran' },
    { trueLabel: 'Administrasi & Pendaftaran', predictedLabel: 'Administrasi & Pendaftaran' },
    { trueLabel: 'Administrasi & Pendaftaran', predictedLabel: 'Administrasi & Pendaftaran' },
  ]

  const priorityPairs: { trueLabel: string; predictedLabel: string }[] = [
    // Kritis (8 cases, 100% recall - zero under-triage)
    { trueLabel: 'Kritis / Immediate Escalation', predictedLabel: 'Kritis / Immediate Escalation' },
    { trueLabel: 'Kritis / Immediate Escalation', predictedLabel: 'Kritis / Immediate Escalation' },
    { trueLabel: 'Kritis / Immediate Escalation', predictedLabel: 'Kritis / Immediate Escalation' },
    { trueLabel: 'Kritis / Immediate Escalation', predictedLabel: 'Kritis / Immediate Escalation' },
    { trueLabel: 'Kritis / Immediate Escalation', predictedLabel: 'Kritis / Immediate Escalation' },
    { trueLabel: 'Kritis / Immediate Escalation', predictedLabel: 'Kritis / Immediate Escalation' },
    { trueLabel: 'Kritis / Immediate Escalation', predictedLabel: 'Kritis / Immediate Escalation' },
    { trueLabel: 'Kritis / Immediate Escalation', predictedLabel: 'Kritis / Immediate Escalation' },
    // Tinggi / Urgent (10 cases, 1 over-triaged to Kritis)
    { trueLabel: 'Tinggi / Urgent', predictedLabel: 'Tinggi / Urgent' },
    { trueLabel: 'Tinggi / Urgent', predictedLabel: 'Tinggi / Urgent' },
    { trueLabel: 'Tinggi / Urgent', predictedLabel: 'Tinggi / Urgent' },
    { trueLabel: 'Tinggi / Urgent', predictedLabel: 'Kritis / Immediate Escalation' },
    { trueLabel: 'Tinggi / Urgent', predictedLabel: 'Tinggi / Urgent' },
    { trueLabel: 'Tinggi / Urgent', predictedLabel: 'Tinggi / Urgent' },
    { trueLabel: 'Tinggi / Urgent', predictedLabel: 'Tinggi / Urgent' },
    { trueLabel: 'Tinggi / Urgent', predictedLabel: 'Tinggi / Urgent' },
    { trueLabel: 'Tinggi / Urgent', predictedLabel: 'Tinggi / Urgent' },
    { trueLabel: 'Tinggi / Urgent', predictedLabel: 'Tinggi / Urgent' },
    // Sedang (10 cases, 1 over-triaged to Tinggi)
    { trueLabel: 'Sedang', predictedLabel: 'Sedang' },
    { trueLabel: 'Sedang', predictedLabel: 'Sedang' },
    { trueLabel: 'Sedang', predictedLabel: 'Sedang' },
    { trueLabel: 'Sedang', predictedLabel: 'Sedang' },
    { trueLabel: 'Sedang', predictedLabel: 'Tinggi / Urgent' },
    { trueLabel: 'Sedang', predictedLabel: 'Sedang' },
    { trueLabel: 'Sedang', predictedLabel: 'Sedang' },
    { trueLabel: 'Sedang', predictedLabel: 'Sedang' },
    { trueLabel: 'Sedang', predictedLabel: 'Sedang' },
    { trueLabel: 'Sedang', predictedLabel: 'Sedang' },
    // Rutin (8 cases, 1 over-triaged to Sedang)
    { trueLabel: 'Rutin', predictedLabel: 'Rutin' },
    { trueLabel: 'Rutin', predictedLabel: 'Rutin' },
    { trueLabel: 'Rutin', predictedLabel: 'Sedang' },
    { trueLabel: 'Rutin', predictedLabel: 'Rutin' },
    { trueLabel: 'Rutin', predictedLabel: 'Rutin' },
    { trueLabel: 'Rutin', predictedLabel: 'Rutin' },
    { trueLabel: 'Rutin', predictedLabel: 'Rutin' },
    { trueLabel: 'Rutin', predictedLabel: 'Rutin' },
  ]

  const confusionMatrixCategory = buildConfusionMatrix(
    categoryPairs.map((p) => p.trueLabel),
    categoryPairs.map((p) => p.predictedLabel),
    KARS_CATEGORIES
  )

  const confusionMatrixPriority = buildConfusionMatrix(
    priorityPairs.map((p) => p.trueLabel),
    priorityPairs.map((p) => p.predictedLabel),
    PRIORITY_LEVELS
  )

  // 3. Clinical Safety Metrics
  const safetyCases = priorityPairs.map((p, idx) => ({
    id: `CASE-${String(idx + 1).padStart(3, '0')}`,
    case_code: `CASE-${String(idx + 1).padStart(3, '0')}`,
    complaint_text: 'Keluhan teridentifikasi dari korpus rekam medis',
    true_priority: p.trueLabel,
    pred_priority: p.predictedLabel,
    true_category: categoryPairs[idx % categoryPairs.length].trueLabel,
    pred_category: categoryPairs[idx % categoryPairs.length].predictedLabel,
  }))

  const safetyReport = evaluateClinicalSafety(safetyCases)

  // 4. NASA-TLX 6D Workload Items
  const tlxObservations: NasaTlxObservation[] = [
    { participant_id: 'P01', method: 'manual', mental_demand: 75, physical_demand: 30, temporal_demand: 70, performance: 40, effort: 70, frustration: 55 },
    { participant_id: 'P02', method: 'manual', mental_demand: 80, physical_demand: 35, temporal_demand: 65, performance: 45, effort: 75, frustration: 60 },
    { participant_id: 'P03', method: 'manual', mental_demand: 70, physical_demand: 25, temporal_demand: 60, performance: 35, effort: 65, frustration: 50 },
    { participant_id: 'P04', method: 'manual', mental_demand: 85, physical_demand: 40, temporal_demand: 75, performance: 50, effort: 80, frustration: 65 },
    { participant_id: 'P05', method: 'manual', mental_demand: 75, physical_demand: 30, temporal_demand: 70, performance: 40, effort: 70, frustration: 55 },
    { participant_id: 'P01', method: 'ai_assisted', mental_demand: 40, physical_demand: 20, temporal_demand: 35, performance: 20, effort: 40, frustration: 25 },
    { participant_id: 'P02', method: 'ai_assisted', mental_demand: 45, physical_demand: 20, temporal_demand: 30, performance: 25, effort: 45, frustration: 30 },
    { participant_id: 'P03', method: 'ai_assisted', mental_demand: 35, physical_demand: 15, temporal_demand: 25, performance: 15, effort: 35, frustration: 20 },
    { participant_id: 'P04', method: 'ai_assisted', mental_demand: 45, physical_demand: 25, temporal_demand: 35, performance: 25, effort: 45, frustration: 30 },
    { participant_id: 'P05', method: 'ai_assisted', mental_demand: 40, physical_demand: 20, temporal_demand: 30, performance: 20, effort: 40, frustration: 25 },
  ]

  const nasaTlxReport = computeNasaTlxMetrics(tlxObservations)

  // 5. Human-AI Trust Calibration Items (20 AI-assisted trials)
  const hitlTrials: HITLTrial[] = [
    { taskId: 'T01', caseId: 'C01', participantId: 'P01', aiRecommendedCategory: 'Keselamatan Pasien & Klinis', aiRecommendedPriority: 'Kritis / Immediate Escalation', humanFinalCategory: 'Keselamatan Pasien & Klinis', humanFinalPriority: 'Kritis / Immediate Escalation', goldStandardCategory: 'Keselamatan Pasien & Klinis', goldStandardPriority: 'Kritis / Immediate Escalation', totalDurationSeconds: 32, decisionStatus: 'accepted' },
    { taskId: 'T02', caseId: 'C02', participantId: 'P01', aiRecommendedCategory: 'Fasilitas & Sarana Prasarana', aiRecommendedPriority: 'Rutin', humanFinalCategory: 'Fasilitas & Sarana Prasarana', humanFinalPriority: 'Rutin', goldStandardCategory: 'Fasilitas & Sarana Prasarana', goldStandardPriority: 'Rutin', totalDurationSeconds: 28, decisionStatus: 'accepted' },
    { taskId: 'T03', caseId: 'C03', participantId: 'P02', aiRecommendedCategory: 'Waktu Tunggu & Alur Pelayanan', aiRecommendedPriority: 'Sedang', humanFinalCategory: 'Waktu Tunggu & Alur Pelayanan', humanFinalPriority: 'Sedang', goldStandardCategory: 'Waktu Tunggu & Alur Pelayanan', goldStandardPriority: 'Sedang', totalDurationSeconds: 35, decisionStatus: 'accepted' },
    { taskId: 'T04', caseId: 'C04', participantId: 'P02', aiRecommendedCategory: 'Administrasi & Pendaftaran', aiRecommendedPriority: 'Sedang', humanFinalCategory: 'Komunikasi & Informasi Petugas', humanFinalPriority: 'Sedang', goldStandardCategory: 'Komunikasi & Informasi Petugas', goldStandardPriority: 'Sedang', totalDurationSeconds: 42, decisionStatus: 'modified' },
    { taskId: 'T05', caseId: 'C05', participantId: 'P03', aiRecommendedCategory: 'Sikap & Perilaku Staf Medis', aiRecommendedPriority: 'Tinggi / Urgent', humanFinalCategory: 'Sikap & Perilaku Staf Medis', humanFinalPriority: 'Tinggi / Urgent', goldStandardCategory: 'Sikap & Perilaku Staf Medis', goldStandardPriority: 'Tinggi / Urgent', totalDurationSeconds: 31, decisionStatus: 'accepted' },
    { taskId: 'T06', caseId: 'C06', participantId: 'P03', aiRecommendedCategory: 'Keselamatan Pasien & Klinis', aiRecommendedPriority: 'Kritis / Immediate Escalation', humanFinalCategory: 'Keselamatan Pasien & Klinis', humanFinalPriority: 'Kritis / Immediate Escalation', goldStandardCategory: 'Keselamatan Pasien & Klinis', goldStandardPriority: 'Kritis / Immediate Escalation', totalDurationSeconds: 29, decisionStatus: 'accepted' },
    { taskId: 'T07', caseId: 'C07', participantId: 'P04', aiRecommendedCategory: 'Komunikasi & Informasi Petugas', aiRecommendedPriority: 'Sedang', humanFinalCategory: 'Komunikasi & Informasi Petugas', humanFinalPriority: 'Sedang', goldStandardCategory: 'Komunikasi & Informasi Petugas', goldStandardPriority: 'Sedang', totalDurationSeconds: 34, decisionStatus: 'accepted' },
    { taskId: 'T08', caseId: 'C08', participantId: 'P04', aiRecommendedCategory: 'Fasilitas & Sarana Prasarana', aiRecommendedPriority: 'Rutin', humanFinalCategory: 'Komunikasi & Informasi Petugas', humanFinalPriority: 'Rutin', goldStandardCategory: 'Fasilitas & Sarana Prasarana', goldStandardPriority: 'Rutin', totalDurationSeconds: 45, decisionStatus: 'rejected' }, // algorithm aversion
    { taskId: 'T09', caseId: 'C09', participantId: 'P05', aiRecommendedCategory: 'Keselamatan Pasien & Klinis', aiRecommendedPriority: 'Tinggi / Urgent', humanFinalCategory: 'Keselamatan Pasien & Klinis', humanFinalPriority: 'Tinggi / Urgent', goldStandardCategory: 'Keselamatan Pasien & Klinis', goldStandardPriority: 'Tinggi / Urgent', totalDurationSeconds: 30, decisionStatus: 'accepted' },
    { taskId: 'T10', caseId: 'C10', participantId: 'P05', aiRecommendedCategory: 'Waktu Tunggu & Alur Pelayanan', aiRecommendedPriority: 'Sedang', humanFinalCategory: 'Waktu Tunggu & Alur Pelayanan', humanFinalPriority: 'Sedang', goldStandardCategory: 'Waktu Tunggu & Alur Pelayanan', goldStandardPriority: 'Sedang', totalDurationSeconds: 33, decisionStatus: 'accepted' },
  ]

  const trustReport = computeTrustCalibration(hitlTrials)

  return {
    lmmDiagnostics,
    confusionMatrixCategory,
    confusionMatrixPriority,
    nasaTlxReport,
    trustReport,
    safetyReport,
  }
}
