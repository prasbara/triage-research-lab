'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadCloud, CheckCircle2, AlertCircle, X } from 'lucide-react'

interface ComplaintImportDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ComplaintImportDialog({ isOpen, onClose, onSuccess }: ComplaintImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successCount, setSuccessCount] = useState<number | null>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/complaints/import', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal mengimpor file')

      setSuccessCount(data.imported_count || data.count || 0)
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 space-y-4 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <X size={18} />
        </button>

        <div>
          <h3 className="font-bold text-base text-[var(--text-primary)]">
            Impor Dataset Keluhan (CSV / JSON)
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Unggah berkas keluhan riil atau sintetis teranotasi untuk korpus eksperimen
          </p>
        </div>

        <div className="border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--accent)] rounded-2xl p-6 text-center space-y-2 transition-colors cursor-pointer relative">
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <UploadCloud size={32} className="mx-auto text-[var(--accent)]" />
          <div className="text-xs font-semibold text-[var(--text-primary)]">
            {file ? file.name : 'Pilih berkas CSV atau JSON'}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Kolom: complaint_text, date_received, channel, patient_type
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {successCount !== null && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 size={14} />
            <span>Berhasil mengimpor {successCount} kasus keluhan!</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={uploading}>
            Batal
          </Button>
          <Button
            size="sm"
            onClick={handleUpload}
            loading={uploading}
            disabled={!file || uploading}
          >
            Mulai Impor
          </Button>
        </div>
      </Card>
    </div>
  )
}
