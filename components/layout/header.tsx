'use client'

import { usePathname } from 'next/navigation'
import { ChevronDown, LogOut, FlaskConical, Bell, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview Dashboard',
  '/complaints': 'Manajemen Korpus Keluhan',
  '/experiments': 'Sesi Eksperimen',
  '/triage/manual': 'Instrumen Triase Manual',
  '/triage/ai-assisted': 'Instrumen Triase Berbantuan AI',
  '/validation': 'Validasi Standar Emas Pakar',
  '/participants': 'Daftar Partisipan Staf',
  '/analytics': 'Analitik Inferensial LMM',
  '/ai-lab': 'AI Laboratory (Dual Provider)',
  '/reports': 'Laporan & Ekspor Riset',
  '/settings': 'Pengaturan Sistem',
  '/about': 'Metodologi & Regulasi RS',
}

interface HeaderProps {
  user?: {
    name: string
    email: string
    role: string
  } | null
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const title =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ??
    'TRIAGE Research Lab'

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shrink-0 select-none shadow-2xs">
      {/* Left: Breadcrumbs & Page Title */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-medium text-slate-400 hidden sm:inline">
          Research Lab
        </span>
        <span className="text-slate-300 hidden sm:inline">/</span>
        <h1 className="text-sm font-semibold text-slate-900 tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right: Controls & User Profile */}
      <div className="flex items-center gap-3">
        {/* Active Session Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs text-slate-600 bg-slate-50 rounded-full border border-slate-200/80">
          <FlaskConical size={13} className="text-blue-600" />
          <span className="font-medium text-[11px]">Protokol Latin Square (Active)</span>
        </div>

        {/* Public View Button */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
          title="Buka Beranda Riset"
        >
          <span>Beranda</span>
          <ExternalLink size={12} />
        </Link>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={cn(
              'flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200/80 transition-all text-xs bg-white shadow-2xs cursor-pointer',
              userMenuOpen ? 'bg-slate-50 ring-2 ring-blue-100' : 'hover:bg-slate-50 hover:border-slate-300'
            )}
          >
            <div className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center text-[11px] font-semibold">
              {user?.name?.charAt(0).toUpperCase() ?? 'P'}
            </div>
            <span className="text-xs font-medium text-slate-800 max-w-[130px] truncate">
              {user?.name ?? 'Staf Riset'}
            </span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 p-1.5 shadow-md animate-fade-in z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{user?.name ?? 'Staf Riset'}</p>
                <p className="text-[11px] text-slate-500 font-mono truncate">{user?.email ?? 'peneliti@triage.ac.id'}</p>
              </div>
              <button
                onClick={() => {
                  window.location.href = '/api/auth/logout'
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left cursor-pointer"
              >
                <LogOut size={14} />
                <span>Keluar Akun Penelitian</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
