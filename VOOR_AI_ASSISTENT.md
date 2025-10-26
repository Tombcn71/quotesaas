# CONTEXT VOOR AI ASSISTENT - LEES DIT EERST

## WAT IS ER GEBEURD?

User heeft een Next.js app met Google Gemini AI functionaliteit voor kozijn/raam offertes.
- Klanten uploaden foto's van ramen
- AI analyseert en genereert preview met nieuwe kozijnen
- Automatische prijsberekening
- Lead capturing

**PROBLEEM:** We zijn 4+ uur kwijt geweest aan Supabase auth problemen (RLS policies, session issues, redirects).

**OPLOSSING:** User gaat v0.dev gebruiken om een werkend SaaS platform te genereren MET auth + database.
Dan importeren we de AI functionaliteit daarin.

---

## BELANGRIJKSTE FILES (al geëxporteerd naar /EXPORT_FOR_V0/)

### 1. AI CORE - DEZE WERKEN AL PERFECT
- `components/ai-quote-form.tsx` - Het complete AI formulier (807 regels, werkt!)
- `components/photo-upload.tsx` - Foto upload met drag & drop
- `app/api/analyze/route.ts` - Google Gemini image analyse
- `app/api/generate-kozijn-preview/route.ts` - AI preview generatie
- `app/api/upload/route.ts` - Vercel Blob upload
- `lib/pricing/ai-calculator.ts` - Prijsberekening logica

### 2. DEPENDENCIES NODIG
```json
"@google/genai": "1.27.0",
"@vercel/blob": "2.0.0"
```

### 3. ENV VARS NODIG
```
GOOGLE_GENERATIVE_AI_API_KEY=... (user heeft deze al)
BLOB_READ_WRITE_TOKEN=... (user heeft deze al)
```

---

## WAT USER GAAT DOEN

1. V0 project maken met prompt voor SaaS platform met auth
2. V0 genereert: auth, database schema, dashboard, UI
3. User exporteert v0 project en importeert AI files erin
4. User komt terug naar jou

---

## WAT JIJ MOET DOEN ALS USER TERUGKOMT

### STAP 1: INSPECTEER V0 PROJECT
- Welke database? (Prisma/Drizzle/Supabase?)
- Welke auth? (NextAuth/Clerk/Supabase?)
- Waar zijn routes? (app router?)
- Database schema voor: companies, users, leads, widgets

### STAP 2: INTEGREER AI FILES

#### A. Kopieer components
```bash
cp EXPORT_FOR_V0/components/* [v0-project]/components/
```

#### B. Kopieer API routes
```bash
cp -r EXPORT_FOR_V0/api/* [v0-project]/app/api/
```

#### C. Fix imports
Check of alle imports kloppen. Vooral:
- `@/components/ui/*` → moeten bestaan in v0 project
- `@/lib/utils` → moet bestaan

#### D. Update `app/api/leads/route.ts`
Deze file moet leads opslaan. Pas aan voor v0's database:

**Als Prisma:**
```typescript
await prisma.lead.create({
  data: {
    companyId,
    naam,
    email,
    // ... rest
  }
})
```

**Als Drizzle:**
```typescript
await db.insert(leads).values({
  company_id: companyId,
  naam,
  email,
  // ... rest
})
```

**Als Supabase (hopelijk niet):**
```typescript
await supabase.from('leads').insert({ ... })
```

### STAP 3: MAAK DEMO PAGINA

Maak `app/demo/page.tsx`:
```typescript
'use client'
import { AIQuoteForm } from '@/components/ai-quote-form'

export default function DemoPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">AI Quote Demo</h1>
      <AIQuoteForm />
    </div>
  )
}
```

### STAP 4: MAAK WIDGET EMBED

Maak `app/widget/[companyId]/page.tsx`:
```typescript
import { AIQuoteForm } from '@/components/ai-quote-form'

export default function WidgetPage({ 
  params 
}: { 
  params: { companyId: string } 
}) {
  return <AIQuoteForm companyId={params.companyId} />
}
```

### STAP 5: UPDATE DASHBOARD

Voeg leads overzicht toe aan dashboard:
- Fetch leads uit database voor ingelogde company
- Toon in tabel: naam, email, quote bedrag, status, datum

### STAP 6: WIDGET SETTINGS PAGINA

Maak `/settings/widget` pagina waar company:
- Embed code kan kopieren
- Widget kan customizen (kleuren, tekst)
- Widget aan/uit kan zetten

---

## BELANGRIJKE OPMERKINGEN

1. **AIQuoteForm werkt al perfect** - NIET aanpassen, alleen importeren
2. **Alle API routes werken** - alleen database calls in leads route aanpassen
3. **User heeft GEEN geduld meer** - focus op snel werkend resultaat
4. **Test eerst /demo** - moet direct werken zonder auth
5. **Dan pas auth flow** - signup → dashboard moet vlekkeloos

---

## DATABASE SCHEMA DIE V0 MOET HEBBEN

```sql
-- companies
id, name, email, slug, subscription_plan, created_at

-- users  
id, company_id, email, name, role, created_at

-- leads
id, company_id, naam, email, telefoon, materiaal, kleur, kozijn_type,
glas_type, aantal_ramen, vierkante_meter_ramen, montage, afvoer_oude_kozijnen,
quote_total, quote_breakdown (JSON), photo_urls (JSON), preview_urls (JSON),
status, source, created_at

-- widgets
id, company_id, display_mode, primary_color, button_text, is_active, created_at
```

---

## SUCCESS CRITERIA

✅ User kan inloggen (v0 auth)
✅ Na login ziet dashboard met stats
✅ `/demo` werkt - AI form functionaliteit
✅ Lead submission werkt en komt in database
✅ Dashboard toont leads voor de company
✅ Widget embed code wordt gegenereerd

---

## ALS ER PROBLEMEN ZIJN

1. **Import errors** → Check of alle UI components bestaan in v0 project
2. **Database errors** → Check schema en gebruik juiste ORM syntax
3. **Auth errors** → Gebruik v0's auth, touch niet aan
4. **API errors** → Check env vars zijn gezet in Vercel

**GEEN experimenten. GEEN switches. Gebruik wat v0 geeft + integreer AI files.**

---

## FINAL NOTE

User heeft al geld verloren aan deze dev tijd. Hij verwacht:
- Snel werkend resultaat
- Geen gedoe met auth
- Focus op kernfunctionaliteit
- Professional approach

Doe het goed, doe het snel, test grondig voor je push.

