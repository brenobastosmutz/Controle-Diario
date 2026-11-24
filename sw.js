const CACHE='controle-diario-v7';
const ASSETS=['./','./index.html','./emprestimos.html','./manifest.json'];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting()})());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('controle-diario-')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})());
});
self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{try{const response=await fetch(event.request);const cache=await caches.open(CACHE);cache.put(event.request,response.clone());return response}catch(error){return (await caches.match(event.request))||(await caches.match('./index.html'))||Response.error()}})());
    return;
  }
  event.respondWith((async()=>{const cached=await caches.match(event.request);if(cached)return cached;return fetch(event.request)})());
});