export interface FilterState {
  mcapMin: string
  mcapMax: string
  ageMin: string // days
  ageMax: string // days
}

export const EMPTY_FILTERS: FilterState = {
  mcapMin: '',
  mcapMax: '',
  ageMin: '',
  ageMax: '',
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
