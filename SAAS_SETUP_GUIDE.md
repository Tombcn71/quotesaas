# 🚀 KozijnSaaS - Complete Setup Guide

Je raamkozijn app is nu omgebouwd naar een **multi-tenant SaaS platform**! Raamkozijn bedrijven kunnen nu een widget op hun website plaatsen om leads te ontvangen.

## 🎯 Wat is er gebouwd?

### ✅ Core Features

1. **Multi-Tenant Database** (Supabase)
   - Companies (raamkozijn bedrijven)
   - Users (medewerkers van bedrijven)
   - Leads (klanten die offerte aanvragen)
   - Widgets (embed configuraties)
   - Pricing Rules (custom prijzen per bedrijf)
   - Activity Log (audit trail)

2. **Embeddable Widget System**
   - JavaScript widget (`/public/widget.js`)
   - Iframe embed (`/app/widget/embed/page.tsx`)
   - Floating button, popup, inline modes
   - Tracking (views, clicks, conversions)
   - Customizable branding

3. **Admin Dashboard** (`/app/dashboard/*`)
   - Overview met statistieken
   - Lead management
   - Widget configuratie en embed code
   - Company branding instellingen

4. **Authentication** (Supabase Auth)
   - Login systeem voor bedrijven
   - Row Level Security (RLS)
   - Role-based access (owner, admin, member)

5. **Lead Management**
   - Auto-save leads naar database
   - Email/phone tracking
   - Status workflow (new → contacted → won/lost)
   - Photo + AI preview opslag

---

## 📦 Installatie

### 1. Installeer Dependencies

```bash
pnpm install
# of
npm install
```

Dit installeert de nieuwe packages:
- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - Server-side rendering support

### 2. Supabase Setup

Volg de stappen in **`SUPABASE_SETUP.md`** om:
1. Supabase account aan te maken
2. Database schema te importeren (`supabase/schema.sql`)
3. Environment variables op te halen

### 3. Environment Variables

Maak een `.env.local` bestand aan:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Google Gemini (bestaand)
GOOGLE_AI_API_KEY=your-key
GEMINI_API_KEY=your-key

# Vercel Blob (bestaand)
BLOB_READ_WRITE_TOKEN=your-token

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Stripe (voor billing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

### 4. Database Migratie

Open Supabase SQL Editor en run `supabase/schema.sql`:

```sql
-- Dit creëert alle tables, RLS policies, en triggers
```

### 5. Start Development Server

```bash
pnpm dev
# of
npm run dev
```

Open http://localhost:3000

---

## 🏗️ Architectuur

### Database Schema

```
companies
├── id (UUID)
├── name, slug, email
├── branding (logo, colors)
├── subscription (plan, status, limits)
└── stripe_customer_id

users (auth.users reference)
├── id (UUID) → auth.users
├── company_id → companies
└── role (owner/admin/member)

leads
├── id (UUID)
├── company_id → companies
├── contact info (naam, email, telefoon)
├── kozijn specs (materiaal, kleur, type)
├── quote (total, breakdown)
├── photos (urls array)
├── status (new/contacted/won/lost)
└── source tracking

widgets
├── id (UUID)
├── company_id → companies
├── widget_key (public identifier)
├── display settings
├── tracking stats (views, clicks, conversions)
└── custom branding

pricing_rules
├── company_id → companies
├── custom prijzen per materiaal/glas
└── kortingen
```

### File Structure

```
app/
├── api/
│   ├── leads/route.ts           # Lead CRUD endpoints
│   ├── widgets/
│   │   ├── config/route.ts      # Widget configuratie
│   │   └── track/route.ts       # Analytics tracking
│   └── [existing APIs]
├── dashboard/
│   ├── page.tsx                 # Dashboard overview
│   ├── leads/page.tsx           # Lead management
│   └── widgets/page.tsx         # Widget setup
├── login/page.tsx               # Authentication
└── widget/
    └── embed/page.tsx           # Iframe embed pagina

lib/
└── supabase/
    ├── client.ts                # Client-side Supabase
    ├── server.ts                # Server-side Supabase
    └── database.types.ts        # TypeScript types

public/
└── widget.js                    # Embeddable widget script

components/
└── ai-quote-form.tsx            # Updated: Lead opslag
```

---

## 🎨 Hoe het Werkt

### Voor Raamkozijn Bedrijven:

1. **Aanmelden** (`/signup` - nog te maken)
   - Bedrijf aanmaken
   - 14 dagen gratis trial
   
2. **Widget Installeren** (`/dashboard/widgets`)
   - Embed code kopieren
   - Plaatsen op website
   
3. **Leads Ontvangen** (`/dashboard/leads`)
   - Auto-inkomende leads
   - Email notificaties (TODO)
   - Status management

### Voor Eindklanten (op website van bedrijf):

1. **Widget Laden**
   ```html
   <script src="https://kozijnsaas.nl/widget.js" 
           data-company-id="abc-123"></script>
   ```

2. **Offerte Aanvragen**
   - Kozijn specs invullen
   - Foto's uploaden
   - AI preview zien
   - Contact gegevens invullen

3. **Lead Opgeslagen**
   - Direct in database van bedrijf
   - Bedrijf krijgt notificatie
   - Klant krijgt bevestiging

---

## 🔐 Security (Row Level Security)

Alle data is **isolated per bedrijf**:

```sql
-- Users kunnen alleen hun eigen company data zien
CREATE POLICY "Users can view own company leads"
  ON leads FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));
```

✅ Bedrijf A kan geen leads van Bedrijf B zien  
✅ Geen admin users kunnen alles zien (tenzij je dat toevoegt)  
✅ Widget tracking werkt zonder auth

---

## 🚀 Deployment

### Vercel Deployment

1. **Push naar Git**
   ```bash
   git add .
   git commit -m "SaaS platform klaar"
   git push
   ```

2. **Deploy naar Vercel**
   - Connect repo in Vercel dashboard
   - Add environment variables
   - Deploy

3. **Update Widget URL**
   - In `public/widget.js` regel 24
   - Change naar je productie URL:
   ```javascript
   const API_BASE = 'https://jouw-domein.nl'
   ```

### Post-Deployment

1. **Update Supabase Auth URLs**
   - Supabase → Authentication → URL Configuration
   - Add: `https://jouw-domein.nl/**`

2. **Test Widget**
   - Plaats op test website
   - Check tracking werkt
   - Test lead flow

---

## 📊 Analytics & Tracking

Widget tracking gebeurt automatisch:

```javascript
// In widget.js
trackEvent('widget_view')      // Widget geladen
trackEvent('widget_interaction') // Geklikt
trackEvent('widget_conversion')  // Lead verzonden
```

Data wordt opgeslagen in:
- `widgets.views`
- `widgets.interactions` 
- `widgets.conversions`
- `activity_log` table

---

## 💰 Subscription Plans

Gedefinieerd in `companies.subscription_plan`:

| Plan | Prijs | Quotes/maand | Features |
|------|-------|--------------|----------|
| **Starter** | €49 | 50 | Basic widget |
| **Pro** | €99 | 200 | Branding + Analytics |
| **Enterprise** | €299 | Unlimited | API + Custom domain |

**Implementatie:** Stripe integratie (TODO item #8)

---

## 🛠️ Volgende Stappen

### Prioriteit 1 - Essentials

1. **Signup Flow** (`/signup`)
   - Bedrijf registratie
   - Email verificatie
   - Onboarding wizard

2. **Email Notificaties**
   - Lead alert naar bedrijf
   - Bevestiging naar klant
   - Resend of SendGrid

3. **Widget Customization**
   - Kleuren aanpassen
   - Logo uploaden
   - Custom teksten

### Prioriteit 2 - Growth

4. **Stripe Billing**
   - Subscription checkout
   - Webhook handling
   - Invoice generatie

5. **Analytics Dashboard**
   - Conversion funnel
   - Revenue charts (Recharts)
   - Lead source tracking

6. **CRM Integratie**
   - Zapier webhooks
   - API endpoints
   - Export functie

### Prioriteit 3 - Scale

7. **Multi-Widget Support**
   - Meerdere widgets per company
   - A/B testing
   - Per-widget pricing

8. **White Label**
   - Custom domains (quote.bedrijf.nl)
   - Remove KozijnSaaS branding
   - Custom emails

9. **Team Management**
   - Uitnodigen teamleden
   - Rollen & permissies
   - Activity log per user

---

## 🧪 Testing

### Test Met Demo Data

```sql
-- Run in Supabase SQL Editor

-- 1. Maak test company
INSERT INTO companies (name, slug, email, subscription_status, subscription_plan)
VALUES ('Test Kozijnen BV', 'test', 'test@kozijnen.nl', 'active', 'pro')
RETURNING id;

-- 2. Maak test user (eerst via Supabase Auth UI)
-- Then link to company:
INSERT INTO users (id, company_id, email, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@kozijnen.nl'),
  (SELECT id FROM companies WHERE slug = 'test'),
  'test@kozijnen.nl',
  'Test Gebruiker',
  'owner'
);
```

### Test Widget Locally

1. Open `http://localhost:3000/widget/embed?companyId=YOUR_COMPANY_ID`
2. Test offerte flow
3. Check lead in dashboard

---

## 📝 Code Voorbeelden

### Widget Embedden

**Basic:**
```html
<script src="https://kozijnsaas.nl/widget.js" 
        data-company-id="abc-123"></script>
```

**Met Opties:**
```html
<script>
  window.KozijnWidget.init({
    companyId: 'abc-123',
    position: 'bottom-right',
    primaryColor: '#2563eb',
    buttonText: 'Gratis Offerte Aanvragen'
  });
</script>
<script src="https://kozijnsaas.nl/widget.js"></script>
```

**Inline Mode:**
```html
<div data-kozijn-widget></div>
<script src="https://kozijnsaas.nl/widget.js" 
        data-company-id="abc-123"
        data-display-mode="inline"></script>
```

### API Gebruik

**Leads ophalen:**
```typescript
const { data: leads } = await supabase
  .from('leads')
  .select('*')
  .eq('company_id', companyId)
  .order('created_at', { ascending: false })
```

**Lead status updaten:**
```typescript
await supabase
  .from('leads')
  .update({ status: 'contacted' })
  .eq('id', leadId)
```

---

## 🐛 Troubleshooting

### Widget laadt niet

- Check `data-company-id` is correct
- Check browser console voor errors
- Verify Supabase connection
- Check CORS settings

### Leads komen niet binnen

- Check API endpoint `/api/leads`
- Verify company is active
- Check quote limit niet bereikt
- Inspect network tab in DevTools

### RLS Errors

```
new row violates row-level security policy
```

- Check user is authenticated
- Verify `company_id` is set in users table
- Check RLS policies in Supabase

### Auth Redirects Falen

- Update Supabase Auth URLs
- Check `NEXT_PUBLIC_SUPABASE_URL` 
- Clear browser cookies

---

## 🎉 Klaar!

Je hebt nu een volledig werkende **SaaS platform** voor raamkozijn bedrijven!

### Wat Werkt:

✅ Multi-tenant database  
✅ Embeddable widget  
✅ Admin dashboard  
✅ Lead management  
✅ Authentication  
✅ Analytics tracking  
✅ Row Level Security  

### Wat je Nog Moet Doen:

⏳ Signup flow  
⏳ Email notificaties  
⏳ Stripe billing  
⏳ Widget customization UI  

---

## 📚 Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Stripe Billing:** https://stripe.com/docs/billing
- **Resend Emails:** https://resend.com/docs

---

## 💡 Tips

1. **Start Klein:** Begin met 1-2 beta klanten
2. **Test Veel:** Widget op verschillende websites
3. **Monitor:** Check Supabase logs regelmatig
4. **Iterate:** Vraag feedback aan gebruikers

---

**Succes met je SaaS! 🚀**

Voor vragen: Check de code comments of Supabase docs.

