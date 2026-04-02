import type { Token } from '../types/token'

const PAGE_SIZE = 1000

function ninetyDaysAgoMs(): number {
  return Date.now() - 90 * 24 * 60 * 60 * 1000
}

async function fetchPage(offset: number): Promise<Token[]> {
  const now = Date.now()
  const after = ninetyDaysAgoMs()
  const params = new URLSearchParams({
    marketCapMin: '100000',
    marketCapMax: '500000',
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

export async function fetchTokens(): Promise<Token[]> {
  const all: Token[] = []
  let offset = 0

  while (true) {
    const page = await fetchPage(offset)
    all.push(...page)
    if (page.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  return all
}
