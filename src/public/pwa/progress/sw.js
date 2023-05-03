const CACHE_LIST = [
    '/pwa/progress/index.html',
    '/pwa/progress/index.html?page=task-list',
    '/pwa/progress/index.html?page=task-detail',
    '/pwa/progress/index.html?page=task-add',
    '/pwa/progress/index.html?page=assignment',
    '/pwa/_util/style.css',
    '/pwa/progress/style.css',
    '/pwa/_util/script.js',
    '/pwa/progress/script.js',
    '/pwa/_conf/progress/icon-192x192.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/webfonts/fa-regular-400.woff2'
];

const CACHE_NAME_PREFIX = 'cache_progress';
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