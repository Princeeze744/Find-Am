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

## SESSION LOG — Day 3 (4-5 Aug 2026) — THE ORGANS
- /join application pipeline: form (socials, video intro link, price guide, area chips)
  -> /api/join -> Pro status:pending, INVISIBLE until approved. Schema grew: videoUrl,
  instagram, facebook, tiktok, workPhotos (migration pro_application_fields).
- /request concierge: describe need + area + phone (NO account needed - deliberate)
  -> ServiceRequest table. Prefills from failed searches via ?need= param.
- /admin THRONE ROOM: key-gated (ADMIN_KEY in .env + Vercel), stats cards, pending
  queue w/ approve(vettedAt+notes)/reject, service requests w/ mark-handled, full pro
  census w/ lead counts, recent leads, recent searches. FIRST CORONATION DONE: Test
  Welder approved end-to-end (form -> queue -> approve -> live public profile).
- /search LIVING: matches name/trade/pro tags/category name+tags (fuzzy nets by
  design - "drummer" returns Musicians; ranking/grouping polish queued). Every query
  logged to SearchLog w/ result count. Zero results -> no-dead-end request funnel.
  Confirmed live: "hair stylist" 0 results -> logged as recruitment order.
- LEAD COUNTER: WhatsAppButton component (sendBeacon, zero user delay) on all 5
  surfaces w/ source tags: home_card/category_card/profile_top/profile_bottom/
  search_card. The number that sells the N1,500/month.
- NAV: sliding mint pill (layoutId spring) desktop, full-screen deep-green cascade
  menu mobile. Homepage hides empty categories (auto-appear on first approval).
- HeroRotator: crossfade+zoom stage (electrician/plumber/keyboardist), trade badge,
  progress pills. Ezekiel got real portrait. New images: join-hero, admin-ledger,
  success-shield (mount pending), plumber-portrait.
- GOTCHAS ADDED: Add-Content onto file w/o trailing newline GLUES onto last line
  (broke DATABASE_URL w/ ADMIN_KEY) - rewrite .env whole, verify line count ·
  lone <a eaten by paste AGAIN (WhatsAppButton) - the ledger rule is law ·
  dev server reads .env at STARTUP ONLY - restart after every env change ·
  AI "transparent" images are fake (JPEG checkerboard painted in) - icons/logo are
  hand-coded SVG territory, AI does photos/illustrations only.
- STRATEGY LOCKED THIS SESSION: requesters NEVER pay to browse/request; concierge
  offline-hunt = N1,000-2,000 success fee only. NOBODY unvetted ever gets connected
  (even offline finds get fast-track vet: ID + 2 reference calls + notes). Offline
  pros get profiles created FOR them after first job. Shadow list = recruitment
  war chest. Cold start = demand manufactures supply ("do things that don't scale").
  No social scraping (ToS/NDPR/garbage data) - human intelligence network instead.

## NEXT PHASE — THE SENSES + POLISH
1. Area lat/lng migration -> "near me" sorting (browser geolocation, free) ->
   Leaflet+OSM coverage maps (NO Google billing at v1; Places autocomplete later).
2. Admin: WhatsApp notification to Prince on new request/application · open/handled
   tabs · "Mark found -> copy WhatsApp template" button · prospects (shadow list) table.
3. Search polish: exact matches first, "Related pros in X" grouping label.
4. Design pass: success-shield mounted on received cards · blur placeholders ·
   loading="eager" LCP · data-scroll-behavior · nav active states on all pages.
5. Logo forge session: hand-built SVG monogram + draw-on animation + favicon + OG.
6. LAUNCH DEBT (before ANY public sharing): real pros replace AI faces · ticker/
   voices/stats become real or clearly badged "preview" · test data cleaned ·
   Vercel env has ADMIN_KEY (done?) · live smoke test on phone.
PARALLEL (Prince): vet pro #1 FOR REAL · discovery counting · shadow list starts ·
photograph real pros golden-hour style.

## SESSION LOG — Day 4 (5 Aug 2026) — IDENTITY + THE NATION
- PRO AUTH LIVE: phone+OTP login (Option B: codes relay via admin panel w/ one-tap
  WhatsApp copy; Termii upgrade slot ready). httpOnly cookie fa-pro, 30-day session.
  /pro-login page, /api/pro-auth (request/verify/logout), /api/pro-session.
- DASHBOARD v1: stats (profileViews, taps this week via Lead, all-time, rating),
  details read-only, View my profile. Self-editing = next build. LogoutButton.
- SESSION-AWARE UI: nav swaps "Pro sign in"<->"My dashboard" (fetches pro-session).
  Pro profile recognizes owner: bottom panel becomes "This is your public profile ->
  Open my dashboard" instead of self-messaging CTA (the "Prince messages himself" fix).
- WORK GALLERY on profiles: workPhotos URLs -> grid; direct images render, other
  links become "View work" tiles. NOTE: external image domains may need
  next.config.ts whitelist when pros paste real URLs.
- NIGERIA SEEDED: 37 states (36+FCT), ~190 areas, only Rivers isLive. willTravel
  on Pro (migration will_travel). State-aware UI = next phase.
- profileViews increments on every profile visit (fire-and-forget).
- FIRST REAL PRO: Prince (pianist, Ada George) applied + vetted via full pipeline.
- RESEARCH SYNTHESIS (Fiverr/Upwork/Thumbtack/UrbanCompany): our identity =
  Fiverr storefront x UrbanCompany quality x Thumbtack lead economics, WhatsApp-
  first. "Trust is the product." Visual-first (photos before names) = priority 1.
  Pro dependency tools = priority 2. Thumbtack $3.2B validates pay-for-leads.
- GOTCHAS ADDED: -Path vs -LiteralPath on [slug] BIT US AGAIN (Claude's own error) ·
  never build mid-surgery (open ternary = JSX parse death) · multi-part patches on
  shifted files -> read whole section, rewrite in one stroke · when a patch pair
  half-lands, diagnose by reading before re-patching.
- OTP-AT-SCALE ANSWERED: manual relay = bootstrap only; Termii slots in with one
  change when real signups flow. Session cookie holds raw proId - upgrade to signed
  token before money flows (SECURITY DEBT).

## NEXT — THE FURNITURE PHASE
1. Dashboard self-editing (bio/prices/tags/areas instant; photos/video flag for
   review). 2. Sleek Picker component (bottom sheet) kills native dropdowns.
3. State picker + state-aware home/search (Nigeria UI). 4. Review capture flow
   (lead-tied, verified). 5. 10 hero images from Prince -> rotator. 6. Session-aware
   "My dashboard" on bottom mobile bar too. 7. Vercel env sanity: ADMIN_KEY present,
   redeploy done? LAUNCH DEBT list still stands.

## SESSION LOG — Day 4 continued — THE VISUAL-FIRST ERA
- 11 brand portraits added (/public/images/pros): mc, makeup, carpenter, doctor,
  lawyer x2, cleaner, decorator, electrician2, handshake2, vetting (verifier with
  clipboard in workshop = THE trust image, now on the trust section throne).
- HeroRotator expanded to 7 trades. NEW: film strip parade ("Whoever you need.
  Vetted.") - drifting portrait gallery, hover-lift. NEW: golden dust particles
  (pure CSS, reduced-motion safe). Owner-view profile fix + work gallery live.
- Session-aware nav certified. All pushed; live deploy carries full atmosphere.
- BENCH NEXT: dashboard self-editing · sleek Picker (kill native dropdowns) ·
  state picker Nigeria UI · review capture · logo forge · launch debt.
