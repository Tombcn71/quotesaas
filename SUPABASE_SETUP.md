# Supabase Setup voor KozijnSaaS

Deze guide helpt je om Supabase op te zetten voor de multi-tenant SaaS platform.

## 1. Supabase Account Aanmaken

1. Ga naar [supabase.com](https://supabase.com)
2. Klik op **"Start your project"**
3. Maak een account aan (gratis)
4. Klik op **"New Project"**

## 2. Project Configuratie

1. **Project naam**: `kozijnsaas` (of jouw keuze)
2. **Database password**: Kies een sterk wachtwoord (sla dit op!)
3. **Region**: `West EU (Ireland)` (het dichtst bij Nederland)
4. Klik op **"Create new project"**
5. Wacht 2-3 minuten tot database klaar is

## 3. Database Schema Importeren

1. In Supabase dashboard, ga naar **SQL Editor** (links menu)
2. Klik op **"New query"**
3. Open het bestand `supabase/schema.sql` in deze repo
4. Kopieer ALLE SQL code
5. Plak in Supabase SQL Editor
6. Klik op **"Run"** (of CMD/CTRL + Enter)
7. Je zou moeten zien: ✅ "Success. No rows returned"

Dit creëert alle tables:
- ✅ `companies` (raamkozijn bedrijven)
- ✅ `users` (medewerkers)
- ✅ `leads` (klanten/quotes)
- ✅ `widgets` (embed configuraties)
- ✅ `pricing_rules` (custom prijzen)
- ✅ `activity_log` (audit trail)

## 4. Environment Variables Ophalen

### A. Supabase URL & Keys

1. In Supabase dashboard, ga naar **Settings** → **API**
2. Kopieer de volgende waarden:

```bash
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# anon/public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

3. Plak deze in je `.env.local` bestand

### B. Service Role Key (voor admin operaties)

⚠️ **BELANGRIJK**: Deze key is geheim! Nooit committen naar Git!

1. In dezelfde **Settings** → **API** pagina
2. Scroll naar beneden naar "Service role"
3. Kopieer de `service_role` key:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (alleen voor server-side gebruik!)
```

## 5. Authentication Setup

### A. Enable Email & Password Auth

1. Ga naar **Authentication** → **Providers** in Supabase
2. Zorg dat **Email** enabled is (standaard aan)
3. Configureer email templates (optioneel):
   - Ga naar **Authentication** → **Email Templates**
   - Pas "Confirm signup" en "Reset password" templates aan

### B. URL Configuration

1. Ga naar **Authentication** → **URL Configuration**
2. Voeg toe:
   - **Site URL**: `http://localhost:3000` (development)
   - **Redirect URLs**: 
     - `http://localhost:3000/**`
     - `https://jouw-domein.nl/**` (production)

## 6. Storage Setup (Voor Foto's)

Je kan kiezen: **Supabase Storage** OF **Vercel Blob** (wat je nu gebruikt)

### Optie A: Supabase Storage gebruiken (aanbevolen voor all-in-one)

1. Ga naar **Storage** in Supabase
2. Klik op **"Create a new bucket"**
3. Naam: `kozijn-photos`
4. **Public bucket**: ✅ Ja (voor image previews)
5. Klik "Save"

6. Configureer CORS policies:
   - Ga naar bucket → **Policies** tab
   - Klik "New policy"
   - Template: "Allow public read access"
   - Save

### Optie B: Vercel Blob behouden

Laat je huidige `BLOB_READ_WRITE_TOKEN` in `.env.local` staan.

## 7. Test de Setup

### Test 1: Database verbinding

```bash
# In je project directory
npm install @supabase/supabase-js @supabase/ssr
```

### Test 2: Maak een test company

In Supabase **SQL Editor**, run:

```sql
-- Test company aanmaken
INSERT INTO companies (name, slug, email, subscription_status, subscription_plan)
VALUES (
  'Test Kozijnen BV',
  'test-kozijnen',
  'test@kozijnen.nl',
  'trial',
  'starter'
);

-- Check of het werkt
SELECT * FROM companies WHERE slug = 'test-kozijnen';
```

## 8. Row Level Security (RLS) Testen

RLS zorgt ervoor dat bedrijven alleen hun eigen data zien.

1. Ga naar **Authentication** → **Users** 
2. Klik "Add user" → "Create new user"
3. Email: `test@kozijnen.nl`
4. Password: `test123456`
5. Auto confirm: ✅ Ja

6. Koppel user aan company (SQL Editor):

```sql
-- Voeg user toe aan users table
INSERT INTO users (id, company_id, email, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@kozijnen.nl'),
  (SELECT id FROM companies WHERE slug = 'test-kozijnen'),
  'test@kozijnen.nl',
  'Test Gebruiker',
  'owner'
);
```

## 9. Volgende Stappen

✅ Database klaar  
✅ Auth geconfigureerd  
✅ RLS policies actief  

Nu kan je:
1. **Admin Dashboard bouwen** (`/dashboard` routes)
2. **Widget systeem implementeren** 
3. **Lead opslag toevoegen** aan quote form
4. **Stripe integratie** voor subscriptions

## Troubleshooting

### Error: "relation does not exist"
- Run het `schema.sql` bestand opnieuw in SQL Editor

### Error: "JWT expired" of auth errors
- Check of `NEXT_PUBLIC_SUPABASE_URL` en `NEXT_PUBLIC_SUPABASE_ANON_KEY` correct zijn

### Kan niet inloggen
- Check of email auth enabled is in **Authentication** → **Providers**
- Check redirect URLs in **Authentication** → **URL Configuration**

### RLS errors
- Check of user bestaat in `users` table
- Check of `company_id` gekoppeld is

## Handige Supabase Features

### Database Backups
- **Database** → **Backups** → Automatic daily backups (Pro plan)

### API Docs
- **API** → Auto-generated REST API documentation

### Logs & Monitoring
- **Logs** → Real-time logs van queries, errors, auth

### SQL Editor
- Saved queries, query history, explain plans

---

**Klaar!** 🎉 Je Supabase database is nu opgezet voor de SaaS platform.

Volgende: Installeer packages met `npm install` en start development server.

