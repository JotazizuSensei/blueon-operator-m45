const VERSION='eurolab-v4.1.0';
const CACHE=`${VERSION}-static`;
const STATIC=['index.html','styles.css','core.js','app.js','update.js','manifest.webmanifest','icon-192.png','icon-512.png'];
const bust=(path)=>`${path}${path.includes('?')?'&':'?'}v=${encodeURIComponent(VERSION)}`;

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    for(const asset of STATIC){
      try{
        const response=await fetch(bust(asset),{cache:'no-store'});
        if(response.ok) await cache.put(asset,response.clone());
      }catch{}
    }
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(bust('index.html'),{cache:'no-store'});
        if(response.ok){
          const cache=await caches.open(CACHE);
          await cache.put('index.html',response.clone());
          return response;
        }
      }catch{}
      return (await caches.match('index.html')) || Response.error();
    })());
    return;
  }

  if(url.pathname.endsWith('/latest-result.json')){
    event.respondWith(fetch(bust('latest-result.json'),{cache:'no-store'}).catch(()=>caches.match(event.request)));
    return;
  }

  const name=url.pathname.split('/').pop();
  if(STATIC.includes(name)){
    event.respondWith((async()=>{
      try{
        const response=await fetch(bust(name),{cache:'no-store'});
        if(response.ok){
          const cache=await caches.open(CACHE);
          await cache.put(name,response.clone());
          return response;
        }
      }catch{}
      return (await caches.match(name)) || fetch(event.request);
    })());
    return;
  }

  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});
