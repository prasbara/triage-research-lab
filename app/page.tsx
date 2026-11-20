import Link from 'next/link'
import {
  Clock,
  UserCheck,
  Cpu,
  BarChart2,
  ArrowRight,
  ShieldAlert,
  Sliders,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#111111] font-sans antialiased">
      {/* ─── Top Announcement Bar (Linen #f1eee9, SaansMono Tracking) ─── */}
      <div className="bg-[#f1eee9] border-b border-[#dedbd6] py-2 px-6 text-center text-xs text-[#414141]">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-[#111111] font-semibold">
            Tesis MMRS 2025
          </span>
          <span className="text-[#888888]">·</span>
          <span>Platform Kuasi-Eksperimen Human–AI Collaboration Manajemen Rumah Sakit</span>
          <Link
            href="/about"
            className="text-[#0007cb] hover:underline font-medium inline-flex items-center gap-0.5 ml-1"
          >
            <span>Protokol Riset</span>
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* ─── Navigation Bar (Canvas Cream, Hairline Edge, 4px Radius) ─── */}
      <nav className="sticky top-0 z-50 bg-[#faf9f6]/95 backdrop-blur-sm border-b border-[#dedbd6]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-[4px] bg-[#000000] text-white flex items-center justify-center font-mono text-xs font-bold">
              T
            </div>
            <span className="font-mono text-xs font-semibold uppercase tracking-[1.2px] text-[#111111]">
              TRIAGE Research Lab
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[#414141]">
            <Link href="/about" className="hover:text-[#111111] transition-colors">
              Metodologi Riset
            </Link>
            <Link href="/complaints" className="hover:text-[#111111] transition-colors">
              Korpus Keluhan
            </Link>
            <Link href="/analytics" className="hover:text-[#111111] transition-colors">
              Model LMM & Statistik
            </Link>
            <Link href="/ai-lab" className="hover:text-[#111111] transition-colors">
              AI Laboratory
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="h-8 px-3.5 text-xs text-[#111111]">
                Masuk Staf
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" size="sm" className="h-8 px-4 text-xs font-normal">
                Buka Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section (Intercom Whisper-Weight at 80px) ─── */}
      <section className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: 80px Display Headline (Weight 300) */}
          <div className="lg:col-span-8 space-y-6">
            <p className="font-mono text-xs uppercase tracking-[1.2px] text-[#585858]">
              Hospital Quality Management · Empirical Study
            </p>
            <h1 className="hero-display text-[#111111]">
              TRIAGE Research Lab
            </h1>
            <p className="product-kicker text-[#414141] max-w-2xl">
              Evaluating Human–AI Collaboration in Hospital Administrative Complaint Triage.
            </p>
          </div>

          {/* Right Column: Editorial Subtext & CTA */}
          <div className="lg:col-span-4 space-y-6 pt-2">
            <p className="serrif-editorial text-sm leading-relaxed text-[#414141]">
              Platform kuasi-eksperimen kuantitatif untuk membuktikan secara ilmiah apakah pendampingan Large Language Model (NVIDIA Nemotron 3.5 & Google Gemini 2.5) memangkas waktu triase keluhan dan menjamin ketiadaan *under-triage* pada kasus gawat darurat.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="md" variant="primary" className="w-full sm:w-auto h-11 px-6 gap-2 text-xs">
                  <span>Buka Dashboard Riset</span>
                  <ArrowRight size={13} />
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button size="md" variant="outline" className="w-full sm:w-auto h-11 px-5 text-xs">
                  <span>Metodologi & Regulasi</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Official Research Title Block (Card White on Canvas Cream) ─── */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="rounded-[4px] border border-[#dedbd6] bg-[#ffffff] p-8 sm:p-12 space-y-4">
          <span className="font-mono text-xs uppercase tracking-[1.2px] text-[#585858] block">
            Judul Penelitian Tesis Magister
          </span>
          <h2 className="text-xl sm:text-2xl font-light text-[#111111] leading-relaxed tracking-tight max-w-4xl">
            &ldquo;Efektivitas Pendampingan Large Language Model dalam Klasifikasi dan Prioritisasi Keluhan Pasien terhadap Waktu Triase dan Ketepatan Penanganan Awal Keluhan di Rumah Sakit.&rdquo;
          </h2>
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#dedbd6] text-xs text-[#585858]">
            <span>Desain: <strong>Counterbalanced Latin Square (2x2)</strong></span>
            <span>Standar Emas: <strong>Adjudikasi 2 Pakar Independen (κ = 0.80)</strong></span>
            <span>Model Evaluasi: <strong>Linear Mixed-Effects Model (LMM)</strong></span>
          </div>
        </div>
      </section>

      {/* ─── 4 Experimental Architecture Pillars (Linen #f1eee9 Band) ─── */}
      <section className="py-20 bg-[#f1eee9] border-y border-[#dedbd6] px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-[1.2px] text-[#585858] block">
                Pilar Arsitektur Eksperimen
              </span>
              <h2 className="feature-heading text-[#111111]">
                Ketetapan Ilmiah Tanpa Kompromi.
              </h2>
            </div>
            <Link
              href="/about"
              className="text-xs font-mono tracking-[1.2px] uppercase text-[#0007cb] hover:underline flex items-center gap-1.5"
            >
              <span>Pelajari protokol riset</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="rounded-[4px] bg-[#ffffff] border border-[#dedbd6] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#f1eee9] text-[#111111] flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <h3 className="text-sm font-normal text-[#111111]">
                  Pengukuran Waktu Presisi
                </h3>
                <p className="text-xs text-[#585858] leading-relaxed">
                  Stopwatch audit presisi milidetik mencatat waktu sejak narasi keluhan dirender hingga konfirmasi final untuk menguji H1 secara empiris.
                </p>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-[#888888] pt-3 border-t border-[#dedbd6]">
                Sub-Second Timer
              </span>
            </div>

            {/* Card 2 */}
            <div className="rounded-[4px] bg-[#ffffff] border border-[#dedbd6] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#f1eee9] text-[#111111] flex items-center justify-center">
                  <UserCheck size={16} />
                </div>
                <h3 className="text-sm font-normal text-[#111111]">
                  Human-in-the-Loop Control
                </h3>
                <p className="text-xs text-[#585858] leading-relaxed">
                  Staf manusia memegang otoritas penuh. Setiap deviasi atau modifikasi terhadap rekomendasi AI dicatat dalam log revisi audit.
                </p>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-[#888888] pt-3 border-t border-[#dedbd6]">
                Revision Logging
              </span>
            </div>

            {/* Card 3 */}
            <div className="rounded-[4px] bg-[#ffffff] border border-[#dedbd6] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#f1eee9] text-[#0007cb] flex items-center justify-center">
                  <Cpu size={16} />
                </div>
                <h3 className="text-sm font-normal text-[#111111]">
                  Dual LLM Architecture
                </h3>
                <p className="text-xs text-[#585858] leading-relaxed">
                  Integrasi NVIDIA Nemotron 3.5 Lightning (30B) dan Google Gemini 2.5 Flash dengan skema output JSON terverifikasi Zod.
                </p>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-[#888888] pt-3 border-t border-[#dedbd6]">
                NVIDIA NIM & Gemini
              </span>
            </div>

            {/* Card 4 */}
            <div className="rounded-[4px] bg-[#ffffff] border border-[#dedbd6] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#f1eee9] text-[#111111] flex items-center justify-center">
                  <BarChart2 size={16} />
                </div>
                <h3 className="text-sm font-normal text-[#111111]">
                  Model LMM & Non-Inferioritas
                </h3>
                <p className="text-xs text-[#585858] leading-relaxed">
                  Skrip R terstandarisasi untuk pemodelan <code className="font-mono text-[11px]">lmer(log(time) ~ method)</code> dan uji non-inferioritas akurasi.
                </p>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[1.2px] text-[#888888] pt-3 border-t border-[#dedbd6]">
                LMM & R Script Pipeline
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Two-Column Editorial Spread (Patient Safety) ─── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-5">
            <span className="font-mono text-xs uppercase tracking-[1.2px] text-[#585858]">
              Patient Safety & Indikator Kritis
            </span>
            <h2 className="feature-heading text-[#111111]">
              Nol Kompromi untuk Keluhan Kritis.
            </h2>
            <p className="serrif-editorial text-sm leading-relaxed text-[#414141]">
              Dalam tata kelola rumah sakit, kesalahan klasifikasi (*under-triage*) pada kasus gawat darurat (P1 Merah dan P2 Kuning) berisiko fatal bagi keselamatan klinis pasien maupun reputasi medikolegal rumah sakit.
            </p>
            <p className="text-xs text-[#585858] leading-relaxed">
              Sistem mengevaluasi performa menggunakan metrik <strong>High-Priority Recall</strong> secara terpisah untuk menjamin kepastian deteksi keluhan kritis sebelum didisposisikan ke unit penanganan.
            </p>
            <div className="pt-2">
              <Link
                href="/analytics"
                className="text-xs font-mono uppercase tracking-[1.2px] text-[#0007cb] hover:underline flex items-center gap-1.5"
              >
                <span>Buka metrik matriks konfusi dan safety</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="rounded-[4px] border border-[#dedbd6] bg-[#f1eee9] p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#dedbd6]">
              <span className="font-mono text-xs uppercase tracking-[1.2px] text-[#111111] font-semibold">
                Indikator Keselamatan Klinis
              </span>
              <span className="font-mono text-xs text-[#0007cb] font-semibold">
                Priority P1 & P2
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[4px] bg-[#ffffff] p-5 border border-[#dedbd6]">
                <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-[#585858] block mb-1">
                  Target Safety Recall
                </span>
                <span className="text-2xl font-light text-[#111111]">≥ 95.0%</span>
                <span className="text-[10px] text-[#888888] block mt-1">Standar Akreditasi KARS</span>
              </div>
              <div className="rounded-[4px] bg-[#ffffff] p-5 border border-[#dedbd6]">
                <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-[#585858] block mb-1">
                  Respons Maksimal P1
                </span>
                <span className="text-2xl font-light text-[#0007cb]">≤ 15 Menit</span>
                <span className="text-[10px] text-[#888888] block mt-1">Eskalasi Medis Segera</span>
              </div>
            </div>
            <p className="text-[11px] text-[#585858] italic pt-1">
              *Evaluasi diuji silang terhadap Gold Standard Adjudikasi yang ditentukan oleh dua pakar manajemen rumah sakit independen.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Two-Column Editorial Spread (Counterbalanced Design) ─── */}
      <section className="py-24 bg-[#f1eee9] border-t border-[#dedbd6] px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="rounded-[4px] border border-[#dedbd6] bg-[#ffffff] p-8 space-y-4 order-2 lg:order-1">
            <div className="flex items-center justify-between pb-3 border-b border-[#dedbd6]">
              <span className="font-mono text-xs uppercase tracking-[1.2px] text-[#111111] font-semibold">
                Matriks Latin Square Counterbalanced
              </span>
              <span className="font-mono text-xs text-[#888888]">Mulberry32 PRNG</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-[4px] bg-[#f1eee9] border border-[#dedbd6] flex items-center justify-between">
                <div>
                  <span className="font-medium text-[#111111] block">Kelompok A (Partisipan Genap)</span>
                  <span className="text-[11px] text-[#585858]">Sesi 1: Triase Manual → Sesi 2: Triase AI-Assisted</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-[2px] bg-[#ffffff] border border-[#dedbd6]">
                  M → AI
                </span>
              </div>
              <div className="p-3.5 rounded-[4px] bg-[#f1eee9] border border-[#dedbd6] flex items-center justify-between">
                <div>
                  <span className="font-medium text-[#111111] block">Kelompok B (Partisipan Ganjil)</span>
                  <span className="text-[11px] text-[#585858]">Sesi 1: Triase AI-Assisted → Sesi 2: Triase Manual</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-[2px] bg-[#ffffff] border border-[#dedbd6]">
                  AI → M
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#585858] pt-2">
              Struktur ini menjamin eliminasi efek kelelahan (*fatigue bias*) dan efek pembelajaran (*carryover bias*).
            </p>
          </div>

          <div className="space-y-5 order-1 lg:order-2">
            <span className="font-mono text-xs uppercase tracking-[1.2px] text-[#585858]">
              Rancangan Eksperimen Terkendali
            </span>
            <h2 className="feature-heading text-[#111111]">
              Eliminasi Bias Urutan dan Kelelahan.
            </h2>
            <p className="serrif-editorial text-sm leading-relaxed text-[#414141]">
              Dalam pengujian kognitif staf rumah sakit, urutan pengerjaan tugas sangat memengaruhi kecepatan dan akurasi. Desain *Counterbalanced* menyilangkan alokasi secara acak deterministik.
            </p>
            <p className="text-xs text-[#585858] leading-relaxed">
              Dengan PRNG Mulberry32 berbasis *seed* tersimpan di Supabase, setiap pembagian tugas dapat diulang dan diaudit secara independen oleh komite etik penelitian.
            </p>
            <div className="pt-2">
              <Link
                href="/experiments"
                className="text-xs font-mono uppercase tracking-[1.2px] text-[#0007cb] hover:underline flex items-center gap-1.5"
              >
                <span>Kelola sesi dan alokasi eksperimen</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Stage (Canvas Cream, 64-96px gap) ─── */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto space-y-6">
        <span className="font-mono text-xs uppercase tracking-[1.2px] text-[#585858] block">
          Siap Menjalankan Pengujian
        </span>
        <h2 className="feature-heading text-[#111111]">
          Mulai Sesi Eksperimen Riset.
        </h2>
        <p className="text-sm text-[#585858] max-w-xl mx-auto leading-relaxed">
          Masuk sebagai staf penguji, jalankan triase manual atau dengan pendampingan LLM, dan pantau pengumpulan data secara real-time.
        </p>
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button size="lg" variant="primary" className="h-11 px-6 text-xs">
              <span>Buka Dashboard Riset</span>
              <ArrowRight size={13} className="ml-1" />
            </Button>
          </Link>
          <Link href="/triage/manual">
            <Button size="lg" variant="secondary" className="h-11 px-6 text-xs">
              <span>Uji Triase Manual</span>
            </Button>
          </Link>
          <Link href="/triage/ai-assisted">
            <Button size="lg" variant="outline" className="h-11 px-6 text-xs">
              <span>Uji Triase AI-Assisted</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Footer (Linen #f1eee9 Band) ─── */}
      <footer className="py-12 bg-[#f1eee9] border-t border-[#dedbd6] px-6">
        <div className="max-w-6xl mx-auto space-y-4 text-xs text-[#585858] leading-relaxed">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#dedbd6]">
            <span className="font-mono text-xs font-semibold uppercase tracking-[1.2px] text-[#111111]">
              TRIAGE Research Lab
            </span>
            <div className="flex flex-wrap gap-6 text-[11px] font-mono uppercase tracking-[1.2px]">
              <Link href="/dashboard" className="text-[#585858] hover:text-[#111111]">Dashboard</Link>
              <Link href="/complaints" className="text-[#585858] hover:text-[#111111]">Dataset</Link>
              <Link href="/validation" className="text-[#585858] hover:text-[#111111]">Expert Validation</Link>
              <Link href="/analytics" className="text-[#585858] hover:text-[#111111]">Analytics</Link>
              <Link href="/reports" className="text-[#585858] hover:text-[#111111]">Reports</Link>
              <Link href="/about" className="text-[#585858] hover:text-[#111111]">About & FAQ</Link>
            </div>
          </div>
          <p>
            Platform riset akademik Tesis Magister Manajemen Rumah Sakit: <em>&ldquo;Efektivitas Pendampingan Large Language Model dalam Klasifikasi dan Prioritisasi Keluhan Pasien terhadap Waktu Triase dan Ketepatan Penanganan Awal Keluhan di Rumah Sakit.&rdquo;</em>
          </p>
          <p className="text-[11px] text-[#888888]">
            Aplikasi ini dibangun untuk tujuan investigasi ilmiah eksperimental dan evaluasi Human–AI Collaboration. Bukan sistem rekam medis elektronik (EHR) atau instrumen diagnosis darurat medis mandiri.
          </p>
        </div>
      </footer>
    </div>
  )
}
