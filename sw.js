/* Service worker: red primero (siempre ves productos nuevos), y si no hay internet usa lo guardado */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  const key = new Request(u.origin + u.pathname);   /* sin ?parámetros: no llena el caché */
  e.respondWith(
    fetch(e.request)
      .then(r => { if (r.ok) { const c = r.clone(); caches.open('issmar-v2').then(ca => ca.put(key, c)).catch(() => {}); } return r; })
      .catch(() => caches.match(key))
  );
});