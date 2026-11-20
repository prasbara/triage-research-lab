import Link from 'next/link'
import {
  Clock,
  UserCheck,
  Cpu,
  BarChart2,
  ArrowRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--text-primary)] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0071e3] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              T
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[var(--text-primary)]">
                TRIAGE
              </span>
              <span className="text-xs text-[var(--text-muted)] ml-1 font-medium">
                Research Lab
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/about" className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Metodologi
            </Link>
            <Link href="/login">
              <Button size="sm" variant="secondary">
                Masuk
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">
                Buka Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6">
        <Badge variant="purple" className="px-3.5 py-1 text-xs">
          Thesis Research Platform • Hospital Quality Management
        </Badge>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.08] max-w-4xl mx-auto font-sans">
          TRIAGE Research Lab
        </h1>
        <p className="text-xl sm:text-2xl text-[var(--text-secondary)] font-normal max-w-3xl mx-auto leading-relaxed">
          Evaluating Human–AI Collaboration in Hospital Complaint Management.
        </p>
        <p className="text-sm text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed font-normal">
          Platform eksperimental untuk menguji secara ilmiah apakah pendampingan Large Language Model (NVIDIA NIM & Google Gemini) mempercepat waktu triase dan meningkatkan ketepatan penanganan awal keluhan pasien rumah sakit.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto px-7">
              <span>Buka Research Dashboard</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto px-7">
              <span>Jelajahi Metodologi & FAQ</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Thesis Title Banner */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-subtle)] text-center space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)] block">
            Judul Penelitian Tesis Magister
          </span>
          <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] leading-snug">
            “Efektivitas Pendampingan Large Language Model dalam Klasifikasi dan Prioritisasi Keluhan Pasien terhadap Waktu Triase dan Ketepatan Penanganan Awal Keluhan di Rumah Sakit.”
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Pendekatan kuasi-eksperimen kuantitatif dengan alokasi acak berimbang (Counterbalanced Design) & Standar Emas Independen.
          </p>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="py-12 bg-[var(--surface-secondary)] border-y border-[var(--border-subtle)] px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Pilar Arsitektur Eksperimen
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Dirancang dengan standar audit akademik ketat tanpa kompromi ilmiah
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-white border border-[var(--border-subtle)] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[var(--accent)] flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Manual vs LLM-Assisted Triage
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Pengukuran waktu beresolusi tinggi mulai saat narasi keluhan ditampilkan hingga keputusan final disimpan ke basis data.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[var(--border-subtle)] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck size={20} />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Human-in-the-Loop Verification
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                AI hanya memberikan rekomendasi. Tanggung jawab disposisi berada pada staf manusia, dengan pencatatan log revisi mendalam.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[var(--border-subtle)] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Cpu size={20} />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Dual AI: NVIDIA NIM & Gemini
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Integrasi real API NVIDIA Nemotron 3.5 Reasoning dan Google Gemini 2.5 dengan structured JSON schema output terverifikasi Zod.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[var(--border-subtle)] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <BarChart2 size={20} />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Evaluasi Statistik & Skrip R
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Metrik presisi, recall, F1, High-Priority Recall, Cohen's kappa, serta skrip Linear Mixed-Effects Model (LMM) yang sepenuhnya reproducible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] space-y-2">
        <p className="font-medium text-[var(--text-secondary)]">
          TRIAGE Research Lab — Human–AI Collaboration for Hospital Complaint Management Research
        </p>
        <p>
          Platform riset akademik Tesis Magister Manajemen Rumah Sakit. Bukan sistem rekam medis atau penanganan darurat klinis mandiri.
        </p>
      </footer>
    </div>
  )
}
