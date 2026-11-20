import { z } from 'zod'

export const ComplaintClassificationSchema = z.object({
  category: z.string().min(1),
  subcategory: z.string().nullable().optional(),
  priority: z.string().min(1),
  target_unit: z.string().min(1),
  escalation_required: z.boolean(),
  reasoning: z.string().min(1),
  sop_reference: z.string(),
  requires_human_review: z.boolean()
})

export type ComplaintClassification = z.infer<typeof ComplaintClassificationSchema>

export const ProviderHealthSchema = z.object({
  provider: z.enum(['nvidia', 'gemini']),
  model: z.string(),
  status: z.enum(['ok', 'error']),
  latency_ms: z.number().optional(),
  error: z.string().optional()
})
