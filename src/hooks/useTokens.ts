import { useState, useEffect, useCallback, useRef } from 'react'
import type { Token } from '../types/token'
import { fetchTokens, type PatternConfig } from '../lib/api'

const POLL_INTERVAL = 10 // seconds

export function useTokens(pattern: PatternConfig) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(POLL_INTERVAL)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const patternRef = useRef(pattern)
  patternRef.current = pattern

  const load = useCallback(async () => {
    try {
      setError(null)
      const p = patternRef.current
      let data = await fetchTokens(p.mcapMin, p.mcapMax, p.daysBack)
      if (p.filter) {
        data = data.filter(p.filter)
      }
      setTokens(data)
      setLastUpdate(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }, [])

  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)

    setCountdown(POLL_INTERVAL)

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? POLL_INTERVAL : prev - 1))
    }, 1000)

    intervalRef.current = setInterval(() => {
      load()
    }, POLL_INTERVAL * 1000)
  }, [load])

  const refresh = useCallback(() => {
    setLoading(true)
    load()
    startPolling()
  }, [load, startPolling])

  // Reload on pattern change
  useEffect(() => {
    setLoading(true)
    setTokens([])
    load()
    startPolling()

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [pattern.id, load, startPolling])

  // Pause when tab hidden
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        if (countdownRef.current) clearInterval(countdownRef.current)
      } else {
        load()
        startPolling()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [load, startPolling])

  return { tokens, loading, error, countdown, lastUpdate, refresh }
}
