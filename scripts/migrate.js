const fs = require('fs')
const { Client } = require('pg')

async function run() {
  const sqlPath = 'db/schema.sql'
  if (!fs.existsSync(sqlPath)) {
    console.error('Missing db/schema.sql')
    process.exit(1)
  }

  const raw = fs.readFileSync(sqlPath, 'utf8')

  // Split into individual statements; we'll execute them one-by-one and skip CREATE POLICY when present.
  const statements = raw
    .split(/;\s*\n/) // split on semicolon + newline
    .map((s) => s.trim())
    .filter(Boolean)

  // Use DATABASE_URL env var
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('Please set DATABASE_URL environment variable (postgres connection string).')
    process.exit(1)
  }

  const client = new Client({ connectionString: databaseUrl })
  try {
    await client.connect()
    console.log('Connected to database, running migrations...')
    for (const stmt of statements) {
      const lower = stmt.toLowerCase()
      try {
        if (lower.startsWith('create policy')) {
          // extract policy name using regex
          const m = stmt.match(/create policy\s+"?([^"\s]+)"?/i)
          const policyName = m ? m[1] : null
          if (policyName) {
            const existsRes = await client.query("select 1 from pg_policies where policyname = $1", [policyName])
            if (existsRes.rowCount > 0) {
              console.log(`Skipping existing policy: ${policyName}`)
              continue
            }
          }
        }

        await client.query(stmt + ';')
      } catch (err) {
        // ignore 'policy already exists' errors and report others
        if (err && err.code === '42710') {
          console.log('Ignored exists error for statement:', stmt.split('\n')[0])
          continue
        }
        throw err
      }
    }

    console.log('Migration applied successfully.')
  } catch (e) {
    console.error('Migration failed:', e.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

run()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
