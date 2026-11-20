'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export function useTaskTimer() {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    startTimeRef.current = Date.now()
    setIsRunning(true)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setElapsed((Date.now() - startTimeRef.current) / 1000)
      }
    }, 100)
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRunning(false)
    const finalElapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : elapsed
    setElapsed(finalElapsed)
    return finalElapsed
  }, [elapsed])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setElapsed(0)
    setIsRunning(false)
    startTimeRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const formatElapsed = () => {
    const mins = Math.floor(elapsed / 60)
    const secs = Math.floor(elapsed % 60)
    const ms = Math.floor((elapsed % 1) * 10)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${ms}`
  }

  return { elapsed, isRunning, start, stop, reset, formatElapsed, startTime: startTimeRef.current }
}
