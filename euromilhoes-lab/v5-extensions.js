(()=>{
'use strict';
const STORE='eurolab.v5';
const $=s=>document.querySelector(s);
const sort=a=>[...new Set(a.map(Number))].sort((x,y)=>x-y);
const ED_LATEST={1:40,2:40,3:51,4:51,5:38,6:35,7:43,8:51,9:43,10:41,11:40,12:38,13:39,14:43,15:50,16:40,17:41,18:44,19:52,20:39,21:56,22:55,23:56,24:53,25:39,26:41,27:42,28:44,29:35,30:49,31:39,32:43,33:47,34:41,35:38,36:29,37:52,38:45,39:37,40:40};
function load(){try{return JSON.parse(localStorage.getItem(STORE)||'null')}catch{return null}}
function save(s){localStorage.setItem(STORE,JSON.stringify(s))}
function parseNumbers(text){return (text||'').match(/\d+/g)?.map(Number)||[]}
function setStatus(msg,ok=false){const el=$('#manualStatus');if(!el)return;el.textContent=msg;el.style.color=ok?'#7ff0b9':'#91a9bc'}
function saveManualResult(){
 const game=$('#manualGame')?.value,date=$('#manualDate')?.value,key=$('#manualKey')?.value.trim();
 if(!game||!date||!key){setStatus('Preenche jogo, data e resultado.');return}
 const s=load();if(!s){setStatus('Ainda não existem dados locais da app.');return}
 s.results=s.results||{em:[],ed:[],m1:[]};s.results[game]=s.results[game]||[];
 if(game==='m1'){
   const code=key.replace(/\s+/g,'').toUpperCase();
   if(!/^[A-Z]{3}\d{5}$/.test(code)){setStatus('Código M1lhão inválido. Ex.: ABC12345');return}
   const r={date,code,official:false,source:'Introdução manual'};
   const i=s.results.m1.findIndex(x=>x.date===date);i>=0?s.results.m1[i]=r:s.results.m1.push(r);
 }else{
   const parts=key.split('+'),nums=sort(parseNumbers(parts[0]||'')),extras=sort(parseNumbers(parts[1]||''));
   const needN=game==='ed'?6:5,needE=game==='ed'?1:2,maxN=game==='ed'?40:50,maxE=game==='ed'?5:12;
   if(nums.length!==needN||extras.length!==needE||nums.some(n=>n<1||n>maxN)||extras.some(n=>n<1||n>maxE)){
     setStatus(game==='ed'?'Formato: 6 números (1–40) + 1 Nº de Sonho (1–5).':'Formato: 5 números (1–50) + 2 estrelas (1–12).');return
   }
   const r={date,numbers:nums,extras,official:false,source:'Introdução manual'};
   const i=s.results[game].findIndex(x=>x.date===date);i>=0?s.results[game][i]=r:s.results[game].push(r);
 }
 save(s);setStatus('Resultado guardado. A atualizar a app…',true);setTimeout(()=>location.reload(),350)
}
function setManualHint(){
 const g=$('#manualGame')?.value;if(!g)return;
 const input=$('#manualKey');if(!input)return;
 input.placeholder=g==='ed'?'10 14 18 20 26 30 + 5':g==='m1'?'ABC12345':'3 11 17 46 48 + 1 2';
}
function showKnownCompleteness(){
 const s=load();if(!s)return;const box=$('#dataCompleteness');if(!box)return;
 const missing=(s.pendingCaptures||[]).length,active=(s.m1Codes||[]).filter(x=>x.status==='pending').length;
 box.innerHTML=`<div class="game-summary"><div><small>Apostas completas</small><b>${(s.tickets||[]).length}</b></div><div><small>Chaves por completar</small><b>${missing}</b></div><div><small>M1lhão ativos</small><b>${active}</b></div></div>`;
}
function renderLatestEuroDreamsStats(){
 if($('#analysisGame')?.value!=='ed'||!$('#freqGrid'))return;
 const max=Math.max(...Object.values(ED_LATEST));
 $('#freqGrid').innerHTML=Object.entries(ED_LATEST).map(([n,v])=>`<div class="freqcell"><i style="height:${v/max*100}%"></i><span>${n}</span><small>${v}x</small></div>`).join('');
 if($('#analysisNote'))$('#analysisNote').textContent='Frequências históricas atualizadas com os sorteios conhecidos até 13/08/2026. Servem para contexto, não para previsão.';
}
function wire(){
 $('#manualSave')?.addEventListener('click',saveManualResult);
 $('#manualGame')?.addEventListener('change',setManualHint);
 $('#analysisGame')?.addEventListener('change',()=>setTimeout(renderLatestEuroDreamsStats,0));
 if($('#manualDate')&&!$('#manualDate').value)$('#manualDate').value=new Date().toISOString().slice(0,10);
 if($('#version'))$('#version').textContent='5.1.0';
 const s=load();if(s){s.version='5.1.0';save(s)}
 setManualHint();showKnownCompleteness();setTimeout(renderLatestEuroDreamsStats,0);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
