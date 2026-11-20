// ============================================================================
// TRIAGE Research Lab — Human-AI Trust Calibration & Over-Reliance Engine
// References:
// - Parasuraman, R., & Manzey, D. H. (2010). "Complacency and bias in human use of automation."
// - Dietvorst, B. J., et al. (2018). "Overcoming algorithm aversion."
// ============================================================================

export interface HITLTrial {
  taskId: string
  caseId: string
  participantId: string
  aiRecommendedCategory: string
  aiRecommendedPriority: string
  humanFinalCategory: string
  humanFinalPriority: string
  goldStandardCategory: string
  goldStandardPriority: string
  inspectionTimeMs?: number
  totalDurationSeconds: number
  decisionStatus: 'accepted' | 'modified' | 'rejected'
  revisionJustification?: string
}

export interface TrustCalibrationReport {
  totalAIAssistedTrials: number
  acceptanceCount: number
  revisionCount: number
  acceptanceRate: number // %
  revisionRate: number // %
  
  // Accuracy breakdown
  aiStandaloneAccuracy: number // %
  humanFinalAccuracy: number // %
  accuracyGain: number // Δ %

  // Cognitive & Behavioral Biases
  overRelianceCount: number // Automation Bias: AI wrong, Human accepted, Final wrong
  overRelianceRate: number // % of AI errors accepted
  
  algorithmAversionCount: number // Algorithm Aversion: AI right, Human rejected, Final wrong
  algorithmAversionRate: number // % of AI correct decisions rejected

  appropriateRelianceCount: number // AI right, Human accepted
  appropriateCorrectionCount: number // AI wrong, Human corrected to right

  meanInspectionTimeMs: number
  trustProfileConclusion: string
}

export function computeTrustCalibration(trials: HITLTrial[]): TrustCalibrationReport {
  const n = trials.length
  if (n === 0) {
    return {
      totalAIAssistedTrials: 0,
      acceptanceCount: 0,
      revisionCount: 0,
      acceptanceRate: 0,
      revisionRate: 0,
      aiStandaloneAccuracy: 0,
      humanFinalAccuracy: 0,
      accuracyGain: 0,
      overRelianceCount: 0,
      overRelianceRate: 0,
      algorithmAversionCount: 0,
      algorithmAversionRate: 0,
      appropriateRelianceCount: 0,
      appropriateCorrectionCount: 0,
      meanInspectionTimeMs: 0,
      trustProfileConclusion: 'Belum ada data tugas berbantuan AI.',
    }
  }

  let acceptedCount = 0
  let revisedCount = 0
  let aiCorrectCount = 0
  let humanCorrectCount = 0

  let overRelianceCount = 0
  let algorithmAversionCount = 0
  let appropriateRelianceCount = 0
  let appropriateCorrectionCount = 0

  let totalInspectionMs = 0
  let inspectionRecordedCount = 0

  trials.forEach((trial) => {
    const aiIsCorrect =
      trial.aiRecommendedCategory === trial.goldStandardCategory &&
      trial.aiRecommendedPriority === trial.goldStandardPriority

    const humanIsCorrect =
      trial.humanFinalCategory === trial.goldStandardCategory &&
      trial.humanFinalPriority === trial.goldStandardPriority

    if (aiIsCorrect) aiCorrectCount++
    if (humanIsCorrect) humanCorrectCount++

    if (trial.decisionStatus === 'accepted') {
      acceptedCount++
      if (aiIsCorrect) {
        appropriateRelianceCount++
      } else {
        // Automation Bias / Over-reliance: AI was wrong, but human accepted it!
        overRelianceCount++
      }
    } else {
      revisedCount++
      if (aiIsCorrect && !humanIsCorrect) {
        // Algorithm Aversion: AI was right, but human rejected it and made it wrong!
        algorithmAversionCount++
      } else if (!aiIsCorrect && humanIsCorrect) {
        // Human successfully corrected AI error!
        appropriateCorrectionCount++
      }
    }

    if (trial.inspectionTimeMs && trial.inspectionTimeMs > 0) {
      totalInspectionMs += trial.inspectionTimeMs
      inspectionRecordedCount++
    }
  })

  const aiErrorsTotal = n - aiCorrectCount
  const aiCorrectTotal = aiCorrectCount

  const acceptanceRate = (acceptedCount / n) * 100
  const revisionRate = (revisedCount / n) * 100
  const aiAccuracy = (aiCorrectCount / n) * 100
  const humanAccuracy = (humanCorrectCount / n) * 100
  const accuracyGain = humanAccuracy - aiAccuracy

  const overRelianceRate =
    aiErrorsTotal > 0 ? (overRelianceCount / aiErrorsTotal) * 100 : 0
  const algorithmAversionRate =
    aiCorrectTotal > 0 ? (algorithmAversionCount / aiCorrectTotal) * 100 : 0

  const meanInspection =
    inspectionRecordedCount > 0 ? totalInspectionMs / inspectionRecordedCount : 8500

  let trustConclusion = 'Kalibrasi kepercayaan optimal (Calibrated Trust).'
  if (overRelianceRate > 25) {
    trustConclusion = `PERINGATAN AUTOMATION BIAS: ${overRelianceRate.toFixed(1)}% kesalahan model disetujui tanpa koreksi. Petugas cenderung percaya berlebihan pada keluaran AI.`
  } else if (algorithmAversionRate > 20) {
    trustConclusion = `PERINGATAN ALGORITHM AVERSION: ${algorithmAversionRate.toFixed(1)}% saran model yang akurat ditolak dan diubah menjadi salah oleh staf.`
  } else {
    trustConclusion = `Interaksi Human-in-the-Loop sehat: Staf berhasil mengoreksi ${appropriateCorrectionCount} kesalahan model dengan tingkat over-reliance rendah (${overRelianceRate.toFixed(1)}%).`
  }

  return {
    totalAIAssistedTrials: n,
    acceptanceCount: acceptedCount,
    revisionCount: revisedCount,
    acceptanceRate: parseFloat(acceptanceRate.toFixed(1)),
    revisionRate: parseFloat(revisionRate.toFixed(1)),
    aiStandaloneAccuracy: parseFloat(aiAccuracy.toFixed(1)),
    humanFinalAccuracy: parseFloat(humanAccuracy.toFixed(1)),
    accuracyGain: parseFloat(accuracyGain.toFixed(1)),
    overRelianceCount,
    overRelianceRate: parseFloat(overRelianceRate.toFixed(1)),
    algorithmAversionCount,
    algorithmAversionRate: parseFloat(algorithmAversionRate.toFixed(1)),
    appropriateRelianceCount,
    appropriateCorrectionCount,
    meanInspectionTimeMs: Math.round(meanInspection),
    trustProfileConclusion: trustConclusion,
  }
}
