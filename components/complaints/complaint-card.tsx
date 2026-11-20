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
      className="p-5 cursor-pointer hover:border-[var(--accent)] hover:shadow-sm transition-all space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs text-[var(--accent)]">
            {complaint.case_code}
          </span>
          {complaint.is_gold_standard && (
            <Badge variant="success" className="text-[10px] py-0 h-5">
              <ShieldCheck size={10} className="mr-1" /> Gold Standard
            </Badge>
          )}
        </div>
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(
            complaint.validation_status || 'pending'
          )}`}
        >
          {complaint.validation_status || 'Pending'}
        </span>
      </div>

      <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
        {complaint.complaint_text}
      </p>

      <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          {complaint.category && (
            <span className="px-2 py-0.5 rounded bg-[var(--surface-secondary)] text-[var(--text-primary)] font-medium">
              {complaint.category.name}
            </span>
          )}
          {complaint.priority && (
            <span
              className="px-2 py-0.5 rounded font-semibold text-white"
              style={{ backgroundColor: complaint.priority.color || '#0071e3' }}
            >
              {complaint.priority.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{formatDateShort(complaint.date_received)}</span>
        </div>
      </div>
    </Card>
  )
}
