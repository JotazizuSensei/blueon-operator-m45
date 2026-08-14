(()=>{
'use strict';
const STORE='eurolab.v5';
const $=s=>document.querySelector(s);
const sort=a=>[...new Set(a.map(Number))].sort((x,y)=>x-y);
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
function wire(){
 $('#manualSave')?.addEventListener('click',saveManualResult);
 $('#manualGame')?.addEventListener('change',setManualHint);
 setManualHint();showKnownCompleteness();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
