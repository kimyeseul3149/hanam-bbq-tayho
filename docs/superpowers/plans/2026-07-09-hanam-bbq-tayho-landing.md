# 하남돼지집 서호점 랜딩페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 하노이 거주 베트남인을 타겟으로 하남돼지집 서호점(West Lake)의 인지도·신규 유입을 높이는 원페이지 다국어 랜딩페이지를 만들어 Vercel에 배포한다.

**Architecture:** 빌드 없는 정적 사이트. `index.html` 한 장에 5개 섹션, 스타일은 `assets/css/styles.css`, 로직은 `assets/js/`의 3개 모듈(content 사전 / menu 데이터 / app 동작). 언어는 JS 사전 객체 기반 `data-i18n` 치환 + `localStorage` 저장. 이미지는 `assets/img/`에 로컬 저장해 CDN 의존 제거.

**Tech Stack:** HTML5, CSS3(커스텀 프로퍼티·flex/grid), Vanilla JS(ES6, 빌드/번들러 없음), Google Maps embed(iframe), Vercel 정적 호스팅.

## Global Constraints

- 언어: 🇻🇳 베트남어(vi) **기본**, 🇬🇧 영어(en) 토글. 모든 노출 텍스트는 `content.js` 사전의 vi/en 키를 가진다. 한국어 원어는 메뉴에서만 보조 병기 허용.
- 디자인: 다크 프리미엄. 배경 `#111` 계열, 골드 액센트 `#C8A96A`, 텍스트 `#F5F1E8`, 하남 레드 `#C0392B` 소량. 세리프 헤드라인 + 산세리프 본문. 베트남어 성조 완전 지원 폰트(예: "Be Vietnam Pro", "Noto Serif Display").
- 반응형: 모바일 우선. 브레이크포인트 640 / 1024px.
- 빌드 없음: `<script src>` 직접 로드. 로컬 `file://`에서도 동작하도록 데이터는 `fetch(json)` 대신 **JS 객체**로 둔다.
- 매장 데이터(정확, 변경 금지): 주소 `36-38 Đ. Xuân Diệu, Tứ Liên, Tây Hồ, Hà Nội 100000`, 전화 `+84 964 321 771`, 평점 `4.8★`, 영업시간 `11:00–22:00`(추정 표기), FB id `61579247412593`, 좌표 `21.061464, 105.8316161`.
- 번역: 메뉴·스토리의 베트남어/영어는 **초벌(추정)** — 코드 주석에 `// TODO(review): VN native check` 표기 유지.
- 애셋 출처는 `docs/superpowers/specs/source-content.md` F절 참조.

---

## File Structure

- Create: `index.html` — 5개 섹션 마크업 + 헤더/푸터, `data-i18n` 속성
- Create: `assets/css/styles.css` — 전체 스타일(토큰·레이아웃·컴포넌트·반응형·애니메이션)
- Create: `assets/js/content.js` — `window.CONTENT = { vi:{...}, en:{...} }` 다국어 사전
- Create: `assets/js/menu.js` — `window.MENU = [...]` 메뉴 데이터(ko/en/vi/img)
- Create: `assets/js/app.js` — 언어 토글, 사전 치환, 카운터 애니메이션, 스크롤 리빌, 메뉴/후기 렌더
- Create: `assets/img/` — 다운로드한 이미지들(hero, cuts, interior, reviews, logo)
- Create: `vercel.json` — 정적 라우팅(선택), `README.md` — 배포 메모
- Create: `scripts/fetch-assets.sh` — 이미지 일괄 다운로드 스크립트(재현용)

---

## Task 1: 프로젝트 스캐폴드 + 이미지 애셋 수집

**Files:**
- Create: `index.html`, `assets/css/styles.css`, `assets/js/app.js`, `README.md`
- Create: `assets/img/` (다운로드 산출물), `scripts/fetch-assets.sh`

**Interfaces:**
- Produces: 폴더 구조와 빈 진입점. 이후 모든 태스크가 이 파일들에 내용을 채운다.

- [ ] **Step 1: git 초기화 및 폴더 생성**

```bash
cd "C:/Users/user/Desktop/GMM/0709_claude_하남"
git init
mkdir -p assets/css assets/js assets/img scripts
```

- [ ] **Step 2: 이미지 다운로드 스크립트 작성** (`scripts/fetch-assets.sh`)

`source-content.md` F절의 페이스북 CDN·본사 메뉴 이미지 URL을 `curl`로 내려받아 `assets/img/`에 저장한다. FB 서명 URL은 만료되므로 실행 시점에 페이지에서 최신 URL을 재수집한다(playwright eval). 최소 확보 목표: `hero-facade.jpg`(야경 외관), `cut-samgyeopsal.jpg` 외 고기 6종, `interior.jpg`, `review1~3.jpg`, `logo.png`.

```bash
#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../assets/img"
# 예시 — 실제 URL은 실행 시 최신값으로 교체
curl -L -o hero-facade.jpg "<FB_CDN_COVER_URL>"
curl -L -o cut-01.jpg "<...>"
# ... 나머지 컷
echo "done"
```

- [ ] **Step 3: 이미지 다운로드 실행 및 확인**

Run: `bash scripts/fetch-assets.sh && ls -la assets/img`
Expected: hero-facade.jpg 외 다수 파일 존재, 각 파일 크기 > 10KB (0바이트/HTML 오류페이지 아님)
자산이 부족하거나 화질이 낮으면 `assets/img/`에 플레이스홀더를 두고 사용자에게 고화질 원본 요청 메모를 `README.md`에 남긴다.

- [ ] **Step 4: 최소 index.html + styles.css 뼈대 작성**

```html
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Hanam BBQ Tây Hồ — Korean Premium BBQ</title>
  <link rel="stylesheet" href="assets/css/styles.css" />
</head>
<body>
  <main id="app"><!-- 섹션은 이후 태스크에서 채움 --></main>
  <script src="assets/js/content.js"></script>
  <script src="assets/js/menu.js"></script>
  <script src="assets/js/app.js"></script>
</body>
</html>
```

```css
:root{
  --bg:#121110; --bg-2:#1b1917; --gold:#C8A96A; --text:#F5F1E8;
  --muted:#B7AE9E; --red:#C0392B; --maxw:1120px;
  --serif:"Noto Serif Display",Georgia,serif; --sans:"Be Vietnam Pro",system-ui,sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:var(--sans);line-height:1.6}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 20px}
```

폰트는 `@import` 또는 `<link>`로 Google Fonts(Be Vietnam Pro, Noto Serif Display) 로드.

- [ ] **Step 5: 브라우저 확인**

Run: 로컬에서 `index.html`을 열거나 `python -m http.server 8000` 후 접속.
Expected: 다크 배경의 빈 페이지가 뜨고 콘솔 에러 없음(content.js/menu.js 미작성 시 404 대신 빈 파일로 생성해 둘 것).

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "chore: scaffold static site + asset pipeline"
```

---

## Task 2: i18n 엔진 + 헤더(로고·언어토글·CTA)

**Files:**
- Create: `assets/js/content.js`
- Modify: `index.html`(헤더 추가), `assets/js/app.js`(토글 로직), `assets/css/styles.css`(헤더 스타일)

**Interfaces:**
- Produces:
  - `window.CONTENT = { vi:{key:string}, en:{key:string} }`
  - `applyLang(lang)` — DOM의 `[data-i18n]` 요소 textContent를 `CONTENT[lang][key]`로 치환, `<html lang>`·`localStorage.hanam_lang` 갱신
  - `getLang()` — `localStorage.hanam_lang` 또는 기본 `'vi'` 반환
- Consumes: 이후 모든 섹션은 텍스트를 `<span data-i18n="키"></span>`로 넣고 `CONTENT`에 vi/en을 추가한다.

- [ ] **Step 1: content.js 초기 사전 작성**

```js
window.CONTENT = {
  vi: {
    nav_menu: "Thực đơn", nav_story: "Câu chuyện", nav_visit: "Ghé thăm",
    cta_directions: "Chỉ đường & Đặt bàn", cta_message: "Nhắn tin đặt bàn",
    // 이후 태스크에서 섹션별 키 추가
  },
  en: {
    nav_menu: "Menu", nav_story: "Story", nav_visit: "Visit",
    cta_directions: "Directions & Reserve", cta_message: "Message to book",
  }
};
```

- [ ] **Step 2: app.js에 토글 엔진 작성**

```js
function getLang(){ return localStorage.getItem('hanam_lang') || 'vi'; }
function applyLang(lang){
  const dict = window.CONTENT[lang] || window.CONTENT.vi;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if (dict[k] != null) el.textContent = dict[k];
  });
  document.documentElement.lang = lang;
  localStorage.setItem('hanam_lang', lang);
  document.querySelectorAll('[data-lang-btn]').forEach(b=>
    b.classList.toggle('is-active', b.getAttribute('data-lang-btn')===lang));
}
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('[data-lang-btn]').forEach(b=>
    b.addEventListener('click', ()=>applyLang(b.getAttribute('data-lang-btn'))));
  applyLang(getLang());
});
```

- [ ] **Step 3: index.html 헤더 마크업 추가**

```html
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="#top"><img src="assets/img/logo.png" alt="Hanam BBQ West Lake" /></a>
    <nav class="nav">
      <a href="#story" data-i18n="nav_story">Câu chuyện</a>
      <a href="#menu" data-i18n="nav_menu">Thực đơn</a>
      <a href="#visit" data-i18n="nav_visit">Ghé thăm</a>
    </nav>
    <div class="header-actions">
      <div class="lang-toggle">
        <button data-lang-btn="vi">VI</button>
        <button data-lang-btn="en">EN</button>
      </div>
      <a class="btn btn-gold" href="#visit" data-i18n="cta_directions">Chỉ đường & Đặt bàn</a>
    </div>
  </div>
</header>
```

- [ ] **Step 4: 헤더 스타일 작성** (fixed, 스크롤 시 배경 진해짐, 모바일 nav 축소)

`.site-header{position:fixed;top:0;left:0;right:0;z-index:50;backdrop-filter:blur(8px);background:rgba(18,17,16,.7)}` 등. `.lang-toggle button.is-active`는 골드 배경.

- [ ] **Step 5: 브라우저에서 토글 검증**

Run: 페이지 열고 VI/EN 버튼 클릭.
Expected: nav·CTA 텍스트가 즉시 전환, 새로고침 후에도 마지막 선택 언어 유지(localStorage), `<html lang>` 변경.

- [ ] **Step 6: 커밋**

```bash
git add -A && git commit -m "feat: i18n engine + fixed header with language toggle"
```

---

## Task 3: Hero 섹션

**Files:**
- Modify: `index.html`(hero 추가), `assets/css/styles.css`, `assets/js/content.js`(hero 키)

**Interfaces:**
- Consumes: `applyLang`, `assets/img/hero-facade.jpg`
- Produces: `#top` 앵커, 하단 스크롤 인디케이터

- [ ] **Step 1: content.js에 hero 키 추가**

```js
// vi
hero_kicker: "Korean No.1 BBQ · 4.8★ Google",
hero_title: "Tinh hoa thịt nướng Hàn Quốc ngay tại Hồ Tây",
hero_sub: "Trải nghiệm K-BBQ cao cấp bên hồ Tây, Hà Nội.",
// en
hero_kicker: "Korean No.1 BBQ · 4.8★ Google",
hero_title: "The essence of Korean Premium BBQ at West Lake",
hero_sub: "Experience premium K-BBQ by West Lake, Hanoi.",
```

- [ ] **Step 2: hero 마크업 추가** (풀스크린, 배경 이미지 + 어두운 그라디언트 오버레이, 헤드라인, CTA 2종, 스크롤 인디케이터)

```html
<section id="top" class="hero">
  <div class="hero-overlay"></div>
  <div class="wrap hero-inner">
    <p class="hero-kicker" data-i18n="hero_kicker"></p>
    <h1 class="hero-title" data-i18n="hero_title"></h1>
    <p class="hero-sub" data-i18n="hero_sub"></p>
    <div class="hero-cta">
      <a class="btn btn-gold" href="#visit" data-i18n="cta_directions"></a>
      <a class="btn btn-ghost" href="#menu" data-i18n="nav_menu"></a>
    </div>
  </div>
  <a class="scroll-ind" href="#story" aria-label="scroll"></a>
</section>
```

- [ ] **Step 3: hero 스타일** — `min-height:100svh`, `background:url(../img/hero-facade.jpg) center/cover`, 오버레이 `linear-gradient(rgba(0,0,0,.35),rgba(18,17,16,.9))`, 세리프 대형 타이틀(clamp), 골드/고스트 버튼.

- [ ] **Step 4: 브라우저 확인 (모바일·데스크톱)**

Expected: 야경 외관 위에 골드 세리프 타이틀 가독, 두 CTA 정상 링크, 모바일에서 타이틀 줄바꿈 자연스러움. `preview_resize`로 375px·1280px 확인.

- [ ] **Step 5: 커밋**

```bash
git add -A && git commit -m "feat: hero section"
```

---

## Task 4: 하남 스토리 섹션 (+왜 베트남 · 숫자 카운터)

**Files:**
- Modify: `index.html`(#story), `styles.css`, `content.js`(story 키), `app.js`(카운터)

**Interfaces:**
- Consumes: `applyLang`, IntersectionObserver
- Produces: `animateCounters()` — `[data-count]` 요소가 뷰포트 진입 시 0→목표값 카운트업

- [ ] **Step 1: content.js에 story 키 추가** (source-content.md A·B절 기반, vi/en 초벌)

핵심 카피: 헤드라인 "Câu chuyện Hanam / Our Story", 본문(브랜드 스토리 요약), "Vì sao Việt Nam?/Why Vietnam?" 블록 = 인지도(Nâng cao nhận diện thương hiệu / Brand awareness) + 신규 유입(Mở rộng khách hàng mới / New customer acquisition). 통계 라벨: 선호도 1위, 만족도 97%, 176 매장, 2010~.

- [ ] **Step 2: #story 마크업 추가** (스토리 텍스트 + 통계 카운터 그리드 + 왜 베트남 2블록)

```html
<section id="story" class="section story">
  <div class="wrap">
    <h2 class="section-title" data-i18n="story_title"></h2>
    <p class="section-lead" data-i18n="story_lead"></p>
    <div class="stat-grid">
      <div class="stat"><span data-count="48.9" data-suffix="%"></span><small data-i18n="stat_pref"></small></div>
      <div class="stat"><span data-count="97" data-suffix="%"></span><small data-i18n="stat_sat"></small></div>
      <div class="stat"><span data-count="176" data-suffix="+"></span><small data-i18n="stat_stores"></small></div>
      <div class="stat"><span data-count="2010" data-plain="1"></span><small data-i18n="stat_since"></small></div>
    </div>
    <div class="why-vn">
      <article class="why-card"><h3 data-i18n="why_awareness_t"></h3><p data-i18n="why_awareness_d"></p></article>
      <article class="why-card"><h3 data-i18n="why_new_t"></h3><p data-i18n="why_new_d"></p></article>
    </div>
  </div>
</section>
```

- [ ] **Step 3: app.js 카운터 구현**

```js
function animateCounters(){
  const els = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target, target=parseFloat(el.dataset.count), plain=el.dataset.plain;
      const suffix=el.dataset.suffix||''; const dur=1200; const t0=performance.now();
      const dec = String(target).includes('.') ? 1 : 0;
      (function tick(now){
        const p=Math.min((now-t0)/dur,1);
        const v = plain ? Math.floor(target) : (target*p).toFixed(dec);
        el.textContent = (plain ? Math.floor(target*p) : v) + (p===1?suffix:suffix);
        if(p<1) requestAnimationFrame(tick); else el.textContent=(plain?target:target.toFixed(dec))+suffix;
      })(t0);
      io.unobserve(el);
    });
  },{threshold:.5});
  els.forEach(el=>io.observe(el));
}
document.addEventListener('DOMContentLoaded', animateCounters);
```

- [ ] **Step 4: 스타일** — 통계 그리드(4열→모바일 2열), 골드 큰 숫자(세리프), 왜 베트남 2컬럼 카드.

- [ ] **Step 5: 브라우저 확인** — 스크롤 진입 시 숫자 카운트업, VI/EN 전환 시 라벨 교체, 모바일 2열.

- [ ] **Step 6: 커밋** `git commit -m "feat: story section with counters and why-vietnam"`

---

## Task 5: 왜 하남돼지집 (가족/비즈니스 카드 + 고객 후기)

**Files:**
- Modify: `index.html`(#why), `styles.css`, `content.js`(why/review 키)

**Interfaces:**
- Consumes: `applyLang`, `assets/img/review1~3.jpg`, `assets/img/interior.jpg`
- Produces: 정적 카드(렌더 로직 불필요). 후기는 이미지+별점.

- [ ] **Step 1: content.js 키 추가** — 가족 카드(호수뷰·넓은 공간·아기의자·3세대·한결같은 서비스), 비즈니스 카드(프라이빗 룸·접대·다양한 옵션·호수뷰), 공통 배너(West Lake view), 후기 3건 텍스트(초벌 vi/en).

- [ ] **Step 2: #why 마크업** — 2컬럼 페르소나 카드 + 호수뷰 공통 배너 + 후기 3장(별 5개 + 인용).

```html
<section id="why" class="section why">
  <div class="wrap">
    <h2 class="section-title" data-i18n="why_title"></h2>
    <div class="persona-grid">
      <article class="persona persona-family">
        <h3 data-i18n="fam_t"></h3>
        <ul><li data-i18n="fam_1"></li><li data-i18n="fam_2"></li><li data-i18n="fam_3"></li><li data-i18n="fam_4"></li></ul>
      </article>
      <article class="persona persona-biz">
        <h3 data-i18n="biz_t"></h3>
        <ul><li data-i18n="biz_1"></li><li data-i18n="biz_2"></li><li data-i18n="biz_3"></li><li data-i18n="biz_4"></li></ul>
      </article>
    </div>
    <div class="reviews">
      <figure class="review"><div class="stars">★★★★★</div><blockquote data-i18n="rev_1"></blockquote><figcaption>— Chị Thanh Lê</figcaption></figure>
      <figure class="review"><div class="stars">★★★★★</div><blockquote data-i18n="rev_2"></blockquote><figcaption>— Chị Thu Trang</figcaption></figure>
      <figure class="review"><div class="stars">★★★★★</div><blockquote data-i18n="rev_3"></blockquote><figcaption>— Chị Lý Nguyên</figcaption></figure>
    </div>
  </div>
</section>
```

- [ ] **Step 3: 스타일** — 페르소나 카드 2컬럼(모바일 1열), 아이콘/이미지, 후기 3열(모바일 슬라이드/스택).

- [ ] **Step 4: 브라우저 확인** — 카드·후기 렌더, VI/EN 전환, 반응형.

- [ ] **Step 5: 커밋** `git commit -m "feat: why-hanam personas + reviews"`

---

## Task 6: 프로모션 배너

**Files:**
- Modify: `index.html`(promo, #visit 위), `styles.css`, `content.js`(promo 키)

**Interfaces:**
- Consumes: `applyLang`

- [ ] **Step 1: content.js 키** — Early Bird Happy Hour(17:00–18:30 음료 1+1), Reviewer Golden Hour(19:00–20:30 리뷰 추첨/300K 바우처). vi/en.

- [ ] **Step 2: 마크업** — 골드 하이라이트 배너 2블록(시간·혜택).

```html
<section class="promo">
  <div class="wrap promo-grid">
    <div class="promo-card"><span class="promo-time">17:00–18:30</span><h3 data-i18n="promo1_t"></h3><p data-i18n="promo1_d"></p></div>
    <div class="promo-card"><span class="promo-time">19:00–20:30</span><h3 data-i18n="promo2_t"></h3><p data-i18n="promo2_d"></p></div>
  </div>
</section>
```

- [ ] **Step 3: 스타일** — 골드 테두리/글로우, 시간 뱃지 강조.

- [ ] **Step 4: 브라우저 확인 + 커밋** `git commit -m "feat: promotion banner"`

---

## Task 7: 메뉴 섹션

**Files:**
- Create: `assets/js/menu.js`
- Modify: `index.html`(#menu), `styles.css`, `app.js`(renderMenu), `content.js`(menu 헤더 키)

**Interfaces:**
- Consumes: `getLang`, `applyLang`, `assets/img/cut-*.jpg`
- Produces:
  - `window.MENU = [{ id, ko, name:{vi,en}, desc:{vi,en}, img }]`
  - `renderMenu(lang)` — `#menu-grid`에 카드 생성; 언어 전환 시 재호출

- [ ] **Step 1: menu.js 데이터 작성** (source-content.md C절, 초벌 번역)

```js
// TODO(review): VN native check on all name/desc
window.MENU = [
  { id:"samgyeopsal", ko:"생삼겹살", img:"assets/img/cut-samgyeopsal.jpg",
    name:{vi:"Thịt ba chỉ heo tươi", en:"Fresh Pork Belly"}, desc:{vi:"", en:""} },
  { id:"teukmoksal", ko:"특목살", img:"assets/img/cut-moksal.jpg",
    name:{vi:"Thịt nạc vai heo đặc biệt", en:"Premium Pork Collar"}, desc:{vi:"", en:""} },
  { id:"saenggalbi", ko:"생갈비", img:"assets/img/cut-galbi.jpg",
    name:{vi:"Sườn heo tươi", en:"Fresh Pork Ribs"}, desc:{vi:"", en:""} },
  { id:"galmaegisal", ko:"갈매기살", img:"assets/img/cut-galmaegi.jpg",
    name:{vi:"Thịt cơ hoành heo", en:"Pork Skirt Meat"}, desc:{vi:"", en:""} },
  { id:"hangjeongsal", ko:"항정살", img:"assets/img/cut-hangjeong.jpg",
    name:{vi:"Thịt má heo", en:"Pork Jowl (Presa)"}, desc:{vi:"", en:""} },
  { id:"gabrisal", ko:"가브리살", img:"assets/img/cut-gabri.jpg",
    name:{vi:"Thịt nạc dày heo", en:"Pork Collar Cap (Pluma)"}, desc:{vi:"", en:""} },
  { id:"ogyeopsal", ko:"한돈숙성 오겹살", img:"assets/img/cut-ogyeop.jpg",
    name:{vi:"Thịt ba chỉ heo Hàn Quốc ủ vị (5 lớp)", en:"Aged Korean Pork Belly (5-layer)"}, desc:{vi:"", en:""} },
  { id:"makchang", ko:"막창구이", img:"assets/img/cut-makchang.jpg",
    name:{vi:"Lòng heo nướng", en:"Grilled Pork Intestine"}, desc:{vi:"", en:""} },
];
```

- [ ] **Step 2: #menu 마크업 + renderMenu 작성**

```html
<section id="menu" class="section menu">
  <div class="wrap">
    <h2 class="section-title" data-i18n="menu_title"></h2>
    <p class="section-lead" data-i18n="menu_lead"></p>
    <div id="menu-grid" class="menu-grid"></div>
    <p class="menu-note" data-i18n="menu_note"></p>
  </div>
</section>
```

```js
function renderMenu(lang){
  const grid=document.getElementById('menu-grid'); if(!grid) return;
  grid.innerHTML = window.MENU.map(m=>`
    <article class="menu-card">
      <div class="menu-thumb" style="background-image:url('${m.img}')"></div>
      <div class="menu-body">
        <h3>${m.name[lang]||m.name.vi}</h3>
        <span class="menu-ko">${m.ko}</span>
        ${m.desc[lang]?`<p>${m.desc[lang]}</p>`:''}
      </div>
    </article>`).join('');
}
```

- [ ] **Step 3: app.js에서 언어 전환 시 renderMenu 연동** — `applyLang` 끝에 `if(window.MENU) renderMenu(lang);` 추가, 초기 로드시 1회 호출.

- [ ] **Step 4: 스타일** — 반응형 그리드(모바일 1열, 640+ 2열, 1024+ 4열), 이미지 썸네일 비율 고정, 골드 구분선.

- [ ] **Step 5: 브라우저 확인** — 8개 카드 렌더, VI/EN 전환 시 이름 교체(한국어 병기 유지), 이미지 정상 로드.

- [ ] **Step 6: 커밋** `git commit -m "feat: menu section with i18n cards"`

---

## Task 8: 방문 안내 (지도 · 연락 · CTA) + 푸터

**Files:**
- Modify: `index.html`(#visit, footer), `styles.css`, `content.js`(visit 키)

**Interfaces:**
- Consumes: `applyLang`, Google Maps embed, 매장 데이터(Global Constraints)

- [ ] **Step 1: content.js 키** — 주소 라벨, 영업시간(11:00–22:00 + "giờ mở cửa có thể thay đổi/hours may vary"), 전화, CTA 문구(길찾기·예약, 페북 메시지, 전화).

- [ ] **Step 2: #visit 마크업** — 좌: 지도 iframe, 우: 주소·시간·전화·CTA 3버튼.

```html
<section id="visit" class="section visit">
  <div class="wrap visit-grid">
    <div class="map-embed">
      <iframe title="Hanam BBQ Tây Hồ" loading="lazy" allowfullscreen
        src="https://www.google.com/maps?q=21.061464,105.8316161&hl=vi&z=17&output=embed"></iframe>
    </div>
    <div class="visit-info">
      <h2 class="section-title" data-i18n="visit_title"></h2>
      <p class="visit-addr">36-38 Đ. Xuân Diệu, Tứ Liên, Tây Hồ, Hà Nội</p>
      <p class="visit-hours"><span data-i18n="visit_hours_label"></span> 11:00–22:00 <small data-i18n="visit_hours_note"></small></p>
      <p class="visit-tel"><a href="tel:+84964321771">+84 964 321 771</a></p>
      <div class="visit-cta">
        <a class="btn btn-gold" target="_blank" rel="noopener"
           href="https://www.google.com/maps/place/?q=place_id:0xc1935a243dbd204d" data-i18n="cta_directions"></a>
        <a class="btn btn-ghost" target="_blank" rel="noopener"
           href="https://m.me/61579247412593" data-i18n="cta_message"></a>
        <a class="btn btn-ghost" href="tel:+84964321771" data-i18n="cta_call"></a>
      </div>
    </div>
  </div>
  <footer class="site-footer"><div class="wrap">© Hanam BBQ Tây Hồ · West Lake Hanoi</div></footer>
</section>
```

- [ ] **Step 3: CTA 링크 검증** — 구글맵 place URL이 실제 매장으로 열리는지, `m.me/{id}`가 페북 메신저로 연결되는지, `tel:`이 모바일에서 동작하는지 확인. place_id 링크가 부정확하면 Task 초기 수집한 전체 place URL로 대체.

- [ ] **Step 4: 스타일** — 2컬럼(모바일 1열), 지도 16:9/고정높이, CTA 버튼 풀폭(모바일).

- [ ] **Step 5: 브라우저 확인 + 커밋** `git commit -m "feat: visit section with map, contact, CTAs"`

---

## Task 9: 마감 — 반응형·애니메이션·SEO·접근성

**Files:**
- Modify: `index.html`(head 메타/OG), `styles.css`(반응형·스크롤 리빌), `app.js`(reveal), `assets/img/`(favicon, og-image)

- [ ] **Step 1: 스크롤 리빌 애니메이션** — `app.js`에 IntersectionObserver로 `.section`에 `.in-view` 부여, CSS로 fade/slide-up. `prefers-reduced-motion` 존중.

- [ ] **Step 2: SEO/OG 메타 추가**

```html
<meta name="description" content="Hanam BBQ Tây Hồ — Korean No.1 premium BBQ by West Lake, Hanoi. Đặt bàn cho gia đình & doanh nghiệp." />
<meta property="og:title" content="Hanam BBQ Tây Hồ — Korean Premium BBQ" />
<meta property="og:description" content="Trải nghiệm K-BBQ cao cấp bên hồ Tây." />
<meta property="og:image" content="assets/img/og-image.jpg" />
<meta property="og:type" content="website" />
<link rel="icon" href="assets/img/favicon.png" />
```

- [ ] **Step 3: 반응형 QA** — `preview_resize`로 375·768·1280px 각 섹션 점검, 가로 스크롤/오버플로 없음, 헤더 모바일 메뉴 정상.

- [ ] **Step 4: 접근성 점검** — 이미지 alt, 버튼 aria-label, 대비(골드/텍스트 WCAG AA), 키보드 포커스 가시성.

- [ ] **Step 5: 커밋** `git commit -m "feat: reveal animations, SEO/OG meta, a11y polish"`

---

## Task 10: Vercel 배포

**Files:**
- Create: `vercel.json`(선택), `README.md`(배포 절차)

- [ ] **Step 1: vercel.json 작성(선택)** — 정적 사이트는 설정 불필요하나 캐시 헤더 지정 시 사용.

```json
{ "cleanUrls": true }
```

- [ ] **Step 2: 배포**

Run: `npx vercel --prod` (또는 GitHub 연동 후 자동 배포). 프로젝트 루트에서 실행.
Expected: `https://<project>.vercel.app` URL 발급.

- [ ] **Step 3: 배포본 검증** — 발급 URL 접속해 이미지 로드·언어 토글·지도·CTA·모바일 레이아웃 확인. 콘솔 에러 없음.

- [ ] **Step 4: 최종 커밋 + URL 공유**

```bash
git add -A && git commit -m "chore: vercel deploy config + README"
```

배포 URL을 사용자에게 전달하고, 남은 검수 항목(메뉴/스토리 베트남어 원어민 검수, 고화질 원본 이미지 교체, 정확한 요일별 영업시간) 안내.

---

## Self-Review (작성자 체크)

- **스펙 커버리지**: Hero(T3)·스토리+왜베트남(T4)·가족/비즈니스+후기(T5)·프로모션(T6)·메뉴 영+베(T7)·방문/CTA(T8)·다국어 토글(T2)·다크프리미엄(T1,전역)·Vercel(T10) — 스펙 5섹션+CTA+후기+프로모션 모두 태스크 존재. ✅
- **플레이스홀더**: 이미지 URL은 실행 시 재수집(FB 서명 만료 특성상 불가피, 방법 명시)·번역은 초벌 표기 의도적 — 그 외 미완성 플레이스홀더 없음. ✅
- **타입 일관성**: `applyLang(lang)`·`getLang()`·`renderMenu(lang)`·`window.CONTENT[lang][key]`·`window.MENU[].name[lang]` 명명 전 태스크 일치. ✅
