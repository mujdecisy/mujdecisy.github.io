const CACHE_LIST = [
    '/pwa/improve/index.html',
    '/pwa/improve/index.html?page=topic-add',
    '/pwa/improve/index.html?page=topic-detail',
    '/pwa/improve/index.html?page=iter-add',
    '/pwa/improve/index.html?page=io',
    '/pwa/_util/style.css',
    '/pwa/improve/style.css',
    '/pwa/_util/script.js',
    '/pwa/improve/script.js',
    '/pwa/_conf/icon-192x192.png',
    '/favicon.ico',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/regression/2.0.1/regression.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js@4.2.1/dist/chart.umd.min.js'
];

const CACHE_NAME_PREFIX = 'cache_improve';
const VERSION = '1.0.2';
const CACHE_NAME = `${CACHE_NAME_PREFIX}=${VERSION}`;


self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            cache.addAll(CACHE_LIST)
        )
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(cacheNames =>
                Promise.all(
                    cacheNames
                        .filter(cacheName =>
                            cacheName !== CACHE_NAME && cacheName.startsWith(CACHE_NAME_PREFIX)
                        )
                        .map(cacheName =>
                            caches.delete(cacheName)
                        )
                )
            )
    );
});


self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(resp =>
                resp || fetch(e.request)
            )
    );
});