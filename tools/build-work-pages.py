"""Give each case study its own URL.

Twelve /work/<slug> pages, generated from the panel data already in
index.html so the copy cannot drift. The homepage cards become real links to
them and the display:none overlay goes away — a modal cannot rank, cannot be
linked to, and keeping both would duplicate every case study across two URLs.
"""
import pathlib, re, json, html

ROOT = pathlib.Path('/Users/francoviola/Desktop/ViolaCreative/viola-creative-web')
SITE = 'https://www.violacreative.com'
idx = ROOT / 'index.html'
t = idx.read_text()

SLUG = {
    'aeroterra': 'aeroterra-usa', 'pordeporte': 'por-el-deporte',
    'spatioterra': 'spatioterra', 'bmgkids': 'bmg-kids',
    'pordeporteapp': 'por-el-deporte-app', 'grove': 'the-grove-art-studio',
    'champys': 'champys-seafood', 'mindfulnetwork': 'the-mindful-network',
    'aulagis': 'aulagis', 'moen': 'moen', 'agos': 'agos', 'veia': 'veia',
}
panels = json.loads(pathlib.Path('/tmp/panels.json').read_text())
assert len(panels) == 12

HEAD_CSS = (ROOT / 'privacy.html').read_text()
FONTS = re.search(r'<link rel="preconnect".*?rel="stylesheet">', HEAD_CSS, re.S).group(0)
ICONS = ('<link rel="icon" href="/favicon.ico" sizes="32x32">\n'
         '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'
         '<meta name="theme-color" content="#F1ECE2">')

PAGE_CSS = """  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:#F1ECE2;color:#15130E;font-family:'Space Grotesk',sans-serif;
       -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
  ::selection{background:#FF3D23;color:#fff}
  a{color:#BE2D18}
  a:hover{color:#15130E}
  :focus-visible{outline:2.5px solid #FF3D23;outline-offset:3px;border-radius:4px}
  .vc-skip{position:absolute;left:-9999px;top:8px;z-index:9999;background:#15130E;color:#F1ECE2;
    padding:12px 18px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none}
  .vc-skip:focus{left:16px!important}
  nav{position:sticky;top:0;z-index:400;display:flex;align-items:center;justify-content:space-between;
    gap:16px;padding:18px 5vw;background:rgba(241,236,226,.86);backdrop-filter:blur(10px);
    -webkit-backdrop-filter:blur(10px);border-bottom:1px solid rgba(21,19,14,.1)}
  main{padding:6vh 5vw 12vh;max-width:76ch;margin:0 auto}
  .crumb{font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:.06em;color:#6E675B;
    margin-bottom:26px}
  .crumb a{color:#6E675B;text-decoration:none}
  .crumb a:hover{color:#BE2D18}
  .kicker{font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.14em;color:#BE2D18;
    margin-bottom:18px}
  h1{font-size:clamp(34px,5.2vw,64px);font-weight:700;letter-spacing:-.035em;line-height:1;margin:0 0 14px}
  .lede{font-size:18.5px;line-height:1.5;color:#5d574c;margin:0 0 34px;text-wrap:pretty}
  .hero{width:100%;height:clamp(200px,34vw,380px);object-fit:cover;object-position:50% 0%;
    border-radius:16px;border:1px solid rgba(21,19,14,.14);margin-bottom:40px;display:block}
  h2{font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:.12em;color:#BE2D18;
    font-weight:400;margin:0 0 8px}
  section{margin-bottom:26px}
  section p{margin:0;font-size:16.5px;line-height:1.65;color:#5d574c;text-wrap:pretty}
  .acts{display:flex;gap:12px;flex-wrap:wrap;margin-top:42px;padding-top:34px;
    border-top:1px solid rgba(21,19,14,.13)}
  .primary{display:inline-flex;align-items:center;gap:10px;text-decoration:none;background:#BE2D18;
    color:#fff;padding:15px 28px;border-radius:999px;font-weight:600;font-size:15px}
  .primary:hover{color:#fff}
  .ghost{display:inline-flex;align-items:center;gap:10px;text-decoration:none;color:#15130E;
    padding:15px 26px;border-radius:999px;font-weight:600;font-size:15px;
    border:1.5px solid rgba(21,19,14,.22)}
  .more{margin-top:54px;padding-top:30px;border-top:1px solid rgba(21,19,14,.13)}
  .more-h{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.14em;color:#6E675B;
    margin-bottom:16px}
  .more ul{list-style:none;margin:0;padding:0;display:grid;
    grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px 22px}
  .more a{text-decoration:none;color:#15130E;font-weight:600;font-size:15.5px;
    display:flex;align-items:center;min-height:38px}
  .more a:hover{color:#BE2D18}
  .more span{font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:.1em;
    color:#6E675B;font-weight:400;margin-left:8px}
  footer{background:#15130E;color:rgba(241,236,226,.62);padding:30px 5vw;
    font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.08em;
    display:flex;justify-content:space-between;flex-wrap:wrap;gap:14px}
  footer a{color:rgba(241,236,226,.78);text-decoration:none}
  footer a:hover{color:#FF3D23}
  @media (max-width:760px){
    main{padding-top:4vh}
    .acts a{width:100%;justify-content:center}
  }
"""

DISCIPLINE = {
    'aeroterra': 'GIS platform', 'pordeporte': 'Commerce and mobile app',
    'spatioterra': 'Data platform', 'bmgkids': 'Headless commerce',
    'pordeporteapp': 'iOS app', 'grove': 'Brand and website',
    'champys': 'Ecommerce storefront', 'mindfulnetwork': 'Directory platform',
    'aulagis': 'E-learning platform', 'moen': 'Ecommerce at scale',
    'agos': 'AI agent platform', 'veia': 'AI agent platform',
}

def esc(s):
    return html.escape(s, quote=True)

def txt(s):
    return html.escape(s, quote=False)

def page(p, others):
    slug = SLUG[p['id']]
    url = f'{SITE}/work/{slug}'
    desc = p['lede'][:300]
    body_img = '../' + p['img']
    mobile = p['img'].replace('assets/work/', 'assets/work/m/')
    has_m = (ROOT / mobile).exists()
    pic = (f'<picture><source media="(max-width:760px)" srcset="../{mobile}">'
           f'<img class="hero" src="{body_img}" width="1400" height="700" alt="{esc(p["alt"])}"></picture>'
           if has_m else
           f'<img class="hero" src="{body_img}" width="1400" height="700" alt="{esc(p["alt"])}">')

    secs = ''
    for label in ['THE PROBLEM', 'WHAT WE BUILT']:
        if p['blocks'].get(label):
            secs += f'      <section><h2>{label}</h2><p>{p["blocks"][label]}</p></section>\n'

    ld = {
        '@context': 'https://schema.org',
        '@graph': [
            {'@type': 'BreadcrumbList', 'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': f'{SITE}/'},
                {'@type': 'ListItem', 'position': 2, 'name': 'Work', 'item': f'{SITE}/#work'},
                {'@type': 'ListItem', 'position': 3, 'name': p['name']},
            ]},
            {'@type': 'CreativeWork', '@id': f'{url}#work', 'name': p['name'],
             'headline': p['name'], 'description': desc, 'url': url,
             'image': f'{SITE}/{p["img"]}',
             'creator': {'@type': 'Organization', 'name': 'Viola Creative',
                         '@id': f'{SITE}/#organization'},
             'about': DISCIPLINE[p['id']]},
        ],
    }

    nav_others = '\n'.join(
        f'        <li><a href="/work/{SLUG[o["id"]]}">{o["name"]}<span>{o["cat"]}</span></a></li>'
        for o in others)

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{txt(p['name'])} — {DISCIPLINE[p['id']]} | Viola Creative</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:title" content="{esc(p['name'])} — {DISCIPLINE[p['id']]} | Viola Creative">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="Viola Creative">
<meta property="og:image" content="{SITE}/{p['img']}">
<meta property="og:image:alt" content="{esc(p['alt'])}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{SITE}/{p['img']}">
{ICONS}
{FONTS}
<style>
{PAGE_CSS}</style>
<script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=1)}
</script>
</head>
<body>
  <a href="#main" class="vc-skip">Skip to content</a>
  <nav>
    <a href="/" aria-label="Viola Creative — home" style="text-decoration:none;display:flex;align-items:center;flex:none"><img src="../assets/logo-dark.webp" alt="Viola Creative" width="842" height="207" style="height:26px;width:auto;display:block"></a>
    <a href="/#contact" style="text-decoration:none;background:#15130E;color:#F1ECE2;padding:11px 20px;border-radius:999px;font-weight:600;white-space:nowrap;font-size:14.5px">Start a project</a>
  </nav>
  <main id="main">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/#work">Work</a> <span aria-hidden="true">/</span> <span aria-current="page">{txt(p['name'])}</span></nav>
    <div class="kicker">{esc(p['cat'])}</div>
    <h1>{txt(p['name'])}</h1>
    <p class="lede">{p['lede']}</p>
    {pic}
{secs}    <div class="acts">
      <a class="primary" href="/#contact">Start {esc(START[p['id']])} →</a>
      <a class="ghost" href="{p['url']}" target="_blank" rel="noopener noreferrer">{esc(p['anchor'])}</a>
    </div>
    <div class="more">
      <div class="more-h">MORE WORK</div>
      <ul>
{nav_others}
      </ul>
    </div>
  </main>
  <footer>
    <span>© 2026 VIOLA CREATIVE &nbsp;·&nbsp; <a href="/privacy">PRIVACY</a></span>
    <span><a href="/">BACK TO THE SITE</a></span>
  </footer>
</body>
</html>
'''

START = {
    'aeroterra': 'a GIS platform project', 'pordeporte': 'a commerce and app project',
    'spatioterra': 'a data platform project', 'bmgkids': 'a headless commerce project',
    'pordeporteapp': 'a mobile app project', 'grove': 'a brand and web project',
    'champys': 'a commerce project', 'mindfulnetwork': 'a directory project',
    'aulagis': 'an e-learning project', 'moen': 'a commerce project at scale',
    'agos': 'an agent platform project', 'veia': 'an agent platform project',
}

wd = ROOT / 'work'
wd.mkdir(exist_ok=True)
for i, p in enumerate(panels):
    others = [o for j, o in enumerate(panels) if j != i][:6]
    (wd / f'{SLUG[p["id"]]}.html').write_text(page(p, others))
print(f'wrote {len(panels)} pages into work/')
