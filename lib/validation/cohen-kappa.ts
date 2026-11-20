import { CohenKappaResult } from './validation-types'

function normalCDF(z: number): number {
  // Approximation of standard normal cumulative distribution function
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2)
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return z > 0 ? 1 - p : p
}

export function calculateCohenKappa(
  rater1: string[],
  rater2: string[],
  knownCategories?: string[]
): CohenKappaResult {
  if (rater1.length !== rater2.length) {
    throw new Error(`Data length mismatch: rater1 has ${rater1.length} items, rater2 has ${rater2.length}`)
  }

  const n = rater1.length
  if (n === 0) {
    return {
      observed_agreement: 0,
      chance_agreement: 0,
      kappa: 0,
      standard_error: 0,
      z_score: 0,
      p_value: 1,
      confidence_interval_95: [0, 0],
      sample_size: 0,
      categories: [],
      contingency_matrix: [],
      category_agreement: {},
      interpretation: 'Data kosong',
    }
  }

  // Determine unique categories
  const categorySet = new Set<string>(knownCategories || [])
  for (let i = 0; i < n; i++) {
    if (rater1[i]) categorySet.add(rater1[i])
    if (rater2[i]) categorySet.add(rater2[i])
  }
  const categories = Array.from(categorySet).sort()
  const k = categories.length

  const catToIndex = new Map<string, number>()
  categories.forEach((cat, idx) => catToIndex.set(cat, idx))

  // Build contingency matrix
  const matrix: number[][] = Array.from({ length: k }, () => Array(k).fill(0))
  let agreedCount = 0

  for (let i = 0; i < n; i++) {
    const c1 = rater1[i]
    const c2 = rater2[i]
    const idx1 = catToIndex.get(c1)
    const idx2 = catToIndex.get(c2)

    if (idx1 !== undefined && idx2 !== undefined) {
      matrix[idx1][idx2]++
      if (idx1 === idx2) {
        agreedCount++
      }
    }
  }

  // Row and Column Totals
  const rowTotals = new Array(k).fill(0)
  const colTotals = new Array(k).fill(0)

  for (let r = 0; r < k; r++) {
    for (let c = 0; c < k; c++) {
      rowTotals[r] += matrix[r][c]
      colTotals[c] += matrix[r][c]
    }
  }

  // Observed Agreement (Po)
  const po = agreedCount / n

  // Chance Agreement (Pe)
  let pe = 0
  for (let i = 0; i < k; i++) {
    pe += (rowTotals[i] * colTotals[i]) / (n * n)
  }

  // Kappa Calculation
  let kappa = 0
  if (Math.abs(1 - pe) < 1e-12) {
    kappa = po === 1 ? 1 : 0
  } else {
    kappa = (po - pe) / (1 - pe)
  }

  // Standard Error calculation (Fleiss, Cohen & Everitt asymptotic standard error)
  let variance = 0
  if (n > 1 && Math.abs(1 - pe) > 1e-12) {
    variance = (po * (1 - po)) / (n * Math.pow(1 - pe, 2))
  }
  const se = Math.sqrt(Math.max(0, variance))

  const zScore = se > 0 ? kappa / se : 0
  const pValue = se > 0 ? 2 * (1 - normalCDF(Math.abs(zScore))) : (kappa === 1 ? 0 : 1)

  const ciLower = Math.max(-1, kappa - 1.96 * se)
  const ciUpper = Math.min(1, kappa + 1.96 * se)

  // Per-category Specific Agreement (Cicchetti & Feinstein)
  const categoryAgreement: Record<string, any> = {}
  for (let i = 0; i < k; i++) {
    const cat = categories[i]
    const r1 = rowTotals[i]
    const r2 = colTotals[i]
    const agree = matrix[i][i]
    const specificAgreement = r1 + r2 > 0 ? (2 * agree) / (r1 + r2) : 0

    categoryAgreement[cat] = {
      rater1_count: r1,
      rater2_count: r2,
      agreed_count: agree,
      specific_agreement: specificAgreement,
    }
  }

  // Academic interpretation (Landis & Koch, 1977 benchmark)
  let interpretation = 'Kesepakatan Sangat Buruk (Poor)'
  if (kappa > 0.8) interpretation = 'Hampir Sempurna (Almost Perfect)'
  else if (kappa > 0.6) interpretation = 'Substansial (Substantial Agreement)'
  else if (kappa > 0.4) interpretation = 'Moderat (Moderate Agreement)'
  else if (kappa > 0.2) interpretation = 'Cukup Rendah (Fair Agreement)'
  else if (kappa > 0) interpretation = 'Sedikit (Slight Agreement)'

  return {
    observed_agreement: po,
    chance_agreement: pe,
    kappa,
    standard_error: se,
    z_score: zScore,
    p_value: pValue,
    confidence_interval_95: [ciLower, ciUpper],
    sample_size: n,
    categories,
    contingency_matrix: matrix,
    category_agreement: categoryAgreement,
    interpretation,
  }
}
