'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ShieldCheck,
  UserCheck,
  Stethoscope,
  AlertCircle,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

export function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'
  const errorParam = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState(
    errorParam === 'invalid_credentials'
      ? 'Email atau kata sandi tidak sesuai. Silakan periksa kembali.'
      : errorParam === 'missing_fields'
        ? 'Silakan isi email dan kata sandi.'
        : null
  )

  const quickAccounts = [
    {
      title: 'Peneliti Utama (Admin)',
      email: 'admin@triage.ac.id',
      password: 'Triage2025!',
      role: 'researcher',
      desc: 'Akses penuh seluruh dashboard analitik, inferensi ganda, & ekspor data',
      icon: ShieldCheck,
      badge: 'Admin',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      activeColor: 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-100',
    },
    {
      title: 'Pakar 1 (Medis & KARS)',
      email: 'expert@triage.ac.id',
      password: 'Triage2025!',
      role: 'expert_1',
      desc: 'Validasi independen klinis & pembentukan Gold Standard',
      icon: Stethoscope,
      badge: 'Pakar 1',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      activeColor: 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-100',
    },
    {
      title: 'Pakar 2 (Mutu RS & MARS)',
      email: 'expert2@triage.ac.id',
      password: 'Triage2025!',
      role: 'expert_2',
      desc: 'Validasi independen kedua & sidang adjudikasi konsensus KARS',
      icon: Stethoscope,
      badge: 'Pakar 2',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      activeColor: 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-100',
    },
    {
      title: 'Staf Penguji Triase (Participant)',
      email: 'participant@triage.ac.id',
      password: 'Triage2025!',
      role: 'participant',
      desc: 'Sesi pengujian triase manual vs AI terandomisasi (Latin Square)',
      icon: UserCheck,
      badge: 'Partisipan P001',
      badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
      activeColor: 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-100',
    },
  ]

  const handleFill = (acc: typeof quickAccounts[0]) => {
    setEmail(acc.email)
    setPassword(acc.password)
    setSelectedRole(acc.role)
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative selection:bg-blue-100 selection:text-blue-900">
      {/* Background Soft Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 max-w-sm relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto mb-4 flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20 ring-4 ring-white">
          T
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-[11px] font-medium mb-2">
          <Sparkles size={11} className="text-blue-600" />
          <span>Research Portal &amp; Clinical Lab</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Masuk ke TRIAGE Lab
        </h1>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Gunakan akun penelitian terdaftar untuk mengakses ruang kerja triase dan instrumen eksperimen.
        </p>
      </div>

      {/* Main Login Card */}
      <Card className="max-w-md w-full p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/40 space-y-6 relative z-10">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 shadow-2xs">
            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Alamat Email Penelitian
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setSelectedRole(null)
                }}
                placeholder="peneliti@triage.ac.id"
                className="pl-10 h-10.5 text-xs rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 block">
                Kata Sandi
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                Default: Triage2025!
              </span>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setSelectedRole(null)
                }}
                placeholder="••••••••"
                className="pl-10 pr-10 h-10.5 text-xs rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full text-xs font-medium h-11 mt-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            loading={loading}
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight size={14} />
          </Button>
        </form>

        {/* 1-Click Fast Fill Accounts */}
        <div className="pt-5 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Akun Riset (Klik untuk Mengisi):
            </span>
            <span className="text-[10px] text-slate-400 font-medium">1-Click Fast Fill</span>
          </div>

          <div className="space-y-2">
            {quickAccounts.map((acc) => {
              const Icon = acc.icon
              const isSelected = selectedRole === acc.role || email === acc.email
              return (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleFill(acc)}
                  className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between gap-3 text-xs cursor-pointer ${
                    isSelected
                      ? acc.activeColor
                      : 'border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-white border-transparent shadow-2xs'
                          : 'bg-slate-100/70 border-slate-200/60 text-slate-600'
                      }`}
                    >
                      <Icon size={14} className={isSelected ? 'text-blue-600' : 'text-slate-600'} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                        <span>{acc.title}</span>
                        {isSelected && <CheckCircle2 size={12} className="text-blue-600 shrink-0" />}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono block truncate">
                        {acc.email}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${acc.badgeColor}`}
                  >
                    {acc.badge}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Back to Home Link */}
      <div className="mt-6 text-center text-xs relative z-10">
        <Link
          href="/"
          className="text-slate-500 hover:text-slate-900 font-medium transition-colors inline-flex items-center gap-1.5"
        >
          <span>← Kembali ke Beranda TRIAGE Lab</span>
        </Link>
      </div>
    </div>
  )
}
