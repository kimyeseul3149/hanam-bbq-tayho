# 하남돼지집 서호점 — 랜딩페이지 (Hanam BBQ Tây Hồ)

하노이 서호(West Lake)에 있는 한국식 프리미엄 돼지고기 BBQ **하남돼지집 서호점**의 홍보용 랜딩페이지입니다.
하노이 거주 베트남인을 타겟으로 하는 **Meta 광고 유입 전용** 원페이지 사이트입니다.

- **라이브(운영)**: https://hanam-bbq-tayho.vercel.app/  ← `main` 브랜치 자동 배포
- **미러(GitHub Pages)**: https://kimyeseul3149.github.io/hanam-bbq-tayho/
- **언어**: 베트남어(기본) / 영어 토글 · 한국어는 메뉴 카드 보조 라벨로만 노출
- **성격**: 2주 운영 프로젝트성 페이지 · 빌드 스텝 없는 순수 정적 사이트

---

## 기술 스택

| 영역 | 사용 |
|---|---|
| 마크업/스타일 | HTML5 + CSS3 (CSS custom properties, grid/flex) |
| 스크립트 | Vanilla JS (ES5 안전, 번들러 없음) |
| 폰트 | Be Vietnam Pro(본문) + Noto Serif Display(제목) — **셀프호스팅**(`assets/fonts/`, 베트남어 diacritic 전 범위 포함) |
| 지도 | Google Maps embed (iframe) |
| 분석 | Amplitude Analytics + Session Replay (ESM CDN, 클라이언트 사이드) |
| 배포 | Vercel(정적) — `main` 자동 배포 · GitHub Pages 미러 |

**빌드 스텝이 없습니다.** 소스 파일이 곧 배포 산출물입니다. 트랜스파일·번들·패키지 매니저 없음.

---

## 폴더 구조

```
index.html                 # 단일 페이지 (525줄) — 전 섹션 마크업
assets/
  css/
    styles.css             # 전체 스타일 (1,683줄)
    fonts.css              # @font-face 26종 (셀프호스팅 폰트, 388줄)
  js/
    content.js             # window.CONTENT = { vi, en }  — i18n 사전 (229줄)
    menu.js                # window.MENU = [...]           — 메뉴 데이터 (448줄)
    app.js                 # 언어 전환·메뉴 렌더·히어로 슬라이드·스크롤 애니메이션·분석 훅 (797줄)
    analytics.js           # Amplitude 초기화 + HanamTrack/HanamSetUser 노출 (38줄, ESM 모듈)
  fonts/                   # f1.woff2 ~ f26.woff2 (셀프호스팅 웹폰트)
  img/                     # 히어로/메뉴/프로모/매장 이미지 (웹용 파생본만 git 포함)
vercel.json                # { "cleanUrls": true }
.claude/launch.json        # 로컬 개발 서버 설정 (static, python http.server)
docs/analytics/            # 분석 문서 (택소노미·이벤트 가이드·진단 계획·결정 기록)
```

> 프로젝트 루트의 `01.고기.png` 같은 **번호 붙은 원본 사진은 작업용 고해상도 원본**이며 `.gitignore`로 제외됩니다.
> 실제 사이트가 로드하는 웹용 파생본만 `assets/img/`에 커밋됩니다.

---

## 로컬 실행

`.claude/launch.json`에 `static` 서버가 정의돼 있습니다. 또는 직접:

```bash
python -m http.server 8000
# 브라우저에서 http://localhost:8000 열기
```

- 데이터가 `fetch`가 아니라 JS 객체(`window.CONTENT` / `window.MENU`)라서 `file://` 로 열어도 동작합니다.
- **localhost/127.0.0.1 에서는 Amplitude로 이벤트를 보내지 않습니다** (`analytics.js`의 `IS_LOCAL` 가드). 로컬 테스트가 운영 지표를 오염시키지 않습니다.

---

## 배포 (Vercel)

`main` 브랜치에 푸시하면 **자동 배포**됩니다. 수동 배포는:

```bash
npx vercel --prod
```

Vercel 대시보드에서 git 연결 시 — 프레임워크 프리셋 **Other**, 빌드 커맨드 없음, 출력 디렉토리 = 저장소 루트.

> ⚠️ **`main` = 운영입니다.** `main`에 머지되는 순간 라이브 사이트에 반영됩니다. 작업은 브랜치에서 하고, 검증 후 머지하세요.

---

## i18n (다국어) 동작 방식

- 화면에 보이는 모든 문자열은 `data-i18n="key"` 속성을 갖고, `window.CONTENT[lang][key]`에서 값을 가져옵니다.
- `getLang()` — `localStorage.hanam_lang`을 읽음 (기본값 `vi`).
- `applyLang(lang)` — 텍스트 교체 + `<html lang>` 설정 + VI/EN 버튼 토글 + 메뉴 재렌더.
- 새 문자열을 추가하려면: 마크업에 `data-i18n="새키"` 부여 → `content.js`의 `vi`/`en` 양쪽에 `새키` 추가.

자세한 기능·구조는 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md), 유지보수 주의점은 [HANDOVER.md](HANDOVER.md), 변경 이력은 [CHANGELOG.md](CHANGELOG.md) 참조.

---

## 매장 정보 (변경 금지 — 실제 매장 데이터)

| 항목 | 값 |
|---|---|
| 주소 | 36-38 Đ. Xuân Diệu, Tứ Liên, Tây Hồ, Hà Nội 100000 |
| 전화 | +84 964 321 771 |
| 평점 / 영업시간 | 4.8★ Google · 11:00–22:00 (요일별 상이 가능) |
| 좌표 | 21.061464, 105.8316161 |
| Google Maps | CID `13948591582597685325` |
| Facebook Messenger | https://m.me/61579247412593 |

---

## 출시 전 검토 항목 (미해결)

- **번역(vi·en)은 초안(DRAFT)** — 메뉴명/설명·스토리 카피는 베트남 원어민 검수 필요. 코드에 `// TODO(review): VN native check` 표시.
- **후기는 플레이스홀더** — 실명이 아니라 방문 유형 페르소나(가족/비즈니스/커플)로 귀속. 실제 Google/Facebook 후기로 교체 필요. `// TODO(review): replace with real customer reviews` 표시.
- **메뉴 이미지** — 디자인 브리프대로 매핑됨. 출시 전 각 부위 사진이 해당 메뉴와 맞는지 확인.
- **영업시간** — 11:00–22:00로 추정. 요일별 실제 시간 확인 필요(UI는 Google Maps를 실시간 소스로 링크).
