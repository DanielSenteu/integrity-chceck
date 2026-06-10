# Integrity Check Limited — Website Build Plan

> A world-class, performant brochure site for an institutional advisory firm.
> Brochure-only (no forms, no backend). Static, fast, secure, and visually stunning.
> Modeled on the DoveNest build discipline, but elevated.

---

## 0. The brief in one paragraph

**Integrity Check Limited** is a Nairobi-based advisory firm (est. 11 May 2012,
Reg. CPR/2012/73642, KRA P051448573S) specializing in **risk, governance,
institutional strengthening, and capacity development** for government, NGOs,
development partners, and corporates. Positioning: *Advisory | Risk | Institutional
Capacity*. Tagline: **"Clarity in Risk. Strength in Decisions."** The site must
read as an **institutional advisory firm with depth** — boardroom-level, not a
"small consultancy" or a flyer. The whole job is a **perception upgrade**: "the
company that looks structured wins."

---

## 1. Brand system (locked from the client's FULL BRAND SYSTEM doc)

### Colors — rule: **80% navy/white · 15% grey · 5% green**
| Token | Hex | Use |
|---|---|---|
| `--navy` | `#0B1F3A` | Primary — bg blocks, headers, footer |
| `--green` | `#1F7A63` | Accent ONLY (5%) — lines, highlights, hovers, the "check" |
| `--grey-bg` | `#F4F6F8` | Light section backgrounds |
| `--grey-silver` | `#B0B7C3` | Secondary text, dividers, sub-lines |
| `--text` | `#4A4A4A` | Body text on light |
| `--white` | `#FFFFFF` | Space, text on navy |

Discipline note: green is a **scalpel, not a paintbrush**. Overusing it cheapens
the brand. One green accent per viewport is the target.

### Type
- **Playfair Display** — page/section titles (the "formal/executive" voice).
- **Poppins** — headings, eyebrows, UI, buttons.
- **Montserrat** — body copy.
- Load via Google Fonts with `preconnect` + `display=swap`, subset to weights used.

### Logo
- Concept: **Shield + Checkmark + structured grid lines** (Shield = governance,
  Check = integrity/assurance, Grid = systems/institutions).
- ⚠️ `integerety-logo.jpeg` in the source folder is **0 bytes** (OneDrive not synced).
  **Action needed:** obtain the real logo file, OR rebuild the shield+check mark as
  clean inline SVG (recommended anyway — it lets us animate a "draw-on" and serve a
  crisp favicon/watermark/monochrome variant from one source).
- Variations required: full (icon+name+tagline), horizontal, icon-only (favicon/
  watermark), monochrome.

### Voice (non-negotiable from the brand doc)
Use: *institutional resilience, decision-making discipline, governance integrity,
operational risk alignment, execution-focused advisory.*
Avoid: *"we offer services," "we provide solutions,"* anything that reads retail/
flyer/trainer. Short, direct, executive. Never overcrowd. Never look like a brochure.

---

## 2. Tech stack (CTO recommendation)

**Vanilla HTML + modern CSS + a focused dose of GSAP. No framework.**

Rationale: it's a static brochure with no app state, no forms, no backend. React/
Next would add hydration cost and bundle weight that *hurt* Core Web Vitals and buy
nothing. We get Awwwards-tier motion with a tiny JS footprint.

| Layer | Choice | Notes |
|---|---|---|
| Markup | Static HTML, one file per page | Shared partials for nav/footer, synced by a tiny build script (the DoveNest `build.js` pattern) so chrome never drifts |
| Styles | Modern CSS, single `shared-site.css` + design tokens | **No per-page inline `<style>` bloat** (DoveNest's #1 debt — we avoid it from day one). CSS custom properties for the palette. |
| Scroll reveals / parallax | **Native CSS scroll-driven animations** (`animation-timeline: view()/scroll()`) | Free performance, off main thread. Author static *end-states* so Firefox-stable degrades gracefully. |
| Signature motion | **GSAP** (core + ScrollTrigger + SplitText + DrawSVG) | 100% free since Apr 2025 (Webflow acquired GreenSock). ~23KB core + small plugins. Hero reveal, pinned process timeline, logo draw-on, magnetic buttons, stat count-ups. |
| Smooth scroll | **Lenis** (~3KB), desktop only | Gated behind `prefers-reduced-motion` and touch checks. The single biggest "agency-grade" feel upgrade. |
| Grain/mesh | SVG `feTurbulence` + CSS gradients | Static overlay, cheap. |
| Hero video | **Remotion-rendered brand loop** (see §6) | Plus optional free stock skyline fallback. |
| Build/tooling | Tiny Node script: nav/footer sync + image optimization + minify | Fixes DoveNest debts #1, #3, #4 (drifting chrome, 13MB images, no pipeline) preemptively. |
| Deploy | Static host (Netlify / Cloudflare Pages / GitHub Pages / Render static) | Cache-hashed assets, immutable headers. |

---

## 3. Site architecture (pages)

The brand doc's website structure is: Home · About · Services · Work/Capability ·
Contact. We elevate to a tight, premium set:

1. **Home** — the showcase (hero → who we are → how we work → services → differentiation → directors teaser → approach → clients/CTA).
2. **About** — company story, philosophy ("Risk is a decision-making reality…"), differentiation, full approach.
3. **Services** — the 4 core lines in depth (Advisory & Consultancy · Training & Capacity · Due Diligence & Integrity · Monitoring & Evaluation).
4. **Leadership / Directors** — Kennedy Mong'are Mogaka & Andrew Maranga Kerandi (needs real headshots).
5. **Capability / Work** — case-style summaries + the 1-page capability statement as a tender-ready section.
6. **Contact** — address, email, phone, map, **no form** (or a `mailto:`-only CTA). Nairobi, Kenya · info@integritycheck.co.ke · www.integritycheck.co.ke · +254 725 000 000.

Single-sourced **nav** and **footer** partials from day one. Per-page `<title>`,
meta description, Open Graph image (use the brand cover), and a JSON-LD
`Organization` block for SEO.

---

## 4. Homepage — section-by-section design + motion choreography

> Each section lists: the content, the visual, and the **signature animation**.
> All motion respects `prefers-reduced-motion` (static end-state shown instead).

**S1 · Hero**
- Content: eyebrow `ADVISORY | RISK | INSTITUTIONAL CAPACITY`; H1 (Playfair)
  *"Clarity in Risk. Strength in Decisions."*; sub-line from About Us; one primary
  CTA *"Speak to an Advisor"* + ghost CTA *"Our Capability."*
- Visual: **Remotion brand loop** (shield/grid ambient, §6) OR Nairobi-dusk stock
  video, navy diagonal overlay (echoes the brand-board cover), subtle grain.
- Motion: **SplitText line-mask reveal** of the H1 (words rise out of `overflow:hidden`
  masks, staggered) — reads far more premium than a fade. Logo **draws itself on**
  (DrawSVG shield → check). Scroll-cue chevron. Nav fades from transparent → solid navy on scroll.

**S2 · Who We Are** ("Your advisory firm is only as good as its last decision")
- Content: the About Us paragraph + 3 proof chips (Trusted by Institutions ·
  Execution-Focused · Measurable Impact) — straight from the brand board.
- Motion: reveal-on-scroll (native `view()`), the 3 chips stagger in; an emerald
  hairline draws left-to-right under the heading (DrawSVG).

**S3 · How We Work** — the showpiece
- Content: the 5-step approach **Diagnose → Analyze → Align → Execute → Sustain**
  with one line each (Understand gaps → Identify risks → Structure solutions →
  Implement → Ensure continuity).
- Motion: **scroll-pinned timeline.** Section pins; as you scroll, each node
  springs in, its label fades up, and an **SVG connector line draws** to the next
  node (DrawSVG `strokeDashoffset`). A progress rail fills emerald beneath all five.
  This is the single most impressive moment on the site.

**S4 · Services** (4-card grid)
- Content: Advisory & Consultancy · Training & Capacity Building · Due Diligence &
  Integrity · Monitoring & Evaluation — each with its 3 bullets and an icon.
- Motion: cards reveal in a staggered grid; **magnetic hover** (card lifts, emerald
  edge-line draws, icon micro-animates); cursor-follow on desktop (pointer:fine only).

**S5 · Differentiation** ("Why Integrity Check")
- Content: the 5 differentiators with check icons; background = compass / summit
  metaphor (direction & leadership).
- Motion: parallax background layer (native `scroll()`); check icons stroke-in one
  by one; optional number **count-ups** if we add a stats strip (20,000+ supported /
  10+ years / multi-sector).

**S6 · Leadership teaser**
- Content: two director cards (photo, name, role) → link to full Leadership page.
- Motion: subtle reveal; duotone-navy photo treatment that resolves to full color on hover.

**S7 · Clients / Partners**
- Content: "We serve government, regional bodies, NGOs & development partners,
  corporates." Logo/sector row.
- Motion: seamless **marquee ticker** (CSS, pause on hover, pause on reduced-motion).

**S8 · Closing CTA + Footer**
- Content: *"Our Commitment — we support institutions in building disciplined,
  resilient, high-performing systems that deliver sustainable results."* + contact.
- Visual: Nairobi golden-hour video/still, navy overlay.
- Motion: text reveal; magnetic CTA button.

**Signature effects palette** (used sparingly, consistently):
hero line-mask reveal · logo DrawSVG draw-on · scroll-pinned process · magnetic
buttons · count-ups · animated grain/mesh · marquee · cursor-follow (desktop).

---

## 5. Free, license-verified stock assets (every URL fetched & confirmed)

### Video (lead with **Pexels** — free commercial, no attribution)
**Hero / skyline**
- Nairobi sunset aerial — https://www.pexels.com/video/sunset-over-nairobi-cityscape-aerial-view-29069413/ (HD60, authentic Kenya — **top pick**)
- Modern cityscape at dusk — https://www.pexels.com/video/aerial-view-of-a-modern-cityscape-4514359/ (UHD)
- City at dusk (twilight) — https://www.pexels.com/video/view-of-city-at-dusk-2019781/ (4K)

**Boardroom / "How We Work"**
- Business meeting discussion — https://www.pexels.com/video/a-group-of-people-discussing-in-a-business-meeting-6774633/ (UHD)
- Multicultural meeting — https://www.pexels.com/video/group-of-people-discussing-in-a-business-meeting-3252780/ (UHD)
- Presentation w/ graphs (Mixkit, **4K, fully free commercial**) — https://mixkit.co/free-stock-video/presentation-in-a-business-meeting-room-42643/

**Abstract dividers / overlays (navy-gradeable)**
- Blue particle wave, dark bg — https://www.pexels.com/video/animated-abstract-blue-glowing-line-particles-wave-dark-background-abstract-pattern-futuristic-hi-tech-particles-background-28561463/
- Seamless particle tunnel loop — https://www.pexels.com/video/luminous-particles-loop-with-tunnel-effect-11354070/

**Differentiation (compass / window)**
- Close-up compass — https://www.pexels.com/video/close-up-view-of-a-compass-1793508/
- City through window — https://www.pexels.com/video/view-of-the-city-from-the-window-4203949/

> ⚠️ Do NOT use (Mixkit *Restricted* — 720p personal only): handshake `25253`, blue-particle `8221`.
> Coverr clip pages are now mostly iStock-sponsored; no stable free links — skip.

### Images (license-free: Unsplash / Pexels, no attribution)
- Hero Nairobi dusk — https://www.pexels.com/photo/stunning-nairobi-skyline-at-dusk-29069329/
- Nairobi panorama — https://unsplash.com/photos/a-cityscape-of-nairobi-kenya-on-a-sunny-day-IaJm3mq0F5o
- Glass facade (brand-board motif) — https://unsplash.com/photos/glass-facade-of-a-modern-office-building-V5vF94h52r0
- Service · advisory/docs — https://unsplash.com/photos/person-using-macbook-pro-on-table-5fNmWej4tAA
- Service · due diligence/handshake — https://www.pexels.com/photo/photo-of-people-shaking-hands-8112186/
- Service · M&E/analytics — https://unsplash.com/photos/graphs-of-performance-analytics-on-a-laptop-screen-JKUTrJ4vK00
- Browse pages (hand-pick): training `unsplash.com/s/photos/corporate-training` · audit `/s/photos/audit` · summit `/s/photos/mountain-summit` · navy texture `/s/photos/dark-blue-background` · NGO `/s/photos/african-community`

> ⚠️ Paid (Unsplash+/Getty) — avoid: `jmB5vOfrn98`, `xZ5XKHJBVus`, `u1g8T9iB6aw`.
> **Director headshots must be REAL photos of Kennedy & Andrew** — stock faces only as build-time scaffolding, never in production.

---

## 6. Remotion brand intro video (the "wow" asset)

Reuse the **known-working DoveNest scaffold**: Remotion **4.0.448**, Node 24,
React 18, **fps 30**, SVG-driven, `index.ts → registerRoot(Root)`, config sets
`setVideoImageFormat('jpeg')` + `setOverwriteOutput(true)`. New project at
`integrity-check/animation/`.

**Three compositions from one codebase** (responsive via `useVideoConfig()`):
| id | size | frames | purpose |
|---|---|---|---|
| `IntegrityIntro` | 1920×1080 | 480 (16s) | full cinematic intro + audio |
| `IntegrityHeroLoop` | 1920×1080 | 240 (8s) | **seamless silent website hero bg** |
| `IntegrityVertical` | 1080×1920 | 480 | social/reels |

**Storyboard (16s, cross-dissolved Sequences):**
1. 0–2s — navy bg, **grid lines draw in** from center (structure).
2. 1.5–5.5s — **shield outline draws** (emerald), then **checkmark strokes in**, emerald glow "confirm" pulse.
3. 5–8s — **diagonal emerald accent sweep**; **"INTEGRITY CHECK"** rises word-by-word (Playfair), "LIMITED" in silver; shield docks to corner.
4. 7.5–10.5s — tagline **"Clarity in Risk. Strength in Decisions."** word-by-word, blur-to-sharp; emerald underline draws.
5. 10–14s — **Diagnose → Analyze → Align → Execute → Sustain** via `<Series>`: nodes spring in, connectors draw, progress rail fills.
6. 13.5–16s — final **logo lockup** + tagline + positioning line; gentle breathing glow holds.

**APIs:** `Sequence`/`Series`, `useCurrentFrame`/`useVideoConfig`, `interpolate`
(+`Easing.bezier`), `spring`, `interpolateColors` (navy→emerald), SVG
`strokeDashoffset` with `pathLength={1}` for all line-draws, `@remotion/google-fonts`
for Playfair/Poppins/Montserrat, `<Audio src={staticFile('track.mp3')}>` with
volume fades.

**Hero loop** = scenes stripped to ambient grid drift + breathing shield, built on
**modulo/`Math.sin` of `frame/durationInFrames`** (DoveNest "laps" trick) so frame
240 == frame 0 — perfectly seamless under browser `loop`.

**Audio (free, no attribution):** Pixabay Music ("inspiring corporate"/"cinematic"),
YouTube Audio Library, or Free Music Archive. Sync the **check "snap"** and **final
lockup** to musical accents.

**Render:**
```
npx remotion render src/index.ts IntegrityIntro     ../videos/integrity-intro-1080p.mp4 --codec h264 --jpeg-quality 100 --overwrite
npx remotion render src/index.ts IntegrityHeroLoop  ../videos/integrity-hero-loop.webm  --codec vp9  --crf 30 --muted --overwrite
npx remotion render src/index.ts IntegrityHeroLoop  ../videos/integrity-hero-loop.mp4   --codec h264 --crf 23 --muted --overwrite
```
HTML hero: `<video autoplay muted loop playsinline poster=...>` with WebM + MP4 sources.

**Gotchas:** create `animation/public/` before `staticFile()`; load fonts
deterministically (don't rely on bare `@font-face`); always clamp `interpolate`;
`spring` needs `fps`; h264 has no alpha (ProRes/qtrle if a transparent lockup is
needed); keep the loop composition free of one-shot `spring`/`interpolate`.

---

## 7. Performance & accessibility guardrails

- Animate **`transform`/`opacity` only**; never `width/height/top/left`. `will-change`
  applied just-in-time and removed after.
- **`prefers-reduced-motion`**: progressive (opt-in) pattern — static styles by
  default, motion only inside `@media (... no-preference)`; mirror in JS (disable
  Lenis, magnetic, cursor, marquee; reveal content instantly).
- **LCP**: hero headline/image renders visible — never gated behind a JS reveal.
  Video/Lottie must not be the LCP.
- **Lazy-load video**: `preload="none"`/`metadata`, poster, `muted playsinline loop`,
  IntersectionObserver before `.play()`; desktop-gated.
- **Images**: optimized, responsive `srcset`, AVIF/WebP, width/height set (no CLS),
  lazy below the fold. Target <200KB hero, fixing DoveNest's 13MB problem.
- Mobile: drop smooth scroll, parallax, cursor; `(pointer:fine)` gates magnetic/cursor.
- Targets: **Lighthouse 95+** across the board, LCP < 2.0s, CLS < 0.05, INP < 200ms.

---

## 8. Security (brochure site — small surface, still hardened)

No inputs = no honeypot/CSRF/rate-limit needed (unlike DoveNest). Focus on the
static-site attack surface:
- **Security headers**: `Content-Security-Policy` (lock script/style/img/media/font
  to self + the specific CDNs we use), `Strict-Transport-Security`, `X-Content-Type-
  Options: nosniff`, `X-Frame-Options: DENY` (or `frame-ancestors 'none'`),
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` locking
  down camera/mic/geo.
- **Subresource Integrity (SRI)** + `crossorigin` on any CDN scripts (GSAP/Lenis),
  or self-host them (preferred — also faster and CSP-simpler).
- HTTPS only, HSTS preload. No secrets in the repo (no `.env` needed here).
- `rel="noopener noreferrer"` on external links. Sanitize nothing dynamic because
  nothing is dynamic — keep it that way.
- Dependency hygiene: pin versions, minimal deps, `npm audit` in CI.

---

## 9. Build phases

1. **Foundation** — repo, design tokens, `shared-site.css`, nav/footer partials +
   build script, fonts, favicon/logo SVG, base layout + one page end-to-end.
2. **Content pages** — Home (all sections, static), About, Services, Leadership,
   Capability, Contact. Real copy from the profile docs.
3. **Motion layer** — GSAP + Lenis wiring, hero reveal, scroll-pinned process,
   magnetic/marquee/count-ups, native scroll reveals, reduced-motion pass.
4. **Remotion video** — scaffold, build the 3 compositions, render hero loop + intro,
   wire into hero.
5. **Assets** — download/optimize chosen stock, real director headshots, OG images.
6. **Polish & ship** — Lighthouse pass, a11y audit, security headers, SEO/JSON-LD,
   deploy with cache-hashing.

---

## 10. Open items needing the client / you

- [ ] **Real logo file** (current one is 0 bytes) — or approve rebuilding as SVG.
- [ ] **Director headshots** (Kennedy, Andrew) — required before launch.
- [ ] Confirm **phone number** (docs show `+254 725 000 000` placeholder).
- [ ] Any **real case studies / client names** usable for the Capability page
      (or keep anonymized "case-style summaries" per the brand doc).
- [ ] Domain + host preference (Netlify / Cloudflare Pages / Render).
- [ ] Pick the tagline if not final (doc lists 3; primary = "Clarity in Risk. Strength in Decisions.").
