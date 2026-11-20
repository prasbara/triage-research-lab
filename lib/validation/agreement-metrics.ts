import { calculateCohenKappa } from './cohen-kappa'
import { calculateGwetAC1 } from './gwet-ac1'
import { calculateFleissKappa } from './fleiss-kappa'
import {
  CohenKappaResult,
  GwetAC1Result,
  FleissKappaResult,
  RatingItem,
  PairedRating,
} from './validation-types'

export interface AgreementReport {
  sample_size: number
  raters_count: number
  cohen_kappa?: CohenKappaResult
  gwet_ac1?: GwetAC1Result
  fleiss_kappa?: FleissKappaResult
  disagreement_cases: PairedRating[]
  agreed_cases_count: number
  adjudicated_cases_count: number
  overall_concordance_rate: number
  methodological_notes: string[]
}

/**
 * Computes complete Inter-Rater Reliability metrics comparing 2 or more experts
 */
export function evaluateExpertAgreement(
  ratings: RatingItem[],
  categoriesList?: string[]
): AgreementReport {
  // Group ratings by case_id
  const casesMap = new Map<string, RatingItem[]>()
  ratings.forEach((item) => {
    const list = casesMap.get(item.case_id) || []
    list.push(item)
    casesMap.set(item.case_id, list)
  })

  // Identify unique raters
  const ratersSet = new Set<string>()
  ratings.forEach((r) => ratersSet.add(r.rater_name || r.rater_id))
  const ratersList = Array.from(ratersSet)
  const ratersCount = ratersList.length

  const pairedList: PairedRating[] = []
  const rater1Vals: string[] = []
  const rater2Vals: string[] = []
  let agreedCount = 0

  casesMap.forEach((caseRatings, caseId) => {
    if (caseRatings.length >= 2) {
      const r1 = caseRatings[0]
      const r2 = caseRatings[1]
      const isAgreed = r1.category === r2.category && r1.priority === r2.priority

      if (isAgreed) agreedCount++

      rater1Vals.push(r1.category)
      rater2Vals.push(r2.category)

      pairedList.push({
        case_id: caseId,
        case_code: r1.case_code || caseId.slice(0, 8),
        complaint_text: r1.complaint_text || '',
        rating1: `${r1.category} (${r1.priority})`,
        rating2: `${r2.category} (${r2.priority})`,
        rater1_name: r1.rater_name || 'Pakar 1',
        rater2_name: r2.rater_name || 'Pakar 2',
        is_agreed: isAgreed,
        adjudicated_value: undefined,
        adjudication_notes: undefined,
      })
    }
  })

  const sampleSize = rater1Vals.length
  let cohenResult: CohenKappaResult | undefined
  let gwetResult: GwetAC1Result | undefined
  let fleissResult: FleissKappaResult | undefined

  if (sampleSize > 0) {
    cohenResult = calculateCohenKappa(rater1Vals, rater2Vals, categoriesList)
    gwetResult = calculateGwetAC1(rater1Vals, rater2Vals, categoriesList)
  }

  // If 3 or more raters exist with uniform ratings, compute Fleiss Kappa
  if (ratersCount >= 3 && categoriesList && categoriesList.length > 0) {
    const matrix: number[][] = []
    const validCases: string[] = []

    casesMap.forEach((caseRatings, caseId) => {
      if (caseRatings.length === ratersCount) {
        const row = new Array(categoriesList.length).fill(0)
        caseRatings.forEach((cr) => {
          const idx = categoriesList.indexOf(cr.category)
          if (idx !== -1) row[idx]++
        })
        matrix.push(row)
        validCases.push(caseId)
      }
    })

    if (matrix.length > 0) {
      try {
        fleissResult = calculateFleissKappa(matrix, categoriesList)
      } catch {}
    }
  }

  const disagreementCases = pairedList.filter((p) => !p.is_agreed)
  const concordanceRate = sampleSize > 0 ? (agreedCount / sampleSize) * 100 : 0

  const methodologicalNotes: string[] = [
    'Cohen’s Kappa dihitung untuk 2 penilai independen dengan estimasi varians asimtotik Fleiss-Cohen-Everitt.',
    'Gwet’s AC1 disertakan untuk mengoreksi bias paradoks prevalensi (Prevalence Paradox) pada distribusi kategori yang tidak seimbang.',
    'Interpretasi kualitatif merujuk pada standar metodologis Landis & Koch (1977) dan Altman (1991). Batasan ini bersifat deskriptif dan bukan tolok ukur absolut keberterimaan klinis.',
  ]

  return {
    sample_size: sampleSize,
    raters_count: ratersCount,
    cohen_kappa: cohenResult,
    gwet_ac1: gwetResult,
    fleiss_kappa: fleissResult,
    disagreement_cases: disagreementCases,
    agreed_cases_count: agreedCount,
    adjudicated_cases_count: 0,
    overall_concordance_rate: concordanceRate,
    methodological_notes: methodologicalNotes,
  }
}
