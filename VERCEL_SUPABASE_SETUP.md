# 🚀 Supabase via Vercel Integration (Aanbevolen!)

Dit is de **snelste manier** om Supabase te connecten met je Vercel project.

## Voordelen van Vercel Integration

✅ **1-click setup** - Geen manual copy/paste van keys  
✅ **Auto environment variables** - Vercel injecteert automatisch  
✅ **Development & Production** - Automatisch gescheiden databases  
✅ **Team access** - Iedereen op team heeft direct toegang  
✅ **Preview deployments** - Elke PR krijgt eigen database branch (optioneel)  

---

## 🎯 Setup via Vercel (5 minuten)

### Stap 1: Push naar Git

```bash
cd /Users/tom/Desktop/kozijnsaas

# Maak .gitignore (als die er niet is)
echo ".env.local
.env
node_modules/
.next/
out/
dist/" > .gitignore

# Commit alles
git add .
git commit -m "SaaS platform with Supabase"
git push
```

### Stap 2: Connect Vercel

1. Ga naar **https://vercel.com**
2. Klik **"Add New..."** → **"Project"**
3. Import je Git repo
4. **STOP! Klik nog NIET op Deploy**

### Stap 3: Supabase Integration Toevoegen

1. In Vercel project settings → **"Integrations"**
2. Browse marketplace → Zoek **"Supabase"**
3. Klik **"Add Integration"**
4. Authorize Vercel bij Supabase
5. Selecteer je Supabase project (of maak nieuwe aan!)
6. Vercel vraagt: "Which Vercel projects?"
   - Selecteer je kozijnsaas project
7. Klik **"Connect"**

### Stap 4: Environment Variables (Automatisch!)

Vercel voegt automatisch toe:
```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY  # (secret!)
```

✨ **Je hoeft NIETS te copy/pasten!**

### Stap 5: Voeg Overige Env Vars Toe

In Vercel project → **Settings** → **Environment Variables**:

```bash
# Google Gemini
GOOGLE_AI_API_KEY=your-key
GEMINI_API_KEY=your-key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-token

# App URL (auto-filled door Vercel)
NEXT_PUBLIC_APP_URL=https://jouw-domein.vercel.app
```

### Stap 6: Deploy!

Klik **"Deploy"** in Vercel dashboard

---

## 🏠 Lokaal Werken met Vercel Integration

### Optie A: Vercel CLI (Aanbevolen)

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local

# Start dev server
pnpm dev
```

✨ Nu heb je automatisch alle production environment variables lokaal!

### Optie B: Manual (Wat we eerst deden)

Je kan nog steeds `.env.local` manual maken zoals eerder beschreven.

---

## 🔀 Development vs Production Databases

### Optie 1: Zelfde Database (Simpel)

Gebruik production Supabase voor zowel dev als prod:
- ✅ Makkelijk
- ⚠️ Risky (test data in production)

### Optie 2: Aparte Databases (Professioneel)

Maak 2 Supabase projects:
1. **kozijnsaas-dev** (development)
2. **kozijnsaas-prod** (production)

In Vercel:
- **Development** env vars → dev database
- **Production** env vars → prod database
- **Preview** env vars → dev database (of preview branch)

---

## 🌳 Database Branching (Advanced)

Neon (= Vercel Postgres) heeft "database branching" zoals Git:

```bash
main branch (production)
  ↓
  ├─ dev branch (development)
  └─ feature-xyz branch (PR preview)
```

Supabase heeft dit (nog) niet, maar je kan:
1. Multiple Supabase projects gebruiken
2. Of wachten op Supabase Branching (komt eraan)

---

## 💡 Aanbevolen Setup

### Voor Jou (Nu):
```
1 Supabase Project → Vercel Integration
└─ Development: Localhost
└─ Production: Vercel
└─ Preview: Vercel previews (zelfde database)
```

**Later (bij schalen):**
```
2 Supabase Projects
├─ kozijnsaas-dev
│  └─ Localhost + Vercel previews
└─ kozijnsaas-prod
   └─ Production alleen
```

---

## 📊 Vercel Integration Dashboard

Na setup zie je in Vercel:

**Integrations Tab:**
- 🟢 Supabase connected
- View tables
- Quick link naar Supabase dashboard
- Logs & monitoring

**Deployments:**
- Elke deploy heeft automatisch Supabase access
- Preview deployments werken out-of-the-box
- No configuration needed

---

## 🔐 Security Benefits

Vercel Integration voegt automatisch:
- ✅ Encrypted environment variables
- ✅ Service role key als "secret" (niet zichtbaar in UI)
- ✅ Automatic key rotation support
- ✅ Team access controls

---

## 🆚 Vergelijking

| Feature | Manual Setup | Vercel Integration |
|---------|-------------|-------------------|
| Setup tijd | 10 min | 2 min |
| Env vars | Copy/paste | Automatisch |
| Team access | Share keys | Auto voor team |
| Preview deploys | Manual config | Works out-of-box |
| Key rotation | Manual update | One-click |
| Platform lock-in | ❌ Geen | ⚠️ Vercel only |

---

## 🎯 Mijn Advies

**Voor jouw SaaS:**

✅ **Gebruik Vercel Integration** omdat:
1. Je toch al op Vercel zit
2. Sneller setup
3. Minder kans op fouten
4. Team kan makkelijk meebouwen
5. Preview deployments "just work"

**Maar:** De code die ik heb geschreven werkt met BEIDE!

Je kan nu kiezen:
- **Via Vercel Integration** → Follow `VERCEL_SUPABASE_SETUP.md`
- **Manual Setup** → Follow `SUPABASE_SETUP.md`

Beide werken perfect! 🎉

---

## 🔄 Migreren van Manual → Vercel Integration

Als je al manual setup hebt gedaan:

1. Push code naar Git
2. Deploy naar Vercel
3. Add Supabase integration
4. Vercel overschrijft je manual env vars
5. ✅ Klaar!

Je hoeft **NIETS** in code te veranderen.

---

## 🚀 Next Steps

```bash
# 1. Push naar Git
git push

# 2. Deploy naar Vercel
vercel

# 3. Add Supabase Integration
# (via Vercel dashboard)

# 4. Test production
open https://jouw-domein.vercel.app
```

---

**TL;DR:** Vercel Integration is beter! Maar je code werkt met beide. 😎

