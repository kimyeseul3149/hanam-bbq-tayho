# -*- coding: utf-8 -*-
"""Executive Summary (3페이지 PDF의 1페이지) — web-ops-v2 톤으로 재작성

build_exec.py 와 **숫자·문구·레이아웃은 동일**하고 색·서체·카드 스타일만 바꿨다.
톤 기준은 docs/dashboard/web-ops-v2.html.

  남색 사이드바 → 차콜 #1A1A1A
  보라(Meta)    → 차콜 계열 4단
  주황(Amplitude) → 레드 계열 2단
  연보라 카드   → 아이보리 배경 + 흰 카드 + 1px #E9E9E9
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
ACOL = ['#F48C94', '#E60012']                             # Amplitude — 레드 2단


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
    ('예약 유도', '예약 유도', '90건', '유도율 1.11%', 'hero'),
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

CSS = """:root{--red:#E60012;--red45:#F48C94;--red12:#FCE3E5;--c100:#1A1A1A;--c70:#616161;
  --c45:#939393;--c25:#C4C4C4;--lg:#E9E9E9;--ivory:#FFF9F2;--surf:#FFFFFF;}
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
.logo .mk{width:30px;height:30px;border-radius:8px;background:var(--red);
  display:flex;align-items:center;justify-content:center;font-size:15px;}
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
.knode.hero{border-color:var(--red45);background:linear-gradient(180deg,#FFF6F7,#fff 52%);}
.knode.hero .knum{color:var(--red);}
.knode.budget{background:#F7F7F5;border-style:dashed;border-color:var(--c25);}
.knode.budget .knum{font-size:19px;color:var(--c70);}
.karrow{display:flex;align-items:center;color:var(--c25);font-size:16px;font-weight:700;padding:0 7px;}

/* 전환율 스트립 */
.convstrip{display:flex;gap:10px;margin-bottom:9px;}
.convpill{flex:1;background:#F7F7F5;border:1px solid var(--lg);border-radius:8px;padding:8px 12px;
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
.fdiv{margin:2px 0 2px 144px;font-size:10px;color:var(--red);background:#FFF6F7;
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
    <span class="dot" style="background:#E60012"></span>Amplitude (방문~유도)</div>
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
      <div class="csub">Meta 지출 ÷ Amplitude 유도 · 짧을수록 쌈 · 지출 잠정</div>
      <div class="hrow"><div class="lb">business</div><div class="tk">
        <div class="fi" style="width:40%;background:#E60012">₫69,696</div></div></div>
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
