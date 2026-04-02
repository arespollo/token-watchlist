import { useState } from 'react'

export interface FilterState {
  mcapMin: string
  mcapMax: string
  ageMin: string  // days
  ageMax: string  // days
}

interface FiltersProps {
  filters: FilterState
  onChange: (f: FilterState) => void
  onClear: () => void
  hasActiveFilter: boolean
}

export const EMPTY_FILTERS: FilterState = {
  mcapMin: '',
  mcapMax: '',
  ageMin: '',
  ageMax: '',
}

export function Filters({ filters, onChange, onClear, hasActiveFilter }: FiltersProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200 transition-colors"
      >
        <span>🔍</span>
        <span>Filters</span>
        {hasActiveFilter && (
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        )}
        <span className="text-[10px]">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-2 flex flex-wrap gap-3 items-end">
          {/* Market Cap filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-gray-500 uppercase tracking-wide">MCap</label>
            <input
              type="text"
              placeholder="Min (e.g. 100k)"
              value={filters.mcapMin}
              onChange={(e) => onChange({ ...filters, mcapMin: e.target.value })}
              className="w-24 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none"
            />
            <span className="text-gray-600 text-xs">—</span>
            <input
              type="text"
              placeholder="Max (e.g. 5m)"
              value={filters.mcapMax}
              onChange={(e) => onChange({ ...filters, mcapMax: e.target.value })}
              className="w-24 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Age filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-gray-500 uppercase tracking-wide">Age (days)</label>
            <input
              type="number"
              placeholder="Min"
              value={filters.ageMin}
              onChange={(e) => onChange({ ...filters, ageMin: e.target.value })}
              className="w-16 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none"
            />
            <span className="text-gray-600 text-xs">—</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.ageMax}
              onChange={(e) => onChange({ ...filters, ageMax: e.target.value })}
              className="w-16 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {hasActiveFilter && (
            <button
              onClick={onClear}
              className="px-2 py-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              ✕ Clear
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Parse "100k" → 100000, "5m" → 5000000, "300000" → 300000
export function parseHumanNumber(s: string): number | null {
  if (!s.trim()) return null
  const cleaned = s.trim().toLowerCase().replace(/[,$]/g, '')
  const match = cleaned.match(/^(\d+(?:\.\d+)?)\s*(k|m|b)?$/)
  if (!match) return null
  const num = parseFloat(match[1])
  const suffix = match[2]
  if (suffix === 'k') return num * 1_000
  if (suffix === 'm') return num * 1_000_000
  if (suffix === 'b') return num * 1_000_000_000
  return num
}
