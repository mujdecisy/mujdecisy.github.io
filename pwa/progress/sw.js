const cacheList = [
    "/pwa/progress/index.html",
    "/pwa/progress/style.css",
    "/pwa/progress/script.js",
    "/pwa/_conf/icon-192x192.png",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
]


self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("static_progress").then(cache => {
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