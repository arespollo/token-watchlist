import { RefreshCw } from './Icons'

interface HeaderProps {
  activeTab: 'watchlist' | 'archive'
  onTabChange: (tab: 'watchlist' | 'archive') => void
  countdown: number
  onRefresh: () => void
  watchlistCount: number
  archiveCount: number
  lastUpdate: Date | null
}

export function Header({
  activeTab,
  onTabChange,
  countdown,
  onRefresh,
  watchlistCount,
  archiveCount,
  lastUpdate,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto px-4 py-3">
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
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-mono font-bold text-gray-300">
                {countdown}
              </div>
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
        <div className="flex gap-1">
          <button
            onClick={() => onTabChange('watchlist')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'watchlist'
                ? 'bg-gray-800 text-gray-100'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Watchlist
            <span className="ml-1.5 text-xs text-gray-500">{watchlistCount}</span>
          </button>
          <button
            onClick={() => onTabChange('archive')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'archive'
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
