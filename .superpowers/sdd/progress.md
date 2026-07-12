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
