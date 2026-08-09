# -*- coding: utf-8 -*-
"""docx 안에 박혀 있는 옛 퍼널 그림(word/media/image7.png)을 새 그림으로 갈아끼운다.

가로세로 비가 3.22:1 에서 2.32:1 로 바뀌므로 그림틀(wp:extent / a:ext)의 높이도
같이 고쳐야 한다. 폭은 문서 그대로 두어 본문 폭에 맞춘다.
"""
import re
import shutil
import zipfile
from PIL import Image

DOC = r'C:\Users\user\Desktop\GMM\0709_claude_하남_웹페이지제작\docs\하남 SA 전략(수정본).docx'
NEW = r'C:\Users\user\Desktop\GMM\0709_claude_하남_웹페이지제작\docs\s4-funnel.png'
TARGET = 'word/media/image7.png'

w, h = Image.open(NEW).size
png = open(NEW, 'rb').read()

zin = zipfile.ZipFile(DOC)
names = zin.namelist()
data = {n: zin.read(n) for n in names}
zin.close()

# 그림틀 크기 갱신 — rId13(=image7)을 참조하는 drawing 안의 cx/cy 만 건드린다
xml = data['word/document.xml'].decode('utf-8')
rels = dict(re.findall(r'Id="([^"]+)"[^>]*Target="([^"]+)"',
                       data['word/_rels/document.xml.rels'].decode('utf-8')))
rid = next(k for k, v in rels.items() if v.endswith('media/image7.png'))

i = xml.find('r:embed="%s"' % rid)
assert i > 0, 'rId 참조 못 찾음'
start = xml.rfind('<w:drawing>', 0, i)
end = xml.find('</w:drawing>', i) + len('</w:drawing>')
block = xml[start:end]

m = re.search(r'<wp:extent cx="(\d+)" cy="(\d+)"', block)
cx, cy_old = int(m.group(1)), int(m.group(2))
cy = round(cx * h / w)
new_block = block.replace('cx="%d" cy="%d"' % (cx, cy_old), 'cx="%d" cy="%d"' % (cx, cy))
n = block.count('cx="%d" cy="%d"' % (cx, cy_old))
xml = xml[:start] + new_block + xml[end:]
data['word/document.xml'] = xml.encode('utf-8')
data[TARGET] = png

zout = zipfile.ZipFile(DOC, 'w', zipfile.ZIP_DEFLATED)
for n_ in names:
    zout.writestr(n_, data[n_])
zout.close()

print('이미지 교체  %s  (%dx%d, %d KB)' % (TARGET, w, h, len(png) / 1024))
print('그림틀 높이  %d -> %d EMU  (%.1f x %.1f cm)  · %d곳 갱신'
      % (cy_old, cy, cx / 360000, cy / 360000, n))
