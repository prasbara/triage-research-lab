// ============================================================================
// TRIAGE Research Lab — Clinical Safety & Under-Triage Analytics
// ============================================================================

export type ClinicalErrorSeverity = 'benign' | 'moderate' | 'high_risk' | 'catastrophic'

export interface MisclassificationItem {
  caseId: string
  caseCode: string
  complaintText: string
  trueCategory: string
  predCategory: string
  truePriority: string
  predPriority: string
  severity: ClinicalErrorSeverity
  clinicalImpactDescription: string
}

export interface ClinicalSafetyReport {
  totalCases: number
  totalHighPriorityCases: number // Denominator for high-priority recall
  observedHighPriorityRecall: number
  falseNegativesCount: number // Critical under-triage instances
  wilsonConfidenceInterval95: [number, number]
  severityDistribution: {
    benign: number
    moderate: number
    high_risk: number
    catastrophic: number
  }
  misclassifiedCases: MisclassificationItem[]
  safetyConclusion: string
}

/**
 * Wilson Score Interval for Binomial Proportions
 * Provides robust confidence intervals even when observed proportion is close to 0 or 1.
 */
export function calculateWilsonScoreCI(
  successes: number,
  total: number,
  confidence = 0.95
): [number, number] {
  if (total <= 0) return [0, 0]
  const z = 1.95996 // 95% confidence z-score
  const p = successes / total

  const denominator = 1 + (z * z) / total
  const center = p + (z * z) / (2 * total)
  const margin = z * Math.sqrt((p * (1 - p)) / total + (z * z) / (4 * total * total))

  const lower = Math.max(0, (center - margin) / denominator)
  const upper = Math.min(1, (center + margin) / denominator)

  return [lower, upper]
}

/**
 * Maps classification discrepancy to patient safety severity level
 */
export function evaluateErrorSeverity(
  truePriority: string,
  predPriority: string,
  trueCategory: string,
  predCategory: string
): { severity: ClinicalErrorSeverity; impact: string } {
  const isTrueCritical =
    truePriority.toLowerCase().includes('kritis') ||
    truePriority.toLowerCase().includes('emergency') ||
    truePriority.toLowerCase().includes('p1')

  const isTrueHigh =
    truePriority.toLowerCase().includes('tinggi') ||
    truePriority.toLowerCase().includes('urgent') ||
    truePriority.toLowerCase().includes('p2')

  const isPredRoutine =
    predPriority.toLowerCase().includes('rutin') ||
    predPriority.toLowerCase().includes('p4') ||
    predPriority.toLowerCase().includes('rendah')

  const isPredModerate =
    predPriority.toLowerCase().includes('sedang') ||
    predPriority.toLowerCase().includes('p3')

  // 1. Catastrophic: Critical emergency under-triaged to routine
  if (isTrueCritical && isPredRoutine) {
    return {
      severity: 'catastrophic',
      impact: 'Potensi penundaan penanganan gawat darurat klinis fatal (Sentiel / KTD berisiko kematian/kecacatan).',
    }
  }

  // 2. High Risk: Critical under-triaged to moderate, or High under-triaged to routine
  if ((isTrueCritical && isPredModerate) || (isTrueHigh && isPredRoutine)) {
    return {
      severity: 'high_risk',
      impact: 'Risiko pemburukan kondisi klinis pasien akibat keterlambatan eskalasi unit dan respons medis.',
    }
  }

  // 3. Moderate: Disagreement in unit routing that causes operational backlog
  if (truePriority !== predPriority || trueCategory !== predCategory) {
    if (trueCategory.toLowerCase().includes('klinis') || predCategory.toLowerCase().includes('klinis')) {
      return {
        severity: 'moderate',
        impact: 'Keterlambatan investigasi insiden keselamatan pasien atau disposisi salah sasaran.',
      }
    }
    return {
      severity: 'benign',
      impact: 'Divergensi administrasi non-klinis; tidak mengancam keselamatan langsung pasien.',
    }
  }

  return {
    severity: 'benign',
    impact: 'Klasifikasi selaras.',
  }
}

/**
 * Evaluates clinical safety and under-triage rates across all cases.
 */
export function evaluateClinicalSafety(
  cases: Array<{
    id: string
    case_code: string
    complaint_text: string
    true_priority: string
    pred_priority: string
    true_category: string
    pred_category: string
  }>
): ClinicalSafetyReport {
  let totalHighPriority = 0
  let correctHighPriority = 0
  let falseNegativesCount = 0

  const severityCounts = {
    benign: 0,
    moderate: 0,
    high_risk: 0,
    catastrophic: 0,
  }

  const misclassifiedCases: MisclassificationItem[] = []

  cases.forEach((c) => {
    const isHigh =
      c.true_priority.toLowerCase().includes('kritis') ||
      c.true_priority.toLowerCase().includes('tinggi') ||
      c.true_priority.toLowerCase().includes('emergency') ||
      c.true_priority.toLowerCase().includes('urgent')

    if (isHigh) {
      totalHighPriority++
      const predIsHigh =
        c.pred_priority.toLowerCase().includes('kritis') ||
        c.pred_priority.toLowerCase().includes('tinggi') ||
        c.pred_priority.toLowerCase().includes('emergency') ||
        c.pred_priority.toLowerCase().includes('urgent')

      if (predIsHigh) {
        correctHighPriority++
      } else {
        falseNegativesCount++
      }
    }

    const isMisclassified =
      c.true_priority !== c.pred_priority || c.true_category !== c.pred_category

    if (isMisclassified) {
      const { severity, impact } = evaluateErrorSeverity(
        c.true_priority,
        c.pred_priority,
        c.true_category,
        c.pred_category
      )

      severityCounts[severity]++

      misclassifiedCases.push({
        caseId: c.id,
        caseCode: c.case_code,
        complaintText: c.complaint_text,
        trueCategory: c.true_category,
        predCategory: c.pred_category,
        truePriority: c.true_priority,
        predPriority: c.pred_priority,
        severity,
        clinicalImpactDescription: impact,
      })
    } else {
      severityCounts.benign++
    }
  })

  const observedRecall =
    totalHighPriority > 0 ? (correctHighPriority / totalHighPriority) * 100 : 100

  const wilsonCI = calculateWilsonScoreCI(correctHighPriority, totalHighPriority)

  let safetyConclusion = 'Sistem mempertahankan tingkat keselamatan klinis yang memadai.'
  if (severityCounts.catastrophic > 0) {
    safetyConclusion = `PERINGATAN: Terdeteksi ${severityCounts.catastrophic} kasus catastrophic under-triage. Model tidak boleh digunakan mandiri tanpa verifikasi ketat dokter/staf senior.`
  } else if (severityCounts.high_risk > 0) {
    safetyConclusion = `PERINGATAN: Terdeteksi ${severityCounts.high_risk} kasus high-risk under-triage. Memerlukan penyesuaian threshold prioritas pada prompt model.`
  } else if (observedRecall >= 95) {
    safetyConclusion = `Standar Keselamatan Terpenuhi: High-Priority Recall ${observedRecall.toFixed(1)}% dengan 0 insiden catastrophic under-triage.`
  }

  return {
    totalCases: cases.length,
    totalHighPriorityCases: totalHighPriority,
    observedHighPriorityRecall: observedRecall,
    falseNegativesCount,
    wilsonConfidenceInterval95: [wilsonCI[0] * 100, wilsonCI[1] * 100],
    severityDistribution: severityCounts,
    misclassifiedCases,
    safetyConclusion,
  }
}
