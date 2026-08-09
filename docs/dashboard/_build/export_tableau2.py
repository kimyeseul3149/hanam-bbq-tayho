# -*- coding: utf-8 -*-
"""웹 운영 대시보드 v2 → 태블로용 CSV

기존 tableau/sessions.csv 를 **같은 컬럼 순서 그대로 두고 뒤에만 추가**해서 덮어쓴다.
이미 맺어둔 관계(relationship)와 계산된 필드가 그대로 살아 있어야 하므로
컬럼 이름과 순서를 바꾸지 않는 것이 중요하다.

추가되는 컬럼 (v2 콘텐츠 관심 신호용)
  os_family (iOS / Android / Windows / Mac OS X)
  is_nav  is_menu_tab  is_menu_group  is_view_menu  is_directions  is_lang_switch  is_privacy

meta_daily.csv / meta_unique_clicks.csv 는 건드리지 않는다.
v2 대시보드에서는 안 쓰지만 KPI_도착률·KPI_유도당비용 시트가 아직 참조하고 있다.
"""
import csv
import json
import os

ROOT = r'C:\Users\user\Desktop\GMM\0709_claude_하남_웹페이지제작'
SRC = os.path.join(ROOT, 'docs', 'dashboard', '_build', 'web_ops2_data.json')
OUT = os.path.join(ROOT, 'docs', 'dashboard', 'tableau')

WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
WD_KO = ['월', '화', '수', '목', '금', '토', '일']
P2_START = 9

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
    print(f'  {name:24s} {len(rows):>6,}행 · {len(header)}컬럼')


def main():
    os.makedirs(OUT, exist_ok=True)
    D = json.load(open(SRC, encoding='utf-8'))
    C, dates = D['cats'], D['dates']
    col = {c: i for i, c in enumerate(D['sessCols'])}

    def g(r, k):
        return r[col[k]]

    print('writing', OUT)

    rows = []
    for i, r in enumerate(D['sess']):
        di = g(r, 'date')
        cre = C['cre'][g(r, 'cre')]
        rows.append([
            i, g(r, 'u'), dates[di], g(r, 'hour'),
            WD[g(r, 'wd')], WD_KO[g(r, 'wd')], g(r, 'wd') + 1,
            '2차' if di >= P2_START else '1차',
            cre, CRE_LB.get(cre, ''),
            SET_LB.get(C['set'][g(r, 'set')], C['set'][g(r, 'set')]),
            C['dv'][g(r, 'dv')], C['os'][g(r, 'os')], C['ofam'][g(r, 'ofam')],
            C['city'][g(r, 'city')], C['lang'][g(r, 'lang')],
            g(r, 'arrive'), g(r, 'anyclick'), g(r, 'act'), g(r, 'cta'),
            g(r, 'res'), g(r, 'msg'), g(r, 'call'), g(r, 'menu'),
            g(r, 'dead'), g(r, 'rage'),
            # ── v2 신규 ──
            g(r, 'nav'), g(r, 'tab'), g(r, 'jump'),
            g(r, 'vmenu'), g(r, 'dirs'), g(r, 'langsw'), g(r, 'priv'),
            # 소재가 둘인 세션을 소재별로 복제한 행. 세션 수에서 제외한다.
            g(r, 'dup'),
        ])
    write('sessions.csv', [
        'session_key', 'user_id', 'date', 'hour',
        'weekday', 'weekday_ko', 'weekday_no', 'phase',
        'creative', 'creative_label', 'ad_set',
        'device', 'os', 'os_family', 'city', 'language',
        'is_arrival', 'is_anyclick', 'is_action', 'is_cta',
        'is_reserve', 'is_message', 'is_call', 'is_menu_view',
        'is_dead_click', 'is_rage_click',
        'is_nav', 'is_menu_tab', 'is_menu_group',
        'is_view_menu', 'is_directions', 'is_lang_switch', 'is_privacy', 'is_dup',
    ], rows)

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

    print('\nmeta_daily.csv / meta_unique_clicks.csv 는 그대로 둡니다 '
          '(KPI_도착률·KPI_유도당비용 시트가 아직 참조 중).')
    print('태블로에서 데이터 원본 → 새로 고침 후 추출을 다시 만들어야 신규 컬럼이 보입니다.')


if __name__ == '__main__':
    main()
