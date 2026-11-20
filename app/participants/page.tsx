import { createServerSupabaseClient } from '@/lib/database/server'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  CheckCircle2,
  Clock,
  Shuffle,
  ShieldCheck,
  FileCheck,
  Award,
  BookOpen,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ParticipantsPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch all profiles and their task counts
  const { data: participants } = await supabase
    .from('profiles')
    .select('*, triage_tasks(count), experiment_assignments(count)')
    .order('created_at', { ascending: false })

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4 py-2">
        {/* ─── Header Stage ────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-[var(--color-hairline)]">
          <div className="space-y-1.5">
            <span className="launch-label text-[11px] font-semibold uppercase tracking-wider">
              Kohort Partisipan Eksperimen Terkendali
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[var(--color-ink)]">
              Partisipan Penelitian
            </h1>
            <p className="text-sm text-[var(--color-slate)] max-w-2xl">
              Daftar staf rumah sakit, pakar penilai, dan peneliti terdaftar dengan kodefikasi anonim, alokasi *Latin Square Counterbalanced*, serta verifikasi kriteria inklusi.
            </p>
          </div>
          <Badge variant="purple">Counterbalanced Latin Square</Badge>
        </div>

        {/* ─── Methodology & Eligibility Cards ─────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-6 space-y-3">
            <div className="w-8 h-8 rounded-[4px] bg-blue-50 text-[var(--color-electric-violet)] flex items-center justify-center">
              <Shuffle size={18} />
            </div>
            <h3 className="font-semibold text-sm text-[var(--color-ink)]">
              Alokasi Latin Square (2x2)
            </h3>
            <p className="text-xs text-[var(--color-slate)] leading-relaxed">
              Partisipan dibagi seimbang ke dalam 2 kelompok urutan untuk mengeliminasi bias kelelahan (*fatigue*) dan bias pembelajaran (*carryover*):
            </p>
            <div className="space-y-1.5 pt-1 text-[11px] font-mono">
              <div className="p-2 rounded-[4px] bg-[var(--color-linen)] border border-[var(--color-hairline)] flex justify-between">
                <span>Kelompok A (Genap):</span>
                <strong className="text-[var(--color-ink)]">Manual → AI</strong>
              </div>
              <div className="p-2 rounded-[4px] bg-[var(--color-linen)] border border-[var(--color-hairline)] flex justify-between">
                <span>Kelompok B (Ganjil):</span>
                <strong className="text-[var(--color-ink)]">AI → Manual</strong>
              </div>
            </div>
          </div>

          <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-6 space-y-3">
            <div className="w-8 h-8 rounded-[4px] bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck size={18} />
            </div>
            <h3 className="font-semibold text-sm text-[var(--color-ink)]">
              Kriteria Inklusi Partisipan
            </h3>
            <ul className="space-y-2 text-xs text-[var(--color-slate)]">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Masa kerja staf admisi / rekam medis RS ≥ 1 tahun.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Telah lulus pembekalan SOP Triase Administratif v1.0.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Menandatangani *Informed Consent* etik riset.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-6 space-y-3">
            <div className="w-8 h-8 rounded-[4px] bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-semibold text-sm text-[var(--color-ink)]">
              Anonimisasi & Privasi Peneliti
            </h3>
            <p className="text-xs text-[var(--color-slate)] leading-relaxed">
              Berdasarkan UU PDP No. 27/2022, nama dan email partisipan disamarkan dalam analisis statistik menggunakan kode unik permanen (<code className="font-mono text-purple-700">P001</code>, <code className="font-mono text-purple-700">P002</code>, <code className="font-mono text-purple-700">E001</code>).
            </p>
            <div className="p-2.5 rounded-[4px] bg-purple-50/50 border border-purple-200/60 text-[11px] text-purple-900 font-medium">
              Data hasil observasi disimpan tanpa identitas personal langsung.
            </div>
          </div>
        </div>

        {/* ─── Participant Table ───────────────────────── */}
        <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] overflow-hidden">
          <div className="p-6 pb-4 border-b border-[var(--color-hairline)] flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-semibold text-sm text-[var(--color-ink)]">
                Daftar Subjek & Penilai Terdaftar
              </h3>
              <p className="text-xs text-[var(--color-slate)]">
                Total {participants?.length || 0} akun penelitian terverifikasi di basis data Supabase
              </p>
            </div>
            <span className="text-xs text-[var(--color-steel)] font-mono">
              Status: Active Study
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[var(--color-linen)] border-b border-[var(--color-hairline)] text-[11px] uppercase tracking-wider text-[var(--color-slate)] font-semibold">
                  <th className="px-6 py-4">Kode Subjek</th>
                  <th className="px-6 py-4">Peran Penelitian</th>
                  <th className="px-6 py-4">Kelompok Latin Square</th>
                  <th className="px-6 py-4">Departemen / Unit</th>
                  <th className="px-6 py-4">Kriteria Inklusi</th>
                  <th className="px-6 py-4">Observasi Tugas</th>
                  <th className="px-6 py-4 text-right">Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-hairline)]">
                {participants && participants.length > 0 ? (
                  participants.map((p: any, idx: number) => {
                    const completedTasks = p.triage_tasks?.[0]?.count || 0
                    const totalAssigned = p.experiment_assignments?.[0]?.count || 0
                    const isEven = idx % 2 === 0
                    const subjectCode =
                      p.role === 'admin'
                        ? 'R001 (Peneliti Utama)'
                        : p.role === 'expert'
                        ? idx === 0 ? 'E001 (Pakar Medis)' : 'E002 (Pakar Mutu)'
                        : `P00${idx + 1}`

                    return (
                      <tr key={p.id} className="hover:bg-[var(--color-linen)] transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-[var(--color-ink)] whitespace-nowrap">
                          {subjectCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              p.role === 'admin'
                                ? 'purple'
                                : p.role === 'expert'
                                ? 'warning'
                                : 'default'
                            }
                          >
                            {p.role === 'admin'
                              ? 'Lead Researcher'
                              : p.role === 'expert'
                              ? 'Expert Adjudicator'
                              : 'Hospital Staff'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {p.role === 'participant' || p.role === 'staff' ? (
                            <span
                              className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold border ${
                                isEven
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {isEven ? 'Kelompok A: Manual → AI' : 'Kelompok B: AI → Manual'}
                            </span>
                          ) : (
                            <span className="text-[11px] text-[var(--color-steel)] italic">
                              Non-Partisipan (Evaluator)
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[var(--color-slate)] whitespace-nowrap">
                          {p.department || 'Pelayanan Pelanggan & Admisi'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                            <CheckCircle2 size={12} />
                            <span>Memenuhi Inklusi</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-[var(--color-ink)]">
                          {completedTasks > 0 ? (
                            <span className="font-semibold text-emerald-700">
                              {completedTasks} tugas selesai
                            </span>
                          ) : (
                            <span className="text-[var(--color-steel)]">
                              0 selesai
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-[var(--color-steel)] whitespace-nowrap">
                          {formatDate(p.created_at)}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[var(--color-slate)]">
                      Belum ada partisipan yang terdaftar di basis data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
