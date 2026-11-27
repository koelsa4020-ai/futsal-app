/* KoELSA 풋살 앱 서비스 워커: 항상 네트워크 우선, 끊겼을 때만 마지막 화면을 보여줌 */
const CACHE='koelsa-v2';
const SHELL=['/','/logo.png','/icon-192.png','/favicon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request,url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==location.origin)return; // Firebase 등 외부 요청은 건드리지 않음
  if(url.search)return; // 업데이트 확인(?v=...) 요청은 그대로 통과
  e.respondWith(fetch(req).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req.mode==='navigate'?'/':req,cp))}return res})
    .catch(()=>caches.match(req.mode==='navigate'?'/':req).then(r=>r||Response.error())));
});
