import type { Token } from '../types/token'

const PAGE_SIZE = 1000

async function fetchPage(
  offset: number,
  mcapMin: number,
  mcapMax: number,
  daysBack: number
): Promise<Token[]> {
  const now = Date.now()
  const after = now - daysBack * 24 * 60 * 60 * 1000
  const params = new URLSearchParams({
    marketCapMin: mcapMin.toString(),
    marketCapMax: mcapMax.toString(),
    limit: PAGE_SIZE.toString(),
    offset: offset.toString(),
    includeNsfw: 'false',
    sortBy: 'created_timestamp',
    sortOrder: 'ASC',
    createdAfter: after.toString(),
    createdBefore: now.toString(),
  })

  const res = await fetch(`/api/pump/homepage-cache/search?${params}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return (await res.json()) as Token[]
}

export async function fetchTokens(
  mcapMin: number,
  mcapMax: number,
  daysBack: number
): Promise<Token[]> {
  const all: Token[] = []
  let offset = 0

  while (true) {
    const page = await fetchPage(offset, mcapMin, mcapMax, daysBack)
    all.push(...page)
    if (page.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  // Filter out tokens with mint ending in "bags"
  return all.filter((t) => !t.mint.toLowerCase().endsWith('bags'))
}

export interface PatternConfig {
  id: string
  label: string
  mcapMin: number
  mcapMax: number
  daysBack: number
  // Client-side post-filter
  filter?: (t: Token) => boolean
  filterLabel?: string
}

export const PATTERNS: PatternConfig[] = [
  {
    id: 'p1',
    label: 'Pattern 1',
    mcapMin: 100_000,
    mcapMax: 600_000,
    daysBack: 90,
    filter: (t) => t.ath_market_cap >= 900_000,
    filterLabel: 'ATH ≥ 900K',
  },
  {
    id: 'p2',
    label: 'Pattern 2',
    mcapMin: 100_000,
    mcapMax: 600_000,
    daysBack: 30,
    filter: (t) => t.ath_market_cap < 900_000,
    filterLabel: 'ATH < 900K',
  },
  {
    id: 'p3',
    label: 'Pattern 3',
    mcapMin: 1_000_000,
    mcapMax: 10_000_000,
    daysBack: 90,
  },
  {
    id: 'p4',
    label: 'Pattern 4',
    mcapMin: 10_000_000,
    mcapMax: 1_000_000_000,
    daysBack: 120,
    filter: (t) => t.ath_market_cap >= 30_000_000,
    filterLabel: 'ATH ≥ 30M',
  },
]
