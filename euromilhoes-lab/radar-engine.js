/* EURO LAB SUPER RADAR 6 — análise local, sem promessa preditiva.
 * Modulo sem dependencias externas, testavel com Node/browser.
 * A analise e pontuacao NAO representam probabilidade de ganhar.
 */
(function(root){'use strict';
const G={eurodreams:{name:'EuroDreams',n:6,max:40,s:1,smax:5,days:[1,4],odds:19191900},euromillions:{name:'Euromilhões',n:5,max:50,s:2,smax:12,days:[2,5],odds:139838160}};
const uniq=a=>[...new Set(a.map(Number))].sort((x,y)=>x-y);
const allNum=a=>Array.isArray(a)&&a.every(x=>Number.isInteger(Number(x)));
const clamp=(x,min,max)=>Math.min(max,Math.max(min,x));
const sum=a=>a.reduce((s,n)=>s+n,0);
function key(l){return `${l.game}|${l.date||l.drawDate||''}|${l.numbers.join(',')}|${l.special.join(',')}`;}
function valid(game,numbers,special){let g=G[game];return Boolean(g&&allNum(numbers)&&allNum(special)&&numbers.length===g.n&&special.length===g.s&&uniq(numbers).length===g.n&&uniq(special).length===g.s&&numbers.every(x=>x>=1&&x<=g.max)&&special.every(x=>x>=1&&x<=g.smax));}
function parseOne(v,gameFallback){let game=String(v.game||gameFallback||'').toLowerCase().replace('euromilhoes','euromillions');game=game==='em'?'euromillions':game==='ed'?'eurodreams':game;let date=String(v.date||v.drawDate||'').slice(0,10);let numbers=Array.isArray(v.numbers)?v.numbers:typeof v.numbers==='string'?v.numbers.split(/[\s,;|]+/).filter(Boolean):[];let special=Array.isArray(v.special)?v.special:(Array.isArray(v.extras)?v.extras:(v.stars? v.stars : v.dream?[v.dream]:[]));if(typeof special==='string')special=special.split(/[\s,;|]+/).filter(Boolean);numbers=numbers.map(Number);special=special.map(Number);if(!/^\d{4}-\d\d-\d\d$/.test(date)||!valid(game,numbers,special))return null;return {game,date,numbers:uniq(numbers),special:uniq(special),official:Boolean(v.official),source:v.source||'',jackpot:Number(v.jackpot)||null};}
function cleanHistory(arr){let dict=new Map();for(let v of Array.isArray(arr)?arr:[]){let x=parseOne(v);if(x)dict.set(x.game+'|'+x.date,x)}return [...dict.values()].sort((a,b)=>a.date.localeCompare(b.date));}
function merge(a,b){return cleanHistory([...(a||[]),...(b||[])]);}
function freq(hist,game,window=Infinity){let g=G[game],h=hist.filter(x=>x.game===game).slice(-window),f=Array(g.max+1).fill(0),last=Array(g.max+1).fill(-1);h.forEach((draw,i)=>draw.numbers.forEach(n=>{f[n]++;last[n]=i}));return {counts:f,absences:last.map(x=>x<0?h.length:h.length-1-x),draws:h.length};}
function rankPred(hist,game,mode){let g=G[game],d=mode==='long'?freq(hist,game,100):mode==='short'?freq(hist,game,20):freq(hist,game,50);let arr=Array.from({length:g.max},(_,i)=>i+1);return arr.sort((a,b)=>mode==='absence'?(d.absences[b]-d.absences[a]||a-b):(d.counts[b]-d.counts[a]||a-b)).slice(0,g.n);}
function evalFold(hist,game,start,end,mode){let g=G[game],hits=0,expected=0,sqs=0,observed=0;for(let i=start;i<end;i++){let past=hist.slice(0,i),pick=rankPred(past,game,mode),draw=hist[i];let hit=pick.filter(n=>draw.numbers.includes(n)).length;hits+=hit;expected+=g.n*g.n/g.max;sqs+=g.n*(g.n/g.max)*(1-g.n/g.max)*(g.max-g.n)/(g.max-1);observed++;}return {trials:observed,hits,expected,z:sqs>0?(hits-expected)/Math.sqrt(sqs):0};}
function walkForward(history,game){let hist=history.filter(x=>x.game===game).sort((a,b)=>a.date.localeCompare(b.date)),count=hist.length;let minTrain=100;if(count<minTrain+80)return {ready:false,draws:count,minRequired:minTrain+80,validated:false,method:'Nenhum',folds:[],note:'Histórico insuficiente para validação fora da amostra.'};let start=Math.max(minTrain, count-180),mid=start+Math.floor((count-start)/2),modes=['long','short','absence'];let tests=modes.map(mode=>{let left=evalFold(hist,game,start,mid,mode),right=evalFold(hist,game,mid,count,mode);let combined=evalFold(hist,game,start,count,mode);return {mode,left,right,combined};});let best=tests.slice().sort((a,b)=>b.combined.z-a.combined.z)[0];/* Threshold intencionalmente conservador: ~bonferroni 3 modelos e duas metades. */let replicated=best.left.z>2.3&&best.right.z>2.3&&best.combined.z>3.7;
return {ready:true,draws:count,minRequired:minTrain+80,validated:replicated,method:best.mode,folds:tests,scoreZ:best.combined.z,splitZ:[best.left.z,best.right.z],note:replicated?'Sinal exploratório replicado nas duas metades; requer avaliação independente adicional.':'Nenhum dos modelos pré-definidos apresentou replicação temporal convincente.'};}
function nextDate(game,today){let g=G[game],base=String(today).slice(0,10),d=new Date(base+'T12:00:00Z');for(let i=0;i<9;i++){let x=new Date(d);x.setUTCDate(x.getUTCDate()+i);if(g.days.includes(x.getUTCDay()))return x.toISOString().slice(0,10)}return null;}
function simpleNum(date){return String(date||'').replace(/\D/g,'').split('').reduce((s,x)=>s+Number(x),0)%9||9;}
function symbolic(line,date){let n=line.numbers,s=line.special,hit=[8,29,5,11,7,1].filter(x=>n.includes(x)).length,personal=clamp(hit*1.6,0,8),dream=n.includes(simpleNum(date))?3:0,star=s.includes(5)?2:0,friday=new Date(date+'T12:00:00Z').getUTCDay()===5?1.2:0;
return clamp(personal+dream+star+friday,0,20);}
function uniqueness(line){let n=line.numbers,g=G[line.game],high=n.filter(x=>x>31).length,adj=n.filter((x,i)=>i&&x===n[i-1]+1).length,m5=n.filter(x=>x%5===0).length,ones=n.map(x=>x%10),low=n.filter(x=>x<=12).length;let score=6+high*1.7-(low>=3?2:0)-(m5>2?2.5:0)-(adj>2?2.5:0)-(new Set(ones).size<g.n-1?2:0)-(n.every((x,i)=>i===0||x-n[i-1]===n[1]-n[0])?4:0);return clamp(score,0,15);}
function structure(line){let n=line.numbers,g=G[line.game],odds=n.filter(x=>x%2).length,lows=n.filter(x=>x<=g.max/2).length,score=0;if(Math.abs(odds-n.length/2)<=1)score+=1.0;if(Math.abs(lows-n.length/2)<=1)score+=1.0;if(n.at(-1)-n[0]>g.max*.6)score+=.8;return score;}
function empParts(backtest,line,history){let good=backtest.validated===true, n=history.filter(x=>x.game===line.game).length;return {
 'Robustez / walk-forward':good?clamp(13+Math.max(0,backtest.scoreZ-3.7)*2,0,20):0,
 'Janelas temporais':good&&n>=250?6:0,
 'Won vs Roll / prémios':0, /* só pontuar quando associação prospectiva provada */
 'Pares, trios e transições':0,
 'Estrutura matemática':structure(line),
 'Frequência / ausência':good?3:0,
 'Contexto operacional':0
 };}
function score(line,date,backtest,history){let parts=empParts(backtest,line,history),emp=sum(Object.values(parts)),sym=symbolic(line,date),uni=uniqueness(line);let stable=backtest.validated?0.87:0.75,raw=emp+sym+uni,total=Math.floor(raw*stable*10)/10;return {emp:Math.round(emp*10)/10,sym:Math.round(sym*10)/10,uni:Math.round(uni*10)/10,parts,stable,raw:Math.round(raw*10)/10,total,validated:backtest.validated===true,gate:total>=70&&backtest.validated===true};}
function rand(max){let a=new Uint32Array(1);if(typeof crypto!=='undefined'&&crypto.getRandomValues){crypto.getRandomValues(a);return a[0]%max+1;}return Math.floor(Math.random()*max)+1;}
function sample(game){let g=G[game],n=new Set(),s=new Set();while(n.size<g.n)n.add(rand(g.max));while(s.size<g.s)s.add(rand(g.smax));return {game,numbers:uniq([...n]),special:uniq([...s])};}
function grade(line,date,backtest,history){return score(line,date,backtest,history);}
function optimize(game,date,history,iterations=30000,controls=1500){iterations=clamp(Math.floor(iterations),1000,100000);controls=clamp(Math.floor(controls),1000,10000);let backtest=walkForward(history,game),best=null,bestScore=-Infinity,candidates=new Set();for(let i=0;i<iterations;i++){let l=sample(game),s=score(l,date,backtest,history);if(s.total>bestScore){best=l;bestScore=s.total;}if(i<5000)candidates.add(l.numbers.join(',')+'|'+l.special.join(','));}
/* Procura local, só substitui quando realmente sobe pontuação, sem mudar a robustez */
let g=G[game];for(let sweep=0;sweep<2;sweep++){let updated=false;for(let pos=0;pos<g.n+g.s;pos++){let max=pos<g.n?g.max:g.smax;for(let candidate=1;candidate<=max;candidate++){let l={game,numbers:[...best.numbers],special:[...best.special]},arr=pos<g.n?l.numbers:l.special,idx=pos<g.n?pos:pos-g.n;arr[idx]=candidate;if(!valid(game,l.numbers,l.special))continue;l.numbers=uniq(l.numbers);l.special=uniq(l.special);let s=score(l,date,backtest,history);if(s.total>bestScore){best=l;bestScore=s.total;updated=true;}}}if(!updated)break;}
let final=score(best,date,backtest,history),below=0,equal=0;for(let i=0;i<controls;i++){let s=score(sample(game),date,backtest,history);if(s.total<final.total)below++;else if(s.total===final.total)equal++;}
return {game,date,line:best,score:final,backtest,iterations,controls,percentile:Math.floor((below+equal*.5)/controls*1000)/10,sourceDraws:history.filter(x=>x.game===game&&x.date<date).length,uniquePrelim:candidates.size};}
root.EuroRadarEngine={G,valid,parseOne,cleanHistory,merge,freq,walkForward,nextDate,symbolic,uniqueness,score,optimize,sample};
})(typeof window!=='undefined'?window:globalThis);