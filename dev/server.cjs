const http = require('http');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..');
const PORT = 3200;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon' };

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  // espelha o cleanUrls do vercel.json: /promo serve promo.html tambem no preview
  else if (!path.extname(rel) && fs.existsSync(path.join(DIR, rel + '.html'))) rel += '.html';
  const file = path.join(DIR, rel);
  if (!file.startsWith(DIR)) { res.writeHead(403).end('403'); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end('<h1>404</h1>'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log('Servindo em http://localhost:' + PORT));
