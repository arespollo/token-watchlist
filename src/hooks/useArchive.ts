import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useArchive() {
  const [archivedMints, setArchivedMints] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  // Load archived mints from Supabase on mount
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('archived_tokens')
        .select('mint')
      if (!error && data) {
        setArchivedMints(new Set(data.map((r) => r.mint)))
      }
      setLoading(false)
    }
    load()
  }, [])

  const archive = useCallback(async (mint: string) => {
    // Instant UI update
    setArchivedMints((prev) => new Set(prev).add(mint))
    // Sync to Supabase
    await supabase.from('archived_tokens').upsert({ mint })
  }, [])

  const restore = useCallback(async (mint: string) => {
    // Instant UI update
    setArchivedMints((prev) => {
      const next = new Set(prev)
      next.delete(mint)
      return next
    })
    // Sync to Supabase
    await supabase.from('archived_tokens').delete().eq('mint', mint)
  }, [])

  return { archivedMints, archive, restore, loading }
}
