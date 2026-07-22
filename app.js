const PROFILE={name:'João Pereira',age:44,height:1.73,targetWeight:80,currentWeight:74.3,bodyFat:11.3,vo2:32.23,location:'Leiria',goal:'80 kg seco, atlético, musculado e preparado para HYROX M45',trainingWindow:'06:00–07:15',weekdays:'2ª a 6ª',sleepTarget:'7h30+',nutrition:'bulk limpo com cintura controlada',supplements:['Whey','Creatina 3–5 g','Ómega-3 1–2 g EPA+DHA','ZMB6','Ashwagandha','Rhodiola'],telegramSchedule:['05:35 Pré-treino','07:30 Pequeno-almoço','10:30 Snack','12:00 Água','14:00 Creatina + Ómega-3','15:30 Snack','18:00 Água','20:30 ZMB6','21:45 Ceia + preparação']};
const workouts=[
{d:'Segunda',t:'Lower Strength + Engine',f:'Força inferior, core e motor aeróbio.',ex:['Front Squat · 4×4–6 · RIR 1–2','Romanian Deadlift · 3×6–8','Split Squat · 3×8/8','Core anti-extensão · 3 séries','SkiErg Z2 · 10–15 min']},
{d:'Terça',t:'Upper Strength + Grip',f:'Força superior, hipertrofia, grip e controlo escapular.',ex:['Incline DB/Cable Press · 4×6–8','Chest Supported Row · 4×6–8','Lat Pulldown · 3×8–10','Landmine Press · 3×8/8','Farmer Carry · 4×30–40 m']},
{d:'Quarta',t:'Engine + Mobility',f:'Corrida, limiar, mobilidade e core.',ex:['Aquecimento corrida · 8 min','Intervalos controlados · 6×3 min','Row/Ski alternado · 4×3 min','Core e mobilidade · 12 min']},
{d:'Quinta',t:'Full Body Power',f:'Potência, força resistente e padrões funcionais.',ex:['Trap Bar Deadlift · 4×4–6','DB Power Clean · 4×5','Half-kneeling Landmine Press · 3×8/8','KB Swing · 4×12','Carry ou sled substitute · 4 séries']},
{d:'Sexta',t:'BLUE Hybrid WOD',f:'Sessão híbrida progressiva e específica.',ex:['Run · 600–1000 m','SkiErg/Row · 500–1000 m','Thruster ou Wall Ball pattern','Farmer Carry','Burpee variation','Core finisher']},
{d:'Sábado',t:'Recuperação',f:'Sem treino obrigatório.',ex:['Caminhada opcional','Mobilidade 10–15 min','Sono e hidratação']},
{d:'Domingo',t:'Recuperação',f:'Descanso e preparação.',ex:['Descanso','Planeamento semanal','Preparar refeições e equipamento']}
];
const phases=[
{n:'Fundação estrutural',w:'1–8',goal:'Força base, hipertrofia funcional, mobilidade e base aeróbia.'},
{n:'Desenvolvimento híbrido',w:'9–16',goal:'Força, potência, limiar e trabalho misto progressivo.'},
{n:'Capacidade e potência',w:'17–24',goal:'Força resistente, VO₂ e manutenção de massa muscular.'},
{n:'Integração específica',w:'25–34',goal:'Aplicação de força e motor em sessões híbridas.'},
{n:'Performance competitiva',w:'35–44',goal:'Pacing, eficiência e resistência específica.'},
{n:'Peak e taper',w:'45–52',goal:'Consolidar performance e reduzir fadiga.'}
];
const defaults={version:4,onboarded:false,week:1,raceDate:'',sessions:[],recovery:[],assessments:[{date:'01/08/2025',weight:74.3,fat:11.3,waist:'',vo2:32.23}],nutrition:[],water:0,supplements:{},completed:{}};
let S=Object.assign({},defaults,JSON.parse(localStorage.getItem('blueonM45v3')||'{}'));
const save=()=>localStorage.setItem('blueonM45v3',JSON.stringify(S));
const todayIndex=()=>{const d=new Date().getDay();return d===0?6:d-1};
const phaseIndex=w=>w<=8?0:w<=16?1:w<=24?2:w<=34?3:w<=44?4:5;
const today=()=>new Date().toLocaleDateString('pt-PT');
function readiness(){if(!S.recovery.length)return null;const x=S.recovery.at(-1);return Math.round((x.sleep+x.energy+(11-x.soreness)+(11-x.stress))/40*100)}
function go(id){document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===id));document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));window.scrollTo({top:0,behavior:'smooth'})}
function render(){const wi=todayIndex(),wo=workouts[wi],p=phases[phaseIndex(S.week)],r=readiness();
profileName.textContent=PROFILE.name;profileInitials.textContent='JP';hello.textContent=`Bom dia, João.`;goalText.textContent='O teu briefing diário de performance.';phaseTag.textContent=p.n;weekTag.textContent=`Semana ${S.week}/52`;nextWorkout.textContent=wo.t;nextWorkoutMeta.textContent=`${wo.d} · ${wo.f}`;readyScore.textContent=r===null?'—':`${r}%`;readyBar.style.width=`${r||0}%`;readyAdvice.textContent=r===null?'Faz o check-in para ativar a análise diária.':r>=80?'Condição favorável para executar o plano.':r>=65?'Mantém o plano com controlo de volume e RIR.':'Reduz volume acessório e protege a recuperação.';
currentWeight.textContent=`${latestAssessment().weight} kg`;targetWeight.textContent=`${PROFILE.targetWeight} kg`;bodyFat.textContent=`${latestAssessment().fat||'—'}%`;vo2Metric.textContent=`${latestAssessment().vo2||'—'}`;
weekView.innerHTML=workouts.map((x,i)=>`<div class="day ${i===wi?'today':''}"><strong>${x.d.slice(0,3)}</strong><small>${x.t}</small></div>`).join('');
sessionTitle.textContent=wo.t;sessionFocus.textContent=wo.f;exerciseList.innerHTML=wo.ex.map((x,i)=>`<div class="item"><label class="check"><input type="checkbox" ${S.completed[`${today()}-${i}`]?'checked':''} data-ex="${i}"><span>${x}</span></label></div>`).join('');
renderHistory();renderRecovery();renderAssessments();renderNutrition();renderProfile();renderPhases();renderTodayPlan();weekInput.value=S.week;raceDate.value=S.raceDate||'';
}
function latestAssessment(){return S.assessments.at(-1)||defaults.assessments[0]}
function renderTodayPlan(){todayPlan.innerHTML=PROFILE.telegramSchedule.map(x=>`<div class="item"><span>${x}</span></div>`).join('')}
function renderHistory(){historyList.innerHTML=S.sessions.length?S.sessions.slice(-8).reverse().map(x=>`<div class="item"><div class="split"><strong>${x.title}</strong><span class="tag">RPE ${x.rpe}</span></div><small class="muted">${x.date} · ${x.minutes} min</small><p>${x.notes||'Sem notas.'}</p></div>`).join(''):'<p class="muted">Ainda não existem sessões registadas.</p>'}
function renderRecovery(){const r=readiness();recoveryHeadline.textContent=r===null?'Sem registo':r>=80?'Estado favorável':r>=65?'Estado moderado':'Fadiga elevada';recoveryText.textContent=r===null?'Regista sono, energia, dor e stress.':r>=80?'Mantém o plano previsto e respeita RIR/RPE.':r>=65?'Mantém os exercícios principais e controla o volume.':'Reduz acessórios e intensidade metabólica.';recoveryHistory.innerHTML=S.recovery.slice(-7).reverse().map(x=>`<div class="item"><strong>${x.date}</strong> · Sono ${x.sleep}/10 · Energia ${x.energy}/10 · Dor ${x.soreness}/10 · Stress ${x.stress}/10</div>`).join('')}
function renderAssessments(){assessmentList.innerHTML=S.assessments.slice().reverse().map(x=>`<div class="item"><div class="split"><strong>${x.date}</strong><span class="tag">${x.weight} kg</span></div><small class="muted">Gordura ${x.fat||'—'}% · Cintura ${x.waist||'—'} cm · VO₂ ${x.vo2||'—'}</small></div>`).join('')}
function renderNutrition(){waterMetric.textContent=`${S.water.toFixed(1)} L`;waterBar.style.width=`${Math.min(100,S.water/2.5*100)}%`;supplementList.innerHTML=PROFILE.supplements.map(x=>`<label class="item check"><input type="checkbox" data-supp="${x}" ${S.supplements[`${today()}-${x}`]?'checked':''}><span>${x}</span></label>`).join('');nutritionHistory.innerHTML=S.nutrition.slice(-8).reverse().map(x=>`<div class="item"><strong>${x.time}</strong> · ${x.meal}<div class="muted">${x.notes||''}</div></div>`).join('')||'<p class="muted">Ainda não existem refeições registadas.</p>'}
function renderProfile(){profileDetails.innerHTML=`<div class="kpis"><div class="kpi"><span class="muted">Idade</span><strong>${PROFILE.age}</strong></div><div class="kpi"><span class="muted">Altura</span><strong>${PROFILE.height} m</strong></div><div class="kpi"><span class="muted">Treino</span><strong>${PROFILE.trainingWindow}</strong></div><div class="kpi"><span class="muted">Meta</span><strong>${PROFILE.targetWeight} kg</strong></div></div><div class="notice"><strong>Objetivo principal</strong><p>${PROFILE.goal}</p></div><div class="notice"><strong>Estratégia</strong><p>${PROFILE.nutrition}; treino de 2ª a 6ª; sem treinos obrigatórios ao fim de semana; evolução progressiva para HYROX M45.</p></div>`}
function renderPhases(){phaseList.innerHTML=phases.map((p,i)=>`<div class="item"><div class="split"><div><strong>${i+1}. ${p.n}</strong><div class="muted">Semanas ${p.w}</div></div>${phaseIndex(S.week)===i?'<span class="tag">ATIVO</span>':''}</div><p>${p.goal}</p></div>`).join('')}
nav.onclick=e=>{if(e.target.dataset.page)go(e.target.dataset.page)};document.body.onclick=e=>{if(e.target.dataset.go)go(e.target.dataset.go)};
exerciseList.onchange=e=>{if(e.target.dataset.ex!==undefined){S.completed[`${today()}-${e.target.dataset.ex}`]=e.target.checked;save()}};
supplementList.onchange=e=>{if(e.target.dataset.supp){S.supplements[`${today()}-${e.target.dataset.supp}`]=e.target.checked;save()}};
saveRecovery.onclick=()=>{S.recovery.push({date:today(),sleep:+sleep.value,energy:+energy.value,soreness:+soreness.value,stress:+stress.value});save();render();alert('Check-in guardado.')};
function saveSession(done=false){S.sessions.push({date:today(),title:workouts[todayIndex()].t,rpe:+sessionRpe.value,minutes:+sessionMinutes.value,notes:sessionNotes.value,done});save();sessionNotes.value='';render();alert(done?'Sessão concluída.':'Registo guardado.')}saveSessionBtn.onclick=()=>saveSession(false);completeSession.onclick=()=>saveSession(true);
saveAssessment.onclick=()=>{S.assessments.push({date:today(),weight:+weight.value,fat:+fat.value,waist:waist.value,vo2:+vo2.value});save();render();alert('Avaliação guardada.')};
addWater.onclick=()=>{S.water=Math.min(5,+(S.water+.25).toFixed(2));save();render()};resetWater.onclick=()=>{S.water=0;save();render()};
addMeal.onclick=()=>{if(!mealName.value.trim())return alert('Indica a refeição.');S.nutrition.push({date:today(),time:new Date().toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'}),meal:mealName.value.trim(),notes:mealNotes.value.trim()});mealName.value='';mealNotes.value='';save();render()};
saveConfig.onclick=()=>{S.week=Math.max(1,Math.min(52,+weekInput.value||1));S.raceDate=raceDate.value;save();render();alert('Configuração guardada.')};
exportData.onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({profile:PROFILE,state:S},null,2)],{type:'application/json'}));a.download='blueon-joao-backup.json';a.click()};
importData.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);S=j.state||j;save();render();alert('Backup importado.')}catch{alert('Ficheiro inválido.')}};r.readAsText(f)};
resetData.onclick=()=>{if(confirm('Apagar os dados e repor o perfil inicial?')){S=structuredClone(defaults);save();location.reload()}};
startApp.onclick=()=>{S.onboarded=true;save();onboarding.classList.remove('show')};
if(!S.onboarded)onboarding.classList.add('show');
let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;installBtn.hidden=false});installBtn.onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.hidden=true}};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');

function installBlueAI(){
 const logo=document.querySelector('.logo');if(logo){logo.innerHTML='<img src="assets/blue-on-m45-logo.svg" alt="BLUE ON M45" style="width:100%;height:100%;object-fit:contain;border-radius:50%">'}
 const dock=document.createElement('div');dock.className='ai-dock';dock.innerHTML='<div class="ai-core" aria-hidden="true"></div><input id="blueAiInput" aria-label="Pedir à BLUE AI" placeholder="Pede à BLUE AI: abre o treino, mostra recuperação, tenho 35 minutos…"><button id="blueAiSend">Executar</button>';
 const response=document.createElement('div');response.className='ai-response';response.id='blueAiResponse';document.body.append(response,dock);
 const input=dock.querySelector('input'),send=dock.querySelector('button');
 const show=(html)=>{response.innerHTML=html;response.classList.add('show');clearTimeout(show.t);show.t=setTimeout(()=>response.classList.remove('show'),7000)};
 function run(){const raw=input.value.trim();if(!raw)return;const q=raw.toLowerCase();let page=null,msg='';
  if(q.includes('dashboard')||q.includes('hoje')||q.includes('resumo')){page='dashboard';msg='<strong>Dashboard aberto.</strong><br><span class="muted">Aqui tens o briefing diário, readiness, treino e estado físico.</span>'}
  else if(q.includes('treino')||q.includes('sessão')){page='treino';msg='<strong>Treino aberto.</strong><br><span class="muted">Sessão de hoje preparada com carga, RIR, duração e registo.</span>'}
  else if(q.includes('nutri')||q.includes('água')||q.includes('refeição')||q.includes('suplement')){page='nutricao';msg='<strong>Nutrição aberta.</strong><br><span class="muted">Podes registar água, refeições e suplementação.</span>'}
  else if(q.includes('recovery')||q.includes('recuper')||q.includes('sono')||q.includes('cansado')||q.includes('dor')){page='recovery';const r=readiness();msg=`<strong>Recovery aberto.</strong><br><span class="muted">${r===null?'Faz o check-in para eu calcular o teu estado.':`Readiness atual: ${r}%. ${r>=80?'Mantém o plano.':r>=65?'Controla o volume.':'Reduz acessórios e intensidade metabólica.'}`}</span>`}
  else if(q.includes('avalia')||q.includes('peso')||q.includes('gordura')||q.includes('vo2')){page='avaliacoes';msg='<strong>Avaliações abertas.</strong><br><span class="muted">Consulta composição corporal, peso, cintura e VO₂.</span>'}
  else if(q.includes('35 minutos')||q.includes('35 min')){page='treino';msg='<strong>Treino otimizado para 35 minutos.</strong><br><span class="muted">Mantém os exercícios principais, reduz acessórios e usa descansos de 60–75 s.</span>'}
  else{msg='<strong>Pedido recebido.</strong><br><span class="muted">Nesta primeira versão já consigo abrir módulos e interpretar pedidos básicos. A camada autónoma será ligada progressivamente aos teus dados e rotinas.</span>'}
  if(page)go(page);show(msg);input.value='';
 }
 send.onclick=run;input.addEventListener('keydown',e=>{if(e.key==='Enter')run()});
}
render();installBlueAI();