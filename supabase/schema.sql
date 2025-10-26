-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- COMPANIES (Raamkozijn bedrijven die de SaaS gebruiken)
-- =====================================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic Info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- voor custom URLs: quote.slug.kozijnsaas.nl
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  
  -- Branding
  logo_url TEXT,
  primary_color TEXT DEFAULT '#2563eb', -- hex color
  secondary_color TEXT DEFAULT '#1e40af',
  
  -- Business Settings
  kvk_number TEXT,
  btw_number TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  
  -- Subscription
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'cancelled', 'paused')),
  subscription_plan TEXT DEFAULT 'starter' CHECK (subscription_plan IN ('starter', 'pro', 'enterprise')),
  subscription_started_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '14 days',
  
  -- Usage Limits
  monthly_quote_limit INTEGER DEFAULT 50,
  monthly_quotes_used INTEGER DEFAULT 0,
  
  -- Stripe
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  onboarding_completed BOOLEAN DEFAULT false
);

-- Index for fast lookups
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_stripe_customer ON companies(stripe_customer_id);

-- =====================================================
-- USERS (Medewerkers van raamkozijn bedrijven)
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Profile
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Role
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_email ON users(email);

-- =====================================================
-- LEADS (Klanten die een offerte aanvragen)
-- =====================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact Info
  naam TEXT NOT NULL,
  email TEXT NOT NULL,
  telefoon TEXT,
  
  -- Kozijn Specificaties
  materiaal TEXT NOT NULL, -- kunststof, hout, aluminium
  kleur TEXT NOT NULL,
  kozijn_type TEXT NOT NULL,
  glas_type TEXT NOT NULL,
  aantal_ramen INTEGER NOT NULL,
  vierkante_meter_ramen TEXT,
  
  -- Extra Services
  montage BOOLEAN DEFAULT true,
  afvoer_oude_kozijnen BOOLEAN DEFAULT true,
  
  -- Pricing
  quote_total DECIMAL(10, 2) NOT NULL,
  quote_breakdown JSONB, -- {kozijnen: 2800, glas: 900, montage: 600, afvoer: 200}
  
  -- Photos & Preview
  photo_urls TEXT[], -- Array van foto URLs
  preview_urls TEXT[], -- Array van AI preview URLs
  
  -- Lead Management
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost')),
  assigned_to UUID REFERENCES users(id),
  notes TEXT,
  
  -- Source tracking
  source TEXT DEFAULT 'widget', -- widget, direct, api
  widget_referrer TEXT, -- URL waar widget geplaatst was
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Follow-up
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  next_follow_up_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_leads_company ON leads(company_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);

-- =====================================================
-- WIDGETS (Embed configuraties per bedrijf)
-- =====================================================
CREATE TABLE widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Widget Info
  name TEXT NOT NULL DEFAULT 'Hoofd Widget',
  widget_key TEXT UNIQUE NOT NULL, -- public key voor embed
  
  -- Display Settings
  display_mode TEXT DEFAULT 'popup' CHECK (display_mode IN ('popup', 'inline', 'floating_button', 'sidebar')),
  position TEXT DEFAULT 'bottom-right' CHECK (position IN ('bottom-right', 'bottom-left', 'top-right', 'top-left', 'center')),
  trigger_type TEXT DEFAULT 'button' CHECK (trigger_type IN ('button', 'auto', 'scroll', 'exit_intent', 'time_delay')),
  trigger_delay INTEGER DEFAULT 0, -- seconds
  
  -- Customization
  button_text TEXT DEFAULT 'Gratis Offerte',
  primary_color TEXT,
  secondary_color TEXT,
  show_logo BOOLEAN DEFAULT true,
  custom_css TEXT,
  
  -- Behavior
  allowed_domains TEXT[], -- Whitelist van domains waar widget mag laden
  collect_email BOOLEAN DEFAULT true,
  collect_phone BOOLEAN DEFAULT true,
  require_phone BOOLEAN DEFAULT false,
  
  -- Pricing (custom prices per widget/locatie)
  custom_pricing JSONB, -- Override company-wide pricing
  
  -- Stats
  views INTEGER DEFAULT 0,
  interactions INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_widgets_company ON widgets(company_id);
CREATE INDEX idx_widgets_key ON widgets(widget_key);

-- =====================================================
-- PRICING_RULES (Custom prijzen per bedrijf)
-- =====================================================
CREATE TABLE pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Kozijn Prijzen (per raam)
  kunststof_per_raam DECIMAL(10, 2) DEFAULT 350.00,
  hout_per_raam DECIMAL(10, 2) DEFAULT 550.00,
  aluminium_per_raam DECIMAL(10, 2) DEFAULT 650.00,
  hout_aluminium_per_raam DECIMAL(10, 2) DEFAULT 750.00,
  
  -- Glas Prijzen (per m²)
  dubbel_glas_per_m2 DECIMAL(10, 2) DEFAULT 45.00,
  hr_plus_plus_per_m2 DECIMAL(10, 2) DEFAULT 65.00,
  triple_glas_per_m2 DECIMAL(10, 2) DEFAULT 85.00,
  geluidswerend_per_m2 DECIMAL(10, 2) DEFAULT 95.00,
  
  -- Service Prijzen
  montage_per_raam DECIMAL(10, 2) DEFAULT 75.00,
  afvoer_per_raam DECIMAL(10, 2) DEFAULT 25.00,
  
  -- Kortingen
  discount_3_or_more DECIMAL(5, 2) DEFAULT 5.00, -- 5% korting
  discount_5_or_more DECIMAL(5, 2) DEFAULT 10.00, -- 10% korting
  discount_10_or_more DECIMAL(5, 2) DEFAULT 15.00, -- 15% korting
  
  -- Is dit de actieve pricing voor dit bedrijf?
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_pricing_company ON pricing_rules(company_id);

-- =====================================================
-- ACTIVITY_LOG (Audit trail)
-- =====================================================
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  action TEXT NOT NULL, -- 'lead_created', 'lead_updated', 'widget_created', etc
  entity_type TEXT, -- 'lead', 'widget', 'company', etc
  entity_id UUID,
  
  details JSONB, -- Extra context
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_activity_company ON activity_log(company_id);
CREATE INDEX idx_activity_created_at ON activity_log(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Companies: Users can only see their own company
CREATE POLICY "Users can view own company"
  ON companies FOR SELECT
  USING (id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update own company"
  ON companies FOR UPDATE
  USING (id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role IN ('owner', 'admin')));

-- Users: Users can see colleagues in same company
CREATE POLICY "Users can view company colleagues"
  ON users FOR SELECT
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

-- Leads: Users can only see leads for their company
CREATE POLICY "Users can view own company leads"
  ON leads FOR SELECT
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert leads for own company"
  ON leads FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update own company leads"
  ON leads FOR UPDATE
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

-- Widgets: Users can manage their company's widgets
CREATE POLICY "Users can view own company widgets"
  ON widgets FOR SELECT
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can manage own company widgets"
  ON widgets FOR ALL
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role IN ('owner', 'admin')));

-- Pricing Rules: Users can view/update their company's pricing
CREATE POLICY "Users can view own company pricing"
  ON pricing_rules FOR SELECT
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update own company pricing"
  ON pricing_rules FOR ALL
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role IN ('owner', 'admin')));

-- Activity Log: Users can view their company's activity
CREATE POLICY "Users can view own company activity"
  ON activity_log FOR SELECT
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widgets_updated_at BEFORE UPDATE ON widgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_updated_at BEFORE UPDATE ON pricing_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Reset monthly quote counter (run monthly via cron)
CREATE OR REPLACE FUNCTION reset_monthly_quotes()
RETURNS void AS $$
BEGIN
  UPDATE companies SET monthly_quotes_used = 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA (Optional: voor testing)
-- =====================================================

-- Demo company
INSERT INTO companies (name, slug, email, phone, subscription_status, subscription_plan, is_active)
VALUES (
  'Demo Kozijnen BV',
  'demo-kozijnen',
  'info@demokozijnen.nl',
  '010-1234567',
  'active',
  'pro',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Demo pricing rules
INSERT INTO pricing_rules (company_id, is_active)
SELECT id, true FROM companies WHERE slug = 'demo-kozijnen'
ON CONFLICT DO NOTHING;

