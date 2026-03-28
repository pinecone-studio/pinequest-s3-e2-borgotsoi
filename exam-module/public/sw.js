/**
 * Service Worker — Offline support for /mini-test ONLY
 *
 * Strategy:
 *   /mini-test (navigation)   → Network-first, fall back to cache when offline
 *   /_next/static/*           → Cache-first (files have content hashes, safe to cache forever)
 *   /api/*                    → Network-only (never cache API calls)
 *   Everything else           → Network-only (login, exam, admin, etc. are NEVER cached)
 *
 * Bump CACHE_VERSION when you need to bust old caches.
 */

const CACHE_VERSION = 15;
const CACHE_NAME = `mini-test-cache-v${CACHE_VERSION}`;

// Only these pages get offline support
const OFFLINE_PAGES = ["/mini-test"];

// ── Install: pre-cache the offline pages ──────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const page of OFFLINE_PAGES) {
        try {
          const res = await fetch(page, { cache: "no-store" });
          if (res.ok) await cache.put(page, res.clone());
        } catch (e) {
          console.warn("[SW] pre-cache failed:", page, e);
        }
      }
    })(),
  );
  // Activate immediately — don't wait for old tabs to close
  self.skipWaiting();
});

// ── Activate: delete ALL old caches ───────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
      // Take control of all open tabs immediately
      await self.clients.claim();
    })(),
  );
});

// ── Helper: is this a page we want to cache for offline? ──────────────
function isOfflinePage(pathname) {
  return OFFLINE_PAGES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

// ── Fetch handler ─────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests from our origin
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // ─── 1. API calls → always network, never cache ───
  if (url.pathname.startsWith("/api/")) {
    return; // Let the browser handle it normally
  }

  // ─── 2. Page navigations ───
  if (request.mode === "navigate") {
    // Only cache offline-enabled pages
    if (!isOfflinePage(url.pathname)) {
      return; // Let the browser handle it — no SW interference
    }

    // Network-first for offline pages
    event.respondWith(
      (async () => {
        try {
          // Try network first
          const networkRes = await fetch(request);
          // Update cache with fresh version
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, networkRes.clone());
          return networkRes;
        } catch {
          // Offline — serve from cache
          const cached = await caches.match(request);
          if (cached) return cached;

          // Fallback: try the base offline page
          const fallback = await caches.match("/mini-test");
          if (fallback) return fallback;

          return new Response("Оффлайн байна. Энэ хуудас кэшлэгдээгүй байна.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
      })(),
    );
    return;
  }

  // ─── 3. Static assets (JS/CSS chunks with hashes) → cache-first ───
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        try {
          const networkRes = await fetch(request);
          if (networkRes.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkRes.clone());
          }
          return networkRes;
        } catch {
          return new Response("", { status: 404 });
        }
      })(),
    );
    return;
  }

  // ─── 4. Everything else → let browser handle normally ───
  // No event.respondWith() = SW doesn't interfere
});
