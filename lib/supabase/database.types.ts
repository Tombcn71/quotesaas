export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          email: string
          phone: string | null
          website: string | null
          logo_url: string | null
          primary_color: string
          secondary_color: string
          kvk_number: string | null
          btw_number: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          subscription_status: 'trial' | 'active' | 'past_due' | 'cancelled' | 'paused'
          subscription_plan: 'starter' | 'pro' | 'enterprise'
          subscription_started_at: string | null
          subscription_ends_at: string | null
          trial_ends_at: string | null
          monthly_quote_limit: number
          monthly_quotes_used: number
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          is_active: boolean
          onboarding_completed: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          email: string
          phone?: string | null
          website?: string | null
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          kvk_number?: string | null
          btw_number?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          subscription_status?: 'trial' | 'active' | 'past_due' | 'cancelled' | 'paused'
          subscription_plan?: 'starter' | 'pro' | 'enterprise'
          subscription_started_at?: string | null
          subscription_ends_at?: string | null
          trial_ends_at?: string | null
          monthly_quote_limit?: number
          monthly_quotes_used?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          is_active?: boolean
          onboarding_completed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          email?: string
          phone?: string | null
          website?: string | null
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          kvk_number?: string | null
          btw_number?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          subscription_status?: 'trial' | 'active' | 'past_due' | 'cancelled' | 'paused'
          subscription_plan?: 'starter' | 'pro' | 'enterprise'
          subscription_started_at?: string | null
          subscription_ends_at?: string | null
          trial_ends_at?: string | null
          monthly_quote_limit?: number
          monthly_quotes_used?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          is_active?: boolean
          onboarding_completed?: boolean
        }
      }
      users: {
        Row: {
          id: string
          company_id: string | null
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'owner' | 'admin' | 'member'
          is_active: boolean
          last_login_at: string | null
        }
        Insert: {
          id: string
          company_id?: string | null
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'owner' | 'admin' | 'member'
          is_active?: boolean
          last_login_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string | null
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'owner' | 'admin' | 'member'
          is_active?: boolean
          last_login_at?: string | null
        }
      }
      leads: {
        Row: {
          id: string
          company_id: string | null
          created_at: string
          updated_at: string
          naam: string
          email: string
          telefoon: string | null
          materiaal: string
          kleur: string
          kozijn_type: string
          glas_type: string
          aantal_ramen: number
          vierkante_meter_ramen: string | null
          montage: boolean
          afvoer_oude_kozijnen: boolean
          quote_total: number
          quote_breakdown: Json | null
          photo_urls: string[] | null
          preview_urls: string[] | null
          status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost'
          assigned_to: string | null
          notes: string | null
          source: string
          widget_referrer: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          last_contacted_at: string | null
          next_follow_up_at: string | null
        }
        Insert: {
          id?: string
          company_id?: string | null
          created_at?: string
          updated_at?: string
          naam: string
          email: string
          telefoon?: string | null
          materiaal: string
          kleur: string
          kozijn_type: string
          glas_type: string
          aantal_ramen: number
          vierkante_meter_ramen?: string | null
          montage?: boolean
          afvoer_oude_kozijnen?: boolean
          quote_total: number
          quote_breakdown?: Json | null
          photo_urls?: string[] | null
          preview_urls?: string[] | null
          status?: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost'
          assigned_to?: string | null
          notes?: string | null
          source?: string
          widget_referrer?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          last_contacted_at?: string | null
          next_follow_up_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string | null
          created_at?: string
          updated_at?: string
          naam?: string
          email?: string
          telefoon?: string | null
          materiaal?: string
          kleur?: string
          kozijn_type?: string
          glas_type?: string
          aantal_ramen?: number
          vierkante_meter_ramen?: string | null
          montage?: boolean
          afvoer_oude_kozijnen?: boolean
          quote_total?: number
          quote_breakdown?: Json | null
          photo_urls?: string[] | null
          preview_urls?: string[] | null
          status?: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost'
          assigned_to?: string | null
          notes?: string | null
          source?: string
          widget_referrer?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          last_contacted_at?: string | null
          next_follow_up_at?: string | null
        }
      }
      widgets: {
        Row: {
          id: string
          company_id: string | null
          created_at: string
          updated_at: string
          name: string
          widget_key: string
          display_mode: 'popup' | 'inline' | 'floating_button' | 'sidebar'
          position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
          trigger_type: 'button' | 'auto' | 'scroll' | 'exit_intent' | 'time_delay'
          trigger_delay: number
          button_text: string
          primary_color: string | null
          secondary_color: string | null
          show_logo: boolean
          custom_css: string | null
          allowed_domains: string[] | null
          collect_email: boolean
          collect_phone: boolean
          require_phone: boolean
          custom_pricing: Json | null
          views: number
          interactions: number
          conversions: number
          is_active: boolean
        }
        Insert: {
          id?: string
          company_id?: string | null
          created_at?: string
          updated_at?: string
          name?: string
          widget_key: string
          display_mode?: 'popup' | 'inline' | 'floating_button' | 'sidebar'
          position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
          trigger_type?: 'button' | 'auto' | 'scroll' | 'exit_intent' | 'time_delay'
          trigger_delay?: number
          button_text?: string
          primary_color?: string | null
          secondary_color?: string | null
          show_logo?: boolean
          custom_css?: string | null
          allowed_domains?: string[] | null
          collect_email?: boolean
          collect_phone?: boolean
          require_phone?: boolean
          custom_pricing?: Json | null
          views?: number
          interactions?: number
          conversions?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          company_id?: string | null
          created_at?: string
          updated_at?: string
          name?: string
          widget_key?: string
          display_mode?: 'popup' | 'inline' | 'floating_button' | 'sidebar'
          position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
          trigger_type?: 'button' | 'auto' | 'scroll' | 'exit_intent' | 'time_delay'
          trigger_delay?: number
          button_text?: string
          primary_color?: string | null
          secondary_color?: string | null
          show_logo?: boolean
          custom_css?: string | null
          allowed_domains?: string[] | null
          collect_email?: boolean
          collect_phone?: boolean
          require_phone?: boolean
          custom_pricing?: Json | null
          views?: number
          interactions?: number
          conversions?: number
          is_active?: boolean
        }
      }
      pricing_rules: {
        Row: {
          id: string
          company_id: string | null
          created_at: string
          updated_at: string
          kunststof_per_raam: number
          hout_per_raam: number
          aluminium_per_raam: number
          hout_aluminium_per_raam: number
          dubbel_glas_per_m2: number
          hr_plus_plus_per_m2: number
          triple_glas_per_m2: number
          geluidswerend_per_m2: number
          montage_per_raam: number
          afvoer_per_raam: number
          discount_3_or_more: number
          discount_5_or_more: number
          discount_10_or_more: number
          is_active: boolean
        }
        Insert: {
          id?: string
          company_id?: string | null
          created_at?: string
          updated_at?: string
          kunststof_per_raam?: number
          hout_per_raam?: number
          aluminium_per_raam?: number
          hout_aluminium_per_raam?: number
          dubbel_glas_per_m2?: number
          hr_plus_plus_per_m2?: number
          triple_glas_per_m2?: number
          geluidswerend_per_m2?: number
          montage_per_raam?: number
          afvoer_per_raam?: number
          discount_3_or_more?: number
          discount_5_or_more?: number
          discount_10_or_more?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          company_id?: string | null
          created_at?: string
          updated_at?: string
          kunststof_per_raam?: number
          hout_per_raam?: number
          aluminium_per_raam?: number
          hout_aluminium_per_raam?: number
          dubbel_glas_per_m2?: number
          hr_plus_plus_per_m2?: number
          triple_glas_per_m2?: number
          geluidswerend_per_m2?: number
          montage_per_raam?: number
          afvoer_per_raam?: number
          discount_3_or_more?: number
          discount_5_or_more?: number
          discount_10_or_more?: number
          is_active?: boolean
        }
      }
      activity_log: {
        Row: {
          id: string
          created_at: string
          company_id: string | null
          user_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          details: Json | null
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          company_id?: string | null
          user_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          company_id?: string | null
          user_id?: string | null
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
        }
      }
    }
  }
}

