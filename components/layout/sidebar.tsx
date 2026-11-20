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
  Microscope,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Dataset Keluhan', href: '/complaints', icon: FileText },
  { label: 'Eksperimen', href: '/experiments', icon: FlaskConical },
  { label: 'Triase Manual', href: '/triage/manual', icon: ClipboardList },
  { label: 'Triase AI', href: '/triage/ai-assisted', icon: Bot },
  { label: 'Validasi Ahli', href: '/validation', icon: ShieldCheck },
  { label: 'Partisipan', href: '/participants', icon: Users },
  { label: 'Analitik', href: '/analytics', icon: BarChart2 },
  { label: 'AI Laboratory', href: '/ai-lab', icon: Cpu },
  { label: 'Laporan', href: '/reports', icon: FileBarChart },
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
    <aside
      style={{ width: 220 }}
      className="flex flex-col h-screen border-r border-[var(--border-subtle)] bg-white shrink-0 sticky top-0"
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center shrink-0">
            <Microscope size={16} className="text-white" />
          </div>
          <div className="leading-tight min-w-0">
            <p className="font-bold text-[var(--accent)] text-sm tracking-tight truncate">TRIAGE</p>
            <p className="text-[10px] text-[var(--text-muted)] truncate">Research Lab</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                    active
                      ? 'bg-blue-50 text-[var(--accent)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]'
                  )}
                >
                  <Icon
                    size={16}
                    className={cn(
                      'shrink-0',
                      active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                    )}
                  />
                  <span className="truncate">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User area */}
      {user && (
        <div className="p-3 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[var(--text-primary)] truncate">{user.name}</p>
              <p className="text-[10px] text-[var(--text-muted)] truncate">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
