# -*- coding: utf-8 -*-
"""웹 운영 대시보드 v2 — 1페이지 압축판 (태블로 `웹운영대시보드_2`와 같은 구성)

web_ops2_data.json 을 그대로 재사용하고 템플릿만 바꾼다. 데이터 추출은
build_web_ops2.py 가 담당하므로 이 스크립트는 렌더링만 한다.

v2 전체판(web-ops-v2.html)과의 차이 — 태블로가 1600x900 한 화면에 들어가야 해서
  뺀 것: CTA 위치×종류 매트릭스 · 표_일별 · 도시 · 각주 섹션
  바꾼 것: 색 규칙을 태블로에 맞춤(값이 클수록 진한 빨강, 퍼널 마지막 단계만 빨강,
          좌절 신호는 검정), 소재 표에서 '광고 외 직접 유입' 제외
"""
import json
import os

ROOT = r'C:\Users\user\Desktop\GMM\0709_claude_하남_웹페이지제작'
SRC = os.path.join(ROOT, 'docs', 'dashboard', '_build', 'web_ops2_data.json')
TPL = os.path.join(ROOT, 'docs', 'dashboard', '_build', 'web_ops2c.tpl.html')
OUT = os.path.join(ROOT, 'docs', 'dashboard', 'web-ops-v2-1p.html')


def main():
    with open(SRC, encoding='utf-8') as f:
        data = json.load(f)
    with open(TPL, encoding='utf-8') as f:
        tpl = f.read()
    payload = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(tpl.replace('/*__DATA__*/', payload))
    print(f'wrote {OUT}  ({os.path.getsize(OUT)/1024:.0f} KB)')
    print(f"  검증값 {data['check']}")


if __name__ == '__main__':
    main()
