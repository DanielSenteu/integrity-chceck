#!/usr/bin/env node
/* ───────────────────────────────────────────────────────────────
   build.js — single-source the nav + footer across every page.

   Edit partials/nav.html and partials/footer.html, then run:
       npm run build
   It injects them into each public/*.html between the markers:
       <!-- nav:start -->    ... <!-- nav:end -->
       <!-- footer:start --> ... <!-- footer:end -->
   and sets the active nav link per page (via data-nav matching the
   filename). Keeps chrome from drifting as pages are added.
─────────────────────────────────────────────────────────────── */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'docs');
const PARTIALS = path.join(ROOT, 'partials');

function read(p) { return fs.readFileSync(p, 'utf8'); }

const nav = read(path.join(PARTIALS, 'nav.html')).trim();
const footer = read(path.join(PARTIALS, 'footer.html')).trim();

function injectBlock(html, name, content) {
  const re = new RegExp('<!-- ' + name + ':start -->[\\s\\S]*?<!-- ' + name + ':end -->');
  const block = '<!-- ' + name + ':start -->\n' + content + '\n<!-- ' + name + ':end -->';
  return re.test(html) ? html.replace(re, block) : html;
}

function setActiveNav(html, page) {
  // mark the link whose data-nav matches this page's basename as active
  return html.replace(/(<a\b[^>]*\bdata-nav="([^"]+)"[^>]*\bclass=")([^"]*)(")/g,
    (m, pre, key, cls, post) => pre + cls.replace(/\bactive\b/g, '').trim() + post)
    // first strip existing active, then add to the matching one
    .replace(new RegExp('(<a\\b[^>]*\\bdata-nav="' + page + '"[^>]*)(>)'),
      (m, a, close) => /class="/.test(a) ? a.replace(/class="/, 'class="active ') + close : a + ' class="active"' + close);
}

const pages = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'));
let count = 0;
for (const file of pages) {
  const fp = path.join(PUBLIC, file);
  let html = read(fp);
  const page = path.basename(file, '.html');
  html = injectBlock(html, 'nav', nav);
  html = injectBlock(html, 'footer', footer);
  html = setActiveNav(html, page);
  fs.writeFileSync(fp, html);
  count++;
  console.log('  synced', file);
}
console.log('✔ build complete —', count, 'page(s)');
