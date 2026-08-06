# -*- coding: utf-8 -*-
"""웹페이지 운영 대시보드 — 데이터 추출

00_원본(41,180 이벤트) → 세션 단위 columnar JSON.
고유 사용자 지표를 클라이언트에서 필터링 후 재집계할 수 있도록
세션마다 device_id 인덱스와 행동 플래그를 함께 싣는다.

검증 목표 (03_*/04_*/05_* 시트와 일치해야 함)
  방문자 8,084 · 세션 9,505 · 행동 150 · CTA 110 · 예약유도 90 · 무엇이라도 클릭 396
"""
import json
import os
import numpy as np
import pandas as pd

ROOT = r'C:\Users\user\Desktop\GMM\0709_claude_하남_웹페이지제작'
SRC = os.path.join(ROOT, 'docs', 'analytics', '하남BBQ_웹페이지분석데이터(7.20~8.2).xlsx')
# Meta 일별 실적 (지면 단위 원본 → 소재 × 일자로 집계)
META_SRC = r'C:\Users\user\Documents\카카오톡 받은 파일\메타 데이터 원본 자료.xlsx'
OUT = os.path.join(ROOT, 'docs', 'dashboard', '_build', 'web_ops_data.json')

ARRIVE = ['[Amplitude] Page Viewed', 'session_start']
RES = ['message_book', 'call_phone']
ACT = ['CTA Clicked', 'Menu Item Viewed', 'Navigation Clicked', 'Menu Tab Switched',
       'Language Switched', 'Menu Group Jumped', 'Menu Modal Closed']
CUSTOM8 = ACT + ['Privacy Policy Viewed']
AUTOCLICK = ['[Amplitude] Element Clicked', '[Amplitude] Dead Click', '[Amplitude] Rage Click']

# Meta 확정 실적 (03_Meta입력 + 고유 링크클릭)
META = {
    'business_taste':          dict(imp=199294, clk=10226, uclk=7955, spend=4149001),
    'family_taste':            dict(imp=141222, clk=4197,  uclk=3881, spend=2625589),
    'family_bday_vid':         dict(imp=65218,  clk=2707,  uclk=2620, spend=1497989),
    'business_space_vid':      dict(imp=5022,   clk=170,   uclk=168,  spend=98128),
    'family_bday_img':         dict(imp=37899,  clk=293,   uclk=273,  spend=232375),
    'business_space_carousel': dict(imp=11540,  clk=235,   uclk=227,  spend=213440),
}
META_TOTAL = dict(imp=460195, clk=17828, uclk=14570, spend=8816522)

# Meta 광고이름 → 소재 키 (웹 쪽 utm_content 매핑과 같은 이름을 쓴다)
AD2CRE = {
    'business_taste_message_vid_customlp': 'business_taste',
    'family_taste_message_vid_customlp': 'family_taste',
    'family_service_bday_vid_customlp': 'family_bday_vid',
    'family_service_bday_img_customlp': 'family_bday_img',
    'business_service_space_vid_customlp': 'business_space_vid',
    'business_service_space_carousel_customlp': 'business_space_carousel',
}


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
    # 세션의 대표 속성 = 그 세션 안에서 처음 관측된 '결측 아닌' 값.
    # groupby.first()가 NaN을 건너뛰므로, 결측 채우기는 이 뒤에 해야 한다.
    # (먼저 fillna하면 '(none)'이 유효값이 되어 utm이 있는 세션까지 광고 외로 샌다)
    d = d.sort_values('time_hanoi')
    first = d.groupby('session_id', sort=False).first()
    # 소재·광고세트는 '도착한 시점'의 값이어야 한다(원본 시트도 도착 이벤트로 귀속).
    # 도착 이벤트가 없는 세션은 전체 첫 값으로 보완.
    arr = d[d.event_type.isin(ARRIVE)].groupby('session_id').first()
    for c in ['creative', 'utm_term']:
        v = pd.Series(first.index.map(arr[c]), index=first.index)
        first[c] = v.fillna(first[c])
    for c in ['creative', 'utm_term', 'city', 'language', 'os_name', 'device']:
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
    sess['wd'] = pd.to_datetime(first.time_hanoi).dt.weekday   # 0=월
    sess['ts'] = pd.to_datetime(first.time_hanoi).astype('int64') // 10**9

    cre_c, cre_cats = codes(first.creative)
    set_c, set_cats = codes(first.utm_term)
    dv_c, dv_cats = codes(first.device)
    os_c, os_cats = codes(first.os_name)
    ci_c, ci_cats = codes(first.city)
    lg_c, lg_cats = codes(first.language)
    sess['cre'], sess['set'], sess['dv'] = cre_c, set_c, dv_c
    sess['os'], sess['city'], sess['lang'] = os_c, ci_c, lg_c

    # 사용자 인덱스
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

    # ── 검증 ───────────────────────────────────────────────────────
    def uniq(col):
        return sess.loc[sess[col] == 1, 'u'].nunique()

    chk = {
        '방문자': int(uniq('arrive')), '세션': int(len(sess)),
        '무엇이라도 클릭': int(uniq('anyclick')), '행동': int(uniq('act')),
        'CTA': int(uniq('cta')), '예약유도': int(uniq('res')),
        '메신저': int(uniq('msg')), '전화': int(uniq('call')),
    }
    want = {'방문자': 8084, '세션': 9505, '무엇이라도 클릭': 396, '행동': 150,
            'CTA': 110, '예약유도': 90, '메신저': 56, '전화': 38}
    print('\n── 검증 ──')
    ok = True
    for k, v in chk.items():
        mark = 'OK ' if v == want[k] else 'MISMATCH'
        if v != want[k]:
            ok = False
        print(f'  {mark} {k:16s} {v:>6,}  (기대 {want[k]:,})')

    # 소재별·세트별 방문자 (03_소재별성과 / 03_광고세트별 대조)
    def bycat(col, cats):
        g = sess[sess.arrive == 1].groupby(col).u.nunique()
        return {cats[k]: int(v) for k, v in g.items()}

    want_cre = {'business_taste': 4415, 'family_taste': 2028, 'family_bday_vid': 1442,
                'business_space_vid': 122, 'family_bday_img': 120,
                'business_space_carousel': 48, '(none)': 42}
    want_set = {'hanoi_2549_mf_business': 4585, 'hanoi_2549_mf_family': 3559}
    print('\n── 소재별 방문자 ──')
    got = bycat('cre', cre_cats)
    for k, v in want_cre.items():
        g = got.get(k, 0)
        print(f'  {"OK " if g == v else "DIFF"} {k:26s} {g:>6,}  (기대 {v:,})')
        ok &= g == v
    print('── 광고세트별 방문자 ──')
    gots = bycat('set', set_cats)
    for k, v in want_set.items():
        g = gots.get(k, 0)
        print(f'  {"OK " if g == v else "DIFF"} {k:26s} {g:>6,}  (기대 {v:,})')
        ok &= g == v

    # 소재별 집행 차수 — 7/29에 소재를 교체했다 (1차 7/20~28 · 2차 7/29~8/2)
    P2_START = 9   # date 인덱스: 0=7/20 … 9=7/29
    phase = {}
    for i, name in enumerate(cre_cats):
        ds = sess.loc[(sess.cre == i) & (sess.arrive == 1), 'date']
        if not len(ds):
            phase[name] = ''
            continue
        a, b = (ds < P2_START).any(), (ds >= P2_START).any()
        phase[name] = '전기간' if (a and b) else ('1차' if a else '2차')
    print('\n── 소재별 집행 차수 ──')
    for k, v in phase.items():
        print(f'  {k:26s} {v}')

    # ── Meta 일별 실적 ─────────────────────────────────────────────
    # 노출·링크클릭·지출은 가산적이라 일별로 받아두면 어떤 기간 필터에도 대응된다.
    # 고유 링크클릭만은 조회 기간마다 Meta가 따로 중복 제거하므로 일별로 못 쪼갠다
    # → 전체 기간 값(META)만 유지하고, 도착률은 전체 기간에서만 산출한다.
    md = pd.read_excel(META_SRC, sheet_name='원본_지면')
    md['일자'] = pd.to_datetime(md['일자'], errors='coerce')
    note_rows = md['일자'].isna().sum()
    md = md.dropna(subset=['일자'])
    md['date'] = md['일자'].dt.date.map(didx)
    md = md.dropna(subset=['date'])          # 기간 밖(8/3) 제외

    md['cre'] = md['광고이름'].map(AD2CRE)
    unknown = md[md.cre.isna()]['광고이름'].unique()
    if len(unknown):
        raise SystemExit(f'매핑되지 않은 광고이름: {list(unknown)}')
    g = (md.groupby(['cre', 'date'])[['노출', '링크클릭', '지출(VND)']]
           .sum().round(0).astype(int).reset_index()
           .rename(columns={'노출': 'imp', '링크클릭': 'clk', '지출(VND)': 'spend'}))
    creidx = {v: i for i, v in enumerate(cre_cats)}
    meta_daily = [[int(creidx[r.cre]), int(r.date), int(r.imp), int(r.clk), int(r.spend)]
                  for r in g.itertuples()]
    print(f'\n── Meta 일별 ── {len(meta_daily)}행 (주석 {note_rows}행 제외, 8/3 제외)')
    print(f'  합계  노출 {g.imp.sum():,} · 링크클릭 {g.clk.sum():,} · '
          f'지출 {g.spend.sum():,} VND')
    print(f'  참조  노출 {META_TOTAL["imp"]:,} · 링크클릭 {META_TOTAL["clk"]:,} · '
          f'지출 {META_TOTAL["spend"]:,} VND  (지면 분류 누락분만큼 소폭 작을 수 있음)')

    # ── 출력 ───────────────────────────────────────────────────────
    cols = ['u', 'date', 'hour', 'wd', 'cre', 'set', 'dv', 'os', 'city', 'lang',
            'arrive', 'anyclick', 'act', 'cta', 'res', 'msg', 'call', 'menu',
            'dead', 'rage']
    out = {
        'meta': {'total': META_TOTAL,
                 'byCreative': {k: v for k, v in META.items()}},
        'dates': [str(x) for x in dates],
        'cats': {'cre': cre_cats, 'set': set_cats, 'dv': dv_cats, 'os': os_cats,
                 'city': ci_cats, 'lang': lg_cats, 'ctaType': ct_cats,
                 'ctaLoc': cl_cats, 'menu': mi_cats},
        'crePhase': phase,
        'metaDaily': meta_daily,   # [creIdx, dateIdx, imp, clk, spend]
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
    tpl = os.path.join(os.path.dirname(OUT), 'web_ops.tpl.html')
    # 파일명은 ASCII로 — 카톡·메신저에서 한글 URL은 퍼센트 인코딩돼 깨지기 쉽다
    html_out = os.path.join(ROOT, 'docs', 'dashboard', 'web-ops.html')
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
