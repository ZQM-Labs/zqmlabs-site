/* Cache-first app shell so the game plays offline in parks/neighborhoods.
   Bump CACHE on every release. Map tiles are runtime-cached opportunistically;
   the QR/code + fallback unlock paths work with zero connectivity.

   NOTE: Leaflet is expected to be vendored locally (see AGENTS.md). If it is
   still loaded from a CDN, the map will not work offline — the text stop list
   in app.js is the offline fallback. */
const CACHE = "lantern-v4";
const SHELL = [
  "./",
  "./index.html",
  "./app.js",
  "./styles.css",
  "./manifest.webmanifest",
  "./vendor/leaflet.css",
  "./vendor/leaflet.js",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      // Take control of open pages immediately so updates apply without a reload.
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  // Only handle GETs. Caching a POST/PUT response throws in the Cache API and
  // would swallow the error; API writes must always hit the network.
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);

  // Never serve the app shell in place of an asset. A failed script/style
  // fetch must fail loudly, not return HTML (that yields a silent SyntaxError
  // — the same class of bug as an origin catch-all).
  const isAsset = /\.(js|css|webmanifest|png|webp|svg|ogg|mp3)$/.test(url.pathname);

  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(res => {
        // Only cache successful, same-origin, basic responses.
        if (res && res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      }).catch(err => {
        // Offline. For navigations, fall back to the cached shell.
        if (e.request.mode === "navigate") return caches.match("./index.html");
        // For assets, fail rather than masquerade HTML as JS/CSS.
        if (isAsset) throw err;
        return caches.match("./index.html");
      });
    })
  );
});
