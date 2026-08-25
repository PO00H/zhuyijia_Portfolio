/* MeshCraft demo — Service Worker：拦截 <img src="/api/localimg?..."> 等
 * 非 fetch 的子资源请求（fetch 已被页面内 shim 拦截，不会到达这里）。 */
const PIXEL_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGBgAAAABQABpfZFQAAAAABJRU5ErkJggg==';

function pixelBytes() {
  const s = atob(PIXEL_B64);
  const u = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
  return u;
}

self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(clients.claim()); });

self.addEventListener('fetch', (e) => {
  let u;
  try { u = new URL(e.request.url); } catch (err) { return; }
  if (u.origin !== location.origin) return;
  if (!u.pathname.startsWith('/api/')) return;
  if (u.pathname === '/api/localimg' || u.pathname === '/api/eval/proxy_glb') {
    e.respondWith(new Response(pixelBytes(), {
      status: 200, headers: { 'Content-Type': 'image/png' },
    }));
    return;
  }
  // 其余 /api 子资源（如插件下载 <a href>）：返回空占位，避免 404
  e.respondWith(new Response('MeshCraft demo placeholder\n', {
    status: 200, headers: { 'Content-Type': 'application/octet-stream' },
  }));
});
