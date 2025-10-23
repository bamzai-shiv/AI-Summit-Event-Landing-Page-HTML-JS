
    // Config
    const FORM_ENDPOINT = ""; // Set to your API endpoint to enable live submission

    // DOM helpers
    const $ = (sel, el = document) => el.querySelector(sel);
    const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

    // Mobile nav
    const header = document.querySelector('header');
    const nav = header.querySelector('.nav');
    $('.menu-toggle').addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      $('.menu-toggle').setAttribute('aria-expanded', open);
    });

    // Smooth scroll
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[href^="#"],[data-scroll]');
      if (!t) return;
      e.preventDefault();
      const id = t.getAttribute('href')?.slice(1) || t.dataset.scroll?.replace('#','');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nav.classList.remove('open');
    });

    // Theme toggle
    const root = document.body;
    const pref = localStorage.getItem('theme');
    if (pref) root.setAttribute('data-theme', pref);
    $('.theme-toggle').addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });

    // Reveal on scroll (IntersectionObserver)
    const reveals = $$('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));

    // Countdown
    function startCountdown() {
      const wrap = document.querySelector('.countdown');
      if (!wrap) return;
      const when = new Date(wrap.dataset.eventTime).getTime();
      const nums = {
        days: wrap.querySelector('[data-unit="days"]'),
        hours: wrap.querySelector('[data-unit="hours"]'),
        minutes: wrap.querySelector('[data-unit="minutes"]'),
        seconds: wrap.querySelector('[data-unit="seconds"]')
      };
      const tick = () => {
        const now = Date.now();
        let diff = Math.max(0, when - now);
        const d = Math.floor(diff / (1000 * 60 * 60 * 24)); diff -= d * 86400000;
        const h = Math.floor(diff / (1000 * 60 * 60)); diff -= h * 3600000;
        const m = Math.floor(diff / (1000 * 60)); diff -= m * 60000;
        const s = Math.floor(diff / 1000);
        nums.days.textContent = d;
        nums.hours.textContent = h.toString().padStart(2, '0');
        nums.minutes.textContent = m.toString().padStart(2, '0');
        nums.seconds.textContent = s.toString().padStart(2, '0');
      };
      tick();
      setInterval(tick, 1000);
    }
    startCountdown();

    // Schedule tabs
    $$('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.tab').forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b === btn) });
        const day = btn.dataset.day;
        $$('#schedule .sessions').forEach(sec => sec.hidden = true);
        document.getElementById(day).hidden = false;
      });
    });

    // Modal open/close
    const modal = $('#modal');
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-open="modal"]');
      const closeBtn = e.target.closest('[data-close="modal"]');
      if (openBtn) {
        const plan = openBtn.dataset.plan || $('#plan').value;
        $('#plan').value = plan || 'Pro';
        $('#plan-label').textContent = 'Selected plan: ' + $('#plan').value;
        modal.classList.add('open');
        setTimeout(() => $('#name').focus(), 50);
      }
      if (closeBtn || e.target === modal) {
        modal.classList.remove('open');
      }
    });

    // Form validation + submission
    const form = $('#reg-form');
    const successEl = $('#success');
    const addCalBtn = $('#add-calendar');

    function validate() {
      const errs = {};
      const name = $('#name').value.trim();
      const email = $('#email').value.trim();
      if (name.length < 2) errs.name = 'Please enter your full name';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
      for (const k of ['name','email']) {
        const el = document.querySelector('[data-err="'+k+'"]');
        el.textContent = errs[k] || '';
      }
      return Object.keys(errs).length === 0;
    }

    function toPayload() {
      return {
        name: $('#name').value.trim(),
        email: $('#email').value.trim(),
        company: $('#company').value.trim(),
        role: $('#role').value,
        plan: $('#plan').value,
        notes: $('#notes').value.trim(),
        ts: new Date().toISOString()
      };
    }

    async function submitRegistration(payload) {
      if (!FORM_ENDPOINT) {
        // local fallback for demo
        const list = JSON.parse(localStorage.getItem('registrations') || '[]');
        list.push(payload);
        localStorage.setItem('registrations', JSON.stringify(list));
        return { ok: true, id: list.length };
      }
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, ...data };
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate()) return;
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Submitting...';
      try {
        const payload = toPayload();
        const res = await submitRegistration(payload);
        if (res.ok) {
          successEl.classList.add('show');
          addCalBtn.disabled = false;
          addCalBtn.dataset.ics = makeICS(payload);
        } else {
          alert('There was a problem with your registration, please try again.');
        }
      } catch (err) {
        alert('Network error, saved locally — will retry later.');
      } finally {
        btn.disabled = false; btn.textContent = 'Submit registration';
      }
    });

    // Calendar invite (ICS)
    function makeICS(payload) {
      const wrap = document.querySelector('.countdown');
      const dtStart = new Date(wrap.dataset.eventTime);
      const dtEnd = new Date(dtStart.getTime() + 3 * 60 * 60 * 1000); // +3h
      const fmt = (d) => d.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
      const summary = 'AIx Summit 2025';
      const location = 'Bengaluru Convention Center + Livestream';
      const desc = `Ticket: ${payload.plan}\\nName: ${payload.name}\\nEmail: ${payload.email}`;
      return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//AIx Summit//EN',
        'BEGIN:VEVENT',
        `DTSTAMP:${fmt(new Date())}`,
        `DTSTART:${fmt(dtStart)}`,
        `DTEND:${fmt(dtEnd)}`,
        `SUMMARY:${summary}`,
        `LOCATION:${location}`,
        `DESCRIPTION:${desc}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\\r\\n');
    }

    addCalBtn.addEventListener('click', () => {
      const ics = addCalBtn.dataset.ics; if (!ics) return;
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'AIx-Summit-2025.ics';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 500);
    });

    // Accessibility: close modal on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.classList.remove('open');
    });

