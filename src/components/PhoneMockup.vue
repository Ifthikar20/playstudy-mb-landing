<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { motion, AnimatePresence } from 'motion-v';

const wrap = ref(null);
const phone = ref(null);
const active = ref(0);
let timer;

const screens = ['input', 'summary', 'quiz', 'game'];

onMounted(() => {
  timer = setInterval(() => {
    active.value = (active.value + 1) % screens.length;
  }, 3200);
});
onBeforeUnmount(() => clearInterval(timer));

const onMove = (e) => {
  const r = wrap.value.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  phone.value.style.transform = `rotateY(${-12 + px * 16}deg) rotateX(${6 - py * 14}deg)`;
};
const onLeave = () => {
  phone.value.style.transform = `rotateY(-12deg) rotateX(6deg)`;
};

const screenTransition = {
  initial: { opacity: 0, y: 12, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.97 },
  transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] },
};

const floatCards = [
  { cls: 'fc-1', bg: '#FF6B1A22', color: '#FF6B1A', icon: '✓', title: '+1 streak', sub: 'Quiz passed', delay: 0 },
  { cls: 'fc-2', bg: '#1E5EFF22', color: '#1E5EFF', icon: '★', title: 'New badge', sub: 'Photosynthesis', delay: -1.5 },
  { cls: 'fc-3', bg: '#FFB34722', color: '#B36100', icon: '⚡', title: 'Generated', sub: 'in 7.2s', delay: -3 },
];
</script>

<template>
  <div ref="wrap" class="phone-wrap-inner" @mousemove="onMove" @mouseleave="onLeave">
    <div ref="phone" class="phone">
      <div class="phone-notch"></div>
      <div class="phone-screen">
        <AnimatePresence mode="wait">
          <!-- INPUT -->
          <motion.div v-if="screens[active] === 'input'" key="input" class="screen" v-bind="screenTransition">
            <div class="s-top"><span class="s-back">‹</span><span class="s-title">New study set</span></div>
            <div class="tabs">
              <span class="tab is-on">Link</span><span class="tab">File</span><span class="tab">Text</span>
            </div>
            <div class="input-card">
              <div class="type-line">Paste a URL…<span class="caret">|</span></div>
              <div class="type-line type-line-2">https://en.wikipedia.org/wiki/Photosynthesis</div>
            </div>
            <button class="screen-cta">Generate study set →</button>
            <div class="chips">
              <span>Biology</span><span>5 min</span><span>Medium</span>
            </div>
          </motion.div>

          <!-- SUMMARY -->
          <motion.div v-else-if="screens[active] === 'summary'" key="summary" class="screen" v-bind="screenTransition">
            <div class="s-top"><span class="s-back">‹</span><span class="s-title">Photosynthesis</span></div>
            <div class="seg"><span class="is-on">Summary</span><span>Quiz</span><span>Game</span></div>
            <div class="sum-card">
              <h4>Key idea</h4>
              <p>Plants convert sunlight, water, and CO₂ into glucose and oxygen inside chloroplasts.</p>
              <div class="bar-row"><span></span><span></span><span></span></div>
            </div>
            <div class="sum-card sum-card-2">
              <h4>Vocab</h4>
              <p><b>Chloroplast</b> — the organelle where photosynthesis happens.</p>
            </div>
          </motion.div>

          <!-- QUIZ -->
          <motion.div v-else-if="screens[active] === 'quiz'" key="quiz" class="screen" v-bind="screenTransition">
            <div class="s-top"><span class="s-back">‹</span><span class="s-title">Quiz · 2 of 5</span></div>
            <div class="q">Which organelle performs photosynthesis?</div>
            <div class="opts">
              <div class="opt">Mitochondrion</div>
              <div class="opt is-correct">Chloroplast ✓</div>
              <div class="opt">Ribosome</div>
              <div class="opt">Nucleus</div>
            </div>
            <div class="progress"><span></span></div>
          </motion.div>

          <!-- GAME -->
          <motion.div v-else key="game" class="screen" v-bind="screenTransition">
            <div class="s-top"><span class="s-back">‹</span><span class="s-title">Guess the Word</span></div>
            <div class="clue">Organelle in plant cells where photosynthesis happens.</div>
            <div class="tiles">
              <span v-for="(l, i) in ['C','H','L','O','R','_','P','L','A','S','T']" :key="i" :class="{ empty: l === '_' }">{{ l }}</span>
            </div>
            <div class="keys">
              <span v-for="k in ['A','B','C','D','E','F','G','H','I','J']" :key="k">{{ k }}</span>
              <span class="pulse">O</span>
              <span>L</span>
            </div>
            <div class="lives">♥ ♥ ♥ ♥ ♥ <span class="dim">♥</span></div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>

    <motion.div
      v-for="(fc, i) in floatCards"
      :key="i"
      class="float-card"
      :class="fc.cls"
      :animate="{ y: [0, -10, 0] }"
      :transition="{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: fc.delay }"
      :while-hover="{ scale: 1.06 }"
    >
      <div class="fc-ic" :style="{ background: fc.bg, color: fc.color }">{{ fc.icon }}</div>
      <div><b>{{ fc.title }}</b><span>{{ fc.sub }}</span></div>
    </motion.div>
  </div>
</template>

<style scoped>
.phone-wrap-inner{position:relative;display:flex;justify-content:center;align-items:center}
.phone{
  width:300px;height:610px;
  background:#0a0a0a;border-radius:48px;
  padding:14px;
  box-shadow:
    0 60px 120px rgba(11,18,32,.25),
    0 30px 50px rgba(255,107,26,.18),
    inset 0 0 0 2px #1c1c1e,
    inset 0 0 0 3px #2a2a2c;
  position:relative;
  transform:rotateY(-12deg) rotateX(6deg);
  transition:transform .6s var(--ease);
  will-change:transform;
}
.phone-notch{
  position:absolute;top:18px;left:50%;transform:translateX(-50%);
  width:110px;height:30px;background:#000;border-radius:18px;z-index:3;
}
.phone-screen{
  width:100%;height:100%;
  background:#fff;border-radius:36px;
  overflow:hidden;position:relative;
}
.screen{
  position:absolute;inset:0;
  padding:54px 18px 18px;
  display:flex;flex-direction:column;gap:14px;
}
.s-top{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--text-2)}
.s-back{font-size:22px;line-height:1;color:var(--primary)}
.s-title{color:var(--text);font-weight:600;font-size:15px}
.tabs{display:flex;gap:6px;background:var(--surface);border-radius:10px;padding:4px}
.tab{flex:1;text-align:center;padding:8px;font-size:12.5px;color:var(--text-2);border-radius:8px;font-weight:500}
.tab.is-on{background:#fff;color:var(--text);box-shadow:var(--shadow-1)}
.input-card{
  background:var(--surface);border-radius:14px;padding:14px;min-height:130px;
  display:flex;flex-direction:column;gap:10px;
}
.type-line{font-size:13px;color:var(--text-2)}
.type-line-2{color:var(--text);font-weight:500;font-size:12.5px;word-break:break-all}
.caret{display:inline-block;width:1.5px;height:14px;background:var(--primary);vertical-align:middle;animation:blink 1s infinite}
@keyframes blink{50%{opacity:0}}
.screen-cta{background:linear-gradient(135deg,var(--primary),var(--primary-2));color:#fff;border-radius:12px;padding:14px;font-weight:600;font-size:14px}
.chips{display:flex;gap:6px;flex-wrap:wrap}
.chips span{font-size:11.5px;padding:5px 10px;background:var(--surface);border-radius:999px;color:var(--text-2)}
.seg{display:flex;gap:4px;background:var(--surface);border-radius:10px;padding:3px;font-size:12px}
.seg span{flex:1;text-align:center;padding:7px;border-radius:8px;color:var(--text-2);font-weight:500}
.seg .is-on{background:#fff;color:var(--text);box-shadow:var(--shadow-1)}
.sum-card{background:var(--surface);border-radius:14px;padding:14px}
.sum-card h4{margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-2)}
.sum-card p{margin:0;font-size:13px;line-height:1.5}
.sum-card-2{background:linear-gradient(135deg,#FF6B1A14,#1E5EFF14)}
.bar-row{display:flex;gap:4px;margin-top:10px}
.bar-row span{height:4px;flex:1;background:var(--border);border-radius:2px}
.bar-row span:nth-child(1){background:var(--primary)}
.bar-row span:nth-child(2){background:var(--secondary)}
.q{font-size:15px;font-weight:600;line-height:1.35;margin-top:4px}
.opts{display:flex;flex-direction:column;gap:8px}
.opt{background:var(--surface);padding:13px 14px;border-radius:12px;font-size:13px;font-weight:500;border:2px solid transparent}
.opt.is-correct{background:#FF6B1A14;border-color:#FF6B1A;color:#B14C0E}
.progress{height:6px;background:var(--surface);border-radius:3px;overflow:hidden}
.progress span{display:block;height:100%;width:40%;background:linear-gradient(90deg,#FF6B1A,#1E5EFF);animation:fill 1.4s var(--ease)}
@keyframes fill{from{width:0}}
.clue{font-size:13px;color:var(--text);background:var(--surface);padding:12px;border-radius:12px;line-height:1.4}
.tiles{display:flex;flex-wrap:wrap;gap:4px;justify-content:center}
.tiles span{width:21px;height:28px;background:#fff;border:1.5px solid var(--border);border-radius:6px;display:grid;place-items:center;font-weight:700;font-size:13px}
.tiles span.empty{background:var(--surface);color:var(--text-2)}
.keys{display:grid;grid-template-columns:repeat(6,1fr);gap:4px}
.keys span{background:var(--surface);padding:7px 0;text-align:center;font-size:12px;font-weight:600;border-radius:6px}
.keys .pulse{background:var(--primary);color:#fff;animation:pulseKey 1.6s infinite}
@keyframes pulseKey{0%,100%{box-shadow:0 0 0 0 rgba(255,107,26,.4)}50%{box-shadow:0 0 0 8px rgba(255,107,26,0)}}
.lives{font-size:14px;color:#EF4444;letter-spacing:2px}
.lives .dim{opacity:.3}

.float-card{
  position:absolute;background:#fff;border-radius:14px;padding:12px 14px;
  display:flex;align-items:center;gap:10px;
  box-shadow:var(--shadow-2);border:1px solid var(--border);
  font-size:13px;z-index:5;
}
.float-card b{display:block;font-size:13px;font-weight:600}
.float-card span{display:block;font-size:11.5px;color:var(--text-2)}
.fc-ic{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;font-weight:700}
.fc-1{top:14%;left:-30px}
.fc-2{top:42%;right:-50px}
.fc-3{bottom:14%;left:-10px}

@media (max-width:960px){
  .phone{transform:rotateY(0) rotateX(0) scale(.92)}
}
@media (max-width:520px){
  .phone{width:260px;height:540px}
  .float-card{display:none}
}
</style>
