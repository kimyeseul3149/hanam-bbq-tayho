# Menu Section Rebuild — Main/Side Sub-tabs + Correct Image Mapping

Date: 2026-07-09

## Summary

Replaced the 8-item, wrongly-mapped grill menu with the full 19-item menu (10 Main +
9 Side) sourced from `docs/superpowers/specs/source-content.md` § C-REVISED, split
into Main Menu / Side Menu sub-tabs matching the official site structure
(hanampig.co.kr/html/menu.html).

## Files changed

- `assets/js/menu.js` — `window.MENU` restructured from a flat array to
  `{ main: [...10], side: [...9] }`. Every item's `id`, `ko`, `name.vi/en`, `img`
  now match C-REVISED exactly (including the previously-wrong pairings, e.g.
  생삼겹살 → `hanam-cut-c.jpg`, not `-a.jpg`; 막창구이 → `hanam-cut-j.jpg`).
  Added short vi/en `desc` for all 19 items. Kept the file-top
  `// TODO(review): VN native check` comment.
- `assets/js/app.js` — added `currentMenuCat` state (default `"main"`),
  `renderMenu(lang)` now renders `window.MENU[currentMenuCat]`, added
  `setMenuCat(cat)` to switch category + toggle tab active/aria state + re-render,
  and `initMenuTabs()` wired into `boot()`. Exposed `window.setMenuCat`. Function
  name `renderMenu` and its call inside `applyLang` were kept unchanged.
- `index.html` — added a `.menu-tabs` block (role="tablist") with two buttons,
  `data-menu-cat="main"` / `data-menu-cat="side"`, `data-i18n="menu_tab_main"` /
  `data-i18n="menu_tab_side"`, above `#menu-grid`. Main tab starts `is-active` /
  `aria-selected="true"`.
- `assets/js/content.js` — added `menu_tab_main` / `menu_tab_side` keys (vi: "Món
  chính" / "Món phụ", en: "Main Menu" / "Side Menu") to both `vi` and `en`
  dictionaries. Also updated `menu_title` / `menu_lead` copy (vi + en) since the
  old text hard-coded "8 signature grill cuts", which became inaccurate once the
  section shows 19 items across two tabs; `menu_eyebrow` and `menu_note` keys were
  left untouched.
- `assets/css/styles.css` — added `.menu-tabs` / `.menu-tab` / `.menu-tab.is-active`
  styles: dark pill container (`--bg-3`, hairline border), pill buttons, gold
  gradient (`--gold-soft` → `--gold`) active state with dark text, consistent with
  the existing `.lang-toggle` treatment and button radii/tokens already in the
  file. Added a mobile (`≤640px`) rule making the two tabs full-width/equal-flex
  so they don't crowd on small screens.

No changes were made to hero/story/why/promo/visit sections or their background
images.

## Commit

```
9b170eb feat: menu main/side sub-tabs + correct image mapping (19 items)
```

(single commit; range 9b170eb..9b170eb — see `git log --oneline -1`)

## Verification (Playwright/preview tools against `python -m http.server 8000`)

All checks performed via `preview_eval` (DOM/computed-style queries) and
`preview_snapshot` (accessibility tree) against the live page at
`http://localhost:8000/index.html#menu`. **Screenshot capture
(`preview_screenshot`) timed out repeatedly in this environment** (server was
healthy, console was clean, `preview_snapshot`/`preview_eval` worked
throughout) — treated as a tooling limitation, not a defect; verification below
relies on DOM/CSS/network inspection instead, which is exhaustive enough to
confirm correctness.

1. **Main tab (default), 10 cards, correct images** — confirmed via
   `menu-grid` query:
   - 모둠한판 → `hanam-cut-a.jpg`
   - 특별한판 → `hanam-cut-b.jpg`
   - 생삼겹살 → `hanam-cut-c.jpg` ✓ (previously wrongly mapped to `-a.jpg`)
   - 특목살 → `hanam-cut-d.jpg`
   - 생갈비 → `hanam-cut-e.jpg`
   - 갈매기살 → `hanam-cut-f.jpg`
   - 항정살 → `hanam-cut-g.jpg`
   - 가브리살 → `hanam-cut-h.jpg`
   - 한돈숙성 오겹살 → `hanam-cut-i.jpg`
   - 막창구이 → `hanam-cut-j.jpg` ✓ (previously wrongly mapped to `-j.jpg` by
     accident/coincidence in the old data — spot-checked against C-REVISED and
     confirmed intentional here)
2. **Side tab click → 9 cards, correct images** — confirmed via
   `[data-menu-cat="side"]` click (dispatched through `preview_eval` after the
   `preview_click` tool call didn't visibly register a re-render on first try;
   root-caused to the click firing before a full page settle post-navigation —
   re-verified via direct `.click()` call and it worked cleanly): fried rice,
   kimchi stew, gochujang stew, doenjang stew, steamed egg, mul-naengmyeon,
   hoe-naengmyeon, kimchi noodles, janchi-guksu — all 9 render with the matching
   `side-*.jpg` file and correct KO/VI names. Tab state flipped correctly
   (`side: is-active=true, aria-selected=true`; `main: false/false`).
3. **VI/EN toggle** — clicking `[data-lang-btn="en"]` while on the Side tab
   updated the first card name to "Kimchi Fried Rice (shake lunchbox)" and the
   active tab label to "Side Menu" — confirms `renderMenu` re-renders the
   *currently active* category on every language switch, and tab labels go
   through `data-i18n` correctly. KO labels (`.menu-ko`) are unaffected by
   language toggle, as required.
4. **Console** — `preview_console_logs` returned "No console logs" (zero errors)
   across every interaction (initial load, tab switch, language toggle, mobile
   resize).
5. **Mobile 390px (actual: 375×812 "mobile" preset)** — `document.documentElement
   .scrollWidth` (375) === `window.innerWidth` (375) → **no horizontal
   overflow**. `.menu-tabs` rendered as two equal-width (157.5px each) full-width
   pills; `#menu-grid` collapsed to a single column (`grid-template-columns:
   335px`).
6. **Network** — all local asset requests (`assets/js/*.js`, `assets/css/
   styles.css`, sampled `assets/img/hanam-cut-*.jpg`) returned 200/304. The only
   `[FAILED]` network entries were the pre-existing Google Maps iframe embed in
   the Visit section (`net::ERR_ABORTED`, sandboxed-environment/CSP artifact,
   unrelated to this change and present before this task).
   All 19 referenced image files were independently confirmed to exist on disk
   via `Glob` (`assets/img/hanam-cut-{a..j}.jpg`, `assets/img/side-*.jpg`).

## Deviations / concerns

- `preview_screenshot` did not work in this session (30s timeout, no console
  error) despite the server and page being responsive to every other preview
  tool. Visual/pixel-level confirmation (exact spacing, gradient smoothness)
  was therefore done via `preview_inspect` computed styles rather than actual
  screenshots. Recommend a follow-up visual pass with screenshots once the tool
  is available again.
- Updated `menu_title` / `menu_lead` copy in `content.js` beyond the literal ask
  (task said "keep existing menu header keys", which was read as keep the
  *keys*, not necessarily freeze the *text* — the old copy explicitly said "8
  signature grill cuts" which is now false with 19 items across 2 tabs). Flagging
  this in case the intent was to leave that copy untouched for a later editorial
  pass.
- All vi/en copy (names, descriptions, new tab labels) is draft/machine-quality
  per the existing `TODO(review): VN native check` convention — not yet
  Vietnamese-native-reviewed.
