/* Cache-first app shell so the game plays offline in parks/neighborhoods.
   BUMP CACHE ON EVERY RELEASE (UX gap #9): a stale version string keeps
   serving the old build until it changes.

   Precache: app shell + vendored Leaflet + all art/icons, so the first visit
   fully equips the game for offline play. OSM map tiles are cross-origin and
   runtime-cached as fetched — already-visited areas keep their tiles offline.

   The QR/code + fallback unlock paths work with zero connectivity. */
const CACHE = "lantern-v3"; // bump on every release — stale caches serve old builds
const SHELL = [
  "./",
  "./index.html",
  "./app.js",
  "./styles.css",
  "./manifest.webmanifest",
  // Vendored Leaflet — the map itself works offline (tiles excepted).
  "./assets/vendor/leaflet.css",
  "./assets/vendor/leaflet.js",
  // Game art + PWA icons (downscaled 2026-10-15, ~750KB total).
  "./assets/wisp-sad-intro.webp",
  "./assets/wisp-hiding-lantern.webp",
  "./assets/finale-lantern-parade.webp",
  "./assets/logo-primary.webp",
  "./assets/drz-cozy.webp",
  "./assets/drz-spooky.webp",
  "./assets/drz-afterdark.webp",
  "./assets/drz-overdrive.webp",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./assets/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  // Add each file individually (wrapped): unlike caches.addAll, a single
  // 404 never fails the whole install and blocks the shell.
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.all(SHELL.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
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
        // Cache successful responses: same-origin ("basic") AND cross-origin
        // map tiles ("cors"/"opaque") — OSM tiles must survive offline too.
        const cacheable = res && (res.type === "basic" || res.type === "cors" || res.type === "opaque");
        if (cacheable && (res.ok || res.type === "opaque")) {
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
