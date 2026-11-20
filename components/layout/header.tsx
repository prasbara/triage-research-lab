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
  '/analytics': 'Analitik LMM',
  '/ai-lab': 'AI Laboratory',
  '/reports': 'Laporan Riset',
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

  const title =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ??
    'TRIAGE Research Lab'

  return (
    <header className="sticky top-0 z-30 h-12 flex items-center justify-between px-6 bg-[#faf9f6]/95 backdrop-blur-sm border-b border-[#dedbd6] shrink-0 select-none">
      {/* Left: Page Title in Saans 300 / 400 */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-normal text-[#111111] tracking-tight">
          {title}
        </h1>
        <span className="text-[#888888] font-mono text-[10px] uppercase tracking-[1.2px] hidden sm:inline">
          / Hospital Quality Management
        </span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Experiment session indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#585858] bg-[#f1eee9] rounded-[4px] border border-[#dedbd6]">
          <FlaskConical size={12} className="text-[#0007cb]" />
          <span className="font-mono text-[11px]">Sesi Aktif (Latin Square)</span>
        </div>

        {/* User menu button */}
        <div className="relative">
          <button
            onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false) }}
            className={cn(
              'flex items-center gap-2 px-2.5 py-1 rounded-[4px] border border-[#dedbd6] transition-colors text-xs bg-[#ffffff]',
              userMenuOpen ? 'bg-[#f1eee9]' : 'hover:bg-[#f1eee9]'
            )}
          >
            <div className="w-5 h-5 rounded-[2px] bg-[#000000] flex items-center justify-center text-white text-[10px] font-mono">
              {user?.name?.charAt(0).toUpperCase() ?? 'P'}
            </div>
            <span className="hidden md:block text-xs font-normal text-[#111111] max-w-[120px] truncate">
              {user?.name ?? 'Peneliti'}
            </span>
            <ChevronDown size={11} className="text-[#888888]" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-[#ffffff] rounded-[4px] border border-[#dedbd6] p-1 shadow-none animate-fade-in z-50">
              <div className="px-3 py-2 border-b border-[#dedbd6] mb-1">
                <p className="text-xs font-medium text-[#111111] truncate">{user?.name}</p>
                <p className="text-[10px] font-mono text-[#888888] truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  window.location.href = '/api/auth/logout'
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-700 hover:bg-[#f1eee9] rounded-[2px] transition-colors text-left"
              >
                <LogOut size={12} />
                <span>Keluar Akun</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
