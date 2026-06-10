#!/usr/bin/env node
/* Minimal static preview server for public/ with production-style
   security headers. For local viewing only: `npm start` → http://localhost:4321 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'docs');
const PORT = process.env.PORT || 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.json': 'application/json', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

// Headers we'd set at the edge in production (CSP allows Google Fonts only).
const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "media-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  let fp = path.join(ROOT, path.normalize(urlPath));
  if (!fp.startsWith(ROOT)) { res.writeHead(403).end('Forbidden'); return; }
  if (!path.extname(fp)) fp += '.html';

  const cap = /[?&]cap=1\b/.test(req.url);
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/html' }).end('<h1>404</h1>'); return; }
    let out = data;
    // Capture mode: pin hero height + reveal everything so a tall-window
    // headless screenshot grabs the whole page (dev-only; never in prod).
    if (cap && path.extname(fp) === '.html') {
      const style = '<style>html{scroll-behavior:auto!important}#hero{min-height:760px!important;height:760px!important}' +
        '[data-reveal],[data-reveal-stagger]>*{opacity:1!important;transform:none!important}' +
        '.em-shield,.em-check{stroke-dashoffset:0!important;animation:none!important}' +
        '.em-bar{transform:none!important;animation:none!important}' +
        '.em-ring{opacity:1!important;animation:none!important}' +
        '.hero-title span{transform:none!important}</style>';
      out = Buffer.from(data.toString('utf8').replace('</head>', style + '</head>'), 'utf8');
    }
    const headers = Object.assign({ 'Content-Type': TYPES[path.extname(fp)] || 'application/octet-stream' }, SECURITY);
    res.writeHead(200, headers).end(out);
  });
});

// If the chosen port is taken, try the next few automatically instead of crashing.
let port = Number(PORT);
let attempts = 0;
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE' && attempts < 10) {
    attempts++;
    console.warn('  port ' + port + ' in use — trying ' + (port + 1) + '…');
    port++;
    setTimeout(() => server.listen(port), 120);
  } else {
    console.error('Server error:', err.message);
    process.exit(1);
  }
});
server.listen(port, () => console.log('▸ Integrity Check preview → http://localhost:' + port));
