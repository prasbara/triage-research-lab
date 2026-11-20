'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Shuffle, Layers, Shield } from 'lucide-react'

interface ParticipantAssignmentCardProps {
  participantId: string
  sequenceGroup: 'Group_A' | 'Group_B'
  firstCondition: 'Manual' | 'AI-Assisted'
  secondCondition: 'Manual' | 'AI-Assisted'
  randomizationSeed?: number
}

export function ParticipantAssignmentCard({
  participantId,
  sequenceGroup,
  firstCondition,
  secondCondition,
  randomizationSeed = 42,
}: ParticipantAssignmentCardProps) {
  return (
    <Card className="p-6 border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--color-hairline)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-[var(--color-linen)] flex items-center justify-center font-mono text-xs font-semibold text-[var(--color-ink)] border border-[var(--color-hairline)]">
            {participantId}
          </div>
          <div>
            <h4 className="text-sm font-light text-[var(--color-ink)]">
              Profil Partisipan Triase
            </h4>
            <span className="text-[11px] font-mono text-[var(--color-smoke)]">
              Penetapan Randomisasi Blok Latin Square
            </span>
          </div>
        </div>

        <Badge variant="outline">{sequenceGroup}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 bg-[var(--color-linen)]/40 rounded-[4px] border border-[var(--color-hairline)] space-y-1">
          <span className="text-[10px] text-[var(--color-smoke)] uppercase block">Blok Fase 1</span>
          <span className="text-sm font-light text-[var(--color-ink)]">{firstCondition}</span>
          <p className="text-[10px] text-[var(--color-smoke)] font-sans">Kondisi perlakuan awal</p>
        </div>

        <div className="p-3 bg-[var(--color-linen)]/40 rounded-[4px] border border-[var(--color-hairline)] space-y-1">
          <span className="text-[10px] text-[var(--color-smoke)] uppercase block">Blok Fase 2</span>
          <span className="text-sm font-light text-[var(--color-ink)]">{secondCondition}</span>
          <p className="text-[10px] text-[var(--color-smoke)] font-sans">Kondisi perlakuan silang</p>
        </div>
      </div>

      <div className="p-3 rounded-[4px] bg-[var(--color-canvas-cream)] border border-[var(--color-hairline)] text-[11px] font-light text-[var(--color-graphite)] leading-relaxed">
        <strong>Protokol Urutan Latin Square:</strong> Menghilangkan efek urutan (*order effect*) dan efek kelelahan (*carryover fatigue effect*) pada estimasi model LMM.
      </div>
    </Card>
  )
}
