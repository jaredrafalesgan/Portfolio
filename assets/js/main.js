// Jared Gan portfolio — progressive enhancement only. Everything works and is visible without this file.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Header border on scroll ---------- */
  const header = document.querySelector('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector('[data-nav-toggle]');
  const list = document.querySelector('[data-nav-list]');
  if (toggle && list) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
      list.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    list.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 48rem)').addEventListener('change', () => setOpen(false));
  }

  /* ---------- Signature: live workflow run ---------- */
  const workflow = document.querySelector('[data-workflow]');
  if (workflow && !reduceMotion.matches) {
    const replay = workflow.querySelector('[data-replay]');
    const q = (sel) => [...workflow.querySelectorAll(sel)];
    const stepEls = (step) => q(`[data-step="${step}"]`);
    const sequence = ['0', '1', '2', '3'];
    const STEP_MS = 950;
    let timers = [];

    const reset = () => {
      timers.forEach(clearTimeout); timers = [];
      q('.is-on, .is-off, .is-active').forEach((el) => el.classList.remove('is-on', 'is-off', 'is-active'));
      workflow.classList.add('is-armed');
      if (replay) replay.hidden = true;
    };

    const run = () => {
      reset();
      sequence.forEach((step, i) => {
        timers.push(setTimeout(() => {
          q('.is-active').forEach((el) => el.classList.remove('is-active'));
          stepEls(step).forEach((el) => {
            el.classList.add('is-on');
            const node = el.matches('.wf-node') ? el : el.querySelector('.wf-node');
            if (node) node.classList.add('is-active');
          });
          if (step === '3') stepEls('3b').forEach((el) => el.classList.add('is-off'));
        }, 500 + i * STEP_MS));
      });
      timers.push(setTimeout(() => {
        q('.is-active').forEach((el) => el.classList.remove('is-active'));
        if (replay) replay.hidden = false;
      }, 500 + sequence.length * STEP_MS + 600));
    };

    if (replay) replay.addEventListener('click', run);

    // Start when the workflow is on screen; arm immediately so there is no flash of the finished state.
    workflow.classList.add('is-armed');
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); run(); }
    }, { threshold: 0.35 });
    io.observe(workflow);

    reduceMotion.addEventListener('change', (e) => {
      if (e.matches) { timers.forEach(clearTimeout); workflow.classList.remove('is-armed'); if (replay) replay.hidden = true; }
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('[type="submit"]');
    const fields = {
      name: { el: form.elements.name, ok: (v) => v.trim().length > 0 },
      email: { el: form.elements.email, ok: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
      message: { el: form.elements.message, ok: (v) => v.trim().length > 0 },
    };

    const check = (key) => {
      const { el, ok } = fields[key];
      const valid = ok(el.value);
      const err = document.getElementById(`${el.id}-error`);
      el.setAttribute('aria-invalid', String(!valid));
      if (err) { err.hidden = valid; valid ? el.removeAttribute('aria-describedby') : el.setAttribute('aria-describedby', err.id); }
      return valid;
    };
    Object.keys(fields).forEach((k) => fields[k].el.addEventListener('blur', () => { if (fields[k].el.value) check(k); }));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const results = Object.keys(fields).map(check);
      if (results.includes(false)) {
        const first = Object.keys(fields).find((k) => fields[k].el.getAttribute('aria-invalid') === 'true');
        fields[first].el.focus();
        status.textContent = 'Please fix the highlighted fields.';
        return;
      }
      if (form.elements.website.value) return; // honeypot: silently ignore bots

      const data = Object.fromEntries(new FormData(form));
      delete data.website;
      const endpoint = form.dataset.endpoint;

      if (endpoint) {
        submit.disabled = true;
        status.textContent = 'Sending…';
        try {
          const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          status.classList.add('is-success');
          status.textContent = 'Thanks, your message is on its way. I’ll reply by email.';
        } catch {
          status.textContent = 'That didn’t send. Please email me directly at jaredrafalesgan@gmail.com.';
        } finally {
          submit.disabled = false;
        }
        return;
      }

      // No endpoint configured: open the visitor's email app with the message ready to send.
      const subject = `Project inquiry: ${data.need}`;
      const body = [`Name: ${data.name}`, `Email: ${data.email}`, data.company ? `Business: ${data.company}` : '', `Need: ${data.need}`, '', data.message]
        .filter((line, i) => line !== '' || i === 4).join('\n');
      window.location.href = `mailto:jaredrafalesgan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.classList.add('is-success');
      status.textContent = 'Your email app should open with the message ready to send. If it doesn’t, email jaredrafalesgan@gmail.com.';
    });
  }
})();
