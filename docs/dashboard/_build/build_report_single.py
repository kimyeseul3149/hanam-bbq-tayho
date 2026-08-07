# -*- coding: utf-8 -*-
"""3개 대시보드를 파일 하나로 합친다 (카카오톡 첨부용).

report.html 은 iframe src 로 옆 파일을 불러오므로 파일 하나만 보내면 깨진다.
여기서는 세 페이지 원문을 **iframe srcdoc 속성 안에 통째로 심는다.**

  왜 srcdoc 인가
    세 페이지가 저마다 D · S · render · agg 같은 전역 이름을 쓴다. 한 문서에
    붙이면 서로 덮어써서 전부 깨진다. srcdoc 은 iframe 마다 독립된 브라우징
    컨텍스트를 만들어 주므로 원문을 한 글자도 안 고치고 그대로 격리된다.

  왜 <script type="text/plain"> 이 아닌가
    세 페이지 안에 </script> 가 들어 있어서 스크립트 블록이 거기서 끊긴다.

  속성 안에 넣을 때 이스케이프가 필요한 문자는 & 와 " 둘뿐이다.
  (< 는 속성값 안에서 그대로 둬도 파서가 태그로 읽지 않는다)
"""
import html
import os

ROOT = r'C:\Users\user\Desktop\GMM\0709_claude_하남_웹페이지제작'
DASH = os.path.join(ROOT, 'docs', 'dashboard')
SHELL = os.path.join(DASH, 'report.html')
OUT = os.path.join(DASH, 'report-all.html')

PAGES = [('p1', 'exec-v2.html'),
         ('p2', 'meta-ops-v4.html'),
         ('p3', 'web-ops-v2-1p.html')]


def main():
    with open(SHELL, encoding='utf-8') as f:
        shell = f.read()

    # 셸이 지연 로딩용으로 쓰는 data-src 를 srcdoc 원문으로 갈아끼운다.
    for pid, name in PAGES:
        with open(os.path.join(DASH, name), encoding='utf-8') as f:
            src = f.read()
        esc = src.replace('&', '&amp;').replace('"', '&quot;')
        old = f'data-src="{name}"'
        assert old in shell, f'셸에서 {old} 를 못 찾음'
        shell = shell.replace(old, f'srcdoc="{esc}"')
        print(f'  {name:22s} {len(src)/1024:>7.0f} KB → {len(esc)/1024:>7.0f} KB (이스케이프 후)')

    # srcdoc 은 이미 문서를 품고 있으므로 "처음 열 때 src 를 채운다"는 로직이
    # 필요 없다. 그 분기만 걷어낸다.
    shell = shell.replace('    if(on&&!f.src)f.src=f.dataset.src;\n', '')
    shell = shell.replace(
        '/* iframe은 처음 열 때만 로드한다. 3개를 한꺼번에 띄우면 모바일에서 느리다. */\n',
        '/* 세 페이지가 srcdoc 으로 이미 박혀 있다. 파일 하나로 끝난다. */\n')
    shell = shell.replace(
        '좁은 화면에서는 가로로 축소되어 표시됩니다. 확대해서 보세요.',
        '좁은 화면에서는 가로로 축소되어 표시됩니다. 확대해서 보세요. · 이 파일 하나로 동작합니다(인터넷 불필요)')

    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(shell)
    print(f'\nwrote {OUT}  ({os.path.getsize(OUT)/1024/1024:.2f} MB)')
    assert 'data-src=' not in shell, 'data-src 가 남아 있음'
    print('  data-src 잔여 없음 · srcdoc 3개 확인', shell.count('srcdoc="'))


if __name__ == '__main__':
    main()
