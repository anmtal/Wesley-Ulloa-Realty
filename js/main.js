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
})();
