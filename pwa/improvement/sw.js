const cacheList = [
    "/pwa/improvement/index.html",
    "/pwa/improvement/style.css",
    "/pwa/improvement/script.js",
    "/pwa/_conf/icon-192x192.png"
]


self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(cacheList)
        })
    )
})


self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(resp => {
            return resp || fetch(e.request)
        })
    )
})