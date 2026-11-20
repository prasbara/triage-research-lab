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
  Activity,
  Zap,
  Scale,
  Microscope,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* ─── Top Notification Banner ─── */}
      <div className="bg-slate-900 text-slate-200 py-2.5 px-6 text-center text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold font-mono text-[10px] uppercase tracking-wider">
            Tesis MMRS
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300">
            Platform Kuasi-Eksperimen Human–AI Collaboration Manajemen Rumah Sakit
          </span>
          <Link
            href="/about"
            className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-0.5 ml-1 transition-colors"
          >
            <span>Protokol Riset</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* ─── Navigation Bar ─── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              T
            </div>
            <div className="leading-tight">
              <span className="text-sm font-bold tracking-tight text-slate-900 block">
                TRIAGE Research Lab
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                Hospital Quality Informatics
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600">
            <Link href="/about" className="hover:text-slate-900 transition-colors">
              Metodologi Riset
            </Link>
            <Link href="/complaints" className="hover:text-slate-900 transition-colors">
              Korpus Keluhan
            </Link>
            <Link href="/analytics" className="hover:text-slate-900 transition-colors">
              Model LMM & Statistik
            </Link>
            <Link href="/ai-lab" className="hover:text-slate-900 transition-colors">
              AI Laboratory
            </Link>
            <Link href="/reports" className="hover:text-slate-900 transition-colors">
              Laporan Riset
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="h-9 px-3.5 text-xs">
                Masuk Staf
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" size="sm" className="h-9 px-4 text-xs font-medium shadow-xs">
                Buka Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-20 pb-16 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-medium shadow-2xs">
            <Sparkles size={13} className="text-blue-600" />
            <span>Dual Provider LLM Testbed (NVIDIA Nemotron 3.5 & Google Gemini 2.5)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Eksperimen Triase Keluhan Berbasis Kecerdasan Buatan
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Membuktikan secara ilmiah efektivitas pendampingan Large Language Model dalam mempercepat durasi triase administratif rumah sakit sekaligus menjamin ketiadaan <em>under-triage</em> pada keluhan klinis gawat darurat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto h-11 px-6 gap-2 text-xs font-medium shadow-sm">
                <span>Buka Dashboard Riset</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
            <Link href="/triage/ai-assisted" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-11 px-5 text-xs font-medium shadow-2xs">
                <span>Simulasi Triase AI-Assisted</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* ─── 4 Empirical Research Key Metric Highlights ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Efisiensi Waktu (H1)
              </span>
              <Zap size={16} className="text-emerald-600" />
            </div>
            <div className="text-3xl font-bold font-mono text-emerald-600">
              -51.8%
            </div>
            <p className="text-xs text-slate-500">
              Manual 68.4s vs AI 32.9s (p &lt; 0.001)
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Safety Recall (H2)
              </span>
              <ShieldAlert size={16} className="text-blue-600" />
            </div>
            <div className="text-3xl font-bold font-mono text-slate-900">
              100.0%
            </div>
            <p className="text-xs text-slate-500">
              0 under-triage pada P1 & P2
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Beban Kognitif (H3)
              </span>
              <Activity size={16} className="text-indigo-600" />
            </div>
            <div className="text-3xl font-bold font-mono text-indigo-600">
              -37.2%
            </div>
            <p className="text-xs text-slate-500">
              Reduksi komposit NASA-TLX staf
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Reliabilitas Pakar
              </span>
              <Scale size={16} className="text-slate-700" />
            </div>
            <div className="text-3xl font-bold font-mono text-slate-900">
              κ = 0.80
            </div>
            <p className="text-xs text-slate-500">
              Cohen&apos;s Kappa Substantial Agreement
            </p>
          </div>
        </div>
      </section>

      {/* ─── Research Protocol & Title Banner ─── */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-xs font-mono">
              FORMAL RESEARCH PROTOCOL
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Magister Manajemen Rumah Sakit (MMRS)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            &ldquo;Efektivitas Pendampingan Large Language Model dalam Klasifikasi dan Prioritisasi Keluhan Pasien terhadap Waktu Triase dan Ketepatan Penanganan Awal Keluhan di Rumah Sakit.&rdquo;
          </h2>
          <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <span>Desain: <strong className="text-slate-800">Counterbalanced Latin Square (2x2)</strong></span>
            <span>Standar Emas: <strong className="text-slate-800">Adjudikasi 2 Pakar Independen (κ = 0.80)</strong></span>
            <span>Model Evaluasi: <strong className="text-slate-800">Linear Mixed-Effects Model (LMM)</strong></span>
          </div>
        </div>
      </section>

      {/* ─── 4 Pillars of Architecture ─── */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
              Arsitektur Sistem
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Pilar Eksperimental Terstandar
            </h2>
          </div>
          <Link
            href="/about"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
          >
            <span>Pelajari metodologi lengkap</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Pengukuran Waktu Presisi
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stopwatch audit presisi milidetik mencatat waktu sejak narasi keluhan dirender hingga verifikasi final untuk menguji H1 secara objektif.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck size={18} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Human-in-the-Loop Control
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Staf administrasi memegang kendali final. Setiap perubahan terhadap saran AI dicatat untuk mengukur <em>Automation Bias</em> dan <em>Algorithm Aversion</em>.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Cpu size={18} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Dual LLM Enterprise
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Integrasi NVIDIA Nemotron 3.5 Lightning (30B) dan Google Gemini 2.5 Flash dengan skema validasi Zod ketat tanpa halusinasi data.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <BarChart2 size={18} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Pemodelan LMM & R Script
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Skrip R terstandarisasi untuk eksekusi <code>lmer(log(time) ~ method)</code> dan uji non-inferioritas margin $\Delta = -5.0\%$.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Two-Column Clinical Safety & Counterbalance ─── */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Safety Box */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2">
              <Badge variant="danger">Keselamatan Pasien & KARS</Badge>
              <span className="text-xs font-mono text-slate-400">Permenkes 11/2017</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Pencegahan Under-Triage Kasus Gawat Darurat
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pada tata kelola rumah sakit, kegagalan mendeteksi keluhan kritis berisiko fatal bagi keselamatan pasien. Evaluasi keselamatan diukur khusus melalui metrik <strong>High-Priority Recall</strong> dengan target 100% deteksi pada keluhan Kritis (P1) dan Tinggi (P2).
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-semibold uppercase text-slate-500 block mb-1">Target Recall P1</span>
                <span className="text-xl font-bold text-slate-900">100.0%</span>
                <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Tercapai Aman</span>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-semibold uppercase text-slate-500 block mb-1">Respons Maksimal</span>
                <span className="text-xl font-bold text-blue-600">≤ 15 Menit</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">SOP Triase Klinis</span>
              </div>
            </div>
            <Link
              href="/analytics"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 pt-1"
            >
              <span>Lihat matriks konfusi dan uji non-inferioritas</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Latin Square Box */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2">
              <Badge variant="purple">Metodologi Latin Square</Badge>
              <span className="text-xs font-mono text-slate-400">Mulberry32 PRNG</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Eliminasi Bias Urutan dan Efek Kelelahan
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Desain eksperimen menyilangkan urutan pengerjaan secara berimbang (Kelompok A: Manual → AI, Kelompok B: AI → Manual) untuk memastikan efek penghematan waktu murni berasal dari kapabilitas LLM dan bukan karena efek adaptasi pengerjaan.
            </p>
            <div className="space-y-2 pt-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-800 font-sans font-medium">Kelompok Urutan A (N=10)</span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-blue-700 font-semibold text-[11px]">Manual → AI</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-800 font-sans font-medium">Kelompok Urutan B (N=10)</span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-blue-700 font-semibold text-[11px]">AI → Manual</span>
              </div>
            </div>
            <Link
              href="/experiments"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 pt-1"
            >
              <span>Kelola sesi dan alokasi partisipan</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Siap Memulai Eksperimen Riset?
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Akses modul pengujian triase terstandar, jalankan evaluasi komparasi dual provider, dan unduh paket data FAIR untuk replikasi tesis.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button size="lg" variant="primary" className="h-11 px-6 text-xs font-medium shadow-sm">
              <span>Buka Dashboard Riset</span>
              <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-11 px-6 text-xs font-medium shadow-2xs">
              <span>Masuk Sebagai Staf Penguji</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Clean Modern Footer ─── */}
      <footer className="py-12 bg-white border-t border-slate-200/80 px-6">
        <div className="max-w-6xl mx-auto space-y-6 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                T
              </div>
              <span className="font-semibold text-slate-900 text-sm">
                TRIAGE Research Lab
              </span>
            </div>
            <div className="flex flex-wrap gap-6 text-xs font-medium text-slate-600">
              <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
              <Link href="/complaints" className="hover:text-slate-900 transition-colors">Dataset Keluhan</Link>
              <Link href="/validation" className="hover:text-slate-900 transition-colors">Validasi Pakar</Link>
              <Link href="/analytics" className="hover:text-slate-900 transition-colors">Analitik LMM</Link>
              <Link href="/ai-lab" className="hover:text-slate-900 transition-colors">AI Lab</Link>
              <Link href="/reports" className="hover:text-slate-900 transition-colors">Laporan Riset</Link>
            </div>
          </div>
          <p className="leading-relaxed text-slate-500">
            Platform kuasi-eksperimen Tesis Magister Manajemen Rumah Sakit: <em>&ldquo;Efektivitas Pendampingan Large Language Model dalam Klasifikasi dan Prioritisasi Keluhan Pasien terhadap Waktu Triase dan Ketepatan Penanganan Awal Keluhan di Rumah Sakit.&rdquo;</em>
          </p>
          <p className="text-[11px] text-slate-400">
            © 2025 TRIAGE Research Team. Dibangun khusus untuk investigasi ilmiah dan evaluasi Human–AI Collaboration rumah sakit.
          </p>
        </div>
      </footer>
    </div>
  )
}
