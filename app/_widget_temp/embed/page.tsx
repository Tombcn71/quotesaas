"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AIQuoteForm } from '@/components/ai-quote-form'
import { Loader2 } from 'lucide-react'

function WidgetEmbedContent() {
  const searchParams = useSearchParams()
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const companyId = searchParams.get('companyId')
  const widgetKey = searchParams.get('widgetKey')
  const mode = searchParams.get('mode') || 'modal'
  const primaryColor = searchParams.get('primaryColor') || '#2563eb'
  const secondaryColor = searchParams.get('secondaryColor') || '#1e40af'
  const showLogo = searchParams.get('showLogo') !== 'false'

  useEffect(() => {
    // Load widget configuration from API
    async function loadConfig() {
      if (!companyId && !widgetKey) {
        setLoading(false)
        return
      }

      try {
        const params = new URLSearchParams()
        if (companyId) params.append('companyId', companyId)
        if (widgetKey) params.append('widgetKey', widgetKey)

        const response = await fetch(`/api/widgets/config?${params.toString()}`)
        const data = await response.json()

        if (data.success) {
          setConfig(data.config)
          
          // Apply custom branding
          if (data.config.primary_color) {
            document.documentElement.style.setProperty('--primary', data.config.primary_color)
          }
          if (data.config.secondary_color) {
            document.documentElement.style.setProperty('--secondary', data.config.secondary_color)
          }

          // Track widget view
          fetch('/api/widgets/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              widgetKey: widgetKey || data.config.widget_key,
              companyId: companyId || data.config.company_id,
              event: 'widget_loaded',
              data: {
                mode,
                referrer: document.referrer,
              },
            }),
          }).catch(() => {})
        }
      } catch (error) {
        console.error('Failed to load widget config:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [companyId, widgetKey, mode])

  // Handle close message to parent
  const closeWidget = () => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'kozijn_widget_close' }, '*')
    }
  }

  // Notify parent of height changes (for inline mode)
  useEffect(() => {
    if (mode === 'inline' && window.parent !== window) {
      const observer = new ResizeObserver(() => {
        const height = document.documentElement.scrollHeight
        window.parent.postMessage(
          { type: 'kozijn_widget_resize', data: { height } },
          '*'
        )
      })
      observer.observe(document.body)
      return () => observer.disconnect()
    }
  }, [mode])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm text-muted-foreground">Widget laden...</p>
        </div>
      </div>
    )
  }

  if (!companyId && !widgetKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-foreground mb-2">Widget Configuratie Ontbreekt</h2>
          <p className="text-sm text-muted-foreground">
            Deze widget mist een company ID of widget key. Controleer je embed code.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with company branding */}
        {config && config.show_logo && config.company_logo && (
          <div className="mb-6 text-center">
            <img 
              src={config.company_logo} 
              alt={config.company_name || 'Company Logo'}
              className="h-12 mx-auto mb-2"
            />
            <h1 className="text-2xl font-bold text-foreground">
              {config.company_name || 'Raamkozijnen Offerte'}
            </h1>
          </div>
        )}

        {/* AI Quote Form */}
        <AIQuoteForm 
          companyId={companyId || config?.company_id} 
          className="shadow-none border-0"
        />

        {/* Footer */}
        {config && config.company_name && (
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>
              Aangedreven door{' '}
              <a 
                href="https://kozijnsaas.nl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                KozijnSaaS
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function WidgetEmbedPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <WidgetEmbedContent />
    </Suspense>
  )
}

