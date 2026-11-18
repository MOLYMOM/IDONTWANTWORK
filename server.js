// 월루 오피스 — 멀티플레이 서버 (외부 패키지 없음, Node 18+)
// 실행: node server.js   (PORT 환경변수로 포트 변경 가능, 기본 3000)
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const L = require('./logic.js');

const PORT = process.env.PORT || 3000;
const rooms = new Map(); // code -> { room, clients:Set, timer }

function getRoom(code) {
  let r = rooms.get(code);
  if (!r) { r = { room: L.createRoom(), clients: new Set(), timer: null }; rooms.set(code, r); }
  if (r.timer) { clearTimeout(r.timer); r.timer = null; }
  return r;
}
function broadcast(r) {
  const now = Date.now();
  for (const c of r.clients) c.res.write(`data: ${JSON.stringify(L.view(r.room, now, c.id))}\n\n`);
}
const cleanCode = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'LOBBY';
const cleanId = s => String(s || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);

const STATIC = { '/logic.js': 'logic.js', '/jobs.js': 'jobs.js', '/favicon.svg': 'favicon.svg', '/og.png': 'og.png' };
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
const clean = s => String(s || '').replace(/[^A-Za-z0-9_\-.:]/g, '');
// 배포 주소: SITE_URL 환경변수 (예: https://wolru-office.onrender.com), 없으면 접속한 주소 사용
function siteUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '');
  const proto = req.headers['x-forwarded-proto'] || 'http';
  return `${proto}://${req.headers.host}`;
}
let indexCache = null;
function indexHtml(req) {
  if (!indexCache || process.env.NODE_ENV !== 'production') indexCache = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  let verify = '';
  if (process.env.GOOGLE_SITE_VERIFICATION) verify += `<meta name="google-site-verification" content="${clean(process.env.GOOGLE_SITE_VERIFICATION)}">\n`;
  if (process.env.NAVER_SITE_VERIFICATION) verify += `<meta name="naver-site-verification" content="${clean(process.env.NAVER_SITE_VERIFICATION)}">\n`;
  return indexCache.split('%SITE_URL%').join(siteUrl(req)).replace('<!--VERIFY-->', verify);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-cache' });
    return res.end(indexHtml(req));
  }
  if (req.method === 'GET' && url.pathname === '/robots.txt') {
    res.writeHead(200, { 'Content-Type': TYPES['.txt'] });
    return res.end(`User-agent: *\nAllow: /\nDisallow: /events\nDisallow: /action\n\nSitemap: ${siteUrl(req)}/sitemap.xml\n`);
  }
  if (req.method === 'GET' && url.pathname === '/sitemap.xml') {
    res.writeHead(200, { 'Content-Type': TYPES['.xml'] });
    return res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl(req)}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>\n`);
  }
  if (req.method === 'GET' && STATIC[url.pathname]) {
    const f = STATIC[url.pathname];
    fs.readFile(path.join(__dirname, f), (err, buf) => {
      if (err) { res.writeHead(404); return res.end('not found'); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)], 'Cache-Control': f.endsWith('.js') ? 'no-cache' : 'public, max-age=86400' });
      res.end(buf);
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/ping') { res.writeHead(200); return res.end('ok'); }

  if (req.method === 'GET' && url.pathname === '/events') {
    const code = cleanCode(url.searchParams.get('room'));
    const id = cleanId(url.searchParams.get('id'));
    if (!id) { res.writeHead(400); return res.end(); }
    const r = getRoom(code);
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.write('retry: 2000\n\n');
    L.addPlayer(r.room, id, url.searchParams.get('name'));
    const client = { res, id };
    r.clients.add(client);
    broadcast(r);
    const ping = setInterval(() => res.write(': ping\n\n'), 20000);
    req.on('close', () => {
      clearInterval(ping);
      r.clients.delete(client);
      L.removePlayer(r.room, id);
      broadcast(r);
      if (!r.clients.size) r.timer = setTimeout(() => rooms.delete(code), 10 * 60 * 1000);
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/action') {
    let body = '';
    req.on('data', d => { body += d; if (body.length > 10000) req.destroy(); });
    req.on('end', () => {
      let m; try { m = JSON.parse(body); } catch (e) { res.writeHead(400); return res.end(); }
      const r = rooms.get(cleanCode(m.room));
      if (!r) { res.writeHead(404); return res.end('{}'); }
      const out = L.act(r.room, cleanId(m.id), String(m.type), m.data, Date.now());
      if (out.changed) broadcast(r);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ res: out.res || null }));
    });
    return;
  }

  res.writeHead(404); res.end('not found');
});

setInterval(() => {
  const now = Date.now();
  for (const r of rooms.values()) if (L.tick(r.room, now)) broadcast(r);
}, 150);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  월루 오피스 서버 실행 중 → http://localhost:${PORT}`);
  for (const list of Object.values(os.networkInterfaces()))
    for (const n of list || []) if (n.family === 'IPv4' && !n.internal) console.log(`  같은 네트워크 동료용   → http://${n.address}:${PORT}`);
  console.log('');
});
