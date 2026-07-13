# Amplitude 이벤트 택소노미 — 하남 BBQ 서호점 랜딩

작성 2026-07-13. 기준: Amplitude Data 공식 컨벤션 (명사+과거형동사, Title Case / 속성 snake_case / 사소한 차이는 속성으로).

## 1. 비즈니스 목표 → 핵심 지표
- **목표**: 브랜드 인지도 + 신규 유입 (하노이 거주 베트남인)
- **핵심 전환(가장 중요)**: 방문·예약 의도 행동 = 길찾기/예약(구글맵), 메신저 문의, 전화
- **참여 지표**: 메뉴 탐색(탭 전환·항목 상세 열람), 내비 사용, 언어 선택, 스크롤 도달
- **트래픽**: 페이지뷰·유입 채널 (Amplitude 자동수집: device, os, country, referrer, utm)

## 2. 네이밍 규칙
- 이벤트명: `Noun + Past-tense Verb`, **Title Case** — 예: `CTA Clicked`, `Menu Item Viewed`
- 속성 키: `snake_case`, 값은 소문자 스네이크 — 예: `cta_type: "directions_reserve"`
- 동적 값(부위명·가격 등)은 **이벤트명에 넣지 않고 속성으로**
- 자동수집(autocapture)의 `[Amplitude] Element Clicked`·`Page Viewed`는 탐색용으로 유지, 아래 **커스텀 이벤트가 분석의 뼈대**

## 3. 공통 이벤트 속성 (해당되는 모든 이벤트에 첨부)
| 속성 | 타입 | 값/예시 | 설명 |
|------|------|---------|------|
| `language` | enum | `vi` \| `en` | 클릭 시점 UI 언어 |
| `section` | enum | `header` `hero` `story` `why` `promo` `menu` `visit` `footer` | 요소가 속한 섹션 |
| `device_type` | enum | `mobile` \| `desktop` | (Amplitude 기본 platform으로 대체 가능) |

## 4. 클릭 이벤트 (핵심)

### 4.1 `CTA Clicked` — 모든 주요 CTA 버튼 (전환 이벤트)
| 속성 | 값 |
|------|-----|
| `cta_type` | `directions_reserve` \| `message_book` \| `call_phone` \| `view_menu` |
| `cta_location` | `header` \| `hero` \| `visit_section` \| `menu_note` |
| `destination` | `google_maps` \| `messenger` \| `phone_dialer` \| `menu_anchor` |
| `language` | `vi` \| `en` |
- 대상: 헤더/히어로/방문섹션의 "Chỉ đường & Đặt bàn", 방문섹션 "Nhắn tin đặt bàn"(m.me), "Gọi điện"(tel:), "Xem trên Google Maps", 히어로 "Xem thực đơn"(view_menu)

### 4.2 `Navigation Clicked` — 내비 링크
| 속성 | 값 |
|------|-----|
| `nav_item` | `story` \| `why_hanam` \| `menu` \| `visit` |
| `nav_location` | `header` \| `mobile_overlay` \| `footer` |
| `language` | `vi` \| `en` |

### 4.3 `Language Switched` — VI/EN 토글
| 속성 | 값 |
|------|-----|
| `from_language` | `vi` \| `en` |
| `to_language` | `vi` \| `en` |
- 추가: 유저 속성 `preferred_language` 를 to_language 값으로 set (사용자 특성)

### 4.4 `Menu Tab Switched` — 메인/사이드/주류 탭
| 속성 | 값 |
|------|-----|
| `menu_tab` | `main` \| `side` \| `alcohol` |
| `language` | `vi` \| `en` |

### 4.5 `Menu Item Viewed` — 메뉴 카드 클릭(상세 모달 오픈) = 관심/참여
| 속성 | 값/예시 |
|------|---------|
| `item_id` | `samgyeopsal`, `wagyu_combo`, `kimchi_stew` … |
| `item_name_ko` | `생삼겹살`, `와규 콤보` … |
| `item_category` | `pork` \| `beef` \| `combo` \| `side` |
| `item_price_vnd` | `250000` (숫자) |
| `menu_tab` | `main` \| `side` \| `alcohol` |
| `language` | `vi` \| `en` |

### 4.6 `Menu Modal Closed` — 상세 모달 닫기 (선택)
| 속성 | 값 |
|------|-----|
| `item_id` | (열려 있던 항목) |
| `close_method` | `close_button` \| `overlay` \| `escape` |

## 5. (선택) 스크롤/노출 이벤트 — 클릭 외 보강
| 이벤트 | 트리거 | 속성 |
|--------|--------|------|
| `Promotion Viewed` | 프로모션 배너 뷰포트 진입 | `promo_type`(early_bird \| golden_hour) |
| `Section Viewed` | 섹션 뷰포트 진입 | `section` |
> 클릭 중심 설계라 5번은 후순위. 필요 시 IntersectionObserver로 추가.

## 6. 유저 속성
| 속성 | 값 | 설정 시점 |
|------|-----|-----------|
| `preferred_language` | `vi` \| `en` | 언어 토글 시 |
| (Amplitude 기본) | device, os, country, city, referrer, utm | 자동 |

## 7. 구현 메모
- `analytics.js`(모듈)에서 `window.HanamTrack = (name, props) => amplitude.track(name, props)` 및 `window.HanamSetUser = (k,v)=>amplitude.setUserProperties?...` 노출 → 클래식 스크립트 `app.js`에서 호출.
- 각 요소에 이벤트/속성을 data-* 속성으로 부여하거나, app.js 핸들러에서 직접 track 호출.
- autocapture 유지(page views + 탐색). 커스텀 이벤트로 전환·참여 분석.
