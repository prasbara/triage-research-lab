/**
 * TRIAGE Research Lab - Resilient JSON Repair and Extraction Engine
 * Designed for high-reliability clinical decision support systems.
 * Handles LLM reasoning preambles, unclosed quotes, markdown fences,
 * and truncated token outputs with zero-crash guarantee.
 */

import { ComplaintClassificationResult } from '@/types'

export interface ExtractedTriageData {
  category: string
  subcategory: string | null
  priority: string
  target_unit: string
  escalation_required: boolean
  reasoning: string
  sop_reference: string
  requires_human_review: boolean
}

/**
 * Strips comments, trailing commas, and unquoted keys from pseudo-JSON
 */
function sanitizeJSONString(str: string): string {
  return str
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
    .replace(/\/\/.*/g, '')            // remove line comments
    .replace(/,\s*([}\]])/g, '$1')     // remove trailing commas
    .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // quote unquoted keys
    .trim()
}

/**
 * Attempts to repair an unclosed or truncated JSON string by balancing quotes and braces
 */
function repairTruncatedJSON(raw: string): any {
  let s = raw.trim()
  if (!s) return null

  // 1. If cut off inside a string literal (odd number of unescaped quotes), close it
  let inString = false
  let escaped = false
  for (let i = 0; i < s.length; i++) {
    const char = s[i]
    if (char === '\\' && !escaped) {
      escaped = true
      continue
    }
    if (char === '"' && !escaped) {
      inString = !inString
    }
    escaped = false
  }

  if (inString) {
    s += '"'
  }

  // 2. Count unmatched braces and brackets
  let openBraces = 0
  let openBrackets = 0
  inString = false
  escaped = false

  for (let i = 0; i < s.length; i++) {
    const char = s[i]
    if (char === '\\' && !escaped) {
      escaped = true
      continue
    }
    if (char === '"' && !escaped) {
      inString = !inString
    }
    if (!inString) {
      if (char === '{') openBraces++
      if (char === '}') openBraces = Math.max(0, openBraces - 1)
      if (char === '[') openBrackets++
      if (char === ']') openBrackets = Math.max(0, openBrackets - 1)
    }
    escaped = false
  }

  // Remove any trailing commas before appending closers
  s = s.replace(/,\s*$/, '')

  // Close open brackets and braces
  for (let i = 0; i < openBrackets; i++) s += ']'
  for (let i = 0; i < openBraces; i++) s += '}'

  try {
    return JSON.parse(sanitizeJSONString(s))
  } catch {
    return null
  }
}

/**
 * Regex entity extractor for when JSON structure is heavily malformed or embedded in reasoning text
 */
function regexExtractFields(
  text: string,
  defaults: {
    categories?: string[]
    priorities?: string[]
    units?: string[]
  }
): ExtractedTriageData | null {
  const cleanVal = (v: string | null | undefined): string | null => {
    if (!v) return null
    return v
      .replace(/^["'\s]+|["'\s,]+$/g, '')
      .replace(/\\"/g, '"')
      .trim()
  }

  // Match key patterns (supporting English and Indonesian keys)
  const categoryMatch = text.match(/"(?:category|kategori)"\s*:\s*"([^"\n\r]+)/i)
  const subcategoryMatch = text.match(/"(?:subcategory|subkategori)"\s*:\s*"([^"\n\r]+)/i)
  const priorityMatch = text.match(/"(?:priority|prioritas)"\s*:\s*"([^"\n\r]+)/i)
  const targetUnitMatch = text.match(/"(?:target_unit|unit)"\s*:\s*"([^"\n\r]+)/i)
  const reasoningMatch = text.match(/"(?:reasoning|alasan|penjelasan)"\s*:\s*"([^"\r\n]*(?:"|(?=\n|$)))/i)
  const sopMatch = text.match(/"(?:sop_reference|referensi_sop)"\s*:\s*"([^"\n\r]+)/i)
  
  const escalationMatch = /"(?:escalation_required|is_high_risk)"\s*:\s*true/i.test(text)
  const reviewMatch = /"(?:requires_human_review)"\s*:\s*true/i.test(text)

  const category = cleanVal(categoryMatch?.[1]) || defaults.categories?.[0] || 'Keselamatan Pasien & Klinis'
  const priority = cleanVal(priorityMatch?.[1]) || defaults.priorities?.[2] || 'Tinggi / Urgent'
  const targetUnit = cleanVal(targetUnitMatch?.[1]) || defaults.units?.[0] || 'Instalasi Gawat Darurat (IGD)'
  const reasoning = cleanVal(reasoningMatch?.[1]) || 'Klasifikasi otomatis berdasarkan analisis teks keluhan pasien.'
  const sopReference = cleanVal(sopMatch?.[1]) || 'SOP Triase Administratif Rumah Sakit'

  // If we found at least category, priority, or target_unit, it's a valid extraction
  if (categoryMatch || priorityMatch || targetUnitMatch || reasoningMatch) {
    return {
      category,
      subcategory: cleanVal(subcategoryMatch?.[1]),
      priority,
      target_unit: targetUnit,
      escalation_required: escalationMatch,
      reasoning,
      sop_reference: sopReference,
      requires_human_review: reviewMatch || escalationMatch,
    }
  }

  return null
}

/**
 * Universal JSON Parser & Extractor for LLM Responses
 */
export function extractAndValidateTriageJSON(
  rawText: string | null | undefined,
  context?: {
    available_categories?: string[]
    available_priorities?: string[]
    available_units?: string[]
  }
): ComplaintClassificationResult | null {
  if (!rawText) return null

  const defaults = {
    categories: context?.available_categories || [
      'Administrasi & Pendaftaran',
      'Komunikasi & Informasi Petugas',
      'Sikap & Perilaku Staf Medis',
      'Fasilitas & Sarana Prasarana',
      'Waktu Tunggu & Alur Pelayanan',
      'Keselamatan Pasien & Klinis',
    ],
    priorities: context?.available_priorities || [
      'Rutin',
      'Sedang',
      'Tinggi / Urgent',
      'Kritis / Emergency',
    ],
    units: context?.available_units || [
      'Bagian Pendaftaran & Admisi',
      'Instalasi Rawat Jalan (Poliklinik)',
      'Instalasi Farmasi',
      'Instalasi Radiologi / Laboratorium',
      'Instalasi Gawat Darurat (IGD)',
      'Customer Care / Humas',
      'Bagian Keuangan / Kasir',
    ],
  }

  // 1. Direct parse attempt
  try {
    const direct = JSON.parse(sanitizeJSONString(rawText.trim()))
    if (direct && typeof direct === 'object' && (direct.category || direct.kategori)) {
      return normalizeResult(direct, defaults)
    }
  } catch {}

  // 2. Scan markdown code fences ```json ... ```
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/gi
  let blockMatch: RegExpExecArray | null
  while ((blockMatch = codeBlockRegex.exec(rawText)) !== null) {
    const candidate = blockMatch[1].trim()
    try {
      const parsed = JSON.parse(sanitizeJSONString(candidate))
      if (parsed && typeof parsed === 'object') {
        return normalizeResult(parsed, defaults)
      }
    } catch {
      const repaired = repairTruncatedJSON(candidate)
      if (repaired) return normalizeResult(repaired, defaults)
    }
  }

  // 3. Scan for outermost curly braces { ... }
  const firstBrace = rawText.indexOf('{')
  const lastBrace = rawText.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = rawText.substring(firstBrace, lastBrace + 1)
    try {
      const parsed = JSON.parse(sanitizeJSONString(candidate))
      if (parsed && typeof parsed === 'object' && (parsed.category || parsed.kategori || parsed.priority)) {
        return normalizeResult(parsed, defaults)
      }
    } catch {
      const repaired = repairTruncatedJSON(candidate)
      if (repaired && (repaired.category || repaired.kategori || repaired.priority)) {
        return normalizeResult(repaired, defaults)
      }
    }
  }

  // 4. Try repairing from first brace to the end of text
  if (firstBrace !== -1) {
    const candidateToEnd = rawText.substring(firstBrace)
    const repaired = repairTruncatedJSON(candidateToEnd)
    if (repaired && (repaired.category || repaired.kategori || repaired.priority)) {
      return normalizeResult(repaired, defaults)
    }
  }

  // 5. Fallback: Robust Regex Field Extraction
  const regexData = regexExtractFields(rawText, defaults)
  if (regexData) {
    return normalizeResult(regexData, defaults)
  }

  return null
}

function normalizeResult(
  obj: any,
  defaults: { categories: string[]; priorities: string[]; units: string[] }
): ComplaintClassificationResult {
  const cleanCategory = obj.category || obj.kategori || defaults.categories[0]
  const cleanPriority = obj.priority || obj.prioritas || defaults.priorities[1]
  const cleanUnit = obj.target_unit || obj.unit || obj.unit_terkait || defaults.units[0]
  const cleanSubcategory = obj.subcategory || obj.subkategori || null

  // Ensure boolean types
  const escalationRequired = Boolean(obj.escalation_required ?? obj.is_high_risk ?? false)
  const requiresHumanReview = Boolean(obj.requires_human_review ?? escalationRequired ?? true)

  return {
    category: String(cleanCategory),
    subcategory: cleanSubcategory ? String(cleanSubcategory) : null,
    priority: String(cleanPriority),
    target_unit: String(cleanUnit),
    escalation_required: escalationRequired,
    reasoning: String(obj.reasoning || obj.alasan || 'Analisis kepatuhan triase administratif rumah sakit.'),
    sop_reference: String(obj.sop_reference || obj.referensi_sop || 'SOP Triase Administratif Rumah Sakit'),
    requires_human_review: requiresHumanReview,
  }
}
