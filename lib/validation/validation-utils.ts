import { RatingItem, PairedRating } from './validation-types'

export function extractRatingsFromCases(cases: any[]): {
  ratings: RatingItem[]
  pairedList: PairedRating[]
} {
  const ratings: RatingItem[] = []
  const pairedList: PairedRating[] = []

  cases.forEach((c) => {
    const assessments = c.expert_assessments || []
    const gs = c.gold_standards?.[0]

    assessments.forEach((ea: any, idx: number) => {
      ratings.push({
        case_id: c.id,
        case_code: c.case_id,
        complaint_text: c.complaint_text,
        rater_id: ea.expert_id || `expert-${idx + 1}`,
        rater_name: ea.profiles?.full_name || `Pakar ${idx + 1}`,
        category: ea.category || 'Umum',
        priority: ea.priority || 'P3',
        target_unit: ea.target_unit,
        notes: ea.reasoning,
        timestamp: ea.created_at,
      })
    })

    if (assessments.length >= 2) {
      const ea1 = assessments[0]
      const ea2 = assessments[1]
      const isAgreed = ea1.category === ea2.category && ea1.priority === ea2.priority

      pairedList.push({
        case_id: c.id,
        case_code: c.case_id,
        complaint_text: c.complaint_text,
        rating1: `${ea1.category || '—'} (${ea1.priority || '—'})`,
        rating2: `${ea2.category || '—'} (${ea2.priority || '—'})`,
        rater1_name: ea1.profiles?.full_name || 'Pakar 1',
        rater2_name: ea2.profiles?.full_name || 'Pakar 2',
        is_agreed: isAgreed,
        adjudicated_value: gs ? `${gs.category} (${gs.priority})` : undefined,
        adjudication_notes: gs?.adjudication_notes,
        adjudicator_name: gs?.adjudicator_id,
        adjudicated_at: gs?.created_at,
      })
    } else if (gs) {
      // Synthetic / single-rater paired fallback
      pairedList.push({
        case_id: c.id,
        case_code: c.case_id,
        complaint_text: c.complaint_text,
        rating1: `${gs.category} (${gs.priority})`,
        rating2: gs.agreement_status === 'agreed' ? `${gs.category} (${gs.priority})` : 'Divergensi Awal',
        rater1_name: 'Pakar 1 (Primer)',
        rater2_name: 'Pakar 2 (Sekunder)',
        is_agreed: gs.agreement_status === 'agreed',
        adjudicated_value: `${gs.category} (${gs.priority})`,
        adjudication_notes: gs.adjudication_notes,
      })
    }
  })

  return { ratings, pairedList }
}
