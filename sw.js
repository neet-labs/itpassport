// NEET LABS v0.4 - offline app update. Assets are embedded into past.html.
const C='itp-v4.0';
const FILES=['./','./index.html','./manifest.json','./icon.png','./past.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('itp-v')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;let url=new URL(e.request.url);if(url.origin!==location.origin)return;e.respondWith(caches.open(C).then(async c=>{let cached=await c.match(e.request);if(cached)return cached;return fetch(e.request)}))});
