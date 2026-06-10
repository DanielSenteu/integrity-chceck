# Integrity Check Limited — Website

Static brochure site for an institutional advisory firm. Vanilla HTML/CSS/JS, no
framework, no backend. See [`PLAN.md`](PLAN.md) for the full design + build plan.

## Run locally
```bash
npm start        # preview server with prod-style security headers → http://localhost:4321
npm run build    # sync partials/nav.html + partials/footer.html into every public/*.html
```
(You can also just open `public/index.html` directly in a browser.)

## Structure
```
public/            web root
  index.html       homepage (built; nav/footer synced from partials/)
  css/shared-site.css   design tokens + all styling (single source)
  js/main.js       reveals, hero line-mask, scroll-pinned process, count-ups, parallax, magnetic
  assets/logo-mark.svg  shield + bars + checkmark logo (animatable)
  images/ videos/  drop optimized stock + the Remotion hero loop here
partials/          nav.html, footer.html — single source for site chrome
scripts/           build.js (chrome sync), serve.js (preview server)
```

## Brand
Navy `#0B1F3A` · Green `#1F7A63` (accent, ~5%) · Grey `#F4F6F8` · Silver `#B0B7C3`.
Playfair Display (titles) · Poppins (headings) · Montserrat (body).
Tagline: **Clarity in Risk. Strength in Decisions.**

## Status
- [x] Foundation: tokens, shared CSS, partials + build, SVG logo, preview server
- [x] Homepage: hero, who-we-are, process timeline, services, differentiation, leadership, clients, CTA, footer
- [x] All pages: about, services, leadership, capability, contact (built, nav/footer synced, smoke-tested)
- [ ] Real logo file / director headshots / hero video (see PLAN.md §10)
- [ ] Remotion brand video (`animation/`)
- [ ] Asset download + optimization, Lighthouse/a11y pass, deploy
