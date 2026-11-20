import type { TriageDecision, GoldStandard, AccuracyMetrics, ConfusionMatrixData } from '@/types'

export function computeAccuracyMetrics(
  decisions: Array<{ final_category: string; final_priority: string; final_target_unit: string; final_escalation_required: boolean }>,
  goldStandards: Map<string, GoldStandard>
): AccuracyMetrics {
  if (decisions.length === 0) {
    return { accuracy: 0, precision: 0, recall: 0, f1_score: 0, high_priority_recall: null, sample_size: 0 }
  }

  let categoryCorrect = 0
  let priorityCorrect = 0
  let unitCorrect = 0
  let highPriorityTP = 0
  let highPriorityFN = 0
  let highPriorityFP = 0
  let matchedCount = 0

  for (const decision of decisions) {
    const gs = goldStandards.get((decision as { case_id?: string }).case_id || '')
    if (!gs) continue
    matchedCount++
    if (decision.final_category === gs.category) categoryCorrect++
    if (decision.final_priority === gs.priority) priorityCorrect++
    if (decision.final_target_unit === gs.target_unit) unitCorrect++

    // High-priority recall
    if (gs.high_priority_flag) {
      if (decision.final_priority === gs.priority) {
        highPriorityTP++
      } else {
        highPriorityFN++
      }
    } else if ((decision as { final_high_priority?: boolean }).final_high_priority) {
      highPriorityFP++
    }
  }

  if (matchedCount === 0) {
    return { accuracy: 0, precision: 0, recall: 0, f1_score: 0, high_priority_recall: null, sample_size: 0 }
  }

  const categoryAccuracy = categoryCorrect / matchedCount
  const priorityAccuracy = priorityCorrect / matchedCount
  const unitAccuracy = unitCorrect / matchedCount
  const overall = (categoryAccuracy + priorityAccuracy + unitAccuracy) / 3

  const highPriorityRecall = (highPriorityTP + highPriorityFN) > 0
    ? highPriorityTP / (highPriorityTP + highPriorityFN)
    : null

  return {
    accuracy: overall,
    precision: categoryAccuracy,
    recall: priorityAccuracy,
    f1_score: unitAccuracy,
    high_priority_recall: highPriorityRecall,
    sample_size: matchedCount,
  }
}

export function computeDurationStats(durations: number[]) {
  if (durations.length === 0) return null
  const sorted = [...durations].sort((a, b) => a - b)
  const mean = durations.reduce((s, d) => s + d, 0) / durations.length
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)]
  const variance = durations.reduce((s, d) => s + Math.pow(d - mean, 2), 0) / durations.length
  return {
    mean,
    median,
    std_dev: Math.sqrt(variance),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    count: durations.length,
  }
}

export function computeConfusionMatrix(
  predicted: string[],
  actual: string[],
  labels: string[]
): ConfusionMatrixData {
  const matrix = labels.map(() => labels.map(() => 0))
  for (let i = 0; i < predicted.length; i++) {
    const predIdx = labels.indexOf(predicted[i])
    const actIdx = labels.indexOf(actual[i])
    if (predIdx !== -1 && actIdx !== -1) {
      matrix[actIdx][predIdx]++
    }
  }
  return { labels, matrix }
}

export function computeCohenKappa(assessment1: string[], assessment2: string[]): number | null {
  if (assessment1.length !== assessment2.length || assessment1.length < 2) return null
  const n = assessment1.length
  const categories = [...new Set([...assessment1, ...assessment2])]
  
  let observed_agreement = 0
  for (let i = 0; i < n; i++) {
    if (assessment1[i] === assessment2[i]) observed_agreement++
  }
  const po = observed_agreement / n

  let expected_agreement = 0
  for (const cat of categories) {
    const p1 = assessment1.filter(a => a === cat).length / n
    const p2 = assessment2.filter(a => a === cat).length / n
    expected_agreement += p1 * p2
  }
  const pe = expected_agreement

  if (pe === 1) return 1
  return (po - pe) / (1 - pe)
}

// Suppress unused import warnings
void (null as unknown as TriageDecision)
