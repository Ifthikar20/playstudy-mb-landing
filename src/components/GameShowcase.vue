<script setup>
import { ref, computed, onMounted, useTemplateRef } from 'vue';
import { motion } from 'motion-v';

const WORD = 'CHLOROPLAST';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const revealed = ref(new Set());
const used = ref(new Set());
const lives = ref(6);
const won = ref(false);

const cardRef = useTemplateRef('cardRef');
const canvasRef = useTemplateRef('canvasRef');

const livesDisplay = computed(() => {
  let h = '';
  for (let i = 0; i < 6; i++) h += i < lives.value ? '♥ ' : '<span class="dim">♥</span> ';
  return h.trim();
});

function tileState(ch) {
  if (ch === '_') return 'empty';
  return revealed.value.has(ch) ? 'revealed' : 'empty';
}
function tileShown(ch) {
  if (ch === '_') return '';
  return revealed.value.has(ch) ? ch : '';
}
function keyClass(ch) {
  if (!used.value.has(ch)) return '';
  return WORD.includes(ch) ? 'correct' : 'wrong';
}
function guess(ch) {
  if (won.value || lives.value <= 0 || used.value.has(ch)) return;
  const u = new Set(used.value); u.add(ch); used.value = u;
  if (WORD.includes(ch)) {
    const r = new Set(revealed.value); r.add(ch); revealed.value = r;
    if ([...new Set(WORD)].every((c) => revealed.value.has(c))) {
      won.value = true;
      burstConfetti();
    }
  } else {
    lives.value--;
    cardRef.value?.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }],
      { duration: 280 }
    );
  }
}
function reset() {
  revealed.value = new Set();
  used.value = new Set();
  lives.value = 6;
  won.value = false;
}

function burstConfetti() {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  const r = canvas.getBoundingClientRect();
  canvas.width = r.width * devicePixelRatio;
  canvas.height = r.height * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const colors = ['#007AFF', '#5856D6', '#22C55E', '#FF9500', '#FF2D92'];
  const parts = Array.from({ length: 90 }, () => ({
    x: r.width / 2, y: r.height / 2,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 1) * 12,
    g: 0.35, s: 4 + Math.random() * 5,
    c: colors[(Math.random() * colors.length) | 0],
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    life: 0,
  }));
  function loop() {
    ctx.clearRect(0, 0, r.width, r.height);
    parts.forEach((p) => {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.4);
      ctx.restore();
    });
    if (parts[0].life < 140) requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, r.width, r.height);
  }
  loop();
}

const fadeIn = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] },
};
</script>

<template>
  <section class="game-show" id="game">
    <div class="game-grid">
      <motion.div v-bind="fadeIn">
        <span class="eyebrow eyebrow-green">The Game</span>
        <h2>Guess the Word — the part you'll actually look forward to.</h2>
        <p class="lede">A flame-powered mini-game built into every study set. Six lives, animated letter tiles, confetti on a correct guess. Tap a letter to play.</p>
        <ul class="bullets">
          <li><span style="background:#22C55E"></span> Animated tile reveals</li>
          <li><span style="background:#5856D6"></span> 6 lives per round</li>
          <li><span style="background:#007AFF"></span> Confetti on win 🎉</li>
        </ul>
      </motion.div>

      <motion.div ref="cardRef" class="game-card" v-bind="fadeIn" :transition="{ duration: 0.8, delay: 0.15 }">
        <div class="game-clue">Organelle in plant cells where photosynthesis happens.</div>
        <div class="game-tiles">
          <motion.div
            v-for="(l, i) in WORD.split('')"
            :key="i"
            class="gt"
            :class="{ revealed: revealed.has(l) }"
            :initial="{ scale: 0, opacity: 0 }"
            :animate="{ scale: 1, opacity: 1 }"
            :transition="{ duration: 0.4, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }"
          >
            {{ revealed.has(l) ? l : '' }}
          </motion.div>
        </div>
        <div class="game-keys">
          <motion.button
            v-for="ch in ALPHABET"
            :key="ch"
            class="gk"
            :class="keyClass(ch)"
            :disabled="used.has(ch)"
            :while-hover="!used.has(ch) ? { y: -2, scale: 1.05 } : {}"
            :while-tap="{ scale: 0.94 }"
            @click="guess(ch)"
          >{{ ch }}</motion.button>
        </div>
        <div class="game-foot">
          <span class="game-lives" v-html="livesDisplay"></span>
          <button class="game-reset" @click="reset">Reset</button>
        </div>
        <canvas ref="canvasRef" class="confetti"></canvas>
      </motion.div>
    </div>
  </section>
</template>

<style scoped>
.game-show{padding:60px 24px 120px;max-width:1240px;margin:0 auto}
.game-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.eyebrow-green{color:var(--accent) !important}
h2{font-size:clamp(30px,3.6vw,44px);font-weight:800;letter-spacing:-.03em;line-height:1.1;margin:14px 0 16px}
.lede{font-size:17px;color:var(--text-2);margin:0}
.bullets{list-style:none;padding:0;margin:24px 0 0;display:flex;flex-direction:column;gap:10px}
.bullets li{display:flex;align-items:center;gap:12px;font-size:15px;color:var(--text)}
.bullets li span{width:10px;height:10px;border-radius:50%}

.game-card{
  position:relative;background:#fff;
  border:1px solid var(--border);border-radius:28px;
  padding:32px;box-shadow:var(--shadow-2);
  overflow:hidden;
}
.game-clue{font-size:14.5px;color:var(--text);background:var(--surface);padding:16px;border-radius:14px;margin-bottom:24px;line-height:1.5}
.game-tiles{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:28px;min-height:54px}
.gt{
  width:34px;height:44px;background:#fff;border:2px solid var(--border);border-radius:8px;
  display:grid;place-items:center;font-weight:800;font-size:18px;color:var(--text);
  transition:background .35s, border-color .35s, color .35s;
}
.gt.revealed{background:var(--accent);border-color:var(--accent);color:#fff}
.game-keys{display:grid;grid-template-columns:repeat(9,1fr);gap:6px;margin-bottom:18px}
.gk{
  background:var(--surface);padding:10px 0;text-align:center;font-weight:700;font-size:13px;border-radius:8px;
  transition:background .2s,color .2s;
}
.gk:not(:disabled):hover{background:var(--primary);color:#fff}
.gk.correct{background:var(--accent);color:#fff}
.gk.wrong{background:#fee2e2;color:#dc2626}
.gk:disabled{opacity:.5;cursor:default}
.gk.correct,.gk.wrong{opacity:1}
.game-foot{display:flex;justify-content:space-between;align-items:center}
.game-lives{color:#EF4444;font-size:18px;letter-spacing:3px}
.game-lives :deep(.dim){opacity:.2}
.game-reset{background:var(--surface);padding:8px 16px;border-radius:999px;font-size:13px;font-weight:600;color:var(--text-2)}
.game-reset:hover{background:var(--border)}
.confetti{position:absolute;inset:0;pointer-events:none}

@media (max-width:960px){
  .game-grid{grid-template-columns:1fr}
}
@media (max-width:520px){
  .game-keys{grid-template-columns:repeat(7,1fr)}
  .gk{font-size:12px;padding:9px 0}
}
</style>
