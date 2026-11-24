/* ============================================================
   EDIT THIS: the day you two became official.
   Month is 0-indexed, so April = 3, and 26 is the day.
   ============================================================ */
const START_DATE = new Date(2026, 3, 26, 0, 0, 0); // April 26, 2026

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------
   Toast
   ------------------------------------------------------------ */
const toastEl = document.getElementById('toast');
let toastTimer = null;

function toast(msg, ms = 5200) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('is-up');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-up'), ms);
}

/* ------------------------------------------------------------
   Gate — the opening surprise
   ------------------------------------------------------------ */
(function gate() {
  const gateEl = document.getElementById('gate');
  const closeBtn = document.getElementById('gateClose');
  if (!gateEl || !closeBtn) return;

  document.body.classList.add('is-gated');

  closeBtn.addEventListener('click', () => {
    gateEl.classList.add('is-open');
    document.body.classList.remove('is-gated');
    setTimeout(() => { gateEl.style.display = 'none'; }, 900);
    setTimeout(() => toast('Hi, my love. Happy 7th monthsary. Take your time in here; nothing is going anywhere.'), 1100);
  });
})();

/* ------------------------------------------------------------
   Floating hearts
   ------------------------------------------------------------ */
(function hearts() {
  const layer = document.querySelector('.hearts');
  if (!layer || reduced) return;
  const glyphs = ['\u2665', '\u2661', '\u2764'];
  const count = window.innerWidth < 640 ? 14 : 24;
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'heart';
    h.textContent = glyphs[i % glyphs.length];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = 10 + Math.random() * 22 + 'px';
    h.style.animationDuration = 12 + Math.random() * 14 + 's';
    h.style.animationDelay = -Math.random() * 20 + 's';
    layer.appendChild(h);
  }
})();

/* ------------------------------------------------------------
   Time-together counter
   ------------------------------------------------------------ */
(function counter() {
  const el = {
    d: document.getElementById('days'),
    h: document.getElementById('hours'),
    m: document.getElementById('mins'),
    s: document.getElementById('secs'),
  };
  if (!el.d) return;

  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const total = Math.max(0, Math.floor((Date.now() - START_DATE.getTime()) / 1000));
    el.d.textContent = Math.floor(total / 86400);
    el.h.textContent = pad(Math.floor((total % 86400) / 3600));
    el.m.textContent = pad(Math.floor((total % 3600) / 60));
    el.s.textContent = pad(total % 60);
  }
  tick();
  setInterval(tick, 1000);
})();

/* ------------------------------------------------------------
   Typing headline — cycles through pet names
   ------------------------------------------------------------ */
(function typer() {
  const node = document.getElementById('typed');
  if (!node) return;

  const words = ['7th Monthsary', 'My Love', 'My Favorite Person', 'Sayang', 'Forever'];
  node.textContent = words[0];

  if (reduced) return;

  let w = 0, i = words[0].length, deleting = true;

  function step() {
    const word = words[w];
    if (deleting) {
      i--;
      node.textContent = word.slice(0, i);
      if (i === 0) {
        deleting = false;
        w = (w + 1) % words.length;
        node.textContent = '\u00a0';
        return setTimeout(step, 380);
      }
      return setTimeout(step, 55);
    }
    i++;
    node.textContent = words[w].slice(0, i);
    if (i === words[w].length) {
      deleting = true;
      return setTimeout(step, 2200);
    }
    return setTimeout(step, 95);
  }
  setTimeout(step, 2400);
})();

/* ------------------------------------------------------------
   Reveal on scroll
   ------------------------------------------------------------ */
(function reveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach((n) => n.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('is-visible'), Math.min(i * 90, 360));
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  items.forEach((n) => io.observe(n));
})();

/* ------------------------------------------------------------
   Confetti burst
   ------------------------------------------------------------ */
function burstConfetti(count = 70) {
  const layer = document.getElementById('confetti');
  if (!layer || reduced) return;
  const bits = ['\u2665', '\u2661', '\u2764', '\u2726', '\u2022'];
  const colors = ['#d76b86', '#b34e69', '#e6cd72', '#f0b7c6', '#5b3a4a'];

  for (let i = 0; i < count; i++) {
    const s = document.createElement('i');
    s.textContent = bits[Math.floor(Math.random() * bits.length)];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.color = colors[Math.floor(Math.random() * colors.length)];
    s.style.fontSize = 10 + Math.random() * 20 + 'px';
    s.style.animationDuration = 2.6 + Math.random() * 2.4 + 's';
    s.style.animationDelay = Math.random() * 0.6 + 's';
    layer.appendChild(s);
    setTimeout(() => s.remove(), 6000);
  }
}

/* ------------------------------------------------------------
   TWIST 1 — hidden heart notes
   ------------------------------------------------------------ */
const found = new Set();

(function heartNotes() {
  const row = document.getElementById('heartRow');
  const progress = document.getElementById('heartProgress');
  const note = document.getElementById('unlockNote');
  const lockedCount = document.getElementById('lockedCount');
  const lockedBox = document.getElementById('locked');
  const qcard = document.getElementById('qcard');
  const qLead = document.getElementById('qLead');
  if (!row) return;

  const buttons = Array.from(row.querySelectorAll('.hbtn'));
  const total = buttons.length;

  function sync() {
    if (progress) progress.textContent = found.size + ' of ' + total + ' found';
    if (lockedCount) lockedCount.textContent = found.size + ' / ' + total + ' found';
  }

  function unlock() {
    if (note) note.hidden = false;
    if (lockedBox) lockedBox.style.display = 'none';
    if (qcard) qcard.hidden = false;
    if (qLead) qLead.textContent = 'You found them all. So here it is.';
    burstConfetti(60);
    toast('You found all five. Of course you did. Now scroll down — there is a question waiting for you.');
    setTimeout(() => {
      const q = document.getElementById('question');
      if (q) q.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }, 1400);
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = buttons.indexOf(btn);
      if (found.has(idx)) {
        toast(btn.dataset.note);
        return;
      }
      found.add(idx);
      btn.classList.add('is-found');
      sync();
      toast(btn.dataset.note, 6500);
      if (found.size === total) setTimeout(unlock, 900);
    });
  });

  sync();
})();

/* ------------------------------------------------------------
   TWIST 2 — the sealed letter
   ------------------------------------------------------------ */
(function sealedLetter() {
  const seal = document.getElementById('seal');
  const body = document.getElementById('sealedBody');
  if (!seal || !body) return;

  seal.addEventListener('click', () => {
    seal.classList.add('is-broken');
    seal.setAttribute('aria-expanded', 'true');
    body.classList.add('is-open');
    setTimeout(() => {
      body.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }, 500);
  }, { once: true });
})();

/* ------------------------------------------------------------
   Gallery — flip to the words on the back
   ------------------------------------------------------------ */
(function flips() {
  document.querySelectorAll('.flip').forEach((card) => {
    const toggle = () => card.classList.toggle('is-flipped');
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
})();

/* ------------------------------------------------------------
   TWIST 3 — scratch card
   ------------------------------------------------------------ */
(function scratch() {
  const canvas = document.getElementById('scratchCanvas');
  const status = document.getElementById('scratchStatus');
  const card = document.getElementById('scratchCard');
  if (!canvas || !card) return;

  const ctx = canvas.getContext('2d');
  let revealed = false;
  let drawing = false;
  let lastX = 0, lastY = 0, moved = 0;

  function paintCover() {
    const rect = card.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    const w = rect.width, h = rect.height;
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#e6cd72');
    g.addColorStop(.45, '#c9a227');
    g.addColorStop(1, '#a8841a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.font = '600 15px Jost, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '3px';
    ctx.fillText('SCRATCH HERE', w / 2, h / 2 - 4);
    ctx.font = '300 13px Jost, system-ui, sans-serif';
    ctx.fillText('use your finger or mouse', w / 2, h / 2 + 22);

    ctx.strokeStyle = 'rgba(255,255,255,.28)';
    ctx.lineWidth = 2;
    for (let i = -h; i < w; i += 26) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
  }

  paintCover();
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { if (!revealed) paintCover(); }, 250);
  });

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  }

  function scratchAt(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 34, 0, Math.PI * 2);
    ctx.fill();
  }

  function percentClear() {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0, total = 0;
    for (let i = 3; i < data.length; i += 4 * 12) {
      total++;
      if (data[i] < 40) clear++;
    }
    return total ? clear / total : 0;
  }

  function check() {
    const pct = Math.round(percentClear() * 100);
    if (status) status.textContent = pct + '% scratched';
    if (!revealed && pct >= 55) {
      revealed = true;
      canvas.classList.add('is-done');
      if (status) status.textContent = 'Uncovered. Read it twice.';
      burstConfetti(45);
      toast('I meant it. Every word of it.');
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (revealed) return;
    drawing = true;
    moved = 0;
    const p = pos(e);
    lastX = p.x; lastY = p.y;
    scratchAt(p.x, p.y);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!drawing || revealed) return;
    const p = pos(e);
    const dist = Math.hypot(p.x - lastX, p.y - lastY);
    moved += dist;
    if (dist > 1) {
      const steps = Math.ceil(dist / 12);
      for (let i = 1; i <= steps; i++) {
        scratchAt(lastX + (p.x - lastX) * (i / steps), lastY + (p.y - lastY) * (i / steps));
      }
    }
    lastX = p.x; lastY = p.y;
  });

  function stop() {
    if (!drawing) return;
    drawing = false;
    if (moved > 60) check();
  }
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointerleave', stop);
  canvas.addEventListener('pointercancel', stop);

  // accessibility: a click without dragging still uncovers it
  canvas.addEventListener('click', () => {
    if (!revealed && moved < 8) check();
  });
})();

/* ------------------------------------------------------------
   TWIST 4 — the question
   ------------------------------------------------------------ */
(function question() {
  const yes = document.getElementById('btnYes');
  const maybe = document.getElementById('btnMaybe');
  const reveal = document.getElementById('qReveal');
  if (!yes || !maybe || !reveal) return;

  const dodge = [
    'Are you sure?',
    'Try again, my love.',
    'Not an option, sorry.',
    'Wrong button, sayang.',
    'That one is broken. Try the other one.',
    'You already know the answer.',
  ];
  let n = 0;

  maybe.addEventListener('click', (e) => {
    e.preventDefault();
    maybe.textContent = dodge[n % dodge.length];
    n++;
    if (!reduced) {
      maybe.style.transform = 'translate(' + (Math.random() * 70 - 35) + 'px,' +
        (Math.random() * 26 - 13) + 'px) rotate(' + (Math.random() * 8 - 4) + 'deg)';
    }
    if (n === 5) maybe.textContent = 'This button really does not work. The other one does.';
  });

  function accept() {
    reveal.hidden = false;
    yes.textContent = 'Yes \u2665';
    yes.disabled = true;
    bubbleLove();
  }

  yes.addEventListener('click', accept);
})();

function bubbleLove() {
  burstConfetti(120);
  toast('I love you. Happy 7th monthsary. \u2665', 9000);
  const el = document.getElementById('top');
  if (el) setTimeout(() => el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }), 900);
}

/* ------------------------------------------------------------
   The speck — smallest secret in the corner
   ------------------------------------------------------------ */
(function speck() {
  const s = document.getElementById('speck');
  if (!s) return;
  s.addEventListener('click', () => {
    if (s.classList.contains('is-used')) return;
    s.classList.add('is-used');
    burstConfetti(30);
    toast('You found the tiniest thing on this page. I put it there for exactly you — happy 7th monthsary, my love.', 7000);
  });
})();

/* ------------------------------------------------------------
   Replay
   ------------------------------------------------------------ */
(function replay() {
  const btn = document.getElementById('replay');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    setTimeout(() => toast('Read it again as many times as you want. It stays here.'), 900);
  });
})();
