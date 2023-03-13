const CACHE_LIST = [
    '/pwa/improve/index.html',
    '/pwa/improve/index.html?page=topic-add',
    '/pwa/improve/index.html?page=topic-detail',
    '/pwa/_util/style.css',
    '/pwa/improve/style.css',
    '/pwa/_util/script.js',
    '/pwa/improve/script.js',
    '/pwa/_conf/icon-192x192.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css'
];


self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('static_improve').then(cache =>
            cache.addAll(CACHE_LIST)
        )
    );
});


self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(resp =>
            resp || fetch(e.request)
        )
    );
});