'use strict';

const PROFILE={
  name:'João Pereira',age:44,height:1.73,targetWeight:80,location:'Leiria',
  goal:'80 kg seco, atlético e musculado, com cintura controlada.',
  trainingWindow:'06:00–07:15',weekdays:'2ª a 6ª',sleepTarget:'7h30+',nutrition:'bulk limpo',
  supplements:['Whey','Creatina 3–5 g','Ómega-3 1–2 g EPA+DHA','ZMB6','Ashwagandha','Rhodiola']
};

const WORKOUTS=[
 {day:'Segunda',title:'Lower Strength + Engine',focus:'Força inferior, core e capacidade aeróbia.',duration:50,exercises:[
  {name:'Front Squat',detail:'4 séries · RIR 1–2',sets:4,reps:'4–6',load:'70',rir:'1–2'},
  {name:'Romanian Deadlift',detail:'3 séries · excêntrica controlada',sets:3,reps:'6–8',load:'70',rir:'1–2'},
  {name:'Split Squat',detail:'Unilateral · controlo pélvico',sets:3,reps:'8/8',load:'20',rir:'2'},
  {name:'Core anti-extensão',detail:'Qualidade antes de fadiga',sets:3,reps:'10–12',load:'—',rir:'2'},
  {name:'SkiErg Z2',detail:'Final aeróbio',sets:1,reps:'12 min',load:'—',rir:'—'}]},
 {day:'Terça',title:'Upper Strength + Grip',focus:'Força superior, hipertrofia e controlo escapular.',duration:50,exercises:[
  {name:'Incline DB/Cable Press',detail:'Perfil alongado · peito superior',sets:4,reps:'6–8',load:'26',rir:'1–2'},
  {name:'Chest Supported Row',detail:'Remada apoiada · dorsal',sets:4,reps:'6–8',load:'32',rir:'1–2'},
  {name:'Lat Pulldown',detail:'Depressão escapular',sets:3,reps:'8–10',load:'55',rir:'1–2'},
  {name:'Landmine Press',detail:'Half-kneeling',sets:3,reps:'8/8',load:'25',rir:'2'},
  {name:'Farmer Carry',detail:'Grip e estabilidade',sets:4,reps:'35 m',load:'28',rir:'—'}]},
 {day:'Quarta',title:'Engine + Mobility',focus:'Limiar, economia de corrida, mobilidade e core.',duration:48,exercises:[
  {name:'Aquecimento corrida',detail:'Progressivo',sets:1,reps:'8 min',load:'—',rir:'—'},
  {name:'Intervalos controlados',detail:'Z4 controlada',sets:6,reps:'3 min',load:'—',rir:'—'},
  {name:'Row / Ski alternado',detail:'Motor híbrido',sets:4,reps:'3 min',load:'—',rir:'—'},
  {name:'Core + mobilidade',detail:'Respiração e amplitude',sets:1,reps:'12 min',load:'—',rir:'—'}]},
 {day:'Quinta',title:'Full Body Power',focus:'Potência, força resistente e padrões funcionais.',duration:50,exercises:[
  {name:'Trap Bar Deadlift',detail:'Força e intenção rápida',sets:4,reps:'4–6',load:'95',rir:'1–2'},
  {name:'DB Power Clean',detail:'Potência técnica',sets:4,reps:'5',load:'18',rir:'2'},
  {name:'Landmine Press',detail:'Half-kneeling unilateral',sets:3,reps:'8/8',load:'25',rir:'2'},
  {name:'KB Swing',detail:'Hinge explosivo',sets:4,reps:'12',load:'20',rir:'2'},
  {name:'Loaded Carry',detail:'Marcha estável',sets:4,reps:'40 m',load:'28',rir:'—'}]},
 {day:'Sexta',title:'BLUE Hybrid WOD',focus:'Integração de corrida, ergómetro, força e pacing.',duration:50,exercises:[
  {name:'Run',detail:'Pacing controlado',sets:4,reps:'800 m',load:'—',rir:'—'},
  {name:'SkiErg / Row',detail:'Alternado por ronda',sets:4,reps:'600 m',load:'—',rir:'—'},
  {name:'Thruster',detail:'Força resistente',sets:4,reps:'12',load:'20',rir:'2'},
  {name:'Farmer Carry',detail:'Grip sob fadiga',sets:4,reps:'40 m',load:'28',rir:'—'},
  {name:'Burpee variation',detail:'Ritmo contínuo',sets:4,reps:'10',load:'—',rir:'—'}]},
 {day:'Sábado',title:'Recuperação',focus:'Sem treino obrigatório.',duration:20,exercises:[{name:'Caminhada',detail:'Opcional',sets:1,reps:'20–40 min',load:'—',rir:'—'},{name:'Mobilidade',detail:'Respiração e amplitude',sets:1,reps:'10–15 min',load:'—',rir:'—'}]},
 {day:'Domingo',title:'Preparação semanal',focus:'Descanso, planeamento e preparação.',duration:15,exercises:[{name:'Planeamento',detail:'Organizar treino e refeições',sets:1,reps:'15 min',load:'—',rir:'—'}]}
];

const PHASES=[
 {name:'Fundação estrutural',weeks:'1–8',goal:'Força base, hipertrofia funcional, mobilidade e base aeróbia.'},
 {name:'Desenvolvimento híbrido',weeks:'9–16',goal:'Força, potência, limiar e trabalho misto progressivo.'},
 {name:'Capacidade e potência',weeks:'17–24',goal:'Força resistente, VO₂ e manutenção de massa muscular.'},
 {name:'Integração específica',weeks:'25–34',goal:'Aplicação de força e motor em sessões híbridas.'},
 {name:'Performance competitiva',weeks:'35–44',goal:'Pacing, eficiência e resistência específica.'},
 {name:'Peak e taper',weeks:'45–52',goal:'Consolidar performance e reduzir fadiga.'}
];

const DEFAULTS={
 version:5,week:1,workoutMode:'normal',workoutOverride:null,water:0,
 sessions:[],nutrition:[],recovery:[],
 assessments:[{date:'01/08/2025',weight:74.3,fat:11.3,waist:'',vo2:32.23}],
 supplements:{},completed:{},exerciseData:{},timelineCustom:[],aiLog:[],memory:[]
};

const STORAGE_KEY='blueonOperatorV5';
function loadState(){
  try{
    const current=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(current)return {...structuredClone(DEFAULTS),...current};
    const old=JSON.parse(localStorage.getItem('blueonM45v3')||'null');
    if(old){const migrated={...structuredClone(DEFAULTS),...old,version:5};localStorage.setItem(STORAGE_KEY,JSON.stringify(migrated));return migrated;}
  }catch(e){console.warn('Falha ao carregar dados',e)}
  return structuredClone(DEFAULTS);
}
let state=loadState();
const $=id=>document.getElementById(id);
const $$=sel=>[...document.querySelectorAll(sel)];
const save=()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
const dateKey=()=>new Date().toISOString().slice(0,10);
const todayLabel=()=>new Date().toLocaleDateString('pt-PT');
const dayIndex=()=>{const d=new Date().getDay();return d===0?6:d-1};
const currentWorkout=()=>state.workoutOverride||structuredClone(WORKOUTS[dayIndex()]);
const phaseIndex=w=>w<=8?0:w<=16?1:w<=24?2:w<=34?3:w<=44?4:5;
const latestAssessment=()=>state.assessments.at(-1)||DEFAULTS.assessments[0];
const latestRecovery=()=>state.recovery.at(-1)||null;

function readiness(entry=latestRecovery()){
  if(!entry)return null;
  return Math.max(0,Math.min(100,Math.round((entry.sleep+entry.energy+(11-entry.soreness)+(11-entry.stress))/40*100)));
}

function toast(text){const el=$('toast');el.textContent=text;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2600)}
function escapeHtml(str=''){return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function timeNow(){return new Date().toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'})}
function addAiLog(action){state.aiLog.unshift({time:`${todayLabel()} · ${timeNow()}`,action});state.aiLog=state.aiLog.slice(0,60);save();renderAiLog();}
function addMemory(label,text){state.memory.unshift({date:todayLabel(),label,text});state.memory=state.memory.slice(0,12);save();renderMemory();}

const PAGE_META={dashboard:['Dashboard','PERFORMANCE OPERATING SYSTEM'],treino:['Treino','SESSÃO, CARGA E PROGRESSÃO'],nutricao:['Nutrição','ENERGIA, ÁGUA E SUPLEMENTAÇÃO'],recovery:['Recovery','SONO, FADIGA, STRESS E PRONTIDÃO'],avaliacoes:['Avaliações','COMPOSIÇÃO CORPORAL E EVOLUÇÃO'],planeamento:['Planeamento','52 SEMANAS DE PERFORMANCE HÍBRIDA'],dados:['Dados','PERFIL, BACKUP E CONFIGURAÇÃO']};
function go(page){
  if(!PAGE_META[page])return;
  $$('.page').forEach(p=>p.classList.toggle('active',p.id===page));
  $$('.nav-item,.mobile-nav button[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  $('pageTitle').textContent=PAGE_META[page][0];$('pageEyebrow').textContent=PAGE_META[page][1];
  window.scrollTo({top:0,behavior:'smooth'});
  if(innerWidth<820)closeAI();
  requestAnimationFrame(drawAllCharts);
}

function updateClock(){const now=new Date();$('liveTime').textContent=now.toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'});$('liveDate').textContent=now.toLocaleDateString('pt-PT',{weekday:'short',day:'2-digit',month:'short'})}

function greeting(){const h=new Date().getHours();return h<12?'Bom dia':h<19?'Boa tarde':'Boa noite'}
function buildBriefing(){
  const r=readiness(),wo=currentWorkout(),rec=latestRecovery(),a=latestAssessment();
  const parts=[];
  if(r===null)parts.push('Ainda não fizeste o check-in de recovery.');
  else if(r>=82)parts.push(`Readiness em ${r}%. Estás em condição favorável para executar a sessão prevista.`);
  else if(r>=66)parts.push(`Readiness em ${r}%. Mantém os exercícios principais e controla o volume acessório.`);
  else parts.push(`Readiness em ${r}%. O sistema recomenda reduzir volume e intensidade metabólica.`);
  parts.push(`Hoje tens ${wo.title}, com cerca de ${wo.duration} minutos.`);
  if(state.water<1.5)parts.push(`A hidratação está em ${state.water.toFixed(1).replace('.',',')} litros.`);
  const diff=(PROFILE.targetWeight-a.weight).toFixed(1).replace('.',',');parts.push(`Faltam ${diff} kg para a meta de ${PROFILE.targetWeight} kg.`);
  if(rec&&rec.soreness>=7)parts.push('A dor muscular está elevada; evita acrescentar volume fora do plano.');
  return parts.join(' ');
}
function decision(){const r=readiness();if(r===null)return {text:'Faz o check-in de recovery para ativar recomendações autónomas.',load:'Carga: base',duration:`Duração: ${currentWorkout().duration} min`,intensity:'Base',volume:'100%',priority:'Check-in'};if(r>=82)return {text:'Executa o plano completo. Mantém RIR 1–2 nos exercícios principais e progride apenas com técnica estável.',load:'Carga: +0–2,5%',duration:`Duração: ${currentWorkout().duration} min`,intensity:'Planeada',volume:'100%',priority:'Performance'};if(r>=66)return {text:'Mantém os exercícios principais. Reduz uma série nos acessórios e evita falha muscular.',load:'Carga: estável',duration:`Duração: ${Math.max(35,currentWorkout().duration-5)} min`,intensity:'Moderada',volume:'85%',priority:'Qualidade'};return {text:'Reduz acessórios, prolonga descansos e substitui o finisher por trabalho aeróbio leve.',load:'Carga: -5–10%',duration:'Duração: 30–40 min',intensity:'Controlada',volume:'65%',priority:'Recuperação'};}

function renderDashboard(){
  const r=readiness(),rec=latestRecovery(),a=latestAssessment(),p=PHASES[phaseIndex(state.week)],wo=currentWorkout();
  $('greeting').textContent=`${greeting()}, João.`;$('briefingText').textContent=buildBriefing();
  $('readyScore').textContent=r===null?'—':`${r}%`;$('readyLabel').textContent=r===null?'sem dados':r>=82?'excelente':r>=66?'moderado':'baixo';$('readinessOrb').style.setProperty('--score',`${(r||0)*3.6}deg`);
  const d=decision();$('aiDecision').textContent=d.text;$('decisionLoad').textContent=d.load;$('decisionDuration').textContent=d.duration;
  $('dashSleep').textContent=rec?`${rec.sleep}/10`:'—';$('dashSleepState').textContent=rec?(rec.sleep>=8?'ótimo':'a melhorar'):'sem registo';
  $('dashEnergy').textContent=rec?`${rec.energy}/10`:'—';$('dashEnergyState').textContent=rec?(rec.energy>=8?'alta':'moderada'):'sem registo';
  $('dashWater').textContent=`${state.water.toFixed(1).replace('.',',')} L`;$('dashWaterState').textContent=`${Math.round(state.water/3.5*100)}% da meta`;
  $('dashWeight').textContent=`${a.weight.toFixed(1).replace('.',',')} kg`;$('dashWeightState').textContent=`meta ${PROFILE.targetWeight} kg`;
  $('dashWeek').textContent=`${state.week}/52`;$('dashPhase').textContent=p.name;
  $('todayWorkoutTitle').textContent=wo.title;$('todayWorkoutTag').textContent=wo.day.toUpperCase();$('todayWorkoutFocus').textContent=wo.focus;$('todayDuration').textContent=`${wo.duration} min`;
  $('todayExercises').innerHTML=wo.exercises.slice(0,4).map((x,i)=>`<div class="exercise-mini"><strong>${i+1}. ${escapeHtml(x.name)}</strong><span>${escapeHtml(x.reps)}</span></div>`).join('');
  renderTimeline();renderMemory();
}

function baseTimeline(){return [
  {time:'05:35',title:'Preparação',detail:'Pré-treino, água e organização.'},
  {time:'06:00',title:currentWorkout().title,detail:`Sessão prevista · ${currentWorkout().duration} min`},
  {time:'07:30',title:'Pequeno-almoço',detail:'Proteína, hidratos e creatina.'},
  {time:'12:00',title:'Hidratação',detail:'Validar progresso de água.'},
  {time:'14:00',title:'Almoço + Ómega-3',detail:'Refeição principal e suplementação.'},
  {time:'18:30',title:'Família e jantar',detail:'Fechar trabalho e preparar noite.'},
  {time:'21:45',title:'Ceia e recuperação',detail:'ZMB6, hidratação e preparação do sono.'}
]}
function renderTimeline(){const items=[...baseTimeline(),...state.timelineCustom].sort((a,b)=>a.time.localeCompare(b.time));$('timeline').innerHTML=items.map(x=>`<div class="timeline-item"><span class="timeline-time">${escapeHtml(x.time)}</span><span class="timeline-line"><i class="timeline-dot"></i></span><div class="timeline-content"><strong>${escapeHtml(x.title)}</strong><small>${escapeHtml(x.detail)}</small></div></div>`).join('')}
function renderMemory(){const defaults=[{label:'OBJETIVO',text:'Meta ativa: 80 kg com aparência seca, atlética e cintura controlada.'},{label:'ROTINA',text:'Treinos de 2ª a 6ª; fim de semana reservado à recuperação.'},{label:'MÉTODO',text:'Progressão sustentável com RIR, dose e segurança biomecânica.'}];const list=state.memory.length?state.memory:defaults;$('memoryList').innerHTML=list.slice(0,5).map(m=>`<div class="memory-item"><small>${escapeHtml(m.label)}</small><div>${escapeHtml(m.text)}</div></div>`).join('')}

function renderTraining(){
  const wo=currentWorkout();$('sessionTitle').textContent=wo.title;$('sessionFocus').textContent=wo.focus;$('sessionWeek').textContent=`SEMANA ${state.week}`;$('sessionMode').textContent=state.workoutMode==='short'?'35 MIN':'NORMAL';$('estimatedTime').textContent=`${wo.duration} min`;$('estimatedVolume').textContent=state.workoutMode==='short'?'78%':'100%';
  $('exerciseList').innerHTML=wo.exercises.map((ex,i)=>{const key=`${dateKey()}-${i}`,saved=state.exerciseData[key]||{};return `<div class="exercise-row"><div class="exercise-index">${i+1}</div><div class="exercise-name"><strong>${escapeHtml(ex.name)}</strong><small>${escapeHtml(ex.detail)}</small></div><div class="exercise-cell"><label>CARGA</label><input data-ex-field="load" data-i="${i}" value="${escapeHtml(saved.load??ex.load)}"></div><div class="exercise-cell"><label>REPS</label><input data-ex-field="reps" data-i="${i}" value="${escapeHtml(saved.reps??ex.reps)}"></div><div class="exercise-cell"><label>RIR</label><input data-ex-field="rir" data-i="${i}" value="${escapeHtml(saved.rir??ex.rir)}"></div><input class="exercise-check" type="checkbox" data-complete="${i}" ${state.completed[key]?'checked':''}></div>`}).join('');
  renderSessionHistory();
}
function renderSessionHistory(){$('historyList').innerHTML=state.sessions.length?state.sessions.slice(-9).reverse().map(s=>`<div class="history-card"><div class="history-top"><strong>${escapeHtml(s.title)}</strong><span class="tag">RPE ${s.rpe}</span></div><small>${escapeHtml(s.date)} · ${s.minutes} min</small><p>${escapeHtml(s.notes||'Sem notas.')}</p></div>`).join(''):'<p class="muted">Ainda não existem sessões registadas.</p>'}
function shortenWorkout(){const base=structuredClone(WORKOUTS[dayIndex()]);base.duration=35;base.exercises=base.exercises.slice(0,Math.max(3,base.exercises.length-2));base.exercises=base.exercises.map((e,i)=>({...e,sets:Math.max(2,e.sets-(i>1?1:0)),detail:`${e.detail} · versão 35 min`}));state.workoutMode='short';state.workoutOverride=base;save();renderAll();addAiLog('Sessão ajustada automaticamente para 35 minutos.');addMessage('ai','Sessão ajustada para 35 minutos. Mantive os estímulos principais, removi acessórios de menor prioridade e reduzi o volume total.');toast('Treino ajustado para 35 minutos')}
function restoreWorkout(){state.workoutMode='normal';state.workoutOverride=null;save();renderAll();addAiLog('Plano diário restaurado para a versão completa.');toast('Plano completo restaurado')}
function saveSession(done=false){const wo=currentWorkout();state.sessions.push({date:todayLabel(),title:wo.title,rpe:+$('sessionRpe').value,minutes:wo.duration,notes:$('sessionNotes').value.trim(),done,mode:state.workoutMode});state.sessions=state.sessions.slice(-80);if(done)addMemory('PROGRESSO',`Concluíste ${wo.title} com RPE ${$('sessionRpe').value}.`);save();$('sessionNotes').value='';renderAll();addAiLog(done?`Sessão concluída: ${wo.title}.`:`Progresso guardado: ${wo.title}.`);toast(done?'Sessão concluída':'Progresso guardado')}

function renderNutrition(){
  const pct=Math.min(100,Math.round(state.water/3.5*100));$('waterMetric').textContent=`${state.water.toFixed(1).replace('.',',')} L / 3,5 L`;$('waterPercent').textContent=`${pct}%`;$('waterFill').style.height=`${pct}%`;
  const suppDone=PROFILE.supplements.filter(s=>state.supplements[`${dateKey()}-${s}`]).length;const score=Math.round((pct*.45)+(Math.min(100,suppDone/PROFILE.supplements.length*100)*.35)+(Math.min(100,state.nutrition.filter(n=>n.date===dateKey()).length/4*100)*.2));$('nutritionScore').textContent=`${score}%`;$('nutritionInsight').textContent=score>=80?'Boa consistência diária. Mantém ingestão e horários.':state.water<2?'A prioridade atual é aumentar a hidratação.':'Completa refeições e suplementação para fechar o dia.';
  $('supplementList').innerHTML=PROFILE.supplements.map(s=>`<label class="supplement-item"><span>${escapeHtml(s)}</span><input type="checkbox" data-supp="${escapeHtml(s)}" ${state.supplements[`${dateKey()}-${s}`]?'checked':''}></label>`).join('');
  const meals=state.nutrition.filter(n=>n.date===dateKey()).slice().reverse();$('nutritionHistory').innerHTML=meals.length?meals.map(m=>`<div class="meal-item"><div><strong>${escapeHtml(m.name)}</strong><small>${escapeHtml(m.notes||'')}</small></div><span>${escapeHtml(m.time)}</span></div>`).join(''):'<p class="muted">Ainda não existem refeições registadas hoje.</p>';
}
function addWater(amount){state.water=Math.min(6,+(state.water+amount).toFixed(2));save();renderAll();addAiLog(`Registados ${Math.round(amount*1000)} ml de água.`);toast(`+${Math.round(amount*1000)} ml de água`)}
function addMeal(){const name=$('mealName').value.trim();if(!name)return toast('Indica a refeição');state.nutrition.push({date:dateKey(),time:timeNow(),name,notes:$('mealNotes').value.trim()});$('mealName').value='';$('mealNotes').value='';save();renderAll();addAiLog(`Refeição registada: ${name}.`);toast('Refeição registada')}

function renderRecovery(){const r=readiness(),rec=latestRecovery(),d=decision();$('recoveryReady').textContent=r===null?'—':`${r}%`;$('recoveryHeadline').textContent=r===null?'Sem dados recentes':r>=82?'Estado favorável':r>=66?'Prontidão moderada':'Fadiga elevada';$('recoveryText').textContent=d.text;$('recoveryIntensity').textContent=d.intensity;$('recoveryVolume').textContent=d.volume;$('recoveryPriority').textContent=d.priority;$('recoveryHistory').innerHTML=state.recovery.length?state.recovery.slice(-9).reverse().map(x=>`<div class="history-card"><div class="history-top"><strong>${escapeHtml(x.dateLabel||x.date)}</strong><span class="tag">${readiness(x)}%</span></div><small>Sono ${x.sleep}/10 · Energia ${x.energy}/10</small><p>Dor ${x.soreness}/10 · Stress ${x.stress}/10</p></div>`).join(''):'<p class="muted">Ainda não existem registos de recovery.</p>';if(rec){$('sleep').value=rec.sleep;$('energy').value=rec.energy;$('soreness').value=rec.soreness;$('stress').value=rec.stress}updateRangeOutputs()}
function saveRecovery(){const entry={date:dateKey(),dateLabel:todayLabel(),sleep:+$('sleep').value,energy:+$('energy').value,soreness:+$('soreness').value,stress:+$('stress').value};state.recovery=state.recovery.filter(x=>x.date!==dateKey());state.recovery.push(entry);const r=readiness(entry);addMemory('RECOVERY',`Readiness calculada em ${r}%. Sono ${entry.sleep}/10, energia ${entry.energy}/10.`);save();renderAll();addAiLog(`Check-in de recovery guardado: ${r}%.`);addMessage('ai',`${decision().text} Readiness atual: ${r}%.`);toast(`Readiness: ${r}%`)}
function updateRangeOutputs(){['sleep','energy','soreness','stress'].forEach(id=>{$(`${id}Out`).textContent=$(id).value})}

function renderAssessments(){const a=latestAssessment();$('assessmentWeight').textContent=`${a.weight.toFixed(1).replace('.',',')} kg`;$('assessmentFat').textContent=`${a.fat}%`;$('assessmentTarget').textContent=`${Math.max(0,PROFILE.targetWeight-a.weight).toFixed(1).replace('.',',')} kg`;$('assessmentList').innerHTML=state.assessments.slice().reverse().map(x=>`<div class="assessment-row"><strong>${escapeHtml(x.dateLabel||x.date)}</strong><span>Peso <strong>${x.weight} kg</strong></span><span>Gordura <strong>${x.fat||'—'}%</strong></span><span>Cintura <strong>${x.waist||'—'} cm</strong></span><span>VO₂ <strong>${x.vo2||'—'}</strong></span></div>`).join('')}
function saveAssessment(){const entry={date:dateKey(),dateLabel:todayLabel(),weight:+$('weight').value,fat:+$('bodyFatInput').value,waist:$('waist').value,vo2:+$('vo2').value};state.assessments.push(entry);addMemory('AVALIAÇÃO',`Novo peso: ${entry.weight} kg; massa gorda: ${entry.fat}%.`);save();renderAll();addAiLog(`Avaliação física registada: ${entry.weight} kg.`);toast('Avaliação guardada')}

function renderPlanning(){$('weekInput').value=state.week;$('phaseList').innerHTML=PHASES.map((p,i)=>`<div class="phase-card ${i===phaseIndex(state.week)?'active':''}"><small>FASE ${i+1} · SEMANAS ${p.weeks}</small><h3>${escapeHtml(p.name)}</h3><p class="muted">${escapeHtml(p.goal)}</p>${i===phaseIndex(state.week)?'<span class="tag">ATIVA</span>':''}</div>`).join('')}
function renderProfile(){const a=latestAssessment();const items=[['Idade',PROFILE.age],['Altura',`${PROFILE.height} m`],['Peso',`${a.weight} kg`],['Meta',`${PROFILE.targetWeight} kg`],['Treino',PROFILE.trainingWindow],['Frequência',PROFILE.weekdays],['Nutrição',PROFILE.nutrition],['Local',PROFILE.location]];$('profileDetails').innerHTML=items.map(([k,v])=>`<div class="profile-item"><span>${k}</span><strong>${v}</strong></div>`).join('')}
function renderAiLog(){$('aiLog').innerHTML=state.aiLog.length?state.aiLog.map(x=>`<div class="log-item"><strong>${escapeHtml(x.action)}</strong><small>${escapeHtml(x.time)}</small></div>`).join(''):'<p class="muted">Ainda não existem ações registadas pela BLUE AI.</p>'}

function chartDataRecovery(){const arr=state.recovery.slice(-7);return arr.length?arr.map(readiness):[62,68,71,75,72,79,84]}
function drawLineChart(canvasId,series,second=null){const canvas=$(canvasId);if(!canvas||canvas.offsetParent===null)return;const dpr=devicePixelRatio||1;const w=canvas.clientWidth,h=canvas.height;canvas.width=w*dpr;canvas.height=h*dpr;const c=canvas.getContext('2d');c.scale(dpr,dpr);c.clearRect(0,0,w,h);const pad={l:24,r:12,t:18,b:24};const cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;c.strokeStyle='rgba(105,166,229,.12)';c.lineWidth=1;for(let i=0;i<5;i++){const y=pad.t+ch*i/4;c.beginPath();c.moveTo(pad.l,y);c.lineTo(w-pad.r,y);c.stroke()}const draw=(data,color)=>{if(!data.length)return;const min=Math.min(...data,40),max=Math.max(...data,100);c.beginPath();data.forEach((v,i)=>{const x=pad.l+(data.length===1?cw/2:cw*i/(data.length-1));const y=pad.t+ch-(v-min)/(max-min||1)*ch;i?c.lineTo(x,y):c.moveTo(x,y)});c.strokeStyle=color;c.lineWidth=2.5;c.shadowColor=color;c.shadowBlur=12;c.stroke();c.shadowBlur=0;data.forEach((v,i)=>{const x=pad.l+(data.length===1?cw/2:cw*i/(data.length-1));const y=pad.t+ch-(v-min)/(max-min||1)*ch;c.beginPath();c.arc(x,y,3,0,Math.PI*2);c.fillStyle=color;c.fill()})};draw(series,'#087cff');if(second)draw(second,'#34d4ff')}
function drawAssessmentChart(){const canvas=$('assessmentChart');if(!canvas||canvas.offsetParent===null)return;const data=state.assessments.slice(-10);drawLineChart('assessmentChart',data.map(x=>x.weight));}
function drawAllCharts(){drawLineChart('performanceChart',chartDataRecovery(),[42,55,48,64,73,69,82]);drawLineChart('recoveryChart',chartDataRecovery());drawAssessmentChart()}

function renderAll(){renderDashboard();renderTraining();renderNutrition();renderRecovery();renderAssessments();renderPlanning();renderProfile();renderAiLog();requestAnimationFrame(drawAllCharts)}

function openAI(){ $('aiPanel').classList.add('open');setTimeout(()=>$('blueAiInput').focus(),200)}
function closeAI(){ $('aiPanel').classList.remove('open')}
function addMessage(type,text){const box=$('aiConversation');box.insertAdjacentHTML('beforeend',`<div class="message ${type}">${escapeHtml(text)}<small>${timeNow()}</small></div>`);box.scrollTop=box.scrollHeight}
function confirmAction(title,text,action){$('confirmTitle').textContent=title;$('confirmText').textContent=text;$('confirmModal').classList.add('open');$('confirmModal').setAttribute('aria-hidden','false');confirmAction.pending=action}
function closeConfirm(){$('confirmModal').classList.remove('open');$('confirmModal').setAttribute('aria-hidden','true');confirmAction.pending=null}

function parseNumber(q){const m=q.match(/(\d+(?:[.,]\d+)?)/);return m?Number(m[1].replace(',','.')):null}
function handleAI(raw){
  const text=raw.trim();if(!text)return;addMessage('user',text);$('blueAiInput').value='';const q=text.toLowerCase();let response='';
  const pages=[['dashboard',['dashboard','resumo','início','inicio','hoje']],['treino',['treino','sessão','sessao']],['nutricao',['nutrição','nutricao','refeição','refeicao','macros','suplement']],['recovery',['recovery','recuperação','recuperacao','sono','stress','fadiga']],['avaliacoes',['avaliação','avaliacao','avaliações','avaliacoes','peso','composição']],['planeamento',['planeamento','semana','macrociclo']],['dados',['dados','definições','definicoes','backup']]];
  const pageMatch=pages.find(([,words])=>words.some(w=>q.includes(w)));
  if((q.includes('abre')||q.includes('mostra')||q.includes('leva-me')||q.includes('ir para'))&&pageMatch){go(pageMatch[0]);response=`Abri ${PAGE_META[pageMatch[0]][0]}.`;addAiLog(`Navegação por voz/texto: ${PAGE_META[pageMatch[0]][0]}.`)}
  else if(q.includes('35 min')||q.includes('35 minutos')||q.includes('pouco tempo')){shortenWorkout();response='A sessão foi reorganizada para 35 minutos, preservando os estímulos principais.'}
  else if(q.includes('restaura')||q.includes('plano completo')){restoreWorkout();response='Restaurei a sessão completa.'}
  else if(q.includes('água')||q.includes('agua')){let n=parseNumber(q)||250;const liters=q.includes('litro')?n:n/1000;if(q.includes('regista')||q.includes('adiciona')||q.includes('+')){addWater(liters);response=`Registei ${Math.round(liters*1000)} ml de água. Total: ${state.water.toFixed(1).replace('.',',')} L.`}else response=`Tens ${state.water.toFixed(1).replace('.',',')} L de água registados. Faltam ${Math.max(0,3.5-state.water).toFixed(1).replace('.',',')} L para a meta.`}
  else if(q.includes('creatina')&&(q.includes('tomei')||q.includes('regista')||q.includes('feito'))){state.supplements[`${dateKey()}-Creatina 3–5 g`]=true;save();renderAll();addAiLog('Creatina marcada como tomada.');response='Creatina registada como tomada hoje.'}
  else if(q.includes('como estou')||q.includes('recuperação')||q.includes('recovery')||q.includes('readiness')){const r=readiness();response=r===null?'Ainda não tenho um check-in de recovery hoje. Abri a secção para registares sono, energia, dor e stress.':`Readiness em ${r}%. ${decision().text}`;if(r===null)go('recovery')}
  else if(q.includes('briefing')||q.includes('resume o dia')){response=buildBriefing()}
  else if(q.includes('peso')){const a=latestAssessment();response=`O peso atual é ${a.weight.toFixed(1).replace('.',',')} kg. Faltam ${(PROFILE.targetWeight-a.weight).toFixed(1).replace('.',',')} kg para a meta.`}
  else if(q.includes('concluir treino')||q.includes('terminar treino')){confirmAction('Concluir sessão',`Confirmas a conclusão de ${currentWorkout().title}?`,()=>saveSession(true));response='Preciso da tua confirmação antes de concluir e gravar a sessão.'}
  else if(q.includes('apaga')||q.includes('repor aplicação')){confirmAction('Repor aplicação','Esta ação elimina todos os registos locais. Pretendes continuar?',resetApp);response='Abri a confirmação de segurança. Não eliminarei dados sem autorização.'}
  else if(pageMatch){go(pageMatch[0]);response=`Abri ${PAGE_META[pageMatch[0]][0]}.`}
  else response='Posso abrir dashboards, ajustar o treino, registar água e creatina, analisar recovery, mostrar peso e executar ações com confirmação. Tenta: “tenho 35 minutos” ou “regista 500 ml de água”.';
  addMessage('ai',response);
}

function speak(text){if(!('speechSynthesis'in window))return toast('Voz não suportada neste dispositivo');speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='pt-PT';u.rate=.96;speechSynthesis.speak(u)}
function startVoice(){const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Recognition)return toast('Reconhecimento de voz não suportado');const r=new Recognition();r.lang='pt-PT';r.interimResults=false;$('voiceBtn').classList.add('listening');r.onresult=e=>{$('blueAiInput').value=e.results[0][0].transcript;handleAI($('blueAiInput').value)};r.onerror=()=>toast('Não foi possível ouvir');r.onend=()=>$('voiceBtn').classList.remove('listening');r.start()}

function exportData(){const blob=new Blob([JSON.stringify({profile:PROFILE,state},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`blueon-operator-${dateKey()}.json`;a.click();URL.revokeObjectURL(a.href);addAiLog('Backup exportado.');toast('Backup exportado')}
function importData(file){const reader=new FileReader();reader.onload=()=>{try{const json=JSON.parse(reader.result);state={...structuredClone(DEFAULTS),...(json.state||json)};save();renderAll();addAiLog('Backup importado.');toast('Backup importado')}catch{toast('Ficheiro inválido')}};reader.readAsText(file)}
function resetApp(){state=structuredClone(DEFAULTS);save();renderAll();closeConfirm();addMessage('ai','A aplicação foi reposta para os dados iniciais.');toast('Aplicação reposta')}

function bind(){
  document.addEventListener('click',e=>{const page=e.target.closest('[data-page]')?.dataset.page;if(page)go(page)});
  $('openAiPanel').onclick=openAI;$('mobileAiBtn').onclick=openAI;$('closeAiPanel').onclick=closeAI;
  $('blueAiSend').onclick=()=>handleAI($('blueAiInput').value);$('blueAiInput').addEventListener('keydown',e=>{if(e.key==='Enter')handleAI(e.currentTarget.value)});
  $$('.quick-prompts button').forEach(b=>b.onclick=()=>handleAI(b.dataset.prompt));$('voiceBtn').onclick=startVoice;
  $('speakBriefing').onclick=()=>speak(buildBriefing());$('askWhy').onclick=()=>{openAI();addMessage('ai',`${decision().text} A decisão é calculada com sono, energia, dor muscular e stress do último check-in.`)};
  $('addTimelineItem').onclick=()=>{const title=prompt('Novo item da timeline:');if(!title)return;const time=prompt('Hora (HH:MM):',timeNow())||timeNow();state.timelineCustom.push({time,title,detail:'Adicionado manualmente.'});save();renderTimeline();toast('Item adicionado')};
  $('exerciseList').addEventListener('input',e=>{if(e.target.dataset.exField){const key=`${dateKey()}-${e.target.dataset.i}`;state.exerciseData[key]??={};state.exerciseData[key][e.target.dataset.exField]=e.target.value;save()}});
  $('exerciseList').addEventListener('change',e=>{if(e.target.dataset.complete!==undefined){state.completed[`${dateKey()}-${e.target.dataset.complete}`]=e.target.checked;save()}});
  $('sessionRpe').oninput=e=>$('sessionRpeOutput').textContent=e.target.value;$('saveSessionBtn').onclick=()=>saveSession(false);$('completeSession').onclick=()=>confirmAction('Concluir sessão',`Confirmas a conclusão de ${currentWorkout().title}?`,()=>saveSession(true));$('shortenWorkout').onclick=shortenWorkout;$('restoreWorkout').onclick=restoreWorkout;
  $$('[data-water]').forEach(b=>b.onclick=()=>addWater(+b.dataset.water));$('resetWater').onclick=()=>confirmAction('Repor água','Pretendes repor o contador diário de água para zero?',()=>{state.water=0;save();renderAll();closeConfirm();toast('Água reposta')});$('addMeal').onclick=addMeal;$('focusMeal').onclick=()=>$('mealName').focus();$('supplementList').onchange=e=>{if(e.target.dataset.supp){state.supplements[`${dateKey()}-${e.target.dataset.supp}`]=e.target.checked;save();renderNutrition();addAiLog(`${e.target.dataset.supp}: ${e.target.checked?'concluído':'desmarcado'}.`)}};
  ['sleep','energy','soreness','stress'].forEach(id=>$(id).oninput=updateRangeOutputs);$('saveRecovery').onclick=saveRecovery;$('saveAssessment').onclick=saveAssessment;$('saveWeek').onclick=()=>{state.week=Math.max(1,Math.min(52,+$('weekInput').value||1));save();renderAll();addAiLog(`Semana do macrociclo alterada para ${state.week}.`);toast('Semana atualizada')};
  $('exportData').onclick=exportData;$('importData').onchange=e=>e.target.files[0]&&importData(e.target.files[0]);$('resetData').onclick=()=>confirmAction('Repor aplicação','Esta ação elimina os dados locais. Pretendes continuar?',resetApp);$('clearAiLog').onclick=()=>{state.aiLog=[];save();renderAiLog()};
  $('cancelConfirm').onclick=closeConfirm;$('acceptConfirm').onclick=()=>{const action=confirmAction.pending;if(action)action();closeConfirm()};$('confirmModal').onclick=e=>{if(e.target===$('confirmModal'))closeConfirm()};
  window.addEventListener('resize',()=>requestAnimationFrame(drawAllCharts));
}

let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('installBtn').hidden=false});$('installBtn').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').hidden=true};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');

updateClock();setInterval(updateClock,30000);bind();renderAll();addMessage('ai',`${greeting()}, João. ${buildBriefing()}`);
