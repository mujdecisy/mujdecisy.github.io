const CACHE_LIST = [
    '/pwa/progress/index.html',
    '/pwa/progress/index.html?page=task-list',
    '/pwa/progress/index.html?page=task-detail',
    '/pwa/progress/index.html?page=task-add',
    '/pwa/progress/index.html?page=assignment',
    '/pwa/progress/style.css',
    '/pwa/progress/script.js',
    '/pwa/_conf/icon-192x192.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css'
];


self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('static_progress').then(cache =>
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