#!/usr/bin/env python3
"""Atualiza resultados públicos do Euro Lab a partir dos Jogos Santa Casa."""
from __future__ import annotations
import datetime as dt, html, json, re, sys, urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT=Path(__file__).resolve().parent
OUT_ALL=ROOT/'latest-results.json'
OUT_EM=ROOT/'latest-result.json'
OUT_ED=ROOT/'latest-eurodreams.json'
EM_URL='https://www.jogossantacasa.pt/web/ResultsBoard/euromilhoes'
ED_URL='https://www.jogossantacasa.pt/web/ResultsBoard/EuroDreams'
M1_URL='https://www.jogossantacasa.pt/web/SCCartazResult/m1lhao'
HEADERS={'User-Agent':'Mozilla/5.0 Chrome/150 Safari/537.36','Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8','Accept-Language':'pt-PT,pt;q=0.9','Cache-Control':'no-cache'}

class TextParser(HTMLParser):
    def __init__(self): super().__init__(); self.parts=[]
    def handle_data(self,data):
        data=data.strip()
        if data:self.parts.append(data)

def fetch(url:str)->str:
    req=urllib.request.Request(url,headers=HEADERS)
    with urllib.request.urlopen(req,timeout=30) as r:return r.read().decode('utf-8','replace')

def text(raw:str)->str:
    p=TextParser();p.feed(raw)
    return re.sub(r'\s+',' ',html.unescape(' '.join(p.parts))).strip()

def parse_loto(url:str,count:int,extra_count:int,max_n:int,max_e:int,label:str)->dict|None:
    try:t=text(fetch(url))
    except Exception as exc:
        print(f'AVISO_{label}_FETCH',repr(exc));return None
    head=r'Data do Sorteio\s*-\s*(\d{2})/(\d{2})/(\d{4}).{0,700}?Chave.{0,350}?Ordem de sa[ií]da.{0,350}?'
    nums=r'\s+'.join([r'(\d{1,2})']*count)
    extras=r'\s+'.join([r'(\d{1,2})']*extra_count)
    m=re.search(head+nums+r'\s*\+\s*'+extras,t,re.I)
    if not m:
        head2=r'Data do Sorteio\s*-\s*(\d{2})/(\d{2})/(\d{4}).{0,1400}?'
        m=re.search(head2+nums+r'\s*\+\s*'+extras,t,re.I)
    if not m:
        print(f'AVISO_{label}_PARSE',t[:650]);return None
    vals=[int(x) for x in m.groups()];day,month,year=vals[:3];numbers=sorted(vals[3:3+count]);ex=sorted(vals[3+count:3+count+extra_count])
    if len(set(numbers))!=count or not all(1<=n<=max_n for n in numbers) or len(set(ex))!=extra_count or not all(1<=n<=max_e for n in ex):
        print(f'AVISO_{label}_VALIDACAO',numbers,ex);return None
    return {'date':dt.date(year,month,day).isoformat(),'numbers':numbers,'extras':ex,'source':'Jogos Santa Casa — resultado oficial','sourceUrl':url,'official':True}

def parse_m1()->dict|None:
    try:t=text(fetch(M1_URL))
    except Exception as exc:
        print('AVISO_M1_FETCH',repr(exc));return None
    m=re.search(r'Data do Sorteio\s*-\s*(\d{2})/(\d{2})/(\d{4}).{0,900}?1\.?º Pr[eé]mio\s+([A-Z]{3}\s*\d{5})',t,re.I)
    if not m:return None
    day,month,year=map(int,m.groups()[:3]);code=re.sub(r'\s+','',m.group(4)).upper()
    return {'date':dt.date(year,month,day).isoformat(),'code':code,'source':'Jogos Santa Casa — resultado oficial','sourceUrl':M1_URL,'official':True}

def load(path:Path)->dict:
    try:return json.loads(path.read_text(encoding='utf-8'))
    except Exception:return {}

def keep_newer(new:dict|None,old:dict|None)->dict|None:
    if not new:return old or None
    if old and old.get('date','')>new.get('date',''):return old
    return new

def main()->int:
    old_all=load(OUT_ALL)
    old_em=old_all.get('em') or load(OUT_EM)
    old_ed=old_all.get('ed') or load(OUT_ED)
    if old_ed and 'dream' in old_ed and 'extras' not in old_ed:old_ed={**old_ed,'extras':[old_ed['dream']]}
    old_m1=old_all.get('m1')
    em=keep_newer(parse_loto(EM_URL,5,2,50,12,'EM'),old_em)
    ed=keep_newer(parse_loto(ED_URL,6,1,40,5,'ED'),old_ed)
    m1=keep_newer(parse_m1(),old_m1)
    if not em and not ed:
        print('FALHA: nenhuma fonte principal devolveu dados válidos.');return 2
    now=dt.datetime.now(dt.timezone.utc).isoformat()
    data={'em':em,'ed':ed,'m1':m1,'updatedAt':now}
    OUT_ALL.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    if em:
        legacy={**em,'stars':em.get('extras',[]),'m1':'','updatedAt':now};legacy.pop('extras',None)
        OUT_EM.write_text(json.dumps(legacy,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    if ed:
        legacy={**ed,'dream':(ed.get('extras') or [''])[0]};legacy.pop('extras',None)
        OUT_ED.write_text(json.dumps(legacy,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('OK', 'EM',em and em.get('date'), 'ED',ed and ed.get('date'), 'M1',m1 and m1.get('date'))
    return 0

if __name__=='__main__':sys.exit(main())
