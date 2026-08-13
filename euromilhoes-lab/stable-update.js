(()=>{
'use strict';
const APP_VERSION='4.3.1';let lastCheck=0,checking=false;
function loadScript(src){return new Promise((resolve,reject)=>{if(document.querySelector(`script[data-eurolab-module="${src}"]`))return resolve();const s=document.createElement('script');s.src=src+'?v='+APP_VERSION;s.dataset.eurolabModule=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s)})}
async function loadModules(){try{await loadScript('ed-store.js');await loadScript('ed-base.js');await loadScript('ed-ui.js');await loadScript('simple-ui.js');await loadScript('simple-polish.js')}catch(err){console.warn('Módulo Euro Lab indisponível:',err)}}
async function checkForAppUpdate(force=false){if(!('serviceWorker'in navigator)||!location.protocol.startsWith('http')||checking)return;const now=Date.now();if(!force&&now-lastCheck<30*60*1000)return;lastCheck=now;checking=true;try{const reg=await navigator.serviceWorker.register('sw.js',{updateViaCache:'none'});await reg.update()}catch(err){console.warn('Atualização da app indisponível:',err)}finally{checking=false}}
function showVersion(){[...document.querySelectorAll('#data b')].forEach(b=>{if(/^4\./.test(b.textContent))b.textContent=APP_VERSION})}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){checkForAppUpdate(false);loadModules()}});window.addEventListener('online',()=>checkForAppUpdate(true));window.addEventListener('pageshow',()=>{checkForAppUpdate(false);loadModules()});showVersion();loadModules();checkForAppUpdate(true);window.EUROLAB_APP_VERSION=APP_VERSION;
})();