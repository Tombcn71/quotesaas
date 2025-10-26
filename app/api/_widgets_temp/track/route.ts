import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { widgetKey, companyId, event, data } = body

    if (!widgetKey && !companyId) {
      return NextResponse.json(
        { error: 'Ontbrekende widget key of company ID' },
        { status: 400 }
      )
    }

    // Find widget
    let query = supabase
      .from('widgets')
      .select('id, company_id')

    if (widgetKey) {
      query = query.eq('widget_key', widgetKey)
    } else {
      query = query.eq('company_id', companyId)
    }

    const { data: widgets } = await query.limit(1).single()

    if (!widgets) {
      // Silently fail for tracking
      return NextResponse.json({ success: true })
    }

    const widgetId = widgets.id
    const actualCompanyId = widgets.company_id

    // Update widget stats based on event
    if (event === 'widget_view') {
      await supabase
        .from('widgets')
        .update({ views: supabase.raw('views + 1') })
        .eq('id', widgetId)
    } else if (event === 'widget_interaction') {
      await supabase
        .from('widgets')
        .update({ interactions: supabase.raw('interactions + 1') })
        .eq('id', widgetId)
    } else if (event === 'widget_conversion') {
      await supabase
        .from('widgets')
        .update({ conversions: supabase.raw('conversions + 1') })
        .eq('id', widgetId)
    }

    // Log activity
    await supabase
      .from('activity_log')
      .insert({
        company_id: actualCompanyId,
        action: event,
        entity_type: 'widget',
        entity_id: widgetId,
        details: data,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent'),
      })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Widget tracking error:', error)
    // Silently fail for tracking
    return NextResponse.json({ success: true })
  }
}

