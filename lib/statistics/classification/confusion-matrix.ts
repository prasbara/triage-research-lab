// ============================================================================
// TRIAGE Research Lab — Multiclass Confusion Matrix & Classification Metrics
// ============================================================================

export interface ClassMetric {
  className: string
  truePositives: number
  falsePositives: number
  falseNegatives: number
  trueNegatives: number
  support: number // total true instances
  precision: number
  recall: number
  specificity: number
  f1Score: number
}

export interface ConfusionMatrixResult {
  classes: string[]
  matrix: number[][] // [true_idx][pred_idx]
  totalObservations: number
  overallAccuracy: number
  balancedAccuracy: number
  macroPrecision: number
  macroRecall: number
  macroF1: number
  weightedF1: number
  classMetrics: Record<string, ClassMetric>
  rowNormalizedMatrix: number[][] // percentage of row (Recall per cell)
  colNormalizedMatrix: number[][] // percentage of col (Precision per cell)
}

/**
 * Builds a multiclass confusion matrix and comprehensive classification metrics.
 * @param trueLabels Ground-truth reference labels (e.g. Expert Gold Standard)
 * @param predLabels Predicted labels (e.g. LLM or Participant)
 * @param definedClasses Optional explicit category order (e.g. 6 KARS categories or 4 priorities)
 */
export function buildConfusionMatrix(
  trueLabels: string[],
  predLabels: string[],
  definedClasses?: string[]
): ConfusionMatrixResult {
  if (trueLabels.length !== predLabels.length) {
    throw new Error(`Length mismatch: trueLabels (${trueLabels.length}) vs predLabels (${predLabels.length})`)
  }

  const n = trueLabels.length

  // Build class list
  const classSet = new Set<string>(definedClasses || [])
  for (let i = 0; i < n; i++) {
    if (trueLabels[i]) classSet.add(trueLabels[i])
    if (predLabels[i]) classSet.add(predLabels[i])
  }
  const classes = definedClasses ? [...definedClasses] : Array.from(classSet).sort()
  const K = classes.length

  const classToIndex = new Map<string, number>()
  classes.forEach((c, idx) => classToIndex.set(c, idx))

  // Initialize K x K matrix
  const matrix: number[][] = Array.from({ length: K }, () => Array(K).fill(0))
  let totalCorrect = 0

  for (let i = 0; i < n; i++) {
    const t = trueLabels[i]
    const p = predLabels[i]
    const tIdx = classToIndex.get(t)
    const pIdx = classToIndex.get(p)

    if (tIdx !== undefined && pIdx !== undefined) {
      matrix[tIdx][pIdx]++
      if (tIdx === pIdx) {
        totalCorrect++
      }
    }
  }

  // Row and Column Totals
  const rowTotals = new Array(K).fill(0)
  const colTotals = new Array(K).fill(0)

  for (let r = 0; r < K; r++) {
    for (let c = 0; c < K; c++) {
      rowTotals[r] += matrix[r][c]
      colTotals[c] += matrix[r][c]
    }
  }

  // Row-normalized (Recall) and Col-normalized (Precision) matrices
  const rowNorm: number[][] = Array.from({ length: K }, () => Array(K).fill(0))
  const colNorm: number[][] = Array.from({ length: K }, () => Array(K).fill(0))

  for (let r = 0; r < K; r++) {
    for (let c = 0; c < K; c++) {
      rowNorm[r][c] = rowTotals[r] > 0 ? (matrix[r][c] / rowTotals[r]) * 100 : 0
      colNorm[r][c] = colTotals[c] > 0 ? (matrix[r][c] / colTotals[c]) * 100 : 0
    }
  }

  // Per-class metrics
  const classMetrics: Record<string, ClassMetric> = {}
  let sumRecall = 0
  let sumPrecision = 0
  let sumF1 = 0
  let weightedF1Sum = 0

  classes.forEach((className, idx) => {
    const tp = matrix[idx][idx]
    const fn = rowTotals[idx] - tp
    const fp = colTotals[idx] - tp
    const tn = n - (tp + fn + fp)
    const support = rowTotals[idx]

    const precision = tp + fp > 0 ? tp / (tp + fp) : 0
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0
    const specificity = tn + fp > 0 ? tn / (tn + fp) : 0
    const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0

    classMetrics[className] = {
      className,
      truePositives: tp,
      falsePositives: fp,
      falseNegatives: fn,
      trueNegatives: tn,
      support,
      precision,
      recall,
      specificity,
      f1Score,
    }

    sumRecall += recall
    sumPrecision += precision
    sumF1 += f1Score
    weightedF1Sum += f1Score * support
  })

  const overallAccuracy = n > 0 ? totalCorrect / n : 0
  const balancedAccuracy = K > 0 ? sumRecall / K : 0
  const macroPrecision = K > 0 ? sumPrecision / K : 0
  const macroRecall = K > 0 ? sumRecall / K : 0
  const macroF1 = K > 0 ? sumF1 / K : 0
  const weightedF1 = n > 0 ? weightedF1Sum / n : 0

  return {
    classes,
    matrix,
    totalObservations: n,
    overallAccuracy,
    balancedAccuracy,
    macroPrecision,
    macroRecall,
    macroF1,
    weightedF1,
    classMetrics,
    rowNormalizedMatrix: rowNorm,
    colNormalizedMatrix: colNorm,
  }
}
