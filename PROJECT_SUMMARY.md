# PROJECT SUMMARY — 하남돼지집 서호점 랜딩페이지

기능·구조·기술 스택 요약. (실행 방법은 [README.md](README.md), 유지보수는 [HANDOVER.md](HANDOVER.md))

기준일: 2026-07-30

---

## 1. 한눈에

| 항목 | 내용 |
|---|---|
| 무엇 | 하노이 서호점 한국식 BBQ 홍보 랜딩페이지 (원페이지 스크롤) |
| 누구에게 | 하노이 거주 베트남인 (Meta 광고 유입) |
| 목표 | 인지도 확대 + 브랜딩 → **예약 유도** (메신저 문의·전화·길찾기) |
| 성격 | 2주 운영 프로젝트성 · 빌드 없는 정적 사이트 |
| 규모 | 소스 약 4,100줄 (HTML 525 / CSS 2,071 / JS 1,512) + 이미지 39 + 웹폰트 26 |

---

## 2. 기술 스택

- **HTML5** — 시맨틱 마크업, 접근성 속성(`aria-*`, `role`, skip-link)
- **CSS3** — CSS custom properties(디자인 토큰), grid/flex 레이아웃, 반응형(뷰포트 900px 기준 모바일/데스크톱 분기), 스크롤 리빌 애니메이션
- **Vanilla JS (ES5 안전)** — 번들러·프레임워크 없음. 전역 객체(`window.CONTENT`, `window.MENU`, `window.HanamTrack`)로 모듈 간 통신
- **웹폰트** — Be Vietnam Pro(본문) + Noto Serif Display(제목), **셀프호스팅** woff2 26종. 베트남어 성조 기호(diacritic) 전 범위 유지
- **Amplitude** — Analytics + Session Replay, `@amplitude/unified` ESM CDN, autocapture on, 리플레이 10% 샘플
- **Google Maps** — iframe embed
- **배포** — Vercel 정적 호스팅(`main` 자동 배포) + GitHub Pages 미러

빌드 파이프라인·트랜스파일·패키지 매니저·CI 없음. **소스 = 배포 산출물.**

---

## 3. 파일별 역할

| 파일 | 줄수 | 역할 |
|---|---|---|
| `index.html` | 525 | 전 섹션 마크업 (헤더·히어로·스토리·왜하남·메뉴·프로모·후기·방문·개인정보 모달) |
| `assets/css/styles.css` | 1,683 | 전체 스타일 (레이아웃·컴포넌트·반응형·애니메이션) |
| `assets/css/fonts.css` | 388 | `@font-face` 26종 — 셀프호스팅 폰트 선언 (unicode-range 서브셋) |
| `assets/js/content.js` | 229 | `window.CONTENT = { vi, en }` — i18n 문자열 사전 |
| `assets/js/menu.js` | 448 | `window.MENU` — 메뉴 항목 데이터(부위·가격·카테고리·이미지) |
| `assets/js/app.js` | 797 | 앱 로직 전부 (아래 4절) |
| `assets/js/analytics.js` | 38 | Amplitude 초기화 + `HanamTrack`/`HanamSetUser` 헬퍼 노출 |

---

## 4. `app.js` 가 하는 일

- **언어** — `getLang()`(localStorage) / `applyLang()`(텍스트·`<html lang>`·버튼·메뉴 재렌더) / VI·EN 토글 처리
- **메뉴** — `window.MENU` → 카드 렌더, 탭 전환(인기·메인·사이드·주류), 그룹 점프 칩(콤보·돼지·소·런치), 카드 클릭 시 상세 모달(라이트박스, 키보드 접근)
- **히어로** — 4장 슬라이드쇼(자동 순환 + 도트 네비)
- **스크롤 연출** — IntersectionObserver 기반 섹션 리빌, 숫자 카운터 애니메이션
- **인앱 브라우저 경고** — 카카오톡·라인·잘로 등 메신저를 못 여는 인앱 UA 감지 시 안내 문구 노출
- **개인정보 모달** — 베트남 Decree 13 정책 모달 열기/닫기, 동의 노트
- **모바일 내비** — 햄버거 토글(풀스크린 오버레이)
- **분석 훅** — 마크업의 `data-evt-*` 속성을 읽어 클릭마다 `HanamTrack(...)` 호출

---

## 5. 페이지 섹션 구성

| 순서 | 섹션 | 내용 |
|---|---|---|
| 1 | 헤더 | 엠블럼 워드마크 · 내비(스토리/왜하남/메뉴/방문) · VI·EN · 메신저 CTA · 햄버거 |
| 2 | 히어로 | 4장 슬라이드쇼 · 슬로건 · 주 CTA(메신저 예약) + 메뉴/지도 보조 CTA |
| 3 | 스토리(`#story`) | 브랜드 서사 + 그릴링 사진 |
| 4 | 왜 하남(`#why`) | 지그재그 3블록(레이크뷰·프라이빗룸·메뉴) + Every Day Offers |
| 5 | 메뉴(`#menu`) | 탭 + 그룹 점프 + 카드 + 상세 모달 |
| 6 | 프로모 | 생일·해피아워·럭키드로우 오퍼 카드 |
| 7 | 후기 | Google 후기(현재 페르소나 플레이스홀더) |
| 8 | 방문(`#visit`) | 지도 embed · 주소·전화·영업시간 · 메신저/전화/길찾기 CTA · 페이스북 링크 |
| — | 개인정보 모달 | Decree 13 정책 (vi/en 블록) |
| — | 우하단 고정 버튼 | 전화 걸기 (floating) |

---

## 6. 분석 계측 (Amplitude)

**커스텀 이벤트 8종** (전체 스펙은 [AMPLITUDE_GUIDE.md](AMPLITUDE_GUIDE.md) §4):

| 이벤트 | 뜻 |
|---|---|
| `CTA Clicked` | 주요 CTA 클릭 (`cta_type`: message_book / call_phone / directions_reserve / view_menu / visit_facebook) — **핵심 전환** |
| `Navigation Clicked` | 내비 링크 (`nav_item`) |
| `Language Switched` | VI↔EN 토글 |
| `Menu Tab Switched` | 메뉴 탭 전환 |
| `Menu Group Jumped` | 메인 탭 그룹 점프 |
| `Menu Item Viewed` | 메뉴 카드 클릭 → 상세 모달 오픈 |
| `Menu Modal Closed` | 상세 모달 닫기 |
| `Privacy Policy Viewed` | 개인정보 정책 열람 |

- 모든 커스텀 이벤트에 `language` + `device_type` 자동 첨부.
- UTM 5종(source/medium/campaign/term/content)은 유저 속성으로 자동 수집. **Meta 광고세트는 `utm_term`, 소재는 `utm_content`.**
- **핵심 KPI = 예약 유도** = `CTA Clicked` (cta_type `message_book` + `call_phone`) 건수 및 유도율.

**측정 못 하는 것** (설계상 클릭 기반): 스크롤 깊이·섹션 노출·체류시간(정확)·메신저 실제 전송 성공·실제 예약 완료. → [AMPLITUDE_GUIDE.md](AMPLITUDE_GUIDE.md) §10 참조.

---

## 7. 성능

- 히어로 이미지 `preload` + `fetchpriority="high"`
- 폰트 **셀프호스팅**으로 렌더 블로킹 교차 출처 요청 제거 → FCP 약 3.8s→2.6s, PSI 점수 69→78 (2026-07-27)
- 세션 리플레이 10% 샘플링으로 성능·용량·프라이버시 부담 절감

---

## 8. 관련 문서

- [README.md](README.md) — 소개·실행·배포
- [CHANGELOG.md](CHANGELOG.md) — 변경 이력
- [HANDOVER.md](HANDOVER.md) — 유지보수 주의점·개선 아이디어
- [AMPLITUDE_GUIDE.md](AMPLITUDE_GUIDE.md) — Amplitude 분석 가이드라인 (최종 마스터: 이벤트·레시피·대시보드·KPI·결정)
