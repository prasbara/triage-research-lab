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
      email: 'admin@triage.ac.id',
      password: 'Triage2025!',
      role: 'researcher',
      desc: 'Akses penuh seluruh dashboard, analitik, dan pengaturan',
      icon: ShieldCheck,
      badge: 'Admin',
    },
    {
      title: 'Pakar 1 (Medis & KARS)',
      email: 'expert@triage.ac.id',
      password: 'Triage2025!',
      role: 'expert',
      desc: 'Validasi independen keluhan & pembentukan Gold Standard',
      icon: Stethoscope,
      badge: 'Pakar 1',
    },
    {
      title: 'Pakar 2 (Mutu RS & MARS)',
      email: 'expert2@triage.ac.id',
      password: 'Triage2025!',
      role: 'expert',
      desc: 'Validasi independen kedua & sidang adjudikasi konsensus',
      icon: Stethoscope,
      badge: 'Pakar 2',
    },
    {
      title: 'Staf Penguji Triase (Participant)',
      email: 'participant@triage.ac.id',
      password: 'Triage2025!',
      role: 'participant',
      desc: 'Pengujian triase manual vs AI-assisted terandomisasi',
      icon: UserCheck,
      badge: 'Partisipan P001',
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
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-center items-center py-12 px-6">
      {/* Brand Header in Intercom Whisper-Weight */}
      <div className="text-center mb-8 max-w-sm">
        <div className="w-10 h-10 rounded-[4px] bg-[#000000] text-white mx-auto mb-4 flex items-center justify-center font-mono font-bold text-base shadow-none">
          T
        </div>
        <p className="font-mono text-xs uppercase tracking-[1.2px] text-[#585858] mb-1">Portal Eksperimen Riset</p>
        <h1 className="text-2xl font-light tracking-tight text-[#111111]">
          Masuk ke TRIAGE Lab
        </h1>
        <p className="text-xs text-[#585858] mt-1.5 leading-relaxed">
          Gunakan akun penelitian terdaftar untuk mengakses ruang kerja triase dan instrumen eksperimen.
        </p>
      </div>

      {/* Main Login Card in Intercom Warm Cream Editorial */}
      <Card className="max-w-md w-full p-8 border border-[#dedbd6] bg-[#ffffff] rounded-[4px] space-y-6">
        {errorMessage && (
          <div className="p-3.5 rounded-[4px] bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-[1.2px] text-[#585858] block">
              Alamat Email Penelitian
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="peneliti@triage.ac.id"
              className="text-xs h-10 rounded-[4px] px-3.5"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase tracking-[1.2px] text-[#585858] block">
                Kata Sandi
              </label>
              <span className="text-[10px] text-[#888888] font-mono">
                Default: Triage2025!
              </span>
            </div>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="text-xs h-10 rounded-[4px] px-3.5"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full text-xs font-normal h-10 mt-2 rounded-[4px]"
            loading={loading}
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight size={13} className="ml-1.5" />
          </Button>
        </form>

        {/* 1-Click Fast Fill Accounts */}
        <div className="pt-5 border-t border-[#dedbd6] space-y-3">
          <span className="text-[10px] font-mono text-[#585858] uppercase tracking-[1.2px] block text-center">
            Akun Riset Tersedia (Klik untuk Mengisi):
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
                  className={`w-full p-3 rounded-[4px] text-left border transition-colors flex items-center justify-between gap-3 text-xs ${
                    isSelected
                      ? 'border-[#000000] bg-[#f1eee9]'
                      : 'border-[#dedbd6] bg-[#faf9f6] hover:bg-[#f1eee9]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-[2px] bg-white border border-[#dedbd6] flex items-center justify-center shrink-0">
                      <Icon size={12} className="text-[#111111]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-normal text-[#111111] truncate flex items-center gap-1.5">
                        <span>{acc.title}</span>
                      </div>
                      <span className="text-[10px] text-[#585858] font-mono block truncate">
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
      <div className="mt-8 text-center text-xs font-mono uppercase tracking-[1.2px]">
        <Link
          href="/"
          className="text-[#585858] hover:text-[#111111] transition-colors"
        >
          ← Kembali ke Beranda TRIAGE Lab
        </Link>
      </div>
    </div>
  )
}
