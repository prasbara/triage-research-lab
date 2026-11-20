import { FleissKappaResult } from './validation-types'

function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2)
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return z > 0 ? 1 - p : p
}

/**
 * Fleiss' Kappa for 3 or more raters (m >= 3)
 * Reference: Fleiss, J. L. (1971). "Measuring nominal scale agreement among many raters."
 * Psychological Bulletin, 76(5), 378–382.
 *
 * @param matrix N x K matrix where N = subjects, K = categories,
 * matrix[i][j] = count of raters who assigned subject i to category j.
 * @param categories List of category names corresponding to columns of matrix.
 */
export function calculateFleissKappa(
  matrix: number[][],
  categories: string[]
): FleissKappaResult {
  const N = matrix.length
  const K = categories.length

  if (N === 0 || K === 0) {
    return {
      kappa: 0,
      standard_error: 0,
      z_score: 0,
      p_value: 1,
      confidence_interval_95: [0, 0],
      raters_count: 0,
      subjects_count: 0,
      categories_count: 0,
      categories: [],
      overall_observed_agreement: 0,
      overall_chance_agreement: 0,
      interpretation: 'Data kosong',
    }
  }

  // Validate number of raters per subject
  const ratersPerRow = matrix.map((row) => row.reduce((sum, val) => sum + val, 0))
  const m = ratersPerRow[0] // expected raters count

  for (let i = 0; i < N; i++) {
    if (ratersPerRow[i] !== m) {
      throw new Error(
        `Fleiss' Kappa requires uniform number of raters per subject. Subject ${i} has ${ratersPerRow[i]} ratings, expected ${m}.`
      )
    }
  }

  if (m < 2) {
    throw new Error(`Fleiss' Kappa requires at least 2 raters per subject. Found ${m}.`)
  }

  // Calculate P_i for each subject
  // P_i = (1 / (m * (m - 1))) * ( SUM_{j=1}^K [ n_{ij}^2 ] - m )
  let sumP_i = 0
  for (let i = 0; i < N; i++) {
    let sumN2 = 0
    for (let j = 0; j < K; j++) {
      sumN2 += matrix[i][j] * matrix[i][j]
    }
    const P_i = (sumN2 - m) / (m * (m - 1))
    sumP_i += P_i
  }

  const P_bar_o = sumP_i / N // Overall observed agreement

  // Calculate p_j for each category
  // p_j = (1 / (N * m)) * SUM_{i=1}^N [ n_{ij} ]
  const p_j = new Array(K).fill(0)
  for (let j = 0; j < K; j++) {
    let colSum = 0
    for (let i = 0; i < N; i++) {
      colSum += matrix[i][j]
    }
    p_j[j] = colSum / (N * m)
  }

  // Calculate P_bar_e = SUM_{j=1}^K [ p_j^2 ]
  let P_bar_e = 0
  for (let j = 0; j < K; j++) {
    P_bar_e += p_j[j] * p_j[j]
  }

  // Fleiss Kappa
  let kappa = 0
  if (Math.abs(1 - P_bar_e) < 1e-12) {
    kappa = P_bar_o === 1 ? 1 : 0
  } else {
    kappa = (P_bar_o - P_bar_e) / (1 - P_bar_e)
  }

  // Asymptotic Variance under the Null Hypothesis (Fleiss et al., 2003)
  let sumP2 = 0
  let sumP3 = 0
  for (let j = 0; j < K; j++) {
    sumP2 += p_j[j] * p_j[j]
    sumP3 += p_j[j] * p_j[j] * p_j[j]
  }

  const varNumerator = 2 * (sumP2 - (2 * m - 3) * Math.pow(sumP2, 2) + 2 * (m - 2) * sumP3)
  const varDenominator = N * m * (m - 1) * Math.pow(1 - sumP2, 2)
  const variance = varDenominator > 0 ? varNumerator / varDenominator : 0
  const se = Math.sqrt(Math.max(0, variance))

  const zScore = se > 0 ? kappa / se : 0
  const pValue = se > 0 ? 2 * (1 - normalCDF(Math.abs(zScore))) : (kappa === 1 ? 0 : 1)

  const ciLower = Math.max(-1, kappa - 1.96 * se)
  const ciUpper = Math.min(1, kappa + 1.96 * se)

  let interpretation = 'Kesepakatan Buruk (Poor)'
  if (kappa > 0.8) interpretation = 'Hampir Sempurna (Almost Perfect)'
  else if (kappa > 0.6) interpretation = 'Substansial (Substantial Agreement)'
  else if (kappa > 0.4) interpretation = 'Moderat (Moderate Agreement)'
  else if (kappa > 0.2) interpretation = 'Cukup (Fair Agreement)'
  else if (kappa > 0) interpretation = 'Sedikit (Slight Agreement)'

  return {
    kappa,
    standard_error: se,
    z_score: zScore,
    p_value: pValue,
    confidence_interval_95: [ciLower, ciUpper],
    raters_count: m,
    subjects_count: N,
    categories_count: K,
    categories,
    overall_observed_agreement: P_bar_o,
    overall_chance_agreement: P_bar_e,
    interpretation,
  }
}
