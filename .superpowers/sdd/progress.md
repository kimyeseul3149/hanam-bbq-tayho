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
