// Database Types for TRIAGE Research Lab
// Auto-generated from schema - update when schema changes

export type UserRole = 'admin' | 'researcher' | 'expert' | 'participant' | 'observer'
export type ResearchPhase = 'setup' | 'pilot' | 'main' | 'completed' | 'archived'
export type ComplaintSourceType = 'written' | 'verbal' | 'online' | 'phone' | 'other'
export type CaseComplexity = 'simple' | 'moderate' | 'complex'
export type ValidationStatus = 'pending' | 'in_review' | 'validated' | 'rejected' | 'archived'
export type TriageMethod = 'manual' | 'ai_assisted'
export type CompletionStatus = 'pending' | 'in_progress' | 'completed' | 'interrupted' | 'duplicate' | 'invalid'
export type AIProvider = 'nvidia' | 'gemini'
export type ConfidenceLevel = 'low' | 'medium' | 'high'
export type AgreementStatus = 'agreed' | 'adjudicated'
export type AssessmentLevel = 'task' | 'block'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  participant_code: string | null
  role: UserRole
  department: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ResearchProject {
  id: string
  name: string
  title_id: string | null
  description: string | null
  hospital_identifier: string | null
  research_phase: ResearchPhase
  protocol_version: string
  timezone: string
  language: string
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface SOPVersion {
  id: string
  project_id: string
  version: string
  name: string
  description: string | null
  is_active: boolean
  is_locked: boolean
  created_by: string | null
  created_at: string
}

export interface ComplaintCategory {
  id: string
  project_id: string
  sop_version_id: string | null
  code: string
  name: string
  name_id: string | null
  subcategories: Subcategory[]
  description: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Subcategory {
  code: string
  name: string
  name_id: string
}

export interface PriorityLevel {
  id: string
  project_id: string
  code: string
  name: string
  name_id: string | null
  level: number
  is_high_priority: boolean
  requires_escalation: boolean
  response_time_hours: number | null
  description: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface HospitalUnit {
  id: string
  project_id: string
  code: string
  name: string
  name_id: string | null
  unit_type: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface ComplaintCase {
  id: string
  project_id: string
  case_id: string
  complaint_text: string
  complaint_source_type: ComplaintSourceType | null
  case_complexity: CaseComplexity | null
  complaint_length: number
  source_type: 'real_deidentified' | 'synthetic'
  validation_status: ValidationStatus
  sop_version_id: string | null
  is_archived: boolean
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ExpertAssessment {
  id: string
  case_id: string
  expert_id: string
  assessment_round: number
  category: string | null
  subcategory: string | null
  priority: string | null
  target_unit: string | null
  escalation_required: boolean
  reasoning: string | null
  sop_reference: string | null
  confidence_level: ConfidenceLevel | null
  is_submitted: boolean
  submitted_at: string | null
  created_at: string
  updated_at: string
}

export interface GoldStandard {
  id: string
  case_id: string
  category: string
  subcategory: string | null
  priority: string
  target_unit: string
  escalation_required: boolean
  high_priority_flag: boolean
  agreement_status: AgreementStatus | null
  expert1_id: string | null
  expert2_id: string | null
  adjudicator_id: string | null
  adjudication_notes: string | null
  kappa_value: number | null
  is_locked: boolean
  version: number
  created_at: string
  updated_at: string
}

export interface ExperimentSession {
  id: string
  project_id: string
  session_code: string
  name: string
  description: string | null
  phase: ResearchPhase
  protocol_version: string | null
  sop_version_id: string | null
  random_seed: number | null
  number_of_cases: number | null
  ai_provider: AIProvider | null
  ai_model: string | null
  ai_temperature: number
  ai_max_tokens: number
  prompt_version: string
  is_locked: boolean
  started_at: string | null
  completed_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface TriageTask {
  id: string
  assignment_id: string | null
  session_id: string | null
  participant_id: string | null
  case_id: string | null
  task_order: number
  method: TriageMethod
  task_started_at: string | null
  ai_requested_at: string | null
  ai_responded_at: string | null
  task_submitted_at: string | null
  duration_seconds: number | null
  ai_wait_seconds: number | null
  completion_status: CompletionStatus
  interruption_reason: string | null
  created_at: string
  updated_at: string
}

export interface AIInference {
  id: string
  task_id: string | null
  session_id: string | null
  case_id: string | null
  provider: AIProvider
  model: string
  model_identifier: string | null
  prompt_version: string | null
  prompt_hash: string | null
  temperature: number | null
  max_tokens: number | null
  request_timestamp: string | null
  response_timestamp: string | null
  latency_ms: number | null
  prompt_tokens: number | null
  completion_tokens: number | null
  total_tokens: number | null
  raw_response: string | null
  parsed_response: Record<string, unknown> | null
  validation_status: 'valid' | 'invalid' | 'error' | 'timeout' | null
  error_message: string | null
  ai_category: string | null
  ai_subcategory: string | null
  ai_priority: string | null
  ai_target_unit: string | null
  ai_escalation_required: boolean | null
  ai_reasoning: string | null
  ai_sop_reference: string | null
  ai_requires_human_review: boolean | null
  created_at: string
}

export interface TriageDecision {
  id: string
  task_id: string
  inference_id: string | null
  final_category: string
  final_subcategory: string | null
  final_priority: string
  final_target_unit: string
  final_escalation_required: boolean
  reasoning: string | null
  ai_recommendation_accepted: boolean | null
  any_field_revised: boolean
  gs_category_match: boolean | null
  gs_priority_match: boolean | null
  gs_unit_match: boolean | null
  gs_escalation_match: boolean | null
  created_at: string
}

export interface WorkloadResponse {
  id: string
  session_id: string | null
  participant_id: string | null
  method: TriageMethod | null
  assessment_level: AssessmentLevel
  task_id: string | null
  mental_demand: number | null
  physical_demand: number | null
  temporal_demand: number | null
  performance: number | null
  effort: number | null
  frustration: number | null
  raw_tlx_score: number | null
  is_weighted: boolean
  pairwise_weights: Record<string, number> | null
  weighted_tlx_score: number | null
  is_finalized: boolean
  created_at: string
  updated_at: string
}
