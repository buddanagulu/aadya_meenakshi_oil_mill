import supabaseAdmin from '../../../../../lib/supabaseAdmin'

const ALLOWED_TABLES = [
  'production_logs',
  'shop_inventory',
  'transactions',
  'ledgers',
  'utility_logs',
  'profiles',
]

async function requireAdmin(req: Request) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return { ok: false, status: 401, message: 'Missing access token' }

  const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token as string)
  if (userErr || !userData?.user) return { ok: false, status: 401, message: 'Invalid token' }

  const userId = userData.user.id
  const { data: profile, error: pErr } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (pErr) return { ok: false, status: 500, message: 'Error checking profile' }
  if (!profile || profile.role !== 'ADMIN') return { ok: false, status: 403, message: 'Admin required' }

  return { ok: true, user: userData.user }
}

export async function GET(req: Request, { params }: { params: { table: string; id: string } }) {
  const { table, id } = params
  if (!ALLOWED_TABLES.includes(table)) return new Response('Table not allowed', { status: 400 })

  const auth = await requireAdmin(req)
  if (!auth.ok) return new Response(auth.message, { status: auth.status })

  try {
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('id', id).maybeSingle()
    if (error) return new Response(error.message, { status: 500 })
    return new Response(JSON.stringify({ data }), { status: 200 })
  } catch (e: any) {
    return new Response(String(e?.message ?? e), { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { table: string; id: string } }) {
  const { table, id } = params
  if (!ALLOWED_TABLES.includes(table)) return new Response('Table not allowed', { status: 400 })

  const auth = await requireAdmin(req)
  if (!auth.ok) return new Response(auth.message, { status: auth.status })

  try {
    const body = await req.json()
    const { data, error } = await supabaseAdmin.from(table).update(body).eq('id', id)
    if (error) return new Response(error.message, { status: 500 })
    return new Response(JSON.stringify({ data }), { status: 200 })
  } catch (e: any) {
    return new Response(String(e?.message ?? e), { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { table: string; id: string } }) {
  const { table, id } = params
  if (!ALLOWED_TABLES.includes(table)) return new Response('Table not allowed', { status: 400 })

  const auth = await requireAdmin(req)
  if (!auth.ok) return new Response(auth.message, { status: auth.status })

  try {
    const { data, error } = await supabaseAdmin.from(table).delete().eq('id', id)
    if (error) return new Response(error.message, { status: 500 })
    return new Response(JSON.stringify({ data }), { status: 200 })
  } catch (e: any) {
    return new Response(String(e?.message ?? e), { status: 500 })
  }
}
