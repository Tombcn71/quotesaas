# 🚀 Deploy Nu - Simpele Stappen

De terminal werkt niet goed via de chat. Doe dit zelf:

## Stap 1: Git Push (2 min)

Open je eigen terminal en run:

```bash
cd /Users/tom/Desktop/kozijnsaas

# Stage alles
git add .

# Commit
git commit -m "Add SaaS platform with Supabase"

# Push
git push
```

**OF gebruik het script:**

```bash
cd /Users/tom/Desktop/kozijnsaas
chmod +x deploy.sh
./deploy.sh
```

---

## Stap 2: Vercel Deploy (3 min)

### Optie A: Via Vercel Dashboard (Makkelijkst)

1. Ga naar **https://vercel.com/new**
2. Klik **"Import Git Repository"**
3. Selecteer je `kozijnsaas` repo
4. **STOP - Klik nog NIET op Deploy!**

---

## Stap 3: Supabase Integration (2 min)

**VOOR je deployt:**

1. In Vercel import screen → Klik **"Add Integrations"**
2. Zoek **"Supabase"**
3. Klik **"Add"**
4. Login bij Supabase (of maak account)
5. **Create NEW Supabase project:**
   - Name: `kozijnsaas-prod`
   - Region: `West EU (Ireland)`
   - Password: Kies sterk wachtwoord
6. Klik **"Create project"** (duurt 2 min)
7. Vercel linkt automatisch!

✨ **Environment variables worden automatisch toegevoegd!**

---

## Stap 4: Extra Env Vars (1 min)

In Vercel, voeg toe:

```bash
GOOGLE_AI_API_KEY=your-gemini-key
GEMINI_API_KEY=your-gemini-key
BLOB_READ_WRITE_TOKEN=your-blob-token
```

(Haal deze uit je huidige `.env.local`)

---

## Stap 5: Deploy! (30 sec)

Klik **"Deploy"** in Vercel

Wacht 2-3 minuten... ✨

---

## Stap 6: Database Schema (2 min)

**NADAT deploy klaar is:**

1. Ga naar **supabase.com/dashboard**
2. Open je nieuwe `kozijnsaas-prod` project
3. Ga naar **SQL Editor**
4. Open `supabase/schema.sql` in je code editor
5. Kopieer ALLE SQL
6. Plak in Supabase SQL Editor
7. Klik **"Run"**
8. Zie je ✅ "Success"? Klaar!

---

## Stap 7: Test User (1 min)

In Supabase:

```sql
-- Maak test company
INSERT INTO companies (name, slug, email, subscription_status, subscription_plan)
VALUES ('Demo Kozijnen BV', 'demo', 'demo@kozijnen.nl', 'active', 'pro');
```

Dan **Authentication** → **Users** → **Add user**:
- Email: `demo@kozijnen.nl`
- Password: `demo123456`
- Auto confirm: ✅

Dan SQL Editor:

```sql
-- Link user aan company
INSERT INTO users (id, company_id, email, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'demo@kozijnen.nl'),
  (SELECT id FROM companies WHERE slug = 'demo'),
  'demo@kozijnen.nl',
  'Demo User',
  'owner'
);
```

---

## Stap 8: Test Live App! 🎉

1. Ga naar je Vercel URL: `https://kozijnsaas.vercel.app`
2. Ga naar `/login`
3. Login met `demo@kozijnen.nl` / `demo123456`
4. Zie je dashboard? **SUCCESS!** 🎊

---

## Update Widget URL (1 min)

**BELANGRIJK:** Open `public/widget.js` en update regel 24:

```javascript
const API_BASE = 'https://jouw-kozijnsaas-url.vercel.app'
```

Commit en push:

```bash
git add public/widget.js
git commit -m "Update widget URL to production"
git push
```

Vercel deployt automatisch opnieuw!

---

## ✅ Klaar!

Je SaaS draait nu live op:
- 🌐 Frontend: `https://your-app.vercel.app`
- 🗄️ Database: Supabase (via Vercel integration)
- 🔐 Auth: Supabase Auth
- 📊 Dashboard: `https://your-app.vercel.app/dashboard`

---

## Test de Widget

```html
<!-- Test op eigen website -->
<script src="https://your-app.vercel.app/widget.js" 
        data-company-id="COMPANY_ID_FROM_SUPABASE"></script>
```

Company ID vind je in Supabase → `companies` table

---

## Problemen?

### Deploy failed
- Check build logs in Vercel
- Verify all env vars zijn ingesteld

### Supabase connection error
- Check Supabase integration is active
- Verify database schema is geïmporteerd

### Can't login
- Check user exists in Supabase Auth
- Check user is linked in `users` table
- Check RLS policies zijn actief

---

## 🎉 Gefeliciteerd!

Je hebt nu een **live SaaS platform**!

**Next steps:**
1. Test alle flows
2. Voeg eigen bedrijf toe
3. Test widget op eigen website
4. Deel met eerste klanten!

**Go live! 🚀**

