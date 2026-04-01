import { useState, useCallback } from 'react'
import type { Token, SortField, SortDirection } from '../types/token'
import { formatUsd, formatVolume, formatPercent, formatDate, percentColor } from '../lib/utils'
import { ChevronUp, ChevronDown, Archive, RotateCcw } from './Icons'

interface TokenTableProps {
  tokens: Token[]
  mode: 'watchlist' | 'archive'
  onArchive?: (mint: string) => void
  onRestore?: (mint: string) => void
}

interface Column {
  key: SortField | 'action'
  label: string
  align?: 'left' | 'right'
  render: (token: Token) => React.ReactNode
}

const IMG_FALLBACK =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect fill="%23374151" width="32" height="32" rx="16"/><text x="16" y="21" text-anchor="middle" fill="%239CA3AF" font-size="14">?</text></svg>'

export function TokenTable({ tokens, mode, onArchive, onRestore }: TokenTableProps) {
  const [sortField, setSortField] = useState<SortField>('usd_market_cap')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')
  const [copiedMint, setCopiedMint] = useState<string | null>(null)

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortField(field)
        setSortDir('desc')
      }
    },
    [sortField]
  )

  const handleCopy = useCallback(async (mint: string) => {
    await navigator.clipboard.writeText(mint)
    setCopiedMint(mint)
    setTimeout(() => setCopiedMint(null), 1500)
  }, [])

  const sorted = [...tokens].sort((a, b) => {
    const av = a[sortField]
    const bv = b[sortField]
    if (typeof av === 'string' && typeof bv === 'string') {
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    }
    const an = av as number
    const bn = bv as number
    return sortDir === 'asc' ? an - bn : bn - an
  })

  const columns: Column[] = [
    {
      key: 'action',
      label: '',
      align: 'left',
      render: (t) =>
        mode === 'watchlist' ? (
          <button
            onClick={() => onArchive?.(t.mint)}
            className="p-1.5 rounded-md text-gray-500 hover:text-amber-400 hover:bg-gray-800 transition-colors"
            title="Archive"
          >
            <Archive />
          </button>
        ) : (
          <button
            onClick={() => onRestore?.(t.mint)}
            className="p-1.5 rounded-md text-gray-500 hover:text-emerald-400 hover:bg-gray-800 transition-colors"
            title="Restore"
          >
            <RotateCcw />
          </button>
        ),
    },
    {
      key: 'name',
      label: 'Token',
      align: 'left',
      render: (t) => (
        <div className="flex items-center gap-2 min-w-[160px]">
          <img
            src={t.image_uri}
            alt={t.symbol}
            className="w-7 h-7 rounded-full flex-shrink-0 bg-gray-800"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = IMG_FALLBACK
            }}
            loading="lazy"
          />
          <div className="flex flex-col">
            <a
              href={`https://gmgn.ai/sol/token/${t.mint}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-100 hover:text-blue-400 font-medium transition-colors text-sm leading-tight"
            >
              {t.symbol}
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCopy(t.mint)
              }}
              className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors text-left truncate max-w-[120px]"
              title={`Copy: ${t.mint}`}
            >
              {copiedMint === t.mint ? '✓ Copied' : `${t.mint.slice(0, 6)}...${t.mint.slice(-4)}`}
            </button>
          </div>
        </div>
      ),
    },
    {
      key: 'usd_market_cap',
      label: 'MCap',
      align: 'right',
      render: (t) => <span className="text-yellow-300 font-medium">{formatUsd(t.usd_market_cap)}</span>,
    },
    {
      key: 'ath_market_cap',
      label: 'ATH',
      align: 'right',
      render: (t) => <span className="text-orange-400">{formatUsd(t.ath_market_cap)}</span>,
    },
    {
      key: 'created_timestamp',
      label: 'Created',
      align: 'right',
      render: (t) => <span className="text-gray-500 text-xs">{formatDate(t.created_timestamp)}</span>,
    },
    {
      key: 'price_change_5m',
      label: '5m',
      align: 'right',
      render: (t) => <span className={percentColor(t.price_change_5m)}>{formatPercent(t.price_change_5m)}</span>,
    },
    {
      key: 'price_change_1h',
      label: '1h',
      align: 'right',
      render: (t) => <span className={percentColor(t.price_change_1h)}>{formatPercent(t.price_change_1h)}</span>,
    },
    {
      key: 'price_change_6h',
      label: '6h',
      align: 'right',
      render: (t) => <span className={percentColor(t.price_change_6h)}>{formatPercent(t.price_change_6h)}</span>,
    },
    {
      key: 'price_change_24h',
      label: '24h',
      align: 'right',
      render: (t) => <span className={percentColor(t.price_change_24h)}>{formatPercent(t.price_change_24h)}</span>,
    },
    {
      key: 'volume_5m',
      label: 'Vol 5m',
      align: 'right',
      render: (t) => <span className="text-gray-400">{formatVolume(t.volume_5m)}</span>,
    },
    {
      key: 'volume_1h',
      label: 'Vol 1h',
      align: 'right',
      render: (t) => <span className="text-gray-400">{formatVolume(t.volume_1h)}</span>,
    },
    {
      key: 'volume_6h',
      label: 'Vol 6h',
      align: 'right',
      render: (t) => <span className="text-gray-400">{formatVolume(t.volume_6h)}</span>,
    },
    {
      key: 'volume_24h',
      label: 'Vol 24h',
      align: 'right',
      render: (t) => <span className="text-gray-400">{formatVolume(t.volume_24h)}</span>,
    },
  ]

  if (tokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <span className="text-4xl mb-3">{mode === 'watchlist' ? '📭' : '📦'}</span>
        <p>{mode === 'watchlist' ? 'No tokens found' : 'No archived tokens'}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="token-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.key !== 'action' && handleSort(col.key as SortField)}
                className={col.align === 'right' ? 'text-right' : ''}
              >
                <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                  {col.label}
                  {sortField === col.key && (
                    sortDir === 'asc' ? <ChevronUp /> : <ChevronDown />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((token) => (
            <tr key={token.mint}>
              {columns.map((col) => (
                <td key={col.key} className={col.align === 'right' ? 'text-right' : ''}>
                  {col.render(token)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
