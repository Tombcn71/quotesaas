'use client'

import AIQuoteForm from '@/components/ai-quote-form'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Kozijn Quote Demo</h1>
          <p className="text-lg text-gray-600">Upload foto's van je ramen en krijg direct een offerte + AI preview</p>
        </div>
        
        <AIQuoteForm />
      </div>
    </div>
  )
}

