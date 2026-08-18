/* Wesley Ulloa — interactions: reveals, header, mobile nav, form */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Hero authored moment ---- */
  var hero = document.querySelector('.hero');
  if (hero) { requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('in'); }); }); }

  /* ---- Scroll reveals ---- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var group = e.target.parentElement ? [].slice.call(e.target.parentElement.querySelectorAll(':scope > .reveal')) : [e.target];
          var idx = group.indexOf(e.target);
          e.target.style.transitionDelay = (idx > 0 ? Math.min(idx * 0.06, 0.36) : 0) + 's';
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Header: solidify + hide-on-scroll-down ---- */
  var header = document.getElementById('siteHeader');
  var last = 0, ticking = false;
  function onScroll() {
    var y = window.pageYOffset;
    if (y > 40) header.classList.add('solid'); else header.classList.remove('solid');
    if (y > 560 && y > last + 4) header.classList.add('hide');
    else if (y < last - 4) header.classList.remove('hide');
    last = y; ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  var toggle = document.getElementById('navToggle');
  var drawer = document.getElementById('mobileNav');
  function closeNav() {
    drawer.hidden = true; toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open'); toggle.setAttribute('aria-label', 'Open menu');
  }
  function openNav() {
    drawer.hidden = false; toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open'); toggle.setAttribute('aria-label', 'Close menu');
  }
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      if (drawer.hidden) openNav(); else closeNav();
    });
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) closeNav(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 920 && !drawer.hidden) closeNav(); });
  }

  /* ---- Lead form (demo submit; wire to real inbox/CRM on launch) ---- */
  var form = document.getElementById('leadForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#name');
      var email = form.querySelector('#email');
      if (!name.value.trim() || !email.value.trim()) {
        note.textContent = 'Please add your name and email so Wesley can reach you.';
        note.classList.remove('ok');
        (name.value.trim() ? email : name).focus();
        return;
      }
      note.innerHTML = 'Thank you, ' + name.value.trim().split(' ')[0].replace(/[<>]/g, '') +
        ' — your request is on its way. Wesley’s team will be in touch today.';
      note.classList.add('ok');
      form.reset();
    });
  }

  /* ---- Portfolio lightbox (interactive gallery) ---- */
  var tiles = [].slice.call(document.querySelectorAll('.port-item.is-clickable'));
  if (tiles.length) {
    var ov = document.createElement('div');
    ov.className = 'lb-overlay';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Property image');
    ov.innerHTML =
      '<button class="lb-btn lb-close" aria-label="Close">✕</button>' +
      '<button class="lb-btn lb-prev" aria-label="Previous property">‹</button>' +
      '<button class="lb-btn lb-next" aria-label="Next property">›</button>' +
      '<figure class="lb-figure"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt=""><figcaption class="lb-cap"></figcaption></figure>';
    document.body.appendChild(ov);
    var lbImg = ov.querySelector('img'), lbCap = ov.querySelector('.lb-cap');
    var idx = 0, lastFocus = null;
    function show(i) {
      idx = (i + tiles.length) % tiles.length;
      var t = tiles[idx];
      lbImg.src = t.getAttribute('data-full');
      lbImg.alt = t.getAttribute('data-place') || '';
      lbCap.innerHTML = (t.getAttribute('data-place') || '') + '<small>' + (t.getAttribute('data-meta') || '') + '</small>';
    }
    function openLb(i) { lastFocus = document.activeElement; show(i); ov.classList.add('open'); document.body.classList.add('nav-open'); ov.querySelector('.lb-close').focus(); }
    function closeLb() { ov.classList.remove('open'); document.body.classList.remove('nav-open'); if (lastFocus) lastFocus.focus(); }
    tiles.forEach(function (t, i) { t.addEventListener('click', function () { openLb(i); }); });
    ov.querySelector('.lb-close').addEventListener('click', closeLb);
    ov.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    ov.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    ov.addEventListener('click', function (e) { if (e.target === ov) closeLb(); });
    window.addEventListener('keydown', function (e) {
      if (!ov.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
})();
