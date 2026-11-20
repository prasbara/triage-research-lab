import { formatDate, formatDuration, getStatusColor } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function RecentActivityTable({ tasks }: { tasks: any[] }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-[var(--color-pure-white)] rounded-[4px] border border-[var(--color-hairline)] p-8 text-center">
        <p className="text-[var(--color-graphite)] text-xs font-mono uppercase tracking-[1.2px]">
          Belum ada aktivitas observasi triage. Jalankan sesi eksperimen untuk melihat data real-time.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-pure-white)] rounded-[4px] border border-[var(--color-hairline)] overflow-hidden shadow-none">
      <div className="px-6 py-4 border-b border-[var(--color-hairline)] flex items-center justify-between">
        <div>
          <h3 className="font-light text-[var(--color-ink)] text-sm tracking-tight">
            Aktivitas Observasi Triage Terakhir
          </h3>
          <p className="text-xs text-[var(--color-graphite)] mt-0.5">
            Log eksekusi tugas manual vs pendampingan LLM
          </p>
        </div>
        <span className="text-xs text-[var(--color-smoke)] font-mono tracking-[1.2px]">
          {tasks.length} item tercatat
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[var(--color-linen)] border-b border-[var(--color-hairline)] text-[11px] uppercase tracking-[1.2px] text-[var(--color-graphite)] font-mono">
              <th className="px-6 py-3">Kasus</th>
              <th className="px-6 py-3">Partisipan</th>
              <th className="px-6 py-3">Metode</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Durasi</th>
              <th className="px-6 py-3">Waktu Selesai</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-hairline)] text-xs">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-[var(--color-linen)]/40 transition-colors">
                <td className="px-6 py-3.5 font-semibold text-[var(--color-ink)] font-mono">
                  {task.complaint_cases?.case_id || task.case_id || '—'}
                </td>
                <td className="px-6 py-3.5 text-[var(--color-iron)] font-mono text-xs">
                  {task.profiles?.participant_code || task.participant_id?.substring(0, 8) || '—'}
                </td>
                <td className="px-6 py-3.5">
                  <Badge variant={task.method === 'manual' ? 'outline' : 'default'}>
                    {task.method === 'manual' ? 'Manual' : 'AI-Assisted'}
                  </Badge>
                </td>
                <td className="px-6 py-3.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-[4px] font-mono text-[10px] tracking-[1px] uppercase font-medium ${getStatusColor(
                      task.completion_status
                    )}`}
                  >
                    {task.completion_status}
                  </span>
                </td>
                <td className="px-6 py-3.5 font-mono text-[var(--color-ink)] font-medium">
                  {task.duration_seconds ? formatDuration(task.duration_seconds) : '—'}
                </td>
                <td className="px-6 py-3.5 text-[var(--color-smoke)]">
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
