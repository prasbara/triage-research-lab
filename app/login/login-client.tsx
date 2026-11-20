'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, UserCheck, Stethoscope, AlertCircle, ArrowRight, Lock } from 'lucide-react'

export function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'
  const errorParam = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(
    errorParam === 'invalid_credentials'
      ? 'Email atau password salah. Silakan coba lagi.'
      : errorParam === 'missing_fields'
        ? 'Silakan isi email dan password.'
        : null
  )

  const quickAccounts = [
    {
      title: 'Peneliti Utama (Admin)',
      email: 'peneliti@triage.ac.id',
      password: 'Password123!',
      role: 'researcher',
      desc: 'Akses penuh seluruh dashboard, analitik, dan pengaturan',
      icon: ShieldCheck,
      badge: 'Admin',
    },
    {
      title: 'Pakar Adjudikator (Expert)',
      email: 'expert@triage.ac.id',
      password: 'Password123!',
      role: 'expert',
      desc: 'Validasi independen keluhan & pembentukan Gold Standard',
      icon: Stethoscope,
      badge: 'Pakar Klinis',
    },
    {
      title: 'Staf Penguji Triase (Participant)',
      email: 'staff@triage.ac.id',
      password: 'Password123!',
      role: 'participant',
      desc: 'Pengujian triase manual vs AI-assisted terandomisasi',
      icon: UserCheck,
      badge: 'Partisipan (P001)',
    },
  ]

  const handleFill = (accEmail: string, accPass: string) => {
    setEmail(accEmail)
    setPassword(accPass)
    setErrorMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch(`/api/auth/login?redirect=${encodeURIComponent(redirectPath)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal masuk. Periksa email dan password Anda.')
      }

      router.push(redirectPath)
      router.refresh()
    } catch (err: any) {
      setErrorMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-studio-mist)] flex flex-col justify-center items-center py-12 px-6">
      {/* Brand Logo & Header */}
      <div className="text-center mb-8 max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-pricing-blue)] text-white mx-auto mb-4 flex items-center justify-center font-bold text-xl shadow-xs">
          T
        </div>
        <p className="launch-label mb-1">Portal Eksperimen Riset</p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
          Masuk ke TRIAGE Lab
        </h1>
        <p className="text-xs text-[var(--color-slate)] mt-1.5 leading-relaxed">
          Gunakan akun penelitian terdaftar untuk mengakses ruang kerja triase dan instrumen eksperimen.
        </p>
      </div>

      {/* Main Login Card */}
      <Card className="max-w-md w-full p-8 border border-[var(--color-control-gray)] bg-[var(--color-gallery-white)] space-y-6">
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--color-ink)] block">
              Alamat Email Penelitian
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="peneliti@triage.ac.id"
              className="text-xs h-11 rounded-full px-4"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--color-ink)] block">
                Kata Sandi
              </label>
              <span className="text-[11px] text-[var(--color-steel)] font-mono">
                Default: Password123!
              </span>
            </div>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="text-xs h-11 rounded-full px-4"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full text-xs font-medium h-11 mt-2"
            loading={loading}
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </form>

        {/* 1-Click Fast Fill Accounts */}
        <div className="pt-5 border-t border-[var(--color-control-gray)] space-y-3">
          <span className="text-[11px] font-semibold text-[var(--color-slate)] uppercase tracking-[0.2px] block text-center">
            Akun Riset Tersedia (Klik untuk Mengisi Cepat):
          </span>

          <div className="space-y-2">
            {quickAccounts.map((acc) => {
              const Icon = acc.icon
              const isSelected = email === acc.email
              return (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleFill(acc.email, acc.password)}
                  className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 text-xs ${isSelected
                      ? 'border-[var(--color-pricing-blue)] bg-blue-50/30'
                      : 'border-[var(--color-control-gray)] bg-[var(--color-studio-mist)]/50 hover:bg-[var(--color-studio-mist)]'
                    }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-white border border-[var(--color-control-gray)] flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-[var(--color-ink)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-[var(--color-ink)] truncate flex items-center gap-1.5">
                        <span>{acc.title}</span>
                      </div>
                      <span className="text-[11px] text-[var(--color-slate)] font-mono block truncate">
                        {acc.email}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0 font-normal">
                    {acc.badge}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Back to Home Link */}
      <div className="mt-8 text-center text-xs">
        <Link
          href="/"
          className="text-[var(--color-slate)] hover:text-[var(--color-ink)] transition-colors"
        >
          ← Kembali ke Beranda TRIAGE Lab
        </Link>
      </div>
    </div>
  )
}
