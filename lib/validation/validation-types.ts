// ============================================================================
// TRIAGE Research Lab — Inter-Rater Reliability Engine Types
// ============================================================================

export interface RatingItem {
  case_id: string
  case_code?: string
  complaint_text?: string
  rater_id: string
  rater_name?: string
  category: string
  priority: string
  target_unit?: string
  notes?: string
  timestamp?: string
}

export interface PairedRating {
  case_id: string
  case_code: string
  complaint_text: string
  rating1: string
  rating2: string
  rater1_name: string
  rater2_name: string
  is_agreed: boolean
  adjudicated_value?: string
  adjudication_notes?: string
  adjudicator_name?: string
  adjudicated_at?: string
}

export interface MultiRaterRating {
  case_id: string
  case_code: string
  complaint_text: string
  ratings: Record<string, string> // rater_id -> assigned category
  is_unanimous: boolean
  majority_value?: string
  agreement_ratio: number
  adjudicated_value?: string
  adjudication_notes?: string
  adjudicator_name?: string
}

export interface CohenKappaResult {
  observed_agreement: number // Po
  chance_agreement: number // Pe
  kappa: number
  standard_error: number
  z_score: number
  p_value: number
  confidence_interval_95: [number, number]
  sample_size: number
  categories: string[]
  contingency_matrix: number[][]
  category_agreement: Record<string, {
    rater1_count: number
    rater2_count: number
    agreed_count: number
    specific_agreement: number
  }>
  interpretation: string
}

export interface GwetAC1Result {
  observed_agreement: number // Po
  chance_agreement: number // Pe
  ac1: number
  standard_error: number
  confidence_interval_95: [number, number]
  sample_size: number
  prevalence_index: number
  bias_index: number
  interpretation: string
}

export interface FleissKappaResult {
  kappa: number
  standard_error: number
  z_score: number
  p_value: number
  confidence_interval_95: [number, number]
  raters_count: number
  subjects_count: number
  categories_count: number
  categories: string[]
  overall_observed_agreement: number
  overall_chance_agreement: number
  interpretation: string
}

export interface AdjudicationAuditRecord {
  case_id: string
  case_code: string
  original_ratings: Array<{
    rater_id: string
    rater_name: string
    category: string
    priority: string
  }>
  disagreement_type: 'category' | 'priority' | 'both'
  adjudicated_category: string
  adjudicated_priority: string
  rationale: string
  adjudicator_id: string
  adjudicator_name: string
  timestamp: string
}
