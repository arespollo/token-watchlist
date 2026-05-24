import { neon } from '@neondatabase/serverless'

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!url) throw new Error('DATABASE_URL is not configured')
  return url.replace(/^"|"$/g, '')
}

const sql = neon(getDatabaseUrl())

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS archived_tokens (
      mint TEXT PRIMARY KEY,
      archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

function getMint(req) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  const mint = typeof body.mint === 'string' ? body.mint.trim() : ''
  if (!mint) throw new Error('mint is required')
  return mint
}

export default async function handler(req, res) {
  try {
    await ensureTable()

    if (req.method === 'GET') {
      const rows = await sql`SELECT mint FROM archived_tokens ORDER BY archived_at DESC`
      return res.status(200).json({ mints: rows.map((row) => row.mint) })
    }

    if (req.method === 'POST') {
      const mint = getMint(req)
      await sql`
        INSERT INTO archived_tokens (mint)
        VALUES (${mint})
        ON CONFLICT (mint) DO UPDATE SET archived_at = NOW()
      `
      return res.status(200).json({ ok: true })
    }

    if (req.method === 'DELETE') {
      const mint = getMint(req)
      await sql`DELETE FROM archived_tokens WHERE mint = ${mint}`
      return res.status(200).json({ ok: true })
    }

    res.setHeader('Allow', 'GET, POST, DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Archive API error' })
  }
}
