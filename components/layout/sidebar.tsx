'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  FlaskConical,
  ClipboardList,
  Bot,
  ShieldCheck,
  Users,
  BarChart2,
  Cpu,
  FileBarChart,
  Settings,
  BookOpen,
  Activity,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Dataset Keluhan', href: '/complaints', icon: FileText },
  { label: 'Eksperimen', href: '/experiments', icon: FlaskConical },
  { label: 'Triase Manual', href: '/triage/manual', icon: ClipboardList },
  { label: 'Triase AI-Assisted', href: '/triage/ai-assisted', icon: Bot },
  { label: 'Validasi Ahli', href: '/validation', icon: ShieldCheck },
  { label: 'Partisipan', href: '/participants', icon: Users },
  { label: 'Analitik LMM', href: '/analytics', icon: BarChart2 },
  { label: 'AI Laboratory', href: '/ai-lab', icon: Cpu },
  { label: 'Laporan Riset', href: '/reports', icon: FileBarChart },
  { label: 'Pengaturan', href: '/settings', icon: Settings },
  { label: 'Tentang Riset', href: '/about', icon: BookOpen },
]

interface SidebarProps {
  user?: {
    name: string
    email: string
    role: string
    avatarUrl?: string
  } | null
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-60 flex flex-col h-screen border-r border-slate-200/80 bg-white shrink-0 sticky top-0 select-none shadow-2xs z-40">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-blue-700 transition-colors">
            T
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-sm font-semibold tracking-tight text-slate-900 truncate">
              TRIAGE Lab
            </p>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide truncate">
              Clinical Research
            </p>
          </div>
        </Link>
        <span className="w-2 h-2 rounded-full bg-emerald-500" title="System Online" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        <div className="mb-2 px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Platform Menu
        </div>
        <ul className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                    active
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon
                    size={16}
                    className={cn(
                      'shrink-0 transition-colors',
                      active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  />
                  <span className="truncate">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer User Info */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
          <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-medium shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? 'P'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-900 truncate leading-tight">
              {user?.name ?? 'Peneliti Staf'}
            </p>
            <p className="text-[10px] text-slate-500 truncate leading-tight">
              {user?.role ?? 'Participant'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
