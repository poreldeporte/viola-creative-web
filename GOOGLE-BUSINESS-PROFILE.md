# Google Business Profile — setup packet

Everything below is ready to paste. I can't create the profile myself: it needs
your Google account and ends in a verification step Google runs against you, not
the site. Start at **https://business.google.com/create**.

Set up as a **service-area business** — you enter an address so Google can
verify you, then hide it, and list the areas you serve instead. That is the
correct type for a studio without a shopfront, and it keeps your home or private
office off the public listing.

---

## 1. Business name

```
Viola Creative
```

Exactly that. Do **not** append keywords ("Viola Creative | Web Design Miami") —
Google's guidelines prohibit it and it is a common cause of suspension.

## 2. Categories

| | Category |
|---|---|
| Primary | **Website designer** |
| Secondary | Software company |
| Secondary | Mobile app developer *(if offered)* |
| Secondary | Marketing agency *(only if you do the marketing too)* |

The primary category carries most of the ranking weight. "Website designer" is
the highest-volume commercial intent that matches what the site actually sells.

## 3. Location

- **"Do you want to add a location customers can visit?"** → **No**
- Enter your real address when asked — it is used for verification and stays
  hidden on the public profile
- **Service areas** (add each):
  `Miami, FL` · `Coral Gables, FL` · `Coconut Grove, Miami, FL` ·
  `Miami Beach, FL` · `Key Biscayne, FL` · `Brickell, Miami, FL` ·
  `Fort Lauderdale, FL`

  Or set `Miami-Dade County` and `Broward County` if you'd rather cover it
  broadly. Don't list areas you wouldn't actually take work in — Google weighs
  proximity, and an over-wide radius dilutes it.

## 4. Contact

```
Website:  https://www.violacreative.com
Phone:    [your number]
```

Use a number that reaches you. Google may verify by call, and the number becomes
a ranking and trust signal — it should match anything you publish elsewhere.

## 5. Description

Paste verbatim — 741 characters, inside Google's 750 limit, written from the
site's own copy so the two corroborate each other.

```
Viola Creative is a design and engineering studio. We build websites, web apps and mobile apps, design them around how your business actually works, and set up AI agent workflows to handle the repetitive operations.

We start with discovery: interviews with the people doing the work, the process mapped end to end, and a written plan of what to build in what order. Design and engineering sit in one team, so nothing gets lost in a handoff between three vendors.

Everything we make is yours — code in your repository, design files in your workspace, everything running in your accounts.

Recent work spans GIS platforms, headless commerce storefronts, iOS and Android apps, and agentic operating systems for investment teams.
```

## 6. Services

Add each with its own short description. These mirror the six on the site:

| Service | Description |
|---|---|
| Discovery & product strategy | Interviews with the people doing the work, the process mapped end to end, and a written plan of what to build in what order. |
| Design & UX | Flows and interfaces designed for the people who will actually use them, plus a design system your team can keep building on. |
| Websites | Marketing sites that load fast, read well, and your team can update without filing a ticket. |
| Web apps | Internal tools, dashboards and customer portals — the software your business runs on all day. |
| Mobile apps | iOS and Android, usually from a single codebase, with store submission and release handled. |
| AI agent workflows | Agents that take repetitive operational work off your team, inside limits you set, with human approval on anything that matters. |

## 7. Photos

Google weights profiles with real imagery. Upload from the repo:

| Slot | File |
|---|---|
| Logo | `assets/icon-512.png` (the VC mark, 512×512) |
| Cover | `assets/og.png` (2400×1260) |
| Work | any of `assets/work/*.webp` — Aeroterra, Por El Deporte, SpatioTerra, BMG Kids, Champy's, The Grove read best |

## 8. Verification

For a service-area business Google usually asks for **video verification** — a
single unbroken recording showing your work location, equipment or signage, and
you. Have that ready; it is the step most people stall on. Phone or postcard is
sometimes offered instead.

---

## After it is live — tell me and I'll wire it up

Three things become possible the moment the profile exists, and I'll do all of
them:

1. **`LocalBusiness` structured data** on the homepage with `areaServed`,
   `telephone` and `address` — this is what connects the site to the profile in
   Google's eyes. It needs your real address and phone.
2. **The profile URL into `sameAs`** on the Organization node, plus the reverse
   link from the profile to the site.
3. **Reviews.** The single strongest local ranking factor, and you have twelve
   delivered projects to ask. Google prohibits incentivising them; a plain ask
   with a direct review link is fine, and I'll generate that link.

## What I still need from you

You said you could supply all of this — send it whenever and I'll build the
About page and the schema in one pass:

- Legal entity name (as registered)
- Street address, city, state, ZIP
- Phone
- Founding year
- Principal name(s), role, and a line or two of background each
