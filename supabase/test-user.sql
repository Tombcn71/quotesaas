-- ============================================
-- CREATE TEST COMPANY & USER
-- ============================================
-- Run this in Supabase SQL Editor after schema.sql

-- 1. Create test company
INSERT INTO companies (name, slug, email, subscription_status, subscription_plan, is_active)
VALUES (
  'Demo Company',
  'demo',
  'demo@quotesaas.com',
  'active',
  'pro',
  true
)
ON CONFLICT (slug) DO NOTHING
RETURNING id, name, slug;

-- 2. Create pricing rules for demo company
INSERT INTO pricing_rules (company_id, is_active)
SELECT id, true FROM companies WHERE slug = 'demo'
ON CONFLICT DO NOTHING;

-- 3. Now create a user in Supabase Auth UI:
-- Go to: Authentication → Users → Add user
-- Email: demo@quotesaas.com
-- Password: demo123456
-- Auto confirm: ✅ YES

-- 4. After creating user in Auth UI, link to company:
-- WAIT! First get the user ID from auth.users, then run:

-- INSERT INTO users (id, company_id, email, full_name, role)
-- VALUES (
--   'USER_ID_FROM_AUTH_USERS',  -- Replace with actual ID
--   (SELECT id FROM companies WHERE slug = 'demo'),
--   'demo@quotesaas.com',
--   'Demo User',
--   'owner'
-- );

-- Or use this query that auto-finds the user:
DO $$
DECLARE
  user_uuid UUID;
  company_uuid UUID;
BEGIN
  -- Get user ID from auth.users
  SELECT id INTO user_uuid FROM auth.users WHERE email = 'demo@quotesaas.com';
  
  -- Get company ID
  SELECT id INTO company_uuid FROM companies WHERE slug = 'demo';
  
  -- Link user to company (if user exists)
  IF user_uuid IS NOT NULL AND company_uuid IS NOT NULL THEN
    INSERT INTO users (id, company_id, email, full_name, role)
    VALUES (user_uuid, company_uuid, 'demo@quotesaas.com', 'Demo User', 'owner')
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'User linked successfully!';
  ELSE
    RAISE NOTICE 'User not found in auth.users. Create user in Auth UI first!';
  END IF;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================
-- Check if everything is set up:
SELECT 
  c.name as company_name,
  c.slug,
  c.subscription_plan,
  u.email as user_email,
  u.role,
  u.is_active
FROM companies c
LEFT JOIN users u ON u.company_id = c.id
WHERE c.slug = 'demo';

-- If you see a row with user_email filled in, you're ready to login!
-- If user_email is NULL, you need to:
-- 1. Go to Authentication → Users → Add user
-- 2. Create user with email: demo@quotesaas.com
-- 3. Run the DO $$ block again above

