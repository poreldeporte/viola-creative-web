/* Motion for the project pages.
 *
 * Three moves, all IntersectionObserver-driven:
 *   cover  — a panel sitting over a piece of media slides down off it while
 *            the image settles from a slight scale-up. The reveal sweeps from
 *            the top edge downwards, matching the reading direction.
 *   rule   — a hairline draws itself across from the left.
 *   line   — a line of type drops into place from above, out of a clip.
 *
 * Same safety rule as the homepage: the markup ships visible and this script
 * hides-then-reveals, so a failure here leaves a readable page rather than a
 * blank one. Everything is off under prefers-reduced-motion.
 */
(function () {
  'use strict';

  function boot() {
    var reduce = !!(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduce || !('IntersectionObserver' in window)) return;

    var q = function (s) { return [].slice.call(document.querySelectorAll(s)); };

    // ── set the "before" state only once we know we can animate ──────────
    var covers = q('[data-cover]');
    covers.forEach(function (el) {
      var panel = document.createElement('span');
      panel.className = 'vc-cover';
      el.appendChild(panel);
      var media = el.querySelector('img,video');
      if (media) media.style.transform = 'scale(1.06)';
    });

    var rules = q('[data-rule]');
    rules.forEach(function (el) {
      el.style.transformOrigin = 'left center';
      el.style.transform = 'scaleX(0)';
    });

    var lines = q('[data-line]');
    lines.forEach(function (el) {
      el.style.transform = 'translateY(-104%)';
      el.style.opacity = '0';
    });

    // ── reveal ────────────────────────────────────────────────────────────
    function show(el) {
      if (el.__shown) return;
      el.__shown = true;
      var d = parseInt(el.getAttribute('data-delay') || '0', 10);

      if (el.hasAttribute('data-cover')) {
        var panel = el.querySelector('.vc-cover');
        var media = el.querySelector('img,video');
        if (panel) {
          panel.style.transition = 'transform 1.05s cubic-bezier(.76,0,.24,1) ' + d + 'ms';
          panel.style.transform = 'translateY(101%)';
        }
        if (media) {
          media.style.transition = 'transform 1.5s cubic-bezier(.22,1,.36,1) ' + d + 'ms';
          media.style.transform = 'none';
        }
        return;
      }
      if (el.hasAttribute('data-rule')) {
        el.style.transition = 'transform .9s cubic-bezier(.76,0,.24,1) ' + d + 'ms';
        el.style.transform = 'none';
        return;
      }
      el.style.transition =
        'transform .8s cubic-bezier(.16,1,.3,1) ' + d + 'ms, opacity .5s ease ' + d + 'ms';
      el.style.transform = 'none';
      el.style.opacity = '1';
    }

    // An element cannot be observed once it is hidden: a line translated out of
    // its clip, or a rule scaled to zero width, has an intersection ratio of 0
    // forever and the observer never fires. Watch a stable parent instead and
    // reveal the child it holds.
    var all = covers.concat(rules, lines);
    var pairs = covers.map(function (el) { return { watch: el, reveal: el }; })
      .concat(rules.map(function (el) { return { watch: el.parentElement || el, reveal: el }; }))
      .concat(lines.map(function (el) { return { watch: el.parentElement || el, reveal: el }; }));

    var byWatch = new Map();
    pairs.forEach(function (p) {
      if (!byWatch.has(p.watch)) byWatch.set(p.watch, []);
      byWatch.get(p.watch).push(p.reveal);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        (byWatch.get(e.target) || []).forEach(show);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -2% 0px', threshold: 0.01 });
    byWatch.forEach(function (_, watch) { io.observe(watch); });

    // nothing may stay hidden because an observer never fired
    setTimeout(function () { all.forEach(show); }, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
