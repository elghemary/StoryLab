/* ==========================================================
   Stellar Quest — Library JS  (library/JS/app.js)
   ========================================================== */

/* ══════════════════════════════════════════════════════════
   ANIMATED STAR FIELD + SHOOTING STARS
   ══════════════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], shooters = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeStar() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.008 + 0.002,
      phase: Math.random() * Math.PI * 2,
    };
  }

  function initStars() {
    stars = [];
    const count = Math.floor((W * H) / 5000);
    for (let i = 0; i < count; i++) stars.push(makeStar());
  }

  function makeShooter() {
    const x = Math.random() * W * 1.2;
    const y = Math.random() * H * 0.5;
    const angle = (Math.random() * 20 + 20) * Math.PI / 180;
    return {
      x, y,
      vx: Math.cos(angle) * (6 + Math.random() * 5),
      vy: Math.sin(angle) * (6 + Math.random() * 5),
      len: 80 + Math.random() * 120,
      alpha: 1,
      life: 1,
    };
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    /* static stars with gentle twinkle */
    stars.forEach(s => {
      const a = s.alpha * (0.7 + 0.3 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();
    });

    /* shooting stars */
    shooters = shooters.filter(sh => sh.life > 0);
    shooters.forEach(sh => {
      sh.x    += sh.vx;
      sh.y    += sh.vy;
      sh.life -= 0.018;

      const tail = { x: sh.x - sh.vx * (sh.len / sh.vx), y: sh.y - sh.vy * (sh.len / sh.vx) };
      const grad = ctx.createLinearGradient(tail.x, tail.y, sh.x, sh.y);
      grad.addColorStop(0, `rgba(255,255,200,0)`);
      grad.addColorStop(1, `rgba(255,255,200,${sh.life * 0.9})`);
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(sh.x, sh.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    });

    /* spawn shooting stars occasionally */
    if (Math.random() < 0.004) shooters.push(makeShooter());

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initStars(); });
  resize();
  initStars();
  requestAnimationFrame(draw);
})();

/* ══════════════════════════════════════════════════════════
   STORY DATA
   Each story object drives both the grid card AND the modal.
   Add new stories here — one object per story.
   `url` is the Netlify URL of the deployed story.
   ══════════════════════════════════════════════════════════ */
const STORIES = [
  {
    id: 'stellar-quest',
    title: 'Stellar Quest',
    subtitle: 'Space Weather Adventure',
    tag: 'Space Science',
    tagClass: 'tag-space',
    thumbClass: 'thumb-space',
    emoji: '☀️',
    desc: 'Meet Solara the Sun, discover solar flares and coronal mass ejections, follow astronaut Fatima through a storm on the ISS, and learn how space weather shapes life on Earth.',
    features: [
      { icon: '🎭', label: 'Scenes',    value: '38' },
      { icon: '🎧', label: 'Narrated',  value: 'Yes' },
      { icon: '🌍', label: 'Language',  value: 'English' },
      { icon: '👶', label: 'Age',       value: '8+' },
      { icon: '⏱️', label: 'Duration',  value: '~15 min' },
      { icon: '🏆', label: 'Award',     value: 'NASA Space Apps — 1st Ben Guerir' },
    ],
    url: 'https://stellarquest.netlify.app', /* ← update with real URL */
  },
  /* ── Add more stories here ────────────────────────────────
  {
    id: 'ocean-explorers',
    title: 'Ocean Explorers',
    subtitle: 'Dive Into the Deep',
    tag: 'Marine Science',
    tagClass: 'tag-earth',
    thumbClass: 'thumb-earth',
    emoji: '🌊',
    desc: 'Coming soon.',
    features: [],
    url: '#',
  },
  ──────────────────────────────────────────────────────── */
];

/* ══════════════════════════════════════════════════════════
   RENDER CARDS
   ══════════════════════════════════════════════════════════ */
const grid      = document.getElementById('stories-grid');
const countEl   = document.getElementById('lib-count');
const searchEl  = document.getElementById('lib-search');
const modal     = document.getElementById('story-modal');

let query = '';

function renderCards() {
  const filtered = STORIES.filter(s => {
    if (!query) return true;
    const q = query.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
  });

  /* count */
  if (countEl) countEl.textContent = filtered.length === 1
    ? 'Showing <strong>1</strong> story'
    : `Showing <strong>${filtered.length}</strong> stories`;

  /* grid */
  if (!grid) return;
  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔭</div>
        <h3>No stories found</h3>
        <p>Try a different search term</p>
      </div>`;
    return;
  }

  filtered.forEach((story, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Open ${story.title}`);
    card.style.animationDelay = (i * 0.06) + 's';
    card.innerHTML = `
      <div class="card-thumb ${story.thumbClass}">${story.emoji}</div>
      <div class="card-body">
        <span class="card-tag ${story.tagClass}">${story.tag}</span>
        <h2 class="card-title">${story.title}</h2>
        <p class="card-desc">${story.desc.slice(0, 110)}…</p>
        <div class="card-footer">
          <div class="card-meta">
            <span>🎭 ${story.features.find(f=>f.label==='Scenes')?.value ?? '?'} scenes</span>
            <span>🎧 Narrated</span>
          </div>
          <span class="card-cta">
            Explore
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </div>
      </div>`;

    card.addEventListener('click', () => openModal(story));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(story); });
    grid.appendChild(card);
  });
}

/* ══════════════════════════════════════════════════════════
   STORY DETAIL MODAL
   ══════════════════════════════════════════════════════════ */
function openModal(story) {
  const m = document.getElementById('story-modal');
  if (!m) return;

  /* fill modal content */
  m.querySelector('.modal-thumb').className    = `modal-thumb ${story.thumbClass}`;
  m.querySelector('.modal-thumb-emoji').textContent = story.emoji;
  m.querySelector('.modal-tag').className      = `modal-tag ${story.tagClass}`;
  m.querySelector('.modal-tag').textContent    = story.tag;
  m.querySelector('.modal-title').textContent  = story.title;
  m.querySelector('.modal-desc').textContent   = story.desc;
  m.querySelector('.modal-cta').href           = story.url;
  m.querySelector('.modal-cta').textContent    = story.url === '#' ? 'Coming Soon' : `Start ${story.title} →`;
  if (story.url === '#') m.querySelector('.modal-cta').style.opacity = '0.5';
  else m.querySelector('.modal-cta').style.opacity = '1';

  /* features */
  const featWrap = m.querySelector('.modal-features');
  featWrap.innerHTML = story.features.map(f =>
    `<div class="feature-pill">${f.icon} <span>${f.value}</span> ${f.label}</div>`
  ).join('');

  m.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* focus the close button */
  setTimeout(() => m.querySelector('.modal-close')?.focus(), 50);
}

function closeModal() {
  const m = document.getElementById('story-modal');
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════════════════
   EVENTS
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderCards();

  /* search */
  if (searchEl) {
    searchEl.addEventListener('input', e => { query = e.target.value.trim(); renderCards(); });
    searchEl.addEventListener('keydown', e => { if (e.key === 'Escape') { searchEl.value = ''; query = ''; renderCards(); } });
  }

  /* modal close */
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
});
