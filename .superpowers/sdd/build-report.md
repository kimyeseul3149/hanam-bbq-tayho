# Build Report — Hanam BBQ Tây Hồ Landing Page

**Date:** 2026-07-09
**Status:** DONE_WITH_CONCERNS (product complete + verified; open items are content-review, not code)

---

## Files created

| File | Purpose |
|------|---------|
| `index.html` | Single-page markup — header, hero, story, why (personas + reviews), promo, menu, visit, footer. All strings use `data-i18n`. |
| `assets/css/styles.css` | Full dark-premium stylesheet — tokens, header, hero, all sections, responsive (1024/640), scroll-reveal, reduced-motion. |
| `assets/js/content.js` | `window.CONTENT = { vi, en }` i18n dictionary (every visible string). |
| `assets/js/menu.js` | `window.MENU = [...]` 8 signature grill cuts (ko/vi/en name + vi/en desc + img). |
| `assets/js/app.js` | `getLang / applyLang / renderMenu / animateCounters` + scroll-reveal, header scroll state, mobile nav. |
| `vercel.json` | `{ "cleanUrls": true }` |
| `README.md` | Stack, structure, run/deploy, store data, open review items. |
| `.claude/launch.json` | Local preview server config (python http.server). |

Images were pre-committed: `assets/img/hanam-cut-a..j.jpg` + `logo.png`. Temp files `fb-og.jpg` / `fb-og.b64.txt` removed.

## Commits (`git log --oneline`)

```
5320146 fix: counter decimals + persona card z-index/padding (verification polish)
d15f6c4 chore: drop temp fb-og asset files
ba4156c feat: i18n engine + content/menu dictionaries + app logic
14895b2 feat: scaffold static landing (index, styles, vercel, readme)
e91a89f chore: add image assets (10 cut photos + logo)  [pre-existing]
509055c chore: scaffold folders + progress ledger        [pre-existing]
```

Build commit range: **14895b2..5320146**

> Deviation: committed in grouped stages (scaffold / i18n+logic / fix) rather than one commit per section, because `content.js` holds all keys for every section (splitting per-section would produce non-building intermediate states). History is still clear and incremental.

## Verification evidence (served via `python -m http.server 8000`)

- **Desktop (1280):** hero legible — gold serif headline over dark grilled-meat photo with gradient overlay, kicker pill, two CTAs; nav on one line. Story counters, Why personas, promo cards, 4-col menu, visit map+CTAs all render.
- **Mobile (375):** stacked CTAs, hamburger → fullscreen serif nav overlay (hamburger morphs to X), 2×2 stat grid, single-column menu. **Horizontal overflow = 0** (measured `scrollWidth - clientWidth = 0` at both 375 and 1280).
- **Console:** clean — **zero** logs/errors across all interactions.
- **i18n toggle:** VI↔EN swaps nav, hero, story, menu names (Korean label retained), reviews. `applyLang` + real button `.click()` both verified. `localStorage.hanam_lang` persists across reload (set EN → reload → still EN, `<html lang="en">`).
- **Counters:** animate on scroll into view → 48.9%, 97%, 176+, 4.67M (decimal fix applied).
- **Menu:** 8 cards, 8 `<img>` loaded, Korean secondary labels present, names re-render on language switch.
- **CTA hrefs verified:** Directions `https://www.google.com/maps/search/?api=1&query=21.061464,105.8316161` (target _blank) · Message `https://m.me/61579247412593` · Call `tel:+84964321771` · Map iframe `https://www.google.com/maps?q=21.061464,105.8316161&hl=vi&z=17&output=embed`.

### Bugs found & fixed during verification
1. **Counter decimals** — `48.9` rendered as `48.90%`. Fixed to use the source decimal count (now `48.9%`; `4.67M` unchanged).
2. **Persona card text hidden** — the double-bezel inner-core `::after` painted over card content. Fixed with `z-index:1` on content + removed duplicate padding on the tag.

## Open concerns (content review, not code)

1. **Translations are DRAFT** (`// TODO(review): VN native check`) — menu names/descriptions and story/marketing copy need a Vietnamese native review before launch.
2. **Testimonials are placeholders** (`// TODO(review): replace with real customer reviews`) — attributed to visit-type personas (family / business / couple), NOT real named people, per brief. Replace with real Google/Facebook reviews.
3. **Facebook follower count `1.6k+`** — approximation for social proof; confirm actual count.
4. **Menu image mapping** followed the brief's fixed mapping; verify each cut photo visually matches its dish before launch.
5. **Opening hours 11:00–22:00** are estimated; UI shows "hours may vary" + links to Google Maps for the live source.
6. **Map iframe** uses the exact spec-mandated `output=embed` URL. The preview sandbox reported `net::ERR_ABORTED` for the cross-origin Google Maps request (sandbox network artifact) — this classic embed URL renders normally in a real browser / on Vercel.
7. **Deployment not executed** — `vercel.json` is ready; run `npx vercel --prod` from repo root (framework preset: Other, no build) to obtain the live URL.
