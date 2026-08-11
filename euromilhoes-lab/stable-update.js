(()=>{
'use strict';
const APP_VERSION='4.1.1';
let lastCheck=0;
let checking=false;

async function checkForAppUpdate(force=false){
  if(!('serviceWorker' in navigator)||!location.protocol.startsWith('http')||checking) return;
  const now=Date.now();
  if(!force && now-lastCheck<30*60*1000) return;
  lastCheck=now;
  checking=true;
  try{
    // IMPORTANT: app.js e este módulo usam exatamente o mesmo URL do service worker.
    // Assim evitamos o ciclo sw.js <-> sw.js?v=... que fazia a app recarregar/piscar.
    const reg=await navigator.serviceWorker.register('sw.js',{updateViaCache:'none'});
    await reg.update();
    // Não fazemos reload automático. Uma nova versão fica pronta e entra
    // naturalmente na próxima abertura da app, sem interromper a navegação atual.
  }catch(err){
    console.warn('Atualização da app indisponível:',err);
  }finally{
    checking=false;
  }
}

document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible') checkForAppUpdate(false);
});
window.addEventListener('online',()=>checkForAppUpdate(true));
window.addEventListener('pageshow',()=>checkForAppUpdate(false));
checkForAppUpdate(true);

window.EUROLAB_APP_VERSION=APP_VERSION;
})();
