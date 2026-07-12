# Menu v2 + Reviews Update — Report

Date: 2026-07-12
Source of truth: `docs/superpowers/specs/menu-v2-update.md`

## Files changed
- `assets/js/menu.js` — full rewrite. `window.MENU = { main, side, alcohol }`. main = pork(7) → beef(2) → combo(2) with `group` field; each item has `price` ("700,000 VND" format). side = 9 items with prices (비빔냉면 replaces 코다리 회냉면, modifiers removed). alcohol = 5 items (soju 3 + beer 2), `group` field, no `img`. `TODO(review): VN native check` retained at top.
- `assets/js/app.js` — `renderMenu` rewritten. Added `GROUP_TITLES`, `menuCardHTML` (price under KO in `.menu-meta`), `groupTitleHTML`, `renderCardsGrouped` (main grouped with headings in pork→beef→combo order), `renderAlcohol` (note + Soju/Beer list, no photos). Combo `desc` rendered with `\n`→`<br>`. Grid gets `menu-grid--alcohol` class on alcohol tab. Still called from `applyLang`; language toggle re-renders active category.
- `assets/js/content.js` — replaced placeholder reviews (rev_1/2/3 + `_who`) with 3 real Google reviews (Thanh Tú Phạm / Anh Hanoi (하노이 형) / Khanh Linh Le), vi + en. Added `rev_src` ("Google"), `menu_tab_alcohol` (vi "Đồ uống" / en "Alcohol"), `menu_alcohol_note` (vi/en per §5).
- `index.html` — added 3rd sub-tab `data-menu-cat="alcohol"` `data-i18n="menu_tab_alcohol"`. Restructured 3 review cards: `.review-cap` with `.review-author` + `.review-src` ("Google"). Removed `TODO(review): replace with real customer reviews` comment. 5-star display kept.
- `assets/css/styles.css` — `.menu-meta`/`.menu-price` (color = KO gold, medium weight, below KO). `.menu-group-title` (gold uppercase, letter-spaced, `grid-column: 1/-1`). Alcohol list layout (`.menu-grid--alcohol` block, 2-col `.alcohol-list`, group subheadings, item rows name-left/price-right in gold, note above). `.review-cap`/`.review-author`/`.review-src` (Google pill badge). Mobile 640: alcohol list single column, review-cap wraps.

## Verification evidence (DOM-level via browser JS eval on http://localhost:8000)
1. MAIN tab: 11 cards in exact order — GROUP Thịt heo → 7 pork → GROUP Bò Wagyu → 2 beef → GROUP Set trưa → 2 combo. First card price "700,000 VND"; price color rgb(200,169,106) == KO color rgb(200,169,106) (gold `--gold #C8A96A`). Combo desc has 2 `<br>` (3 lines). All 11 main image files return HTTP 200 valid image/jpeg.
2. SIDE tab: 9 cards, each with price. 비빔냉면 present, 코다리 회냉면 absent. Prices match spec (200k×3, 150k×2, 140k×2, 90k, 130k).
3. ALCOHOL tab (3rd button): note line + Soju group (3 rows) + Beer group (2 rows), prices 160k×3 / 50k / 70k. No `<img>` in grid. Grid class `menu-grid menu-grid--alcohol`.
4. Testimonials: 3 cards — Thanh Tú Phạm / Anh Hanoi (하노이 형) / Khanh Linh Le, each ★★★★★ + "Google" label.
5. VI/EN toggle: EN re-renders alcohol note + group titles (Soju/Beer) and main group titles (Pork/Wagyu Beef/Lunch Set); KO labels + prices persist. Console: zero errors. Mobile 390px: no horizontal overflow on main/side/alcohol (scrollWidth == clientWidth == 390).

Note: screenshot capture in the preview pane timed out repeatedly (pane/renderer limitation with image decode); all functional verification done via JS DOM inspection + HTTP checks, which is authoritative for correctness. Zero console errors throughout.

## Deviations / concerns
- Review #1 (Thanh Tú Phạm): dropped the trailing "❤️" emoji present in the spec, per the active anti-emoji design policy. Review text otherwise exact.
- Pork (§1) and Side (§4) items have NO descriptions in the authoritative spec, so cards render name + KO + price only (no `.menu-desc`). Only Beef (§2) and Combo (§3) carry descriptions, per spec. This is faithful to the source data (previous invented pork/side descriptions were removed).
- All vi/en names remain draft translations pending native check (`TODO(review)` retained).
