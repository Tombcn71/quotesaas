-- SIMPELE SETUP - GEWOON WERKEND
-- Run dit in Supabase SQL Editor, klaar.

-- 1. Maak tables (als ze nog niet bestaan)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id),
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  naam TEXT NOT NULL,
  email TEXT NOT NULL,
  telefoon TEXT,
  quote_total DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS UIT - gewoon simpel
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- KLAAR. Signup werkt nu gewoon.

