import { useState, useMemo, useCallback } from 'react'
import { Header } from './components/Header'
import { TokenTable } from './components/TokenTable'
import { Filters, type FilterState, EMPTY_FILTERS, parseHumanNumber } from './components/Filters'
import { useTokens } from './hooks/useTokens'
import { useArchive } from './hooks/useArchive'
import { PATTERNS } from './lib/api'
import { daysAgo } from './lib/utils'

function App() {
  const [activeView, setActiveView] = useState<'watchlist' | 'archive'>('watchlist')
  const [activePatternId, setActivePatternId] = useState(PATTERNS[0].id)
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)

  const activePattern = PATTERNS.find((p) => p.id === activePatternId) || PATTERNS[0]
  const { tokens, loading, error, countdown, lastUpdate, refresh } = useTokens(activePattern)
  const { archivedMints, archive, restore, loading: archiveLoading } = useArchive()

  const hasActiveFilter = !!(filters.mcapMin || filters.mcapMax || filters.ageMin || filters.ageMax)

  const applyFilters = useCallback(
    (list: typeof tokens) => {
      if (!hasActiveFilter) return list
      return list.filter((t) => {
        const mcMin = parseHumanNumber(filters.mcapMin)
        const mcMax = parseHumanNumber(filters.mcapMax)
        const ageMinD = filters.ageMin ? parseInt(filters.ageMin) : null
        const ageMaxD = filters.ageMax ? parseInt(filters.ageMax) : null
        const age = daysAgo(t.created_timestamp)

        if (mcMin !== null && t.usd_market_cap < mcMin) return false
        if (mcMax !== null && t.usd_market_cap > mcMax) return false
        if (ageMinD !== null && age < ageMinD) return false
        if (ageMaxD !== null && age > ageMaxD) return false
        return true
      })
    },
    [filters, hasActiveFilter]
  )

  const watchlistTokens = useMemo(
    () => applyFilters(tokens.filter((t) => !archivedMints.has(t.mint))),
    [tokens, archivedMints, applyFilters]
  )

  const archivedTokens = useMemo(
    () => applyFilters(tokens.filter((t) => archivedMints.has(t.mint))),
    [tokens, archivedMints, applyFilters]
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        patterns={PATTERNS}
        activePattern={activePatternId}
        onPatternChange={setActivePatternId}
        countdown={countdown}
        onRefresh={refresh}
        watchlistCount={watchlistTokens.length}
        archiveCount={archivedTokens.length}
        lastUpdate={lastUpdate}
      />

      <Filters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
        hasActiveFilter={hasActiveFilter}
      />

      <main className="max-w-[1600px] mx-auto">
        {(loading || archiveLoading) && tokens.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
              Loading tokens...
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-4xl mb-3">⚠️</span>
            <p className="text-red-400 mb-2">{error}</p>
            <button
              onClick={refresh}
              className="text-sm text-gray-400 hover:text-gray-200 underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {activeView === 'watchlist' && (
              <TokenTable tokens={watchlistTokens} mode="watchlist" onArchive={archive} />
            )}
            {activeView === 'archive' && (
              <TokenTable tokens={archivedTokens} mode="archive" onRestore={restore} />
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
