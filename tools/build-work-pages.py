"""Build the project pages.

Full-bleed, not a reading column: a wide hero, then an asymmetric three-column
band — name, meta rail, narrative — then a pull quote against the mobile
render, then the next two projects. Motion lives in assets/work.js: a cover
panel wipes off each piece of media, hairlines draw themselves in, headings
slide up out of a clip.

Copy comes from tools/narratives.json so the prose is versioned apart from the
markup that frames it.
"""
import pathlib, json, html, subprocess

ROOT = pathlib.Path('/Users/francoviola/Desktop/ViolaCreative/viola-creative-web')
SITE = 'https://www.violacreative.com'
FACES = (ROOT / 'tools/fontface.css').read_text().rstrip().replace('url(assets/', 'url(../assets/')
DATA = json.loads((ROOT / 'tools/narratives.json').read_text())

esc = lambda s: html.escape(str(s), quote=True)
txt = lambda s: html.escape(str(s), quote=False)

CSS = """
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:#F1ECE2;color:#15130E;font-family:'Space Grotesk',sans-serif;
    -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:clip}
  ::selection{background:#FF3D23;color:#fff}
  a{color:#BE2D18}
  :focus-visible{outline:2.5px solid #FF3D23;outline-offset:3px;border-radius:4px}
  img{max-width:100%}
  .mono{font-family:'Space Mono',monospace}
  .ital{font-family:'Instrument Serif',serif;font-weight:400;font-style:italic}

  .vc-skip{position:absolute;left:-9999px;top:8px;z-index:9999;background:#15130E;color:#F1ECE2;
    padding:12px 18px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none}
  .vc-skip:focus{left:16px!important}

  nav.site{position:sticky;top:0;z-index:400;display:flex;align-items:center;
    justify-content:space-between;gap:16px;padding:18px 5vw;
    background:rgba(241,236,226,.86);backdrop-filter:blur(10px);
    -webkit-backdrop-filter:blur(10px);border-bottom:1px solid rgba(21,19,14,.1)}
  nav.site .cta{text-decoration:none;background:#15130E;color:#F1ECE2;padding:11px 20px;
    border-radius:999px;font-weight:600;white-space:nowrap;font-size:14.5px}

  /* the wipe panel is added by JS, so with no JS the media is simply visible */
  .media{position:relative;overflow:hidden;display:block}
  .vc-cover{position:absolute;inset:0;background:#E4DCCB;z-index:2;display:block}

  .topbar{display:flex;justify-content:space-between;align-items:baseline;gap:20px;
    flex-wrap:wrap;padding:34px 5vw 16px;font-size:11.5px;letter-spacing:.14em;color:#6E675B}
  .topbar a{color:#6E675B;text-decoration:none}
  .topbar a:hover{color:#BE2D18}
  .rule{height:1px;background:rgba(21,19,14,.18);margin:0 5vw;display:block}

  .hero{width:100%;height:clamp(300px,64vh,660px);margin-top:26px}
  .hero img{width:100%;height:100%;object-fit:cover;object-position:50% 0%;display:block}

  .band{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.62fr) minmax(0,1.55fr);
    gap:clamp(28px,4vw,72px);padding:clamp(52px,8vh,110px) 5vw;align-items:start}
  /* the narrative is long; hold the name and the rail alongside it rather than
     leaving a column of dead space */
  .band > .who,.band > .meta{position:sticky;top:104px}
  /* sized to fit the rail — "The Mindful Network" wraps, "Moen" does not, and
     neither may spill past the column and get clipped by .clip */
  h1{font-size:clamp(38px,4.1vw,68px);font-weight:700;letter-spacing:-.038em;
    line-height:.94;margin:0;overflow-wrap:break-word;hyphens:none}
  .clip{display:block;overflow:hidden;padding-bottom:.08em}
  .kicker{font-size:11.5px;letter-spacing:.16em;color:#BE2D18;margin:0 0 20px}

  .meta dl{margin:0}
  .meta dt{font-size:10.5px;letter-spacing:.15em;color:#BE2D18;margin:0 0 6px}
  .meta dd{margin:0 0 22px;font-size:15px;line-height:1.5;color:#15130E}
  .meta dd span{display:block;color:#5d574c}
  .meta a{color:#15130E;text-decoration:underline;text-underline-offset:3px;
    text-decoration-color:rgba(21,19,14,.3)}

  .story p{margin:0 0 22px;font-size:clamp(16.5px,1.25vw,19px);line-height:1.6;
    color:#3c382f;text-wrap:pretty;max-width:62ch}
  .story p:last-child{margin-bottom:0}

  .quote{display:grid;grid-template-columns:1.25fr .75fr;gap:clamp(28px,5vw,80px);
    align-items:center;padding:clamp(46px,7vh,96px) 5vw}
  .quote blockquote{margin:0;font-size:clamp(26px,3.4vw,52px);line-height:1.12;
    letter-spacing:-.028em;text-wrap:balance}
  .quote .device{width:100%;max-width:330px;border-radius:22px;
    border:1px solid rgba(21,19,14,.16);box-shadow:0 30px 70px rgba(21,19,14,.16);
    margin-left:auto}
  .quote .device img{width:100%;display:block;border-radius:21px}

  .next{padding:clamp(46px,7vh,96px) 5vw clamp(60px,9vh,120px)}
  .next h2{font-size:11.5px;letter-spacing:.16em;color:#BE2D18;font-weight:400;margin:0 0 26px}
  .next ul{list-style:none;margin:0;padding:0;display:grid;
    grid-template-columns:1fr 1fr;gap:clamp(20px,3vw,46px)}
  .next a{text-decoration:none;color:inherit;display:block}
  .next .media{border-radius:16px;border:1px solid rgba(21,19,14,.14);
    aspect-ratio:16/9;background:#0d0c0a}
  .next .media img{width:100%;height:100%;object-fit:cover;object-position:50% 0%;display:block}
  .next h3{font-size:clamp(21px,2.2vw,31px);font-weight:700;letter-spacing:-.028em;
    margin:16px 0 4px}
  .next p{margin:0;font-size:11.5px;letter-spacing:.12em;color:#6E675B}
  .next a:hover h3{color:#BE2D18}

  .cta{background:#15130E;color:#F1ECE2;padding:clamp(52px,8vh,110px) 5vw}
  .cta h2{font-size:clamp(30px,4.4vw,64px);font-weight:700;letter-spacing:-.035em;
    line-height:1.02;margin:0 0 30px;max-width:18ch}
  .cta .acts{display:flex;gap:12px;flex-wrap:wrap}
  .primary{display:inline-flex;align-items:center;gap:10px;text-decoration:none;
    background:#BE2D18;color:#fff;padding:16px 30px;border-radius:999px;
    font-weight:600;font-size:15.5px}
  .ghost{display:inline-flex;align-items:center;gap:10px;text-decoration:none;
    color:#F1ECE2;padding:16px 28px;border-radius:999px;font-weight:600;font-size:15.5px;
    border:1.5px solid rgba(241,236,226,.32)}

  footer{background:#15130E;color:rgba(241,236,226,.56);padding:26px 5vw 34px;
    font-size:11px;letter-spacing:.08em;display:flex;justify-content:space-between;
    flex-wrap:wrap;gap:14px;border-top:1px solid rgba(241,236,226,.14)}
  footer a{color:rgba(241,236,226,.76);text-decoration:underline;
    text-underline-offset:3px;text-decoration-color:rgba(241,236,226,.4)}

  @media (max-width:1000px){
    .band{grid-template-columns:1fr;gap:34px}
    .band > .who,.band > .meta{position:static}
    .quote{grid-template-columns:1fr;gap:34px}
    .quote .device{margin:0 auto;max-width:290px}
    .next ul{grid-template-columns:1fr}
    .hero{height:clamp(240px,44vh,420px)}
  }
  @media (prefers-reduced-motion:reduce){
    html{scroll-behavior:auto}
    *{animation-duration:.001ms!important;transition-duration:.001ms!important}
  }
"""


def page(p, nxt, index, total):
    slug, name = p['slug'], p['name']
    url = f'{SITE}/work/{slug}'
    desc = p['paragraphs'][0][:290]
    img = f"../{p['img']}"
    m_img = f"../{p['mobile']}" if p.get('mobile') else None

    rows = [('CLIENT', esc(p.get('client', name))), ('SECTOR', esc(p['sector'])),
            ('SERVICES', '<span>' + '</span><span>'.join(esc(s) for s in p['services']) + '</span>'),
            ('SITE', f'<a href="{p["url"]}" target="_blank" rel="noopener noreferrer">'
                     f'{esc(p["host"])} &#8599;</a>')]
    meta = '\n'.join(f'          <dt class="mono">{k}</dt><dd>{v}</dd>' for k, v in rows)
    story = '\n'.join(f'        <p>{txt(par)}</p>' for par in p['paragraphs'])

    device = (f'''      <div class="device media" data-cover data-delay="120">
        <img src="{m_img}" width="720" height="1140" loading="lazy" decoding="async"
             alt="{esc(name)} on a phone">
      </div>''' if m_img else '')

    nxt_items = '\n'.join(f'''          <li><a href="/work/{n['slug']}">
            <span class="media" data-cover data-delay="{i * 90}"><img src="../{n['img']}" width="1400" height="700"
              loading="lazy" decoding="async" alt="{esc(n['alt'])}"></span>
            <h3>{txt(n['name'])}</h3><p class="mono">{esc(n['oneLiner']).upper()}</p>
          </a></li>''' for i, n in enumerate(nxt))

    ld = {'@context': 'https://schema.org', '@graph': [
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': f'{SITE}/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Work', 'item': f'{SITE}/#work'},
            {'@type': 'ListItem', 'position': 3, 'name': name}]},
        {'@type': 'CreativeWork', '@id': f'{url}#work', 'name': name, 'headline': name,
         'description': desc, 'url': url, 'image': f'{SITE}/{p["img"]}',
         'about': p['sector'], 'keywords': ', '.join(p['services']),
         'creator': {'@type': 'Organization', 'name': 'Viola Creative',
                     '@id': f'{SITE}/#organization'}}]}

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{txt(name)} — {txt(p['sector'])} | Viola Creative</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:title" content="{esc(name)} — {esc(p['sector'])} | Viola Creative">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="Viola Creative">
<meta property="og:image" content="{SITE}/{p['img']}">
<meta property="og:image:alt" content="{esc(p['alt'])}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{SITE}/{p['img']}">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#F1ECE2">
<link rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/space-grotesk-400.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin href="../assets/fonts/space-grotesk-700.woff2">
<style>
{FACES}
{CSS}</style>
<script src="../assets/work.js" defer></script>
<script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=1)}
</script>
</head>
<body>
  <a href="#main" class="vc-skip">Skip to content</a>
  <nav class="site">
    <a href="/" aria-label="Viola Creative — home" style="text-decoration:none;display:flex;align-items:center"><img src="../assets/logo-dark.webp" alt="Viola Creative" width="842" height="207" style="height:26px;width:auto;display:block"></a>
    <a class="cta" href="/#contact">Start a project</a>
  </nav>

  <main id="main">
    <div class="topbar mono">
      <span>PROJECT &mdash; {index:02d} / {total}</span>
      <span><a href="/">HOME</a> / <a href="/#work">WORK</a> / <span aria-current="page" style="color:#15130E">{esc(name).upper()}</span></span>
    </div>
    <span class="rule" data-rule></span>

    <div class="hero media" data-cover>
      <img src="{img}" width="1400" height="700" fetchpriority="high" decoding="async" alt="{esc(p['alt'])}">
    </div>

    <div class="band">
      <div class="who">
        <p class="kicker mono">{esc(p['kicker'])}</p>
        <h1><span class="clip"><span data-line style="display:block">{txt(name)}</span></span></h1>
      </div>
      <div class="meta">
        <dl>
{meta}
        </dl>
      </div>
      <div class="story">
{story}
      </div>
    </div>

    <span class="rule" data-rule></span>

    <div class="quote">
      <blockquote><span class="ital">&ldquo;</span>{txt(p['pullQuote'])}<span class="ital">&rdquo;</span></blockquote>
{device}
    </div>

    <span class="rule" data-rule></span>

    <section class="next">
      <h2 class="mono">NEXT</h2>
      <ul>
{nxt_items}
      </ul>
    </section>
  </main>

  <section class="cta">
    <h2>Tell us what you&rsquo;re <span class="ital" style="color:#FF3D23">building.</span></h2>
    <div class="acts">
      <a class="primary" href="/#contact">Start {esc(p['start'])} &rarr;</a>
      <a class="ghost" href="{p['url']}" target="_blank" rel="noopener noreferrer">Visit {esc(p['host'])} &#8599;</a>
    </div>
  </section>
  <footer>
    <span>&copy; 2026 VIOLA CREATIVE &nbsp;&middot;&nbsp; <a href="/privacy">PRIVACY</a></span>
    <span><a href="/#work">ALL WORK</a></span>
  </footer>
</body>
</html>
'''


wd = ROOT / 'work'
wd.mkdir(exist_ok=True)
total = len(DATA)
for i, p in enumerate(DATA):
    nxt = [DATA[(i + 1) % total], DATA[(i + 2) % total]]
    (wd / f"{p['slug']}.html").write_text(page(p, nxt, i + 1, total))
print(f'wrote {total} project pages')

ts = subprocess.run(['date', '-u', '+%Y-%m-%dT%H:%M:%S+00:00'],
                    capture_output=True, text=True).stdout.strip()
urls = [f'{SITE}/'] + [f"{SITE}/work/{p['slug']}" for p in DATA]
(ROOT / 'sitemap.xml').write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + ''.join(f'  <url>\n    <loc>{u}</loc>\n    <lastmod>{ts}</lastmod>\n  </url>\n' for u in urls)
    + '</urlset>\n')
print(f'sitemap.xml: {len(urls)} urls')
