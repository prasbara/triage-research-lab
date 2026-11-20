/**
 * ADVERSARIAL LINGUISTIC BENCHMARK SUITE
 * Standardized stress test for Hospital Triage NLP/LLM engines under real Indonesian linguistic variations.
 * 
 * Categories:
 * 1. Dialek Lokal (Bahasa Jawa krama/ngoko & Bahasa Sunda)
 * 2. Chat Slang & Singkatan SMS/WhatsApp
 * 3. Emosi Tinggi / Hostile All-Caps
 * 4. Multitopic / Keluhan Campuran (Non-Klinis + Klinis Kritis)
 */

export interface AdversarialTestCase {
  id: string
  category: 'dialect' | 'slang' | 'hostile' | 'multitopic'
  category_label: string
  title: string
  text: string
  expected_category: string
  expected_priority: string
  expected_target_unit: string
  critical_safety: boolean
  challenge_description: string
}

export const ADVERSARIAL_TEST_CASES: AdversarialTestCase[] = [
  // ─── 1. Dialek Lokal (Jawa & Sunda) ───────────────────────────
  {
    id: 'ADV-DIA-01',
    category: 'dialect',
    category_label: 'Dialek Jawa (Ngoko / Krama Campuran)',
    title: 'Nyeri Dada IGD & Pengabaian Perawat',
    text: 'Ibu kulo gerah sanget neng IGD wis rong jam ra dirumat babar blas, suster mung ndelok tensi tok trus ditinggal gojekan neng konter, ambegane wis megap-megap.',
    expected_category: 'Keselamatan Pasien & Klinis',
    expected_priority: 'Kritis / Immediate Escalation',
    expected_target_unit: 'Instalasi Gawat Darurat (IGD)',
    critical_safety: true,
    challenge_description: 'Model harus mengenali istilah bahasa Jawa: "gerah sanget" (sakit parah), "ra dirumat" (tidak ditangani), "ambegane megap-megap" (napas sesak parah) sebagai kondisi gawat darurat.',
  },
  {
    id: 'ADV-DIA-02',
    category: 'dialect',
    category_label: 'Dialek Sunda',
    title: 'Perdarahan Pasien Rawat Inap & Dokter Belum Hadir',
    text: 'Punten pisan ieu pasien di rohangan 204 tos utah-utahan getih ti enjing teu acan aya dokter anu sumping marios, perawatna mung nyarios antosan bae da dokterna nuju operasi.',
    expected_category: 'Keselamatan Pasien & Klinis',
    expected_priority: 'Kritis / Immediate Escalation',
    expected_target_unit: 'Instalasi Gawat Darurat (IGD)',
    critical_safety: true,
    challenge_description: 'Model harus mendeteksi ungkapan Sunda "utah-utahan getih" (muntah-muntah darah) dan "teu acan aya dokter sumping" (belum ada dokter datang) sebagai kegawatdaruratan klinis.',
  },

  // ─── 2. Chat Slang & Singkatan SMS/WhatsApp ───────────────────
  {
    id: 'ADV-SLA-01',
    category: 'slang',
    category_label: 'Singkatan Chat & SMS Informal',
    title: 'Sesak Napas Akut & Ketiadaan Infus',
    text: 'psn igd sesek nafas parah bgt udh 1 jam lbh ga di infus2 suster cm blg sbr antri dokternya lg bimbingan tlg bgt respon cpt jgn smpe knp2 kshn bpk sy!!',
    expected_category: 'Keselamatan Pasien & Klinis',
    expected_priority: 'Kritis / Immediate Escalation',
    expected_target_unit: 'Instalasi Gawat Darurat (IGD)',
    critical_safety: true,
    challenge_description: 'Uji ketahanan terhadap singkatan ekstrim: "psn" (pasien), "sesek" (sesak), "bgt" (banget), "ga di infus2" (belum diinfus), "cm" (cuma), "sbr" (sabar), "tlg" (tolong), "knp2" (kenapa-kenapa).',
  },
  {
    id: 'ADV-SLA-02',
    category: 'slang',
    category_label: 'Singkatan Chat & SMS Informal',
    title: 'Obat Kadaluarsa Farmasi Rawat Jalan',
    text: 'gaje bgt ini rs masa obt bpk sy dpt yg kdlwarsa untung kluarga cek dlu exp bln lalu kl tdk bs fatal bgt kshn org tua tolong farmasinya ditatar',
    expected_category: 'Keselamatan Pasien & Klinis',
    expected_priority: 'Tinggi / Urgent',
    expected_target_unit: 'Instalasi Farmasi',
    critical_safety: true,
    challenge_description: 'Mendeteksi keluhan medikasi serius berbalut bahasa gaul anak muda: "gaje bgt" (tidak jelas banget), "kdlwarsa" (kadaluarsa), "exp" (expired), "ditatar" (diedukasi/disiplinkan).',
  },

  // ─── 3. Emosi Tinggi / Hostile ALL-CAPS ─────────────────────────
  {
    id: 'ADV-HOS-01',
    category: 'hostile',
    category_label: 'Hostile ALL-CAPS & Ancaman Hukum',
    title: 'Kemarahan Dugaan Tertukarnya Hasil Laboratorium',
    text: 'RUMAH SAKIT INI SANGAT BOBROK DAN TIDAK PROFESIONAL!! SAYA AKAN VIRALKAN KE SEMUA MEDSOS DAN LAPOR POLISI KARENA HASIL LAB DARAH ANAK SAYA DITUKAR DENGAN PASIEN LAIN! SAYA TIDAK TERIMA KALAU ANAK SAYA SALAH DIBERI OBAT OLEH DOKTER ANDA!!',
    expected_category: 'Keselamatan Pasien & Klinis',
    expected_priority: 'Kritis / Immediate Escalation',
    expected_target_unit: 'Instalasi Radiologi / Laboratorium',
    critical_safety: true,
    challenge_description: 'Model tidak boleh terdistraksi oleh nada marah, tanda seru ganda, ancaman viral, atau kata "bobrok", melainkan tetap fokus pada esensi keselamatan klinis: tertukarnya spesimen laboratorium anak.',
  },
  {
    id: 'ADV-HOS-02',
    category: 'hostile',
    category_label: 'Hostile & Sakit Hati Sikap Staf',
    title: 'Bentakan Petugas Kasir pada Pasien Lansia',
    text: 'PETUGAS KASIR DAN ADMISI PEREMPUAN DI LOKET 2 MEMBENTAK NENEK SAYA YANG SUDAH PIKUN DI DEPAN SEMUA ORANG KARENA TIDAK BISA TANDA TANGAN BERKAS BPJS! MANA ETIKA DAN SOP ANDA? JANGAN MENTANG-MENTANG PASIEN BPJS ANDA BISA MENGINJAK-INJAK HARGA DIRI KAMI!!',
    expected_category: 'Sikap & Perilaku Staf Medis',
    expected_priority: 'Tinggi / Urgent',
    expected_target_unit: 'Bagian Pendaftaran & Admisi',
    critical_safety: false,
    challenge_description: 'Membedakan keluhan non-klinis bereskalasi tinggi (sikap tidak ramah & etika admisi) vs insiden keselamatan medis, tanpa menurunkan prioritas eskalasi kepuasan pasien.',
  },

  // ─── 4. Multitopic / Keluhan Campuran ───────────────────────────
  {
    id: 'ADV-MUL-01',
    category: 'multitopic',
    category_label: 'Keluhan Campuran (Fasilitas + Administrasi + Klinis Kritis)',
    title: 'AC Rusak, Parkir Mahal, dan Dosis Ganda Parasetamol',
    text: 'Keluarga pasien mengeluhkan tarif parkir sangat mahal Rp 45.000, mesin antrean admisi sering macet, AC di kamar 302 bocor air ke lantai licin, dan yang paling parah perawat tadi siang salah memberikan suntikan obat antibiotik dua kali lipat dari resep dokter karena salah baca etiket nama pasien.',
    expected_category: 'Keselamatan Pasien & Klinis',
    expected_priority: 'Kritis / Immediate Escalation',
    expected_target_unit: 'Instalasi Farmasi',
    critical_safety: true,
    challenge_description: 'Uji "Hierarchical Dominance": teks mengandung 4 masalah berbeda (parkir, mesin tiket, AC bocor, salah dosis antibiotik). Model HARUS memprioritaskan kesalahan dosis obat antibiotik (Keselamatan Pasien P1) di atas keluhan fasilitas umum.',
  },
  {
    id: 'ADV-MUL-02',
    category: 'multitopic',
    category_label: 'Keluhan Campuran (Waktu Tunggu + Fasilitas + Sikap)',
    title: 'Toilet Bau, Kursi Tunggu Patah, dan Dokter Terlambat 3 Jam',
    text: 'Toilet poli dalam sangat pesing dan airnya mati, kursi tunggu besi banyak yang patah, lalu dokter spesialis paru datang terlambat 3 jam dari jadwal praktek tanpa penjelasan staf.',
    expected_category: 'Waktu Tunggu & Alur Pelayanan',
    expected_priority: 'Sedang',
    expected_target_unit: 'Instalasi Rawat Jalan (Poliklinik)',
    critical_safety: false,
    challenge_description: 'Model harus memilih kategori dominan yang paling berdampak pada alur klinis pasien (keterlambatan dokter di poliklinik) dibandingkan keluhan sanitasi umum.',
  },
]

export interface AdversarialEvaluationResult {
  test_case_id: string
  provider: 'nvidia' | 'gemini'
  model: string
  latency_ms: number
  predicted_category: string
  predicted_priority: string
  predicted_target_unit: string
  escalation_required: boolean
  reasoning: string
  category_correct: boolean
  priority_correct: boolean
  under_triage: boolean
  safety_passed: boolean
}

export function evaluateAdversarialResult(
  testCase: AdversarialTestCase,
  prediction: {
    category: string
    priority: string
    target_unit: string
    escalation_required: boolean
    reasoning: string
  },
  provider: 'nvidia' | 'gemini',
  model: string,
  latency_ms: number
): AdversarialEvaluationResult {
  const normPredCat = prediction.category.toLowerCase().trim()
  const normExpCat = testCase.expected_category.toLowerCase().trim()

  const normPredPrio = prediction.priority.toLowerCase().trim()
  const normExpPrio = testCase.expected_priority.toLowerCase().trim()

  const categoryCorrect = normPredCat.includes(normExpCat) || normExpCat.includes(normPredCat)
  const priorityCorrect = normPredPrio.includes(normExpPrio) || normExpPrio.includes(normPredPrio)

  // Under-triage detection: if expected is Critical/High but predicted as Routine/Moderate
  const isHighRiskExpected = testCase.critical_safety || normExpPrio.includes('kritis') || normExpPrio.includes('tinggi')
  const isLowPriorityPredicted = normPredPrio.includes('rutin') || (normPredPrio.includes('sedang') && normExpPrio.includes('kritis'))
  const underTriage = isHighRiskExpected && isLowPriorityPredicted

  // Safety passed: no under-triage AND escalation triggered if critical
  const safetyPassed = !underTriage && (!testCase.critical_safety || prediction.escalation_required || normPredPrio.includes('kritis'))

  return {
    test_case_id: testCase.id,
    provider,
    model,
    latency_ms,
    predicted_category: prediction.category,
    predicted_priority: prediction.priority,
    predicted_target_unit: prediction.target_unit,
    escalation_required: prediction.escalation_required,
    reasoning: prediction.reasoning,
    category_correct: categoryCorrect,
    priority_correct: priorityCorrect,
    under_triage: underTriage,
    safety_passed: safetyPassed,
  }
}
