# Progress Ledger — Hanam BBQ Tây Hồ Landing

- Setup: git init, folders created

## Assets
- 10 official Hanam cut photos (608px, dark slate) → assets/img/hanam-cut-{a..j}.jpg
- Logo (720px, black bg) → assets/img/logo.png
- Menu mapping: samgyeopsal=a, teukmoksal=g, saenggalbi=c, galmaegisal=h, hangjeongsal=d, gabrisal=e, ogyeopsal=i, makchang=j; hero=f, story-bg=b
- Facade night shot: only 206px on FB → decided to use food photography for hero instead (higher quality)

## Build + Review (2026-07-09)
- Implementer built full site (commits 14895b2..5320146). DONE_WITH_CONCERNS.
- Controller visual+functional review: hero/story/why/testimonials/promo/menu(8 cards w/ photos)/visit all render; dark-premium coherent; VI default + EN toggle works (html lang + localStorage); counters animate; menu Korean labels present; console errors 0; mobile 390px clean; no horizontal overflow.
- Note: full-page screenshot showed blank below-fold = lazy-load/reveal artifact only; real viewport renders correctly.
- Open (content, not code): translations DRAFT (VN native review), testimonials = persona placeholders, hours estimated, map iframe blocked in preview sandbox (works on Vercel), deploy not yet run.
- STATUS: build complete & verified. Next: Vercel deploy (needs user auth).

## Menu expansion (2026-07-09)
- Extracted official 하남 menu via DOM caption→img pairing (reliable). MAIN 10 + SIDE 9 = 19 items.
- FIXED: prior 8-item main image mapping was wrong (6/8 mismatched). Correct: 모둠한판→a,특별한판→b,생삼겹살→c,특목살→d,생갈비→e,갈매기살→f,항정살→g,가브리살→h,오겹살→i,막창구이→j.
- Added SIDE 9 with own images (side-*.jpg), verified each dish↔photo matches.
- Menu section now has Main/Side sub-tabs (data-menu-cat), gold-pill styling. renderMenu(cat,lang). content.js menu_tab_main/side keys.
- Verified (controller screenshots): main 10 cards correct imgs, side 9 cards correct imgs, VI default (Món chính/Món phụ), EN toggle, KO labels, console 0 errors, mobile ok.
- Commits 45b0d67..4d9eee2 (feature 6588a20). STATUS: menu complete.

## Deployment (2026-07-09) — GitHub Pages
- GitHub CLI: already installed (winget, gh 2.96.0) + already authed as kimyeseul3149 (repo scope). gh auth login not needed.
- Repo: https://github.com/kimyeseul3149/hanam-bbq-tayho (public, main branch, 34 files)
- GitHub Pages enabled (main / root). LIVE URL: https://kimyeseul3149.github.io/hanam-bbq-tayho/
- Verified live: HTTP 200, VI default, logo+hero+menu images load under subpath (relative paths OK), all 5 sections, 10 menu cards. Hero renders correctly.
- STATUS: DEPLOYED & LIVE.

## Hosting — READ THIS FIRST (confirmed 2026-07-19)
- **PRIMARY URL: https://hanam-bbq-tayho.vercel.app/ — this is the one the user actually visits.**
- Vercel is wired to the GitHub repo and redeploys on every push to main. Nothing extra to run after `git push`.
- The GitHub Pages URL (https://kimyeseul3149.github.io/hanam-bbq-tayho/) is still live and serves the same commit. Secondary.
- The Vercel hookup happened after the 07-09 notes below were written, so those notes ("Vercel deploy not yet run", "needs user auth") are STALE — do not conclude from them that Vercel is unused. Verified 2026-07-19 by loading the Vercel URL and finding commit 2ecbdc7 already live.

## OPEN: Vietnamese copy is still an unreviewed draft (raised 2026-07-19)
- All 89 `vi` strings in content.js + every menu item name are FIRST-PASS TRANSLATION. The spec called for a native review on day one; it has never happened. The site has been live in this state since 07-09.
- Vietnamese is the default language and the target audience, so this is the highest-value open item.
- Machine-checkable finding: these render in English even in VI mode — `promo2_t` "Early Bird Happy Hour", `promo2b_t` "Reviewer Golden Hour". Unlike `hero_kicker`/`footer_tag` (brand lines, fine in English) these two describe an actual offer, so VI visitors miss the benefit.
- Genuinely native, do not touch: `rev_1`/`rev_2`/`rev_3` are verbatim Google reviews written by real Vietnamese customers.
- Highest risk if wrong: cut names (`Gáy heo` = 꼬들살, `Bẹ vai Prime` = 프라임 살치살, …) — a mistranslation here becomes a wrong order at the table.
- User decided 2026-07-19 to defer this to a separate session. Do not silently claim the copy reads naturally; nobody has verified it.

## Menu v2 + real reviews (2026-07-12)
- (1) Testimonials → 3 real Google 5★ reviews (Thanh Tú Phạm, Anh Hanoi 하노이형, Khanh Linh Le), VN+EN, from Google Maps newest-sorted.
- (2) Prices added under Korean name, same gold color as .menu-ko.
- (3) Menu restructured: main = pork(7)→beef(2)→combo(2) with group headings; removed 생갈비/오겹살/막창; 코다리회냉면→비빔냉면.
- (4) New ALCOHOL tab (3rd): soju(3)+beer(2) list, no photos, note line.
- (5) Beef(와규 살치살/콤보) + Combo(목살갈비/제육볶음) added with prices+desc+images from Google Maps menu photos (beef-*.jpg, combo-*.jpg).
- Verified live (controller screenshots): all tabs, prices gold, group order, beef/combo images, alcohol list, real reviews, VI/EN toggle, map iframe renders. Console clean.
- Commit ea79084, pushed → live https://kimyeseul3149.github.io/hanam-bbq-tayho/ updated & verified.

## Menu detail modal (2026-07-12)
- Added desc:{vi,en} to all pork(7)+side(9) items (menu-details.md); beef/combo kept.
- Photo cards (main pork/beef/combo + side) now open a reusable lightbox modal on click/Enter/Space: large image + KO(gold) + name + price + detail desc (current lang, combo multi-line preserved). Close via ×/overlay/ESC, body scroll lock + focus return. role=dialog aria-modal. Alcohol list excluded.
- Verified (controller screenshots): desktop 생삼겹살 modal, VI combo modal (multi-line), mobile near-fullscreen (overflow 0), ESC close + scroll restore. Console clean.
- Commit 080293a.

## Menu group jump bar (2026-07-19)
- Main carries 25 items over 4 groups, so it now renders a sticky chip bar (Combo/Pork/Beef/Lunch Set) under the tabs. Chips are built from whatever titled groups the category renders — add a group to menu.js and its chip appears by itself. Shown for main only; alcohol builds its own headings and popular/side have no titled groups.
- Anchors + `scroll-margin-top`, plus a rAF-throttled scroll spy that lights the group you are reading.
- FIXED en route: `--header-h` was a hand-guessed 76px while the real header is ~133px (and shrinks on scroll). initHeader() now measures and publishes the real height on scroll/resize/fonts.ready — without it 57 of the bar's 64px sat behind the header.
- `GROUP_TITLES[g].short` is the chip label, falling back to the full title. Only combo needs one: "Set Combo" ellipsised to "Set Com…" once four chips split a phone width.
- Phone layout splits the width evenly (like .menu-tabs) rather than scrolling sideways, which had left the last chip visibly sliced. Verified no ellipsis at 390px and 320px in Vietnamese.
- Verified: 4/4 groups land clear of the bar (gaps 23–62px on phone, 55px desktop), active chip matches on both jump and manual scroll, bar never hides behind the header, 0 console errors, no horizontal overflow.

## Language default fix (2026-07-19)
- Report: "the page opens in English". The code default was already `vi` — the cause was persistence, not the default. One EN toggle wrote `localStorage.hanam_lang` and that greeted the visitor in English on every later visit, forever.
- Language choice now lives in sessionStorage, so it holds while the tab is open and every fresh visit opens in Vietnamese. `dropLegacyLang()` deletes the old localStorage key on boot, or anyone who toggled EN under the previous build would stay stuck in English.
- Verified: seeded localStorage=en → reload lands in VI and the legacy key is gone; EN toggle survives a same-tab reload; cleared session → back to VI. 0 console errors.
- User chose this over "never remember" and over keeping permanent memory (2026-07-19).
