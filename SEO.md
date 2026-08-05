# SEO strategy

Built against [Google's SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
and every page it links to — Search Essentials, technical requirements, spam
policies, crawling and indexing, canonicalization, helpful content, title links
and snippets, crawlable links, Google Images, structured data, and Search
Console. Each area was read, turned into checkable rules, and audited against
the live site.

---

## Where the site actually stands

The technical foundation is **done and correct**. This is worth stating plainly,
because it means every remaining gain is content, structure or off-site — not
tags.

- Titles unique and descriptive, one `<h1>`, clean heading hierarchy
- 32 of 32 images carry descriptive alt text
- Canonicals self-reference and match the sitemap byte-for-byte
- `/index.html`, `//`, `/privacy/` and the whole apex all 308 to the canonical
- Valid HTTPS, no mixed content, security headers set
- Content is server-rendered — the crawled HTML and the rendered DOM are
  identical, and a `<noscript>` block unfolds the accordion and case studies
- Lighthouse SEO **100**, accessibility **100**, best practices **100**

## Three things that actually limit this site

### 1. One URL, twelve case studies, six services

Everything lives at `/`. Google can rank one page for one dominant intent. This
site is trying to be found for GIS platform work, headless commerce, mobile
apps, AI agent workflows, e-learning and brand sites simultaneously — from a
single document, with the case studies inside a `display:none` modal that has no
address of its own.

Googlebot *can* read that text. But you cannot rank a modal, you cannot link to
one, and a visitor arriving from search lands on the homepage rather than the
case study that matched their query.

**Done.** Twelve `/work/<slug>` pages, each with its own title, description,
canonical, OG tags, `BreadcrumbList` and `CreativeWork` node. The homepage cards
are real anchors to them and the `display:none` overlay is gone — a modal cannot
rank and cannot be linked to, and keeping it alongside twelve real pages would
have duplicated every case study across two URLs. Sitemap went from 1 URL to 13.

**Caveat worth naming:** each page is about 150 words. The structure is right and
the URLs are rankable, but that is thin against real competition. They need
depth — engagement dates, scope, the outcome numbers, more detail on what was
actually built. That is content only you can supply.

### 2. The domain has a previous life in the index

Searching `site:violacreative.com` today returns **"Viola Creative Services —
Front-end, Fullstack, Backend, UX/UI Design"**. That is the old site. The DNS
zone was empty when this one was built, so Google has not yet recrawled.

Until it does, the search result for your own name describes a different
business. Search Console (below) is how you force the recrawl rather than wait.

### 3. There is no geographic signal anywhere

The work is visibly South Florida — Por El Deporte (Miami), Champy's (Miami),
The Grove Art Studio (Coconut Grove), The Mindful Network (South Florida). The
site never says where the studio is, has no address, and carries no
`PostalAddress` in its structured data.

"web design studio miami" is a high-intent commercial query. The site currently
cannot compete for it, and the portfolio is already the proof.

---

## Applied in this pass

| Fix | Why it mattered |
|---|---|
| `.vercelignore` for `design/`, `dns/`, `tools/`, `HANDOFF.md` | `design/Viola Creative.dc.html` was served publicly at `/design/Viola%20Creative.dc` — 102KB carrying this page's exact `<title>` and `<h1>` with no canonical. A duplicate competing with the page it came from. |
| 24 generic anchors named | 12× "Visit the site" and 12× "Start something like this". Google asks for descriptive anchor text; these now name the destination and the discipline. |
| `/privacy` set `noindex, follow`, dropped from sitemap | It says "Draft — not yet reviewed" about itself and carries seven `[TO CONFIRM]` slots. A legal page in that state should not be indexed. **Reverse both once it is finished.** |
| `/404` no longer answers 200 | `cleanUrls` exposed `404.html` at `/404` — a soft 404. Real misses always returned a true 404 and still do. |
| Intrinsic `width`/`height` on 24 work images | Removes layout shift. |
| Twelfth mobile card image created | `assets/work/m/pordeporte-app.webp` did not exist; that card fell back to the desktop crop on phones. |
| Structured data trimmed to what the page shows | `knowsAbout` now matches the visible service names; `availableLanguage` drops `es` on a monolingual site; the JSON-LD `image` matches `og:image` exactly. |
| Sitemap cleaned | `changefreq` and `priority` removed — Google ignores both. |
| `og:` tags and a `BreadcrumbList` on `/privacy` | |
| 8 decorative SVGs marked `aria-hidden` | |
| Honeypot field renamed, dwell threshold raised | `HANDOFF.md` documented the anti-spam design by name, in a public repo. |

## A correction

I told you earlier that the `FAQPage` schema was "the one most likely to earn a
rich result." **That is no longer true.** Google restricted FAQ rich results to
government and health sites in 2023 and
[removed the feature entirely in June 2026](https://developers.google.com/search/docs/appearance/structured-data/faqpage).
The markup is still valid, still matches the visible copy, and costs nothing, so
it stays — but it will not produce anything in Google. The `Organization` node
is the one doing real work.

---

## What to do next, in order

**1. Verify Search Console.** Everything measurable depends on it and nothing
else can substitute. Add a *Domain* property for `violacreative.com`, put the
TXT record it issues into Cloudflare, mirror it into
`dns/violacreative.com.zone`, then submit `sitemap.xml` and run URL Inspection
on `/` to force the recrawl that replaces the old listing.

**2. Fill the twelve "WHAT CHANGED" blocks, or delete them.** They are live on
the page as instructions to you. Beyond looking unfinished, outcome numbers are
the single most persuasive thing a studio portfolio can carry.

**3. Finish `/privacy`, then remove its `noindex` and restore the sitemap
entry.** Seven placeholders, listed in `HANDOFF.md`.

**4. Decide on `/work/<slug>` pages.** The structural item above. If the answer
is yes, the case study content already exists — it needs routing, not writing.

**5. Google Business Profile.** Setup packet ready in
`GOOGLE-BUSINESS-PROFILE.md` — name, categories, service areas, a 741-character
description and the six services, all paste-ready. Service-area type, so your
address stays hidden. Once it exists I wire `LocalBusiness` schema, `sameAs`,
and a review link.

**6. Add an About page and a location.** Registered entity, address, founding
year, named principals. Then `address`, `foundingDate`, `founder` and `sameAs`
on the Organization node. This is both the E-E-A-T signal Google's
helpful-content guidance asks for and the geographic signal that unlocks local
intent.

**7. Get the client links.** Twelve shipped projects and no backlinks from any
of them. A footer credit or a case-study mention on those sites is the most
natural link profile a studio can have, and it costs an email.

**7. ~~Self-host the typefaces.~~ Done.** Same woff2 files, latin subset only,
served from our own origin with preloads. Mobile performance went 85 → 96 and
first contentful paint 3.1s → 1.6s. It also made the privacy page true: no
visitor IP is disclosed to Google on page load any more.

## Deliberately not doing

- **Meta keywords, keyword density, keywords in the domain.** Google's guide
  lists these under "not worth focusing on."
- **A `BreadcrumbList` on the homepage.** A one-item trail fails the two-item
  minimum.
- **Image, video or news sitemap entries.** Every image is discovered from a
  single crawled page; there is no video on the site.
- **`hreflang`.** Monolingual, single route.
- **Removing the `FAQPage` node.** Ineligible, but valid and free.
