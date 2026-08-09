# -*- coding: utf-8 -*-
"""Executive Summary (3페이지 PDF의 1페이지) — web-ops-v2 톤으로 재작성

build_exec.py 와 **숫자·문구·레이아웃은 동일**하고 색·서체·카드 스타일만 바꿨다.
톤 기준은 docs/dashboard/web-ops-v2.html.

  남색 사이드바 → 차콜 #1A1A1A
  보라(Meta)    → 차콜 계열 4단
  주황(Amplitude) → 레드 계열 2단
  연보라 카드   → 아이보리 배경 + 흰 카드 + 1px #E4E0D8
  초록 액션박스 → 중립 회색 + 레드 화살표

수치 기준 — 2026-07-20 ~ 08-02 (14일).
  Meta   build_web_ops.py 의 META / META_TOTAL (노출 460,195 · 링크클릭 17,828 ·
         고유 링크클릭 14,570 · 지출 ₫8,816,522)
  웹     web_ops2_data.json 세션 테이블 (방문자 8,084 · 예약 유도 90)
  도달   Meta가 조회 기간마다 따로 중복 제거해 일별 합산이 불가능하다.
         유일하게 13일(Jul 20–Aug 1) 값이라 퍼널에 각주로 명시한다.
"""
import math
import os

ROOT = r'C:\Users\user\Desktop\GMM\0709_claude_하남_웹페이지제작'
OUT = os.path.join(ROOT, 'docs', 'dashboard', '_build', 'exec2.html')

# ---- funnel stages: (label, value, conv_text, tool) ----
stages = [
    ('노출 (Impressions)', 460195, '', 'meta'),
    ('도달 (Reach)', 213946, '', 'meta'),
    ('전체 링크클릭', 17828, 'CTR 3.87%', 'meta'),
    ('고유 링크클릭', 14570, '고유율 81.7%', 'meta'),
    ('페이지 방문', 8084, '클릭→방문 55.5%', 'amp'),
    ('예약 유도', 90, '유도율 1.11%', 'amp'),
]
mx = stages[0][1]
MCOL = ['#1A1A1A', '#3D3D38', '#616159', '#8A8A80']      # Meta — 차콜 4단
ACOL = ['#C58189', '#8C1D2A']                             # Amplitude — 레드 2단


def fw(v):
    return max(5.5, math.sqrt(v / mx) * 100)              # sqrt 스케일 (원본과 동일)


fnl = ''
mi = ai = 0
for i, (lab, v, cv, tool) in enumerate(stages):
    if tool == 'meta':
        col = MCOL[mi]; mi += 1; tag = 'Meta'
    else:
        col = ACOL[ai]; ai += 1; tag = 'Amplitude'
    if i == 4:
        fnl += ('<div class="fdiv"><span>▼ Meta → Amplitude 인계 지점 · '
                '광고 클릭이 실제 페이지 방문으로</span></div>')
    inside = f'{v:,}' if fw(v) > 16 else ''
    outside = '' if fw(v) > 16 else f'<span class="fout">{v:,}</span>'
    fnl += (f'<div class="frow"><div class="fnm">{lab}<small>{tag}</small></div>'
            f'<div class="ftk"><div class="fbar" style="width:{fw(v):.1f}%;background:{col}">'
            f'{inside}</div>{outside}</div>'
            f'<div class="fcv">{("<b>"+cv+"</b>") if cv else "&nbsp;"}</div></div>')

# ---- KPI flow nodes: (stage, label, value, sub, cls) ----
kflow = [
    ('예산', '광고비', '₫8.82M', 'CPM ₫19,158', 'budget'),
    ('광고 성과', '고유 클릭', '14,570', 'CTR 3.87%', ''),
    ('웹 행동', '페이지 방문', '8,084', '도착률 55.5%', ''),
    ('예약 유도', '예약 유도', '90명', '방문자 대비 1.11%', 'hero'),
    ('효율', '유도당 비용', '₫97,961', '₫8.82M ÷ 90', 'hero'),
]
kf = ''
for i, (st, lab, val, sub, cls) in enumerate(kflow):
    if i > 0:
        kf += '<div class="karrow">▸</div>'
    kf += (f'<div class="knode {cls}"><div class="kst">{st}</div>'
           f'<div class="klab">{lab}</div><div class="knum">{val}</div>'
           f'<div class="ksub">{sub}</div></div>')

plan = [
    ('business·taste_message 4관왕 (CTR↑·CPC↓·유도당 최저)', '대표 소재로 다음 캠페인 예산 집중'),
    ('방문·예약 저녁 19–22시·주말 집중', '저녁·금토 시간대 광고 예산 확대'),
    ('business=남성 / family=여성 반응층 분리', '세트별 메시지·타겟 분리 유지'),
    ('family_taste 클릭 多·유도 少 (유도당 ₫239K)', '저효율 소재 중단·예산 재배분'),
]
prow = ''.join(f'<tr><td class="pf">{f}</td><td class="pa">→ {a}</td></tr>' for f, a in plan)

CSS = """:root{--red:#8C1D2A;--red45:#C58189;--red12:#F4E8EA;--c100:#1A1A1A;--c70:#5C594F;
  --c45:#8B877D;--c25:#C7C3B9;--lg:#E4E0D8;--ivory:#FFF9F2;--surf:#FFFFFF;}
*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
html{background:#F1ECE4;}
body{font-family:system-ui,'Segoe UI','Malgun Gothic',sans-serif;color:var(--c100);
  -webkit-font-smoothing:antialiased;display:flex;justify-content:center;align-items:flex-start;}
/* 슬라이드 한 장 = 1360x812 고정. 좁은 화면에서는 통째로 축소한다. */
.slide{width:1360px;height:812px;flex:none;display:flex;background:var(--ivory);
  transform-origin:top center;}
@media print{html,body{background:#fff;}body{display:block;}.slide{transform:none!important;}}

/* 사이드바 — v2의 차콜 */
.side{width:212px;background:var(--c100);color:#B9B4AA;padding:22px 20px;flex-shrink:0;
  display:flex;flex-direction:column;border-top:4px solid var(--red);}
.logo{display:flex;align-items:center;gap:9px;font-weight:800;color:#fff;font-size:15px;line-height:1.25;}
.logo .mk{width:44px;height:44px;border-radius:50%;background:#fff;padding:4px;
  object-fit:contain;flex:none;box-shadow:0 0 0 1px rgba(255,255,255,.25);}
.side hr{border:none;border-top:1px solid #3A3A36;margin:16px 0;}
.fl{font-size:10px;color:#7E7E76;margin-bottom:3px;letter-spacing:.16em;text-transform:uppercase;}
.fv{font-size:13px;color:#fff;margin-bottom:13px;font-weight:600;}
.leg{font-size:11px;color:#9A968E;line-height:1.9;margin-top:2px;}
.leg .dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;}
.pagechip{margin-top:auto;font-size:11px;color:#7E7E76;}

.main{flex:1;padding:20px 26px;overflow:hidden;}
.top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;
  background:var(--surf);border:1px solid var(--lg);border-top:4px solid var(--red);
  border-radius:10px;padding:12px 16px;}
.h1{font-size:22px;font-weight:800;}
.h1 span{color:var(--c45);font-weight:500;font-size:16px;}
.sub{font-size:11px;color:var(--c70);margin-top:3px;}
.badge{background:var(--surf);color:var(--c45);border:1px solid var(--c25);
  font-size:10px;font-weight:600;padding:4px 10px;border-radius:14px;white-space:nowrap;}
.card{background:var(--surf);border:1px solid var(--lg);border-radius:10px;padding:12px 15px;}
.mb14{margin-bottom:10px;}
.grid2{display:grid;grid-template-columns:1fr 1.25fr;gap:13px;}

/* 섹션 라벨 — v2 스타일 */
.seclab{display:flex;align-items:center;gap:8px;margin:0 2px 7px;}
.seclab .n{width:18px;height:18px;border-radius:50%;background:var(--c100);color:#fff;font-size:10px;
  font-weight:700;display:flex;align-items:center;justify-content:center;flex:none;}
.seclab .t{font-size:12px;font-weight:700;}
.seclab .d{font-size:10.5px;color:var(--c45);}
.seclab .ln{flex:1;height:1px;background:var(--lg);}

/* KPI 흐름 */
.kflow{display:flex;align-items:stretch;gap:0;margin-bottom:10px;}
.knode{flex:1;background:var(--surf);border:1px solid var(--lg);border-radius:10px;padding:11px 13px;}
.knode .kst{font-size:9px;font-weight:700;color:var(--c45);letter-spacing:.1em;
  text-transform:uppercase;margin-bottom:5px;}
.knode .klab{font-size:11px;color:var(--c70);font-weight:600;}
.knode .knum{font-size:23px;font-weight:700;letter-spacing:-.01em;margin-top:2px;
  font-variant-numeric:tabular-nums;}
.knode .ksub{font-size:9.5px;color:var(--c45);margin-top:3px;}
.knode.hero{border-color:var(--red45);background:linear-gradient(180deg,#FAF2F3,#fff 52%);}
.knode.hero .knum{color:var(--red);}
.knode.budget{background:#F7F4ED;border-style:dashed;border-color:var(--c25);}
.knode.budget .knum{font-size:19px;color:var(--c70);}
.karrow{display:flex;align-items:center;color:var(--c25);font-size:16px;font-weight:700;padding:0 7px;}

/* 전환율 스트립 */
.convstrip{display:flex;gap:10px;margin-bottom:9px;}
.convpill{flex:1;background:#F7F4ED;border:1px solid var(--lg);border-radius:8px;padding:8px 12px;
  display:flex;align-items:baseline;justify-content:space-between;}
.convpill .cvn{font-size:19px;font-weight:700;color:var(--c100);font-variant-numeric:tabular-nums;}
.convpill .cvl{font-size:10.5px;color:var(--c70);font-weight:600;}
.ctitle{font-size:13px;font-weight:700;margin-bottom:2px;}
.csub{font-size:10.5px;color:var(--c45);margin-bottom:11px;}

/* 퍼널 */
.fnl{display:flex;flex-direction:column;gap:4px;}
.frow{display:flex;align-items:center;gap:12px;}
.frow .fnm{width:132px;text-align:right;font-size:11.5px;font-weight:700;flex-shrink:0;}
.frow .fnm small{display:block;font-size:9px;color:var(--c45);font-weight:500;}
.frow .ftk{flex:1;display:flex;align-items:center;gap:8px;}
.frow .fbar{height:24px;border-radius:5px;display:flex;align-items:center;padding:0 11px;
  color:#fff;font-weight:700;font-size:11.5px;min-width:40px;font-variant-numeric:tabular-nums;}
.frow .fout{font-size:11.5px;font-weight:700;color:var(--c100);}
.frow .fcv{width:118px;font-size:11px;color:var(--c45);flex-shrink:0;}
.frow .fcv b{color:var(--c100);font-weight:700;}
.fnote{margin:9px 0 0 144px;font-size:9.5px;color:var(--c45);line-height:1.5;}
.fnote b{color:var(--c70);}
.fdiv{margin:2px 0 2px 144px;font-size:10px;color:var(--red);background:#FAF2F3;
  border:1px dashed var(--red45);border-radius:8px;padding:4px 10px;}

/* 유도당 비용 막대 */
.hrow{display:flex;align-items:center;gap:10px;margin:7px 0;}
.hrow .lb{width:70px;font-size:11px;text-align:right;flex-shrink:0;color:var(--c70);}
.hrow .tk{flex:1;background:var(--lg);border-radius:4px;height:20px;}
.hrow .fi{height:100%;border-radius:4px;display:flex;align-items:center;justify-content:flex-end;
  padding-right:7px;color:#fff;font-size:10.5px;font-weight:700;font-variant-numeric:tabular-nums;}
.arrow{font-size:10.5px;color:var(--c45);margin-top:9px;border-top:1px solid var(--lg);padding-top:8px;}
.arrow b{color:var(--c100);}

/* 액션 플랜 — 초록 대신 중립 + 레드 화살표 */
.ap{background:var(--surf);border:1px solid var(--lg);border-radius:10px;padding:12px 15px;}
.ap h4{font-size:13px;font-weight:700;margin-bottom:8px;color:var(--c100);
  display:flex;align-items:center;gap:6px;}
.ap h4::before{content:'';width:3px;height:13px;background:var(--red);border-radius:2px;}
.ap table{width:100%;border-collapse:collapse;}
.ap td{padding:6px 4px;border-bottom:1px solid var(--lg);vertical-align:top;
  font-size:11px;line-height:1.45;}
.ap tr:last-child td{border-bottom:none;}
.ap .pf{color:var(--c70);width:52%;}
.ap .pa{color:var(--c100);font-weight:700;}
.ap .pa::first-letter{color:var(--red);}"""

body = f'''<div class="slide"><aside class="side">
  <div class="logo"><img class="mk" alt="하남돼지집" src="data:image/png;base64,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"><div>하남 BBQ<br>서호수점</div></div><hr>
  <div class="fl">Scope</div><div class="fv">Meta × Amplitude 통합</div>
  <div class="fl">Period</div><div class="fv">Jul 20 – Aug 2 · 14일</div>
  <div class="fl">목표</div><div class="fv">인지→브랜딩→예약유도</div>
  <div class="fl">KPI</div><div class="fv">예약 유도 · 유도당 비용</div><hr>
  <div class="leg"><span class="dot" style="background:#1A1A1A;outline:1px solid #616159"></span>Meta (광고 노출~클릭)<br>
    <span class="dot" style="background:#8C1D2A"></span>Amplitude (방문~유도)</div>
  <div class="pagechip">Executive · 경영 요약</div>
</aside>
<main class="main">
  <div class="top">
    <div><div class="h1">Executive Summary <span>/ 광고비 → 웹 행동 → 예약 유도</span></div>
    <div class="sub">광고비가 실제 예약 유도로 이어졌는가 · 두 도구를 하나의 흐름으로 연결
      <span style="color:var(--c25);">(교육 프로젝트)</span></div></div>
    <div class="badge">통합 · Meta + Amplitude</div>
  </div>

  <div class="seclab"><span class="n">1</span><span class="t">KPI 흐름</span>
    <span class="d">광고비 → 광고 성과 → 웹 행동 → 예약 유도 → 유도당 비용</span><span class="ln"></span></div>
  <div class="kflow">{kf}</div>

  <div class="seclab"><span class="n">2</span><span class="t">통합 풀 퍼널</span>
    <span class="d">단계별 전환율</span><span class="ln"></span></div>
  <div class="card mb14">
    <div class="convstrip">
      <div class="convpill"><span class="cvl">노출 → 클릭</span><span class="cvn">3.87%</span></div>
      <div class="convpill"><span class="cvl">클릭 → 방문</span><span class="cvn">55.5%</span></div>
      <div class="convpill"><span class="cvl">방문 → 예약유도</span><span class="cvn">1.11%</span></div>
    </div>
    <div class="fnl">{fnl}</div>
    <div class="fnote">도달(Reach)은 Meta가 조회 기간마다 따로 중복 제거하므로 일별 합산이 되지 않습니다.
      표시된 213,946은 <b>Jul 20–Aug 1(13일)</b> 값이며, 다른 지표는 모두 14일 기준입니다.</div>
  </div>

  <div class="seclab"><span class="n">3</span><span class="t">효율 진단 · 액션</span>
    <span class="d">어디에 예산을 더 쓸 것인가</span><span class="ln"></span></div>
  <div class="grid2">
    <div class="card">
      <div class="ctitle">광고세트 통합 효율 — 유도당 비용</div>
      <div class="csub">Meta 지출 ÷ Amplitude 유도 · 막대가 짧을수록 저렴 · 지출 잠정</div>
      <div class="hrow"><div class="lb">business</div><div class="tk">
        <div class="fi" style="width:40%;background:#8C1D2A">₫69,696</div></div></div>
      <div class="hrow"><div class="lb">전체</div><div class="tk">
        <div class="fi" style="width:56%;background:#8A8A80">₫97,961</div></div></div>
      <div class="hrow"><div class="lb">family</div><div class="tk">
        <div class="fi" style="width:100%;background:#1A1A1A">₫174,238</div></div></div>
      <div class="arrow">유도 business 64 · family 25 · <b>business 유도당 2.5배 저렴</b></div>
    </div>
    <div class="ap">
      <h4>Business Recommendation — Finding → Action</h4>
      <table>{prow}</table>
    </div>
  </div>
</main></div>'''

FIT = """<script>
// 뷰포트가 1360px보다 좁으면 슬라이드를 통째로 축소한다(레이아웃은 그대로).
(function(){var s=document.querySelector('.slide');function f(){
  var k=Math.min(1,innerWidth/1360);s.style.transform='scale('+k+')';
  document.body.style.height=(812*k)+'px';}
addEventListener('resize',f);f();})();
</script>"""

html = ('<!doctype html><html lang="ko"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<meta name="robots" content="noindex,nofollow">'
        '<title>하남돼지집 서호수점 — Executive Summary</title>'
        f'<style>{CSS}</style></head><body>{body}{FIT}</body></html>')
for path in (OUT, os.path.join(ROOT, 'docs', 'dashboard', 'exec-v2.html')):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('wrote', path)
