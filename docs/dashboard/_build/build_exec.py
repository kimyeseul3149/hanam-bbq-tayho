# -*- coding: utf-8 -*-
import os, math

# ---- funnel stages: (label, value, conv_text, tool) ----
stages=[
 ('노출 (Impressions)', 415942, '', 'meta'),
 ('도달 (Reach)', 213946, '도달률 51.4%', 'meta'),
 ('전체 링크클릭', 15968, 'CTR 3.84%', 'meta'),
 ('고유 링크클릭', 13150, '고유율 82.4%', 'meta'),
 ('페이지 방문', 8274, '클릭→방문 62.9%', 'amp'),
 ('예약 유도', 85, '유도율 1.03%', 'amp'),
]
mx=stages[0][1]
mcol=['#4f46b8','#5b53c4','#6a60cf','#7d72d0']
acol=['#e6a34a','#e08a1e']
def fw(v):
    return max(5.5, math.sqrt(v/mx)*100)  # sqrt scale for readability

fnl=''
mi=ai=0
for i,(lab,v,cv,tool) in enumerate(stages):
    if tool=='meta': col=mcol[mi]; mi+=1; tag='Meta'
    else: col=acol[ai]; ai+=1; tag='Amplitude'
    if i==4:
        fnl+=('<div class="fdiv"><span>▼ Meta → Amplitude 인계 지점 · 광고 클릭이 실제 페이지 방문으로</span></div>')
    inside = f'{v:,}' if fw(v)>16 else ''
    outside = '' if fw(v)>16 else f'<span class="fout">{v:,}</span>'
    fnl+=(f'<div class="frow"><div class="fnm">{lab}<small>{tag}</small></div>'
          f'<div class="ftk"><div class="fbar" style="width:{fw(v):.1f}%;background:{col}">{inside}</div>{outside}</div>'
          f'<div class="fcv">{("<b>"+cv+"</b>") if cv else "&nbsp;"}</div></div>')

# ---- KPI flow nodes: (stage, label, value, sub, cls) ----
kflow=[
 ('예산','광고비','₫8.04M','CPM ₫19,323','budget'),
 ('광고 성과','고유 클릭','13,150','CTR 3.84%',''),
 ('웹 행동','페이지 방문','8,274','도착률 62.9%',''),
 ('예약 유도','예약 유도','85건','유도율 1.03%','hero'),
 ('효율','유도당 비용','₫94,559','₫8.04M ÷ 85','hero'),
]
kf=''
for i,(st,lab,val,sub,cls) in enumerate(kflow):
    if i>0: kf+='<div class="karrow">▸</div>'
    kf+=(f'<div class="knode {cls}"><div class="kst">{st}</div>'
         f'<div class="klab">{lab}</div><div class="knum">{val}</div>'
         f'<div class="ksub">{sub}</div></div>')

# ---- Action Plan (Finding -> Recommendation) ----
plan=[
 ('business·taste_message 4관왕 (CTR↑·CPC↓·유도당 최저)','대표 소재로 다음 캠페인 예산 집중'),
 ('방문·예약 저녁 19–22시·주말 집중','저녁·금토 시간대 광고 예산 확대'),
 ('business=남성 / family=여성 반응층 분리','세트별 메시지·타겟 분리 유지'),
 ('family_taste 클릭 多·유도 少 (유도당 ₫237K)','저효율 소재 중단·예산 재배분'),
]
prow=''.join(f'<tr><td class="pf">{f}</td><td class="pa">→ {a}</td></tr>' for f,a in plan)

CSS=""":root{--indigo:#4f46b8;--amber:#e08a1e;--ink:#1c1b2e;--muted:#6b6b80;--bg:#eef0f5;--card:#fff;--navy:#2b2850;--line:#e6e6ee;}
*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:'Malgun Gothic','Segoe UI',sans-serif;background:var(--bg);color:var(--ink);width:1360px;height:812px;display:flex;}
.side{width:212px;background:var(--navy);color:#cfcbe8;padding:22px 20px;flex-shrink:0;display:flex;flex-direction:column;}
.logo{display:flex;align-items:center;gap:9px;font-weight:800;color:#fff;font-size:15px;line-height:1.25;}
.logo .mk{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--indigo),#8a7ee8);display:flex;align-items:center;justify-content:center;font-size:15px;}
.side hr{border:none;border-top:1px solid #47437a;margin:16px 0;}
.fl{font-size:11px;color:#8b87b8;margin-bottom:3px;letter-spacing:.03em;}
.fv{font-size:13px;color:#fff;margin-bottom:13px;font-weight:600;}
.leg{font-size:11px;color:#9a96c8;line-height:1.9;margin-top:2px;}
.leg .dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;}
.pagechip{margin-top:auto;font-size:12px;color:#8b87b8;}.pagechip b{color:#fff;}
.main{flex:1;padding:20px 26px;overflow:hidden;}
.top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;}
.h1{font-size:24px;font-weight:800;}.h1 span{color:var(--muted);font-weight:500;font-size:17px;}
.sub{font-size:12px;color:var(--muted);margin-top:3px;}
.badge{background:#eef0ff;color:#3b338f;border:1px solid #c9c4f0;font-size:11px;font-weight:700;padding:5px 11px;border-radius:20px;}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 15px;box-shadow:0 1px 3px rgba(30,27,46,.05);}
.mb14{margin-bottom:14px;}
.grid2{display:grid;grid-template-columns:1fr 1.25fr;gap:14px;}
/* KPI flow */
.kflowlab{font-size:11px;color:#8a86a0;font-weight:700;margin-bottom:6px;letter-spacing:.02em;}
.kflow{display:flex;align-items:stretch;gap:0;margin-bottom:14px;}
.knode{flex:1;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:11px 13px;box-shadow:0 1px 3px rgba(30,27,46,.05);}
.knode .kst{font-size:9.5px;font-weight:800;color:#8a86a0;letter-spacing:.04em;text-transform:uppercase;margin-bottom:5px;}
.knode .klab{font-size:11px;color:var(--muted);font-weight:600;}
.knode .knum{font-size:23px;font-weight:800;letter-spacing:-.01em;margin-top:2px;}
.knode .ksub{font-size:10px;color:var(--muted);margin-top:3px;}
.knode.hero{background:#f6f4fe;border-color:#c9c1ec;}
.knode.hero .knum{color:#3b338f;}
.knode.budget{background:#f6f7fa;border-style:dashed;}
.knode.budget .knum{font-size:19px;color:#5a5570;}
.karrow{display:flex;align-items:center;color:#b7b2cc;font-size:18px;font-weight:800;padding:0 7px;}
/* conversion strip */
.convstrip{display:flex;gap:10px;margin-bottom:11px;}
.convpill{flex:1;background:#f6f4fe;border:1px solid #d9d3f0;border-radius:10px;padding:8px 12px;display:flex;align-items:baseline;justify-content:space-between;}
.convpill .cvn{font-size:19px;font-weight:800;color:#3b338f;}
.convpill .cvl{font-size:10.5px;color:#6b6b80;font-weight:600;}
.ctitle{font-size:14px;font-weight:800;margin-bottom:2px;}
.csub{font-size:11px;color:var(--muted);margin-bottom:12px;}
.fnl{display:flex;flex-direction:column;gap:6px;}
.frow{display:flex;align-items:center;gap:12px;}
.frow .fnm{width:132px;text-align:right;font-size:12px;font-weight:600;flex-shrink:0;}
.frow .fnm small{display:block;font-size:9.5px;color:#a09ab5;font-weight:600;}
.frow .ftk{flex:1;display:flex;align-items:center;gap:8px;}
.frow .fbar{height:28px;border-radius:6px;display:flex;align-items:center;padding:0 11px;color:#fff;font-weight:700;font-size:12px;min-width:40px;}
.frow .fout{font-size:12px;font-weight:800;color:var(--ink);}
.frow .fcv{width:118px;font-size:12px;color:var(--muted);flex-shrink:0;}.frow .fcv b{color:#3b338f;font-weight:800;}
.fdiv{margin:2px 0 2px 144px;font-size:10.5px;color:#9a5b06;background:#fdf7f0;border:1px dashed #f0d19a;border-radius:8px;padding:4px 10px;}
.hrow{display:flex;align-items:center;gap:10px;margin:7px 0;}
.hrow .lb{width:70px;font-size:11.5px;text-align:right;flex-shrink:0;}
.hrow .tk{flex:1;background:#f2f1f8;border-radius:5px;height:20px;}
.hrow .fi{height:100%;border-radius:5px;display:flex;align-items:center;justify-content:flex-end;padding-right:7px;color:#fff;font-size:10.5px;font-weight:700;}
.arrow{font-size:11px;color:#8a86a0;margin-top:8px;border-top:1px dashed #e0dcf0;padding-top:7px;}
/* action plan */
.ap{background:#f4fbf6;border:1px solid #cdecd6;border-radius:12px;padding:13px 15px;}
.ap h4{font-size:13px;font-weight:800;margin-bottom:8px;color:#1e7a34;}
.ap table{width:100%;border-collapse:collapse;}
.ap td{padding:6px 4px;border-bottom:1px solid #e3f0e7;vertical-align:top;font-size:11.5px;line-height:1.45;}
.ap tr:last-child td{border-bottom:none;}
.ap .pf{color:#4a4a5c;width:52%;}
.ap .pa{color:#177a33;font-weight:700;}"""

body=f'''<aside class="side">
  <div class="logo"><span class="mk">🔗</span><div>하남 BBQ<br>서호수점</div></div><hr>
  <div class="fl">SCOPE</div><div class="fv">Meta × Amplitude 통합</div>
  <div class="fl">PERIOD</div><div class="fv">Jul 20 – Aug 1 · 13일</div>
  <div class="fl">목표</div><div class="fv">인지→브랜딩→예약유도</div>
  <div class="fl">KPI</div><div class="fv">예약 유도 · 유도당 비용</div><hr>
  <div class="leg"><span class="dot" style="background:#4f46b8"></span>Meta (광고 노출~클릭)<br><span class="dot" style="background:#e08a1e"></span>Amplitude (방문~유도)</div>
  <div class="pagechip">Executive · 경영 요약</div>
</aside>
<main class="main">
  <div class="top">
    <div><div class="h1">Executive Summary <span>/ 광고비 → 웹 행동 → 예약 유도</span></div>
    <div class="sub">광고비가 실제 예약 유도로 이어졌는가 · 두 도구를 하나의 흐름으로 연결 <span style="color:#a09ab5;">(교육 프로젝트)</span></div></div>
    <div class="badge">통합 · Meta + Amplitude</div>
  </div>

  <div class="kflowlab">KPI 흐름 &nbsp;·&nbsp; 광고비 → 광고 성과 → 웹 행동 → 예약 유도 → 유도당 비용</div>
  <div class="kflow">{kf}</div>

  <div class="card mb14">
    <div class="ctitle">🔻 통합 풀 퍼널 — 단계별 전환율</div>
    <div class="convstrip">
      <div class="convpill"><span class="cvl">노출 → 클릭</span><span class="cvn">3.84%</span></div>
      <div class="convpill"><span class="cvl">클릭 → 방문</span><span class="cvn">62.9%</span></div>
      <div class="convpill"><span class="cvl">방문 → 예약유도</span><span class="cvn">1.03%</span></div>
    </div>
    <div class="fnl">{fnl}</div>
  </div>

  <div class="grid2">
    <div class="card">
      <div class="ctitle">광고세트 통합 효율 — 유도당 비용</div>
      <div class="csub">Meta 지출 ÷ Amplitude 유도 · 짧을수록 쌈 · 지출 잠정</div>
      <div class="hrow"><div class="lb">business</div><div class="tk"><div class="fi" style="width:41%;background:#4f46b8">₫67,590</div></div></div>
      <div class="hrow"><div class="lb">전체</div><div class="tk"><div class="fi" style="width:57%;background:#8a7ee0">₫94,559</div></div></div>
      <div class="hrow"><div class="lb">family</div><div class="tk"><div class="fi" style="width:100%;background:#e08a1e">₫165,923</div></div></div>
      <div class="arrow">유도 business 60 · family 24 · <b style="color:#1e7a34">business 유도당 ~2.5배 저렴</b></div>
    </div>
    <div class="ap">
      <h4>■ Business Recommendation — Finding → Action</h4>
      <table>{prow}</table>
    </div>
  </div>
</main>'''

html=f'<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'
open('exec.html','w',encoding='utf-8').write(html)
print('wrote exec.html')
