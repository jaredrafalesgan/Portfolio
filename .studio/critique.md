# Critique log

## Round 1 (12 Nov 2026)
| Finding | Fix |
|---|---|
| Webinar case used a Rank One Stays screen recording captioned with "Jared Gann": wrong project, misspelled name | Replaced with the webinar promo graphic and an honest caption |
| "3 , 000+" spacing from tabular figures | Removed tabular-nums on proof figures |
| Canva rail flush to left edge (scroll-snap ignored padding) | Added scroll-padding-inline |
| "End" chip stretched to branch height | align-content: start on branches |
| Mono labels 11.5px | Raised to 12px |
| NYC screenshot served at 3× display size | Added 600w source + sizes |
| Large dead gap before Approach | Reduced work section bottom padding |
| Two captions claimed unverifiable details | Softened to what the screenshots show |

## Round 2 — scores (1–5, from screenshots)
| Dimension | Score | Note |
|---|---|---|
| Identity | 4 | Live workflow hero is specific to him; swap test fails for competitors |
| Hero clarity | 5 | What, for whom and next action are clear in 5s on mobile and desktop |
| Typography | 4 | Schibsted display carries personality; consistent scale |
| Composition & grid | 4 | Shared edges; 4/8 case grid; sticky meta |
| Rhythm & pacing | 4 | Alternating density; panel-colored Approach and Contact bands |
| Spacing | 4 | Token-based; one oversized gap fixed |
| Color & imagery | 4 | Restrained; real screenshots only |
| Detail & craft | 4 | Focus states, menu, form validation, 404 |
| Motion | 4 | One signature run; reduced motion shows the completed run |
| Mobile | 4 | Re-composed single column, large targets, full-screen menu |

Automated: qa.mjs P0 0 · P1 0 (P2: og:image, P3: canonical, both need the production domain). slop-scan 0/100. CLS 0, JS 7 KB.

## Known follow-ups
- Contact form currently opens the visitor's email app (mailto). Connect Formspree or Supabase to receive submissions directly.
- Add canonical, og:image (assets/og.png) and sitemap once the domain is chosen.
- Pending client content: Upwork reviews/stats, LinkedIn updates.
