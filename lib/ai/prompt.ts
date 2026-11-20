export interface PromptContext {
  complaint_text: string
  case_id: string
  available_categories: string[]
  available_priorities: string[]
  available_units: string[]
  sop_context?: string
}

export const PROMPT_VERSION = '1.0.0'

export function buildClassificationPrompt(ctx: PromptContext): string {
  return `Anda adalah sistem pendukung keputusan untuk klasifikasi keluhan pasien administratif di rumah sakit.

TUGAS: Klasifikasikan keluhan pasien berikut berdasarkan kategori, prioritas, dan unit yang bertanggung jawab.

KELUHAN PASIEN (ID: ${ctx.case_id}):
"${ctx.complaint_text}"

KATEGORI YANG TERSEDIA:
${ctx.available_categories.map((c, i) => `${i + 1}. ${c}`).join('\n')}

TINGKAT PRIORITAS:
${ctx.available_priorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}

UNIT YANG TERSEDIA:
${ctx.available_units.map((u, i) => `${i + 1}. ${u}`).join('\n')}

${ctx.sop_context ? `KONTEKS SOP:\n${ctx.sop_context}\n` : ''}

INSTRUKSI PENTING:
1. Ini adalah klasifikasi ADMINISTRATIF, bukan triase medis klinis
2. Jika keluhan berpotensi mengandung keselamatan pasien, set requires_human_review = true
3. Berikan reasoning yang jelas berdasarkan isi keluhan
4. Gunakan HANYA nilai yang tersedia dalam kategori, prioritas, dan unit di atas
5. Ini adalah rekomendasi - keputusan akhir tetap pada petugas manusia

Berikan respons dalam format JSON yang valid:
{
  "category": "<salah satu dari kategori tersedia>",
  "subcategory": "<subkategori jika relevan, atau null>",
  "priority": "<salah satu dari prioritas tersedia>",
  "target_unit": "<salah satu dari unit tersedia>",
  "escalation_required": <true|false>,
  "reasoning": "<penjelasan singkat klasifikasi dalam bahasa Indonesia>",
  "sop_reference": "<referensi SOP yang relevan atau 'Lihat SOP berlaku'>",
  "requires_human_review": <true|false>
}

PERINGATAN KESELAMATAN: Jangan melakukan diagnosis medis. Jika keluhan mengandung unsur kedaruratan medis (nyawa terancam), set requires_human_review = true dan arahkan ke prosedur eskalasi resmi.`
}

export function hashPrompt(prompt: string): string {
  // Simple hash for prompt versioning
  let hash = 0
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}
