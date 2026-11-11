// Funziona anche senza rete: la pagina e le icone restano sul telefono.
// Con la rete prende sempre la versione piu recente (criteri aggiornati).
const CACHE = "screening-1.6 del 14/10/2026-2026-11-11-133801";
const FILE = ["./", "index.html", "manifest.webmanifest", "icona-192.png", "icona-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILE))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const pagina = e.request.mode === "navigate";
  e.respondWith(
    pagina
      ? fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put("index.html", c)); return r; })
               .catch(() => caches.match("index.html"))
      : caches.match(e.request).then(m => m || fetch(e.request).then(r => {
          if (r.ok || r.type === "opaque") { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); }
          return r;
        }))
  );
});
