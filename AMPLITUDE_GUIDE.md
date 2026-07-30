# 하남돼지집 서호점 — 웹페이지 Amplitude 분석 가이드라인 (최종 마스터)

> **이 문서 하나가 최종본입니다.** 그동안 흩어져 있던 앰플리튜드 관련 문서
> (`amplitude-taxonomy.md` · `amplitude-events-guide.md` · `amplitude-diagnosis-plan.md` · `decision-log.md`)의
> 내용을 모두 여기에 통합했습니다. 분석은 **이 문서만** 참고하면 됩니다.

- **워크스페이스**: `dawn-cake-773363`
- **대상 페이지**: https://hanam-bbq-tayho.vercel.app/ (Meta 광고 유입 랜딩)
- **Amplitude 프로젝트 키**: `analytics.js`에 내장 (클라이언트 키, 공개값)
- **계측 방식**: `@amplitude/unified` ESM CDN, autocapture on, 세션 리플레이 10% 샘플
- **기준일**: 2026-07-30

---

## 목차

1. [5초 요약](#1-5초-요약)
2. [분석 목표 (3층)](#2-분석-목표-3층)
3. [핵심 KPI — 예약 유도](#3-핵심-kpi--예약-유도)
4. [계측된 이벤트 레퍼런스](#4-계측된-이벤트-레퍼런스)
5. [모든 분석의 공통 원칙](#5-모든-분석의-공통-원칙)
6. [핵심 분석 레시피 (차트 설정)](#6-핵심-분석-레시피-차트-설정)
7. [권장 대시보드 구성](#7-권장-대시보드-구성)
8. [매일 모니터링 루틴](#8-매일-모니터링-루틴)
9. [세션 리플레이](#9-세션-리플레이)
10. [측정할 수 없는 것 (한계)](#10-측정할-수-없는-것-한계)
11. [데이터 정확도 · 주의](#11-데이터-정확도--주의)
12. [운영 결정](#12-운영-결정)
13. [부록 — 발견 요약 (광고 7일차 스냅샷)](#13-부록--발견-요약-광고-7일차-스냅샷)

---

## 1. 5초 요약

- **핵심 KPI = 예약 유도** = `CTA Clicked` 중 `cta_type = message_book` + `call_phone`. 지표는 **건수 + 유도율**. 현재 유도율 **≈ 1.4%**.
- **모든 분석의 1단계는 `Country = Vietnam` 세그먼트** — 안 걸면 봇·QA 트래픽이 섞인다.
- **광고세트 = `utm_term`, 소재 = `utm_content`** 로 쪼갠다.
- **못 재는 것**: 스크롤 깊이·섹션 노출·정확한 체류시간·메신저 실제 전송·실제 예약 완료.
- **결정**: 운영 중 코드 수정 보류, 광고 종료 후 차기 페이지 학습용으로 분석.

---

## 2. 분석 목표 (3층)

이 페이지의 목표는 **인지도 확대 + 브랜딩 → 예약 유도**다. 각 층의 측정처가 다르다.

| 목표 층 | 무엇으로 측정 | 어디서 | 지표 |
|---|---|---|---|
| **인지도 확대** | 노출·도달 | **Meta 광고관리자** (페이지 아님) | Impressions, Reach, Frequency, 고유 링크 클릭 |
| **브랜딩** (관여) | 콘텐츠 상호작용 | Amplitude | 상호작용 도달률(메뉴 조회·탐색), 세션 리플레이(정성) |
| **예약 유도** (최종 KPI) | 예약 행동 시작 | Amplitude | **예약 유도 건수 + 유도율** |

> ⚠️ 브랜딩을 "체류시간·스크롤 깊이"로 재려던 초기 구상은 **이 페이지에선 불가**하다(§10). 대신 **콘텐츠 상호작용 수**를 대리 지표로 쓴다.

---

## 3. 핵심 KPI — 예약 유도

### 정의

**예약 유도 = 손님이 예약 행동을 시작함** (메신저 열기 / 전화 걸기). `CTA Clicked` 이벤트가 이걸 잡는다.

- **"예약 전환"(완료)이 아니라 "예약 유도"(시작)** 다. 매장 예약 데이터를 안정적으로 못 받아서, 완료가 아닌 유도를 목표로 잡았다. `CTA Clicked`는 "눌렀다"까지만 재므로 이 목표와 정확히 맞는다.

### 지표 두 개 (둘 다 본다)

| 지표 | 정의 | 뭘 말해주나 |
|---|---|---|
| **예약 유도 건수** | `cta_type = message_book` + `call_phone` 고유 사용자 | 절대 성과 — 몇 명을 예약 행동까지 데려왔나 |
| **예약 유도율** | 유도 건수 ÷ Page Viewed | 효율 — 방문 대비 |

- **현재 유도율 ≈ 1.4%** (광고 7일차, 베트남). — *정확도: 정확(퍼널 기준)*
- `directions_reserve`(지도 열기)는 **방문 의향 중간 지표**로 별도로 본다(전환 아님).
- `view_menu`·`visit_facebook`는 **전환 아님**.

> 예전에 보이던 "약 1%"는 `CTA Clicked` 전체(메뉴 스크롤 등 포함)를 섞은 **틀린 숫자**다. 예약 행동만 골라야 1.4%가 나온다.

---

## 4. 계측된 이벤트 레퍼런스

### 커스텀 이벤트 8종

| 이벤트 | 실제 행동 | 핵심 속성 |
|---|---|---|
| **`CTA Clicked`** | 주요 CTA 클릭 (전환의 뼈대) | `cta_type`, `cta_location`, `destination` |
| `Navigation Clicked` | 상단/모바일 내비 링크 | `nav_item`, `nav_location` |
| `Language Switched` | VI↔EN 토글 | `from_language`, `to_language` |
| `Menu Tab Switched` | 메뉴 탭 전환 | `menu_tab` |
| `Menu Group Jumped` | 메인 탭 그룹 점프 칩 | `menu_group` |
| `Menu Item Viewed` | 메뉴 카드 클릭 → 상세 모달 오픈 | `item_id`, `item_name_ko`, `item_category`, `item_price_vnd`, `menu_tab` |
| `Menu Modal Closed` | 상세 모달 닫기 | `item_id`, `close_method` |
| `Privacy Policy Viewed` | 개인정보 정책 열람 | `source` |

### 속성 값 전체

**`CTA Clicked`**
- `cta_type`: `message_book` · `call_phone` · `directions_reserve` · `view_menu` · `visit_facebook`
- `cta_location`: `header` · `hero` · `visit_section` · `floating` · `visit_map_embed` · `visit_facebook_link`
- `destination`: `messenger` · `phone_dialer` · `google_maps` · `menu_anchor` · `facebook_page`

**버튼 배치 (cta_location별 모바일 라벨 유무 — 중요)**

| cta_location | 위치 | 모바일 라벨 |
|---|---|---|
| `hero` | 첫 화면 큰 버튼 | 있음 |
| `header` | 상단바 메신저 | **없음 (아이콘만)** |
| `floating` | 우하단 전화 | **없음 (아이콘만)** |
| `visit_section` | 하단 방문안내 | 있음 |

**기타 이벤트 값**
- `nav_item`: `story` · `why_hanam` · `menu` · `visit` / `nav_location`: `header` · `mobile_overlay`
- `menu_tab`: `popular` · `main` · `side` · `alcohol`
- `menu_group`: `combo` · `pork` · `beef` · `lunch`
- `item_category`: `combo` · `pork` · `beef` · `lunch` · `side` · `soju` · `beer` · `trad` · `popular`
- `close_method`: `close_button` · `overlay` · `escape`

### 모든 커스텀 이벤트에 자동 첨부되는 속성

| 속성 | 값 | 비고 |
|---|---|---|
| `language` | `vi` / `en` | 클릭 시점 UI 언어 |
| `device_type` | `mobile` / `desktop` | **뷰포트 900px 기준** (Amplitude 기본 "Device type"과 다름) |

### 유저 속성 (자동)

- `utm_source` · `utm_medium` · `utm_campaign` · **`utm_term`(광고세트)** · **`utm_content`(소재)** — last-touch
- `initial_utm_*` — first-touch, 최초 1회 고정
- `preferred_language` — 언어 토글 시 set
- Amplitude 기본: `Country`, `city`, `os`, `device`, `referrer`, `fbclid`/`gclid`

> Amplitude가 잡는 UTM은 **표준 5개뿐**이다. `utm_adset` 같은 임의 키는 유저 속성이 안 되므로, **Meta 광고세트는 `utm_term`에 넣는다.** (2026-07-19 실측 확인)

---

## 5. 모든 분석의 공통 원칙

아래는 모든 차트에 공통 적용한다(각 레시피에서 생략).

```
세분화 기준   Country is Vietnam        ← 봇·광고심사·QA 트래픽 제외 (필수)
측정          고유 사용자 (Unique users)
기간          분석 목적에 맞게 (기본 광고 시작 이후 / 일별 모니터링은 당일)
```

- **전환창(conversion window)은 1일로 충분.** 이 페이지는 첫 방문에서 즉시 결정하는 구조라, 1일=4일 결과가 동일했다. 길게 잡으면 무관한 재방문이 섞여 부풀 수 있다.
- `language`·`device_type`은 모든 이벤트에 자동으로 붙으므로 어디서든 그룹화 기준으로 바로 쓸 수 있다.
- **유형별 "고유 사용자"를 합산할 때 주의**: 한 사람이 message + call을 둘 다 누르면 중복 카운트된다. 정확히 하려면 `cta_type = message_book OR call_phone` 필터로 **한 차트에서 고유 1개**로 본다.

---

## 6. 핵심 분석 레시피 (차트 설정)

순서대로 하되, 앞 결과가 뒤를 건너뛰게 만들 수 있다.

### 6-1. 이 트래픽은 진짜 사람인가 (기반)
```
차트   세분화 · 이벤트 Page Viewed · 그룹화 Country (베트남 세그먼트를 잠시 해제)
```
베트남 비중이 낮으면 → **페이지가 아니라 광고 타게팅부터.** 대부분 베트남이면 분모 신뢰 가능.

### 6-2. 예약 유도율 기준선 ★
```
차트   퍼널 · Page Viewed → CTA Clicked (필터 cta_type = message_book, call_phone) · 전환%
```
이 숫자를 **모든 개선의 기준선**으로 기록. (현재 ≈ 1.4%)

### 6-3. 광고세트·소재별 (페이지 문제 vs 광고 문제)
```
차트   퍼널 · Page Viewed → CTA Clicked(message/call) · 그룹화 utm_term  (그다음 utm_content)
```
- 특정 광고세트/소재만 튀면 → **낮은 것을 끄는 게 페이지 수정보다 효과 크다.**
- 모두 고르게 낮으면 → 페이지 쪽도 봐야 한다.
- (건수만 보면 예산 많은 쪽이 커 보이니, **반드시 퍼널로 "율"을 본다.** 세분화는 건수뿐이라 부족.)

### 6-4. 어떤 버튼이 눌리나
```
차트   세분화 · CTA Clicked(필터 message/call) · 그룹화 cta_location
```
`hero`가 압도 + `floating`·`header` 거의 0 → 아이콘 버튼에 라벨 추가 검토.
`floating`도 잘 눌리면 → **버튼 문제 아님, 건드리지 말 것.** (실제 결과: §13)

### 6-5. 모바일 vs 데스크톱
```
차트   퍼널 · Page Viewed → CTA Clicked(message/call) · 그룹화 device_type
```
⚠️ **주의**: 반드시 소문자 커스텀 `device_type`(mobile/desktop). 대문자 기본 "Device type"은 Android/iPhone이라 목적과 다르다. (광고 유입은 거의 전량 모바일)

### 6-6. 언어 (기본이 베트남어가 맞나)
```
차트A  세분화 · Language Switched · 그룹화 to_language
차트B  퍼널 · Page Viewed → CTA Clicked(message/call) · 그룹화 language
```
vi→en 전환이 많거나 en 사용자 유도율이 훨씬 높으면 → 타겟이 현지인이 아닐 수 있음(카피·기본언어 재검토).

### 6-7. 메뉴 관심
```
차트   세분화 · Menu Item Viewed · 그룹화 item_name_ko / item_category / item_price_vnd
```
특정 메뉴 쏠림 → 그 메뉴를 맨 위·히어로·소재로. 저가만 열어보면 → 가격 저항(세트·프로모 강화).

### 6-8. 상호작용 도달률 (브랜딩 대리 지표)
```
차트   퍼널 · Page Viewed → [Menu Item Viewed 또는 Menu Tab Switched 또는 Menu Group Jumped 또는 Navigation Clicked] · 전환%
```
"방문자 중 콘텐츠를 실제로 만진 %". 브랜딩 관여의 **최소 바닥값**(클릭 안 한 열독자는 미포함). 주 1회면 충분.

---

## 7. 권장 대시보드 구성

Amplitude Board에 아래 타일을 만든다. 공통: `Country = Vietnam`.

### 상단 KPI 6타일

| 타일 | 설정 |
|---|---|
| **New Users** | 세분화 · Page Viewed · 측정 New users |
| **예약 유도 건수** (+Most clicked) | 세분화 · CTA Clicked(필터 message/call) · Uniques (+그룹화 cta_location) |
| **예약 유도율** ★ | 퍼널 · Page Viewed→CTA Clicked(message/call) · 전환% |
| **Page Views** | 세분화 · Page Viewed · Totals |
| **Unique PV** | 세분화 · Page Viewed · Uniques |
| **상호작용 도달률** | 6-8 레시피 |

> ❌ **"Bounce Rate"와 "Avg Session Duration"은 넣지 않는다.** 이 페이지에선 신뢰 불가(§10). 각각 **상호작용 도달률**·**예약 유도율**로 대체한다. 굳이 바운스를 쓰면 `100% − 상호작용 도달률`이며, 구조상 95%+로 나오는 게 정상이니 놀라지 말 것.

### 하단 가설검정

- **예약 유도 daily trend** (막대) — 세분화 · CTA Clicked(message/call) · Uniques · 일별
- **관심 섹션** — 세분화 · Navigation Clicked · 그룹화 `nav_item` (+ Menu Item Viewed / directions_reserve). ⚠️ Promotion 섹션은 이벤트 없어 측정 불가.
- **By UTM_Term** — 퍼널 · 그룹화 `utm_term` (family vs business 유도율)

---

## 8. 매일 모니터링 루틴

수정을 안 하는 기간의 목적은 **최적화가 아니라 "캠페인 건강 감시"**다. 별도 구글시트에 매일 기록한다.

**입력 3칸** (나머지는 자동 계산):

| 컬럼 | 소스 |
|---|---|
| `meta_link_clicks_vn` | Meta 광고관리자 **고유 링크 클릭**(베트남, 당일) |
| `page_viewed_vn` | Amplitude `Page Viewed`(베트남·고유, 당일) |
| `cta_converted` | 퍼널 예약 유도 건수(당일) |
| `conversion_rate`(자동) | = 예약 유도율 |
| `arrival_rate`(자동) | = page_viewed ÷ meta_link_clicks (로딩 전 이탈 감시) |

> **고유 링크 클릭**을 써야 한다(총 링크 클릭 아님). 분자 `page_viewed`가 고유라 분모도 고유여야 도착률이 정확하다.

**이상 신호만 대응**:

| 오늘 | 의미 | 조치 |
|---|---|---|
| 유도율 1~1.5% | 정상 | 기록만 |
| 유도율 ≈0% 급락 | 광고 중단·추적 깨짐·사이트 다운 | 즉시 확인 |
| 방문 급감 | Meta 예산·심사·게재 문제 | 광고관리자 확인 |

**원칙**: 설정을 바꾸지 말 것(날짜별 비교 가능해야 함). 하루 ±0.3%는 노이즈, **추세와 급변만** 본다.

---

## 9. 세션 리플레이

### 왜 10%만 저장하나
비용(용량 10배 절감) · 성능(전량 녹화는 페이지 부담) · 개인정보. **클릭·퍼널은 100% 수집**되므로, 리플레이는 "통계"가 아니라 **"왜/어디서 막히나"를 눈으로 보는 정성 관찰용**이다.

### 사용법
```
필터   Country = Vietnam + 체류 5초 이상(봇·오클릭 제거)
샘플   5~10개 (3~4개째부터 패턴 반복)
```
- **이탈 세션**(CTA 안 누름): 첫 화면에서 뭘 보고 나가나 관찰.
- **전환 세션**: 무엇을 보고 눌렀나. "클릭까지 시간"은 리플레이 길이가 아니라 `CTA Clicked` 타임스탬프로 본다(클릭 후 방치시간 포함되어 부풀려짐).
- 리플레이 길이는 이벤트 기반 세션 길이보다 **실제 체류에 더 가깝다**(연속 녹화). 단, 방치된 탭이 부풀리니 **중앙값**을 쓰고 이상치는 뺀다.

### ⚠️ 보관 기간
리플레이 영상은 **보통 30일 안팎(플랜별 상이)** 만 보관된다. **"왜 안 눌렀나" 관찰은 광고 종료 직후에 끝낼 것.** 이벤트 데이터는 장기 보존된다.

---

## 10. 측정할 수 없는 것 (한계)

이 페이지는 **클릭 기반 이벤트만** 있다. 아래는 데이터가 없다는 사실 자체를 알고 해석해야 한다.

| 못 재는 것 | 이유 | 대안 |
|---|---|---|
| **스크롤 깊이 / 어디서 이탈** | `Scroll Depth`·`Section Viewed` 미구현 | 세션 리플레이 관찰 / 차기 페이지에 계측 추가 |
| **정확한 체류시간** | 이벤트가 클릭 시점에만 발생 → 안 누른 사람은 ~0으로 왜곡 | 리플레이 길이(중앙값)로 대략 / heartbeat 계측은 차기 |
| **바운스율** | GA식 네이티브 없음 + 위와 같은 이유 | 상호작용 도달률(정방향)로 대체 |
| **메신저 실제 전송 성공** | `CTA Clicked`는 "눌렀다"까지만. 인앱 브라우저는 눌러도 안 열림 | 실제 전환은 지표보다 낮을 수 있음(감안) |
| **실제 예약 완료 / ROAS** | Amplitude는 버튼 클릭까지만 | 매장 실제 문의 수 주 1회 집계로 대조 |

> `Menu Item Viewed`는 "메뉴를 봤다"가 아니라 **"카드를 눌러 상세 모달을 열었다"**만 센다. 혼동 주의.

---

## 11. 데이터 정확도 · 주의

- **봇·QA 트래픽**: 배포 도메인 접속은 QA라도 기록된다. 반드시 `Country = Vietnam`으로 거른다. — *영향: 큼*
- **유니크 중복 합산**: cta_type별 고유를 더하면 message+call 둘 다 누른 사람이 중복. 퍼널/OR필터로 회피. — *영향: 소(수 명)*
- **리플레이 10% 표본**: 특정 방문을 못 찾을 수 있다. 이벤트는 100%. — *영향: 정성 관찰엔 무관*
- **일별 고유 합 ≠ 기간 전체 고유**: 같은 사람이 여러 날 방문 시 일별엔 각각, 기간 전체엔 1회. 일별 추적엔 문제없음.
- **device_type 900px**: 태블릿 등 경계는 뷰포트 기준으로 갈린다.

정확도 표기 관례: 이벤트 카운트·전환율은 **정확**(Amplitude 직접). 도착률은 Meta 고유클릭 대조라 **정확**하되 위 "일별 합" 주의. 체류시간 추정은 **추정**.

---

## 12. 운영 결정

- 이 페이지는 **2주 운영 프로젝트성** 랜딩이며 캠페인 목표는 가이드라인상 전부 **'트래픽'** 으로 고정.
- **운영 중 전환 최적화성 코드 수정은 보류.** 표본이 적어(전환 수십 건) 수정 효과를 증명할 수 없고, 유일한 깨끗한 데이터셋을 오염시키기 때문. **성능·명백한 버그만 예외**(예: 폰트 셀프호스팅 — 이미 반영).
- **분석은 광고 종료 후** 2주 full 데이터로 1회. 목적은 "이 페이지 고치기"가 아니라 **차기 페이지 학습**.
- **세션 리플레이 관찰만 종료 직후**(보관 기간 때문).

---

## 13. 부록 — 발견 요약 (광고 7일차 스냅샷)

기간 2026-07-20 ~ 07-27 · 베트남 · 고유 사용자. *정확도: 정확(Amplitude/Meta 직접 집계).* 이후 표본이 커지면 갱신할 것.

**예약 유도율**
- 전체 ≈ **1.4%** (퍼널 44건 / 약 3,800 방문)

**광고세트별(utm_term)**
| 광고세트 | 방문 | 유도 | 유도율 |
|---|---|---|---|
| hanoi_2549_mf_business | 2,155 | 30 | **1.39%** |
| hanoi_2549_mf_family | 1,666 | 13 | **0.78%** |
| (none) | 23 | 1 | 4.35% (노이즈, 무시) |
→ business가 경향상 우세하나 표본 적어 유의성 미확정. 둘 다 1% 안팎.

**버튼별(cta_location, message+call)**
| hero | floating | header | visit_section |
|---|---|---|---|
| 21 | **18** | 5 | 1 |
→ **떠다니는 아이콘 버튼(floating) 잘 눌림 → 라벨 추가 불필요.** 전환은 첫 화면+고정 버튼에 87% 집중, 하단은 사실상 0.

**cta_type별 클릭 (세분화)**: message_book 37 · call_phone 28 · directions_reserve 16 · view_menu 8 · visit_facebook 5

**device**: 전환자 전원 mobile (데스크톱 코호트 없음)

**도착률(arrival_rate)**: 약 47~54% (예: 7/20 = 46.73%) → **메타 클릭 대비 약 46%가 로딩 전 이탈.** 폰트 최적화(FCP 3.8→2.6s) 후 개선 여부를 일별 시트에서 추적.

**결론**: 버튼도, 특정 광고세트만의 문제도 아님. 남은 후보는 **첫 화면(hero) 설득력**과 **트래픽 의향**('트래픽' 목표 광고의 구조적 한계, 고정). 실질적으로 만질 수 있는 건 첫 화면뿐이나, "왜"는 세션 리플레이 관찰로만 확인 가능.
