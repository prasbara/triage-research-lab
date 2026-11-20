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
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-gallery-white)] text-[var(--color-ink)] font-sans antialiased">
      {/* ─── Global Store Navigation (44px tall, hairline edge) ─── */}
      <nav className="sticky top-0 z-50 bg-[var(--color-gallery-white)] border-b border-[var(--color-hairline-silver)]">
        <div className="max-w-6xl mx-auto px-6 h-[44px] flex items-center justify-between text-[12px] tracking-[-0.12px]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--color-ink)] text-[13px] tracking-tight">
              TRIAGE Research Lab
            </span>
            <span className="text-[var(--color-steel)] font-normal hidden sm:inline">
              / Hospital Quality Management
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[var(--color-ink)]">
            <Link href="/about" className="hover:opacity-75 transition-opacity text-[var(--color-ink)]">
              Metodologi Riset
            </Link>
            <Link href="/complaints" className="hover:opacity-75 transition-opacity text-[var(--color-ink)]">
              Korpus Keluhan
            </Link>
            <Link href="/analytics" className="hover:opacity-75 transition-opacity text-[var(--color-ink)]">
              Statistik LMM
            </Link>
            <Link href="/ai-lab" className="hover:opacity-75 transition-opacity text-[var(--color-ink)]">
              AI Laboratory
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <button className="h-7 px-3 rounded-full text-[12px] font-normal tracking-[-0.12px] border border-[var(--color-hairline-silver)] bg-transparent hover:bg-[var(--color-studio-mist)] text-[var(--color-ink)] transition-colors">
                Masuk Staf
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="h-7 px-3.5 rounded-full text-[12px] font-normal tracking-[-0.12px] bg-[var(--color-pricing-blue)] hover:bg-[#0077ed] text-white transition-colors">
                Buka Dashboard
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Launch Stage (Gallery White #ffffff) ─── */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">
        {/* Launch Status Label: bare #b64400 12px text, no pill background or border */}
        <p className="launch-label mb-3">
          Riset Tesis Magister Manajemen Rumah Sakit
        </p>

        {/* Product Kicker */}
        <p className="product-kicker text-[var(--color-ink)] mb-4">
          Human–AI Collaboration for Hospital Complaint Management
        </p>

        {/* Hero Display Headline: 80px/600, -1.2px tracking, 84px line height */}
        <h1 className="hero-display text-[var(--color-ink)] max-w-4xl mx-auto mb-6">
          TRIAGE Research Lab
        </h1>

        {/* Subtitle / Feature Copy */}
        <p className="body-editorial max-w-2xl mx-auto mb-8">
          Platform kuasi-eksperimen kuantitatif untuk mengevaluasi apakah pendampingan Large Language Model (NVIDIA NIM & Google Gemini) mempersingkat durasi triase administratif dan meningkatkan ketepatan penanganan awal keluhan pasien.
        </p>

        {/* Controls: Compact Pricing Blue pill + Outlined Explore pill */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button size="lg" variant="primary">
              <span>Buka Research Dashboard</span>
              <ArrowRight size={14} className="ml-1" />
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline">
              <span>Eksplorasi Metodologi & FAQ</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Official Research Title Capsule (Gallery White, 28px Radius, Hairline Edge) ─── */}
      <section className="max-w-4xl mx-auto px-6 mb-24">
        <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] p-8 text-center space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.228px] text-[var(--color-slate)] block">
            Judul Penelitian Tesis Magister
          </span>
          <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-ink)] leading-snug tracking-[-0.2px] max-w-3xl mx-auto">
            “Efektivitas Pendampingan Large Language Model dalam Klasifikasi dan Prioritisasi Keluhan Pasien terhadap Waktu Triase dan Ketepatan Penanganan Awal Keluhan di Rumah Sakit.”
          </h2>
          <p className="text-xs text-[var(--color-slate)] max-w-2xl mx-auto">
            Desain kuasi-eksperimen kuantitatif dengan alokasi acak berimbang (*Counterbalanced Latin Square Design*) & Standar Emas Adjudikasi Independen.
          </p>
        </div>
      </section>

      {/* ─── Highlights Stage (Studio Mist #f5f5f7 Full-Width Band, Section Gap 90px) ─── */}
      <section className="py-[90px] bg-[var(--color-studio-mist)] px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header with Section Link */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="launch-label mb-1">
                Pilar Arsitektur Eksperimen
              </p>
              <h2 className="feature-heading text-[var(--color-ink)]">
                Ketetapan Ilmiah Tanpa Kompromi.
              </h2>
            </div>
            <Link
              href="/about"
              className="text-sm font-medium text-[var(--color-apple-blue)] hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              <span>Pelajari metodologi dan protokol riset</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* 4 Feature Media Cards (28px radius, shadowless, white surface) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Waktu Triase */}
            <div className="rounded-[28px] bg-[var(--color-gallery-white)] border border-[var(--color-control-gray)] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-studio-mist)] text-[var(--color-ink)] flex items-center justify-center">
                  <Clock size={18} />
                </div>
                <h3 className="text-base font-semibold text-[var(--color-ink)] tracking-tight">
                  Pengukuran Waktu Presisi
                </h3>
                <p className="text-xs text-[var(--color-slate)] leading-relaxed">
                  Stopwatch audit presisi milidetik mencatat waktu sejak narasi keluhan dirender hingga konfirmasi final, menguji Hipotesis 1 secara empiris.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[var(--color-steel)] pt-3 border-t border-[var(--color-control-gray)]">
                Audit Sub-second Timer
              </span>
            </div>

            {/* Card 2: Human-in-the-Loop */}
            <div className="rounded-[28px] bg-[var(--color-gallery-white)] border border-[var(--color-control-gray)] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-studio-mist)] text-[var(--color-ink)] flex items-center justify-center">
                  <UserCheck size={18} />
                </div>
                <h3 className="text-base font-semibold text-[var(--color-ink)] tracking-tight">
                  Human-in-the-Loop Control
                </h3>
                <p className="text-xs text-[var(--color-slate)] leading-relaxed">
                  Staf manusia memegang otoritas penuh. Setiap deviasi atau modifikasi terhadap rekomendasi AI dicatat dalam log revisi wajib.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[var(--color-steel)] pt-3 border-t border-[var(--color-control-gray)]">
                Decision Revision Logging
              </span>
            </div>

            {/* Card 3: Dual AI */}
            <div className="rounded-[28px] bg-[var(--color-gallery-white)] border border-[var(--color-control-gray)] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-studio-mist)] text-[var(--color-ink)] flex items-center justify-center">
                  <Cpu size={18} />
                </div>
                <h3 className="text-base font-semibold text-[var(--color-ink)] tracking-tight">
                  Dual LLM Architecture
                </h3>
                <p className="text-xs text-[var(--color-slate)] leading-relaxed">
                  Integrasi NVIDIA Nemotron 3.5 Lightning (30B) dan Google Gemini 2.5 Flash dengan skema JSON terstruktur terverifikasi Zod.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[var(--color-steel)] pt-3 border-t border-[var(--color-control-gray)]">
                NVIDIA NIM & Gemini SDK
              </span>
            </div>

            {/* Card 4: Statistik & Skrip R */}
            <div className="rounded-[28px] bg-[var(--color-gallery-white)] border border-[var(--color-control-gray)] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-studio-mist)] text-[var(--color-ink)] flex items-center justify-center">
                  <BarChart2 size={18} />
                </div>
                <h3 className="text-base font-semibold text-[var(--color-ink)] tracking-tight">
                  Statistik & Skrip R Terverifikasi
                </h3>
                <p className="text-xs text-[var(--color-slate)] leading-relaxed">
                  Penyediaan skrip R Linear Mixed-Effects Model (LMM), NASA-TLX workload, dan ekspor dataset CSV/JSON yang sepenuhnya *reproducible*.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[var(--color-steel)] pt-3 border-t border-[var(--color-control-gray)]">
                LMM & GLMM Analysis Script
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Editorial Storytelling Chapter 1 (Gallery White, Section Gap 90px) ─── */}
      <section className="py-[90px] px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-5">
            <span className="launch-label">Patient Safety & Indikator Kritis</span>
            <h2 className="feature-heading text-[var(--color-ink)]">
              Nol Kompromi untuk Keluhan Kritis.
            </h2>
            <p className="body-editorial">
              Dalam tata kelola rumah sakit, kesalahan klasifikasi (*under-triage*) pada kasus gawat darurat (P1 Merah dan P2 Kuning) berisiko fatal bagi keselamatan klinis pasien maupun reputasi medikolegal rumah sakit.
            </p>
            <p className="text-sm text-[var(--color-slate)] leading-relaxed">
              Sistem mengevaluasi performa menggunakan metrik <strong>High-Priority Recall ($TP / (TP + FN)$)</strong> secara terpisah untuk menjamin kepastian deteksi keluhan kritis sebelum didisposisikan ke unit penanganan.
            </p>
            <div className="pt-2">
              <Link href="/analytics" className="text-sm font-medium text-[var(--color-apple-blue)] flex items-center gap-1">
                <span>Buka metrik matriks konfusi dan safety</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-studio-mist)] p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-hairline-silver)]">
              <span className="text-xs font-semibold text-[var(--color-ink)]">Indikator Keselamatan Klinis</span>
              <span className="text-xs font-mono text-[var(--color-launch-orange)] font-semibold">Priority P1 & P2</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[var(--color-gallery-white)] p-5 border border-[var(--color-control-gray)]">
                <span className="text-[11px] text-[var(--color-slate)] block mb-1">Target High-Priority Recall</span>
                <span className="text-2xl font-bold text-[var(--color-ink)]">≥ 95.0%</span>
                <span className="text-[10px] text-[var(--color-steel)] block mt-1">Standar Akreditasi KARS</span>
              </div>
              <div className="rounded-2xl bg-[var(--color-gallery-white)] p-5 border border-[var(--color-control-gray)]">
                <span className="text-[11px] text-[var(--color-slate)] block mb-1">Respons Maksimal P1</span>
                <span className="text-2xl font-bold text-[var(--color-pricing-blue)]">≤ 15 Menit</span>
                <span className="text-[10px] text-[var(--color-steel)] block mt-1">Eskalasi Medis Segera</span>
              </div>
            </div>
            <p className="text-[11px] text-[var(--color-slate)] italic">
              *Evaluasi diuji silang terhadap Gold Standard Adjudikasi yang ditentukan oleh dua pakar manajemen rumah sakit independen.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Editorial Storytelling Chapter 2 (Studio Mist #f5f5f7, Section Gap 90px) ─── */}
      <section className="py-[90px] bg-[var(--color-studio-mist)] px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] p-8 space-y-4 order-2 lg:order-1">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-control-gray)]">
              <span className="text-xs font-semibold text-[var(--color-ink)]">Matriks Latin Square Counterbalanced</span>
              <span className="text-xs font-mono text-[var(--color-steel)]">Mulberry32 PRNG</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[var(--color-studio-mist)] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[var(--color-ink)] block">Partisipan Genap (Kelompok A)</span>
                  <span className="text-[11px] text-[var(--color-slate)]">Sesi 1: Triase Manual → Sesi 2: Triase AI-Assisted</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-[var(--color-control-gray)]">
                  M → AI
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--color-studio-mist)] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[var(--color-ink)] block">Partisipan Ganjil (Kelompok B)</span>
                  <span className="text-[11px] text-[var(--color-slate)]">Sesi 1: Triase AI-Assisted → Sesi 2: Triase Manual</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-[var(--color-control-gray)]">
                  AI → M
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[var(--color-slate)] pt-2">
              Struktur ini menjamin eliminasi efek kelelahan (*fatigue bias*) dan efek pembelajaran (*carryover bias*).
            </p>
          </div>

          <div className="space-y-5 order-1 lg:order-2">
            <span className="launch-label">Rancangan Eksperimen Terkendali</span>
            <h2 className="feature-heading text-[var(--color-ink)]">
              Eliminasi Bias Urutan dan Kelelahan.
            </h2>
            <p className="body-editorial">
              Dalam pengujian kognitif staf rumah sakit, urutan pengerjaan tugas sangat memengaruhi kecepatan dan akurasi. Desain *Counterbalanced* menyilangkan alokasi secara acak deterministik.
            </p>
            <p className="text-sm text-[var(--color-slate)] leading-relaxed">
              Dengan PRNG Mulberry32 berbasis *seed* tersimpan di Supabase, setiap pembagian tugas dapat diulang dan diaudit secara independen oleh komite etik penelitian.
            </p>
            <div className="pt-2">
              <Link href="/experiments" className="text-sm font-medium text-[var(--color-apple-blue)] flex items-center gap-1">
                <span>Kelola sesi dan alokasi eksperimen</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Call to Action Stage (Gallery White, 90px Gap) ─── */}
      <section className="py-[90px] px-6 text-center max-w-4xl mx-auto space-y-6">
        <p className="launch-label">Siap Menjalankan Pengujian</p>
        <h2 className="feature-heading text-[var(--color-ink)]">
          Mulai Sesi Eksperimen Riset.
        </h2>
        <p className="body-editorial max-w-xl mx-auto">
          Masuk sebagai staf penguji, jalankan triase manual atau dengan pendampingan LLM, dan pantau pengumpulan data secara real-time.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button size="lg" variant="primary">
              <span>Buka Dashboard Riset</span>
              <ArrowRight size={14} className="ml-1" />
            </Button>
          </Link>
          <Link href="/triage/manual">
            <Button size="lg" variant="secondary">
              <span>Uji Triase Manual</span>
            </Button>
          </Link>
          <Link href="/triage/ai-assisted">
            <Button size="lg" variant="outline">
              <span>Uji Triase AI-Assisted</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Footer (Studio Mist #f5f5f7 Band) ─── */}
      <footer className="py-12 bg-[var(--color-studio-mist)] border-t border-[var(--color-hairline-silver)] px-6">
        <div className="max-w-6xl mx-auto space-y-4 text-xs text-[var(--color-slate)] leading-relaxed">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--color-control-gray)]">
            <span className="font-semibold text-[var(--color-ink)] text-sm">
              TRIAGE Research Lab
            </span>
            <div className="flex flex-wrap gap-6 text-[12px]">
              <Link href="/dashboard" className="text-[var(--color-slate)] hover:text-[var(--color-ink)]">Dashboard</Link>
              <Link href="/complaints" className="text-[var(--color-slate)] hover:text-[var(--color-ink)]">Dataset</Link>
              <Link href="/validation" className="text-[var(--color-slate)] hover:text-[var(--color-ink)]">Expert Validation</Link>
              <Link href="/analytics" className="text-[var(--color-slate)] hover:text-[var(--color-ink)]">Analytics</Link>
              <Link href="/reports" className="text-[var(--color-slate)] hover:text-[var(--color-ink)]">Reports</Link>
              <Link href="/about" className="text-[var(--color-slate)] hover:text-[var(--color-ink)]">About & FAQ</Link>
            </div>
          </div>
          <p>
            Platform riset akademik Tesis Magister Manajemen Rumah Sakit: <em>“Efektivitas Pendampingan Large Language Model dalam Klasifikasi dan Prioritisasi Keluhan Pasien terhadap Waktu Triase dan Ketepatan Penanganan Awal Keluhan di Rumah Sakit.”</em>
          </p>
          <p className="text-[11px] text-[var(--color-steel)]">
            Aplikasi ini dibangun untuk tujuan investigasi ilmiah eksperimental dan evaluasi Human–AI Collaboration. Bukan sistem rekam medis elektronik (EHR) atau instrumen diagnosis darurat medis mandiri.
          </p>
        </div>
      </footer>
    </div>
  )
}
