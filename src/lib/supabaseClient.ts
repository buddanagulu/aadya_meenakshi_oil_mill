import { createBrowserClient } from '@supabase/ssr';

// REPLACE THESE WITH YOUR REAL SUPABASE KEYS LATER OR USE ENV VAIRS
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
