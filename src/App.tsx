import { useState, useMemo } from 'react'
import { Header } from './components/Header'
import { TokenTable } from './components/TokenTable'
import { useTokens } from './hooks/useTokens'
import { useArchive } from './hooks/useArchive'

function App() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'archive'>('watchlist')
  const { tokens, loading, error, countdown, lastUpdate, refresh } = useTokens()
  const { archivedMints, archive, restore, loading: archiveLoading } = useArchive()

  const watchlistTokens = useMemo(
    () => tokens.filter((t) => !archivedMints.has(t.mint)),
    [tokens, archivedMints]
  )

  const archivedTokens = useMemo(
    () => tokens.filter((t) => archivedMints.has(t.mint)),
    [tokens, archivedMints]
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        countdown={countdown}
        onRefresh={refresh}
        watchlistCount={watchlistTokens.length}
        archiveCount={archivedTokens.length}
        lastUpdate={lastUpdate}
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
            {activeTab === 'watchlist' && (
              <TokenTable tokens={watchlistTokens} mode="watchlist" onArchive={archive} />
            )}
            {activeTab === 'archive' && (
              <TokenTable tokens={archivedTokens} mode="archive" onRestore={restore} />
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
