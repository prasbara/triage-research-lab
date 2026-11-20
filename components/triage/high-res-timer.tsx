'use client'

import { useEffect, useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { formatMilliseconds } from '@/lib/utils/format'
import { Timer, Pause, Play, RotateCcw } from 'lucide-react'

interface HighResTimerProps {
  isRunning: boolean
  onElapsedUpdate?: (elapsedMs: number) => void
  onPauseToggle?: (isPaused: boolean) => void
  resetKey?: any
}

export function HighResTimer({
  isRunning,
  onElapsedUpdate,
  onPauseToggle,
  resetKey,
}: HighResTimerProps) {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const accumulatedMsRef = useRef(0)
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    // Reset timer when resetKey changes
    setElapsedMs(0)
    accumulatedMsRef.current = 0
    startTimeRef.current = null
    setIsPaused(false)
  }, [resetKey])

  useEffect(() => {
    if (isRunning && !isPaused) {
      startTimeRef.current = performance.now()

      const updateTimer = () => {
        if (startTimeRef.current !== null) {
          const now = performance.now()
          const currentTotal = accumulatedMsRef.current + (now - startTimeRef.current)
          setElapsedMs(currentTotal)
          if (onElapsedUpdate) onElapsedUpdate(currentTotal)
        }
        animFrameRef.current = requestAnimationFrame(updateTimer)
      }

      animFrameRef.current = requestAnimationFrame(updateTimer)
    } else {
      if (startTimeRef.current !== null) {
        accumulatedMsRef.current += performance.now() - startTimeRef.current
        startTimeRef.current = null
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [isRunning, isPaused, onElapsedUpdate])

  const togglePause = () => {
    const nextPaused = !isPaused
    setIsPaused(nextPaused)
    if (onPauseToggle) onPauseToggle(nextPaused)
  }

  return (
    <Card className="px-4 py-3 flex items-center justify-between border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none">
      <div className="flex items-center gap-2">
        <Timer
          size={16}
          className={`${
            isRunning && !isPaused ? 'text-[var(--color-electric-violet)] animate-pulse' : 'text-[var(--color-smoke)]'
          }`}
        />
        <span className="text-[11px] font-mono uppercase tracking-[1.2px] text-[var(--color-graphite)]">Stopwatch Audit:</span>
        <span className="font-mono text-base font-light text-[var(--color-ink)]">
          {formatMilliseconds(elapsedMs)}
        </span>
      </div>

      {isRunning && (
        <button
          onClick={togglePause}
          className="text-xs flex items-center gap-1 font-mono uppercase tracking-[1px] px-2.5 py-1 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] hover:bg-[var(--color-linen)] text-[var(--color-ink)] transition-colors cursor-pointer"
        >
          {isPaused ? (
            <>
              <Play size={12} className="text-emerald-600" /> <span>Lanjutkan</span>
            </>
          ) : (
            <>
              <Pause size={12} className="text-amber-600" /> <span>Jeda</span>
            </>
          )}
        </button>
      )}
    </Card>
  )
}
