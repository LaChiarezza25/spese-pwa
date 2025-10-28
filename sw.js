// sw.js — v3
const CACHE = "spese-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first con fallback rete
self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(res => res || fetch(req).then(net => {
      // metti in cache le risposte navigate/statiche
      const copy = net.clone();
      if (req.method === "GET" && net.ok) {
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
      }
      return net;
    }).catch(() => caches.match("./index.html")))
  );
});
