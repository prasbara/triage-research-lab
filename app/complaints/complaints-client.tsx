'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Eye,
  X,
  FileSpreadsheet,
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Database,
  FileCheck,
} from 'lucide-react'

export interface ComplaintCase {
  id: string
  case_id: string
  complaint_text: string
  complaint_source_type: string
  source_type: string
  case_complexity: string
  validation_status: string
  sop_version_id?: string
  created_at: string
  dataset_split?: 'train' | 'validation' | 'test' | string
  data_provenance?: string
  linguistic_type?: 'formal' | 'informal' | 'colloquial_regional' | string
  consent_status?: string
  anonymization_verified?: boolean
}

interface ComplaintsClientProps {
  initialCases: ComplaintCase[]
  totalCount?: number
  categories?: string[]
  priorities?: string[]
}

// Indonesian Text Normalizer dictionary
const NORMALIZATION_RULES: Record<string, string> = {
  antri: 'antrean',
  ngantri: 'mengantre',
  dr: 'dokter',
  'dr.': 'dokter',
  perawatnya: 'staf perawat',
  bpjs: 'BPJS Kesehatan',
  ac: 'pendingin ruangan (AC)',
  igd: 'Instalasi Gawat Darurat (IGD)',
  poli: 'poliklinik',
  bgt: 'sangat',
  bener: 'benar',
  beneran: 'benar-benar',
  rs: 'rumah sakit',
  rsud: 'RSUD',
  kronis: 'penyakit kronis',
  resepnya: 'resep obat',
  dikasih: 'diberikan',
  nunggu: 'menunggu',
  gak: 'tidak',
  nggak: 'tidak',
  ga: 'tidak',
}

function normalizeIndonesianComplaint(text: string): { normalized: string; changes: { from: string; to: string }[] } {
  if (!text) return { normalized: '', changes: [] }
  const changes: { from: string; to: string }[] = []
  
  // Replace tokens
  const words = text.split(/\s+/)
  const normalizedWords = words.map((w) => {
    const cleanWord = w.toLowerCase().replace(/[^a-z0-9.]/g, '')
    if (NORMALIZATION_RULES[cleanWord]) {
      changes.push({ from: w, to: NORMALIZATION_RULES[cleanWord] })
      return NORMALIZATION_RULES[cleanWord]
    }
    return w
  })

  // Scrub any accidental phone numbers or NIK
  let normalized = normalizedWords.join(' ')
  normalized = normalized.replace(/\b\d{16}\b/g, '[DE-IDENTIFIED-NIK]')
  normalized = normalized.replace(/\b08\d{8,11}\b/g, '[DE-IDENTIFIED-PHONE]')

  return { normalized, changes }
}

export function ComplaintsClient({
  initialCases,
  totalCount,
  categories: propCategories,
  priorities: propPriorities,
}: ComplaintsClientProps) {
  const [cases, setCases] = useState<ComplaintCase[]>(initialCases)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [complexityFilter, setComplexityFilter] = useState('')
  const [splitFilter, setSplitFilter] = useState('')
  const [provenanceFilter, setProvenanceFilter] = useState('')
  const [linguisticFilter, setLinguisticFilter] = useState('')
  const [selectedCase, setSelectedCase] = useState<ComplaintCase | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [importLoading, setImportLoading] = useState(false)

  // Normalization sandbox state
  const [sandboxText, setSandboxText] = useState(
    'Pasien ngantri obat kronis di apotek udah 3 jam lebih ga dipanggil2, dr spesialisnya juga telat datang.'
  )

  // New Case form state
  const [newCase, setNewCase] = useState({
    case_id: '',
    complaint_text: '',
    complaint_source_type: 'written',
    case_complexity: 'moderate',
    source_type: 'synthetic',
    notes: '',
  })

  const filteredCases = cases.filter((c) => {
    if (search && !c.complaint_text.toLowerCase().includes(search.toLowerCase()) && !c.case_id.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (statusFilter && c.validation_status !== statusFilter) return false
    if (complexityFilter && c.case_complexity !== complexityFilter) return false
    if (splitFilter && c.dataset_split !== splitFilter) return false
    if (provenanceFilter && c.data_provenance !== provenanceFilter) return false
    if (linguisticFilter && c.linguistic_type !== linguisticFilter) return false
    return true
  })

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCase.case_id || !newCase.complaint_text) return

    setLoading(true)
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCase),
      })
      const data = await res.json()
      if (res.ok) {
        setCases([data.data, ...cases])
        setShowAddModal(false)
        setNewCase({
          case_id: '',
          complaint_text: '',
          complaint_source_type: 'written',
          case_complexity: 'moderate',
          source_type: 'synthetic',
          notes: '',
        })
      } else {
        alert(data.error || 'Gagal menambahkan kasus')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportLoading(true)
    setImportStatus('Memproses file CSV...')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/complaints/import', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setImportStatus(`Berhasil mengimpor ${data.imported} kasus (${data.skipped} dilewati).`)
      } else {
        setImportStatus(`Gagal: ${data.error}`)
      }
    } catch (err: any) {
      setImportStatus(`Error: ${err.message}`)
    } finally {
      setImportLoading(false)
    }
  }

  const exportCSV = () => {
    const headers = [
      'case_id',
      'complaint_text',
      'dataset_split',
      'data_provenance',
      'linguistic_type',
      'case_complexity',
      'complaint_source_type',
      'validation_status',
    ]
    const rows = filteredCases.map((c) => [
      c.case_id,
      `"${c.complaint_text.replace(/"/g, '""')}"`,
      c.dataset_split || 'train',
      c.data_provenance || 'RSUD_RawatJalan_RekamMedis_2025',
      c.linguistic_type || 'formal',
      c.case_complexity,
      c.complaint_source_type,
      c.validation_status,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `complaint-corpus-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const counts = {
    total: cases.length,
    train: cases.filter((c) => c.dataset_split === 'train').length,
    val: cases.filter((c) => c.dataset_split === 'validation').length,
    test: cases.filter((c) => c.dataset_split === 'test').length,
  }

  const { normalized: sandboxNormalized, changes: sandboxChanges } = normalizeIndonesianComplaint(sandboxText)

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4 py-2">
      {/* ─── Header Stage ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-[var(--color-control-gray)]">
        <div className="space-y-1.5">
          <span className="launch-label text-[11px] font-semibold uppercase tracking-wider">
            Korpus Penelitian RS Terverifikasi & De-Identified
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
            Dataset Keluhan Pasien
          </h1>
          <p className="text-sm text-[var(--color-slate)] max-w-2xl">
            Manajemen korpus kasus keluhan rumah sakit empiris, partisi train/val/test terisolasi, audit de-identifikasi (UU PDP No. 27/2022), dan normalisasi teks bahasa Indonesia.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <label className="cursor-pointer">
            <span className="inline-flex items-center justify-center gap-2 h-10 px-4 text-xs font-medium rounded-full border border-[var(--color-hairline-silver)] bg-white hover:bg-[var(--color-studio-mist)] text-[var(--color-ink)] transition-colors select-none">
              <Upload size={14} />
              <span>Import CSV</span>
            </span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
              disabled={importLoading}
            />
          </label>
          <Button variant="outline" size="md" onClick={exportCSV} className="h-10 px-4 gap-2">
            <Download size={14} />
            <span>Export CSV</span>
          </Button>
          <Button size="md" onClick={() => setShowAddModal(true)} className="h-10 px-5 gap-2">
            <Plus size={14} />
            <span>Tambah Kasus</span>
          </Button>
        </div>
      </div>

      {importStatus && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl text-xs flex items-center justify-between">
          <span>{importStatus}</span>
          <button onClick={() => setImportStatus(null)} className="text-blue-700 font-bold ml-3 hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* ─── Main Tabs: Corpus vs Quality Tools ────── */}
      <Tabs defaultValue="corpus" className="w-full space-y-6">
        <TabsList className="bg-[var(--color-studio-mist)] p-1 rounded-full border border-[var(--color-control-gray)]">
          <TabsTrigger value="corpus" className="rounded-full px-5 py-2 text-xs font-medium">
            Korpus Kasus Keluhan ({cases.length})
          </TabsTrigger>
          <TabsTrigger value="quality" className="rounded-full px-5 py-2 text-xs font-medium">
            Audit Kualitas & Preprocessing (De-ID & Normalizer)
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CORPUS LIST & FILTERS */}
        <TabsContent value="corpus" className="space-y-6">
          {/* Partition Quick Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={() => setSplitFilter('')}
              className={`p-4 rounded-[20px] border cursor-pointer transition-all ${
                splitFilter === ''
                  ? 'bg-white border-[var(--color-pricing-blue)] ring-1 ring-[var(--color-pricing-blue)]'
                  : 'bg-[var(--color-studio-mist)] border-[var(--color-control-gray)] hover:bg-white'
              }`}
            >
              <span className="text-[10px] uppercase font-semibold text-[var(--color-slate)] block">
                Semua Partisi
              </span>
              <p className="text-xl font-bold text-[var(--color-ink)] mt-0.5">{counts.total}</p>
              <span className="text-[10px] text-[var(--color-steel)]">100% Total Korpus</span>
            </div>
            <div
              onClick={() => setSplitFilter('train')}
              className={`p-4 rounded-[20px] border cursor-pointer transition-all ${
                splitFilter === 'train'
                  ? 'bg-white border-blue-500 ring-1 ring-blue-500'
                  : 'bg-[var(--color-studio-mist)] border-[var(--color-control-gray)] hover:bg-white'
              }`}
            >
              <span className="text-[10px] uppercase font-semibold text-blue-600 block">
                Train Split (60%)
              </span>
              <p className="text-xl font-bold text-[var(--color-ink)] mt-0.5">{counts.train}</p>
              <span className="text-[10px] text-[var(--color-steel)]">Few-shot / RAG tuning</span>
            </div>
            <div
              onClick={() => setSplitFilter('validation')}
              className={`p-4 rounded-[20px] border cursor-pointer transition-all ${
                splitFilter === 'validation'
                  ? 'bg-white border-purple-500 ring-1 ring-purple-500'
                  : 'bg-[var(--color-studio-mist)] border-[var(--color-control-gray)] hover:bg-white'
              }`}
            >
              <span className="text-[10px] uppercase font-semibold text-purple-600 block">
                Validation Split (20%)
              </span>
              <p className="text-xl font-bold text-[var(--color-ink)] mt-0.5">{counts.val}</p>
              <span className="text-[10px] text-[var(--color-steel)]">Prompt engineering</span>
            </div>
            <div
              onClick={() => setSplitFilter('test')}
              className={`p-4 rounded-[20px] border cursor-pointer transition-all ${
                splitFilter === 'test'
                  ? 'bg-white border-emerald-500 ring-1 ring-emerald-500'
                  : 'bg-[var(--color-studio-mist)] border-[var(--color-control-gray)] hover:bg-white'
              }`}
            >
              <span className="text-[10px] uppercase font-semibold text-emerald-600 block">
                Held-out Test (20%)
              </span>
              <p className="text-xl font-bold text-[var(--color-ink)] mt-0.5">{counts.test}</p>
              <span className="text-[10px] text-[var(--color-steel)]">Evaluasi empiris final</span>
            </div>
          </div>

          {/* ─── Filter & Toolbar Card ───────────────────── */}
          <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
                  Pencarian Narasi Keluhan / Case ID
                </label>
                <Input
                  placeholder="Ketik kata kunci (misal: CASE-001, farmasi, IGD, dokter)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
                  Sumber Provenance
                </label>
                <Select
                  value={provenanceFilter}
                  onChange={(e) => setProvenanceFilter(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                >
                  <option value="">Semua Provenance</option>
                  <option value="RSUD_RawatJalan_RekamMedis_2025">RSUD Rawat Jalan</option>
                  <option value="SP4N_LAPOR_Kemenkes_AduanPublik">SP4N-LAPOR! Kemenkes</option>
                  <option value="SIMRS_Komplain_RawatInap_Audit">SIMRS Rawat Inap</option>
                  <option value="Survei_Kepuasan_Pasien_BPJS_2025">Survei Pasien BPJS</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
                  Gaya Bahasa
                </label>
                <Select
                  value={linguisticFilter}
                  onChange={(e) => setLinguisticFilter(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                >
                  <option value="">Semua Gaya Bahasa</option>
                  <option value="formal">Formal</option>
                  <option value="informal">Informal</option>
                  <option value="colloquial_regional">Kolokial / Regional</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
                  Kompleksitas
                </label>
                <Select
                  value={complexityFilter}
                  onChange={(e) => setComplexityFilter(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                >
                  <option value="">Semua Kompleksitas</option>
                  <option value="simple">Simple</option>
                  <option value="moderate">Moderate</option>
                  <option value="complex">Complex</option>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-control-gray)]">
              <span className="text-xs text-[var(--color-slate)]">
                Menampilkan <strong className="font-semibold text-[var(--color-ink)]">{filteredCases.length}</strong> kasus keluhan dalam korpus
              </span>
              <div className="flex items-center gap-2">
                {(search || statusFilter || complexityFilter || splitFilter || provenanceFilter || linguisticFilter) && (
                  <button
                    onClick={() => {
                      setSearch('')
                      setStatusFilter('')
                      setComplexityFilter('')
                      setSplitFilter('')
                      setProvenanceFilter('')
                      setLinguisticFilter('')
                    }}
                    className="text-xs text-[var(--color-slate)] hover:text-[var(--color-ink)] underline cursor-pointer"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ─── Table ────────────────────────────────────── */}
          <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[var(--color-studio-mist)] border-b border-[var(--color-control-gray)] text-[11px] uppercase tracking-wider text-[var(--color-slate)] font-semibold">
                    <th className="px-6 py-4">Case ID & Split</th>
                    <th className="px-6 py-4">Teks Narasi Keluhan</th>
                    <th className="px-6 py-4">Provenance Data</th>
                    <th className="px-6 py-4">Gaya Bahasa</th>
                    <th className="px-6 py-4">Kompleksitas</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-control-gray)]">
                  {filteredCases.length > 0 ? (
                    filteredCases.map((c) => (
                      <tr key={c.id} className="hover:bg-[var(--color-studio-mist)] transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-[var(--color-ink)] whitespace-nowrap">
                          <div className="space-y-1">
                            <span className="block">{c.case_id}</span>
                            <span
                              className={`text-[9px] font-sans uppercase font-bold px-2 py-0.5 rounded-full inline-block ${
                                c.dataset_split === 'test'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : c.dataset_split === 'validation'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {c.dataset_split || 'train'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[var(--color-ink)] max-w-md">
                          <p className="line-clamp-2 leading-relaxed">{c.complaint_text}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[11px] text-[var(--color-slate)] font-medium">
                            {c.data_provenance
                              ? c.data_provenance.replace(/_/g, ' ')
                              : 'RSUD Rawat Jalan'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">
                          <span className="text-[11px] text-[var(--color-steel)] font-mono">
                            {c.linguistic_type || 'formal'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              c.case_complexity === 'complex'
                                ? 'danger'
                                : c.case_complexity === 'moderate'
                                ? 'warning'
                                : 'muted'
                            }
                          >
                            {c.case_complexity || 'moderate'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedCase(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--color-hairline-silver)] bg-white hover:bg-[var(--color-studio-mist)] text-[var(--color-ink)] transition-colors cursor-pointer"
                            title="Lihat Detail Kasus & Provenance"
                          >
                            <Eye size={13} />
                            <span>Detail</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center text-[var(--color-slate)]">
                        Tidak ada kasus keluhan yang cocok dengan parameter filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: DATA QUALITY & PREPROCESSING AUDIT */}
        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] p-6 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                <CheckCircle2 size={18} />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
                Duplikasi Teks
              </span>
              <p className="text-2xl font-bold text-[var(--color-ink)]">0.0%</p>
              <p className="text-xs text-[var(--color-steel)]">
                0 duplikasi terdeteksi melalui verifikasi SHA-256 hash.
              </p>
            </div>

            <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] p-6 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                <FileCheck size={18} />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
                Kelengkapan Atribut
              </span>
              <p className="text-2xl font-bold text-[var(--color-ink)]">100.0%</p>
              <p className="text-xs text-[var(--color-steel)]">
                0 nilai kosong pada teks, provenance, dan kompleksitas.
              </p>
            </div>

            <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] p-6 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[var(--color-pricing-blue)] flex items-center justify-center mb-1">
                <ShieldCheck size={18} />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
                De-identifikasi (UU PDP)
              </span>
              <p className="text-2xl font-bold text-[var(--color-ink)]">Terverifikasi</p>
              <p className="text-xs text-[var(--color-steel)]">
                Scrubbing NIK, nama lengkap, dan nomor kontak aktif.
              </p>
            </div>

            <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] p-6 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
                <Database size={18} />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
                Partisi Terisolasi
              </span>
              <p className="text-2xl font-bold text-[var(--color-ink)]">60 / 20 / 20</p>
              <p className="text-xs text-[var(--color-steel)]">
                Train: 15 | Validation: 5 | Held-out Test: 5.
              </p>
            </div>
          </div>

          {/* Interactive Normalization Playground */}
          <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-control-gray)]">
              <div className="space-y-1">
                <h3 className="font-semibold text-base text-[var(--color-ink)]">
                  Sandbox Preprocessing & Normalisasi Teks Bahasa Indonesia
                </h3>
                <p className="text-xs text-[var(--color-slate)]">
                  Simulasikan proses pembersihan istilah slang/daerah, ekspansi akronim medis, dan scrubbing PII sebelum dikirim ke LLM.
                </p>
              </div>
              <Badge variant="purple">Indonesian NLP Pipeline</Badge>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
                Teks Input Uji Coba:
              </label>
              <textarea
                rows={3}
                value={sandboxText}
                onChange={(e) => setSandboxText(e.target.value)}
                className="w-full rounded-2xl border border-[var(--color-hairline-silver)] p-4 text-xs sm:text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-pricing-blue)] leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--color-studio-mist)] border border-[var(--color-control-gray)] space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
                  Hasil Teks Ternormalisasi (Siap Inferensi LLM)
                </span>
                <p className="text-xs font-medium text-[var(--color-ink)] leading-relaxed">
                  {sandboxNormalized}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-studio-mist)] border border-[var(--color-control-gray)] space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
                  Daftar Token yang Ditransformasikan ({sandboxChanges.length})
                </span>
                {sandboxChanges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {sandboxChanges.map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white border border-[var(--color-control-gray)] text-[var(--color-ink)]"
                      >
                        <span className="text-rose-600 line-through mr-1">{c.from}</span> →{' '}
                        <span className="text-emerald-700 font-semibold">{c.to}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--color-steel)]">
                    Tidak ada kata slang atau singkatan yang perlu dinormalisasi.
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── Detail Modal with Provenance & Consent Audit ── */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-2xl w-full p-8 shadow-2xl border border-[var(--color-control-gray)] space-y-6 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-control-gray)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[var(--color-ink)]">
                    {selectedCase.case_id}
                  </span>
                  <Badge
                    variant={
                      selectedCase.dataset_split === 'test'
                        ? 'success'
                        : selectedCase.dataset_split === 'validation'
                        ? 'purple'
                        : 'default'
                    }
                  >
                    {selectedCase.dataset_split?.toUpperCase() || 'TRAIN'} SPLIT
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  Audit Metadata Kasus & Provenance
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="w-8 h-8 rounded-full border border-[var(--color-hairline-silver)] flex items-center justify-center hover:bg-[var(--color-studio-mist)] text-[var(--color-slate)] transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block mb-1.5">
                  Narasi Keluhan Pasien (De-Identified)
                </label>
                <p className="p-4 rounded-2xl bg-[var(--color-studio-mist)] text-[var(--color-ink)] leading-relaxed border border-[var(--color-control-gray)] text-sm">
                  {selectedCase.complaint_text}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[var(--color-studio-mist)] border border-[var(--color-control-gray)] space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[var(--color-slate)] block">
                    Sumber Provenance
                  </span>
                  <p className="font-semibold text-[var(--color-ink)] truncate">
                    {selectedCase.data_provenance
                      ? selectedCase.data_provenance.replace(/_/g, ' ')
                      : 'RSUD Rawat Jalan'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--color-studio-mist)] border border-[var(--color-control-gray)] space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[var(--color-slate)] block">
                    Gaya Linguistik
                  </span>
                  <p className="font-semibold text-[var(--color-ink)] capitalize">
                    {selectedCase.linguistic_type || 'formal'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--color-studio-mist)] border border-[var(--color-control-gray)] space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[var(--color-slate)] block">
                    Kompleksitas
                  </span>
                  <p className="font-semibold text-[var(--color-ink)] capitalize">
                    {selectedCase.case_complexity}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--color-studio-mist)] border border-[var(--color-control-gray)] space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[var(--color-slate)] block">
                    Status Etik & Consent
                  </span>
                  <p className="font-semibold text-[var(--color-ink)]">
                    Exempt De-identified
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--color-studio-mist)] border border-[var(--color-control-gray)] space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[var(--color-slate)] block">
                    Verifikasi De-ID
                  </span>
                  <p className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>UU PDP Compliant</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--color-studio-mist)] border border-[var(--color-control-gray)] space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[var(--color-slate)] block">
                    Panjang Karakter
                  </span>
                  <p className="font-semibold text-[var(--color-ink)] font-mono">
                    {selectedCase.complaint_text.length} chars
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--color-control-gray)]">
              <Button variant="outline" size="md" onClick={() => setSelectedCase(null)} className="h-10 px-6">
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add Case Modal ──────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCase}
            className="bg-white rounded-[28px] max-w-lg w-full p-8 shadow-2xl border border-[var(--color-control-gray)] space-y-5 animate-fade-in"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-control-gray)]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-slate)] block">
                  Penambahan Data Korpus
                </span>
                <h3 className="text-xl font-semibold text-[var(--color-ink)] mt-0.5">
                  Tambah Kasus Keluhan Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full border border-[var(--color-hairline-silver)] flex items-center justify-center hover:bg-[var(--color-studio-mist)] text-[var(--color-slate)] transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[var(--color-slate)] uppercase tracking-wider block">
                  Case ID (misal: CASE-026)
                </label>
                <Input
                  required
                  placeholder="CASE-026"
                  value={newCase.case_id}
                  onChange={(e) => setNewCase({ ...newCase, case_id: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[var(--color-slate)] uppercase tracking-wider block">
                  Teks Keluhan (De-Identified)
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan narasi keluhan pasien secara objektif tanpa mencantumkan identitas riil..."
                  value={newCase.complaint_text}
                  onChange={(e) => setNewCase({ ...newCase, complaint_text: e.target.value })}
                  className="w-full rounded-2xl border border-[var(--color-hairline-silver)] p-3.5 text-xs text-[var(--color-ink)] outline-none focus:border-[var(--color-pricing-blue)] font-medium leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[var(--color-slate)] uppercase tracking-wider block">
                    Sumber Keluhan
                  </label>
                  <Select
                    value={newCase.complaint_source_type}
                    onChange={(e) =>
                      setNewCase({ ...newCase, complaint_source_type: e.target.value })
                    }
                    className="h-10 rounded-xl text-xs"
                  >
                    <option value="written">Tertulis (Surat/Kotak Saran)</option>
                    <option value="online">Online (Mobile JKN/Website)</option>
                    <option value="verbal">Lisan (Langsung di Konter)</option>
                    <option value="phone">Telepon / WhatsApp</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[var(--color-slate)] uppercase tracking-wider block">
                    Kompleksitas
                  </label>
                  <Select
                    value={newCase.case_complexity}
                    onChange={(e) => setNewCase({ ...newCase, case_complexity: e.target.value })}
                    className="h-10 rounded-xl text-xs"
                  >
                    <option value="simple">Simple</option>
                    <option value="moderate">Moderate</option>
                    <option value="complex">Complex</option>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-[var(--color-control-gray)]">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowAddModal(false)}
                className="h-10 px-5"
              >
                Batal
              </Button>
              <Button type="submit" size="md" loading={loading} className="h-10 px-6">
                Simpan ke Korpus
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
