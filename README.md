# Viola Creative — studio site

The marketing site for Viola Creative, a design and engineering studio. One page,
plus a 404. Plain HTML, CSS and JavaScript — **no build step, no framework, no
bundler**. What is in the repo is what gets served.

Live: https://www.violacreative.com

---

## Run it locally

Any static file server will do. There is nothing to install and nothing to compile.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Open it over `http://`, not `file://` — the page loads `main.js` and
`assets/anime.min.js` as separate files, and `file://` origins block that in some
browsers.

## Layout

```
index.html      the whole page: <head>, all markup, and the one <style> block
main.js         all behaviour (~500 lines of vanilla DOM code), loaded with defer
404.html        standalone, self-contained, no JS
robots.txt
sitemap.xml
assets/
  svc/                      six abstract SVG panels for the services rows
  work/                     work-card and case-study imagery (1400x700)
  work/m/                   portrait mobile captures, served under 760px
  logo-dark.webp            wordmark for light backgrounds
  logo-light.webp           wordmark for the dark footer
  og.png                    2400x1260 link-unfurl card (stays PNG — some
                            unfurlers still do not accept WebP)
  anime.min.js              anime.js 3.2.1, vendored (see below)
design/
  Viola Creative.dc.html    the approved design file this site was extracted from
```

### Why no build step

The page is a single document with about 500 lines of vanilla DOM code. A bundler
or a framework would add a toolchain, a lockfile and a CI step without changing a
single pixel. Editing `index.html` and reloading is the whole developer loop.

### Why the styles are inline

The design was authored in a design tool that emits `style` attributes on every
element. Those were kept as-is rather than lifted into classes: the brief required
a pixel-identical result, and rewriting several hundred inline declarations is a
large surface for a silent visual regression with no user-facing benefit. The
shared rules — resets, `@keyframes`, the responsive `@media` blocks and the
`:focus-visible` ring — live in the single `<style>` block in `index.html`.

Do not rename or remove `data-*` attributes. `main.js` selects on nearly all of
them (`data-reveal`, `data-stack-card`, `data-svc-item`, `data-hub-chip`,
`data-org-node`, `data-magnetic`, `data-tilt`, `data-case-open`, and more).

## Where the assets came from

| Asset | Source |
|---|---|
| `logo-dark.webp`, `logo-light.webp` | Viola Creative wordmark, supplied with the design as PNG |
| `og.png` | Generated for this build: the wordmark and hero line on the brand's near-black `#15130E` ground. Rendered at 2400x1260 (2x of the 1.91:1 spec) and composed with no small type, so it stays legible when an unfurl shrinks it to ~340px wide. Regenerate by editing the template and re-capturing at `deviceScaleFactor: 2`. |
| `anime.min.js` | [anime.js 3.2.1](https://github.com/juliangarnier/anime), MIT. Vendored deliberately — the design file hotlinked jsDelivr, and a third-party CDN is an availability and privacy dependency a marketing site does not need. Pinned; re-vendor by hand to change the version. |
| `assets/work/*` | Headless captures of each project's live site, cookie banners and modals dismissed first, cropped 2:1 |
| `assets/work/m/*` | The same sites captured at 430x932 with a mobile UA, cropped to the phone card's 0.63 aspect |
| `assets/svc/*` | Drawn for this build. One system: near-black ground, the design's 135deg hairline texture, cream geometry, one red accent each |
| Fonts | Space Grotesk, Space Mono and Instrument Serif from Google Fonts, loaded via `<link>` with `preconnect` |

The two wordmarks were converted from the design's PNGs to **lossless** WebP —
same pixels, verified maximum per-channel difference of zero, less than half the
bytes. The originals are in git history and in the design project. Everything
below the fold carries `loading="lazy" decoding="async"`; the nav wordmark does
not, since it is in the first paint.

## How the page behaves

`main.js` exports nothing and runs one class, `VCSite`, on `DOMContentLoaded`.
Two properties of the original design are load-bearing and should survive any
future edit:

- **Markup ships visible.** The reveal animations work by having JS *hide* the
  elements and then animate them back in, with a 4-second safety timer that
  reveals everything unconditionally. A JS failure therefore degrades to a fully
  readable page — it can never blank the content. Keep that order.
- **Scroll is polled, not evented.** A single `requestAnimationFrame` loop reads
  `scrollTop`. Scroll *events* do not fire in every embedding context; reading the
  value always works. The loop reschedules itself *before* doing any work, so one
  throwing frame cannot kill scroll tracking for the rest of the session.

With JavaScript disabled the page still reads completely: a `<noscript>` block
unfolds the services accordion and the case studies, which are otherwise
script-driven. With `prefers-reduced-motion: reduce` every animation goes static.

## Deploy

Hosted on Vercel, deployed from `main` on push.

- Framework preset: **Other**
- Build command: none
- Output directory: repo root
- Install command: none

```bash
vercel --prod        # manual production deploy
vercel               # preview deploy
```

DNS is managed in Cloudflare. `www.violacreative.com` is canonical; the apex
redirects to it.

## Known gaps

The design is complete; some of the content is not. See `HANDOFF.md` for the
current list of what still needs real material before this is a finished site.
