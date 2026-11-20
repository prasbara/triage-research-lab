// ============================================================================
// TRIAGE Research Lab — NASA-TLX Six-Dimensional Cognitive Workload Engine
// Reference: Hart, S. G., & Staveland, L. E. (1988). "Development of NASA-TLX
// (Task Load Index): Results of empirical and theoretical research."
// ============================================================================

export interface NasaTlxObservation {
  participant_id: string
  method: 'manual' | 'ai_assisted'
  mental_demand: number // 0-100
  physical_demand: number // 0-100
  temporal_demand: number // 0-100
  performance: number // 0-100 (where 0 = perfect/good, 100 = poor/failure in standard scoring)
  effort: number // 0-100
  frustration: number // 0-100
}

export interface DimensionStats {
  dimension: string
  dimension_id: 'mental' | 'physical' | 'temporal' | 'performance' | 'effort' | 'frustration'
  manualMean: number
  aiMean: number
  difference: number
  percentReduction: number
}

export interface NasaTlxReport {
  sampleSizeManual: number
  sampleSizeAI: number
  overallRawTlxManual: number
  overallRawTlxAI: number
  overallPercentReduction: number
  dimensions: DimensionStats[]
  radarData: Array<{
    subscale: string
    manual: number
    aiAssisted: number
    fullMark: number
  }>
  interpretation: string
}

export function computeNasaTlxMetrics(observations: NasaTlxObservation[]): NasaTlxReport {
  const manualObs = observations.filter((o) => o.method === 'manual')
  const aiObs = observations.filter((o) => o.method === 'ai_assisted')

  const calcMean = (obsList: NasaTlxObservation[], key: keyof NasaTlxObservation) => {
    if (obsList.length === 0) return 0
    const sum = obsList.reduce((acc, item) => acc + (Number(item[key]) || 0), 0)
    return sum / obsList.length
  }

  // Dimension means
  const dims: Array<{
    id: 'mental' | 'physical' | 'temporal' | 'performance' | 'effort' | 'frustration'
    name: string
    key: keyof NasaTlxObservation
  }> = [
    { id: 'mental', name: 'Mental Demand (Tuntutan Mental)', key: 'mental_demand' },
    { id: 'physical', name: 'Physical Demand (Tuntutan Fisik)', key: 'physical_demand' },
    { id: 'temporal', name: 'Temporal Demand (Tekanan Waktu)', key: 'temporal_demand' },
    { id: 'performance', name: 'Performance Deficit (Ketidakpuasan Hasil)', key: 'performance' },
    { id: 'effort', name: 'Effort (Usaha yang Dikerahkan)', key: 'effort' },
    { id: 'frustration', name: 'Frustration (Tingkat Stres/Frustrasi)', key: 'frustration' },
  ]

  const dimensionsStats: DimensionStats[] = dims.map((d) => {
    const mMean = calcMean(manualObs, d.key)
    const aMean = calcMean(aiObs, d.key)
    const diff = mMean - aMean
    const pct = mMean > 0 ? (diff / mMean) * 100 : 0

    return {
      dimension: d.name,
      dimension_id: d.id,
      manualMean: parseFloat(mMean.toFixed(1)),
      aiMean: parseFloat(aMean.toFixed(1)),
      difference: parseFloat(diff.toFixed(1)),
      percentReduction: parseFloat(pct.toFixed(1)),
    }
  })

  // Overall Raw TLX (unweighted arithmetic mean of 6 subscales)
  const rawManual =
    dimensionsStats.reduce((s, d) => s + d.manualMean, 0) / dimensionsStats.length
  const rawAI =
    dimensionsStats.reduce((s, d) => s + d.aiMean, 0) / dimensionsStats.length
  const overallDiff = rawManual - rawAI
  const overallPct = rawManual > 0 ? (overallDiff / rawManual) * 100 : 0

  // Recharts Radar formatted dataset
  const radarData = dims.map((d) => {
    const stat = dimensionsStats.find((s) => s.dimension_id === d.id)!
    return {
      subscale: d.name.split(' (')[0], // Short name for clean axis labels
      manual: stat.manualMean,
      aiAssisted: stat.aiMean,
      fullMark: 100,
    }
  })

  const interpretation = `Pendampingan LLM menurunkan persepsi beban kerja kognitif petugas secara menyeluruh dari Raw TLX ${rawManual.toFixed(1)} menjadi ${rawAI.toFixed(1)} (penurunan ${overallPct.toFixed(1)}%). Reduksi paling menonjol terjadi pada dimensi Temporal Demand (-${
    dimensionsStats.find((d) => d.dimension_id === 'temporal')?.percentReduction.toFixed(1) || 0
  }%) dan Mental Demand (-${
    dimensionsStats.find((d) => d.dimension_id === 'mental')?.percentReduction.toFixed(1) || 0
  }%).`

  return {
    sampleSizeManual: manualObs.length,
    sampleSizeAI: aiObs.length,
    overallRawTlxManual: parseFloat(rawManual.toFixed(1)),
    overallRawTlxAI: parseFloat(rawAI.toFixed(1)),
    overallPercentReduction: parseFloat(overallPct.toFixed(1)),
    dimensions: dimensionsStats,
    radarData,
    interpretation,
  }
}
