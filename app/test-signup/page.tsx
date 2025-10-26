"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

export default function TestSignupPage() {
  const [log, setLog] = useState<string[]>([])
  
  const addLog = (msg: string) => {
    console.log(msg)
    setLog(prev => [...prev, msg])
  }

  const testSignup = async () => {
    setLog([])
    addLog('🚀 Starting test signup...')

    try {
      // Test 1: Auth signup
      addLog('1️⃣ Creating auth user...')
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `test${Date.now()}@test.com`,
        password: 'test123456',
      })
      
      if (authError) {
        addLog(`❌ Auth error: ${authError.message}`)
        return
      }
      addLog(`✅ Auth user created: ${authData.user?.id}`)

      // Test 2: Create company
      addLog('2️⃣ Creating company...')
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: 'Test Company',
          slug: `test-${Date.now()}`,
          email: authData.user?.email,
          subscription_status: 'trial',
          subscription_plan: 'starter',
        })
        .select()
        .single()

      if (companyError) {
        addLog(`❌ Company error: ${companyError.message}`)
        return
      }
      addLog(`✅ Company created: ${company.id}`)

      // Test 3: Create user record
      addLog('3️⃣ Creating user record...')
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user!.id,
          company_id: company.id,
          email: authData.user!.email,
          role: 'owner',
        })

      if (userError) {
        addLog(`❌ User error: ${userError.message}`)
        return
      }
      addLog(`✅ User record created`)

      addLog('🎉 SUCCESS! Everything works!')
      addLog('Now go to /signup and it should work')

    } catch (err: any) {
      addLog(`💥 Error: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">🔧 Signup Test</h1>
        
        <Button onClick={testSignup} className="mb-6">
          Test Signup Flow
        </Button>

        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm space-y-1 max-h-96 overflow-auto">
          {log.length === 0 ? (
            <div>Click button to test...</div>
          ) : (
            log.map((line, i) => <div key={i}>{line}</div>)
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded">
          <p className="text-sm">
            <strong>This tests:</strong> Auth signup → Company creation → User linking
          </p>
          <p className="text-sm mt-2">
            If all ✅ then <a href="/signup" className="text-blue-600 underline">/signup</a> will work
          </p>
        </div>
      </Card>
    </div>
  )
}

