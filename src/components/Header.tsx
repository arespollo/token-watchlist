import { RefreshCw } from './Icons'
import type { PatternConfig } from '../lib/api'

interface HeaderProps {
  activeView: 'watchlist' | 'archive'
  onViewChange: (view: 'watchlist' | 'archive') => void
  patterns: PatternConfig[]
  activePattern: string
  onPatternChange: (id: string) => void
  countdown: number
  onRefresh: () => void
  watchlistCount: number
  archiveCount: number
  lastUpdate: Date | null
}

export function Header({
  activeView,
  onViewChange,
  patterns,
  activePattern,
  onPatternChange,
  countdown,
  onRefresh,
  watchlistCount,
  archiveCount,
  lastUpdate,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto px-4 py-3">
        {/* Top row: title + refresh */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            Token Watchlist
          </h1>
          <div className="flex items-center gap-3">
            {lastUpdate && (
              <span className="text-xs text-gray-500 hidden sm:inline">
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-mono font-bold text-gray-300">
              {countdown}
            </div>
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
              title="Refresh now"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Pattern tabs */}
        <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
          {patterns.map((p) => (
            <button
              key={p.id}
              onClick={() => onPatternChange(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activePattern === p.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {p.label}
              {p.filterLabel && (
                <span className="ml-1 text-[10px] opacity-70">({p.filterLabel})</span>
              )}
            </button>
          ))}
        </div>

        {/* Watchlist / Archive toggle */}
        <div className="flex gap-1">
          <button
            onClick={() => onViewChange('watchlist')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'watchlist'
                ? 'bg-gray-800 text-gray-100'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Watchlist
            <span className="ml-1.5 text-xs text-gray-500">{watchlistCount}</span>
          </button>
          <button
            onClick={() => onViewChange('archive')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'archive'
                ? 'bg-gray-800 text-gray-100'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Archive
            <span className="ml-1.5 text-xs text-gray-500">{archiveCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
