# Google reviews on the landing page — source & provenance

Captured **2026-07-17** from the Google Maps listing for Hanam BBQ Tây Hồ
(`cid=13948591582597685325`, 4.8★ / 246 reviews), sorted **Newest**.

Selection rule (per client request): the three most recent reviews that are
**5 stars AND have a photo attached**. A 4★ review ("블비", a week ago, 1 photo)
sits between #2 and #3 chronologically and was skipped for not meeting the rating bar.

| # | Author | Age at capture | Photos | i18n keys |
|---|--------|----------------|--------|-----------|
| 1 | Anh Tuan Phuong | 4 days | 1 | `rev_1*` |
| 2 | Thanh Tú Phạm | 6 days | 2 (first used) | `rev_2*` |
| 3 | Anh Hanoi (하노이 형) | 1 week | 1 | `rev_3*` |

## Text handling

- **VI dictionary** = the review as it appears on Google in Vietnamese.
  `rev_3` was written in Korean; the Vietnamese is Google's translation.
- **EN dictionary** = Google's English translation.
- Quotes are trimmed, never reworded. Trimmed quotes end in `…`:
  - `rev_1` original ends `...bên Hàn nha các chương trình 😘`. The trailing
    fragment is an autocorrect artifact and is cut at the ellipsis.
  - `rev_2` / `rev_3` drop a middle clause each for card length.

## Photos — OPEN LICENSING QUESTION

`assets/img/reviews/*.jpg` were downloaded from Google's CDN and are re-hosted here.

**These photos belong to the reviewers who took them, not to Hanam BBQ.** Re-publishing
them on a commercial site is common practice but is not covered by any license we hold,
and caching Google Maps content also cuts against Google's ToS. Before this goes into
paid promotion, do one of:

1. Ask each reviewer for permission (Google lets you reply to a review), or
2. Swap in Hanam's own photos of the same dishes, or
3. Drop the photos and keep the quotes.

The on-page credit line (`reviews_credit`) attributes the photos to guests via
Google Maps, which mitigates but does not resolve the above.

## Refreshing

Reviews go stale. Re-run the capture and update `rev_*` in `assets/js/content.js`
plus the three files in `assets/img/reviews/`. No dates are rendered on the page,
deliberately — relative ages ("4 days ago") would rot on a static build.
