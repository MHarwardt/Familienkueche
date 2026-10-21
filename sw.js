const CACHE='familienkueche-v44';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('familienkueche-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  try{
   const response=await fetch(req);
   if(response.ok){const cache=await caches.open(CACHE);await cache.put(req,response.clone())}
   return response;
  }catch(err){
   const cached=await caches.match(req);
   if(cached)return cached;
   if(req.mode==='navigate'){const page=await caches.match('./index.html');if(page)return page}
   return Response.error();
  }
 })());
});
