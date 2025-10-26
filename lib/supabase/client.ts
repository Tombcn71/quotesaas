import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Helper function to get current user's company
export async function getCurrentUserCompany() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: userData } = await supabase
    .from('users')
    .select('company_id, role, companies(*)')
    .eq('id', user.id)
    .single()
  
  return userData
}

// Helper to check if user has reached quote limit
export async function checkQuoteLimit(companyId: string): Promise<boolean> {
  const { data: company } = await supabase
    .from('companies')
    .select('monthly_quote_limit, monthly_quotes_used')
    .eq('id', companyId)
    .single()
  
  if (!company) return false
  
  return company.monthly_quotes_used < company.monthly_quote_limit
}

// Increment quote usage
export async function incrementQuoteUsage(companyId: string) {
  const { data: company } = await supabase
    .from('companies')
    .select('monthly_quotes_used')
    .eq('id', companyId)
    .single()
  
  if (!company) return
  
  await supabase
    .from('companies')
    .update({ monthly_quotes_used: company.monthly_quotes_used + 1 })
    .eq('id', companyId)
}

