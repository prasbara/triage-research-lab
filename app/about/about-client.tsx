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

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Title Hero */}
      <div className="pb-6 border-b border-[var(--border-subtle)] space-y-3">
        <Badge variant="default">Dasar Ilmiah & Konsultasi Tesis Magister</Badge>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] leading-tight font-sans">
          Tentang Riset: Efektivitas Pendampingan Large Language Model dalam Triase Keluhan Rumah Sakit
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
          Dokumentasi komprehensif latar belakang, kesenjangan riset, kerangka teori, metodologi kuasi-eksperimen, dan justifikasi ilmiah untuk sidang proposal dan tesis Magister Manajemen Rumah Sakit.
        </p>
      </div>

      {/* Section A: Research Identity */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
          <FileText size={18} className="text-[var(--accent)]" />
          <span>Bagian A — Identitas Riset & Definisi Operasional Judul</span>
        </div>
        <div className="space-y-3 text-xs leading-relaxed text-[var(--text-secondary)]">
          <p>
            Judul lengkap penelitian: <strong>“Efektivitas Pendampingan Large Language Model dalam Klasifikasi dan Prioritisasi Keluhan Pasien terhadap Waktu Triase dan Ketepatan Penanganan Awal Keluhan di Rumah Sakit.”</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[var(--surface)] rounded-xl">
              <span className="font-bold text-[var(--text-primary)] block">Efektivitas Pendampingan:</span>
              <span>Bukan otomasi penuh; mengukur dampak kolaborasi human–AI terhadap peningkatan efisiensi dan akurasi.</span>
            </div>
            <div className="p-3 bg-[var(--surface)] rounded-xl">
              <span className="font-bold text-[var(--text-primary)] block">Waktu Triase (Luaran Primer):</span>
              <span>Total durasi dari awal pembacaan narasi hingga penetapan keputusan final tersimpan dalam sistem.</span>
            </div>
            <div className="p-3 bg-[var(--surface)] rounded-xl">
              <span className="font-bold text-[var(--text-primary)] block">Ketepatan Penanganan Awal:</span>
              <span>Kesesuaian kategori keluhan dan unit tujuan terhadap Standar Emas (Gold Standard) yang disepakati ahli.</span>
            </div>
            <div className="p-3 bg-[var(--surface)] rounded-xl">
              <span className="font-bold text-[var(--text-primary)] block">Prioritisasi & Eskalasi:</span>
              <span>Ketepatan penentuan urgensi respon administratif serta kepekaan menangkap keluhan keselamatan pasien.</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Section E: Theoretical Framework */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
          <Layers size={18} className="text-[var(--accent)]" />
          <span>Bagian B — Kerangka Teori: Donabedian, HCAT, dan Human-in-the-Loop</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[var(--text-secondary)]">
          <div className="p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] space-y-1.5">
            <span className="font-bold text-[var(--text-primary)] block text-sm">
              Model Donabedian
            </span>
            <p>
              <strong>Structure:</strong> SOP taksonomi rumah sakit, staf terlatih, infrastruktur LLM (NVIDIA/Gemini).<br />
              <strong>Process:</strong> Alur triase manual vs asistensi AI dengan verifikasi manusia.<br />
              <strong>Outcome:</strong> Efisiensi waktu, akurasi disposisi, dan beban kerja.
            </p>
          </div>
          <div className="p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] space-y-1.5">
            <span className="font-bold text-[var(--text-primary)] block text-sm">
              Healthcare Complaints Tool (HCAT)
            </span>
            <p>
              Mengadopsi prinsip HCAT untuk membedakan domain masalah: administratif/birokrasi, komunikasi interpersonal, mutu klinis, dan fasilitas fisik, disesuaikan dengan SOP lokal.
            </p>
          </div>
          <div className="p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] space-y-1.5">
            <span className="font-bold text-[var(--text-primary)] block text-sm">
              Human-in-the-Loop (HITL)
            </span>
            <p>
              AI bertindak murni sebagai <em>decision support</em>. Hak cipta keputusan dan tanggung jawab medikolegal tetap berada pada staf manusia, mencegah <em>automation bias</em>.
            </p>
          </div>
        </div>
      </Card>

      {/* Section G: Variables Matrix */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
          <Activity size={18} className="text-[var(--accent)]" />
          <span>Bagian C — Matriks Operasional Variabel Penelitian</span>
        </div>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--surface-secondary)] border-b border-[var(--border-subtle)] font-semibold text-[var(--text-primary)]">
                <th className="p-3">Jenis Variabel</th>
                <th className="p-3">Nama Variabel</th>
                <th className="p-3">Definisi & Pengukuran</th>
                <th className="p-3">Skala Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Independen</td>
                <td className="p-3">Metode Triase (Working Condition)</td>
                <td className="p-3">Kondisi A: Manual Mandiri vs Kondisi B: AI-Assisted</td>
                <td className="p-3">Nominal</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Dependen Primer</td>
                <td className="p-3">Waktu Triase (Triage Duration)</td>
                <td className="p-3">Durasi penyelesaian tugas dalam detik (dari tampil s/d submit)</td>
                <td className="p-3">Rasio (Detik)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Dependen Sekunder</td>
                <td className="p-3">Ketepatan Klasifikasi (Accuracy)</td>
                <td className="p-3">Kesesuaian kategori, prioritas, dan unit dengan Gold Standard</td>
                <td className="p-3">Nominal / Biner</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Dependen Sekunder</td>
                <td className="p-3">High-Priority Recall</td>
                <td className="p-3">Proporsi kasus berisiko tinggi yang berhasil tertangkap (TP / (TP+FN))</td>
                <td className="p-3">Rasio (0–1)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Dependen Sekunder</td>
                <td className="p-3">Beban Kerja Subjektif (NASA-TLX)</td>
                <td className="p-3">Skor gabungan beban mental, temporal, dan frustrasi petugas</td>
                <td className="p-3">Interval (0–100)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Kovariat / Kontrol</td>
                <td className="p-3">Kompleksitas Kasus & Panjang Teks</td>
                <td className="p-3">Simple / Moderate / Complex & Jumlah karakter teks</td>
                <td className="p-3">Ordinal / Rasio</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Section M: 18+ FAQ Accordion */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)] pb-2 border-b border-[var(--border-subtle)]">
          <HelpCircle size={18} className="text-[var(--accent)]" />
          <span>Bagian D — Tanya Jawab Akademik & Pembelaan Desain Riset (18 FAQ)</span>
        </div>
        <div className="space-y-2.5">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i
            return (
              <div
                key={i}
                className="rounded-2xl border border-[var(--border-subtle)] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full p-4 text-left font-semibold text-xs text-[var(--text-primary)] flex items-center justify-between gap-3 hover:bg-[var(--surface)] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-1 text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--surface-secondary)] border-t border-[var(--border-subtle)]">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
