# Menu Detail Descriptions + Click Modal (Lightbox) — Implementation Report

Date: 2026-07-12
Spec: `docs/superpowers/specs/menu-details.md` (AUTHORITATIVE)

## Summary
Added `desc:{vi,en}` detail text to every pork (7) and side (9) menu item, and built a
single reusable click/keyboard modal (lightbox) that opens from every photo card
(main pork/beef/combo + side). Alcohol list is unchanged (no photos, not clickable).
All visible strings come from data/dictionary; VI default + EN toggle preserved.

## Files changed
- `assets/js/menu.js` — added exact vi/en `desc` from the spec to all 7 pork and all 9 side items.
  Existing beef(2)/combo(2) `desc` untouched. `// TODO(review): VN native check` kept.
- `assets/js/content.js` — added i18n keys `menu_view_details` and `menu_modal_close` (vi + en).
- `index.html` — added ONE reusable modal container (`#menu-modal`, `role="dialog"`,
  `aria-modal="true"`, hidden by default) just before the script tags. Close button uses
  `data-i18n-aria="menu_modal_close"`.
- `assets/js/app.js`:
  - `menuCardHTML` now emits photo cards with `data-item-id`, `role="button"`, `tabindex="0"`,
    `aria-label` (name + localized "View details"), class `is-clickable`, and escaped attributes.
  - New modal module: `findMenuItem`, `openMenuModal`, `closeMenuModal`, `escapeHTML`, `initMenuModal`.
  - Event delegation on `#menu-grid` (click + Enter/Space keydown). Card is looked up by
    `data-item-id` in the active category's flat list (`window.MENU[currentMenuCat]`).
  - Modal reads current language at open time. Combo multi-line desc preserved via `\n`→`<br>`
    (text escaped first). Body scroll locked (`body.modal-open`), ESC / overlay / × close,
    focus returns to the triggering card on close. `initMenuModal()` wired into `boot()`.
- `assets/css/styles.css`:
  - Card affordance: `.menu-card.is-clickable { cursor:pointer }`, gold `:focus-visible` outline,
    subtle `:active` press.
  - Full modal styling: dark translucent backdrop + blur, centered dialog on desktop
    (max-width 560px, internal scroll), near-fullscreen on mobile (`@media max-width:640px`,
    100dvh, no border/radius). Gold accents, existing tokens (`--gold`, `--bg-2/3`, `--r-lg`,
    `--ease`). Smooth open/close transition; `prefers-reduced-motion` disables it.

## Commits
See `git log --oneline` (filled at commit time below).

## Verification (evidence)
Served locally at `http://localhost:8000` and driven via browser automation + DOM/computed-style
assertions. NOTE: raw screenshot capture repeatedly timed out in this environment (renderer
pauses mid-transition — this also produced transient "opacity:0" / scaled-size readings that
resolved to correct values once transitions were bypassed). Per the task fallback, verification
was done via DOM state and computed styles instead of image screenshots.

Results (all PASS):
- Pork card (생삼겹살) click → modal opens: hidden=false, is-open, body locked; KO="생삼겹살",
  name/price/desc correct; img alt set; role=dialog, aria-modal=true.
- Close via ESC, overlay click, × button — all set hidden=true and restore body scroll;
  focus returns to the triggering card (focusReturnedToCard=true).
- Combo card (moksal-set) desc renders 3 lines with `<br>` (multi-line preserved).
- Side card (steamed-egg) opens via keyboard Enter and Space; VI name/ko/desc correct.
- EN toggle then open pork (galmaegisal) → English name + English desc.
- Alcohol tab: 0 clickable modal cards (`.menu-card[data-item-id]`), 5 alcohol rows intact.
- Computed styles: `.menu-modal.is-open` → opacity 1 / visibility visible; overlay
  rgba(9,8,7,0.78); KO color rgb(200,169,106) = --gold.
- Mobile 390px: modal + dialog computed width 390px, border 0, radius 0, align stretch
  (near-fullscreen); document scrollWidth 390 == viewport (no horizontal overflow).
- Console: zero errors throughout.

## Deviations / concerns
- Language-while-open: implemented "read current lang at open" (per task's simplest option).
  A modal already open does not live-swap language; reopening reflects the new language.
- Screenshots: could not be captured in this environment (see note above); verification relied
  on DOM/computed-style assertions, which fully covered the acceptance checklist.
- Translations remain draft (`// TODO(review): VN native check`) pending native review.
