# ⚡ Quick Start - KozijnSaaS

Je app is nu een **multi-tenant SaaS platform**! Volg deze stappen om te starten.

---

## 🎯 In 15 Minuten Live

### Stap 1: Supabase Account (5 min)

1. Ga naar **https://supabase.com**
2. Klik "Start your project" (gratis)
3. Maak nieuwe project aan:
   - Naam: `kozijnsaas`
   - Region: `West EU (Ireland)`
   - Wachtwoord: Kies sterk wachtwoord (sla op!)
4. Wacht 2-3 minuten tot database klaar is

### Stap 2: Database Schema (2 min)

1. In Supabase dashboard → **SQL Editor**
2. Klik "New query"
3. Open bestand `supabase/schema.sql` in je editor
4. Kopieer ALLE SQL code
5. Plak in Supabase SQL Editor
6. Klik **"Run"** (of CMD+Enter)
7. Zie je: ✅ "Success. No rows returned"? Perfect!

### Stap 3: API Keys Ophalen (2 min)

1. In Supabase → **Settings** → **API**
2. Kopieer deze 2 waarden:
   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJhbGc...
   ```

### Stap 4: Environment Variables (2 min)

1. Maak bestand `.env.local` in root van project
2. Plak dit (vul jouw keys in):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Gemini (heb je al)
GOOGLE_AI_API_KEY=your-existing-key
GEMINI_API_KEY=your-existing-key

# Vercel Blob (heb je al)
BLOB_READ_WRITE_TOKEN=your-existing-token

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Stap 5: Start Server (2 min)

```bash
pnpm dev
```

Open **http://localhost:3000** 🎉

### Stap 6: Test Data (2 min)

Ga terug naar Supabase SQL Editor en run:

```sql
-- Maak test company
INSERT INTO companies (name, slug, email, subscription_status, subscription_plan)
VALUES ('Test Kozijnen BV', 'test-kozijnen', 'test@kozijnen.nl', 'active', 'pro')
RETURNING id;
```

Ga naar Supabase → **Authentication** → **Users**:
1. Klik "Add user" → "Create new user"
2. Email: `test@kozijnen.nl`
3. Password: `test123456`
4. Auto confirm: ✅
5. Save

Ga terug naar SQL Editor:

```sql
-- Link user aan company
INSERT INTO users (id, company_id, email, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@kozijnen.nl'),
  (SELECT id FROM companies WHERE slug = 'test-kozijnen'),
  'test@kozijnen.nl',
  'Test Gebruiker',
  'owner'
);
```

---

## ✅ Test de Flow

### 1. Login Testen

1. Ga naar **http://localhost:3000/login**
2. Login met:
   - Email: `test@kozijnen.nl`
   - Password: `test123456`
3. Je wordt doorgestuurd naar `/dashboard` ✨

### 2. Dashboard Bekijken

Je ziet nu:
- 📊 Stats (leads, revenue, conversion)
- 📋 Recent leads (nog leeg)
- 🎯 Subscription info (Pro plan)

### 3. Widget Bekijken

1. Klik "Widget Installeren" OF ga naar `/dashboard/widgets`
2. Zie je:
   - Embed code
   - Widget statistieken
   - Test knop

3. Klik "Open Test Widget" om widget te testen

### 4. Test Quote Flow

1. Vul kozijn specs in
2. Upload foto (optioneel)
3. Zie AI preview (als Gemini werkt)
4. Vul naam + email in
5. Klik "Bevestig Offerte"
6. ✅ Lead opgeslagen!

### 5. Check Lead in Dashboard

1. Ga terug naar `/dashboard` of `/dashboard/leads`
2. Zie je jouw test lead? 🎉

---

## 🎨 Widget Op Eigen Website

### HTML Website

Voeg toe voor `</body>`:

```html
<script src="http://localhost:3000/widget.js" 
        data-company-id="YOUR_COMPANY_ID"></script>
```

(Haal company ID uit Supabase companies table)

### WordPress

1. **Appearance** → **Theme File Editor**
2. Open **footer.php**
3. Plak script voor `</body>`
4. Save

OF gebruik plugin:
1. Install "Insert Headers and Footers"
2. Plak script in "Scripts in Footer"

---

## 🚨 Troubleshooting

### "No matching version found for @supabase/ssr"
✅ Al gefixed! Run `pnpm install` opnieuw.

### Widget laadt niet
- Check `data-company-id` klopt
- Check console voor errors
- Verify CORS (localhost = OK)

### Kan niet inloggen
- Check Supabase Auth is enabled
- Check user bestaat in `users` table
- Check `company_id` is gekoppeld

### RLS errors
```
new row violates row-level security policy
```
- Check user is authenticated
- Verify `company_id` in users table
- Check SQL queries in `supabase/schema.sql`

### Geen leads in dashboard
- Check lead werd succesvol opgeslagen (console logs)
- Check `/api/leads` werkt
- Verify RLS policies allow read

---

## 📚 Volgende Stappen

### Nu:
- [x] Lokaal aan de praat ✅
- [ ] Test alle flows
- [ ] Lees `SAAS_SETUP_GUIDE.md` voor details

### Deze Week:
- [ ] Maak signup flow (`/signup`)
- [ ] Email notificaties toevoegen
- [ ] Deploy naar Vercel
- [ ] Custom domein koppelen

### Deze Maand:
- [ ] Stripe billing
- [ ] Widget customization UI
- [ ] Beta launch (5 klanten)

---

## 💰 Business Plan

### Pricing
- **Starter**: €49/maand - 50 quotes
- **Pro**: €99/maand - 200 quotes
- **Enterprise**: €299/maand - unlimited

### Target
- 1.500 raamkozijn bedrijven in NL
- 5% market share = 75 klanten
- 75 × €99 = **€7.425 MRR** 🚀

### Marketing
1. **Week 1-2**: Beta met 5 vrienden
2. **Week 3-4**: Itereren op feedback
3. **Maand 2**: Paid launch + SEO
4. **Maand 3+**: Google Ads + LinkedIn

---

## 🎓 Hulp Nodig?

**Documentatie:**
- `SUPABASE_SETUP.md` - Database setup details
- `SAAS_SETUP_GUIDE.md` - Complete architectuur
- `WHAT_WE_BUILT.md` - Feature overview
- Code comments - Uitleg in elke file

**External Resources:**
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Stripe: https://stripe.com/docs

**Stack:**
- Next.js 15
- Supabase (Postgres + Auth)
- Google Gemini AI
- Tailwind CSS
- shadcn/ui

---

## 🎉 Je bent klaar!

Je hebt nu:
- ✅ Multi-tenant SaaS platform
- ✅ Embeddable widget
- ✅ Admin dashboard
- ✅ Lead management
- ✅ Authentication
- ✅ Database met RLS

**Next:** Deploy en ga live! 🚀

---

**Succes!**

_Built in 1 session. Launched in 1 week. Scale to €10k MRR in 6 months._ 💪

