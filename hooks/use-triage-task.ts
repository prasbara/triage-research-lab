'use client'

import { useState, useCallback } from 'react'

export function useTriageTask(method: 'manual' | 'ai_assisted') {
  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchNextTask = useCallback(async (sessionId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const url = new URL('/api/triage/next-task', window.location.origin)
      url.searchParams.set('method', method)
      if (sessionId) url.searchParams.set('session_id', sessionId)

      const res = await fetch(url.toString())
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch task')

      if (!data.task) {
        setHasMore(false)
        setTask(null)
      } else {
        setTask(data.task)
        setHasMore(true)
      }
      return data.task
    } catch (e: any) {
      setError(e.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [method])

  return { task, loading, error, hasMore, fetchNextTask, setTask }
}
