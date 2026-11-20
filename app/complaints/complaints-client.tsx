'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  FileText,
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { formatDate, truncateText } from '@/lib/utils'

interface ComplaintsClientProps {
  initialCases: any[]
  totalCount: number
  categories: string[]
  priorities: string[]
}

export function ComplaintsClient({
  initialCases,
  totalCount,
  categories,
  priorities,
}: ComplaintsClientProps) {
  const [cases, setCases] = useState(initialCases)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [complexityFilter, setComplexityFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedCase, setSelectedCase] = useState<any | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCase, setNewCase] = useState({
    case_id: '',
    complaint_text: '',
    complaint_source_type: 'written',
    case_complexity: 'moderate',
    source_type: 'synthetic',
    notes: '',
  })
  const [importLoading, setImportLoading] = useState(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)

  const handleSearch = async () => {
    setLoading(true)
    try {
      const url = new URL('/api/complaints', window.location.origin)
      if (search) url.searchParams.set('search', search)
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Dataset Keluhan Pasien
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Manajemen korpus kasus keluhan rumah sakit terverifikasi dan de-identifikasi
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <label className="cursor-pointer">
            <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-full border border-[var(--border)] bg-white text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors shadow-sm">
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
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download size={14} />
            <span>Export CSV</span>
          </Button>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} />
            <span>Tambah Kasus</span>
          </Button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs flex items-center justify-between">
          <span>{importStatus}</span>
          <button onClick={() => setImportStatus(null)} className="text-blue-600 font-bold ml-2">
            ×
          </button>
        </div>
      )}

      {/* Toolbar / Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2">
            <Input
              placeholder="Cari kata kunci keluhan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Semua Status Validasi</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="validated">Validated</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
          <div>
            <Select value={complexityFilter} onChange={(e) => setComplexityFilter(e.target.value)}>
              <option value="">Semua Kompleksitas</option>
              <option value="simple">Simple</option>
              <option value="moderate">Moderate</option>
              <option value="complex">Complex</option>
            </Select>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button variant="secondary" size="sm" onClick={handleSearch} loading={loading}>
            <Filter size={13} />
            <span>Terapkan Filter</span>
          </Button>
        </div>
      </Card>

      {/* Table */}
      <div className="bg-white rounded-[20px] border border-[var(--border-subtle)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[var(--surface-secondary)] border-b border-[var(--border-subtle)] text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                <th className="px-5 py-3.5">Case ID</th>
                <th className="px-5 py-3.5">Teks Keluhan</th>
                <th className="px-5 py-3.5">Sumber</th>
                <th className="px-5 py-3.5">Kompleksitas</th>
                <th className="px-5 py-3.5">Status Validasi</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {cases.length > 0 ? (
                cases.map((c) => (
                  <tr key={c.id} className="hover:bg-[var(--surface)] transition-colors">
                    <td className="px-5 py-3.5 font-mono font-semibold text-[var(--text-primary)]">
                      {c.case_id}
                    </td>
                    <td className="px-5 py-3.5 text-[var(--text-secondary)] max-w-md">
                      <p className="line-clamp-2 leading-relaxed">{c.complaint_text}</p>
                    </td>
                    <td className="px-5 py-3.5 capitalize">
                      <span className="text-[var(--text-muted)]">
                        {c.source_type === 'synthetic' ? 'Sintetik' : 'De-identifikasi'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
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
                    <td className="px-5 py-3.5">
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
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedCase(c)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-[var(--text-secondary)] transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[var(--text-muted)]">
                    Tidak ada kasus keluhan yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  Detail Kasus Keluhan
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  {selectedCase.case_id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Teks Keluhan
                </label>
                <p className="mt-1 p-3 bg-[var(--surface)] rounded-xl text-[var(--text-primary)] leading-relaxed">
                  {selectedCase.complaint_text}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-[var(--text-muted)]">Kompleksitas:</span>
                  <p className="font-semibold capitalize">{selectedCase.case_complexity}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)]">Status Validasi:</span>
                  <p className="font-semibold capitalize">{selectedCase.validation_status}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)]">Tipe Sumber:</span>
                  <p className="font-semibold capitalize">{selectedCase.source_type}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)]">Panjang Karakter:</span>
                  <p className="font-semibold">{selectedCase.complaint_text.length} chars</p>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedCase(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCase}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[var(--border-subtle)] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Tambah Kasus Keluhan Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <Input
                label="Case ID"
                placeholder="misal: CASE-006"
                value={newCase.case_id}
                onChange={(e) => setNewCase({ ...newCase, case_id: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Teks Keluhan
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-blue-100"
                  placeholder="Masukkan narasi keluhan pasien administratif..."
                  value={newCase.complaint_text}
                  onChange={(e) => setNewCase({ ...newCase, complaint_text: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Kompleksitas"
                  value={newCase.case_complexity}
                  onChange={(e) => setNewCase({ ...newCase, case_complexity: e.target.value })}
                >
                  <option value="simple">Simple</option>
                  <option value="moderate">Moderate</option>
                  <option value="complex">Complex</option>
                </Select>
                <Select
                  label="Sumber Kasus"
                  value={newCase.source_type}
                  onChange={(e) => setNewCase({ ...newCase, source_type: e.target.value })}
                >
                  <option value="synthetic">Sintetik (Terstandar)</option>
                  <option value="real_deidentified">De-identified Nyata</option>
                </Select>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowAddModal(false)}
              >
                Batal
              </Button>
              <Button type="submit" size="sm" loading={loading}>
                Simpan Kasus
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
