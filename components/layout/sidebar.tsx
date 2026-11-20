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
  { label: 'Analitik LMM', href: '/analytics', icon: BarChart2 },
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
      style={{ width: 230 }}
      className="flex flex-col h-screen border-r border-[#dedbd6] bg-[#f1eee9] shrink-0 sticky top-0 select-none"
    >
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-[#dedbd6] bg-[#f1eee9]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-[#000000] text-white flex items-center justify-center shrink-0">
            <Microscope size={14} className="text-white" />
          </div>
          <div className="leading-tight min-w-0">
            <p className="font-mono text-xs font-semibold uppercase tracking-[1.2px] text-[#111111] truncate">
              TRIAGE
            </p>
            <p className="text-[10px] text-[#585858] truncate">Research Lab</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs transition-colors duration-100',
                    active
                      ? 'bg-[#ffffff] text-[#111111] font-medium border border-[#dedbd6] shadow-none'
                      : 'text-[#585858] hover:bg-[#faf9f6] hover:text-[#111111]'
                  )}
                >
                  <Icon
                    size={14}
                    className={cn(
                      'shrink-0',
                      active ? 'text-[#0007cb]' : 'text-[#888888]'
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
      <div className="p-3 border-t border-[#dedbd6] bg-[#f1eee9] text-xs">
        <div className="p-2.5 rounded-[4px] bg-[#ffffff] border border-[#dedbd6]">
          <span className="text-[10px] font-mono uppercase tracking-[1.2px] text-[#888888] block mb-0.5">
            {user?.role || 'Peneliti'}
          </span>
          <p className="text-xs font-medium text-[#111111] truncate">{user?.name || 'Administrator'}</p>
        </div>
      </div>
    </aside>
  )
}
