import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const companyId = searchParams.get('companyId')
    const widgetKey = searchParams.get('widgetKey')

    if (!companyId && !widgetKey) {
      return NextResponse.json(
        { error: 'Ontbrekende company ID of widget key' },
        { status: 400 }
      )
    }

    // Query widget & company data
    let query = supabase
      .from('widgets')
      .select(`
        *,
        companies (
          id,
          name,
          logo_url,
          primary_color,
          secondary_color,
          is_active,
          subscription_status
        )
      `)
      .eq('is_active', true)
      .single()

    if (widgetKey) {
      query = query.eq('widget_key', widgetKey)
    } else if (companyId) {
      query = query.eq('company_id', companyId)
    }

    const { data: widget, error } = await query

    if (error || !widget) {
      console.error('Widget niet gevonden:', error)
      return NextResponse.json(
        { error: 'Widget niet gevonden' },
        { status: 404 }
      )
    }

    // Check if company is active
    const company = widget.companies as any
    if (!company || !company.is_active) {
      return NextResponse.json(
        { error: 'Bedrijf is niet actief' },
        { status: 403 }
      )
    }

    if (company.subscription_status !== 'active' && company.subscription_status !== 'trial') {
      return NextResponse.json(
        { error: 'Abonnement is niet actief' },
        { status: 403 }
      )
    }

    // Return widget config
    return NextResponse.json({
      success: true,
      config: {
        widget_key: widget.widget_key,
        company_id: widget.company_id,
        company_name: company.name,
        company_logo: company.logo_url,
        primary_color: widget.primary_color || company.primary_color,
        secondary_color: widget.secondary_color || company.secondary_color,
        show_logo: widget.show_logo,
        button_text: widget.button_text,
        display_mode: widget.display_mode,
        position: widget.position,
        collect_email: widget.collect_email,
        collect_phone: widget.collect_phone,
        require_phone: widget.require_phone,
        custom_pricing: widget.custom_pricing,
      },
    })

  } catch (error: any) {
    console.error('Widget config error:', error)
    return NextResponse.json(
      { error: 'Server fout', details: error.message },
      { status: 500 }
    )
  }
}

