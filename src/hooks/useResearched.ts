import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'token-watchlist:researched-mints'

function readLocalResearched(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const mints = raw ? (JSON.parse(raw) as string[]) : []
    return new Set(mints.filter((mint) => typeof mint === 'string' && mint.trim()))
  } catch {
    return new Set()
  }
}

function writeLocalResearched(mints: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...mints]))
}

async function syncResearched(method: 'POST' | 'DELETE', mint: string) {
  const res = await fetch('/api/researched', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mint }),
  })
  if (!res.ok) throw new Error(`Research sync failed: ${res.status}`)
}

export function useResearched() {
  const [researchedMints, setResearchedMints] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const localMints = readLocalResearched()
      setResearchedMints(localMints)

      try {
        const res = await fetch('/api/researched')
        if (!res.ok) throw new Error(`Research load failed: ${res.status}`)
        const data = (await res.json()) as { mints?: string[] }
        const remoteMints = new Set((data.mints || []).filter((mint) => typeof mint === 'string' && mint.trim()))
        setResearchedMints(remoteMints)
        writeLocalResearched(remoteMints)
      } catch (error) {
        console.warn('Using local researched fallback:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const markResearched = useCallback(async (mint: string) => {
    const normalizedMint = mint.trim()
    if (!normalizedMint) return

    setResearchedMints((prev) => {
      const next = new Set(prev).add(normalizedMint)
      writeLocalResearched(next)
      return next
    })

    try {
      await syncResearched('POST', normalizedMint)
    } catch (error) {
      console.warn('Failed to sync researched token:', error)
    }
  }, [])

  const unmarkResearched = useCallback(async (mint: string) => {
    const normalizedMint = mint.trim()
    if (!normalizedMint) return

    setResearchedMints((prev) => {
      const next = new Set(prev)
      next.delete(normalizedMint)
      writeLocalResearched(next)
      return next
    })

    try {
      await syncResearched('DELETE', normalizedMint)
    } catch (error) {
      console.warn('Failed to sync unmarked researched token:', error)
    }
  }, [])

  const toggleResearched = useCallback(
    async (mint: string) => {
      const normalizedMint = mint.trim()
      if (!normalizedMint) return

      if (researchedMints.has(normalizedMint)) {
        await unmarkResearched(normalizedMint)
      } else {
        await markResearched(normalizedMint)
      }
    },
    [markResearched, researchedMints, unmarkResearched]
  )

  return { researchedMints, markResearched, unmarkResearched, toggleResearched, loading }
}
