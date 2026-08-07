(()=>{
'use strict';
const APP_VERSION='4.1.0';
const BUILD='2026-08-07';
let reloading=false;

async function checkForAppUpdate(){
  if(!('serviceWorker' in navigator)||!location.protocol.startsWith('http')) return;
  try{
    const reg=await navigator.serviceWorker.register(`sw.js?v=${APP_VERSION}`,{updateViaCache:'none'});
    if(reg.waiting) reg.waiting.postMessage({type:'SKIP_WAITING'});
    reg.addEventListener('updatefound',()=>{
      const worker=reg.installing;
      if(!worker) return;
      worker.addEventListener('statechange',()=>{
        if(worker.state==='installed'&&navigator.serviceWorker.controller){
          worker.postMessage({type:'SKIP_WAITING'});
        }
      });
    });
    await reg.update();
  }catch(err){console.warn('Atualização da app indisponível:',err)}
}

navigator.serviceWorker?.addEventListener('controllerchange',()=>{
  if(reloading) return;
  reloading=true;
  location.reload();
});

document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible') checkForAppUpdate();
});
window.addEventListener('online',checkForAppUpdate);
setInterval(checkForAppUpdate,10*60*1000);
checkForAppUpdate();

window.EUROLAB_APP_VERSION=APP_VERSION;
window.EUROLAB_BUILD=BUILD;
})();
