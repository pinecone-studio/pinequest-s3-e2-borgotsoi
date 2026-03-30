const CACHE_NAME = "mini-test-cache-v15";
const CACHED_PATHS = ["/mini-test", "/active-exam"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const path of CACHED_PATHS) {
        try {
          const res = await fetch(path, { cache: "no-store" });
          if (res.ok) {
            await cache.put(path, res.clone());
          }
        } catch (e) {
          console.warn("precache failed:", path, e);
        }
      }
    })(),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Check if this request is for one of our cached app paths
  const matchedPath = CACHED_PATHS.find((p) => url.pathname.startsWith(p));

  const isCachedNav = request.mode === "navigate" && !!matchedPath;
  const isCachedAsset =
    url.pathname.startsWith("/_next/static/") &&
    CACHED_PATHS.some((p) => request.headers.get("referer")?.includes(p));

  if (!isCachedNav && !isCachedAsset) return;

  // Network-first for navigation (page loads)
  if (isCachedNav) {
    event.respondWith(
      (async () => {
        try {
          const networkRes = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, networkRes.clone());
          return networkRes;
        } catch {
          // Offline — serve from cache
          const cached = await caches.match(request);
          if (cached) return cached;

          // Try the base path as fallback (e.g. /active-exam for /active-exam?studentId=...)
          const fallback = await caches.match(matchedPath);
          if (fallback) return fallback;

          return new Response("Offline – page not cached yet", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        }
      })(),
    );
    return;
  }

  // Cache-first for static assets (JS/CSS chunks)
  if (isCachedAsset) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        try {
          const networkRes = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, networkRes.clone());
          return networkRes;
        } catch {
          return new Response("", { status: 404 });
        }
      })(),
    );
    return;
  }
});
