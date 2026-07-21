# Amplitude 이벤트 택소노미 — 하남 BBQ 서호점 랜딩

작성 2026-07-13 · 최종 갱신 2026-07-19(구현 대조 완료). 기준: Amplitude Data 공식 컨벤션 (명사+과거형동사, Title Case / 속성 snake_case / 사소한 차이는 속성으로).

> 이 문서는 **구현 스펙**이다. 각 이벤트가 실제로 어떤 행동을 뜻하는지, 분석을
> 어디서부터 시작하면 되는지는 [amplitude-events-guide.md](amplitude-events-guide.md) 참조.

## 1. 비즈니스 목표 → 핵심 지표
- **목표**: 브랜드 인지도 + 신규 유입 (하노이 거주 베트남인)
- **핵심 전환(가장 중요)**: 방문·예약 의도 행동 = 길찾기/예약(구글맵), 메신저 문의, 전화
- **참여 지표**: 메뉴 탐색(탭 전환·그룹 점프·항목 상세 열람), 내비 사용, 언어 선택
  - 스크롤 도달은 **미구현** — §5 참조
- **트래픽**: 페이지뷰·유입 채널 (Amplitude 자동수집: device, os, country, referrer, utm)

## 2. 네이밍 규칙
- 이벤트명: `Noun + Past-tense Verb`, **Title Case** — 예: `CTA Clicked`, `Menu Item Viewed`
- 속성 키: `snake_case`, 값은 소문자 스네이크 — 예: `cta_type: "directions_reserve"`
- 동적 값(부위명·가격 등)은 **이벤트명에 넣지 않고 속성으로**
- 자동수집(autocapture)의 `[Amplitude] Element Clicked`·`Page Viewed`는 탐색용으로 유지, 아래 **커스텀 이벤트가 분석의 뼈대**

## 3. 공통 이벤트 속성 (track() 이 모든 커스텀 이벤트에 자동 첨부)
| 속성 | 타입 | 값/예시 | 설명 |
|------|------|---------|------|
| `language` | enum | `vi` \| `en` | 클릭 시점 UI 언어 |
| `device_type` | enum | `mobile` \| `desktop` | 뷰포트 900px 기준 |

> `section` 은 계획 단계에만 있었고 **구현되지 않았다.** 요소 위치는 이벤트별
> `cta_location` / `nav_location` 으로 대신 파악한다.

## 4. 클릭 이벤트 (핵심)

### 4.1 `CTA Clicked` — 모든 주요 CTA 버튼 (전환 이벤트)
`index.html` 의 `data-evt-cta` / `data-evt-loc` / `data-evt-dest` 속성을 그대로 싣는다.

| 속성 | 값 |
|------|-----|
| `cta_type` | `message_book` \| `call_phone` \| `directions_reserve` \| `view_menu` \| `visit_facebook` |
| `cta_location` | `header` \| `hero` \| `visit_section` \| `floating` \| `visit_map_embed` \| `visit_facebook_link` |
| `destination` | `messenger` \| `phone_dialer` \| `google_maps` \| `menu_anchor` \| `facebook_page` |

**실제 배치된 조합 (10개)**

| cta_type | cta_location | destination | 화면상 위치 |
|----------|--------------|-------------|-------------|
| `message_book` | `header` | `messenger` | 상단바 골드 버튼 |
| `message_book` | `hero` | `messenger` | 첫 화면 메인 버튼 |
| `message_book` | `visit_section` | `messenger` | 맨 아래 예약 버튼 |
| `call_phone` | `visit_section` | `phone_dialer` | 맨 아래 전화 버튼 |
| `call_phone` | `floating` | `phone_dialer` | 우하단 떠 있는 버튼 |
| `directions_reserve` | `hero` | `google_maps` | 첫 화면 지도 버튼 |
| `directions_reserve` | `visit_section` | `google_maps` | 맨 아래 지도 버튼 |
| `directions_reserve` | `visit_map_embed` | `google_maps` | 지도 위 투명 링크 |
| `view_menu` | `hero` | `menu_anchor` | 첫 화면 "메뉴 보기" |
| `visit_facebook` | `visit_facebook_link` | `facebook_page` | 맨 아래 텍스트 링크 |

> **주 전환은 `cta_type = message_book`.** `directions_reserve` 는 방문 의향
> 중간 지표로 본다. `menu_note` 위치는 해당 문구를 삭제하면서 사라졌다.

### 4.2 `Navigation Clicked` — 내비 링크
| 속성 | 값 |
|------|-----|
| `nav_item` | `story` \| `why_hanam` \| `menu` \| `visit` |
| `nav_location` | `header` \| `mobile_overlay` |

> 햄버거 버튼이 보이면 `mobile_overlay`, 아니면 `header`. **푸터 내비는 없다.**

### 4.3 `Language Switched` — VI/EN 토글
| 속성 | 값 |
|------|-----|
| `from_language` | `vi` \| `en` |
| `to_language` | `vi` \| `en` |
- 값이 실제로 바뀔 때만 발생 (같은 언어 재클릭은 무시)
- 유저 속성 `preferred_language` 를 `to_language` 값으로 set

### 4.4 `Menu Tab Switched` — 메뉴 상단 4개 탭
| 속성 | 값 |
|------|-----|
| `menu_tab` | `popular` \| `main` \| `side` \| `alcohol` |
- 탭이 실제로 바뀔 때만 발생

### 4.5 `Menu Group Jumped` — 메인 탭의 그룹 점프 칩
| 속성 | 값 |
|------|-----|
| `menu_group` | `combo` \| `pork` \| `beef` \| `lunch` |

### 4.6 `Menu Item Viewed` — 메뉴 카드 클릭(상세 모달 오픈) = 관심/참여
| 속성 | 값/예시 |
|------|---------|
| `item_id` | `saengsamgyeopsal`, `combo-wagyu`, `kimchi-stew` … (`popular` 탭은 `pop-` 접두) |
| `item_name_ko` | `생삼겹살`, `와규 콤보` … |
| `item_category` | `combo` \| `pork` \| `beef` \| `lunch` \| `side` \| `soju` \| `beer` \| `trad` \| `popular` |
| `item_price_vnd` | `250000` (숫자 — 가격대별 관심도 분석용) |
| `menu_tab` | 클릭 당시 활성 탭 |

### 4.7 `Menu Modal Closed` — 상세 모달 닫기
| 속성 | 값 |
|------|-----|
| `item_id` | 열려 있던 항목 |
| `close_method` | `close_button` \| `overlay` \| `escape` |

### 4.8 `Privacy Policy Viewed` — 개인정보 정책 모달 열람
| 속성 | 값 |
|------|-----|
| `source` | `consent_or_footer` (트리거에 `data-evt-loc` 이 없을 때의 폴백) |

## 5. 미구현 — 스크롤/노출 이벤트
| 이벤트 | 트리거 | 상태 |
|--------|--------|------|
| `Scroll Depth Reached` | 25/50/75/100% 도달 | **미구현.** 랜딩 이탈 지점 분석에는 필요 |
| `Promotion Viewed` | 프로모션 카드 뷰포트 진입 | 미구현 |
| `Section Viewed` | 섹션 뷰포트 진입 | 미구현 |
> 클릭 중심 설계라 후순위. 필요 시 IntersectionObserver 로 추가.

## 6. 유저 속성
| 속성 | 값 | 설정 시점 |
|------|-----|-----------|
| `preferred_language` | `vi` \| `en` | 언어 토글 시 |
| `utm_source` / `utm_medium` / `utm_campaign` / `utm_term` / `utm_content` | 광고 URL 파라미터 | 자동 (last-touch) |
| `initial_utm_*` | 위와 동일 | 자동 (first-touch, 최초 1회 고정) |
| (Amplitude 기본) | device, os, country, city, referrer, fbclid/gclid | 자동 |

> Amplitude 가 잡는 UTM 은 **표준 5개뿐**이다. `utm_adset` 같은 임의 키는
> 유저 속성이 되지 않으므로, Meta 광고세트는 **`utm_term`** 에 넣는다.
> 2026-07-19 대시보드에서 실측 확인 완료.

## 7. 구현 메모
- `analytics.js`(ESM 모듈)가 `window.HanamTrack(name, props)` / `window.HanamSetUser(k, v)` 를 노출 → 클래식 스크립트 `app.js` 에서 호출.
- `track()` 이 `language` + `device_type` 을 자동으로 덧붙인다.
- `initAll(..., { analytics: { autocapture: true }, sessionReplay: { sampleRate: 0.1 } })`.
  - autocapture 로 `[Amplitude] Page Viewed` 등과 UTM 어트리뷰션이 자동 수집된다.
  - **세션 리플레이는 10% 샘플링** — 특정 방문을 리플레이에서 못 찾을 수 있다.
- `IS_LOCAL` 가드로 localhost/127.0.0.1 에서는 전송하지 않는다. **배포 도메인 접속은
  QA 목적이라도 이벤트가 기록되므로**, 지표를 볼 때 `Country = Vietnam` 등으로 걸러낸다.
