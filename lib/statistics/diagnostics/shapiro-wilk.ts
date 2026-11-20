// ============================================================================
// TRIAGE Research Lab — Shapiro-Wilk Normality Test Engine
// Reference: Royston, P. (1992). "Approximating the Shapiro-Wilk W-test for non-normality."
// Statistics and Computing, 2(3), 117-119.
// ============================================================================

function normalInvCDF(p: number): number {
  // Rational approximation for inverse normal CDF (Beasley-Springer-Moro)
  if (p <= 0 || p >= 1) return 0
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.38357751867269e2, -3.066479806614716e1, 2.506628277459239,
  ]
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ]
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ]
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416,
  ]

  const q = p - 0.5
  if (Math.abs(q) <= 0.42) {
    const r = q * q
    return (
      (q *
        (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5])) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    )
  }

  const r = p < 0.5 ? p : 1 - p
  const s = Math.log(-Math.log(r))
  let x =
    c[0] +
    s *
      (c[1] +
        s *
          (c[2] +
            s * (c[3] + s * (c[4] + s * c[5])))) /
      (1 + s * (d[0] + s * (d[1] + s * (d[2] + s * d[3]))))

  return p < 0.5 ? -x : x
}

function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2)
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return z > 0 ? 1 - p : p
}

export interface ShapiroWilkResult {
  wStatistic: number
  pValue: number
  sampleSize: number
  isNormal: boolean // at alpha = 0.05
  interpretation: string
}

/**
 * Computes the Shapiro-Wilk Test of Normality
 * @param data Array of numerical values (e.g. model residuals)
 */
export function calculateShapiroWilk(data: number[]): ShapiroWilkResult {
  const n = data.length

  if (n < 3) {
    return {
      wStatistic: 1,
      pValue: 1,
      sampleSize: n,
      isNormal: true,
      interpretation: 'Ukuran sampel terlalu kecil (N < 3) untuk uji Shapiro-Wilk.',
    }
  }

  // Sort data ascending
  const x = [...data].sort((a, b) => a - b)

  // Calculate sample mean and sum of squared deviations
  let sum = 0
  for (let i = 0; i < n; i++) sum += x[i]
  const mean = sum / n

  let ss = 0
  for (let i = 0; i < n; i++) {
    const diff = x[i] - mean
    ss += diff * diff
  }

  if (ss === 0) {
    return {
      wStatistic: 1,
      pValue: 1,
      sampleSize: n,
      isNormal: true,
      interpretation: 'Varians residual nol (semua nilai identik).',
    }
  }

  // Expected normal order statistics (Blom's formula)
  const m = new Array(n).fill(0)
  let sumMSq = 0
  for (let i = 0; i < n; i++) {
    const p = (i + 1 - 0.375) / (n + 0.25)
    m[i] = normalInvCDF(p)
    sumMSq += m[i] * m[i]
  }

  const sqrtSumMSq = Math.sqrt(sumMSq)
  const weights = m.map((val) => val / sqrtSumMSq)

  // Calculate b = sum(weights[i] * x[i])
  let b = 0
  for (let i = 0; i < n; i++) {
    b += weights[i] * x[i]
  }

  // W = b^2 / ss
  const w = Math.min(1, Math.max(0, (b * b) / ss))

  // P-value approximation (Royston, 1992 for 4 <= n <= 2000)
  let pValue = 0.5
  if (n === 3) {
    const pi = Math.PI
    pValue = (6 / pi) * (Math.asin(Math.sqrt(w)) - Math.asin(Math.sqrt(0.75)))
    pValue = Math.max(0, Math.min(1, pValue))
  } else {
    const logN = Math.log(n)
    const mu = 0.0038915 * Math.pow(logN, 3) - 0.083751 * Math.pow(logN, 2) - 0.31082 * logN - 1.5861
    const sigma = Math.exp(0.0030302 * Math.pow(logN, 2) - 0.082676 * logN - 0.4803)

    const y = Math.log(1 - w)
    const z = (y - mu) / sigma

    // Upper tail p-value: P(Z > z) = 1 - Phi(z)
    pValue = 1 - normalCDF(z)
    pValue = Math.max(0.0001, Math.min(0.9999, pValue))
  }

  const isNormal = pValue >= 0.05
  const interpretation = isNormal
    ? `Residual berdistribusi normal (W = ${w.toFixed(4)}, p = ${pValue.toFixed(3)} >= 0.05). Asumsi pemodelan LMM terpenuhi.`
    : `Terdapat deviasi dari normalitas (W = ${w.toFixed(4)}, p = ${pValue.toFixed(3)} < 0.05). Karena estimasi LMM berbasis log-transformasi, model robust terhadap deviasi moderat pada sampel besar.`

  return {
    wStatistic: w,
    pValue,
    sampleSize: n,
    isNormal,
    interpretation,
  }
}
