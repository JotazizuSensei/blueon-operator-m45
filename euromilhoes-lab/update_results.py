#!/usr/bin/env python3
"""Atualiza latest-result.json a partir dos Jogos Santa Casa (fonte oficial portuguesa)."""
from __future__ import annotations
import datetime as dt, html, json, re, sys, urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT=Path(__file__).resolve().parent
OUTPUT=ROOT/'latest-result.json'
EURO_URL='https://www.jogossantacasa.pt/web/ResultsBoard/euromilhoes'
M1_URL='https://www.jogossantacasa.pt/web/SCCartazResult/m1lhao'
HEADERS={
  'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/150 Safari/537.36',
  'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language':'pt-PT,pt;q=0.9,en;q=0.7',
  'Cache-Control':'no-cache',
}

class TextParser(HTMLParser):
    def __init__(self): super().__init__(); self.parts=[]
    def handle_data(self,data):
        data=data.strip()
        if data:self.parts.append(data)

def fetch(url:str)->str:
    req=urllib.request.Request(url,headers=HEADERS)
    with urllib.request.urlopen(req,timeout=30) as r:
        return r.read().decode('utf-8','replace')

def text(raw:str)->str:
    p=TextParser();p.feed(raw)
    return re.sub(r'\s+',' ',html.unescape(' '.join(p.parts))).strip()

def parse_euro()->dict|None:
    try:t=text(fetch(EURO_URL))
    except Exception as exc:
        print('ERRO_EURO_FETCH',repr(exc)); return None
    m=re.search(r'Data do Sorteio\s*-\s*(\d{2})/(\d{2})/(\d{4}).{0,500}?Chave.{0,250}?Ordem de sa[ií]da.{0,250}?(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})\s*\+\s*(\d{1,2})\s+(\d{1,2})',t,re.I)
    if not m:
        # Fallback mais simples: primeira combinação após a data
        m=re.search(r'Data do Sorteio\s*-\s*(\d{2})/(\d{2})/(\d{4}).{0,1200}?(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})\s*\+\s*(\d{1,2})\s+(\d{1,2})',t,re.I)
    if not m:
        print('ERRO_EURO_PARSE texto_inicio=',t[:900]); return None
    g=[int(x) for x in m.groups()]; day,month,year=g[:3]; numbers=sorted(g[3:8]); stars=sorted(g[8:10])
    if len(set(numbers))!=5 or not all(1<=n<=50 for n in numbers) or len(set(stars))!=2 or not all(1<=s<=12 for s in stars):
        print('ERRO_EURO_VALIDACAO',numbers,stars); return None
    return {'date':dt.date(year,month,day).isoformat(),'numbers':numbers,'stars':stars,'m1':'','source':'Jogos Santa Casa — resultado oficial','sourceUrl':EURO_URL,'official':True,'updatedAt':dt.datetime.now(dt.timezone.utc).isoformat()}

def parse_m1()->tuple[str,str]|None:
    try:t=text(fetch(M1_URL))
    except Exception as exc:
        print('AVISO_M1_FETCH',repr(exc)); return None
    m=re.search(r'Data do Sorteio\s*-\s*(\d{2})/(\d{2})/(\d{4}).{0,800}?1\.?º Pr[eé]mio\s+([A-Z]{3}\s*\d{5})',t,re.I)
    if not m:return None
    day,month,year=map(int,m.groups()[:3]); code=re.sub(r'\s+','',m.group(4)).upper()
    return dt.date(year,month,day).isoformat(),code

def load_current()->dict:
    try:return json.loads(OUTPUT.read_text(encoding='utf-8'))
    except Exception:return {}

def main()->int:
    old=load_current(); new=parse_euro()
    if not new:
        print('FALHA: não foi possível obter um resultado oficial válido.'); return 2
    m1=parse_m1()
    if m1 and m1[0]==new['date']:new['m1']=m1[1]
    elif old.get('date')==new['date'] and old.get('m1'):new['m1']=old['m1']
    if old.get('date') and old['date']>new['date']:
        print('FALHA: fonte devolveu resultado mais antigo.',new['date'],'<',old['date']); return 3
    keys=('date','numbers','stars','m1')
    if all(old.get(k)==new.get(k) for k in keys):
        print('OK_RESULTADO_JA_ATUAL',new['date'],new['numbers'],'+',new['stars'],'M1',new['m1'] or '-'); return 0
    OUTPUT.write_text(json.dumps(new,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('OK_RESULTADO_ATUALIZADO',new['date'],new['numbers'],'+',new['stars'],'M1',new['m1'] or '-'); return 0

if __name__=='__main__':sys.exit(main())
