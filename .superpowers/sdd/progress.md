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
