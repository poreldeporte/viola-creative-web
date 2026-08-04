/* Viola Creative — extracted from the approved design file.
   Behaviour is unchanged from the design tool's Component class: the markup
   ships visible and this script hides-then-reveals, so a failure here degrades
   to a fully readable page rather than a blank one. */
(function () {
  'use strict';

  class VCSite {
    componentDidMount() {
      this.cleanups = [];
      // Guarantee the head essentials land even if the host strips helmet tags.
      try {
        document.documentElement.lang = 'en';
        if (!document.title) document.title = 'Viola Creative — Design, engineering and AI agent workflows';
      } catch (e) {}
      this.reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      this.setupReveals();
      this.setupScrollLoop();
      this.setupServices();
      this.setupCases();
      this.setupForm();
      this.setupMagnetic();
      this.setupTilt();
      this.drawHub();
      this.drawOrg();
      this.setupChart();
      this.setupNavCondense();
      this.setupStack();
      this.setupHovers();
      this.setupFaqMotion();
      this.setupFieldFocus();
      this.animateHero();
      if (!this.reduce) this.whenAnime(() => this.floatHubChips());
    }

    /* anime.js is an enhancement — every animated element is already visible
       without it, so a blocked CDN costs polish, never content. */
    whenAnime(cb, tries) {
      tries = tries || 0;
      if (window.anime) return cb(window.anime);
      if (tries > 60) return;
      const t = setTimeout(() => this.whenAnime(cb, tries + 1), 50);
      this.cleanups.push(() => clearTimeout(t));
    }

    splitWords(el) {
      const out = [];
      [].slice.call(el.childNodes).forEach((k) => {
        if (k.nodeType === 3) {
          const frag = document.createDocumentFragment();
          k.textContent.split(/(\s+)/).forEach((p) => {
            if (p === '') return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            const sp = document.createElement('span');
            sp.textContent = p;
            sp.style.display = 'inline-block';
            sp.style.willChange = 'transform,opacity';
            frag.appendChild(sp);
            out.push(sp);
          });
          el.replaceChild(frag, k);
        } else if (k.nodeType === 1 && k.nodeName !== 'BR') {
          k.style.display = 'inline-block';
          out.push(k);
        }
      });
      return out;
    }

    /* Word stagger on CSS transitions so the headline cannot be trapped hidden. */
    animateHero() {
      const h1 = document.querySelector('[data-hero-h1]');
      if (!h1 || h1.__done || this.reduce) return;
      h1.__done = true;
      const words = this.splitWords(h1);
      if (!words.length) return;
      words.forEach((w) => {
        w.style.opacity = '0';
        w.style.transform = 'translateY(42px) rotate(3deg)';
      });
      const play = () => words.forEach((w, i) => {
        w.style.transition = 'opacity .62s cubic-bezier(.22,1,.36,1) ' + (90 + i * 46) + 'ms, transform .92s cubic-bezier(.22,1,.36,1) ' + (90 + i * 46) + 'ms';
        w.style.opacity = '1';
        w.style.transform = 'none';
      });
      requestAnimationFrame(() => requestAnimationFrame(play));
      const safety = setTimeout(play, 1200);
      this.cleanups.push(() => clearTimeout(safety));
    }

    floatHubChips() {
      const chips = [].slice.call(this.q('[data-hub-chip]'));
      if (!chips.length) return;
      const t = setTimeout(() => {
        chips.forEach((c, i) => {
          const a = window.anime({ targets: c, translateY: [0, -7], direction: 'alternate', loop: true, duration: 2100 + i * 150, delay: i * 110, easing: 'easeInOutSine' });
          this.anims = this.anims || [];
          this.anims.push(a);
        });
        this.cleanups.push(() => (this.anims || []).forEach((a) => { try { a.pause(); } catch (e) {} }));
      }, 900);
      this.cleanups.push(() => clearTimeout(t));
    }

    /* Hover states, all transform/colour only — nothing here gates visibility. */
    setupHovers() {
      const bind = (el, enter, leave) => {
        el.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') enter(); });
        el.addEventListener('pointerleave', leave);
        el.addEventListener('focusin', enter);
        el.addEventListener('focusout', leave);
        this.cleanups.push(() => {
          el.removeEventListener('pointerleave', leave);
          el.removeEventListener('focusout', leave);
        });
      };

      this.q('[data-stack-card]').forEach((card) => {
        const btn = card.querySelector('button');
        if (btn) btn.style.transition = 'border-color .3s ease';
        bind(card,
          () => { if (btn) btn.style.borderColor = 'rgba(255,61,35,.55)'; },
          () => { if (btn) btn.style.borderColor = 'rgba(21,19,14,.16)'; });
      });

      this.q('[data-svc-item]').forEach((row) => {
        const title = row.querySelector('[data-svc-title]');
        bind(row,
          () => { if (title && row.getAttribute('aria-expanded') !== 'true') title.style.color = '#2c2822'; },
          () => { if (title && row.getAttribute('aria-expanded') !== 'true') title.style.color = '#5d574c'; });
      });

      this.q('#process [data-proc-card]').forEach((card) => {
        card.style.transition = 'transform .4s cubic-bezier(.22,1,.36,1), border-color .3s ease';
        bind(card,
          () => { if (!this.reduce) { card.style.transform = 'translateY(-5px)'; card.style.borderColor = 'rgba(255,61,35,.42)'; } },
          () => { card.style.transform = 'none'; card.style.borderColor = 'rgba(21,19,14,.14)'; });
      });

      this.q('details summary').forEach((sum) => {
        sum.style.transition = 'color .22s ease';
        bind(sum, () => { sum.style.color = '#BE2D18'; }, () => { sum.style.color = ''; });
      });
    }

    setupFaqMotion() {
      if (this.reduce) return;
      this.q('details').forEach((d) => {
        const body = d.querySelector('p');
        if (!body) return;
        const onToggle = () => {
          if (!d.open) return;
          body.style.transition = 'none';
          body.style.transform = 'translateY(-8px)';
          body.style.opacity = '0.35';
          const play = () => { body.style.transition = 'transform .45s cubic-bezier(.22,1,.36,1), opacity .35s ease'; body.style.transform = 'none'; body.style.opacity = '1'; };
          requestAnimationFrame(() => requestAnimationFrame(play));
          setTimeout(play, 320);
        };
        d.addEventListener('toggle', onToggle);
        this.cleanups.push(() => d.removeEventListener('toggle', onToggle));
      });
    }

    setupFieldFocus() {
      this.q('[data-lead-form] input, [data-lead-form] textarea').forEach((f) => {
        f.style.transition = 'border-color .2s ease, box-shadow .2s ease';
        const on = () => { f.style.borderColor = '#BE2D18'; f.style.boxShadow = '0 0 0 3px rgba(190,45,24,.12)'; };
        const off = () => { f.style.borderColor = 'rgba(21,19,14,.2)'; f.style.boxShadow = 'none'; };
        f.addEventListener('focus', on);
        f.addEventListener('blur', off);
        this.cleanups.push(() => { f.removeEventListener('focus', on); f.removeEventListener('blur', off); });
      });
    }

    /* Each card is sticky, so the next one physically covers it. anime.js holds a
       paused timeline per card that we seek() to the coverage ratio — the card
       underneath recedes as the next slides over it. */
    setupStack() {
      const cards = this.q('[data-stack-card]');
      if (cards.length < 2 || this.reduce || !window.anime) return;
      const anims = [];
      for (let i = 0; i < cards.length - 1; i++) {
        const btn = cards[i].querySelector('button');
        if (!btn) continue;
        btn.style.transformOrigin = '50% 0%';
        anims.push({
          card: cards[i],
          next: cards[i + 1],
          top: parseFloat(cards[i].style.top) || 96,
          a: window.anime({
            targets: btn,
            scale: [1, 0.912],
            translateY: [0, -26],
            filter: ['brightness(1)', 'brightness(0.55)'],
            easing: 'linear',
            autoplay: false,
            duration: 1000
          })
        });
      }
      this.stackApply = () => {
        const vh = window.innerHeight;
        for (let i = 0; i < anims.length; i++) {
          const it = anims[i];
          const nextTop = it.next.getBoundingClientRect().top;
          const span = vh - it.top;
          const p = span > 0 ? Math.max(0, Math.min(1, (vh - nextTop) / span)) : 0;
          it.a.seek(it.a.duration * p);
        }
      };
      this.stackApply();
    }

    setupNavCondense() {
      const nav = document.querySelector('nav');
      if (!nav) return;
      nav.style.transition = 'padding .3s ease, box-shadow .3s ease';
      const logo = nav.querySelector('[data-logo]');
      this.navTick = (y) => {
        const on = y > 80;
        nav.style.paddingTop = on ? '11px' : '18px';
        nav.style.paddingBottom = on ? '11px' : '18px';
        nav.style.boxShadow = on ? '0 10px 30px rgba(21,19,14,.08)' : 'none';
        if (logo) logo.style.height = on ? '22px' : '26px';
      };
    }

    q(sel) { return document.querySelectorAll(sel); }

    /* Reveals: markup ships visible. JS hides then animates in, so a failed
       script or a missing IntersectionObserver can never blank the page. */
    setupReveals() {
      const els = [].slice.call(this.q('[data-reveal]'));
      if (!els.length) return;
      if (this.reduce || !('IntersectionObserver' in window)) return;
      els.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = el.getAttribute('data-reveal') === 'scale' ? 'scale(.97)' : 'translateY(26px)';
        el.style.willChange = 'opacity,transform';
      });
      const show = (el) => {
        if (el.__shown) return;
        el.__shown = true;
        const d = parseInt(el.getAttribute('data-delay') || '0', 10);
        // CSS, never anime: transitions still complete in a backgrounded document,
        // rAF-driven libraries do not — and this is what makes content visible.
        el.style.transition = 'opacity .7s cubic-bezier(.22,1,.36,1) ' + d + 'ms, transform .85s cubic-bezier(.22,1,.36,1) ' + d + 'ms';
        el.style.opacity = '1';
        el.style.transform = 'none';
      };
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
      els.forEach((el) => io.observe(el));
      this.cleanups.push(() => io.disconnect());
      const safety = setTimeout(() => els.forEach(show), 4000);
      this.cleanups.push(() => clearTimeout(safety));
    }

    /* One rAF loop polling scrollTop — scroll EVENTS do not fire in every
       embedding context, but reading the value always works. */
    setupScrollLoop() {
      const bar = document.querySelector('[data-progress]');
      let last = -1, raf = 0;
      const tick = () => {
        // Reschedule FIRST: one throwing frame must never kill scroll tracking
        // for the rest of the session.
        raf = requestAnimationFrame(tick);
        try {
          const se = document.scrollingElement || document.documentElement;
          const y = se.scrollTop;
          if (y === last) return;
          last = y;
          const max = se.scrollHeight - se.clientHeight;
          if (bar) bar.style.width = (max > 0 ? Math.max(0, Math.min(100, (y / max) * 100)) : 0).toFixed(2) + '%';
          if (this.hubApply) this.hubApply(y);
          if (this.navTick) this.navTick(y);
          if (this.stackApply) this.stackApply();
        } catch (e) {
          last = -1;
        }
      };
      raf = requestAnimationFrame(tick);
      this.cleanups.push(() => cancelAnimationFrame(raf));
    }



    /* Delegated so it works regardless of when the rows reach the DOM. */
    setupServices() {
      const select = (id) => {
        this.q('[data-svc-item]').forEach((r) => {
          const on = r.getAttribute('data-svc-item') === id;
          r.setAttribute('aria-expanded', on ? 'true' : 'false');
          const num = r.querySelector('[data-svc-num]');
          const title = r.querySelector('[data-svc-title]');
          const sign = r.querySelector('[data-svc-sign]');
          if (num) num.style.color = on ? '#BE2D18' : '#6E675B';
          if (title) { title.style.color = on ? '#15130E' : '#5d574c'; title.style.fontWeight = on ? '700' : '500'; }
          if (sign) sign.style.transform = on ? 'rotate(45deg)' : 'rotate(0deg)';
        });
        this.q('[data-svc-body]').forEach((b) => {
          const on = b.getAttribute('data-svc-body') === id;
          b.style.display = on ? 'grid' : 'none';
          if (!on || this.reduce || !window.anime) return;
          const anime = window.anime;
          const kids = [].slice.call(b.children);
          const chips = [].slice.call(b.querySelectorAll('span'));
          anime.remove(kids);
          anime.remove(chips);
          // transform-only, so a stalled rAF can never hide the copy
          anime({ targets: kids, translateY: [16, 0], duration: 640, delay: anime.stagger(70), easing: 'easeOutExpo' });
          if (chips.length) anime({ targets: chips, scale: [0.86, 1], duration: 500, delay: anime.stagger(45, { start: 120 }), easing: 'easeOutBack' });
        });
      };
      const hit = (e) => {
        const t = e.target && e.target.closest ? e.target.closest('[data-svc-item]') : null;
        if (t) select(t.getAttribute('data-svc-item'));
      };
      document.addEventListener('click', hit);
      document.addEventListener('focusin', hit);
      this.cleanups.push(() => {
        document.removeEventListener('click', hit);
        document.removeEventListener('focusin', hit);
      });
    }

    setupCases() {
      const overlay = document.querySelector('[data-case-overlay]');
      if (!overlay) return;
      const panels = {};
      this.q('[data-case-panel]').forEach((p) => { panels[p.getAttribute('data-case-panel')] = p; });
      let opener = null;
      const open = (id) => {
        Object.keys(panels).forEach((k) => { panels[k].style.display = k === id ? 'block' : 'none'; });
        overlay.style.display = 'flex';
        overlay.scrollTop = 0;
        document.body.style.overflow = 'hidden';
        const card = overlay.firstElementChild;
        if (card && !this.reduce) {
          card.style.transition = 'none';
          card.style.transform = 'translateY(24px) scale(.99)';
          const play = () => { card.style.transition = 'transform .58s cubic-bezier(.22,1,.36,1)'; card.style.transform = 'none'; };
          requestAnimationFrame(() => requestAnimationFrame(play));
          setTimeout(play, 400);
        }
        const c = overlay.querySelector('[data-case-close]');
        if (c) c.focus();
      };
      const close = () => {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        if (opener) { try { opener.focus(); } catch (e) {} }
      };
      this.q('[data-case-open]').forEach((b) => {
        b.addEventListener('click', () => { opener = b; open(b.getAttribute('data-case-open')); });
      });
      overlay.querySelectorAll('[data-case-close]').forEach((b) => b.addEventListener('click', close));
      overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
      const onKey = (e) => { if (e.key === 'Escape' && overlay.style.display === 'flex') close(); };
      document.addEventListener('keydown', onKey);
      this.cleanups.push(() => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; });
    }

    /* POSTs to the /api/lead function. If that is unreachable the brief is
       handed to a mailto: so a submission is never silently lost. */
    setupForm() {
      const form = document.querySelector('[data-lead-form]');
      if (!form) return;
      const done = form.querySelector('[data-form-done]');
      const err = form.querySelector('[data-form-error]');
      const btn = form.querySelector('button[type="submit"]');
      const rendered = Date.now();
      const get = (n) => { const f = form.querySelector('[name="' + n + '"]'); return f ? f.value.trim() : ''; };

      const showError = (msg) => { if (err) { err.style.display = 'block'; err.textContent = msg; } };
      const succeed = () => {
        if (done) done.style.display = 'flex';
        form.querySelectorAll('[data-form-fields]').forEach((f) => { f.style.display = 'none'; });
      };
      const mailtoFallback = (name) => {
        const body = ['Name: ' + name, 'Company: ' + get('company'), 'Timeline: ' + get('stack'), '', get('brief')].join('\n');
        const href = 'mailto:hello@violacreative.com?subject='
          + encodeURIComponent('Project enquiry — ' + (get('company') || name))
          + '&body=' + encodeURIComponent(body);
        try { window.location.href = href; } catch (e) {}
      };

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = get('name'), email = get('email');
        if (!name || !email || email.indexOf('@') < 1) {
          showError('Add your name and a valid email so we can reply.');
          return;
        }
        if (err) err.style.display = 'none';
        if (btn) { btn.disabled = true; btn.style.opacity = '.6'; btn.textContent = 'Sending…'; }

        const restore = () => {
          if (btn) { btn.disabled = false; btn.style.opacity = ''; btn.textContent = 'Send the brief →'; }
        };

        fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name, email: email, company: get('company'), stack: get('stack'),
            brief: get('brief'), website: get('website'), elapsed: Date.now() - rendered,
          }),
        }).then((r) => r.json().catch(() => ({})).then((d) => ({ ok: r.ok, d: d })))
          .then((r) => {
            if (r.ok && r.d && r.d.ok) return succeed();
            if (r.d && r.d.error && r.d.error !== 'send_failed' && r.d.error !== 'mail_unconfigured') {
              restore();
              return showError(r.d.error);
            }
            // the backend is up but could not send — do not lose the brief
            restore();
            mailtoFallback(name);
            succeed();
          })
          .catch(() => { restore(); mailtoFallback(name); succeed(); });
      });
    }

    setupMagnetic() {
      if (this.reduce) return;
      this.q('[data-magnetic]').forEach((el) => {
        const s = 0.12;
        el.style.willChange = 'transform';
        const move = (ev) => {
          const r = el.getBoundingClientRect();
          el.style.transition = 'transform .12s ease-out';
          el.style.transform = 'translate(' + ((ev.clientX - (r.left + r.width / 2)) * s).toFixed(1) + 'px,' + ((ev.clientY - (r.top + r.height / 2)) * s).toFixed(1) + 'px)';
        };
        const leave = () => { el.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)'; el.style.transform = 'translate(0,0)'; };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        this.cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
      });
    }

    setupTilt() {
      if (this.reduce) return;
      this.q('[data-tilt]').forEach((el) => {
        el.style.willChange = 'transform';
        const move = (ev) => {
          const r = el.getBoundingClientRect();
          const px = (ev.clientX - (r.left + r.width / 2)) / (r.width / 2 || 1);
          const py = (ev.clientY - (r.top + r.height / 2)) / (r.height / 2 || 1);
          el.style.transition = 'transform .1s ease-out';
          el.style.transform = 'perspective(1100px) rotateY(' + (px * 4).toFixed(2) + 'deg) rotateX(' + (-py * 4).toFixed(2) + 'deg)';
        };
        const leave = () => { el.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)'; el.style.transform = 'perspective(1100px)'; };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        this.cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
      });
    }

    setupChart() {
      const lines = [].slice.call(this.q('[data-chart-line]'));
      if (!lines.length || this.reduce || !('IntersectionObserver' in window)) return;
      lines.forEach((p, i) => {
        p.style.transformBox = 'fill-box';
        p.style.transformOrigin = '0% 50%';
        p.style.transform = 'scaleX(0)';
        p.style.transition = 'transform 1.4s cubic-bezier(.4,0,.2,1) ' + (i * 220) + 'ms';
      });
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { lines.forEach((p) => { p.style.transform = 'scaleX(1)'; }); io.disconnect(); } });
      }, { threshold: 0.3 });
      io.observe(lines[0]);
      this.cleanups.push(() => io.disconnect());
    }

    drawHub() {
      const stage = document.querySelector('[data-hub-stage]');
      if (!stage) return;
      const svg = stage.querySelector('[data-hub-lines]');
      const lines = [].slice.call(stage.querySelectorAll('[data-hub-line]'));
      const anchors = [].slice.call(stage.querySelectorAll('[data-hub-anchor]'));
      const core = stage.querySelector('[data-hub-core]');
      let vecs = [];
      const measure = () => {
        const rect = stage.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        if (svg) svg.setAttribute('viewBox', '0 0 ' + rect.width + ' ' + rect.height);
        const cx = rect.width / 2, cy = rect.height / 2;
        vecs = anchors.map((a, i) => {
          const r = a.getBoundingClientRect();
          const x = r.left - rect.left + r.width / 2;
          const y = r.top - rect.top + r.height / 2;
          const ln = lines[i];
          if (ln) { ln.setAttribute('x1', cx); ln.setAttribute('y1', cy); ln.setAttribute('x2', x); ln.setAttribute('y2', y); }
          const dx = x - cx, dy = y - cy;
          return { x: dx, y: dy, R: Math.hypot(dx, dy), th: Math.atan2(dy, dx) };
        });
      };
      measure();
      const onResize = () => measure();
      window.addEventListener('resize', onResize, { passive: true });
      this.cleanups.push(() => window.removeEventListener('resize', onResize));
      [250, 800].forEach((ms) => { const t = setTimeout(measure, ms); this.cleanups.push(() => clearTimeout(t)); });
      if (this.reduce) return;

      const wraps = anchors.map((a) => {
        const chip = a.firstElementChild;
        const w = document.createElement('div');
        w.style.willChange = 'transform,opacity';
        a.insertBefore(w, chip);
        w.appendChild(chip);
        return w;
      });
      const header = document.querySelector('header[data-hero]');
      const SPIN = Math.PI * 1.7;
      this.hubApply = (y) => {
        if (!header || !vecs.length) return;
        // a stale/zero measurement would otherwise produce NaN transforms
        if (!vecs[0] || !isFinite(vecs[0].R) || vecs[0].R === 0) { measure(); if (!vecs[0] || !isFinite(vecs[0].R)) return; }
        const span = (header.offsetHeight || 700) * 0.7;
        const p = span > 0 ? Math.max(0, Math.min(1, y / span)) : 0;
        for (let i = 0; i < wraps.length; i++) {
          const v = vecs[i];
          if (!v || !isFinite(v.R) || !isFinite(v.th)) continue;
          const radius = v.R * (1 - p), ang = v.th + p * SPIN;
          wraps[i].style.transform = 'translate(' + (radius * Math.cos(ang) - v.x).toFixed(1) + 'px,' + (radius * Math.sin(ang) - v.y).toFixed(1) + 'px) rotate(' + (p * 150).toFixed(1) + 'deg) scale(' + (1 - 0.72 * p).toFixed(3) + ')';
          wraps[i].style.opacity = (1 - p * 0.95).toFixed(3);
        }
        if (svg) svg.style.opacity = Math.max(0, 1 - p * 1.7).toFixed(3);
        if (core) core.style.transform = 'scale(' + (1 + 0.16 * p).toFixed(3) + ')';
      };
    }

    drawOrg() {
      const board = document.querySelector('[data-org-chart]');
      if (!board) return;
      const svg = board.querySelector('[data-org-lines]');
      const rows = [].slice.call(board.querySelectorAll('[data-org-row]'));
      const rowNodes = rows.map((r) => [].slice.call(r.querySelectorAll('[data-org-node]')));
      const NS = 'http://www.w3.org/2000/svg';
      const groups = [];
      if (rowNodes[0] && rowNodes[1]) groups.push({ p: rowNodes[0][0], c: rowNodes[1] });
      if (rowNodes[1] && rowNodes[2] && rowNodes[1][1]) groups.push({ p: rowNodes[1][1], c: rowNodes[2] });
      const draw = () => {
        const rect = board.getBoundingClientRect();
        if (!rect.width || !rect.height || !svg) return;
        svg.setAttribute('viewBox', '0 0 ' + rect.width + ' ' + rect.height);
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        const geo = (el) => { const r = el.getBoundingClientRect(); return { cx: r.left - rect.left + r.width / 2, ty: r.top - rect.top, by: r.bottom - rect.top }; };
        const mk = (d, active) => {
          const p = document.createElementNS(NS, 'path');
          p.setAttribute('d', d);
          p.setAttribute('fill', 'none');
          p.setAttribute('stroke', active ? '#BE2D18' : 'rgba(21,19,14,.22)');
          p.setAttribute('stroke-width', active ? '2' : '1.5');
          p.setAttribute('stroke-linecap', 'round');
          if (active && !this.reduce) { p.style.strokeDasharray = '5 7'; p.style.animation = 'vc-flow .6s linear infinite'; }
          svg.appendChild(p);
        };
        groups.forEach((g) => {
          const P = geo(g.p), kids = g.c.map(geo);
          const cty = Math.min.apply(null, kids.map((k) => k.ty));
          const busY = P.by + (cty - P.by) * 0.5;
          let d = 'M' + P.cx + ' ' + P.by + 'V' + busY + 'M' + Math.min.apply(null, kids.map((k) => k.cx)) + ' ' + busY + 'H' + Math.max.apply(null, kids.map((k) => k.cx));
          kids.forEach((k) => { d += 'M' + k.cx + ' ' + busY + 'V' + k.ty; });
          mk(d, false);
          g.c.forEach((childEl, i) => {
            if (!childEl.hasAttribute('data-org-active')) return;
            const k = kids[i];
            mk('M' + P.cx + ' ' + P.by + 'L' + P.cx + ' ' + busY + 'L' + k.cx + ' ' + busY + 'L' + k.cx + ' ' + k.ty, true);
          });
        });
      };
      draw();
      const onResize = () => draw();
      window.addEventListener('resize', onResize, { passive: true });
      this.cleanups.push(() => window.removeEventListener('resize', onResize));
      [300, 900, 1600].forEach((ms) => { const t = setTimeout(draw, ms); this.cleanups.push(() => clearTimeout(t)); });

      // staggered build of the org, once, when it scrolls into view
      const nodes = rowNodes.reduce((a, b) => a.concat(b), []);
      if (this.reduce || !nodes.length || !('IntersectionObserver' in window)) return;
      let fired = false;
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (!e.isIntersecting || fired) return;
          fired = true;
          io.disconnect();
          // transform-only: if anime never ticks, the chart is simply already in place
          this.whenAnime((anime) => {
            draw();
            anime({ targets: nodes, scale: [0.84, 1], translateY: [16, 0], duration: 700, delay: anime.stagger(85), easing: 'easeOutExpo' });
          });
        });
      }, { threshold: 0.2 });
      io.observe(board);
      this.cleanups.push(() => io.disconnect());
    }

  }

  function boot() { new VCSite().componentDidMount(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
