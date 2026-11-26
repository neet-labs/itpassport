const C='itp-v1.0.0';
const REQUIRED=['./past.html','./sw.js'];
const OPTIONAL=['./','./index.html','./manifest.json','./icon.png'];
self.addEventListener('install',e=>e.waitUntil((async()=>{
 const cache=await caches.open(C);
 await cache.addAll(REQUIRED);
 await Promise.all(OPTIONAL.map(async path=>{
  try {const r=await fetch(path,{cache:'no-store'});if(r.ok)await cache.put(path,r)}catch(_){/* optional shell asset */}
 }));
 await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k.startsWith('itp-v')&&k!==C).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 e.respondWith((async()=>{
  const found=await caches.match(e.request);
  if(found)return found;
  try{const response=await fetch(e.request);if(response.ok){const copy=response.clone();caches.open(C).then(c=>c.put(e.request,copy)).catch(()=>{})}return response}
  catch(err){if(e.request.mode==='navigate'){const offline=await caches.match('./past.html');if(offline)return offline}throw err}
 })());
});
