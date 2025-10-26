import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's company
  const { data: userData } = await supabase
    .from('users')
    .select('*, companies(*)')
    .eq('id', user.id)
    .single()

  if (!userData || !userData.company_id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Setting up your account...</h2>
          <p className="text-gray-600">Please wait a moment or refresh the page.</p>
        </div>
      </div>
    )
  }

  const company = userData.companies as any

  // Get stats
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('company_id', company.id)

  const { data: recentLeads } = await supabase
    .from('leads')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Calculate stats
  const totalLeads = leads?.length || 0
  const thisMonthLeads = leads?.filter(l => {
    const createdDate = new Date(l.created_at)
    const now = new Date()
    return createdDate.getMonth() === now.getMonth() && 
           createdDate.getFullYear() === now.getFullYear()
  }).length || 0

  const totalRevenue = leads?.reduce((sum, l) => sum + (parseFloat(l.quote_total as any) || 0), 0) || 0
  const avgOrderValue = totalLeads > 0 ? totalRevenue / totalLeads : 0

  const conversionRate = totalLeads > 0 
    ? ((leads?.filter(l => l.status === 'won').length || 0) / totalLeads * 100).toFixed(1)
    : '0'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">{company.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{userData.full_name || userData.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{userData.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="flex items-center text-sm text-green-600 font-medium">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +{thisMonthLeads}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">{totalLeads}</h3>
            <p className="text-sm text-muted-foreground">Totaal Leads</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">
              €{totalRevenue.toLocaleString('nl-NL')}
            </h3>
            <p className="text-sm text-muted-foreground">Totaal Waarde</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">
              €{avgOrderValue.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-sm text-muted-foreground">Gemiddelde Offerte</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">{conversionRate}%</h3>
            <p className="text-sm text-muted-foreground">Conversie Ratio</p>
          </Card>
        </div>

        {/* Subscription Info */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {company.subscription_plan === 'trial' ? '🎉 Trial Periode' : `Plan: ${company.subscription_plan}`}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {company.monthly_quotes_used} / {company.monthly_quote_limit} quotes gebruikt deze maand
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(company.monthly_quotes_used / company.monthly_quote_limit) * 100}%` }}
                />
              </div>
            </div>
            <a 
              href="/dashboard/billing" 
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Upgrade
            </a>
          </div>
        </Card>

        {/* Recent Leads */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Recente Leads</h2>
            <a 
              href="/dashboard/leads" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Bekijk alle →
            </a>
          </div>

          {recentLeads && recentLeads.length > 0 ? (
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div 
                  key={lead.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{lead.naam}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                        lead.status === 'won' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {lead.email} • {lead.aantal_ramen} ramen • {lead.materiaal}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(lead.created_at).toLocaleDateString('nl-NL', { 
                        day: 'numeric', 
                        month: 'short', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      €{parseFloat(lead.quote_total as any).toLocaleString('nl-NL')}
                    </p>
                    <a 
                      href={`/dashboard/leads/${lead.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Details →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nog geen leads</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Plaats je widget op je website om leads te ontvangen
              </p>
              <a 
                href="/dashboard/widgets"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Widget Installeren
              </a>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

