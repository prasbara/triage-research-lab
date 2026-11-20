/**
 * Statistical calculations for healthcare complaint triage research
 */

export interface ConfusionMatrix {
  matrix: Record<string, Record<string, number>>
  labels: string[]
  totalSamples: number
}

export function computeConfusionMatrix(
  actual: string[],
  predicted: string[],
  labels: string[]
): ConfusionMatrix {
  const matrix: Record<string, Record<string, number>> = {}
  labels.forEach((l1) => {
    matrix[l1] = {}
    labels.forEach((l2) => {
      matrix[l1][l2] = 0
    })
  })

  let totalSamples = 0
  for (let i = 0; i < actual.length; i++) {
    const act = actual[i]
    const pred = predicted[i]
    if (matrix[act] && matrix[act][pred] !== undefined) {
      matrix[act][pred]++
      totalSamples++
    }
  }

  return { matrix, labels, totalSamples }
}

/**
 * High-Priority Recall (Safety metric)
 * TP / (TP + FN) for urgent/critical priority complaints (P1 and P2)
 */
export function calculateHighPriorityRecall(
  actualPriorities: string[],
  assignedPriorities: string[],
  highPriorityLabels = ['P1', 'P2', 'critical', 'urgent']
): {
  recall: number
  truePositives: number
  falseNegatives: number
  totalHighPriority: number
} {
  let tp = 0
  let fn = 0

  for (let i = 0; i < actualPriorities.length; i++) {
    const actual = actualPriorities[i]
    const assigned = assignedPriorities[i]
    const isActualHigh = highPriorityLabels.some((label) => actual?.toLowerCase().includes(label.toLowerCase()))
    const isAssignedHigh = highPriorityLabels.some((label) => assigned?.toLowerCase().includes(label.toLowerCase()))

    if (isActualHigh) {
      if (isAssignedHigh) {
        tp++
      } else {
        fn++
      }
    }
  }

  const total = tp + fn
  const recall = total > 0 ? tp / total : 0

  return {
    recall,
    truePositives: tp,
    falseNegatives: fn,
    totalHighPriority: total,
  }
}

/**
 * Cohen's Kappa for inter-rater agreement between Expert 1 and Expert 2
 */
export function calculateCohensKappa(rater1: string[], rater2: string[], categories: string[]): number {
  if (rater1.length !== rater2.length || rater1.length === 0) return 0

  const n = rater1.length
  let observedAgreement = 0

  for (let i = 0; i < n; i++) {
    if (rater1[i] === rater2[i]) observedAgreement++
  }
  const po = observedAgreement / n

  // Expected agreement pe
  let pe = 0
  categories.forEach((cat) => {
    const p1 = rater1.filter((r) => r === cat).length / n
    const p2 = rater2.filter((r) => r === cat).length / n
    pe += p1 * p2
  })

  if (pe === 1) return 1
  return (po - pe) / (1 - pe)
}
