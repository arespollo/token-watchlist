import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'token-watchlist:archived-mints'

function readLocalArchive(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const mints = raw ? (JSON.parse(raw) as string[]) : []
    return new Set(mints.filter((mint) => typeof mint === 'string' && mint.trim()))
  } catch {
    return new Set()
  }
}

function writeLocalArchive(mints: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...mints]))
}

async function syncArchive(method: 'POST' | 'DELETE', mint: string) {
  const res = await fetch('/api/archive', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mint }),
  })
  if (!res.ok) throw new Error(`Archive sync failed: ${res.status}`)
}

export function useArchive() {
  const [archivedMints, setArchivedMints] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const localMints = readLocalArchive()
      setArchivedMints(localMints)

      try {
        const res = await fetch('/api/archive')
        if (!res.ok) throw new Error(`Archive load failed: ${res.status}`)
        const data = (await res.json()) as { mints?: string[] }
        const remoteMints = new Set((data.mints || []).filter((mint) => typeof mint === 'string' && mint.trim()))
        setArchivedMints(remoteMints)
        writeLocalArchive(remoteMints)
      } catch (error) {
        console.warn('Using local archive fallback:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const archive = useCallback(async (mint: string) => {
    const normalizedMint = mint.trim()
    if (!normalizedMint) return

    setArchivedMints((prev) => {
      const next = new Set(prev).add(normalizedMint)
      writeLocalArchive(next)
      return next
    })

    try {
      await syncArchive('POST', normalizedMint)
    } catch (error) {
      console.warn('Failed to sync archived token:', error)
    }
  }, [])

  const restore = useCallback(async (mint: string) => {
    const normalizedMint = mint.trim()
    if (!normalizedMint) return

    setArchivedMints((prev) => {
      const next = new Set(prev)
      next.delete(normalizedMint)
      writeLocalArchive(next)
      return next
    })

    try {
      await syncArchive('DELETE', normalizedMint)
    } catch (error) {
      console.warn('Failed to sync restored token:', error)
    }
  }, [])

  return { archivedMints, archive, restore, loading }
}
