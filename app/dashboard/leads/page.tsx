import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Phone, 
  Calendar,
  Filter,
  Download,
  Search,
} from 'lucide-react'

export default async function LeadsPage() {
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

  // Get all leads
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700 border-blue-200',
    contacted: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    qualified: 'bg-purple-100 text-purple-700 border-purple-200',
    proposal_sent: 'bg-orange-100 text-orange-700 border-orange-200',
    won: 'bg-green-100 text-green-700 border-green-200',
    lost: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  const statusLabels: Record<string, string> = {
    new: 'Nieuw',
    contacted: 'Gecontacteerd',
    qualified: 'Gekwalificeerd',
    proposal_sent: 'Offerte Verstuurd',
    won: 'Gewonnen',
    lost: 'Verloren',
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Leads</h1>
              <p className="text-sm text-muted-foreground">
                {leads?.length || 0} totaal
              </p>
            </div>
            <div className="flex gap-3">
              <a href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                ← Terug naar Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters (TODO: maken deze functioneel) */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Zoek op naam, email..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filteren
            </button>
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exporteren
            </button>
          </div>
        </Card>

        {/* Leads Table */}
        <Card className="overflow-hidden">
          {leads && leads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                      Klant
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                      Specificaties
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                      Offerte
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                      Datum
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                      Acties
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-foreground">{lead.naam}</p>
                          <div className="flex flex-col gap-1 mt-1">
                            <a 
                              href={`mailto:${lead.email}`}
                              className="text-sm text-muted-foreground hover:text-blue-600 flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </a>
                            {lead.telefoon && (
                              <a 
                                href={`tel:${lead.telefoon}`}
                                className="text-sm text-muted-foreground hover:text-blue-600 flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" />
                                {lead.telefoon}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p className="font-medium text-foreground">
                            {lead.aantal_ramen} {lead.materiaal} ramen
                          </p>
                          <p className="text-muted-foreground">
                            {lead.kleur} • {lead.kozijn_type}
                          </p>
                          <p className="text-muted-foreground">
                            {lead.glas_type}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-lg font-bold text-foreground">
                          €{parseFloat(lead.quote_total as any).toLocaleString('nl-NL')}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {lead.montage && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                              Montage
                            </span>
                          )}
                          {lead.afvoer_oude_kozijnen && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                              Afvoer
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[lead.status]}`}>
                          {statusLabels[lead.status] || lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(lead.created_at).toLocaleDateString('nl-NL', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(lead.created_at).toLocaleTimeString('nl-NL', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <a
                          href={`/dashboard/leads/${lead.id}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Details →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nog geen leads
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Installeer je widget om leads te ontvangen
              </p>
              <a
                href="/dashboard/widgets"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
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

