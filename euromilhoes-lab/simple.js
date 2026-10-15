/* EuroLab 6.1 — única interface visível. Sem alterar apostas nem histórico guardado. */
(()=>{'use strict';
const E=window.EuroRadarEngine,KEY='eurolab.radar.v6',GAME={eurodreams:'EuroDreams',euromillions:'Euromilhões'};
const el=id=>document.getElementById(id);
const localToday=()=>{const now=new Date(),p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Lisbon',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(now),get=k=>p.find(x=>x.type===k)?.value;let d=new Date(get('year')+'-'+get('month')+'-'+get('day')+'T12:00:00Z');if(Number(get('hour'))>=19)d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10);};
const prettyDate=s=>s?new Date(s+'T12:00:00Z').toLocaleDateString('pt-PT',{day:'2-digit',month:'long',year:'numeric',timeZone:'UTC'}):'—';
const currency=n=>new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const safe=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{}}catch{return {}}};
let current=null,lastDigest='';
function selectTab(name){el('simGenerate').hidden=name!=='gen';el('simRadar').hidden=name!=='rad';for(const [id,k] of [['simpleTabGen','gen'],['simpleTabRad','rad']]){let b=el(id);b.setAttribute('aria-selected',String(k===name));b.tabIndex=k===name?0:-1;}el('simpleTabs').dataset.active=name;if(name==='rad')renderRadar();}
function getRandomInt(max){if(!window.crypto?.getRandomValues)throw Error('É necessária uma ligação segura para gerar números.');const a=new Uint32Array(1),size=0x100000000,limit=Math.floor(size/max)*max;do{crypto.getRandomValues(a)}while(a[0]>=limit);return a[0]%max+1;}
function pick(max,count){const chosen=new Set();while(chosen.size<count)chosen.add(getRandomInt(max));return [...chosen].sort((a,b)=>a-b);}
function showBalls(holder,nums,sp,game){holder.replaceChildren();const ball=(n,type)=>{const x=document.createElement('span');x.className='simp-ball'+(type?' '+type:'');x.textContent=n;return x;};nums.forEach(n=>holder.append(ball(n)));const plus=document.createElement('span');plus.className='simp-plus';plus.textContent='+';holder.append(plus);sp.forEach(n=>holder.append(ball(n,game==='eurodreams'?'dream':'star')));}
function generate(){const game=el('simpleGame').value;if(!E?.G?.[game])return;const g=E.G[game];try{current={game,numbers:pick(g.max,g.n),special:pick(g.smax,g.s)};showBalls(el('simpleNumbers'),current.numbers,current.special,game);el('simpGenResult').hidden=false;el('simpGenLabel').textContent=GAME[game]+' · chave aleatória';el('simpGenHelp').textContent='Todas as combinações válidas têm a mesma probabilidade de sair.';el('simpCopy').textContent='Copiar chave';}catch(err){el('simpGenHelp').textContent=err.message;el('simpGenResult').hidden=false;}}
async function copyKey(){if(!current)return;const txt=GAME[current.game]+': '+current.numbers.join(' · ')+' + '+current.special.join(' · ');try{await navigator.clipboard.writeText(txt);el('simpCopy').textContent='Copiada ✓';}catch{const t=document.createElement('textarea');t.value=txt;document.body.append(t);t.select();try{document.execCommand('copy');el('simpCopy').textContent='Copiada ✓';}catch{el('simpCopy').textContent='Não foi possível copiar';}t.remove();}}
function verifiedJack(j,expectedDate){if(!j||!Number.isFinite(Number(j.amount))||Number(j.amount)<=0||!j.sourceUrl||!/^https:\/\//.test(j.sourceUrl)||!j.verifiedAt||j.drawDate!==expectedDate)return null;let age=Date.now()-Date.parse(j.verifiedAt);return age>=0&&age<96*3600000?Number(j.amount):null;}
function renderRadar(){if(!E)return;const R=safe(),today=localToday();const ed=E.nextDate('eurodreams',today),em=E.nextDate('euromillions',today),floor=Number(R.prefs?.jackpotFloor)||70;const jpEd=verifiedJack(R.jackpots?.eurodreams,ed),jpEm=verifiedJack(R.jackpots?.euromillions,em);el('simDateEd').textContent=prettyDate(ed);el('simDateEm').textContent=prettyDate(em);el('simPrizeEd').textContent=jpEd?currency(jpEd)+'/mês':'Prémio não verificado';el('simPrizeEm').textContent=jpEm?currency(jpEm):'Jackpot não verificado';el('simEmTag').textContent='A partir de '+floor+' M€';const active=R.last?.date===ed||R.last?.date===em?R.last:null;const score=active?.score;
const valid=Boolean(score?.gate&&score?.validated&&Number(score.total)>=70),s=el('simStatus'),headline=el('simHeadline'),subtitle=el('simExplanation'),show=el('simRadarNumbers');
s.classList.toggle('good',valid);headline.textContent=valid?'SINAL PARA REVISÃO':'NÃO JOGAR';subtitle.textContent=valid?'Critérios internos atingidos. É necessária verificação independente antes de apostar.':'Sem vantagem preditiva validada para justificar uma aposta.';show.hidden=!valid;
el('simScore').textContent=score&&Number.isFinite(score.total)?score.total.toFixed(1):'—';
el('simScoreGame').textContent=active?GAME[active.game]+' · '+prettyDate(active.date):'A aguardar análise do próximo sorteio';
el('simRadarExplain').textContent=active?'Índice interno, não a probabilidade de ganhar. '+(score?.validated?'Há validação interna registada.':'Sem validação estatística suficiente.'):'O motor verifica os dados disponíveis quando a aplicação está aberta.';
if(valid&&E.valid(active.game,active.line?.numbers,active.line?.special)){showBalls(el('simRadarBalls'),active.line.numbers,active.line.special,active.game);el('simRadarChoice').textContent=GAME[active.game]+' · '+prettyDate(active.date);}else show.hidden=true;
const jackpotHit=jpEm!==null&&jpEm>=floor*1e6;
el('simpNotice').textContent=jackpotHit?'Euromilhões acima do limiar de atenção. O valor do jackpot não aumenta as hipóteses de uma chave.':'EuroDreams prioritário · Euromilhões vigiado a partir de '+floor+' M€.';
const notif=typeof Notification!=='undefined'&&Notification.permission==='granted';el('simPermission').textContent=notif?'Alertas do navegador permitidos':'Ativar alertas';
el('simpRadarChecked').textContent=R.last?.updatedAt&&active?'Última análise: '+new Date(R.last.updatedAt).toLocaleString('pt-PT'):'A aguardar atualização';
}
async function runRadar(){let b=el('simRefresh'),legacy=el('radRun');if(!legacy){el('simpleMessage').textContent='Motor ainda a iniciar. Abre novamente a aplicação.';return;}b.disabled=true;b.textContent='A analisar…';el('simpleMessage').textContent='A avaliar o RADAR. Não é uma previsão garantida.';legacy.click();let attempts=0;const timer=setInterval(()=>{const x=safe(),now=x.last?.updatedAt?Date.parse(x.last.updatedAt):0;if(now>=Date.now()-75000||++attempts>45){clearInterval(timer);b.disabled=false;b.textContent='Atualizar RADAR';el('simpleMessage').textContent=attempts>45?'A análise não foi concluída.':'Análise atualizada.';renderRadar();}},1500);}
async function notifications(){if(typeof Notification==='undefined'){el('simpleMessage').textContent='Este navegador não suporta notificações.';return;}try{const permission=await Notification.requestPermission();el('simpleMessage').textContent=permission==='granted'?'Alertas permitidos enquanto a aplicação estiver ativa.':'Os alertas não foram autorizados.';renderRadar();}catch{el('simpleMessage').textContent='Não foi possível ativar alertas.';}}
function boot(){const root=document.createElement('div');root.id='eurolabSimple';root.innerHTML=`
<div class="simp-inner">
<header class="simp-head"><div class="simp-symbol" aria-hidden="true">€L</div><div><h1 class="simp-title">EuroLab</h1><div class="simp-sub">Simples. Duas funções. Sem distrações.</div></div></header>
<div id="simpleTabs" class="simp-segments" role="tablist" aria-label="Escolher função">
<button id="simpleTabGen" type="button" role="tab" aria-controls="simGenerate" aria-selected="true">Gerar chave</button>
<button id="simpleTabRad" type="button" role="tab" aria-controls="simRadar" aria-selected="false">SUPER RADAR</button></div>
<section id="simGenerate" class="simp-card" role="tabpanel" aria-labelledby="simpleTabGen">
<p class="simp-kicker">GERADOR</p><h2 class="simp-h2">A sua próxima chave.</h2>
<p class="simp-desc">Escolha o jogo e gere uma combinação válida em segundos.</p>
<label class="simp-label" for="simpleGame">Jogo</label>
<select id="simpleGame"><option value="eurodreams">EuroDreams — 6 números + Sonho</option><option value="euromillions">Euromilhões — 5 números + 2 estrelas</option></select>
<button id="simpGenerateBtn" class="simp-primary" type="button">Gerar chave</button>
<div id="simpGenResult" class="simp-result" aria-live="polite" hidden>
<div id="simpGenLabel" class="simp-label"></div><div id="simpleNumbers" class="simp-ballrow"></div>
<button id="simpCopy" class="simp-smallbutton" type="button">Copiar chave</button>
<p id="simpGenHelp" class="simp-footer"></p>
</div>
</section>
<section id="simRadar" class="simp-card" role="tabpanel" aria-labelledby="simpleTabRad" hidden>
<p class="simp-kicker">SUPER RADAR</p><h2 class="simp-h2">Só alertar quando interessa.</h2>
<p class="simp-desc">Análise em segundo plano. Sem gráficos, histórico ou listas de apostas.</p>
<div id="simStatus" class="simp-status" aria-live="polite"><strong id="simHeadline">NÃO JOGAR</strong><p id="simExplanation">Sem vantagem validada que justifique uma aposta.</p></div>
<div class="simp-score"><strong id="simScore">—</strong><span>/ 100 · índice interno</span></div><p id="simScoreGame" class="simp-desc" style="margin:-5px 0 13px">A aguardar análise</p>
<div class="simp-radarline"><div><div class="game">EuroDreams</div><div class="secondary" id="simDateEd">—</div></div><div class="right" id="simPrizeEd">Prémio não verificado</div></div>
<div class="simp-radarline"><div><div class="game">Euromilhões</div><div class="secondary" id="simDateEm">—</div></div><div class="right"><div id="simPrizeEm">Jackpot não verificado</div><div class="secondary" id="simEmTag">A partir de 70 M€</div></div></div>
<div id="simRadarNumbers" class="simp-result" hidden><div id="simRadarChoice" class="simp-label"></div><div id="simRadarBalls" class="simp-ballrow"></div></div>
<div class="simp-actions"><button class="simp-primary" id="simRefresh" type="button">Atualizar RADAR</button><button class="simp-smallbutton" id="simPermission" type="button">Ativar alertas</button></div>
<div id="simpleMessage" class="simp-toast" role="status"></div>
<p id="simpNotice" class="simp-footer"></p>
<p class="simp-footer" id="simRadarExplain">Índice interno, não a probabilidade de ganhar.</p>
<p id="simpRadarChecked" class="simp-footer"></p>
</section>
<p class="simp-footer" style="text-align:center;margin-top:25px">A geração de uma chave não aumenta a sua probabilidade de ser sorteada.<br>Alertas com a app fechada exigem um serviço push externo.</p>
</div>`;
document.body.prepend(root);
el('simpleTabGen').addEventListener('click',()=>selectTab('gen'));el('simpleTabRad').addEventListener('click',()=>selectTab('rad'));
el('simpGenerateBtn').addEventListener('click',generate);el('simpCopy').addEventListener('click',copyKey);el('simRefresh').addEventListener('click',runRadar);el('simPermission').addEventListener('click',notifications);
el('simpleGame').addEventListener('change',()=>{el('simpGenResult').hidden=true;current=null;});
selectTab('gen');renderRadar();
setInterval(()=>{if(document.visibilityState!=='visible')return;const x=localStorage.getItem(KEY)||'';if(x!==lastDigest){lastDigest=x;renderRadar();}},4500);
window.addEventListener('storage',e=>{if(e.key===KEY){lastDigest='';renderRadar();}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
