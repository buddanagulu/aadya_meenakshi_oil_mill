import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !serviceRole) {
  // Intentionally do not throw here — environment may be configured later.
}

const supabaseAdmin = createClient(supabaseUrl, serviceRole, {
  auth: { persistSession: false },
})

export default supabaseAdmin
