# -*- coding: utf-8 -*-
"""웹 운영 대시보드 → 태블로용 CSV

web_ops_data.json(대시보드에 내장된 것과 동일한 데이터)을 태블로가 바로 읽을 수
있는 평평한 CSV로 펼친다. 컬럼명은 영어 표준어.

출력 (docs/dashboard/tableau/)
  sessions.csv            9,505행 — 1행 = 1세션. 모든 고유 사용자 지표의 원천
  cta_events.csv            133행 — 1행 = 1 CTA 클릭. 위치×유형 매트릭스용
  meta_daily.csv             53행 — 소재 × 일자. 노출·링크클릭·지출 (가산 가능)
  meta_unique_clicks.csv      7행 — 소재별 + 계정 합계. 기간 분할 불가

주의 — meta_daily는 세션과 (creative, date)로 **관계(relationship)** 를 맺어야 한다.
조인(join)하면 지출이 세션 수만큼 복제돼 유도당 비용이 수천 배로 부풀어 오른다.
"""
import csv
import json
import os

ROOT = r'C:\Users\user\Desktop\GMM\0709_claude_하남_웹페이지제작'
SRC = os.path.join(ROOT, 'docs', 'dashboard', '_build', 'web_ops_data.json')
OUT = os.path.join(ROOT, 'docs', 'dashboard', 'tableau')

WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
WD_KO = ['월', '화', '수', '목', '금', '토', '일']
P2_START = 9                      # date 인덱스 9 = 2026-07-29 (2차 시작)

CRE_LB = {
    'business_taste': '비즈니스 × 맛 (영상)',
    'family_taste': '가족 × 맛 (영상)',
    'family_bday_vid': '가족 × 생일 (영상)',
    'family_bday_img': '가족 × 생일 (이미지)',
    'business_space_vid': '비즈니스 × 공간 (영상)',
    'business_space_carousel': '비즈니스 × 공간 (캐러셀)',
    '(none)': '광고 외 직접 유입',
}
SET_LB = {'hanoi_2549_mf_business': 'business',
          'hanoi_2549_mf_family': 'family', '(none)': '광고 외'}


def write(name, header, rows):
    p = os.path.join(OUT, name)
    with open(p, 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)
    print(f'  {name:24s} {len(rows):>6,}행')


def main():
    os.makedirs(OUT, exist_ok=True)
    D = json.load(open(SRC, encoding='utf-8'))
    C, dates = D['cats'], D['dates']
    col = {c: i for i, c in enumerate(D['sessCols'])}

    def g(r, k):
        return r[col[k]]

    print('writing', OUT)

    # ── sessions ──────────────────────────────────────────────────
    rows = []
    for i, r in enumerate(D['sess']):
        di = g(r, 'date')
        rows.append([
            i, g(r, 'u'), dates[di], g(r, 'hour'),
            WD[g(r, 'wd')], WD_KO[g(r, 'wd')], g(r, 'wd') + 1,
            '2차' if di >= P2_START else '1차',
            C['cre'][g(r, 'cre')], CRE_LB.get(C['cre'][g(r, 'cre')], ''),
            SET_LB.get(C['set'][g(r, 'set')], C['set'][g(r, 'set')]),
            C['dv'][g(r, 'dv')], C['os'][g(r, 'os')],
            C['city'][g(r, 'city')], C['lang'][g(r, 'lang')],
            g(r, 'arrive'), g(r, 'anyclick'), g(r, 'act'), g(r, 'cta'),
            g(r, 'res'), g(r, 'msg'), g(r, 'call'), g(r, 'menu'),
            g(r, 'dead'), g(r, 'rage'),
        ])
    write('sessions.csv', [
        'session_key', 'user_id', 'date', 'hour',
        'weekday', 'weekday_ko', 'weekday_no', 'phase',
        'creative', 'creative_label', 'ad_set',
        'device', 'os', 'city', 'language',
        'is_arrival', 'is_anyclick', 'is_action', 'is_cta',
        'is_reserve', 'is_message', 'is_call', 'is_menu_view',
        'is_dead_click', 'is_rage_click',
    ], rows)

    # ── cta_events ────────────────────────────────────────────────
    RES = ('message_book', 'call_phone')
    rows = []
    for s, t, l in D['ctaEv']:
        sr = D['sess'][s]
        ct, cl = C['ctaType'][t], C['ctaLoc'][l]
        rows.append([s, g(sr, 'u'), dates[g(sr, 'date')], g(sr, 'hour'),
                     C['cre'][g(sr, 'cre')],
                     SET_LB.get(C['set'][g(sr, 'set')], C['set'][g(sr, 'set')]),
                     ct, cl, 1 if ct in RES else 0])
    write('cta_events.csv', ['session_key', 'user_id', 'date', 'hour',
                             'creative', 'ad_set', 'cta_type', 'cta_location',
                             'is_reserve_cta'], rows)

    # ── meta_daily ────────────────────────────────────────────────
    rows = [[dates[d], C['cre'][c], CRE_LB.get(C['cre'][c], ''),
             '2차' if d >= P2_START else '1차', imp, clk, sp]
            for c, d, imp, clk, sp in D['metaDaily']]
    rows.sort(key=lambda r: (r[0], r[1]))
    write('meta_daily.csv', ['date', 'creative', 'creative_label', 'phase',
                             'impressions', 'link_clicks', 'spend_vnd'], rows)

    # ── meta_unique_clicks ────────────────────────────────────────
    # 계정 합계(14,570)는 일부러 넣지 않는다. sessions에 짝이 없어 태블로에서
    # Null 행으로 뜨고, 총합계를 켜면 소재별 합(15,124)이 잡혀 도착률이 틀린다.
    # 전체 도착률의 분모는 매개 변수 p_고유클릭_전체 = 14570 으로 고정해 쓴다.
    mb = D['meta']['byCreative']
    rows = [[k, CRE_LB.get(k, ''), v['uclk']] for k, v in mb.items()]
    write('meta_unique_clicks.csv',
          ['creative', 'creative_label', 'unique_link_clicks'], rows)
    print(f"    (계정 합계 {D['meta']['total']['uclk']:,}는 매개 변수로 별도 관리 — 파일에 미포함)")

    print('\n주의 — meta_daily는 sessions와 (creative, date) 관계(relationship)로 연결할 것.')
    print('      조인하면 지출이 세션 수만큼 복제된다.')


if __name__ == '__main__':
    main()
