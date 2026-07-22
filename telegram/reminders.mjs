import fs from 'node:fs';
import path from 'node:path';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TIMEZONE = process.env.TIMEZONE || 'Europe/Lisbon';
const STATE_FILE = process.env.STATE_FILE || path.join(process.cwd(), 'telegram', '.sent-state.json');

if (!BOT_TOKEN || !CHAT_ID) {
  console.error('Faltam TELEGRAM_BOT_TOKEN e/ou TELEGRAM_CHAT_ID.');
  process.exit(1);
}

const reminders = [
  { time: '05:35', days: [1,2,3,4,5], text: '05h35 — Pré-treino: banana + 20 g whey + água.' },
  { time: '07:30', days: [0,1,2,3,4,5,6], text: '07h30 — Pequeno-almoço. Em dia de treino, garantir refeição pós-treino completa; em descanso, ajustar hidratos à atividade.' },
  { time: '10:30', days: [0,1,2,3,4,5,6], text: '10h30 — Lanche da manhã: proteína + hidratos + fruta.' },
  { time: '12:00', days: [0,1,2,3,4,5,6], text: '12h00 — Água: confirmar pelo menos 1,2 L acumulados.' },
  { time: '14:00', days: [0,1,2,3,4,5,6], text: '14h00 — Creatina 5 g + ómega-3 com a refeição.' },
  { time: '15:30', days: [0,1,2,3,4,5,6], text: '15h30 — Lanche da tarde. Não deixar a ingestão cair ao final do dia.' },
  { time: '18:00', days: [0,1,2,3,4,5,6], text: '18h00 — Água: confirmar pelo menos 2,2 L acumulados.' },
  { time: '20:30', days: [0,1,2,3,4,5,6], text: '20h30 — ZMB6, de acordo com o rótulo e tolerância individual.' },
  { time: '21:45', days: [0,1,2,3,4,5,6], text: '21h45 — Ceia e preparação de amanhã: refeição, shaker, água e suplementos.' }
];

function localParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, weekday: 'short'
  }).formatToParts(date).reduce((acc, p) => (acc[p.type] = p.value, acc), {});
  const dayMap = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
    weekday: dayMap[parts.weekday]
  };
}

function readState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
  catch { return {}; }
}

function writeState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function sendTelegram(text) {
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text, disable_notification: false })
  });
  if (!response.ok) throw new Error(`Telegram ${response.status}: ${await response.text()}`);
}

async function tick() {
  const now = localParts();
  const state = readState();
  for (const reminder of reminders) {
    if (reminder.time !== now.time || !reminder.days.includes(now.weekday)) continue;
    const key = `${now.date}|${reminder.time}`;
    if (state[key]) continue;
    await sendTelegram(`BLUE ON · NUTRIÇÃO\n\n${reminder.text}`);
    state[key] = new Date().toISOString();
    writeState(state);
    console.log('Enviado:', key);
  }
  for (const key of Object.keys(state)) {
    if (!key.startsWith(now.date)) delete state[key];
  }
  writeState(state);
}

await tick();
setInterval(() => tick().catch(err => console.error(err)), 30_000);
console.log(`Lembretes ativos em ${TIMEZONE}.`);
