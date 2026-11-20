export function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((s, v) => s + v, 0) / values.length
}

export function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

export function stdDev(values: number[]): number {
  if (values.length < 2) return 0
  const m = mean(values)
  const variance = values.reduce((s, v) => s + Math.pow(v - m, 2), 0) / (values.length - 1)
  return Math.sqrt(variance)
}

export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const idx = (p / 100) * (sorted.length - 1)
  const lower = Math.floor(idx)
  const upper = Math.ceil(idx)
  if (lower === upper) return sorted[lower]
  return sorted[lower] + (idx - lower) * (sorted[upper] - sorted[lower])
}

export function summarize(values: number[]) {
  if (values.length === 0) return null
  return {
    n: values.length,
    mean: mean(values),
    median: median(values),
    std_dev: stdDev(values),
    min: Math.min(...values),
    max: Math.max(...values),
    q1: percentile(values, 25),
    q3: percentile(values, 75),
  }
}

export function computeNASATLX(responses: {
  mental_demand: number
  physical_demand: number
  temporal_demand: number
  performance: number
  effort: number
  frustration: number
}): number {
  const { mental_demand, physical_demand, temporal_demand, performance, effort, frustration } = responses
  return (mental_demand + physical_demand + temporal_demand + performance + effort + frustration) / 6
}
