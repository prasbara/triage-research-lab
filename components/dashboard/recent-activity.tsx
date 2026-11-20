import { formatDate, formatDuration, getStatusColor } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function RecentActivityTable({ tasks }: { tasks: any[] }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-[20px] border border-[var(--border-subtle)] p-8 text-center">
        <p className="text-[var(--text-secondary)] text-sm font-medium">
          Belum ada aktivitas observasi triage. Jalankan sesi eksperimen untuk melihat data real-time.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[20px] border border-[var(--border-subtle)] overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] text-sm tracking-tight">
            Aktivitas Observasi Triage Terakhir
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Log eksekusi tugas manual vs pendampingan LLM
          </p>
        </div>
        <span className="text-xs text-[var(--text-muted)] font-mono">
          {tasks.length} item tercatat
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[var(--surface-secondary)] border-b border-[var(--border-subtle)] text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
              <th className="px-6 py-3">Kasus</th>
              <th className="px-6 py-3">Partisipan</th>
              <th className="px-6 py-3">Metode</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Durasi</th>
              <th className="px-6 py-3">Waktu Selesai</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-[var(--surface)] transition-colors">
                <td className="px-6 py-3.5 font-semibold text-[var(--text-primary)] font-mono">
                  {task.complaint_cases?.case_id || task.case_id || '—'}
                </td>
                <td className="px-6 py-3.5 text-[var(--text-secondary)]">
                  {task.profiles?.participant_code || task.participant_id?.substring(0, 8) || '—'}
                </td>
                <td className="px-6 py-3.5">
                  <Badge variant={task.method === 'manual' ? 'outline' : 'default'}>
                    {task.method === 'manual' ? 'Manual' : 'AI-Assisted'}
                  </Badge>
                </td>
                <td className="px-6 py-3.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(
                      task.completion_status
                    )}`}
                  >
                    {task.completion_status}
                  </span>
                </td>
                <td className="px-6 py-3.5 font-mono text-[var(--text-primary)] font-medium">
                  {task.duration_seconds ? formatDuration(task.duration_seconds) : '—'}
                </td>
                <td className="px-6 py-3.5 text-[var(--text-muted)]">
                  {formatDate(task.task_submitted_at || task.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
