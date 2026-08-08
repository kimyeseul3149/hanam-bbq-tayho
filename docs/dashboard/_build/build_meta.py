# -*- coding: utf-8 -*-
import os, math

# creatives: (short, ctr, cpc, impr, clicks, spend, tool, on)
cr=[('taste_message',5.22,413,173351,9057,3744050,'b',True),
    ('bday_vid',4.30,558,47256,2033,1133872,'f',True),
    ('space_vid',3.40,576,5001,170,97905,'b',True),
    ('f_taste_message',2.97,626,140895,4180,2615901,'f',True),
    ('space_carousel',2.04,908,11540,235,213440,'b',False),
    ('bday_img',0.77,793,37899,293,232375,'f',False)]
BC='#4f46b8'; FC='#e08a1e'
def tcol(t): return BC if t=='b' else FC

# ---- CPC x CTR scatter ----
X0,X1,Y0,Y1=54,586,18,270
xpix=lambda c:X0+c/6*(X1-X0)
ypix=lambda p:Y0+p/1000*(Y1-Y0)
avgx=xpix(3.84); avgy=ypix(503); impmax=173351
sv=[f'<rect x="{avgx:.0f}" y="{Y0}" width="{X1-avgx:.0f}" height="{avgy-Y0:.0f}" fill="#eafaf0"/>']  # sweet spot
# gridlines
for c in [0,2,4,6]:
    sv.append(f'<line x1="{xpix(c):.0f}" y1="{Y0}" x2="{xpix(c):.0f}" y2="{Y1}" stroke="#f0f0f5" stroke-width="1"/><text x="{xpix(c):.0f}" y="{Y1+15}" text-anchor="middle" font-size="9.5" fill="#9a96b0">{c}%</text>')
for p in [0,250,500,750,1000]:
    sv.append(f'<line x1="{X0}" y1="{ypix(p):.0f}" x2="{X1}" y2="{ypix(p):.0f}" stroke="#f0f0f5" stroke-width="1"/><text x="{X0-6}" y="{ypix(p)+3:.0f}" text-anchor="end" font-size="9" fill="#9a96b0">₫{p}</text>')
sv.append(f'<text x="{X0}" y="11" font-size="9" fill="#9a96b0">CPC ₫ (위=쌈 · 아래=비쌈)</text>')
# avg crosshair
sv.append(f'<line x1="{avgx:.0f}" y1="{Y0}" x2="{avgx:.0f}" y2="{Y1}" stroke="#b7b2cc" stroke-width="1.3" stroke-dasharray="4 3"/>')
sv.append(f'<line x1="{X0}" y1="{avgy:.0f}" x2="{X1}" y2="{avgy:.0f}" stroke="#b7b2cc" stroke-width="1.3" stroke-dasharray="4 3"/>')
sv.append(f'<text x="{avgx+4:.0f}" y="{Y0+11}" font-size="8.5" fill="#8a86a0">평균 CTR 3.84%</text>')
sv.append(f'<text x="{X0+3}" y="{avgy-4:.0f}" font-size="8.5" fill="#8a86a0">평균 CPC ₫503</text>')
sv.append(f'<text x="{X1-6}" y="{Y0+13}" text-anchor="end" font-size="10" font-weight="800" fill="#1e7a34">★ 스윗스팟 (싸고 잘 눌림)</text>')
# bubbles
for name,ctr,cpc,impr,cl,sp,t,on in cr:
    x=xpix(ctr); y=ypix(cpc); r=6+math.sqrt(impr/impmax)*20
    op=0.8 if on else 0.28
    stroke='' if on else f' stroke="{tcol(t)}" stroke-width="1.5" stroke-dasharray="3 2"'
    sv.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.0f}" fill="{tcol(t)}" fill-opacity="{op}"{stroke}/>')
    star='★ ' if name=='taste_message' else ''
    fill="#1c1b2e" if on else "#9a96b0"; fwt=800 if star else 600
    if name=='space_vid':      # nudge right to avoid f_taste label
        sv.append(f'<text x="{x+r+3:.0f}" y="{y+3:.0f}" text-anchor="start" font-size="9" font-weight="{fwt}" fill="{fill}">{name}</text>')
    else:
        sv.append(f'<text x="{x:.0f}" y="{y-r-4:.0f}" text-anchor="middle" font-size="9" font-weight="{fwt}" fill="{fill}">{star}{name}</text>')
scatter=f'<svg width="100%" viewBox="0 0 606 306">{"".join(sv)}<text x="{(X0+X1)/2:.0f}" y="302" text-anchor="middle" font-size="9.5" fill="#8a86a0">CTR → (높을수록 잘 눌림)</text></svg>'

# creative table rows
def won(on): return '<span style="color:#2f9e44;font-weight:700">● 켜짐</span>' if on else '<span style="color:#b8b4c8;font-weight:700">○ 꺼짐</span>'
rows=''
for name,ctr,cpc,impr,cl,sp,t,on in cr:
    win=' class="win"' if name=='taste_message' else ''
    dot=f'<span class="dt" style="background:{tcol(t)}"></span>'
    tag='<span class="wtag">승자</span>' if name=='taste_message' else ''
    rows+=(f'<tr{win}><td>{dot}{name}{tag}</td><td>{won(on)}</td><td>{impr:,}</td><td>{cl:,}</td><td>₫{cpc}</td><td>{ctr:.2f}%</td><td>₫{sp:,}</td></tr>')

# ---- demographics pyramids (age x gender, link clicks) ----
ages=['65+','55-64','45-54','35-44','25-34','18-24','13-17']
biz={'65+':(2500,1350),'55-64':(1700,1150),'45-54':(1050,470),'35-44':(560,260),'25-34':(300,200),'18-24':(50,40),'13-17':(10,10)}
fam={'65+':(580,1400),'55-64':(600,1350),'45-54':(430,800),'35-44':(370,510),'25-34':(230,330),'18-24':(10,20),'13-17':(5,10)}
def pyramid(data):
    mx=max(max(m,f) for m,f in data.values()); out=''
    for a in ages:
        m,f=data[a]; wm=m/mx*100; wf=f/mx*100
        out+=(f'<div class="pr"><div class="pm">{m:,}</div>'
              f'<div class="pmb"><span style="width:{wm:.0f}%;background:#3b6fd4"></span></div>'
              f'<div class="pa">{a}</div>'
              f'<div class="pfb"><span style="width:{wf:.0f}%;background:#d6467f"></span></div>'
              f'<div class="pf">{f:,}</div></div>')
    return out
pyr_biz=pyramid(biz); pyr_fam=pyramid(fam)

CSS=""":root{--indigo:#4f46b8;--amber:#e08a1e;--ink:#1c1b2e;--muted:#6b6b80;--bg:#eef0f5;--card:#fff;--navy:#2b2850;--line:#e6e6ee;}
*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:'Malgun Gothic','Segoe UI',sans-serif;background:var(--bg);color:var(--ink);width:1360px;height:1400px;display:flex;}
.side{width:212px;background:var(--navy);color:#cfcbe8;padding:22px 20px;flex-shrink:0;display:flex;flex-direction:column;}
.logo{display:flex;align-items:center;gap:9px;font-weight:800;color:#fff;font-size:15px;line-height:1.25;}
.logo .mk{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#1877f2,#5b9bff);display:flex;align-items:center;justify-content:center;font-size:15px;}
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
.badge{background:#e9ecff;color:#4038a0;border:1px solid #c4c9f5;font-size:11px;font-weight:700;padding:5px 11px;border-radius:20px;}
.grid6{display:grid;grid-template-columns:repeat(6,1fr);gap:11px;margin-bottom:14px;}
.grid5{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:14px;}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 15px;box-shadow:0 1px 3px rgba(30,27,46,.05);}
.mb14{margin-bottom:14px;}
.kpi .lab{font-size:11px;color:var(--muted);font-weight:600;margin-bottom:6px;}
.kpi .num{font-size:22px;font-weight:800;letter-spacing:-.01em;}
.kpi .foot{font-size:10px;color:var(--muted);margin-top:4px;}
.ctitle{font-size:14px;font-weight:800;margin-bottom:2px;}
.csub{font-size:11px;color:var(--muted);margin-bottom:10px;}
.tb{width:100%;border-collapse:collapse;font-size:12px;}
.tb th,.tb td{padding:7px 8px;border-bottom:1px solid var(--line);text-align:right;}
.tb th{color:var(--muted);font-weight:600;font-size:10.5px;}
.tb td:first-child,.tb th:first-child{text-align:left;}
.tb .win{background:#f3f1fc;} .tb .win td{font-weight:700;}
.dt{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:middle;}
.wtag{display:inline-block;background:#4f46b8;color:#fff;font-size:9px;font-weight:700;padding:1px 6px;border-radius:9px;margin-left:6px;}
.hrow{display:flex;align-items:center;gap:9px;margin:8px 0;}
.hrow .lb{width:56px;font-size:11.5px;text-align:right;flex-shrink:0;}
.hrow .tk{flex:1;background:#f2f1f8;border-radius:5px;height:20px;}
.hrow .fi{height:100%;border-radius:5px;display:flex;align-items:center;justify-content:flex-end;padding-right:7px;color:#fff;font-size:10px;font-weight:700;}
.cmp2{width:100%;border-collapse:collapse;font-size:12px;}
.cmp2 th,.cmp2 td{padding:8px 6px;border-bottom:1px solid var(--line);text-align:right;}
.cmp2 th{color:var(--muted);font-size:10.5px;font-weight:600;}
.cmp2 td:first-child,.cmp2 th:first-child{text-align:left;font-weight:700;}
.cmp2 .w{color:var(--indigo);font-weight:800;}
.cmp2 th.bz{color:#1e7a34;background:#f4fbf6;border-radius:4px;}
.sq{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:middle;}
.calo{background:#f7f6fd;border:1px solid #e2ddf7;border-radius:12px;padding:13px 15px;}
.calo h4{font-size:12.5px;font-weight:800;margin-bottom:7px;color:#3b338f;}
.calo p{font-size:11.5px;line-height:1.7;color:var(--ink);}.calo b{color:#3b338f;}
.pr{display:flex;align-items:center;gap:5px;margin:4px 0;}
.pm{width:38px;text-align:right;color:#3b6fd4;font-weight:700;font-size:9.5px;}
.pf{width:38px;text-align:left;color:#c03068;font-weight:700;font-size:9.5px;}
.pa{width:46px;text-align:center;color:#6b6b80;font-weight:600;font-size:9px;flex-shrink:0;}
.pmb{flex:1;display:flex;justify-content:flex-end;}
.pmb span{height:14px;border-radius:3px 0 0 3px;display:block;}
.pfb{flex:1;display:flex;justify-content:flex-start;}
.pfb span{height:14px;border-radius:0 3px 3px 0;display:block;}
.pyrh{font-size:11.5px;font-weight:700;margin-bottom:6px;text-align:center;color:#1c1b2e;}
.dnote{font-size:10.5px;color:#8a86a0;margin-top:11px;border-top:1px dashed #e0dcf0;padding-top:8px;line-height:1.55;}"""

body=f'''<aside class="side">
  <div class="logo"><span class="mk">📣</span><div>하남 BBQ<br>서호수점</div></div><hr>
  <div class="fl">SOURCE</div><div class="fv">Meta 광고관리자</div>
  <div class="fl">PERIOD</div><div class="fv">Jul 20 – Aug 1 · 13일</div>
  <div class="fl">목표</div><div class="fv">트래픽 (링크클릭)</div>
  <div class="fl">규모</div><div class="fv">광고세트 2 · 소재 6</div><hr>
  <div class="leg"><span class="dot" style="background:#4f46b8"></span>business 계열<br><span class="dot" style="background:#e08a1e"></span>family 계열</div>
  <div class="pagechip">Meta Ads · 광고 효율</div>
</aside>
<main class="main">
  <div class="top">
    <div><div class="h1">Meta Ads — 광고 효율 <span>/ EFFICIENCY</span></div>
    <div class="sub">얼마에 몇 명을 데려왔나 · 어느 소재·세트가 싸고 잘 눌렸나 · 하노이 베트남 · 실측 &nbsp;|&nbsp; <b style="color:#3b338f;">광고 예산 ₫8.04M</b> · CPM ₫19,323 <span style="color:#a09ab5;">(캠페인 지출 · 교육 프로젝트)</span></div></div>
    <div class="badge">Meta 실측</div>
  </div>

  <div class="grid5">
    <div class="card kpi"><div class="lab">노출</div><div class="num">415,942</div><div class="foot">빈도 1.94</div></div>
    <div class="card kpi"><div class="lab">도달</div><div class="num">213,946</div><div class="foot">순 사용자</div></div>
    <div class="card kpi"><div class="lab">고유 링크클릭</div><div class="num">13,150</div><div class="foot">전체 15,968</div></div>
    <div class="card kpi"><div class="lab">CTR</div><div class="num">3.84%</div><div class="foot">클릭 ÷ 노출</div></div>
    <div class="card kpi"><div class="lab">CPC</div><div class="num">₫503</div><div class="foot">고유 ₫611</div></div>
  </div>

  <div class="grid3 mb14" style="grid-template-columns:1.5fr 1fr;">
    <div class="card">
      <div class="ctitle">CPC × CTR 산점도 — 어느 소재가 스윗스팟인가</div>
      <div class="csub">버블 크기=노출 · 우하단(CTR↑·CPC↓)=효율적 · 점선=평균 · 인디고=business / 앰버=family · 점선원=꺼진 소재</div>
      {scatter}
    </div>
    <div class="card">
      <div class="ctitle">광고세트 비교 — 광고 성과 → 비즈니스 성과</div>
      <div class="csub">CTR·CPC(광고)뿐 아니라 예약 유도·유도당 비용(비즈니스)까지 business 우세</div>
      <table class="cmp2">
        <tr><th>세트</th><th>CPC</th><th>CTR</th><th class="bz">예약유도</th><th class="bz">유도당비용</th></tr>
        <tr><td><span class="sq" style="background:#4f46b8"></span>business</td><td class="w">₫429</td><td class="w">4.98%</td><td class="w">60건</td><td class="w">₫67,590</td></tr>
        <tr><td><span class="sq" style="background:#e08a1e"></span>family</td><td>₫612</td><td>2.88%</td><td>24건</td><td>₫165,923</td></tr>
      </table>
      <div style="font-size:10px;color:#8a86a0;margin-top:4px">광고 성과(CPC·CTR)와 비즈니스 성과(유도당비용)가 같은 승자 · 유도당비용=지출÷유도(통합)</div>
      <div class="ctitle" style="margin-top:14px">포맷별 CTR</div>
      <div class="csub">동영상이 압도 · 이미지·캐러셀은 정리됨</div>
      <div class="hrow"><div class="lb">동영상</div><div class="tk"><div class="fi" style="width:100%;background:#4f46b8">4.21%</div></div></div>
      <div class="hrow"><div class="lb">캐러셀</div><div class="tk"><div class="fi" style="width:48%;background:#b9b1e8">2.04%</div></div></div>
      <div class="hrow"><div class="lb">이미지</div><div class="tk"><div class="fi" style="width:18%;background:#d5cff0">0.77%</div></div></div>
    </div>
  </div>

  <div class="card mb14">
    <div class="ctitle">소재별 성과 (CTR 높은 순)</div>
    <div class="csub">CTR=링크클릭÷노출 · 상태 ●켜짐 / ○꺼짐 · 인디고=business / 앰버=family</div>
    <table class="tb">
      <tr><th>소재</th><th>상태</th><th>노출</th><th>링크클릭</th><th>CPC</th><th>CTR</th><th>지출</th></tr>
      {rows}
    </table>
  </div>

  <div style="display:grid;grid-template-columns:1.05fr 1fr;gap:14px;">
    <div class="card">
      <div class="ctitle">소재별 예약 유도 효율 — 유도당 비용 <span style="color:#8a86a0;font-weight:600;font-size:11px">(Meta 지출 × Amplitude 유도)</span></div>
      <div class="csub">소재 지출 ÷ 예약 유도(utm_content) · 짧을수록 쌈 · 볼륨 충분한 3개 · 지출 잠정</div>
      <div class="hrow"><div class="lb" style="width:158px;font-size:11px;text-align:right">🏆 business_taste_message</div><div class="tk"><div class="fi" style="width:26%;background:#4f46b8">₫62,401</div></div></div>
      <div class="hrow"><div class="lb" style="width:158px;font-size:11px;text-align:right">family_bday_vid</div><div class="tk"><div class="fi" style="width:40%;background:#e08a1e">₫94,489</div></div></div>
      <div class="hrow"><div class="lb" style="width:158px;font-size:11px;text-align:right">family_taste_message</div><div class="tk"><div class="fi" style="width:100%;background:#e6a34a">₫237,809</div></div></div>
      <div style="font-size:10.5px;color:#8a86a0;margin-top:11px;border-top:1px dashed #e0dcf0;padding-top:8px;">예약유도: taste <b>60</b> · bday_vid 12 · f_taste 11 · bday_img 2(표본부족) · space류 0(전환없음) → 하위 3개 제외</div>
    </div>
    <div class="calo">
      <h4>■ 승자 소재 & Action</h4>
      <p><b>business_taste_message = 4관왕</b><br>CTR·CPC·클릭·유도당비용 모두 1위 · 예약 유도 60건(71%)</p>
      <p style="margin-top:9px"><b style="color:#c0303a">반전 — family_taste_message</b><br>클릭 4,180이나 유도 11 → 유도당 ₫237,809 · <b>클릭 ≠ 예약</b></p>
      <p style="margin-top:9px;color:#1e7a34;font-weight:700">→ 다음 캠페인: business·taste_message 중심 유지</p>
    </div>
  </div>

  <div class="card" style="margin-top:14px;">
    <div class="ctitle">인구통계 — 연령 × 성별 (세트별) <span style="color:#8a86a0;font-weight:600;font-size:11px">Meta · 링크클릭 · Advantage+ 타겟</span></div>
    <div class="csub"><span style="color:#3b6fd4;font-weight:700">■ 남성</span> &nbsp;/&nbsp; <span style="color:#c03068;font-weight:700">■ 여성</span> &nbsp;·&nbsp; <b>business=남성 편중 vs family=여성 편중</b> · 둘 다 45–65+ 중장년 · 막대 값은 차트 판독(근사)</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;">
      <div><div class="pyrh">business 세트 · <span style="color:#3b6fd4">남 63%</span> / <span style="color:#c03068">여 36%</span> <span style="color:#8a86a0;font-weight:500;font-size:10px">(6,100 / 3,481)</span></div>{pyr_biz}</div>
      <div><div class="pyrh">family 세트 · <span style="color:#3b6fd4">남 34%</span> / <span style="color:#c03068">여 66%</span> <span style="color:#8a86a0;font-weight:500;font-size:10px">(2,231 / 4,373)</span></div>{pyr_fam}</div>
    </div>
    <div class="dnote">→ <b>메시지 테마가 성별을 가름</b> · 둘 다 중장년(45–65+) 도달 · <b>Action: 세트별 메시지·타겟 분리 유지</b></div>
  </div>
</main>'''

html=f'<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'
open('meta.html','w',encoding='utf-8').write(html)
print('wrote meta.html')
