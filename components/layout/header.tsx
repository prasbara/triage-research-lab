'use client'

import { usePathname } from 'next/navigation'
import { Bell, ChevronDown, User, LogOut, FlaskConical } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/complaints': 'Dataset Keluhan',
  '/experiments': 'Eksperimen',
  '/triage/manual': 'Triase Manual',
  '/triage/ai-assisted': 'Triase AI',
  '/validation': 'Validasi Ahli',
  '/participants': 'Partisipan',
  '/analytics': 'Analitik',
  '/ai-lab': 'AI Laboratory',
  '/reports': 'Laporan',
  '/settings': 'Pengaturan',
  '/about': 'Tentang Riset',
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
  const [notifOpen, setNotifOpen] = useState(false)

  // Derive page title from pathname
  const title =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ??
    'TRIAGE Research Lab'

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 bg-white/80 backdrop-blur-xl border-b border-[var(--border-subtle)] shrink-0">
      {/* Left: Page title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Experiment session selector */}
        <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--surface)] rounded-full border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] transition-colors">
          <FlaskConical size={12} className="text-[var(--accent)]" />
          <span>Sesi Aktif</span>
          <ChevronDown size={12} />
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false) }}
            className="relative w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface)] transition-colors"
            aria-label="Notifikasi"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-lg border border-[var(--border-subtle)] p-4 text-sm text-[var(--text-muted)] animate-fade-in">
              Belum ada notifikasi baru.
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false) }}
            className={cn(
              'flex items-center gap-2 px-2.5 py-1.5 rounded-full transition-colors text-sm',
              userMenuOpen ? 'bg-[var(--surface)]' : 'hover:bg-[var(--surface)]'
            )}
          >
            <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-semibold">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <span className="hidden md:block text-xs font-medium text-[var(--text-primary)] max-w-[120px] truncate">
              {user?.name ?? 'Pengguna'}
            </span>
            <ChevronDown size={12} className="text-[var(--text-muted)]" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-[var(--border-subtle)] overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user?.name}</p>
                <p className="text-[11px] text-[var(--text-muted)] truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors">
                  <User size={14} />
                  Profil
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={14} />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
