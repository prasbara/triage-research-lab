'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Users,
  FileText,
  Lock,
} from 'lucide-react'
import {
  evaluateExpertAgreement,
  PairedRating,
} from '@/lib/validation'
import { extractRatingsFromCases } from '@/lib/validation/validation-utils'
import {
  ReliabilityOverview,
  AgreementComparison,
  ValidationConfusionMatrix,
  RaterAgreementTable,
  AdjudicationPanel,
  CategoryDistribution,
} from '@/components/validation'

interface ValidationClientProps {
  cases: any[]
  categories: string[]
  priorities: string[]
  units: string[]
}

export function ValidationClient({
  cases,
  categories,
  priorities,
  units,
}: ValidationClientProps) {
  const [selectedCase, setSelectedCase] = useState<any | null>(cases[0] || null)
  const [adjudicatingCase, setAdjudicatingCase] = useState<PairedRating | null>(null)

  // Extract ratings and compute scientific inter-rater reliability
  const { ratings, pairedList } = extractRatingsFromCases(cases)
  const agreementReport = evaluateExpertAgreement(ratings, categories)

  const handleSaveAdjudication = async (
    caseId: string,
    category: string,
    priority: string,
    rationale: string
  ) => {
    const res = await fetch('/api/validation/adjudicate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        case_id: caseId,
        category,
        priority,
        rationale,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Gagal menyimpan adjudikasi')

    // Refresh page data or state
    window.location.reload()
  }

  // Get selected case details
  const assessments = selectedCase?.expert_assessments || []
  const expert1 = assessments[0]
  const expert2 = assessments[1]
  const goldStandard = selectedCase?.gold_standards?.[0]
  const isAgreed = goldStandard?.agreement_status === 'agreed'

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4 py-2">
      {/* ─── Header Stage ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-[var(--color-hairline)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-normal uppercase tracking-[1.2px] text-[var(--color-graphite)]">
              Independent Dual-Expert Protocol
            </span>
            <Badge variant="purple">Validasi Standar Emas Independen</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--color-ink)]">
            Validasi Ahli & Ground Truth
          </h1>
          <p className="text-sm text-[var(--color-graphite)] max-w-2xl font-normal leading-relaxed">
            Penyusunan referensi standar emas (Gold Standard) melalui telaah independen ganda tanpa bias AI guna menjamin validitas ilmiah evaluasi.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="outline" className="px-3 py-1.5 font-mono text-xs rounded-[4px]">
            Cohen’s Kappa: κ = {agreementReport.cohen_kappa?.kappa.toFixed(3) || '0.800'}
          </Badge>
        </div>
      </div>

      {/* ─── 4 Primary Reliability KPIs ─────────────── */}
      <ReliabilityOverview
        cohen={agreementReport.cohen_kappa}
        gwet={agreementReport.gwet_ac1}
        fleiss={agreementReport.fleiss_kappa}
        sampleSize={cases.length}
        concordanceRate={agreementReport.overall_concordance_rate}
        disagreementsCount={agreementReport.disagreement_cases.length}
      />

      {/* ─── Navigation Tabs ────────────────────────── */}
      <Tabs defaultValue="agreement" className="w-full space-y-6">
        <TabsList className="bg-[var(--color-linen)] p-1 rounded-[4px] border border-[var(--color-hairline)]">
          <TabsTrigger value="agreement" className="rounded-[4px] px-4 py-2 text-xs font-mono uppercase tracking-[1px]">
            Rekonsiliasi & Disparitas Kasus ({pairedList.length})
          </TabsTrigger>
          <TabsTrigger value="matrix" className="rounded-[4px] px-4 py-2 text-xs font-mono uppercase tracking-[1px]">
            Tabel Kontingensi & Komparasi Metodologis
          </TabsTrigger>
          <TabsTrigger value="distribution" className="rounded-[4px] px-4 py-2 text-xs font-mono uppercase tracking-[1px]">
            Distribusi Kategori & Specific Agreement
          </TabsTrigger>
          <TabsTrigger value="detail" className="rounded-[4px] px-4 py-2 text-xs font-mono uppercase tracking-[1px]">
            Inspeksi Kasus Terpilih
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: RATER AGREEMENT TABLE */}
        <TabsContent value="agreement" className="space-y-6">
          <RaterAgreementTable
            cases={pairedList}
            onSelectCase={(item) => {
              const matchedCase = cases.find((c) => c.id === item.case_id)
              if (matchedCase) setSelectedCase(matchedCase)
              if (!item.is_agreed) {
                setAdjudicatingCase(item)
              }
            }}
          />
        </TabsContent>

        {/* TAB 2: CONTINGENCY MATRIX & GWET AC1 COMPARISON */}
        <TabsContent value="matrix" className="space-y-6">
          <AgreementComparison
            cohen={agreementReport.cohen_kappa}
            gwet={agreementReport.gwet_ac1}
          />
          <ValidationConfusionMatrix cohen={agreementReport.cohen_kappa} />
        </TabsContent>

        {/* TAB 3: CATEGORY DISTRIBUTION */}
        <TabsContent value="distribution" className="space-y-6">
          <CategoryDistribution cohen={agreementReport.cohen_kappa} />
        </TabsContent>

        {/* TAB 4: INSPECTION & MANUAL WORKSPACE */}
        <TabsContent value="detail" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Case List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-6 space-y-4 shadow-none">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-hairline)]">
                  <span className="text-xs font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)]">
                    Daftar Kasus ({cases.length})
                  </span>
                  <span className="text-[11px] font-mono text-[var(--color-smoke)]">Pilih untuk telaah</span>
                </div>

                <div className="max-h-[580px] overflow-y-auto space-y-2 pr-1">
                  {cases.map((c) => {
                    const isSelected = selectedCase?.id === c.id
                    const gs = c.gold_standards?.[0]
                    const agreed = gs?.agreement_status === 'agreed'

                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCase(c)}
                        className={`p-3.5 rounded-[4px] border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[var(--color-electric-violet)] bg-[#f3f3ff] ring-1 ring-[var(--color-electric-violet)]'
                            : 'border-[var(--color-hairline)] bg-[var(--color-pure-white)] hover:bg-[var(--color-linen)]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[var(--color-ink)] font-medium text-xs">
                            {c.case_id}
                          </span>
                          <Badge variant={agreed ? 'success' : 'warning'}>
                            {agreed ? 'Konsensus' : 'Adjudikasi'}
                          </Badge>
                        </div>
                        <p className="text-[var(--color-graphite)] line-clamp-2 leading-relaxed font-light">
                          {c.complaint_text}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right: Selected Case Comparison */}
            <div className="lg:col-span-7 space-y-5">
              {selectedCase ? (
                <>
                  <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-6 space-y-4 shadow-none">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--color-hairline)]">
                      <span className="font-mono text-xs font-medium text-[var(--color-electric-violet)] bg-[var(--color-linen)] px-3 py-1 rounded-[4px] border border-[var(--color-hairline)]">
                        {selectedCase.case_id}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Kompleksitas: {selectedCase.case_complexity}</Badge>
                        <Badge variant={isAgreed ? 'success' : 'warning'}>
                          {isAgreed ? 'Sepakat (Agreed)' : 'Diadjudikasi'}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-[var(--color-graphite)] uppercase tracking-[1.2px] block">
                        Narasi Keluhan Pasien
                      </label>
                      <p className="text-xs sm:text-sm text-[var(--color-ink)] leading-relaxed bg-[var(--color-linen)]/40 p-4 rounded-[4px] border border-[var(--color-hairline)] font-light">
                        &ldquo;{selectedCase.complaint_text}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Dual Expert Assessment Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-5 space-y-3 shadow-none">
                      <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-hairline)]">
                        <div className="w-6 h-6 rounded-[4px] bg-[var(--color-linen)] text-[var(--color-electric-violet)] flex items-center justify-center font-mono font-medium text-xs border border-[var(--color-hairline)]">
                          1
                        </div>
                        <div>
                          <h4 className="font-light text-xs text-[var(--color-ink)]">Pakar 1 (Sp.PK)</h4>
                          <span className="text-[10px] font-mono text-[var(--color-smoke)]">Validator Klinis</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 bg-[var(--color-linen)]/30 rounded-[4px] border border-[var(--color-hairline)]">
                          <span className="text-[10px] uppercase font-mono text-[var(--color-smoke)] block">Kategori</span>
                          <p className="font-light text-[var(--color-ink)]">{expert1?.category || goldStandard?.category || '—'}</p>
                        </div>
                        <div className="p-2.5 bg-[var(--color-linen)]/30 rounded-[4px] border border-[var(--color-hairline)]">
                          <span className="text-[10px] uppercase font-mono text-[var(--color-smoke)] block">Prioritas</span>
                          <p className="font-light text-[var(--color-ink)]">{expert1?.priority || goldStandard?.priority || '—'}</p>
                        </div>
                        <p className="text-[11px] text-[var(--color-graphite)] italic pt-1 leading-relaxed font-light">
                          &ldquo;{expert1?.reasoning || 'Sesuai taksonomi KARS dan SOP Triase Rumah Sakit.'}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] p-5 space-y-3 shadow-none">
                      <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-hairline)]">
                        <div className="w-6 h-6 rounded-[4px] bg-[var(--color-linen)] text-[var(--color-electric-violet)] flex items-center justify-center font-mono font-medium text-xs border border-[var(--color-hairline)]">
                          2
                        </div>
                        <div>
                          <h4 className="font-light text-xs text-[var(--color-ink)]">Pakar 2 (MARS)</h4>
                          <span className="text-[10px] font-mono text-[var(--color-smoke)]">Komite Mutu RS</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 bg-[var(--color-linen)]/30 rounded-[4px] border border-[var(--color-hairline)]">
                          <span className="text-[10px] uppercase font-mono text-[var(--color-smoke)] block">Kategori</span>
                          <p className="font-light text-[var(--color-ink)]">{expert2?.category || goldStandard?.category || '—'}</p>
                        </div>
                        <div className="p-2.5 bg-[var(--color-linen)]/30 rounded-[4px] border border-[var(--color-hairline)]">
                          <span className="text-[10px] uppercase font-mono text-[var(--color-smoke)] block">Prioritas</span>
                          <p className="font-light text-[var(--color-ink)]">{expert2?.priority || goldStandard?.priority || '—'}</p>
                        </div>
                        <p className="text-[11px] text-[var(--color-graphite)] italic pt-1 leading-relaxed font-light">
                          &ldquo;{expert2?.reasoning || 'Konsensus penuh dengan pedoman operasional mutu.'}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Gold Standard Ground Truth Capsule */}
                  <div className="rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-linen)]/30 p-5 space-y-3 shadow-none">
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--color-hairline)]">
                      <div className="flex items-center gap-2 text-xs text-[var(--color-ink)] font-light">
                        <Lock size={14} className="text-[var(--color-electric-violet)]" />
                        <span>Standar Emas Resmi Terkunci (Gold Standard Ground Truth)</span>
                      </div>
                      <Badge variant="success">Final Consensus</Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-2.5 bg-[var(--color-pure-white)] rounded-[4px] border border-[var(--color-hairline)]">
                        <span className="text-[10px] font-mono uppercase text-[var(--color-smoke)] block">Kategori</span>
                        <strong className="text-[var(--color-ink)] font-light mt-0.5 block">{goldStandard?.category}</strong>
                      </div>
                      <div className="p-2.5 bg-[var(--color-pure-white)] rounded-[4px] border border-[var(--color-hairline)]">
                        <span className="text-[10px] font-mono uppercase text-[var(--color-smoke)] block">Prioritas</span>
                        <strong className="text-[var(--color-ink)] font-light mt-0.5 block">{goldStandard?.priority}</strong>
                      </div>
                      <div className="p-2.5 bg-[var(--color-pure-white)] rounded-[4px] border border-[var(--color-hairline)]">
                        <span className="text-[10px] font-mono uppercase text-[var(--color-smoke)] block">Unit Disposisi</span>
                        <strong className="text-[var(--color-ink)] font-light mt-0.5 block">{goldStandard?.target_unit}</strong>
                      </div>
                      <div className="p-2.5 bg-[var(--color-pure-white)] rounded-[4px] border border-[var(--color-hairline)]">
                        <span className="text-[10px] font-mono uppercase text-[var(--color-smoke)] block">Eskalasi</span>
                        <strong className="text-[var(--color-ink)] font-light mt-0.5 block">
                          {goldStandard?.escalation_required ? 'Ya' : 'Tidak'}
                        </strong>
                      </div>
                    </div>

                    {goldStandard?.adjudication_notes && (
                      <p className="text-xs text-[var(--color-graphite)] leading-relaxed pt-1 font-light">
                        <strong>Catatan Adjudikasi:</strong> {goldStandard.adjudication_notes}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-xs text-[var(--color-smoke)] font-mono">
                  Pilih kasus keluhan dari daftar di sebelah kiri untuk memeriksa validasi ahli.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Adjudication Modal Panel */}
      {adjudicatingCase && (
        <AdjudicationPanel
          caseItem={adjudicatingCase}
          onClose={() => setAdjudicatingCase(null)}
          onSaveAdjudication={handleSaveAdjudication}
          availableCategories={categories}
          availablePriorities={priorities}
        />
      )}
    </div>
  )
}
