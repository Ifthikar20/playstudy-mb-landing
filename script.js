// PlayStudy landing — interactivity

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* ---------- nav blur on scroll ---------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ---------- cursor glow ---------- */
const glow = document.getElementById('cursorGlow');
let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
let tx = gx, ty = gy;
window.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; });
function tick() {
  gx += (tx - gx) * 0.12;
  gy += (ty - gy) * 0.12;
  glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
  requestAnimationFrame(tick);
}
tick();

/* ---------- phone tilt on mousemove ---------- */
const phoneWrap = document.querySelector('.phone-wrap');
const phone = document.querySelector('.phone');
if (phoneWrap && phone) {
  phoneWrap.addEventListener('mousemove', (e) => {
    const r = phoneWrap.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    phone.style.transform = `rotateY(${-12 + px * 16}deg) rotateX(${6 - py * 14}deg)`;
  });
  phoneWrap.addEventListener('mouseleave', () => {
    phone.style.transform = `rotateY(-12deg) rotateX(6deg)`;
  });
}

/* ---------- screen cycle inside phone ---------- */
const screens = Array.from(document.querySelectorAll('.screen-stack .screen'));
let si = 0;
setInterval(() => {
  screens[si].classList.remove('is-active');
  si = (si + 1) % screens.length;
  screens[si].classList.add('is-active');
}, 3200);

/* ---------- interactive Guess-the-Word game ---------- */
const WORD = 'CHLOROPLAST';
const tilesEl = document.getElementById('gameTiles');
const keysEl = document.getElementById('gameKeys');
const livesEl = document.getElementById('gameLives');
const resetBtn = document.getElementById('gameReset');
const canvas = document.getElementById('confetti');

let revealed = new Set();
let used = new Set();
let lives = 6;
let won = false;

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function renderTiles() {
  tilesEl.innerHTML = '';
  WORD.split('').forEach((ch, i) => {
    const d = document.createElement('div');
    d.className = 'gt' + (revealed.has(ch) ? ' revealed' : ' empty');
    d.textContent = ch;
    d.style.animationDelay = `${i * 30}ms`;
    tilesEl.appendChild(d);
  });
}
function renderKeys() {
  keysEl.innerHTML = '';
  ALPHABET.forEach((ch) => {
    const b = document.createElement('button');
    b.className = 'gk';
    b.textContent = ch;
    if (used.has(ch)) {
      b.classList.add(WORD.includes(ch) ? 'correct' : 'wrong');
    }
    b.addEventListener('click', () => guess(ch));
    keysEl.appendChild(b);
  });
}
function renderLives() {
  let h = '';
  for (let i = 0; i < 6; i++) {
    h += i < lives ? '♥ ' : '<span class="dim">♥</span> ';
  }
  livesEl.innerHTML = h.trim();
}
function guess(ch) {
  if (won || lives <= 0 || used.has(ch)) return;
  used.add(ch);
  if (WORD.includes(ch)) {
    revealed.add(ch);
    if ([...new Set(WORD)].every((c) => revealed.has(c))) {
      won = true;
      burstConfetti();
    }
  } else {
    lives--;
    document.getElementById('gameCard').animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }],
      { duration: 280 }
    );
  }
  renderTiles(); renderKeys(); renderLives();
}
function reset() {
  revealed = new Set();
  used = new Set();
  lives = 6;
  won = false;
  renderTiles(); renderKeys(); renderLives();
}
resetBtn.addEventListener('click', reset);
renderTiles(); renderKeys(); renderLives();

/* ---------- confetti ---------- */
function burstConfetti() {
  const ctx = canvas.getContext('2d');
  const r = canvas.getBoundingClientRect();
  canvas.width = r.width * devicePixelRatio;
  canvas.height = r.height * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const colors = ['#007AFF', '#5856D6', '#22C55E', '#FF9500', '#FF2D92'];
  const parts = Array.from({ length: 90 }, () => ({
    x: r.width / 2,
    y: r.height / 2,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 1) * 12,
    g: 0.35,
    s: 4 + Math.random() * 5,
    c: colors[(Math.random() * colors.length) | 0],
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    life: 0,
  }));
  let raf;
  function loop() {
    ctx.clearRect(0, 0, r.width, r.height);
    parts.forEach((p) => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.4);
      ctx.restore();
    });
    if (parts[0].life < 140) raf = requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, r.width, r.height);
  }
  loop();
}

/* ---------- subtle parallax on blobs ---------- */
const blobs = document.querySelectorAll('.blob');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  blobs.forEach((b, i) => {
    b.style.translate = `0 ${y * (0.05 + i * 0.04)}px`;
  });
}, { passive: true });

/* ---------- smooth anchor offset (compensate fixed nav) ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        const y = t.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  });
});
