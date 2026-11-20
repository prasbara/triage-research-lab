import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0.0s'
  if (seconds < 60) return `${seconds.toFixed(1)}s`
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60).toString().padStart(2, '0')
  return `${mins}m ${secs}s`
}

export function formatMilliseconds(ms: number): string {
  if (isNaN(ms) || ms < 0) return '00:00.0'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  const tenths = Math.floor((ms % 1000) / 100)
  return `${minutes}:${seconds}.${tenths}`
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'short' }).format(new Date(date))
}

export function formatPercentage(value: number, decimals = 1): string {
  if (isNaN(value)) return '0.0%'
  return `${(value * 100).toFixed(decimals)}%`
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || ''
  return text.substring(0, maxLength) + '...'
}

export function getMethodLabel(method: string): string {
  return method === 'manual' ? 'Manual (Tanpa AI)' : 'AI-Assisted (LLM NIM/Gemini)'
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'text-amber-700 bg-amber-50 border border-amber-200/50',
    in_progress: 'text-blue-700 bg-blue-50 border border-blue-200/50',
    in_review: 'text-blue-700 bg-blue-50 border border-blue-200/50',
    validated: 'text-emerald-700 bg-emerald-50 border border-emerald-200/50',
    completed: 'text-emerald-700 bg-emerald-50 border border-emerald-200/50',
    rejected: 'text-rose-700 bg-rose-50 border border-rose-200/50',
    interrupted: 'text-rose-700 bg-rose-50 border border-rose-200/50',
    duplicate: 'text-gray-500 bg-gray-50',
    invalid: 'text-gray-500 bg-gray-50',
    setup: 'text-gray-700 bg-gray-50',
    pilot: 'text-purple-700 bg-purple-50 border border-purple-200/50',
    main: 'text-blue-700 bg-blue-50 border border-blue-200/50',
    archived: 'text-gray-400 bg-gray-50',
  }
  return map[status] || 'text-gray-700 bg-gray-50'
}
