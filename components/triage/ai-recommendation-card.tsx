'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Check, Edit3, ShieldAlert } from 'lucide-react'
import { ClinicalRiskBadge } from './clinical-risk-badge'

interface AIRecommendationCardProps {
  provider: 'nvidia' | 'gemini'
  model: string
  recommendation: {
    category_id?: string
    category_name?: string
    priority_id?: string
    priority_code?: string
    priority_name?: string
    target_unit_id?: string
    target_unit_name?: string
    initial_action_recommendation?: string
    reasoning?: string
    confidence_score?: number
  } | null
  latencyMs?: number
  onAcceptAll?: () => void
  onModify?: () => void
  isAccepted?: boolean
}

export function AIRecommendationCard({
  provider,
  model,
  recommendation,
  latencyMs,
  onAcceptAll,
  onModify,
  isAccepted,
}: AIRecommendationCardProps) {
  if (!recommendation) {
    return (
      <Card className="p-6 border-dashed border-[var(--border-subtle)] text-center space-y-2">
        <Sparkles size={24} className="mx-auto text-[var(--accent)] animate-pulse" />
        <h4 className="text-xs font-semibold text-[var(--text-primary)]">
          Menunggu Inferensi Model LLM...
        </h4>
        <p className="text-[11px] text-[var(--text-muted)]">
          Sistem sedang memproses klasifikasi berbasis SOP rumah sakit secara server-side
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-5 border-[var(--accent)]/30 bg-blue-50/15 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--accent)] text-white flex items-center justify-center">
            <Sparkles size={12} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary)]">
              Rekomendasi AI ({provider.toUpperCase()})
            </h4>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">{model}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {latencyMs && (
            <span className="text-[10px] font-mono text-[var(--text-muted)]">{latencyMs}ms</span>
          )}
          <Badge variant="default">AI-Assisted</Badge>
        </div>
      </div>

      <ClinicalRiskBadge
        priorityCode={recommendation.priority_code}
        priorityName={recommendation.priority_name}
        confidenceScore={recommendation.confidence_score}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white border border-[var(--border-subtle)]">
          <span className="text-[10px] text-[var(--text-muted)] block">Kategori Rekomendasi</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {recommendation.category_name || '—'}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white border border-[var(--border-subtle)]">
          <span className="text-[10px] text-[var(--text-muted)] block">Prioritas Respon</span>
          <span className="font-bold text-[var(--accent)]">
            {recommendation.priority_name || recommendation.priority_code || '—'}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white border border-[var(--border-subtle)]">
          <span className="text-[10px] text-[var(--text-muted)] block">Unit Disposisi</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {recommendation.target_unit_name || '—'}
          </span>
        </div>
      </div>

      {recommendation.reasoning && (
        <div className="space-y-1 text-xs">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] block">
            Pertimbangan Klinis & Regulasi:
          </span>
          <p className="text-[11px] text-[var(--text-secondary)] bg-white p-3 rounded-xl border border-[var(--border-subtle)] leading-relaxed italic">
            "{recommendation.reasoning}"
          </p>
        </div>
      )}

      {recommendation.initial_action_recommendation && (
        <div className="space-y-1 text-xs">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] block">
            Rekomendasi Tindakan Awal:
          </span>
          <p className="text-[11px] text-[var(--text-primary)] bg-white p-3 rounded-xl border border-[var(--border-subtle)] leading-relaxed">
            {recommendation.initial_action_recommendation}
          </p>
        </div>
      )}

      <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--border-subtle)]">
        {onModify && (
          <Button variant="ghost" size="sm" onClick={onModify} className="text-xs">
            <Edit3 size={13} className="mr-1" />
            <span>Koreksi / Modifikasi</span>
          </Button>
        )}
        {onAcceptAll && (
          <Button
            size="sm"
            onClick={onAcceptAll}
            className={`text-xs ${isAccepted ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
          >
            <Check size={13} className="mr-1" />
            <span>{isAccepted ? 'Rekomendasi Diterima' : 'Terapkan Rekomendasi AI'}</span>
          </Button>
        )}
      </div>
    </Card>
  )
}
