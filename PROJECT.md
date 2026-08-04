# FINDAM — Project Context

## Mission
Verified artisan/service directory for Port Harcourt. Users find a TRUSTED artisan in
2 minutes, free forever. Artisans pay ~N1,500/month once leads flow. The moat is not
code — it is physical vetting: we meet every artisan, inspect work, call references.
Long-term: trust platform for PH services (artisans first; shortlets, riders later).

## Business model
- Users: free forever.
- Artisans: free at launch (first 25-30 hand-vetted by Prince). Charge N1,000-N2,000/mo
  via Paystack AFTER leads are proven. Show them "X views, Y WhatsApp taps this week."
- Every contact routes through us first (log the lead) then opens WhatsApp.

## Stack
Next.js (App Router, Turbopack) + TypeScript + Tailwind v4 + Prisma + Neon Postgres +
Vercel + Resend + Vercel Blob. Paystack LATER (subscriptions). Framer Motion added
when first client components land.

## Design system ("premium that flies")
LIGHT theme. Trust = deep green. Speed IS the luxury: every page fast on cheap
Androids + slow data. CSS depth (layered shadows + inset highlights), serif+sans.
- Palette: bone #FAF7F2 bg · ink #14201B · green #0F6E56 · deep green #0A4A3A ·
  mint #E4F5EE · gold (stars) #B78A2E
- Fonts: Fraunces (serif display) + Inter (sans) via next/font
- Utilities in globals.css: fa-surface, fa-btn, fa-badge, fa-rise (staggered reveal)
- Rules: no flat cards · big tap targets · WhatsApp green CTA is the hero action on
  every screen · skeleton screens · next/image always · target <300KB first load

## v1 scope (from approved mockups)
Landing (search + category tiles + featured artisans + trust strip) · Category list
(cards: photo, verified badge, rating, jobs count, areas, response time) · Artisan
profile (verification card WITH DATE + what we checked, work gallery, price guide
"from N...", reviews, giant WhatsApp CTA) · "Request an artisan" form (demand
research) · Lead logging (tap -> log -> wa.me redirect) · Artisan dashboard v0
(views + taps this week) · Admin panel for Prince (add/vet artisans).
NOT in v1: in-app payments, booking, chat. Nigerians close deals on WhatsApp.

## Working method (sacred)
Paste-ready PowerShell blocks. PROJECT.md updated every session, attached at session
start. Never patch a file not read fresh (Get-Content file | clip -> paste to chat).
Full-file rewrites over regex on fragile files; snapshot first (Copy-Item). NEVER
greedy multiline regex. Paths with [brackets] need -LiteralPath or [System.IO.File]::.
Verify every patch with Select-String BEFORE building; zero hits = STOP.
Every change ends: Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue; npm run build

## Discovery (parallel, Prince's legs)
Count "who knows a good X" messages in PH groups -> ranks launch categories.
Interview 5 users + 5 artisans; their words become landing copy. Vet first artisans
in person: workshop visit, 2 jobs inspected, 2 references called, ID confirmed.

## Session log
- Day 1: repo born, PROJECT.md v1, design system in globals.css, landing page v1 live
  on localhost. Name: FindAm (working).
## SESSION LOG — Day 1 (4 Aug 2026) — THE BIRTH
- Repo born: Next.js 16 + TS + Tailwind v4 + Framer Motion. Clean builds throughout.
- Landing page v5 LIVE on localhost, scored 7/10 by Prince (from 5/10 v3).
- Design system in globals.css: fa-fluff (thick pillowy cards), fa-photo, fa-panel,
  fa-marquee ticker, fa-orb, fa-grad-text, fa-float, texture background.
- Brand: FA monogram logo (AI-generated, v2) mounted nav+footer via /brand/logo-mark.png.
  FINAL SVG FORGE STILL PENDING (dedicated session). 4 brand images in /public/images.
- REFACTOR DONE: src/components (Logo, Icons, Motion, SiteHeader, SiteFooter) +
  src/lib/data.ts (all placeholder content; will be replaced by Prisma queries).
- Word chosen: "pro" (not artisan). WhatsApp: DIRECT to pro (wa.me links, placeholder
  numbers). Routed/logged version = later.
- STRATEGY LOCKED: architect for Nigeria (State->Area everywhere, /[state]/[category]
  URLs), launch PH-only. Other states get waitlist pages; waitlist counts choose the
  next city. Long-tail: search by tags, failed search -> "request it" form, all demand
  logged. Verifier-partner (franchise) model noted for national vetting later.
- GOTCHAS ADDED: (1) Framer Motion easing arrays in standalone variant objects need
  `Variants` type annotation. (2) [System.IO.File]:: methods ALWAYS need $PWD or full
  path — they do not follow PowerShell's current directory.
- HONESTY FLAGS: ticker, stats, vetted counts, testimonials, pro photos = ASPIRATIONAL
  PLACEHOLDERS. Must be real or clearly marked "preview" before anything goes public.
  AI faces MUST be replaced by real vetted pros before launch (trust platform!).

## NEXT SESSION — THE BRAIN
1. Prisma + Neon: schema State, Area, Category (with tags), Pro, Lead, ServiceRequest,
   StateWaitlist. Additive migrations only, same discipline as Story Box.
2. Seed Rivers + PH areas + 6 categories. Homepage reads from DB instead of data.ts.
3. /[state]/[category] listing page + /pro/[slug] profile page (the killer verification
   card with date + what we checked).
4. Working search (tags) + no-dead-end request form + lead logging on WhatsApp taps.
PARALLEL (Prince's legs): count "who knows a good X" in PH groups · interview 5 users +
5 pros · vet pro #1 in person · photograph real pros (golden light, editorial style).

## SESSION LOG — Day 2 (4 Aug 2026, evening) — THE BRAIN
- BATTLE: npm installed Prisma 7 -> P1012 (url no longer in schema). Downgraded to
  Prisma 6 (npm install prisma@6 @prisma/client@6). v7 prisma init left TWO landmines:
  (1) prisma.config.ts hijacks v6 + skips .env loading — DELETED (backup kept);
  (2) it OVERWROTE .env with prisma+postgres://localhost URL — replaced with real Neon.
- SCARE: Neon endpoint named ep-withered-hall (same word as Story Box DB!). Verified
  identity with `npx prisma db pull --print --url "..."` -> P4001 empty DB = fresh,
  safe. Endpoint names are RANDOM — verify by introspection, never by name.
- Neon "findam" DB created via Vercel Storage (store: neon-coral-village), attached
  to find-am project. Env auto-injected in Vercel.
- Migration `init` applied: State, Area, Category, Pro, ProArea, Review, Lead,
  ServiceRequest, SearchLog, StateWaitlist. Prisma Client v6.19.3 generated.
- Seed (prisma/seed.ts, run with npx tsx): Rivers (isLive), 10 PH areas, 7 categories
  (incl. Musicians for long-tail), 3 vetted pros with vetting notes/dates, 1 verified
  review (Mrs. Adaeze -> Chinedu).
- HOMEPAGE NOW DB-DRIVEN: page.tsx = server component (prisma queries, revalidate 60)
  -> HomeView.tsx client component (all Framer Motion preserved). Real vetted counts,
  real review averages, Musicians appeared automatically. data.ts still supplies
  ticker/voices/chips/icons (placeholder content + icon map).
- GOTCHAS ADDED: Prisma 6 pin (v7 config format) · delete v7 prisma.config.ts ·
  v7 init overwrites .env · verify DB identity via db pull --print · GitHub repo is
  PUBLIC — no business-sensitive notes in this file.
- SECURITY DEBT: DB password was pasted in chat — RESET NEON PASSWORD + update .env
  (+ Vercel env) at next session start. Repo: github.com/Princeeze744/Find-Am (main).

## NEXT SESSION — THE LIMBS
1. Neon password reset (security debt) + Vercel deploy: verify postinstall "prisma
   generate" in package.json (Story Box lesson: Vercel builds need it), confirm env
   vars in Production, deploy, smoke test live URL.
2. /[state]/[category] listing pages + /pro/[slug] profile (verification card with
   real vettedAt + vettedNotes).
3. Working search (name/trade/tags) + SearchLog + no-dead-end ServiceRequest form.
4. Lead logging: WhatsApp tap -> POST /api/lead -> wa.me redirect.
PARALLEL (Prince): discovery count · interviews · vet pro #1 · real photos.
