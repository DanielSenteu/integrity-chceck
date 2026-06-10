/* ═══════════════════════════════════════════════════════════════
   Integrity Check Limited — main.js
   Vanilla, dependency-free. Degrades gracefully + respects reduced motion.
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var on = function (el, ev, fn, o) { el && el.addEventListener(ev, fn, o || { passive: true }); };

  /* ── Current year ───────────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(function (n) {
    n.textContent = new Date().getFullYear();
  });

  /* ── Navbar: solid on scroll + mobile toggle ────────── */
  var nav = document.getElementById('navbar');
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  function syncNav() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 40); }
  syncNav();
  on(window, 'scroll', syncNav);

  on(toggle, 'click', function () {
    var open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links && links.querySelectorAll('a').forEach(function (a) {
    on(a, 'click', function () {
      links.classList.remove('open'); toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Scroll progress bar ────────────────────────────── */
  var bar = document.getElementById('scroll-progress');
  function progress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }
  if (bar) { progress(); on(window, 'scroll', progress); on(window, 'resize', progress); }

  /* ── Reveal on scroll (IntersectionObserver) ────────── */
  var revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.hasAttribute('data-reveal-stagger')) {
          Array.prototype.forEach.call(el.children, function (c, i) {
            c.style.transitionDelay = (i * 0.09) + 's';
          });
        }
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ── Hero headline: word line-mask reveal ───────────── */
  var hero = document.querySelector('[data-hero-title]');
  if (hero && !reduce) {
    var frag = document.createDocumentFragment();
    Array.prototype.forEach.call(hero.childNodes, function (node) {
      var isAccent = node.nodeType === 1 && node.classList.contains('accent');
      var text = (node.textContent || '').trim();
      if (!text) return;
      text.split(/\s+/).forEach(function (word) {
        var mask = document.createElement('span');
        mask.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
        var inner = document.createElement('span');
        inner.textContent = word;
        inner.style.cssText = 'display:inline-block;transform:translateY(110%);transition:transform .9s cubic-bezier(.16,1,.3,1);';
        if (isAccent) inner.className = 'accent';
        mask.appendChild(inner);
        frag.appendChild(mask);
        frag.appendChild(document.createTextNode(' '));
      });
    });
    hero.textContent = '';
    hero.appendChild(frag);
    var words = hero.querySelectorAll('span > span');
    requestAnimationFrame(function () {
      words.forEach(function (w, i) {
        w.style.transitionDelay = (0.25 + i * 0.06) + 's';
        w.style.transform = 'translateY(0)';
      });
    });
  }

  /* ── Process timeline: scroll-driven fill + activate ── */
  var track = document.querySelector('[data-process]');
  if (track) {
    var rail = track.querySelector('.process-rail i');
    var steps = Array.prototype.slice.call(track.querySelectorAll('.pstep'));
    var ticking = false;
    function updateProcess() {
      ticking = false;
      var r = track.getBoundingClientRect();
      var vh = window.innerHeight;
      // progress as the track passes through the middle band of the viewport
      var p = (vh * 0.78 - r.top) / (r.height + vh * 0.42);
      p = Math.max(0, Math.min(1, p));
      if (rail) rail.style.setProperty('--p', (p * 100) + '%');
      var active = Math.round(p * steps.length);
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i < active); });
    }
    function onScrollProc() { if (!ticking) { ticking = true; requestAnimationFrame(updateProcess); } }
    if (reduce) { steps.forEach(function (s) { s.classList.add('is-active'); }); if (rail) rail.style.setProperty('--p', '100%'); }
    else { updateProcess(); on(window, 'scroll', onScrollProc); on(window, 'resize', onScrollProc); }
  }

  /* ── Number count-ups ───────────────────────────────── */
  var countWrap = document.querySelector('[data-counts]');
  if (countWrap) {
    var counters = countWrap.querySelectorAll('[data-count]');
    function runCounts() {
      counters.forEach(function (el) {
        var target = parseFloat(el.getAttribute('data-count')) || 0;
        if (reduce) { el.textContent = target; return; }
        var start = null, dur = 1400;
        function step(ts) {
          if (!start) start = ts;
          var t = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(eased * target);
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
    if ('IntersectionObserver' in window && !reduce) {
      var co = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { runCounts(); co.disconnect(); } });
      }, { threshold: 0.4 });
      co.observe(countWrap);
    } else { runCounts(); }
  }

  /* ── Parallax background (transform only) ───────────── */
  var parallax = document.querySelectorAll('[data-parallax]');
  if (parallax.length && !reduce) {
    var pTick = false;
    function par() {
      pTick = false;
      parallax.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        var off = (r.top + r.height / 2 - window.innerHeight / 2) * -0.08;
        el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      });
    }
    function onPar() { if (!pTick) { pTick = true; requestAnimationFrame(par); } }
    par(); on(window, 'scroll', onPar); on(window, 'resize', onPar);
  }

  /* ── Magnetic buttons (desktop fine-pointer only) ───── */
  if (window.matchMedia('(pointer:fine)').matches && !reduce) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      on(btn, 'mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.35;
        var y = (e.clientY - r.top - r.height / 2) * 0.4;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      on(btn, 'mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ── Hero network constellation (canvas) ────────────── */
  var canvas = document.getElementById('hero-net');
  if (canvas && !reduce && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, nodes = [], raf = null;
    var mouse = { x: -9999, y: -9999 };
    var LINK = 132;       // connection distance
    var hero = document.getElementById('hero');

    function size() {
      var r = hero.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var target = Math.min(96, Math.round((W * H) / 17000));
      nodes = [];
      for (var i = 0; i < target; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
          accent: Math.random() < 0.12
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        // links to other nodes
        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j];
          var dx = n.x - m.x, dy = n.y - m.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            var a = (1 - d / LINK) * 0.16;
            ctx.strokeStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
        // link to pointer (emerald)
        var mdx = n.x - mouse.x, mdy = n.y - mouse.y;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 170) {
          var ma = (1 - md / 170) * 0.5;
          ctx.strokeStyle = 'rgba(39,151,122,' + ma.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        // node dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.accent ? 2.1 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = n.accent ? 'rgba(39,151,122,.85)' : 'rgba(176,183,195,.5)';
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    size();
    frame();
    on(window, 'resize', function () { dpr = Math.min(window.devicePixelRatio || 1, 2); size(); });
    on(hero, 'mousemove', function (e) { var r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    on(hero, 'mouseleave', function () { mouse.x = -9999; mouse.y = -9999; });
    on(document, 'visibilitychange', function () {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) frame();
    });
  }

  /* ── Custom cursor (desktop fine-pointer only) ──────── */
  if (window.matchMedia('(pointer:fine)').matches && !reduce && !('ontouchstart' in window)) {
    var dot = document.createElement('div'); dot.className = 'cursor-dot';
    var ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.body.classList.add('has-cursor');
    var mx = 0, my = 0, rx = 0, ry = 0, started = false;
    on(window, 'mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      if (!started) { started = true; rx = mx; ry = my; loop(); }
    });
    function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    }
    var hoverSel = 'a, button, .btn, [data-cursor="hover"]';
    on(document, 'mouseover', function (e) { if (e.target.closest(hoverSel)) ring.classList.add('is-hover'); }, true);
    on(document, 'mouseout', function (e) { if (e.target.closest(hoverSel)) ring.classList.remove('is-hover'); }, true);
  }
})();
