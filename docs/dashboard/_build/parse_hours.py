# -*- coding: utf-8 -*-
import csv, os

files=[r"C:\Users\user\Downloads\0720~0726.csv", r"C:\Users\user\Downloads\0727~0802.csv"]
hour_tot=[0]*24
n_cols=0
dates=set()
for fp in files:
    with open(fp,encoding='utf-8-sig') as f:
        rows=list(csv.reader(f))
    # find header row (starts with "Segment") and data row (starts with "All Users")
    hdr=None; data=None
    for r in rows:
        if r and r[0]=='Segment': hdr=r
        if r and r[0]=='All Users': data=r
    stamps=hdr[1:]
    vals=data[1:]
    for s,v in zip(stamps,vals):
        hh=int(s[11:13])           # "2026-07-20T14:00:00" -> 14
        dates.add(s[:10])
        hour_tot[hh]+=int(v)
        n_cols+=1

total=sum(hour_tot)
print("files parsed, hourly columns:",n_cols,"days:",len(dates))
print("grand total uniques(sum):",total)
print("\nhour : count : share")
for h in range(24):
    bar='█'*round(hour_tot[h]/max(hour_tot)*40)
    print(f"{h:02d}h : {hour_tot[h]:5d} : {hour_tot[h]/total*100:4.1f}%  {bar}")
peak=hour_tot.index(max(hour_tot))
print("\nPEAK hour:",peak,"with",max(hour_tot))
# top 5 hours
order=sorted(range(24),key=lambda h:-hour_tot[h])[:6]
print("top6 hours:",[(h,hour_tot[h]) for h in order])
# save for chart builder
import json
open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'hours.json'),'w').write(json.dumps(hour_tot))
