#!/usr/bin/env python3
"""Atualiza latest-result.json com o último Euromilhões publicado por uma fonte oficial."""
from __future__ import annotations
import datetime as dt, html, json, re, sys, urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT=Path(__file__).resolve().parent
OUTPUT=ROOT/'latest-result.json'
SELAE='https://www.loteriasyapuestas.es/es/resultados'
HEADERS={'User-Agent':'Mozilla/5.0 (compatible; EuromilhoesLab/4.0)','Accept-Language':'es-ES,es;q=0.9,pt-PT;q=0.8','Cache-Control':'no-cache'}

class TextParser(HTMLParser):
    def __init__(self): super().__init__(); self.parts=[]
    def handle_data(self,data):
        data=data.strip()
        if data:self.parts.append(data)

def fetch(url:str)->str:
    req=urllib.request.Request(url,headers=HEADERS)
    with urllib.request.urlopen(req,timeout=30) as r:return r.read().decode('utf-8','replace')

def to_text(raw:str)->str:
    p=TextParser();p.feed(raw);return re.sub(r'\s+',' ',html.unescape(' '.join(p.parts)))

def parse_selae()->dict|None:
    try:text=to_text(fetch(SELAE))
    except Exception as exc:
        print('Falha SELAE:',exc);return None
    block=re.search(r'Euromillones\b.{0,250}?(\d{2})/(\d{2})/(\d{4}).{0,300}?Ver por orden de aparici[oó]n\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})',text,re.I)
    if not block:
        print('Não foi possível reconhecer o bloco Euromillones.');return None
    g=list(block.groups()); day,month,year=map(int,g[:3]); vals=list(map(int,g[3:])); numbers=sorted(vals[:5]); stars=sorted(vals[10:12])
    if len(set(numbers))!=5 or not all(1<=n<=50 for n in numbers) or len(set(stars))!=2 or not all(1<=s<=12 for s in stars):
        print('Resultado extraído inválido.',numbers,stars);return None
    return {'date':dt.date(year,month,day).isoformat(),'numbers':numbers,'stars':stars,'m1':'','source':'SELAE — resultado oficial europeu','sourceUrl':SELAE,'official':True,'updatedAt':dt.datetime.now(dt.timezone.utc).isoformat()}

def current()->dict:
    try:return json.loads(OUTPUT.read_text(encoding='utf-8'))
    except Exception:return {}

def main()->int:
    old=current(); new=parse_selae()
    if not new:return 0
    if old.get('date') and old['date']>new['date']:
        print('Fonte devolveu resultado mais antigo; mantido.');return 0
    if old.get('date')==new['date'] and old.get('numbers')==new['numbers'] and old.get('stars')==new['stars']:
        print('Resultado já atualizado:',new['date']);return 0
    if old.get('date')==new['date'] and old.get('m1'):new['m1']=old['m1']
    OUTPUT.write_text(json.dumps(new,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Atualizado:',new['date'],new['numbers'],'+',new['stars']);return 0

if __name__=='__main__':sys.exit(main())
