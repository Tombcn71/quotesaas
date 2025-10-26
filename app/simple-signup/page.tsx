'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SimpleSignup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const supabase = createClient()

      // 1. Signup user - Supabase Auth doet alles
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('No user returned')

      console.log('User created:', authData.user.id)

      // 2. Maak company aan met slug
      const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({ name: company, email, slug })
        .select()
        .single()

      if (companyError) throw companyError
      console.log('Company created:', companyData.id)

      // 3. Link user aan company
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          company_id: companyData.id,
          email,
        })

      if (userError) throw userError
      console.log('User linked to company')

      // 4. Direct inloggen met de credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error('Login failed:', signInError)
        setMessage('✅ Account aangemaakt! Ga naar login om in te loggen.')
        setTimeout(() => window.location.href = '/login', 2000)
        return
      }

      console.log('✅ Logged in successfully, redirecting...')
      setMessage('✅ Success! Redirecting...')
      setTimeout(() => window.location.href = '/dashboard', 500)

    } catch (error: any) {
      setMessage('Error: ' + error.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          
          <Input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        {message && (
          <div className={`p-4 rounded ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

