const CACHE_NAME = "annuaire-v1";

const FILES = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/eleves.json",
    "/manifest.json"
];

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(r => {
            return r || fetch(e.request);
        })
    );
});