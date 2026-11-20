'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Settings,
  Cpu,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Database,
  Lock,
  Zap,
} from 'lucide-react'

interface SettingsClientProps {
  project: any
  categories: any[]
  priorities: any[]
  units: any[]
}

export function SettingsClient({
  project,
  categories,
  priorities,
  units,
}: SettingsClientProps) {
  // Test connection states
  const [nvidiaTesting, setNvidiaTesting] = useState(false)
  const [geminiTesting, setGeminiTesting] = useState(false)
  const [nvidiaHealth, setNvidiaHealth] = useState<any | null>(null)
  const [geminiHealth, setGeminiHealth] = useState<any | null>(null)

  const testNvidia = async () => {
    setNvidiaTesting(true)
    setNvidiaHealth(null)
    try {
      const res = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'nvidia' }),
      })
      const data = await res.json()
      setNvidiaHealth(data)
    } catch (err: any) {
      setNvidiaHealth({ status: 'error', error: err.message })
    } finally {
      setNvidiaTesting(false)
    }
  }

  const testGemini = async () => {
    setGeminiTesting(true)
    setGeminiHealth(null)
    try {
      const res = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'gemini' }),
      })
      const data = await res.json()
      setGeminiHealth(data)
    } catch (err: any) {
      setGeminiHealth({ status: 'error', error: err.message })
    } finally {
      setGeminiTesting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Pengaturan & Konfigurasi Riset
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Parameter sistem, konektivitas API LLM server-side, taksonomi SOP, dan tata kelola
          </p>
        </div>
        <Badge variant="outline">Serverless Vercel Ready</Badge>
      </div>

      <Tabs defaultValue="ai" className="w-full">
        <TabsList>
          <TabsTrigger value="ai">Koneksi & Provider AI</TabsTrigger>
          <TabsTrigger value="taxonomy">Taksonomi SOP Rumah Sakit</TabsTrigger>
          <TabsTrigger value="general">Informasi Riset & Institusi</TabsTrigger>
        </TabsList>

        {/* AI CONFIG TAB */}
        <TabsContent value="ai" className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* NVIDIA NIM */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[4px] bg-[var(--color-linen)] text-[var(--color-electric-violet)] flex items-center justify-center font-mono text-xs border border-[var(--color-hairline)]">
                    NV
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">NVIDIA NIM</h3>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Endpoint OpenAI-compatible server-side
                    </span>
                  </div>
                </div>
                <Badge variant="default">Integrated</Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[var(--text-muted)] block">Model Aktif:</span>
                  <span className="font-mono font-semibold text-[var(--text-primary)]">
                    nvidia/nemotron-3.5-lightning-30b-a3b
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block">Endpoint URL:</span>
                  <span className="font-mono text-[var(--text-secondary)]">
                    https://integrate.api.nvidia.com/v1
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block">Kunci Terdaftar:</span>
                  <span className="font-mono text-[var(--text-secondary)]">
                    nvapi-KDqfisJ... (Nemotron Parse), Rerank, & Protein
                  </span>
                </div>
              </div>

              {nvidiaHealth && (
                <div
                  className={`p-3 rounded-[4px] border text-xs ${
                    nvidiaHealth.status === 'ok'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {nvidiaHealth.status === 'ok' ? (
                      <>
                        <CheckCircle2 size={14} /> Terhubung ({nvidiaHealth.latency_ms}ms)
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} /> Error: {nvidiaHealth.error}
                      </>
                    )}
                  </div>
                </div>
              )}

              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={testNvidia}
                loading={nvidiaTesting}
              >
                <Zap size={14} />
                <span>Uji Koneksi NVIDIA NIM</span>
              </Button>
            </Card>

            {/* Google Gemini */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[4px] bg-[var(--color-linen)] text-[var(--color-electric-violet)] flex items-center justify-center font-mono text-xs border border-[var(--color-hairline)]">
                    GE
                  </div>
                  <div>
                    <h3 className="font-light text-sm text-[var(--color-ink)]">Google Gemini</h3>
                    <span className="text-[11px] font-mono text-[var(--color-graphite)]">
                      Official SDK @google/genai
                    </span>
                  </div>
                </div>
                <Badge variant="purple">Integrated</Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[var(--color-smoke)] block font-mono text-[10px] uppercase">Model Aktif:</span>
                  <span className="font-mono text-[var(--color-ink)]">
                    gemini-2.5-flash
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-smoke)] block font-mono text-[10px] uppercase">Dual Rotation Keys:</span>
                  <span className="font-mono text-[var(--color-graphite)]">
                    AQ.Ab8RN6Jz... (Primary) & AQ.Ab8RN6Ji... (Backup)
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-smoke)] block font-mono text-[10px] uppercase">Format Respon:</span>
                  <span className="font-mono text-[var(--color-graphite)]">
                    application/json (Native Structured Output)
                  </span>
                </div>
              </div>

              {geminiHealth && (
                <div
                  className={`p-3 rounded-[4px] border text-xs font-mono ${
                    geminiHealth.status === 'ok'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {geminiHealth.status === 'ok' ? (
                      <>
                        <CheckCircle2 size={14} /> Terhubung ({geminiHealth.latency_ms}ms)
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} /> Error: {geminiHealth.error}
                      </>
                    )}
                  </div>
                </div>
              )}

              <Button
                variant="secondary"
                size="sm"
                className="w-full rounded-[4px]"
                onClick={testGemini}
                loading={geminiTesting}
              >
                <Zap size={14} />
                <span>Uji Koneksi Google Gemini</span>
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* TAXONOMY TAB */}
        <TabsContent value="taxonomy" className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-5 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none">
              <h3 className="font-light text-sm text-[var(--color-ink)] mb-3">
                Kategori Keluhan ({categories.length})
              </h3>
              <ul className="space-y-2 text-xs">
                {categories.map((c) => (
                  <li key={c.id} className="p-2.5 bg-[var(--color-linen)]/40 border border-[var(--color-hairline)] rounded-[4px]">
                    <span className="font-light block text-[var(--color-ink)]">{c.name}</span>
                    <span className="text-[10px] text-[var(--color-smoke)] font-mono">{c.code}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none">
              <h3 className="font-light text-sm text-[var(--color-ink)] mb-3">
                Tingkat Prioritas ({priorities.length})
              </h3>
              <ul className="space-y-2 text-xs">
                {priorities.map((p) => (
                  <li key={p.id} className="p-2.5 bg-[var(--color-linen)]/40 border border-[var(--color-hairline)] rounded-[4px] flex items-center justify-between">
                    <div>
                      <span className="font-light block text-[var(--color-ink)]">{p.name}</span>
                      <span className="text-[10px] text-[var(--color-smoke)] font-mono">Level {p.level}</span>
                    </div>
                    {p.is_high_priority && <Badge variant="danger">High Risk</Badge>}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none">
              <h3 className="font-light text-sm text-[var(--color-ink)] mb-3">
                Unit Rumah Sakit ({units.length})
              </h3>
              <ul className="space-y-2 text-xs">
                {units.map((u) => (
                  <li key={u.id} className="p-2.5 bg-[var(--color-linen)]/40 border border-[var(--color-hairline)] rounded-[4px]">
                    <span className="font-light block text-[var(--color-ink)]">{u.name}</span>
                    <span className="text-[10px] text-[var(--color-smoke)] font-mono uppercase">{u.unit_type}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </TabsContent>

        {/* GENERAL TAB */}
        <TabsContent value="general" className="space-y-4">
          <Card className="p-6 space-y-4">
            <CardTitle>Identitas Penelitian Tesis Magister</CardTitle>
            <CardDescription>
              Metadata proyek riset Manajemen Rumah Sakit
            </CardDescription>

            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="font-semibold text-[var(--text-muted)] block uppercase">
                  Judul Riset Tesis:
                </span>
                <p className="mt-1 font-bold text-[var(--text-primary)] text-sm">
                  {project?.title_id || 'Efektivitas Pendampingan Large Language Model dalam Klasifikasi dan Prioritisasi Keluhan Pasien terhadap Waktu Triase dan Ketepatan Penanganan Awal Keluhan di Rumah Sakit.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="font-semibold text-[var(--text-muted)] block uppercase">
                    Kode Institusi / RS:
                  </span>
                  <span className="font-medium text-[var(--text-primary)]">{project?.hospital_identifier || 'RSUD-EXP-01'}</span>
                </div>
                <div>
                  <span className="font-semibold text-[var(--text-muted)] block uppercase">
                    Zona Waktu:
                  </span>
                  <span className="font-medium text-[var(--text-primary)]">{project?.timezone || 'Asia/Jakarta'}</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
