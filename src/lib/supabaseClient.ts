import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let supabase: any
if (supabaseUrl && supabaseAnonKey) {
	supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
	// Fallback stub for local/dev when env vars are missing to avoid runtime crash.
	// Methods implemented are minimal and return safe defaults used by the UI.
	// Replace with a real client by setting NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
	// eslint-disable-next-line no-console
	console.warn('NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set — using fallback supabase stub')

	supabase = {
		auth: {
			getSession: async () => ({ data: { session: null } }),
			onAuthStateChange: (_fn: any) => ({ subscription: { unsubscribe: () => {} } }),
			signInWithOtp: async () => ({ error: null }),
			signInWithPassword: async () => ({ error: null }),
			signOut: async () => ({ error: null }),
			signUp: async () => ({ error: null }),
		},
		from: (_table: string) => ({
			select: async (_q?: any, _opts?: any) => ({ data: [], error: null, count: 0 }),
			insert: async (_d: any) => ({ data: [], error: null }),
			update: async (_d: any) => ({ data: [], error: null }),
			delete: async () => ({ data: [], error: null }),
		}),
	}
}

export default supabase
