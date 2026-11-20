'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateShort, truncateText, getStatusColor } from '@/lib/utils/format'
import { FileText, Calendar, Building, ShieldCheck } from 'lucide-react'

interface ComplaintCardProps {
  complaint: {
    id: string
    case_code: string
    complaint_text: string
    date_received?: string | null
    channel?: string | null
    validation_status?: string | null
    is_gold_standard?: boolean
    category?: { name: string } | null
    priority?: { name: string; color?: string } | null
    unit?: { name: string } | null
  }
  onClick?: () => void
}

export function ComplaintCard({ complaint, onClick }: ComplaintCardProps) {
  return (
    <Card
      onClick={onClick}
      className="p-5 cursor-pointer hover:border-[var(--color-ink)] transition-all space-y-3 rounded-[4px] border-[var(--color-hairline)] bg-[var(--color-pure-white)] shadow-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono font-medium text-xs text-[var(--color-electric-violet)] tracking-[1.2px]">
            {complaint.case_code}
          </span>
          {complaint.is_gold_standard && (
            <Badge variant="success" className="text-[10px] py-0 h-5 rounded-[4px] font-mono tracking-[1px] uppercase">
              <ShieldCheck size={10} className="mr-1" /> Gold Standard
            </Badge>
          )}
        </div>
        <span
          className={`text-[10px] font-mono tracking-[1px] uppercase font-medium px-2 py-0.5 rounded-[4px] ${getStatusColor(
            complaint.validation_status || 'pending'
          )}`}
        >
          {complaint.validation_status || 'Pending'}
        </span>
      </div>

      <p className="text-xs text-[var(--color-iron)] line-clamp-3 leading-relaxed font-light">
        {complaint.complaint_text}
      </p>

      <div className="pt-2 border-t border-[var(--color-hairline)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--color-graphite)] font-mono">
        <div className="flex items-center gap-2">
          {complaint.category && (
            <span className="px-2 py-0.5 rounded-[4px] bg-[var(--color-linen)] text-[var(--color-ink)] text-[10px] uppercase tracking-[1px] border border-[var(--color-hairline)]">
              {complaint.category.name}
            </span>
          )}
          {complaint.priority && (
            <span
              className="px-2 py-0.5 rounded-[4px] font-mono text-[10px] tracking-[1px] uppercase text-white"
              style={{ backgroundColor: complaint.priority.color || '#0007cb' }}
            >
              {complaint.priority.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[10px]">
          <Calendar size={11} />
          <span>{formatDateShort(complaint.date_received)}</span>
        </div>
      </div>
    </Card>
  )
}
