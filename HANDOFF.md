# Launch state

Live at **https://www.violacreative.com** — apex 308-redirects to www, Let's
Encrypt certificate issued for both, Cloudflare DNS-only (grey cloud).

Lighthouse on the production domain:

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Desktop | 98 | 100 | 100 | 100 |
| Mobile | 84 | 100 | 100 | 100 |

Total page weight 259 KB. The remaining mobile gap is first contentful paint at
3.2s, and it is almost entirely the render-blocking Google Fonts stylesheet — a
cross-origin round trip to `fonts.googleapis.com` before anything can paint.
Self-hosting the three families would remove it and likely take mobile past 90.
That was deliberately **not** done: the brief said to keep the Google Fonts links
as they are, and it is a real change to the `<head>`. It would also resolve the
Google Fonts disclosure in the privacy page. Worth a decision.

**Leads are arriving** — the enquiry email is CC'd to a direct address, verified
`delivered` end to end through the live form.

**One thing is still not finished:** Cloudflare Email Routing is not enabled, so
`violacreative.com` has no MX records and the `hello@violacreative.com` leg of
every notification is undeliverable. The CC covers the studio for now, but the
address printed in the contact section, the footer and the form's own fallback
copy still bounces for anyone who emails it directly. See item 5.

# What still needs real material

The design is finished and the site is built to it. These are the places where the
site is currently shipping a placeholder, an unverified claim, or a missing piece.
Nothing here was invented to fill a hole — the gaps are left visible on purpose.

## Visible to visitors right now

**1. Portfolio imagery is placeholder.**
Three of the four work cards and all six service rows render diagonal CSS stripes
labelled `DROP IMAGERY` / `DROP … SCREENS HERE`. Only **Por El Deporte** has real
art (`assets/por-el-deporte-crop.png`).

Needs real screens for: Aeroterra USA, SpatioTerra, BMG Kids (work cards and case
study panels), plus the six service rows — research artefacts, design work,
website screens, app screens, mobile screens, agent dashboard.

**2. Case study "WHAT CHANGED" copy is an instruction to the client.**
Each of the four case studies ends with a note addressed to you, not to a visitor.
These are live text on the page:

| Case study | Current text |
|---|---|
| Aeroterra USA | "Add the outcome you would defend in a room — hours saved per analysis, consultant spend removed, or time-to-answer before and after." |
| Por El Deporte | "Add the number here — release cadence, conversion, or cost per order versus the previous setup." |
| SpatioTerra | "Add the real figure — record count, query time, or reporting hours removed each month." |
| BMG Kids | "The +38% conversion claim belongs here with the measurement window and the baseline, or it should come off the site." |

These need real outcomes or the blocks should be removed. They are not written as
placeholders a visitor would recognise — they read as unfinished copy.

**3. Claims that are yours to confirm.**
- Process durations on the four process cards: `WEEK 1`, `2–3 WEEKS`, `8–14 WEEKS`,
  `ONGOING`, and "Three to five months end to end for most projects."
- "EVERYTHING WE MAKE IS YOURS — CODE, DESIGN FILES AND DATA, IN YOUR ACCOUNTS."
  and the matching FAQ answer ("assigned to you in the contract").
- "We reply within two working days" — stated twice, in the contact section and
  in the last FAQ answer.

**4. No social links.** The footer has none, because none were supplied. There is
space for them under GET IN TOUCH.

**5. `hello@violacreative.com` does not receive mail.** The DNS zone has no MX
records, so the address published in the contact section, the footer and the
form's fallback copy is currently dead. Cloudflare Email Routing is the fix and
is free — see the DNS notes. Until it is enabled, mail sent to that address
bounces, and the lead notification from the contact form has nowhere to land.

## Built, but needs your input to finish

**6. Contact form.** Now posts to `api/lead.js`, a Vercel function that sends
through Resend (provisioned on the free plan, 3,000 emails/month). Spam handling
is a honeypot field, a sub-2-second dwell-time reject and a per-IP throttle — no
third-party CAPTCHA. If the function is unreachable or Resend rejects, the
browser falls back to the original `mailto:` handoff so a brief is never lost.

Resend's domain is verified and the form is delivering. Notifications go to
`hello@violacreative.com` with a CC to a direct address — the CC is what is
actually landing today, since the `hello@` leg needs Email Routing (item 5).
Remove the CC from `api/lead.js` once `hello@` works, if you want it gone.

## Not built, because it needs a decision or real content

**7. Privacy page.** The contact form collects a name and an email address. A
privacy page is required before launch. `privacy.html` describes the data flow
this build actually implements, but the legal entity name, registered address,
governing jurisdiction and retention period are marked `[TO CONFIRM]` and must be
filled in by you or your counsel.

**8. No analytics.** Nothing is installed and no vendor was chosen. If you want
page-level numbers, Vercel Web Analytics is a one-line script tag with no cookie
banner implication; anything session-based will need a consent decision first.

**9. Cost/benefit chart.** The behaviour brief lists "cost/benefit chart — line
draws in on intersection". **There is no such markup in the approved design file.**
`main.js` keeps the `setupChart()` handler, which finds zero `[data-chart-line]`
elements and no-ops safely. Either the chart was removed between design revisions
(it exists in `Viola Creative v3/v4`) or it was never carried into the final. If
you want it, it needs to come back from the design file first — it was not
reconstructed here.

## Deliberate deviations from the design file

Two changes were made that are not pure extraction. Both are noted in the code.

- **Skip link `:focus` rule.** The design used the design tool's `style-focus`
  attribute, which that tool compiles into a class rule. Because the inline styles
  were kept as-is here, the base `left:-9999px` is an inline declaration and
  outranks a plain class rule, so the rule needs `!important` to apply. Verified
  to behave identically to the design.
- **`<noscript>` block.** With JavaScript off, the services accordion and the four
  case studies are unreachable — they are opened by script. A `<noscript>` style
  block unfolds both inline. It has no effect when JavaScript runs, and page
  geometry with JS enabled is byte-identical to the design.
