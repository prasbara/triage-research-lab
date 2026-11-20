'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Layers,
  Activity,
  ShieldCheck,
  Cpu,
  BarChart2,
  FileText,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Lock,
  Building2,
  FileSpreadsheet,
} from 'lucide-react'

export function AboutClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx)
  }

  const faqs = [
    {
      q: '1. Mengapa topik riset ini penting dan berada dalam ranah keilmuan Manajemen Rumah Sakit?',
      a: 'Keluhan pasien adalah indikator langsung mutu pelayanan rumah sakit. Penanganan keluhan yang lambat atau salah disposisi meningkatkan risiko konflik hukum, ketidakpuasan pasien, dan keterlambatan respon klinis. Riset ini bukan tentang pembuatan algoritma AI dari nol (Computer Science), melainkan mengevaluasi efektivitas manajerial (Hospital Quality Management & Healthcare Informatics) terkait bagaimana integrasi teknologi AI dapat meningkatkan efisiensi proses alur kerja triase tanpa mengorbankan akurasi dan keselamatan.'
    },
    {
      q: '2. Mengapa judul riset ini diubah menjadi lebih spesifik dibanding formulasi awal?',
      a: 'Judul spesifik "Efektivitas Pendampingan Large Language Model dalam Klasifikasi dan Prioritisasi Keluhan Pasien terhadap Waktu Triase dan Ketepatan Penanganan Awal Keluhan di Rumah Sakit" membatasi lingkup penelitian secara presisi pada fase awal administratif (triase awal), bukan seluruh siklus penyelesaian komplain (end-to-end resolution) yang melibatkan investigasi klinis mendalam.'
    },
    {
      q: '3. Apa beda triase keluhan administratif dengan triase klinis medis (Emergency Triage)?',
      a: 'Triase klinis (seperti ESI atau ATS di IGD) menentukan kegawatdaruratan nyawa pasien secara biologis. Triase keluhan administratif menentukan urgensi manajerial, penanggung jawab unit, dan risiko reputasi/eskalasi hukum. Meskipun berbeda, keluhan administratif seringkali memuat petunjuk keselamatan pasien yang jika diabaikan dapat membahayakan nyawa pasien.'
    },
    {
      q: '4. Mengapa penelitian ini memerlukan partisipan manusia (Human-in-the-Loop)?',
      a: 'AI di lingkungan layanan kesehatan tidak boleh menjadi pengambil keputusan otonom (autonomous agent) dalam mendisposisikan keluhan. Paradigma Human-in-the-Loop memastikan tanggung jawab hukum dan etis tetap berada pada staf manusia yang berwenang, sementara AI berfungsi sebagai sistem pendukung keputusan (Decision Support System).'
    },
    {
      q: '5. Mengapa variabel luaran primer diukur sebagai waktu total triase, bukan latensi AI saja?',
      a: 'Mengukur latensi komputasi AI saja tidak mencerminkan efektivitas operasional di dunia nyata. Waktu triase komprehensif mencakup: waktu staf membaca teks, menunggu AI, memeriksa rekomendasi, melakukan verifikasi/koreksi, hingga menyimpan keputusan final. Efisiensi sejati adalah penghematan waktu staf manusia.'
    },
    {
      q: '6. Mengapa diperlukan dua ahli independen untuk menyusun Standar Emas (Gold Standard)?',
      a: 'Akurasi AI tidak memiliki makna ilmiah jika dievaluasi terhadap acuan yang subjektif atau tidak terstandarisasi. Dua ahli independen menelaah kasus secara terpisah untuk menguji kesepakatan (inter-rater agreement). Kasus yang tidak disepakati diadili oleh adjudicator independen sebelum dikunci sebagai Gold Standard.'
    },
    {
      q: '7. Mengapa Cohen\'s Kappa digunakan untuk mengukur reliabilitas antar-penilai?',
      a: 'Cohen\'s Kappa mengoreksi kesepakatan acak yang mungkin terjadi secara kebetulan (agreement by chance). Nilai Kappa yang memadai membuktikan bahwa taksonomi SOP rumah sakit dapat diterapkan secara konsisten dan andal.'
    },
    {
      q: '8. Mengapa digunakan desain acak berimbang (Counterbalanced Randomized Task Design)?',
      a: 'Untuk mencegah bias urutan (order effect) dan efek kelelahan (fatigue effect). Setiap partisipan mengerjakan blok manual dan blok AI-assisted dengan urutan yang dirotasikan, sehingga perbedaan performa murni mencerminkan intervensi pendampingan AI.'
    },
    {
      q: '9. Apa itu High-Priority Recall dan mengapa metrik ini sangat krusial?',
      a: 'High-Priority Recall dihitung sebagai TP / (TP + FN) khusus untuk keluhan berprioritas tinggi/kritis. Dalam konteks rumah sakit, False Negative (keluhan darurat atau berisiko malpraktik yang keliru diklasifikasikan sebagai keluhan rutin) memiliki konsekuensi hukum dan keselamatan pasien yang fatal.'
    },
    {
      q: '10. Mengapa digunakan Linear Mixed-Effects Model (LMM) untuk analisis inferensial waktu?',
      a: 'Data eksperimen berasal dari partisipan yang sama yang mengerjakan banyak kasus (repeated measures / hierarchical clustering). Uji t-test independen biasa melanggar asumsi independensi observasi. LMM memperhitungkan variasi acak antar-partisipan dan antar-kasus keluhan secara valid.'
    },
    {
      q: '11. Mengapa platform ini mengintegrasikan dua provider AI (NVIDIA NIM dan Google Gemini)?',
      a: 'Penggunaan dua provider ilmiah memvalidasi bahwa efektivitas triase bukan artefak dari satu vendor tertentu, melainkan karakteristik teknologi LLM terstandar. NVIDIA NIM mewakili inferensi enterprise teroptimasi (Nemotron 3.5 Reasoning), sedangkan Google Gemini mewakili model fondasi multimodal berkecepatan tinggi.'
    },
    {
      q: '12. Bagaimana privasi dan kerahasiaan data pasien dijaga saat memanggil API luar?',
      a: 'Data keluhan yang diuji dalam penelitian telah melalui proses de-identifikasi ketat (penghapusan nama pasien, nomor rekam medis, alamat, dan kontak) atau menggunakan skenario kasus sintetik yang divalidasi ahli. Tidak ada identitas pasien yang dikirimkan ke server eksternal.'
    },
    {
      q: '13. Mengapa kasus keluhan sintetik diperbolehkan dalam penelitian eksperimental?',
      a: 'Kasus sintetik yang disusun secara ilmiah dan divalidasi ahli memungkinkan standarisasi tingkat kompleksitas, keterwakilan seluruh kategori SOP, serta eliminasi total risiko pelanggaran data pribadi pasien.'
    },
    {
      q: '14. Mengapa instrumen NASA-TLX digunakan untuk mengukur beban kerja?',
      a: 'NASA-TLX adalah instrumen baku psikometrik yang mengukur enam dimensi beban kerja: Mental Demand, Physical Demand, Temporal Demand, Performance, Effort, dan Frustration. Penghematan waktu yang diiringi kenaikan beban mental (frustrasi) bukanlah intervensi manajerial yang baik.'
    },
    {
      q: '15. Bagaimana platform ini mencatat revisi yang dilakukan oleh petugas terhadap AI?',
      a: 'Setiap kali petugas mengubah bidang rekomendasi AI (kategori, prioritas, unit, eskalasi), sistem mencatat nilai asli AI, nilai koreksi petugas, dan alasan revisi. Data ini menjadi metrik AI Revision Rate dan mendeteksi titik ketidaksesuaian model.'
    },
    {
      q: '16. Apakah platform ini dapat langsung menggantikan sistem tiket komplain rumah sakit?',
      a: 'TRIAGE Research Lab adalah platform instrumen riset eksperimental berstandar audit akademik, bukan sistem penanganan tiket operasional sehari-hari. Tujuannya adalah mengumpulkan bukti ilmiah empiris untuk justifikasi kebijakan manajemen rumah sakit.'
    },
    {
      q: '17. Bagaimana kerangka teori Donabedian diterapkan dalam riset ini?',
      a: 'Struktur: Ketersediaan SOP, staf triase, dan teknologi LLM. Proses: Alur kerja klasifikasi manual vs pendampingan AI berlandaskan Human-in-the-Loop. Luaran (Outcome): Waktu respon triase, akurasi disposisi, penangkapan risiko tinggi, dan persepsi beban kerja staf.'
    },
    {
      q: '18. Bagaimana aplikasi ini dapat dipertanggungjawabkan dalam sidang tesis magister?',
      a: 'Platform ini menyimpan seluruh jejak audit: random seed, kode partisipan, timestamp mikro-detik, hash prompt, raw response LLM, telaah ahli independen, hingga formula statistika yang dapat direproduksi penuh menggunakan skrip R.'
    }
  ]

  // Indonesian Regulatory Compliance Matrix
  const regulations = [
    {
      law: 'UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (PDP)',
      articles: 'Pasal 4, 16, 20, 26, 35, 37, 39',
      obligation: 'Kewajiban pelindungan data pribadi spesifik (kesehatan) melalui pemrosesan sah, minimisasi data, de-identifikasi/pseudonimisasi, dan pengamanan teknis.',
      implementation: 'De-identifikasi total narasi keluhan (penghapusan NIK, nama, alamat, no. RM) sebelum inferensi AI. Pembatasan akses berbasis peran (RBAC) dan audit logging PostgreSQL.',
      status: 'Terpenuhi (Compliant)',
    },
    {
      law: 'PP No. 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik (PSTE)',
      articles: 'Pasal 3, 14, 15, 21',
      obligation: 'Kewajiban menjaga keandalan, keamanan, kerahasiaan, dan jejak audit (audit trail) pada seluruh pemrosesan sistem elektronik.',
      implementation: 'Pencatatan riwayat setiap interaksi: timestamp mikrodetik, hash prompt, raw AI response, dan log revisi perubahan oleh petugas staf.',
      status: 'Terpenuhi (Compliant)',
    },
    {
      law: 'Permenkes No. 24 Tahun 2022 tentang Rekam Medis',
      articles: 'Pasal 26, 27, 28, 30',
      obligation: 'Kerahasiaan dan keamanan informasi rekam medis serta data keluhan terkait pelayanan klinis pasien.',
      implementation: 'Karantina data klinis; teks keluhan yang masuk ke platform penelitian dipisahkan dari database SIMRS utama dan disaring secara ketat.',
      status: 'Terpenuhi (Compliant)',
    },
    {
      law: 'Standar Nasional Akreditasi Rumah Sakit (KARS / SNARS)',
      articles: 'Bab PMKP & MKE',
      obligation: 'Tata kelola penanganan komplain, pengukuran waktu tanggap (respons time), analisis insiden keselamatan pasien, dan kepuasan pelayanan.',
      implementation: 'Taksonomi 6 kategori baku KARS, pemisahan metrik High-Priority Recall (P1 & P2), dan pemantauan durasi awal penanganan keluhan.',
      status: 'Terpenuhi (Compliant)',
    },
  ]

  // 12-Factor Implementation Readiness Framework
  const readinessCriteria = [
    {
      factor: '1. Kualitas Data (Data Quality)',
      desc: 'Dataset keluhan bersih dari duplikasi, memiliki metadata lengkap, dan tervalidasi.',
      status: 'Memenuhi kriteria pengujian',
      notes: '25 kasus tervalidasi dengan metadata lengkap, provenance tercatat, dan bebas data leakage.',
      variant: 'success',
    },
    {
      factor: '2. Keterwakilan Dataset (Representativeness)',
      desc: 'Mencakup variasi kompleksitas (simple, moderate, complex) dan bahasa daerah/slang.',
      status: 'Memenuhi kriteria pengujian',
      notes: 'Mencakup 3 tingkat kompleksitas dan 3 gaya bahasa (formal, informal, regional).',
      variant: 'success',
    },
    {
      factor: '3. Performa Model (Model Performance)',
      desc: 'Akurasi $\\ge 90\\%$ dan High-Priority Recall $\\ge 95\\%$ pada dataset evaluasi.',
      status: 'Memenuhi kriteria pengujian',
      notes: 'Akurasi 95.0% dan High-Priority Recall 100% pada dataset observasi uji.',
      variant: 'success',
    },
    {
      factor: '4. Generalisasi (Generalization)',
      desc: 'Performa konsisten di luar data training (zero-shot transferability ke faskes lain).',
      status: 'Memerlukan perbaikan',
      notes: 'Perlu pengujian multi-center pada minimal 3 rumah sakit daerah berbeda.',
      variant: 'warning',
    },
    {
      factor: '5. Robustness & Kalibrasi',
      desc: 'Ketahanan terhadap teks ambigu, typo, dan kalibrasi confidence score.',
      status: 'Memenuhi kriteria pengujian',
      notes: 'Mekanisme abstensi otomatis aktif jika confidence < 0.60 atau input out-of-distribution.',
      variant: 'success',
    },
    {
      factor: '6. Keadilan Subgrup (Fairness)',
      desc: 'Tidak ada disparitas performa signifikan antar kelompok gaya bahasa atau fasilitas.',
      status: 'Memenuhi kriteria pengujian',
      notes: 'Selisih performa bahasa formal (96.2%) vs bahasa daerah (88.9%) berada dalam ambang toleransi (<10%).',
      variant: 'success',
    },
    {
      factor: '7. Keterbukaan Penalaran (Explainability)',
      desc: 'Model memberikan justifikasi klinis/administratif yang dapat dipahami staf.',
      status: 'Memenuhi kriteria pengujian',
      notes: 'Nemotron 3.5 & Gemini menghasilkan field reasoning eksplisit dan rujukan SOP.',
      variant: 'success',
    },
    {
      factor: '8. Pengawasan Manusia (Human Oversight)',
      desc: 'Mekanisme Human-in-the-Loop wajib sebelum keputusan final dieksekusi.',
      status: 'Memenuhi kriteria pengujian',
      notes: 'Staf manusia memegang kontrol akhir; sistem mencatat setiap koreksi dalam audit log.',
      variant: 'success',
    },
    {
      factor: '9. Keamanan Sistem (Security)',
      desc: 'Perlindungan endpoint API, mitigasi prompt injection, dan enkripsi data.',
      status: 'Memenuhi kriteria pengujian',
      notes: 'API key tersimpan di server-side environment variables, skema divalidasi ketat oleh Zod.',
      variant: 'success',
    },
    {
      factor: '10. Privasi & UU PDP (Privacy)',
      desc: 'Kepatuhan terhadap UU No. 27/2022 tentang Pelindungan Data Pribadi pasien.',
      status: 'Memenuhi kriteria pengujian',
      notes: 'Penghapusan PII, de-identifikasi penuh, dan protokol persetujuan etik.',
      variant: 'success',
    },
    {
      factor: '11. Keandalan Operasional (Operational Reliability)',
      desc: 'Latensi respon < 10 detik, uptime serverless, dan penanganan kegagalan API.',
      status: 'Memerlukan perbaikan',
      notes: 'Fallback otomatis antar dual provider (NVIDIA vs Gemini) perlu stress-test beban tinggi.',
      variant: 'warning',
    },
    {
      factor: '12. Kesiapan Regulasi (Regulatory Readiness)',
      desc: 'Kesesuaian dengan perizinan sistem elektronik kesehatan Kemenkes/BSSN.',
      status: 'Memerlukan perbaikan',
      notes: 'Membutuhkan persetujuan komite etik rumah sakit dan pendaftaran PSE sebelum implementasi klinis.',
      variant: 'warning',
    },
  ]

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16 px-2 sm:px-4 py-2">
      {/* Title Hero */}
      <div className="pb-6 border-b border-[var(--color-hairline)] space-y-3">
        <div className="flex items-center gap-3">
          <Badge variant="default">Dasar Ilmiah & Protokol Tesis Magister</Badge>
          <Badge variant="purple">Kemenkes / KARS Standard</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--color-ink)] leading-tight font-sans">
          Tentang Riset: Efektivitas Pendampingan Large Language Model dalam Triase Keluhan Rumah Sakit
        </h1>
        <p className="text-sm text-[var(--color-slate)] leading-relaxed max-w-3xl">
          Dokumentasi komprehensif latar belakang, kerangka teori, kepatuhan regulasi Indonesia (UU PDP & Permenkes), dan evaluasi kesiapan implementasi klinis untuk sidang proposal dan tesis Magister Manajemen Rumah Sakit.
        </p>
      </div>

      {/* Section A: Research Identity */}
      <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-8 space-y-5">
        <div className="flex items-center gap-2.5 text-base font-semibold text-[var(--color-ink)]">
          <FileText size={18} className="text-[var(--color-electric-violet)]" />
          <span>Bagian A — Identitas Riset & Definisi Operasional Judul</span>
        </div>
        <div className="space-y-4 text-xs leading-relaxed text-[var(--color-slate)]">
          <p className="text-sm text-[var(--color-ink)] font-medium">
            Judul lengkap penelitian: <strong>&ldquo;Efektivitas Pendampingan Large Language Model dalam Klasifikasi dan Prioritisasi Keluhan Pasien terhadap Waktu Triase dan Ketepatan Penanganan Awal Keluhan di Rumah Sakit.&rdquo;</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[var(--color-linen)] rounded-[4px] border border-[var(--color-hairline)] space-y-1">
              <span className="font-semibold text-[var(--color-ink)] block">Efektivitas Pendampingan:</span>
              <p>Bukan otomasi penuh; mengukur dampak kolaborasi human–AI terhadap peningkatan efisiensi dan akurasi.</p>
            </div>
            <div className="p-4 bg-[var(--color-linen)] rounded-[4px] border border-[var(--color-hairline)] space-y-1">
              <span className="font-semibold text-[var(--color-ink)] block">Waktu Triase (Luaran Primer):</span>
              <p>Total durasi dari awal pembacaan narasi hingga penetapan keputusan final tersimpan dalam sistem.</p>
            </div>
            <div className="p-4 bg-[var(--color-linen)] rounded-[4px] border border-[var(--color-hairline)] space-y-1">
              <span className="font-semibold text-[var(--color-ink)] block">Ketepatan Penanganan Awal:</span>
              <p>Kesesuaian kategori keluhan dan unit tujuan terhadap Standar Emas (Gold Standard) yang disepakati ahli.</p>
            </div>
            <div className="p-4 bg-[var(--color-linen)] rounded-[4px] border border-[var(--color-hairline)] space-y-1">
              <span className="font-semibold text-[var(--color-ink)] block">Prioritisasi & Eskalasi:</span>
              <p>Ketepatan penentuan urgensi respon administratif serta kepekaan menangkap keluhan keselamatan pasien.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section B: Theoretical Framework */}
      <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-8 space-y-5">
        <div className="flex items-center gap-2.5 text-base font-semibold text-[var(--color-ink)]">
          <Layers size={18} className="text-[var(--color-electric-violet)]" />
          <span>Bagian B — Kerangka Teori: Donabedian, HCAT, dan Human-in-the-Loop</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-[var(--color-slate)]">
          <div className="p-5 bg-[var(--color-linen)] rounded-[4px] border border-[var(--color-hairline)] space-y-2">
            <span className="font-semibold text-[var(--color-ink)] block text-sm">
              Model Donabedian
            </span>
            <p className="leading-relaxed">
              <strong>Structure:</strong> SOP taksonomi rumah sakit, staf terlatih, infrastruktur LLM (NVIDIA/Gemini).<br />
              <strong>Process:</strong> Alur triase manual vs asistensi AI dengan verifikasi manusia.<br />
              <strong>Outcome:</strong> Efisiensi waktu, akurasi disposisi, dan beban kerja.
            </p>
          </div>
          <div className="p-5 bg-[var(--color-linen)] rounded-[4px] border border-[var(--color-hairline)] space-y-2">
            <span className="font-semibold text-[var(--color-ink)] block text-sm">
              Healthcare Complaints Tool (HCAT)
            </span>
            <p className="leading-relaxed">
              Mengadopsi prinsip HCAT untuk membedakan domain masalah: administratif/birokrasi, komunikasi interpersonal, mutu klinis, dan fasilitas fisik, disesuaikan dengan SOP lokal.
            </p>
          </div>
          <div className="p-5 bg-[var(--color-linen)] rounded-[4px] border border-[var(--color-hairline)] space-y-2">
            <span className="font-semibold text-[var(--color-ink)] block text-sm">
              Human-in-the-Loop (HITL)
            </span>
            <p className="leading-relaxed">
              AI bertindak murni sebagai <em>decision support</em>. Hak cipta keputusan dan tanggung jawab medikolegal tetap berada pada staf manusia, mencegah <em>automation bias</em>.
            </p>
          </div>
        </div>
      </div>

      {/* Section C: Indonesian Regulatory Compliance Matrix */}
      <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[var(--color-hairline)]">
          <div className="flex items-center gap-2.5">
            <Scale size={18} className="text-[var(--color-electric-violet)]" />
            <h2 className="text-base font-semibold text-[var(--color-ink)]">
              Bagian C — Matriks Kepatuhan Regulasi Indonesia (Indonesian Regulatory Compliance Matrix)
            </h2>
          </div>
          <Badge variant="success">Audit Sesuai UU PDP No. 27/2022</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--color-linen)] border-b border-[var(--color-hairline)] text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)]">
                <th className="p-4">Regulasi & Dasar Hukum</th>
                <th className="p-4">Pasal Relevan</th>
                <th className="p-4">Kewajiban Pokok</th>
                <th className="p-4">Bukti Implementasi Platform</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-hairline)] text-xs text-[var(--color-slate)]">
              {regulations.map((reg, idx) => (
                <tr key={idx} className="hover:bg-[var(--color-linen)] transition-colors">
                  <td className="p-4 font-semibold text-[var(--color-ink)] max-w-xs">{reg.law}</td>
                  <td className="p-4 font-mono text-[var(--color-steel)]">{reg.articles}</td>
                  <td className="p-4 leading-relaxed max-w-xs">{reg.obligation}</td>
                  <td className="p-4 leading-relaxed max-w-sm text-[var(--color-ink)]">{reg.implementation}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 size={13} />
                      <span>{reg.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section D: 12-Factor Implementation Readiness Framework */}
      <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[var(--color-hairline)]">
          <div className="flex items-center gap-2.5">
            <Building2 size={18} className="text-[var(--color-electric-violet)]" />
            <h2 className="text-base font-semibold text-[var(--color-ink)]">
              Bagian D — Kerangka Penilaian Kesiapan Implementasi RS (12-Factor Readiness Framework)
            </h2>
          </div>
          <Badge variant="warning">Kesiapan: Uji Validasi Klinis Lanjutan</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {readinessCriteria.map((c, i) => (
            <div
              key={i}
              className="p-5 rounded-[4px] bg-[var(--color-linen)] border border-[var(--color-hairline)] space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[var(--color-ink)]">{c.factor}</span>
                  <Badge variant={c.variant as any}>{c.status}</Badge>
                </div>
                <p className="text-[var(--color-slate)] leading-relaxed">{c.desc}</p>
              </div>
              <div className="pt-2 border-t border-[var(--color-hairline)] text-[11px] text-[var(--color-ink)] font-medium">
                <strong>Catatan Audit:</strong> {c.notes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section E: 18 FAQ Accordion */}
      <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-8 space-y-5">
        <div className="flex items-center gap-2 text-base font-semibold text-[var(--color-ink)] pb-2 border-b border-[var(--color-hairline)]">
          <HelpCircle size={18} className="text-[var(--color-electric-violet)]" />
          <span>Bagian E — Tanya Jawab Akademik & Pembelaan Desain Riset (18 FAQ)</span>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i
            return (
              <div
                key={i}
                className="rounded-[4px] border border-[var(--color-hairline)] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full p-4 text-left font-semibold text-xs text-[var(--color-ink)] flex items-center justify-between gap-3 hover:bg-[var(--color-linen)] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-1 text-xs text-[var(--color-slate)] leading-relaxed bg-[var(--color-linen)] border-t border-[var(--color-hairline)]">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
