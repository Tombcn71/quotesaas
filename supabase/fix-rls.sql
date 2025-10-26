-- ============================================
-- FIX RLS INFINITE RECURSION
-- ============================================
-- Run this in Supabase SQL Editor to fix the users policy

-- 1. Drop problematic policies
DROP POLICY IF EXISTS "Users can view company colleagues" ON users;
DROP POLICY IF EXISTS "Users can view own company leads" ON leads;
DROP POLICY IF EXISTS "Users can insert leads for own company" ON leads;
DROP POLICY IF EXISTS "Users can update own company leads" ON leads;
DROP POLICY IF EXISTS "Users can view own company widgets" ON widgets;
DROP POLICY IF EXISTS "Users can manage own company widgets" ON widgets;
DROP POLICY IF EXISTS "Users can view own company pricing" ON pricing_rules;
DROP POLICY IF EXISTS "Users can update own company pricing" ON pricing_rules;

-- 2. Create security definer function to get user's company (avoids recursion)
-- Using public schema instead of auth schema
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT company_id FROM public.users WHERE id = auth.uid() LIMIT 1;
$$;

-- 3. Recreate users policies (simplified - only allow viewing self)
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- Allow INSERT for signup flow (needed for registration)
CREATE POLICY "Allow user creation during signup"
  ON users FOR INSERT
  WITH CHECK (id = auth.uid());

-- 4. Recreate other policies using the safe function
CREATE POLICY "Users can view own company leads"
  ON leads FOR SELECT
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can insert leads for own company"
  ON leads FOR INSERT
  WITH CHECK (company_id = public.get_user_company_id() OR company_id IS NULL);

CREATE POLICY "Users can update own company leads"
  ON leads FOR UPDATE
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can view own company widgets"
  ON widgets FOR SELECT
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can manage own company widgets"
  ON widgets FOR ALL
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can view own company pricing"
  ON pricing_rules FOR SELECT
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can update own company pricing"
  ON pricing_rules FOR ALL
  USING (company_id = public.get_user_company_id());

-- Allow public to insert companies (for signup)
CREATE POLICY "Allow company creation during signup"
  ON companies FOR INSERT
  WITH CHECK (true);

-- Allow public to insert pricing rules (for signup)
CREATE POLICY "Allow pricing creation during signup"
  ON pricing_rules FOR INSERT
  WITH CHECK (true);

-- Allow public to insert widgets (for signup)
CREATE POLICY "Allow widget creation during signup"
  ON widgets FOR INSERT
  WITH CHECK (true);

-- ============================================
-- VERIFICATION
-- ============================================
-- Test if policies work:
SELECT current_user, auth.uid();
SELECT * FROM users WHERE id = auth.uid();

