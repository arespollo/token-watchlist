export function formatUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  if (value >= 1) return `$${value.toFixed(2)}`
  if (value > 0) return `$${value.toFixed(4)}`
  return '$0'
}

export function formatVolume(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  if (value >= 1) return value.toFixed(2)
  if (value > 0) return value.toFixed(4)
  return '0'
}

export function formatPercent(value: number): string {
  if (value === 0) return '0%'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatDate(timestampMs: number): string {
  const d = new Date(timestampMs)
  return d.toISOString().slice(0, 10)
}

export function percentColor(value: number): string {
  if (value > 0) return 'text-emerald-400'
  if (value < 0) return 'text-red-400'
  return 'text-gray-500'
}

// Market cap color tiers
export function mcapColor(value: number): string {
  if (value >= 10_000_000) return 'text-fuchsia-400 font-semibold'       // 10M+ — purple/pink
  if (value >= 3_000_000) return 'text-rose-400 font-medium'             // 3M-10M — rose
  if (value >= 1_000_000) return 'text-orange-400 font-medium'           // 1M-3M — orange
  if (value >= 600_000) return 'text-amber-400'                          // 600K-1M — amber
  return 'text-yellow-300'                                                // 100K-600K — yellow
}

// Creation time color — how recent
export function ageColor(timestampMs: number): string {
  const daysAgo = (Date.now() - timestampMs) / (24 * 60 * 60 * 1000)
  if (daysAgo <= 3) return 'text-emerald-400 font-medium'    // very fresh
  if (daysAgo <= 7) return 'text-teal-400'                    // fresh
  if (daysAgo <= 30) return 'text-sky-400'                    // recent
  if (daysAgo <= 90) return 'text-gray-400'                   // moderate
  return 'text-gray-600'                                       // old
}

export function daysAgo(ms: number): number {
  return Math.floor((Date.now() - ms) / (24 * 60 * 60 * 1000))
}
