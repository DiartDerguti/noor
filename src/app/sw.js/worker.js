// Noor service worker. /sw.js/route.ts fills in VERSION, CORE and EXTRA at build time.
const VERSION = "__VERSION__";
const CORE = __CORE__;
const EXTRA = __EXTRA__;

const CORE_CACHE = `noor-core-${VERSION}`;
const MEDIA_CACHE = "noor-media";
const SHELL = "/offline";
const PAGES = new Set(CORE.filter((u) => !u.startsWith("/_next/")));

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CORE_CACHE)
      .then((cache) =>
        Promise.allSettled(
          CORE.map((url) =>
            fetch(url, { cache: "no-cache" }).then((res) => {
              if (res.ok) return cache.put(url, res);
            }),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CORE_CACHE && k !== MEDIA_CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

async function navigate(request) {
  const url = new URL(request.url);
  try {
    const response = await Promise.race([fetch(request), timeout(6000)]);
    if (response.ok && response.type === "basic" && PAGES.has(url.pathname)) {
      const copy = response.clone();
      caches.open(CORE_CACHE).then((c) => c.put(url.pathname, copy));
    }
    return response;
  } catch {
    const hit =
      (await caches.match(url.pathname, { ignoreSearch: true })) ||
      (await caches.match(request, { ignoreSearch: true }));
    return hit || (await caches.match(SHELL)) || Response.error();
  }
}

async function cacheFirst(request, cacheName) {
  const hit = await caches.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok || response.type === "opaque") {
    const copy = response.clone();
    caches.open(cacheName).then((c) => c.put(request, copy));
  }
  return response;
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const copy = response.clone();
      caches.open(cacheName).then((c) => c.put(request, copy));
    }
    return response;
  } catch {
    return (await caches.match(request)) || Response.error();
  }
}

// Audio players ask for byte ranges; answer them from the full file in the cache.
async function audio(request) {
  const url = request.url.split("#")[0];
  let full = await caches.match(url);
  if (!full) {
    const response = await fetch(url);
    if (!response.ok) return response;
    await (await caches.open(MEDIA_CACHE)).put(url, response.clone());
    full = response;
  }
  const range = request.headers.get("range");
  if (!range) return full;
  const blob = await full.blob();
  const [, from, to] = /bytes=(\d*)-(\d*)/.exec(range) || [];
  const start = Number(from) || 0;
  const end = to ? Math.min(Number(to), blob.size - 1) : blob.size - 1;
  return new Response(blob.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": full.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": `bytes ${start}-${end}/${blob.size}`,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes",
    },
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (request.mode === "navigate") return event.respondWith(navigate(request));
    // Next.js page data: when it fails, Next falls back to a full page load, which the offline shell answers.
    if (request.headers.get("RSC") === "1" || url.searchParams.has("_rsc")) return;
    if (url.pathname.startsWith("/_next/static/")) return event.respondWith(cacheFirst(request, CORE_CACHE));
    if (url.pathname.endsWith(".mp3")) return event.respondWith(audio(request));
    if (url.pathname.startsWith("/_next/image") || url.pathname.startsWith("/banner/"))
      return event.respondWith(cacheFirst(request, MEDIA_CACHE));
    if (PAGES.has(url.pathname)) return event.respondWith(networkFirst(request, CORE_CACHE));
    return;
  }

  if (url.hostname === "verses.quran.foundation") return event.respondWith(cacheFirst(request, MEDIA_CACHE));
  if (url.hostname === "api.aladhan.com") return event.respondWith(networkFirst(request, MEDIA_CACHE));
});

// The audio and Mushaf fonts are large, so they are only downloaded when the reader asks for them.
async function extraStatus() {
  const cache = await caches.open(MEDIA_CACHE);
  const keys = new Set((await cache.keys()).map((r) => r.url));
  const done = EXTRA.filter((u) => keys.has(new URL(u, self.location.origin).href)).length;
  return { done, total: EXTRA.length };
}

async function broadcast(message) {
  for (const client of await self.clients.matchAll({ includeUncontrolled: true })) client.postMessage(message);
}

let downloading = null;

async function downloadExtra() {
  const cache = await caches.open(MEDIA_CACHE);
  const have = new Set((await cache.keys()).map((r) => r.url));
  const queue = EXTRA.filter((u) => !have.has(new URL(u, self.location.origin).href));
  let { done } = await extraStatus();
  let failed = 0;
  async function worker() {
    while (queue.length) {
      const url = queue.shift();
      try {
        const response = await fetch(url, { mode: url.startsWith("http") ? "cors" : "same-origin" });
        if (!response.ok) throw new Error(String(response.status));
        await cache.put(url, response);
        done++;
      } catch {
        failed++;
      }
      broadcast({ type: "noor:offline", done, total: EXTRA.length, running: true });
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  broadcast({ type: "noor:offline", done, total: EXTRA.length, running: false, failed });
}

self.addEventListener("message", (event) => {
  if (event.data === "noor:offline-status") {
    event.waitUntil(
      extraStatus().then((s) => broadcast({ type: "noor:offline", ...s, running: Boolean(downloading), core: true })),
    );
  }
  if (event.data === "noor:offline-download" && !downloading) {
    downloading = downloadExtra().finally(() => (downloading = null));
    event.waitUntil(downloading);
  }
});
