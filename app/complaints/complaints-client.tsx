'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
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
} from 'lucide-react'

interface ComplaintCase {
  id: string
  case_id: string
  complaint_text: string
  complaint_source_type: string
  source_type: string
  case_complexity: string
  validation_status: string
  sop_version_id?: string
  created_at: string
}

interface ComplaintsClientProps {
  initialCases: ComplaintCase[]
  totalCount?: number
  categories?: string[]
  priorities?: string[]
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
  const [selectedCase, setSelectedCase] = useState<ComplaintCase | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [importLoading, setImportLoading] = useState(false)

  // New Case form state
  const [newCase, setNewCase] = useState({
    case_id: '',
    complaint_text: '',
    complaint_source_type: 'written',
    case_complexity: 'moderate',
    source_type: 'synthetic',
    notes: '',
  })

  const handleSearch = async () => {
    setLoading(true)
    try {
      const url = new URL('/api/complaints', window.location.origin)
      if (search) url.searchParams.set('q', search)
      if (statusFilter) url.searchParams.set('status', statusFilter)
      if (complexityFilter) url.searchParams.set('complexity', complexityFilter)

      const res = await fetch(url.toString())
      const data = await res.json()
      if (res.ok) {
        setCases(data.data)
      }
    } finally {
      setLoading(false)
    }
  }

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
        handleSearch()
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
    const headers = ['case_id', 'complaint_text', 'complexity', 'source', 'status']
    const rows = cases.map((c) => [
      c.case_id,
      `"${c.complaint_text.replace(/"/g, '""')}"`,
      c.case_complexity,
      c.source_type,
      c.validation_status,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `complaint-dataset-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4 py-2">
      {/* ─── Header Stage ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-[var(--color-control-gray)]">
        <div className="space-y-1.5">
          <span className="launch-label text-[11px] font-semibold uppercase tracking-wider">
            Korpus Penelitian RS Terverifikasi
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
            Dataset Keluhan Pasien
          </h1>
          <p className="text-sm text-[var(--color-slate)] max-w-2xl">
            Manajemen korpus kasus keluhan rumah sakit terstandardisasi, ter-deidentifikasi, dan divalidasi pakar untuk eksperimen triase.
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

      {/* ─── Filter & Toolbar Card ───────────────────── */}
      <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
              Pencarian Narasi Keluhan
            </label>
            <Input
              placeholder="Ketik kata kunci (misal: farmasi, IGD, dokter, infus)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="h-10 rounded-xl text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
              Status Validasi
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl text-xs"
            >
              <option value="">Semua Status Validasi</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="validated">Validated</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-slate)] block">
              Tingkat Kompleksitas
            </label>
            <Select
              value={complexityFilter}
              onChange={(e) => setComplexityFilter(e.target.value)}
              className="h-10 rounded-xl text-xs"
            >
              <option value="">Semua Kompleksitas</option>
              <option value="simple">Simple (Sederhana)</option>
              <option value="moderate">Moderate (Sedang)</option>
              <option value="complex">Complex (Kompleks)</option>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-control-gray)]">
          <span className="text-xs text-[var(--color-slate)]">
            Menampilkan <strong className="font-semibold text-[var(--color-ink)]">{cases.length}</strong> kasus keluhan dalam korpus
          </span>
          <Button variant="secondary" size="sm" onClick={handleSearch} loading={loading} className="h-9 px-4 gap-2">
            <Filter size={13} />
            <span>Terapkan Filter</span>
          </Button>
        </div>
      </div>

      {/* ─── Table ────────────────────────────────────── */}
      <div className="rounded-[28px] border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[var(--color-studio-mist)] border-b border-[var(--color-control-gray)] text-[11px] uppercase tracking-wider text-[var(--color-slate)] font-semibold">
                <th className="px-6 py-4">Case ID</th>
                <th className="px-6 py-4">Teks Narasi Keluhan</th>
                <th className="px-6 py-4">Sumber</th>
                <th className="px-6 py-4">Kompleksitas</th>
                <th className="px-6 py-4">Status Validasi</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-control-gray)]">
              {cases.length > 0 ? (
                cases.map((c) => (
                  <tr key={c.id} className="hover:bg-[var(--color-studio-mist)] transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-[var(--color-ink)] whitespace-nowrap">
                      {c.case_id}
                    </td>
                    <td className="px-6 py-4 text-[var(--color-ink)] max-w-lg">
                      <p className="line-clamp-2 leading-relaxed">{c.complaint_text}</p>
                    </td>
                    <td className="px-6 py-4 capitalize whitespace-nowrap">
                      <span className="text-[var(--color-slate)]">
                        {c.source_type === 'synthetic' ? 'Sintetik' : 'De-identifikasi'}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          c.validation_status === 'validated'
                            ? 'success'
                            : c.validation_status === 'in_review'
                            ? 'default'
                            : 'muted'
                        }
                      >
                        {c.validation_status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCase(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--color-hairline-silver)] bg-white hover:bg-[var(--color-studio-mist)] text-[var(--color-ink)] transition-colors cursor-pointer"
                        title="Lihat Detail Kasus"
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

      {/* ─── Detail Modal ────────────────────────────── */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-xl w-full p-8 shadow-2xl border border-[var(--color-control-gray)] space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-control-gray)]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-slate)] block">
                  Detail Kasus Keluhan
                </span>
                <h3 className="text-xl font-semibold text-[var(--color-ink)] mt-0.5">
                  {selectedCase.case_id}
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
                  Narasi Keluhan Pasien
                </label>
                <p className="p-4 rounded-2xl bg-[var(--color-studio-mist)] text-[var(--color-ink)] leading-relaxed border border-[var(--color-control-gray)]">
                  {selectedCase.complaint_text}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-[var(--color-studio-mist)] border border-[var(--color-control-gray)] space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[var(--color-slate)]">
                    Tipe Sumber
                  </span>
                  <p className="font-semibold text-[var(--color-ink)] capitalize">
                    {selectedCase.complaint_source_type} ({selectedCase.source_type})
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--color-studio-mist)] border border-[var(--color-control-gray)] space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[var(--color-slate)]">
                    Kompleksitas
                  </span>
                  <p className="font-semibold text-[var(--color-ink)] capitalize">
                    {selectedCase.case_complexity}
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
