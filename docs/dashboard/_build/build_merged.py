# -*- coding: utf-8 -*-
import subprocess, os

dates   = ['7/20','7/21','7/22','7/23','7/24','7/25','7/26','7/27','7/28','7/29','7/30','7/31','8/1']
counts  = [1,5,7,9,3,7,10,6,7,3,10,4,13]
rates   = [0.42,0.68,0.97,1.84,0.59,1.32,1.47,0.92,1.19,0.46,1.17,0.48,1.64]

# ---------- daily COUNT bar chart ----------
W,H = 640,190
x0,x1 = 34,632
plotT,plotB = 18,158
n=len(counts); slot=(x1-x0)/n; bw=slot*0.56
cmax=max(counts)
bars=[]
for i,v in enumerate(counts):
    cx=x0+slot*(i+0.5)
    h=(v/cmax)*(plotB-plotT)
    y=plotB-h
    # sequential shade by magnitude
    frac=v/cmax
    if frac>0.85: col='#4f46b8'
    elif frac>0.6: col='#6a60cf'
    elif frac>0.4: col='#8a7ee0'
    else: col='#b9b1e8'
    bars.append(f'<rect x="{cx-bw/2:.1f}" y="{y:.1f}" width="{bw:.1f}" height="{h:.1f}" rx="4" fill="{col}"/>')
    bars.append(f'<text x="{cx:.1f}" y="{y-4:.1f}" text-anchor="middle" font-size="11" font-weight="700" fill="#1c1b2e">{v}</text>')
    bars.append(f'<text x="{cx:.1f}" y="{plotB+14:.1f}" text-anchor="middle" font-size="9.5" fill="#6b6b80">{dates[i]}</text>')
bar_svg=f'<svg width="100%" viewBox="0 0 {W} {H}"><line x1="{x0}" y1="{plotB}" x2="{x1}" y2="{plotB}" stroke="#e6e6ee" stroke-width="1"/>'+''.join(bars)+'</svg>'

# ---------- daily RATE line chart ----------
rmax=2.0
pts=[]
for i,v in enumerate(rates):
    cx=x0+slot*(i+0.5)
    y=plotB-(v/rmax)*(plotB-plotT)
    pts.append((cx,y,v))
poly=' '.join(f'{cx:.1f},{y:.1f}' for cx,y,_ in pts)
area=f'{pts[0][0]:.1f},{plotB} '+poly+f' {pts[-1][0]:.1f},{plotB}'
dots=''.join(f'<circle cx="{cx:.1f}" cy="{y:.1f}" r="4.5" fill="#4f46b8"/>' for cx,y,_ in pts)
# label only min & max & last
labidx={rates.index(max(rates)),rates.index(min(rates)),len(rates)-1}
rlab=''.join(f'<text x="{pts[i][0]:.1f}" y="{pts[i][1]-8:.1f}" text-anchor="middle" font-size="10" font-weight="700" fill="#3b338f">{pts[i][2]:.2f}%</text>' for i in labidx)
xl=''.join(f'<text x="{x0+slot*(i+0.5):.1f}" y="{plotB+14:.1f}" text-anchor="middle" font-size="9.5" fill="#6b6b80">{dates[i]}</text>' for i in range(n))
grid=''.join(f'<line x1="{x0}" y1="{plotB-(g/rmax)*(plotB-plotT):.1f}" x2="{x1}" y2="{plotB-(g/rmax)*(plotB-plotT):.1f}" stroke="#f0f0f5" stroke-width="1"/><text x="{x0-4}" y="{plotB-(g/rmax)*(plotB-plotT)+3:.1f}" text-anchor="end" font-size="8.5" fill="#9a96b0">{g:.0f}%</text>' for g in [0,1,2])
line_svg=(f'<svg width="100%" viewBox="0 0 {W} {H}">{grid}'
          f'<polygon points="{area}" fill="#efedfb"/>'
          f'<polyline points="{poly}" fill="none" stroke="#4f46b8" stroke-width="2.5"/>{dots}{rlab}{xl}</svg>')

# ---------- weekday x hour heatmap (VN local, +7 from UTC) ----------
import json
hd=json.load(open('heat.json')); havg=hd['avg']; hmax2=hd['max']
wdn=['월','화','수','목','금','토','일']
def hcol(fr):
    a=(244,242,252); b=(59,51,143)
    r=round(a[0]+(b[0]-a[0])*fr); g=round(a[1]+(b[1]-a[1])*fr); bl=round(a[2]+(b[2]-a[2])*fr)
    return f'#{r:02x}{g:02x}{bl:02x}'
hhdr='<div class="hc"></div>'+''.join(f'<div class="hc">{h}</div>' for h in range(24))
hrows=''
for w in range(7):
    hrows+=f'<div class="rl2">{wdn[w]}</div>'
    for h in range(24):
        v=havg[w][h]; fr=v/hmax2; tc='#ffffff' if fr>0.55 else '#5a5570'
        hrows+=f'<div class="hcell" style="background:{hcol(fr)};color:{tc}">{v}</div>'
hleg=''.join(f'<span class="hsw" style="background:{hcol(f/5)}"></span>' for f in range(6))
heat_css=("<style>.hm2{display:grid;grid-template-columns:34px repeat(24,1fr);gap:3px;}"
".hc{font-size:9px;color:#8a86a0;text-align:center;padding-bottom:2px;}"
".rl2{font-size:11.5px;font-weight:700;color:#3a3550;display:flex;align-items:center;justify-content:flex-end;padding-right:6px;}"
".hcell{height:27px;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;}"
".hlegwrap{display:flex;justify-content:flex-end;gap:5px;align-items:center;font-size:10.5px;color:#6b6b80;margin-top:9px;}"
".hsw{width:14px;height:12px;border-radius:2px;display:inline-block;}</style>")
heat_html=heat_css+'<div class="hm2">'+hhdr+hrows+'</div><div class="hlegwrap">적음 '+hleg+' 많음</div>'

# ---------- horizontal bar helper ----------
def hbars(rows, unit='', ramp=True):
    mx=max(r[1] for r in rows)
    shades=['#4f46b8','#6a60cf','#8a7ee0','#b9b1e8','#d5cff0']
    out=''
    for i,(lab,val,sub) in enumerate(rows):
        w=max(6,val/mx*100)
        col=shades[i] if ramp else '#4f46b8'
        sm=f'<small style="color:#8a86a0"> {sub}</small>' if sub else ''
        out+=(f'<div class="hrow"><div class="lb">{lab}{sm}</div>'
              f'<div class="tk"><div class="fi" style="width:{w:.0f}%;background:{col}">{val}{unit}</div></div></div>')
    return out

loc_rows=[('hero',21,'첫 화면'),('floating',18,'우하단 고정'),('header',5,'상단'),('visit',1,'하단')]
typ_rows=[('message_book',37,'예약'),('call_phone',28,'예약'),('directions',16,'방문의향'),('view_menu',8,'탐색'),('visit_facebook',5,'탐색')]

loc_html=hbars(loc_rows)
typ_html=hbars(typ_rows)

# ---------- menu interest (item_name_ko, 실측) ----------
menu_rows=[('프라임 콤보',9),('생삼겹살',8),('콤보 A',7),('계란찜',5),('물냉면',5),('돼지고기 김치찌개',4),('소고기 콤보 A',1)]
mmax=max(v for _,v in menu_rows); mtot=sum(v for _,v in menu_rows)
def mshade(v):
    f=v/mmax
    return '#4f46b8' if f>0.8 else '#6a60cf' if f>0.6 else '#8a7ee0' if f>0.4 else '#b9b1e8'
menu_html=''
for lab,v in menu_rows:
    w=max(6,v/mmax*100)
    menu_html+=(f'<div class="hrow"><div class="lb" style="width:132px;font-size:11px">{lab}</div>'
                f'<div class="tk"><div class="fi" style="width:{w:.0f}%;background:{mshade(v)}">{v}</div></div></div>')

html=f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
:root{{--indigo:#4f46b8;--amber:#e08a1e;--ink:#1c1b2e;--muted:#6b6b80;--bg:#eef0f5;--card:#fff;--navy:#2b2850;--line:#e6e6ee;}}
*{{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
body{{font-family:'Malgun Gothic','Segoe UI',sans-serif;background:var(--bg);color:var(--ink);width:1360px;height:1690px;display:flex;}}
.side{{width:212px;background:var(--navy);color:#cfcbe8;padding:22px 20px;flex-shrink:0;display:flex;flex-direction:column;}}
.logo{{display:flex;align-items:center;gap:9px;font-weight:800;color:#fff;font-size:15px;line-height:1.25;}}
.logo .mk{{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--indigo),#8a7ee8);display:flex;align-items:center;justify-content:center;font-size:15px;}}
.side hr{{border:none;border-top:1px solid #47437a;margin:16px 0;}}
.fl{{font-size:11px;color:#8b87b8;margin-bottom:3px;letter-spacing:.03em;}}
.fv{{font-size:13px;color:#fff;margin-bottom:13px;font-weight:600;}}
.note{{font-size:11px;color:#9a96c8;line-height:1.6;margin-top:4px;}}
.note .sq{{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:5px;}}
.pagechip{{margin-top:auto;font-size:12px;color:#8b87b8;}}.pagechip b{{color:#fff;}}
.main{{flex:1;padding:20px 26px;overflow:hidden;}}
.top{{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;}}
.h1{{font-size:23px;font-weight:800;}}.h1 span{{color:var(--muted);font-weight:500;}}
.sub{{font-size:12px;color:var(--muted);margin-top:3px;}}
.badge{{background:#eef0ff;color:#3b338f;border:1px solid #c9c4f0;font-size:11px;font-weight:700;padding:5px 11px;border-radius:20px;}}
.grid5{{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;}}
.grid2{{display:grid;grid-template-columns:1fr 1fr;gap:14px;}}
.grid3{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;}}
.card{{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:15px 16px;box-shadow:0 1px 3px rgba(30,27,46,.05);}}
.mb14{{margin-bottom:14px;}}
.kpi .lab{{font-size:11.5px;color:var(--muted);font-weight:600;margin-bottom:6px;}}
.kpi .num{{font-size:25px;font-weight:800;letter-spacing:-.01em;}}
.kpi .foot{{font-size:10.5px;color:var(--muted);margin-top:5px;}}
.kpi.star{{background:#f6f4fe;border-color:#d5cff0;}}
.ctitle{{font-size:13.5px;font-weight:800;margin-bottom:2px;}}
.ctitle .star{{color:var(--indigo);}}
.csub{{font-size:10.5px;color:var(--muted);margin-bottom:9px;}}
.hrow{{display:flex;align-items:center;gap:10px;margin:8px 0;}}
.hrow .lb{{width:120px;font-size:11.5px;text-align:right;flex-shrink:0;}}
.hrow .tk{{flex:1;background:#f2f1f8;border-radius:5px;height:20px;}}
.hrow .fi{{height:100%;border-radius:5px;display:flex;align-items:center;justify-content:flex-end;padding-right:7px;color:#fff;font-size:10.5px;font-weight:700;}}
.cmp{{display:flex;gap:24px;align-items:flex-end;height:150px;justify-content:center;padding-top:6px;}}
.cmp .col{{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;width:78px;height:100%;}}
.cmp .bar{{width:100%;border-radius:6px 6px 0 0;}}
.cmp .pct{{font-size:16px;font-weight:800;margin-bottom:5px;}}
.cmp .nm{{font-size:12px;font-weight:600;margin-top:7px;}}
.cmp .ct{{font-size:10px;color:var(--muted);margin-top:1px;}}
.legend{{display:flex;gap:14px;font-size:10.5px;color:var(--muted);margin-top:4px;justify-content:flex-end;}}
.lg{{display:flex;align-items:center;gap:5px;}}.sw{{width:10px;height:10px;border-radius:3px;display:inline-block;}}
.foot2{{font-size:11px;color:#1e7a34;margin-top:9px;font-weight:600;}}
.calo{{background:#f7f6fd;border:1px solid #e2ddf7;border-radius:12px;padding:14px 17px;}}
.calo h4{{font-size:13px;font-weight:800;margin-bottom:8px;color:#3b338f;}}
.calo ul{{list-style:none;font-size:11.5px;line-height:1.85;}}
.calo li b{{color:var(--ink);}}
.calo .no{{color:#c0303a;font-weight:700;}}.calo .ok{{color:#1e7a34;font-weight:700;}}
.lim{{background:#fdf7f0;border:1px solid #f0dcc2;border-radius:12px;padding:14px 17px;}}
.lim h4{{font-size:13px;font-weight:800;margin-bottom:8px;color:#9a5b06;}}
.lim ul{{list-style:none;font-size:11px;line-height:1.8;color:#5a4a30;}}
.lim li::before{{content:"·";color:#c08a3a;font-weight:800;margin-right:6px;}}
.stepbar{{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:800;color:#3b338f;margin:2px 0 9px;}}
.stepbar .s{{background:#eef0ff;border:1px solid #d3d0f0;border-radius:20px;padding:3px 11px;}}
.stepbar .s.on{{background:#4f46b8;color:#fff;border-color:#4f46b8;}}
.stepbar .ar{{color:#b7b2cc;}}
.ap{{background:#f4fbf6;border:1px solid #cdecd6;border-radius:12px;padding:15px 17px;}}
.ap h4{{font-size:13.5px;font-weight:800;margin-bottom:9px;color:#1e7a34;}}
.ap table{{width:100%;border-collapse:collapse;}}
.ap th{{text-align:left;font-size:10.5px;color:#8a86a0;font-weight:700;padding:0 6px 6px;border-bottom:1px solid #d8ecdd;}}
.ap td{{padding:7px 6px;border-bottom:1px solid #e3f0e7;vertical-align:top;font-size:11.5px;line-height:1.45;}}
.ap tr:last-child td{{border-bottom:none;}}
.ap .pf{{color:#4a4a5c;width:50%;}}
.ap .pa{{color:#177a33;font-weight:700;}}
.limline{{font-size:10.5px;color:#8a5a20;background:#fdf7f0;border:1px solid #f0dcc2;border-radius:9px;padding:8px 13px;margin-top:12px;line-height:1.5;}}
</style></head><body>
<aside class="side">
  <div class="logo"><span class="mk">🔥</span><div>하남 BBQ<br>서호수점</div></div>
  <hr>
  <div class="fl">SEGMENT</div><div class="fv">Country = Vietnam</div>
  <div class="fl">PERIOD</div><div class="fv">Jul 20 – Aug 1 · 13일</div>
  <div class="fl">DEVICE</div><div class="fv">Mobile 99%+</div>
  <div class="fl">KPI</div><div class="fv">예약 유도</div>
  <hr>
  <div class="note"><span class="sq" style="background:#4f46b8"></span>모든 수치 <b style="color:#fff">실측</b><br>(Amplitude + Meta + 일별시트)</div>
  <div class="pagechip">단일 대시보드 · 1 / 1</div>
</aside>
<main class="main">
  <div class="top">
    <div><div class="h1">웹 행동 분석 <span>/ USER BEHAVIOR</span></div>
    <div class="sub">방문 → 버튼 클릭 → 예약 유도 → 콘텐츠 관심 · 전 기간 실측</div></div>
    <div class="badge">실측 기반 · 예시/추정 제거</div>
  </div>

  <div class="grid5 mb14">
    <div class="card kpi"><div class="lab">페이지 방문(고유)</div><div class="num">8,274</div><div class="foot">도착률 62.9%</div></div>
    <div class="card kpi"><div class="lab">버튼 클릭 집중도</div><div class="num">87%</div><div class="foot">hero+고정 위치</div></div>
    <div class="card kpi star"><div class="lab">총 예약 유도 ★</div><div class="num">85건</div><div class="foot">message + call</div></div>
    <div class="card kpi star"><div class="lab">예약 유도율 ★</div><div class="num">1.03%</div><div class="foot">유도 ÷ 방문</div></div>
    <div class="card kpi"><div class="lab">유도당 비용</div><div class="num">₫94,559</div><div class="foot">지출 ÷ 85</div></div>
  </div>

  <div class="stepbar"><span class="s on">① 페이지 방문</span><span class="ar">▸</span><span class="s on">② 버튼 클릭</span><span class="ar">▸</span><span class="s on">③ 예약 유도</span><span class="ar">▸</span><span class="s on">④ 예약 유도율</span><span class="ar">▸</span><span class="s on">⑤ 콘텐츠 관심</span></div>

  <div class="card mb14">
    <div class="ctitle">① 페이지 방문 — 요일 × 시간대 히트맵 <span style="font-weight:600;color:#8a86a0;font-size:11px">(VN 현지시각)</span></div>
    <div class="csub"><b>토 20–21시 최고</b> · 저녁 19–22시 전 요일 공통 · 일요일 저녁 약함</div>
    {heat_html}
  </div>

  <div class="grid2 mb14">
    <div class="card">
      <div class="ctitle">② 버튼 클릭 — 위치별 (cta_location)</div>
      <div class="csub">첫 화면·고정버튼이 <b>87%</b></div>
      {loc_html}
    </div>
    <div class="card">
      <div class="ctitle">② 버튼 클릭 — 행동 유형 (cta_type)</div>
      <div class="csub">예약(message+call) &gt; 방문의향 &gt; 탐색</div>
      {typ_html}
    </div>
  </div>

  <div class="grid3 mb14">
    <div class="card">
      <div class="ctitle"><span class="star">★</span> ③ 예약 유도 — 일별 건수</div>
      <div class="csub">후반 우상향 · 8/1 최고 13건</div>
      {bar_svg}
    </div>
    <div class="card">
      <div class="ctitle"><span class="star">★</span> ④ 예약 유도율 — 일별</div>
      <div class="csub">최고 7/23 1.84% · 후반 재상승</div>
      {line_svg}
    </div>
    <div class="card">
      <div class="ctitle">③④ 광고세트별 유도율</div>
      <div class="csub">business 우세 (Meta와 일치)</div>
      <div class="cmp">
        <div class="col"><span class="pct" style="color:#e08a1e">0.78%</span><div class="bar" style="height:56%;background:#e08a1e"></div><span class="nm">family</span><span class="ct">유도 24건</span></div>
        <div class="col"><span class="pct" style="color:#4f46b8">1.39%</span><div class="bar" style="height:100%;background:#4f46b8"></div><span class="nm">business</span><span class="ct">유도 60건</span></div>
      </div>
      <div class="legend"><span class="lg"><span class="sw" style="background:#4f46b8"></span>business</span><span class="lg"><span class="sw" style="background:#e08a1e"></span>family</span></div>
    </div>
  </div>

  <div class="grid2 mb14" style="grid-template-columns:1.15fr 1fr;">
    <div class="card">
      <div class="ctitle">⑤ 메뉴 관심도 <span style="font-weight:600;color:#8a86a0;font-size:11px">(Menu Interest · 클릭 기반)</span></div>
      <div class="csub">상세를 연 메뉴 = 브랜딩 관여 신호 · 판매량 아님</div>
      {menu_html}
    </div>
    <div class="calo">
      <h4>■ ⑤ 콘텐츠 관심 = 브랜딩 층</h4>
      <ul>
        <li>· <b>콤보·프리미엄·생삼겹살</b> 관심 집중</li>
        <li>· 인지→예약유도에 이어 <b>브랜딩 층</b>도 실측</li>
        <li class="ok">→ 대표 메뉴를 hero·광고 상단에 노출</li>
        <li class="no">· ⚠️ 표본 39건 — 경향 참고용</li>
      </ul>
    </div>
  </div>

  <div class="ap">
    <h4>■ Action Plan — Finding → Recommendation</h4>
    <table>
      <tr><th>Finding (발견)</th><th>Recommendation (실행)</th></tr>
      <tr><td class="pf">예약·방문 <b>저녁 19–22시·주말</b> 집중</td><td class="pa">→ 저녁·금토 시간대 광고 예산 확대</td></tr>
      <tr><td class="pf">유도율 <b>business 1.39%</b> &gt; family 0.78%</td><td class="pa">→ business 세트 예산 비중 확대</td></tr>
      <tr><td class="pf">전환 <b>hero+고정버튼 87%</b> 집중</td><td class="pa">→ CTA 위치 A/B 테스트 · 첫 화면 메시지 강화</td></tr>
      <tr><td class="pf">메뉴 <b>콤보·프리미엄·생삼겹살</b> 관심 高</td><td class="pa">→ 대표 메뉴를 hero·광고 상단 노출</td></tr>
      <tr><td class="pf">예약(message+call) &gt; 방문의향 &gt; 탐색</td><td class="pa">→ 예약 CTA를 최상단 우선 배치</td></tr>
      <tr><td class="pf">후반 유도율 <b>우상향</b> (8/1 최고)</td><td class="pa">→ 검증된 소재로 다음 캠페인 즉시 확대</td></tr>
    </table>
    <div class="limline"><b>측정 한계</b> — 실제 예약(POS) 미연동으로 '예약 <b>유도</b>'까지 측정 · 히트맵 UTC→VN(+7) 변환 · 메뉴 관심 표본 39건(경향 참고)</div>
  </div>
</main></body></html>'''

path=os.path.dirname(os.path.abspath(__file__))
hp=os.path.join(path,'merged.html')
open(hp,'w',encoding='utf-8').write(html)
print('wrote',hp)
