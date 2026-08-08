# -*- coding: utf-8 -*-
"""웹페이지 운영 대시보드 v2 — 데이터 추출

v1(web-ops.html)과의 차이
  · Meta 광고 지표를 전부 뺐다. 도착률·유도당비용·CTR·CPC·지출은 1·2페이지 소관.
    → 모든 지표가 웹 계측 하나에서만 나오므로 **모든 필터가 모든 패널에 적용된다.**
      (v1에서 도착률·유도당비용만 기간/세그먼트 필터를 못 받던 제약이 사라진다)
  · 콘텐츠 관심 신호·CTA 종류×위치·Top 메뉴·브라우저 분포를 새로 싣는다.

검증 목표 (03_*/04_*/05_* 시트와 일치해야 함)
  방문자 8,084 · 세션 9,505 · 행동 150 · CTA 110 · 예약유도 90 · 무엇이라도 클릭 396
"""
import json
import os
import pandas as pd

ROOT = r'C:\Users\user\Desktop\GMM\0709_claude_하남_웹페이지제작'
SRC = os.path.join(ROOT, 'docs', 'analytics', '하남BBQ_웹페이지분석데이터(7.20~8.2).xlsx')
OUT = os.path.join(ROOT, 'docs', 'dashboard', '_build', 'web_ops2_data.json')

ARRIVE = ['[Amplitude] Page Viewed', 'session_start']
RES = ['message_book', 'call_phone']
ACT = ['CTA Clicked', 'Menu Item Viewed', 'Navigation Clicked', 'Menu Tab Switched',
       'Language Switched', 'Menu Group Jumped', 'Menu Modal Closed']
CUSTOM8 = ACT + ['Privacy Policy Viewed']
AUTOCLICK = ['[Amplitude] Element Clicked', '[Amplitude] Dead Click', '[Amplitude] Rage Click']

P2_START = 9      # date 인덱스: 0=7/20 … 9=7/29 (소재 교체일)

# 콘텐츠 관심 신호 — 스크롤 뎁스가 없어 클릭으로 대신 읽는 지표.
# (플래그명, 화면 라벨, 어느 섹션에 대한 관심인가)
INTEREST = [
    ('menu',   '메뉴 상세 열람',  '메뉴'),
    ('vmenu',  '메뉴 보기 CTA',   '메뉴'),
    ('tab',    '메뉴 탭 전환',    '메뉴'),
    ('jump',   '메뉴 그룹 점프',  '메뉴'),
    ('dirs',   '지도·길찾기',     '위치'),
    ('nav',    '내비게이션 클릭', '탐색'),
]


def main():
    cache = os.path.join(os.path.dirname(OUT), '_raw_cache.pkl')
    if os.path.exists(cache):
        print('reading cache ...')
        d = pd.read_pickle(cache)
    else:
        print('reading xlsx ...')
        d = pd.read_excel(SRC, sheet_name='00_원본')
        d.to_pickle(cache)
    d['time_hanoi'] = pd.to_datetime(d.time_hanoi)
    d['date_hanoi'] = pd.to_datetime(d.date_hanoi).dt.date
    print('  rows', len(d))

    # ── 세션 테이블 ────────────────────────────────────────────────
    # 세션의 대표 속성 = 그 세션에서 처음 관측된 '결측 아닌' 값.
    # groupby.first()가 NaN을 건너뛰므로 결측 채우기는 반드시 이 뒤에.
    d = d.sort_values('time_hanoi')
    first = d.groupby('session_id', sort=False).first()
    arr = d[d.event_type.isin(ARRIVE)].groupby('session_id').first()
    for c in ['creative', 'utm_term']:
        v = pd.Series(first.index.map(arr[c]), index=first.index)
        first[c] = v.fillna(first[c])
    for c in ['creative', 'utm_term', 'city', 'language', 'os_name', 'device',
              'device_family']:
        first[c] = first[c].fillna('(none)')

    dates = sorted(d.date_hanoi.unique())
    didx = {v: i for i, v in enumerate(dates)}

    def codes(series, fill='(none)'):
        vals = series.fillna(fill).astype(str)
        cats = sorted(vals.unique())
        cmap = {v: i for i, v in enumerate(cats)}
        return vals.map(cmap).to_numpy(), cats

    sess = pd.DataFrame(index=first.index)
    sess['dev'] = first.device_id
    sess['date'] = first.date_hanoi.map(didx)
    sess['hour'] = pd.to_datetime(first.time_hanoi).dt.hour
    sess['wd'] = pd.to_datetime(first.time_hanoi).dt.weekday      # 0=월
    DIMS = [('cre', 'creative'), ('set', 'utm_term'), ('dv', 'device'),
            ('os', 'os_name'), ('city', 'city'), ('lang', 'language'),
            ('ofam', 'device_family')]      # ofam = iOS / Android / Windows / Mac OS X
    for name, col in DIMS:
        sess[name], _ = codes(first[col])
    cats = {name: codes(first[col])[1] for name, col in DIMS}

    devs = sorted(sess.dev.unique())
    umap = {v: i for i, v in enumerate(devs)}
    sess['u'] = sess.dev.map(umap)

    # ── 세션별 행동 플래그 ─────────────────────────────────────────
    def flag(mask, name):
        s = d[mask].groupby('session_id').size()
        v = sess.index.map(s).fillna(0).to_numpy()
        sess[name] = (v > 0).astype(int)

    flag(d.event_type.isin(ARRIVE), 'arrive')
    flag(d.event_type.isin(CUSTOM8) | d.event_type.isin(AUTOCLICK), 'anyclick')
    flag(d.event_type.isin(ACT), 'act')
    flag(d.event_type == 'CTA Clicked', 'cta')
    flag(d.cta_type.isin(RES), 'res')
    flag(d.cta_type == 'message_book', 'msg')
    flag(d.cta_type == 'call_phone', 'call')
    flag(d.event_type == 'Menu Item Viewed', 'menu')
    flag(d.event_type == '[Amplitude] Dead Click', 'dead')
    flag(d.event_type == '[Amplitude] Rage Click', 'rage')
    # v2 신규 — 콘텐츠 관심 신호
    flag(d.event_type == 'Navigation Clicked', 'nav')
    flag(d.event_type == 'Menu Tab Switched', 'tab')
    flag(d.event_type == 'Menu Group Jumped', 'jump')
    flag(d.event_type == 'Language Switched', 'langsw')
    flag(d.event_type == 'Privacy Policy Viewed', 'priv')
    flag(d.cta_type == 'view_menu', 'vmenu')
    flag(d.cta_type == 'directions_reserve', 'dirs')

    sess = sess.reset_index()
    sidx = {v: i for i, v in enumerate(sess.session_id)}

    # ── 이벤트 상세 (세션 인덱스 참조) ──────────────────────────────
    cta = d[d.event_type == 'CTA Clicked'].copy()
    ct_c, ct_cats = codes(cta.cta_type)
    cl_c, cl_cats = codes(cta.cta_location)
    ctaev = [[int(sidx[s]), int(t), int(l)]
             for s, t, l in zip(cta.session_id, ct_c, cl_c)]

    mn = d[d.event_type == 'Menu Item Viewed'].copy()
    mi_c, mi_cats = codes(mn.menu_item)
    menuev = [[int(sidx[s]), int(i)] for s, i in zip(mn.session_id, mi_c)]

    cats['ctaType'] = ct_cats
    cats['ctaLoc'] = cl_cats
    cats['menu'] = mi_cats

    # ── 검증 ───────────────────────────────────────────────────────
    def uniq(col):
        return sess.loc[sess[col] == 1, 'u'].nunique()

    chk = {'방문자': int(uniq('arrive')), '세션': int(len(sess)),
           '무엇이라도 클릭': int(uniq('anyclick')), '행동': int(uniq('act')),
           'CTA': int(uniq('cta')), '예약유도': int(uniq('res')),
           '메신저': int(uniq('msg')), '전화': int(uniq('call'))}
    want = {'방문자': 8084, '세션': 9505, '무엇이라도 클릭': 396, '행동': 150,
            'CTA': 110, '예약유도': 90, '메신저': 56, '전화': 38}
    print('\n── 검증 ──')
    ok = True
    for k, v in chk.items():
        if v != want[k]:
            ok = False
        print(f'  {"OK " if v == want[k] else "MISMATCH"} {k:16s} {v:>6,}  (기대 {want[k]:,})')

    print('\n── 콘텐츠 관심 신호 (사용자 수) ──')
    for f, lab, sec in INTEREST:
        print(f'  {lab:16s} {uniq(f):>4,}명   [{sec}]')

    print('\n── OS별 (device_family) ──')
    for i, nm in enumerate(cats['ofam']):
        m = sess.ofam == i
        u = sess.loc[m & (sess.arrive == 1), 'u'].nunique()
        act = sess.loc[m & (sess.act == 1), 'u'].nunique()
        res = sess.loc[m & (sess.res == 1), 'u'].nunique()
        if not u:
            continue
        print(f'  {nm:10s} 방문 {u:>5,} · 행동 {act:>3,} ({act/u*100:.2f}%) · '
              f'유도 {res:>3,} ({res/u*100:.2f}%)')

    # 소재별 집행 차수
    phase = {}
    for i, name in enumerate(cats['cre']):
        ds = sess.loc[(sess.cre == i) & (sess.arrive == 1), 'date']
        if not len(ds):
            phase[name] = ''
            continue
        a, b = (ds < P2_START).any(), (ds >= P2_START).any()
        phase[name] = '전기간' if (a and b) else ('1차' if a else '2차')

    # ── 출력 ───────────────────────────────────────────────────────
    cols = ['u', 'date', 'hour', 'wd', 'cre', 'set', 'dv', 'os', 'ofam', 'city', 'lang',
            'arrive', 'anyclick', 'act', 'cta', 'res', 'msg', 'call', 'menu',
            'dead', 'rage', 'nav', 'tab', 'jump', 'langsw', 'priv', 'vmenu', 'dirs']
    out = {
        'dates': [str(x) for x in dates],
        'cats': cats,
        'crePhase': phase,
        'interest': [list(x) for x in INTEREST],
        'p2Start': P2_START,
        'sessCols': cols,
        'sess': [[int(x) for x in row] for row in sess[cols].to_numpy()],
        'ctaEv': ctaev,
        'menuEv': menuev,
        'nUsers': len(devs),
        'check': chk,
    }
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
    print(f'\nwrote {OUT}  ({os.path.getsize(OUT)/1024:.0f} KB)')

    # ── HTML 렌더 ──────────────────────────────────────────────────
    tpl = os.path.join(os.path.dirname(OUT), 'web_ops2.tpl.html')
    html_out = os.path.join(ROOT, 'docs', 'dashboard', 'web-ops-v2.html')
    with open(tpl, encoding='utf-8') as f:
        t = f.read()
    payload = json.dumps(out, ensure_ascii=False, separators=(',', ':'))
    with open(html_out, 'w', encoding='utf-8') as f:
        f.write(t.replace('/*__DATA__*/', payload))
    print(f'wrote {html_out}  ({os.path.getsize(html_out)/1024:.0f} KB)')
    print('sessions', len(sess), '| users', len(devs),
          '| ctaEv', len(ctaev), '| menuEv', len(menuev))
    return ok


if __name__ == '__main__':
    main()
