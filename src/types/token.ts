export interface Token {
  mint: string
  name: string
  symbol: string
  image_uri: string
  created_timestamp: number
  usd_market_cap: number
  ath_market_cap: number
  price_change_5m: number
  price_change_1h: number
  price_change_6h: number
  price_change_24h: number
  volume_5m: number
  volume_1h: number
  volume_6h: number
  volume_24h: number
}

export type SortField = keyof Pick<
  Token,
  | 'name'
  | 'usd_market_cap'
  | 'ath_market_cap'
  | 'price_change_5m'
  | 'price_change_1h'
  | 'price_change_6h'
  | 'price_change_24h'
  | 'volume_5m'
  | 'volume_1h'
  | 'volume_6h'
  | 'volume_24h'
  | 'created_timestamp'
>

export type SortDirection = 'asc' | 'desc'

export type ActiveView = 'watchlist' | 'archive'
