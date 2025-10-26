import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Code, Copy, Eye, MousePointerClick, TrendingUp } from 'lucide-react'

export default async function WidgetsPage() {
  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get user's company
  const { data: userData } = await supabase
    .from('users')
    .select('*, companies(*)')
    .eq('id', user.id)
    .single()

  if (!userData || !userData.company_id) redirect('/onboarding')

  const company = userData.companies as any

  // Get or create default widget
  let { data: widget } = await supabase
    .from('widgets')
    .select('*')
    .eq('company_id', company.id)
    .eq('is_active', true)
    .single()

  // Create widget if doesn't exist
  if (!widget) {
    const widgetKey = `wid_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
    
    const { data: newWidget } = await supabase
      .from('widgets')
      .insert({
        company_id: company.id,
        widget_key: widgetKey,
        name: 'Hoofd Widget',
        display_mode: 'floating_button',
        position: 'bottom-right',
        button_text: 'Gratis Offerte',
        is_active: true,
      })
      .select()
      .single()

    widget = newWidget
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const widgetUrl = `${baseUrl}/widget.js`
  
  const embedCode = `<!-- KozijnSaaS Widget -->
<script 
  src="${widgetUrl}" 
  data-company-id="${company.id}"
  data-widget-key="${widget?.widget_key}"
></script>`

  const testUrl = `${baseUrl}/widget/embed?companyId=${company.id}&widgetKey=${widget?.widget_key}&mode=modal`

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Widget</h1>
              <p className="text-sm text-muted-foreground">
                Plaats op je website om leads te ontvangen
              </p>
            </div>
            <a href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              ← Terug naar Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{widget?.views || 0}</p>
                <p className="text-sm text-muted-foreground">Views</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MousePointerClick className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{widget?.interactions || 0}</p>
                <p className="text-sm text-muted-foreground">Clicks</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{widget?.conversions || 0}</p>
                <p className="text-sm text-muted-foreground">Conversies</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Embed Code */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Installatie Code</h2>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Kopieer deze code en plak het voor de <code className="px-2 py-1 bg-muted rounded text-xs">&lt;/body&gt;</code> tag in je HTML:
          </p>

          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{embedCode}</code>
            </pre>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(embedCode)
                alert('✅ Code gekopieerd!')
              }}
              className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Kopieer code"
            >
              <Copy className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">📝 Installatie stappen:</h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Kopieer de bovenstaande code</li>
              <li>Open je website HTML of template</li>
              <li>Plak de code vlak voor de <code className="px-1 py-0.5 bg-white rounded text-xs">&lt;/body&gt;</code> tag</li>
              <li>Sla op en test je website</li>
            </ol>
          </div>
        </Card>

        {/* Test Widget */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Test Widget</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Test hoe de widget eruit ziet voordat je hem op je website plaatst:
          </p>
          <a
            href={testUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Open Test Widget →
          </a>
        </Card>

        {/* Widget Instellingen */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Widget Instellingen</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Widget Key
              </label>
              <code className="block px-4 py-2 bg-muted rounded-lg text-sm font-mono">
                {widget?.widget_key}
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Deze key identificeert je widget uniek
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Display Mode
              </label>
              <p className="text-sm text-muted-foreground">
                {widget?.display_mode === 'floating_button' && '🎯 Floating Button (rechtsonder)'}
                {widget?.display_mode === 'popup' && '🪟 Popup (overlay)'}
                {widget?.display_mode === 'inline' && '📄 Inline (in pagina)'}
                {widget?.display_mode === 'sidebar' && '📊 Sidebar (zijkant)'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Button Text
              </label>
              <p className="text-sm text-muted-foreground">
                "{widget?.button_text}"
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
              Instellingen Aanpassen
            </button>
            <p className="text-xs text-muted-foreground mt-2">
              Binnenkort: Pas kleuren, positie en gedrag aan
            </p>
          </div>
        </Card>

        {/* Platform Guides */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Platform Handleidingen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">WordPress</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Plak de code in je theme footer.php of gebruik een plugin zoals "Insert Headers and Footers"
              </p>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Lees handleiding →
              </a>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Shopify</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Theme → Edit code → theme.liquid → Plak voor &lt;/body&gt;
              </p>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Lees handleiding →
              </a>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Webflow</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Project Settings → Custom Code → Footer Code
              </p>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Lees handleiding →
              </a>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Custom HTML</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Plak direct in je HTML bestand voor de &lt;/body&gt; tag
              </p>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Lees handleiding →
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

