# Hanam BBQ Tây Hồ — Landing Page

Static promotional landing page for **Hanam BBQ Tây Hồ (하남돼지집 서호점, West Lake Hanoi)** — a Korean premium BBQ restaurant targeting Vietnamese customers in Hanoi.

Vietnamese (default) / English one-page scroll site. No build step.

## Stack

- HTML5 + CSS3 (custom properties, grid/flex) + Vanilla JS (ES5-safe, no bundler)
- Google Fonts: Be Vietnam Pro (body) + Noto Serif Display (headings) — full Vietnamese diacritic support
- Google Maps embed (iframe)
- Deploy: Vercel (static) — auto-deploys from `main`. Live: https://hanam-bbq-tayho.vercel.app/
  (GitHub Pages mirror, same commit: https://kimyeseul3149.github.io/hanam-bbq-tayho/)

## Structure

```
index.html
assets/
  css/styles.css
  js/content.js   # window.CONTENT = { vi, en } i18n dictionary
  js/menu.js      # window.MENU = [...] 8 signature grill cuts
  js/app.js       # getLang / applyLang / renderMenu / animateCounters / scroll reveal
  img/            # hanam-cut-a..j.jpg, logo.png
vercel.json       # { "cleanUrls": true }
```

## i18n

- Every visible string uses `data-i18n="key"` and resolves from `window.CONTENT[lang][key]`.
- `getLang()` reads `localStorage.hanam_lang` (default `vi`).
- `applyLang(lang)` swaps text, sets `<html lang>`, toggles the VI/EN buttons, and re-renders the menu.
- Korean original appears only as a secondary label on menu cards.

## Run locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

Works on `file://` too (data is JS objects, not fetch).

## Deploy (Vercel)

```bash
npx vercel --prod
```

Or connect the git repo in the Vercel dashboard (framework preset: **Other**, no build command, output = repo root).

## Store data (do not alter)

- Address: 36-38 Đ. Xuân Diệu, Tứ Liên, Tây Hồ, Hà Nội 100000
- Phone: +84 964 321 771
- Rating: 4.8★ Google · Hours: 11:00–22:00 (may vary)
- Coordinates: 21.061464, 105.8316161
- Facebook Messenger: https://m.me/61579247412593

## Open review items

- **Translations (vi & en) are DRAFT** — menu names/descriptions and story copy need a Vietnamese native review. Marked with `// TODO(review): VN native check`.
- **Testimonials are placeholders** — attributed to visit-type personas (family / business / couple), not real named people. Replace with real Google/Facebook reviews. Marked `// TODO(review): replace with real customer reviews`.
- **Menu images** are mapped per the design brief; verify each cut photo matches its dish before launch.
- **Opening hours** are estimated (11:00–22:00 daily) — confirm per-day hours; the UI links to Google Maps for the live source.
```
