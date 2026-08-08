# -*- coding: utf-8 -*-
import markdown, subprocess, os

SRC=r"C:\Users\user\Desktop\GMM\0709_claude_하남_웹페이지제작\docs\대시보드별_구성근거.md"
OUT=r"C:\Users\user\Desktop\GMM\0709_claude_하남_웹페이지제작\docs\pdf\하남BBQ_대시보드별_구성근거.pdf"
CHROME=r"C:/Users/user/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe"

md=open(SRC,encoding='utf-8').read()
htmlbody=markdown.markdown(md, extensions=['tables','fenced_code','sane_lists'])

CSS="""
@page{size:A4;margin:18mm 16mm;}
*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:'Malgun Gothic','Segoe UI',sans-serif;color:#1c1b2e;font-size:11.5pt;line-height:1.65;}
h1{font-size:20pt;font-weight:800;color:#2b2850;border-bottom:3px solid #4f46b8;padding-bottom:8px;margin:0 0 6px;}
h2{font-size:14pt;font-weight:800;color:#3b338f;margin:22px 0 8px;padding-left:9px;border-left:4px solid #4f46b8;}
p{margin:7px 0;}
strong{color:#3b338f;}
ul{margin:6px 0 6px 4px;padding-left:20px;}
li{margin:4px 0;}
hr{border:none;border-top:1px solid #e0dcf0;margin:16px 0;}
table{border-collapse:collapse;width:100%;margin:10px 0;font-size:10.5pt;}
th,td{border:1px solid #e6e6ee;padding:7px 9px;text-align:left;vertical-align:top;}
th{background:#f0eefb;color:#3b338f;font-weight:700;}
tr:nth-child(even) td{background:#faf9fe;}
blockquote{background:#f7f6fd;border:1px solid #e2ddf7;border-left:4px solid #4f46b8;border-radius:8px;margin:14px 0;padding:12px 16px;color:#3b338f;font-weight:600;}
code{background:#f2f1f8;padding:1px 5px;border-radius:4px;font-size:10pt;color:#4038a0;}
"""
html=f"<!doctype html><html lang='ko'><head><meta charset='utf-8'><style>{CSS}</style></head><body>{htmlbody}</body></html>"
hp=os.path.join(os.path.dirname(os.path.abspath(__file__)),'rationale2.html')
open(hp,'w',encoding='utf-8').write(html)

os.makedirs(os.path.dirname(OUT),exist_ok=True)
cmd=[CHROME,"--headless","--disable-gpu","--no-sandbox","--no-pdf-header-footer","--virtual-time-budget=3000",f"--print-to-pdf={OUT}","file:///"+hp.replace("\\","/")]
subprocess.run(cmd,check=True,capture_output=True)
print("SAVED",OUT,os.path.getsize(OUT),"bytes")
