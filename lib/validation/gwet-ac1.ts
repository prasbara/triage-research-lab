import { GwetAC1Result } from './validation-types'

/**
 * Gwet's AC1 Inter-Rater Reliability Coefficient
 * Reference: Gwet, K. L. (2008). "Computing inter-rater reliability and its variance
 * in the presence of high agreement." British Journal of Mathematical and Statistical Psychology.
 *
 * AC1 is specifically engineered to overcome the "Prevalence Paradox" of Cohen's Kappa,
 * where high observed agreement paradoxically produces low kappa due to skewed marginals.
 */
export function calculateGwetAC1(
  rater1: string[],
  rater2: string[],
  knownCategories?: string[]
): GwetAC1Result {
  if (rater1.length !== rater2.length) {
    throw new Error(`Data length mismatch: rater1 has ${rater1.length} items, rater2 has ${rater2.length}`)
  }

  const n = rater1.length
  if (n === 0) {
    return {
      observed_agreement: 0,
      chance_agreement: 0,
      ac1: 0,
      standard_error: 0,
      confidence_interval_95: [0, 0],
      sample_size: 0,
      prevalence_index: 0,
      bias_index: 0,
      interpretation: 'Data kosong',
    }
  }

  const categorySet = new Set<string>(knownCategories || [])
  for (let i = 0; i < n; i++) {
    if (rater1[i]) categorySet.add(rater1[i])
    if (rater2[i]) categorySet.add(rater2[i])
  }
  const categories = Array.from(categorySet).sort()
  const q = categories.length // number of categories

  if (q <= 1) {
    return {
      observed_agreement: 1,
      chance_agreement: 0,
      ac1: 1,
      standard_error: 0,
      confidence_interval_95: [1, 1],
      sample_size: n,
      prevalence_index: 0,
      bias_index: 0,
      interpretation: 'Kategori tunggal (Sempurna)',
    }
  }

  const catToIndex = new Map<string, number>()
  categories.forEach((cat, idx) => catToIndex.set(cat, idx))

  // Observed agreement count
  let agreeCount = 0
  const rowTotals = new Array(q).fill(0)
  const colTotals = new Array(q).fill(0)

  for (let i = 0; i < n; i++) {
    const c1 = rater1[i]
    const c2 = rater2[i]
    const idx1 = catToIndex.get(c1)
    const idx2 = catToIndex.get(c2)

    if (idx1 !== undefined && idx2 !== undefined) {
      rowTotals[idx1]++
      colTotals[idx2]++
      if (idx1 === idx2) {
        agreeCount++
      }
    }
  }

  // Observed Agreement (Po)
  const po = agreeCount / n

  // Category average marginal probabilities: pi_k = (row_k + col_k) / (2 * n)
  const pi = new Array(q).fill(0)
  for (let k = 0; k < q; k++) {
    pi[k] = (rowTotals[k] + colTotals[k]) / (2 * n)
  }

  // Gwet's Chance Agreement (Pe)
  // Pe = (1 / (q - 1)) * SUM_{k=1}^q [ pi_k * (1 - pi_k) ]
  let sumPiOneMinusPi = 0
  for (let k = 0; k < q; k++) {
    sumPiOneMinusPi += pi[k] * (1 - pi[k])
  }
  const pe = (1 / (q - 1)) * sumPiOneMinusPi

  // AC1 Coefficient
  let ac1 = 0
  if (Math.abs(1 - pe) < 1e-12) {
    ac1 = po === 1 ? 1 : 0
  } else {
    ac1 = (po - pe) / (1 - pe)
  }

  // Linearized Standard Error of Gwet's AC1
  let variance = 0
  if (n > 1 && Math.abs(1 - pe) > 1e-12) {
    variance = (po * (1 - po)) / (n * Math.pow(1 - pe, 2))
  }
  const se = Math.sqrt(Math.max(0, variance))

  const ciLower = Math.max(-1, ac1 - 1.96 * se)
  const ciUpper = Math.min(1, ac1 + 1.96 * se)

  // Prevalence and Bias index (for binary/ordered comparisons)
  let prevalenceIndex = 0
  let biasIndex = 0
  if (q === 2) {
    prevalenceIndex = Math.abs(pi[0] - pi[1])
    biasIndex = Math.abs(rowTotals[0] - colTotals[0]) / n
  }

  let interpretation = 'Kesepakatan Buruk (Poor)'
  if (ac1 > 0.8) interpretation = 'Sangat Tinggi / Sempurna (Very High Agreement)'
  else if (ac1 > 0.6) interpretation = 'Tinggi (High Agreement)'
  else if (ac1 > 0.4) interpretation = 'Moderat (Moderate Agreement)'
  else if (ac1 > 0.2) interpretation = 'Rendah (Fair Agreement)'
  else if (ac1 > 0) interpretation = 'Sedikit (Slight Agreement)'

  return {
    observed_agreement: po,
    chance_agreement: pe,
    ac1,
    standard_error: se,
    confidence_interval_95: [ciLower, ciUpper],
    sample_size: n,
    prevalence_index: prevalenceIndex,
    bias_index: biasIndex,
    interpretation,
  }
}
