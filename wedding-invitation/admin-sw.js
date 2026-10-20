// Keeps the admin page and the QR reader available on the door phone when the resort signal drops.
// Network first; the saved copy is used only when the network fails. Database calls are never cached.
const CACHE = 'nd27-admin-v2';
const SHELL = ['admin.html', 'jsQR.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('nd27-admin-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true })));
});

// Reminders and wedding-day cues pushed by the server (supabase/functions/wedding-notify)
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'Wedding Panel', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Wedding Panel', {
    body: d.body || '', tag: d.tag || undefined, renotify: !!d.tag, icon: 'panel-icon-192.png', badge: 'panel-icon-192.png',
    vibrate: [120, 60, 120], data: { url: d.url || 'admin.html#remind' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || 'admin.html#remind', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    const w = ws.find(c => c.url.includes('admin.html'));
    if (w) { w.focus(); return w.navigate ? w.navigate(url).catch(() => {}) : null; }
    return self.clients.openWindow(url);
  }));
});
