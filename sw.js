const CACHE='blueon-operator-v6';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./assets/blue-on-m45-logo.svg','./icons/icon-192.svg','./icons/icon-512.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request).then(r=>{const c=r.clone();caches.open(CACHE).then(cache=>cache.put(event.request,c));return r}).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html'))))});
