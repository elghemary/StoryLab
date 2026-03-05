/* ==========================================================
   StoriesLab — library/JS/app.js
   ========================================================== */

/* ══════════════════════════════════════════════════════════
   ANIMATED STEM BACKGROUND
   Floating STEM-themed particles: atoms, nodes, sigma,
   pi, binary bits, circuit dots — connected by faint lines
   ══════════════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('stem-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  /* STEM glyph set — one char per particle */
  const GLYPHS = [
    '⚛','∑','∫','π','Δ','∞','λ','σ','μ','φ',
    '0','1','⊕','⊗','∇','√','≈','∈','⊂','α',
    '⚙','◈','◇','○','◉',
  ];

  /* STEM accent colours matching CSS variables */
  const COLORS = [
    'rgba(91,156,246,',   /* blue — CS / physics */
    'rgba(245,200,66,',   /* gold — space */
    'rgba(52,211,153,',   /* teal — biology */
    'rgba(251,113,133,',  /* rose — robotics */
    'rgba(167,139,250,',  /* purple — math */
    'rgba(251,146,60,',   /* orange — chemistry */
  ];

  let particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * 0.28,
      vy:    (Math.random() - 0.5) * 0.28,
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      size:  Math.random() * 9 + 8,           /* 8–17px font */
      alpha: Math.random() * 0.18 + 0.06,     /* subtle */
      color: color,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.012 + 0.005,
    };
  }

  function init() {
    const count = Math.min(Math.floor((W * H) / 14000), 80);
    particles = Array.from({ length: count }, makeParticle);
  }

  const CONNECT_DIST = 130;

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.font = '';

    /* move */
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;
      /* wrap */
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;
    });

    /* connection lines */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const lineAlpha = (1 - dist / CONNECT_DIST) * 0.06;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(150,165,200,${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    /* glyphs */
    particles.forEach(p => {
      const twinkle = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.font = `${p.size}px 'Atkinson Hyperlegible', sans-serif`;
      ctx.fillStyle = p.color + twinkle + ')';
      ctx.fillText(p.glyph, p.x, p.y);
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init();
  requestAnimationFrame(draw);
})();

/* ══════════════════════════════════════════════════════════
   STORY DATA
   Add new stories by pushing an object here.
   ══════════════════════════════════════════════════════════ */
const STORIES = [
  {
    id:         'stellar-quest',
    title:      'Stellar Quest',
    subtitle:   'Space Weather Adventure',
    tag:        'Space Science',
    tagClass:   'tag-space',
    thumbClass: 'thumb-space',
    emoji:      '☀️',
    desc:       'Meet Solara the Sun, discover solar flares and coronal mass ejections, follow astronaut Fatima through a storm on the ISS, and learn how space weather shapes life on Earth. A fully narrated 38-scene adventure based on the NASA Space Apps Challenge award-winning project.',
    features: [
      { icon: '🎭', label: 'Scenes',    value: '38' },
      { icon: '🎧', label: 'Narrated',  value: 'Yes' },
      { icon: '🌍', label: 'Language',  value: 'English' },
      { icon: '👶', label: 'Age',       value: '8+' },
      { icon: '⏱️', label: 'Duration',  value: '~15 min' },
      { icon: '🏆', label: 'Award',     value: '1st place — NASA Space Apps, Ben Guerir' },
    ],
    url: 'https://stellarquest.netlify.app', /* ← update with your real Netlify URL */
  },

  /* ── Add more stories below ──────────────────────────────
  {
    id:         'robot-origins',
    title:      'Robot Origins',
    tag:        'Robotics',
    tagClass:   'tag-robotics',
    thumbClass: 'thumb-robotics',
    emoji:      '🤖',
    desc:       '...',
    features:   [...],
    url:        '#',
  },
  ─────────────────────────────────────────────────────── */
];

/* ══════════════════════════════════════════════════════════
   RENDER CARDS
   ══════════════════════════════════════════════════════════ */
const grid     = document.getElementById('stories-grid');
const countEl  = document.getElementById('lib-count');
const searchEl = document.getElementById('lib-search');
let query = '';

function renderCards() {
  const filtered = STORIES.filter(s => {
    if (!query) return true;
    const q = query.toLowerCase();
    return s.title.toLowerCase().includes(q) ||
           s.desc.toLowerCase().includes(q)  ||
           s.tag.toLowerCase().includes(q);
  });

  if (countEl) {
    const n = filtered.length;
    countEl.innerHTML = n === 1
      ? 'Showing <strong>1</strong> story'
      : `Showing <strong>${n}</strong> stories`;
  }

  if (!grid) return;
  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" role="status">
        <div class="empty-state-icon">🔬</div>
        <h3>No stories found</h3>
        <p>Try a different search term</p>
      </div>`;
    return;
  }

  filtered.forEach(story => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Explore ${story.title}`);

    const sceneCount = story.features.find(f => f.label === 'Scenes')?.value ?? '?';
    const hasAudio   = story.features.find(f => f.label === 'Narrated')?.value === 'Yes';

    card.innerHTML = `
      <div class="card-thumb ${story.thumbClass}">${story.emoji}</div>
      <div class="card-body">
        <span class="card-tag ${story.tagClass}">${story.tag}</span>
        <h2 class="card-title">${story.title}</h2>
        <p class="card-desc">${story.desc.slice(0, 115)}…</p>
        <div class="card-footer">
          <div class="card-meta">
            <span>🎭 ${sceneCount} scenes</span>
            ${hasAudio ? '<span>🎧 Narrated</span>' : ''}
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

    card.addEventListener('click',   () => openStoryModal(story));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openStoryModal(story); });
    grid.appendChild(card);
  });
}

/* ══════════════════════════════════════════════════════════
   STORY DETAIL MODAL
   ══════════════════════════════════════════════════════════ */
function openStoryModal(story) {
  const overlay = document.getElementById('story-modal');
  if (!overlay) return;

  overlay.querySelector('.modal-thumb').className           = `modal-thumb ${story.thumbClass}`;
  overlay.querySelector('.modal-thumb-emoji').textContent   = story.emoji;
  overlay.querySelector('.modal-tag').className             = `modal-tag ${story.tagClass}`;
  overlay.querySelector('.modal-tag').textContent           = story.tag;
  overlay.querySelector('.modal-title').textContent         = story.title;
  overlay.querySelector('.modal-desc').textContent          = story.desc;

  const cta = overlay.querySelector('.modal-cta');
  const comingSoon = !story.url || story.url === '#';
  cta.href               = comingSoon ? '#' : story.url;
  cta.textContent        = comingSoon ? '🔜 Coming Soon' : `Start ${story.title} →`;
  cta.style.opacity      = comingSoon ? '0.5' : '1';
  cta.style.pointerEvents = comingSoon ? 'none' : 'auto';

  overlay.querySelector('.modal-features').innerHTML =
    story.features.map(f =>
      `<div class="feature-pill">${f.icon} <span>${f.value}</span> ${f.label}</div>`
    ).join('');

  openOverlay('story-modal');
  setTimeout(() => overlay.querySelector('.modal-close')?.focus(), 60);
}

/* ══════════════════════════════════════════════════════════
   ABOUT MODAL
   ══════════════════════════════════════════════════════════ */
function openAboutModal() { openOverlay('about-modal'); }

/* ── Generic overlay helpers ────────────────────────────── */
function openOverlay(id) {
  document.getElementById(id)?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeOverlay(id) {
  document.getElementById(id)?.classList.remove('open');
  /* restore scroll only if no other overlay is open */
  if (!document.querySelector('.modal-overlay.open')) {
    document.body.style.overflow = '';
  }
}

/* ══════════════════════════════════════════════════════════
   EVENTS
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderCards();

  /* search */
  if (searchEl) {
    searchEl.addEventListener('input',   e => { query = e.target.value.trim(); renderCards(); });
    searchEl.addEventListener('keydown', e => {
      if (e.key === 'Escape') { searchEl.value = ''; query = ''; renderCards(); }
    });
  }

  /* About button */
  document.getElementById('about-btn')?.addEventListener('click', openAboutModal);

  /* Close buttons */
  document.getElementById('story-modal-close')?.addEventListener('click', () => closeOverlay('story-modal'));
  document.getElementById('about-modal-close')?.addEventListener('click', () => closeOverlay('about-modal'));

  /* Backdrop click closes */
  ['story-modal','about-modal'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', e => {
      if (e.target === document.getElementById(id)) closeOverlay(id);
    });
  });

  /* Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeOverlay('story-modal');
      closeOverlay('about-modal');
    }
  });
});
