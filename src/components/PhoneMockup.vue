<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { motion, AnimatePresence } from 'motion-v';

const wrap = ref(null);
const phone = ref(null);
const active = ref(0);
let timer;

/* A concrete, accurate PlayStudy walkthrough:
   1. Input — paste a Wikipedia link about Mitochondria
   2. Generating — AI builds the set
   3. Summary — real bullets matching the app's Summary view
   4. Quiz — multiple choice, mirrors lib/features/learning/.../quiz_view.dart
   5. Game — Guess the Word, exactly like the flame minigame
   6. Library — recent study sets list
*/
const screens = ['input', 'loading', 'summary', 'quiz', 'game', 'library'];

onMounted(() => {
  timer = setInterval(() => {
    active.value = (active.value + 1) % screens.length;
  }, 3400);
});
onBeforeUnmount(() => clearInterval(timer));

const onMove = (e) => {
  const r = wrap.value.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  phone.value.style.transform = `rotateY(${-12 + px * 16}deg) rotateX(${6 - py * 14}deg)`;
};
const onLeave = () => { phone.value.style.transform = `rotateY(-12deg) rotateX(6deg)`; };

const t = {
  initial: { opacity: 0, y: 14, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.97 },
  transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] },
};

const floatCards = [
  { cls: 'fc-1', bg: 'rgba(255,107,26,.1)', color: '#FF6B1A', icon: 'check', title: '5 / 5 quiz', sub: 'Mitochondria', delay: 0 },
  { cls: 'fc-2', bg: 'rgba(30,94,255,.1)', color: '#1E5EFF', icon: 'star', title: 'New badge', sub: 'Biology 101', delay: -1.5 },
  { cls: 'fc-3', bg: 'rgba(255,179,71,.18)', color: '#B36100', icon: 'bolt', title: 'Generated', sub: 'in 7.2s', delay: -3 },
];
</script>

<template>
  <div ref="wrap" class="phone-wrap-inner" @mousemove="onMove" @mouseleave="onLeave">
    <div ref="phone" class="phone">
      <div class="phone-notch"></div>
      <div class="phone-screen">
        <div class="status-bar">
          <span>9:41</span>
          <span class="status-right">
            <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="6" width="2" height="4" rx=".5"/><rect x="3" y="4" width="2" height="6" rx=".5"/><rect x="6" y="2" width="2" height="8" rx=".5"/><rect x="9" y="0" width="2" height="10" rx=".5"/></svg>
            <svg width="14" height="10" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 4.5a11 11 0 0 1 14 0M3.5 7.5a7 7 0 0 1 9 0M6 10.5a3 3 0 0 1 4 0"/></svg>
            <svg width="22" height="10" viewBox="0 0 24 10" fill="none" stroke="currentColor" stroke-width="1"><rect x="0.5" y="0.5" width="20" height="9" rx="2"/><rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor"/><rect x="21" y="3" width="2" height="4" rx=".5" fill="currentColor"/></svg>
          </span>
        </div>

        <AnimatePresence mode="wait">
          <!-- 1. INPUT -->
          <motion.div v-if="screens[active]==='input'" key="input" class="screen" v-bind="t">
            <div class="s-top"><span class="s-back">‹</span><span class="s-title">New study set</span></div>
            <div class="tabs">
              <span class="tab is-on">Link</span><span class="tab">File</span><span class="tab">Text</span>
            </div>
            <div class="input-card">
              <div class="type-line muted">Paste a URL</div>
              <div class="type-line url">en.wikipedia.org/wiki/Mitochondrion<span class="caret">|</span></div>
              <div class="hint">Wikipedia, blogs, PDFs, or your own notes.</div>
            </div>
            <button class="screen-cta">Generate study set</button>
            <div class="chips">
              <span>Biology</span><span>5 min</span><span>Medium</span>
            </div>
          </motion.div>

          <!-- 2. LOADING -->
          <motion.div v-else-if="screens[active]==='loading'" key="loading" class="screen screen-center" v-bind="t">
            <div class="orbit-lg"><span></span><span></span><span></span></div>
            <div class="load-title">Generating your set</div>
            <div class="load-steps">
              <div class="load-step done"><svg viewBox="0 0 12 12" width="10" height="10"><path d="M2 6l2.5 2.5L10 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Fetching article</div>
              <div class="load-step done"><svg viewBox="0 0 12 12" width="10" height="10"><path d="M2 6l2.5 2.5L10 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Building summary</div>
              <div class="load-step doing"><svg viewBox="0 0 12 12" width="10" height="10"><circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>Writing quiz &amp; game</div>
            </div>
            <div class="progress"><span style="width:72%"></span></div>
          </motion.div>

          <!-- 3. SUMMARY -->
          <motion.div v-else-if="screens[active]==='summary'" key="summary" class="screen" v-bind="t">
            <div class="s-top"><span class="s-back">‹</span><span class="s-title">Mitochondrion</span><span class="s-meta">5 min</span></div>
            <div class="seg"><span class="is-on">Summary</span><span>Quiz</span><span>Game</span></div>
            <div class="sum-card sum-card-2">
              <h4>Key idea</h4>
              <p>Mitochondria are the <b>powerhouse of the cell</b> — converting nutrients into ATP, the molecule cells use for energy.</p>
            </div>
            <div class="sum-card">
              <h4>Highlights</h4>
              <ul class="bullets-list">
                <li>Have their own <b>DNA</b>, inherited maternally</li>
                <li>Wrapped in a <b>double membrane</b></li>
                <li>ATP produced via the <b>Krebs cycle</b></li>
              </ul>
            </div>
          </motion.div>

          <!-- 4. QUIZ -->
          <motion.div v-else-if="screens[active]==='quiz'" key="quiz" class="screen" v-bind="t">
            <div class="s-top"><span class="s-back">‹</span><span class="s-title">Quiz · 3 of 5</span><span class="s-meta">3 / 5</span></div>
            <div class="progress mini"><span style="width:60%"></span></div>
            <div class="q">Mitochondria produce most of the cell's supply of…</div>
            <div class="opts">
              <div class="opt">Glucose</div>
              <div class="opt is-correct">
                <span>ATP</span>
                <svg viewBox="0 0 14 14" width="12" height="12"><path d="M3 7l3 3 5-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div class="opt">DNA</div>
              <div class="opt">Chlorophyll</div>
            </div>
            <button class="screen-cta">Next question</button>
          </motion.div>

          <!-- 5. GAME -->
          <motion.div v-else-if="screens[active]==='game'" key="game" class="screen" v-bind="t">
            <div class="s-top"><span class="s-back">‹</span><span class="s-title">Guess the Word</span><span class="s-meta">Round 2 / 4</span></div>
            <div class="clue">The molecule mitochondria produce to give cells <em>energy</em>.</div>
            <div class="tiles">
              <span>A</span><span>T</span><span>P</span>
            </div>
            <div class="keys">
              <span>Q</span><span>W</span><span>E</span><span>R</span><span class="used">T</span><span>Y</span>
              <span>U</span><span>I</span><span class="pulse">O</span><span class="used wrong">P</span><span>A</span><span>S</span>
            </div>
            <div class="lives">
              <svg v-for="n in 6" :key="n" viewBox="0 0 16 16" width="13" height="13" :class="{ dim: n === 6 }"><path d="M8 14s-5-3-5-7a3 3 0 0 1 5-2 3 3 0 0 1 5 2c0 4-5 7-5 7z" fill="currentColor"/></svg>
            </div>
          </motion.div>

          <!-- 6. LIBRARY -->
          <motion.div v-else key="library" class="screen" v-bind="t">
            <div class="s-top"><span class="s-title">Library</span><span class="s-meta">+ New</span></div>
            <div class="search">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3" stroke-linecap="round"/></svg>
              Search your sets
            </div>
            <div class="lib-card">
              <div class="lib-ic" style="background:rgba(255,107,26,.1);color:#FF6B1A">Bi</div>
              <div class="lib-meta"><b>Mitochondria</b><span>Biology · 5 / 5</span></div>
              <span class="dot ok"></span>
            </div>
            <div class="lib-card">
              <div class="lib-ic" style="background:rgba(30,94,255,.1);color:#1E5EFF">As</div>
              <div class="lib-meta"><b>The Solar System</b><span>Astronomy · 3 / 8</span></div>
              <span class="dot mid"></span>
            </div>
            <div class="lib-card">
              <div class="lib-ic" style="background:rgba(255,179,71,.18);color:#B36100">Hi</div>
              <div class="lib-meta"><b>French Revolution</b><span>History · 2 / 6</span></div>
              <span class="dot low"></span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div class="tabbar">
          <button :class="{ on: ['input','loading'].includes(screens[active]) }" aria-label="Create">
            <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 3v12M3 9h12"/></svg>
          </button>
          <button :class="{ on: ['summary','quiz','game'].includes(screens[active]) }" aria-label="Study">
            <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 4h5a2 2 0 0 1 2 2v9a2 2 0 0 0-2-2H3zM15 4h-5a2 2 0 0 0-2 2v9a2 2 0 0 1 2-2h5z"/></svg>
          </button>
          <button :class="{ on: screens[active]==='library' }" aria-label="Library">
            <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 3v12M7 3v12M10 4l3 12M14 4l1 12"/></svg>
          </button>
          <button aria-label="Profile">
            <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="9" cy="6" r="3"/><path d="M3 16c1-3.5 3.5-5 6-5s5 1.5 6 5"/></svg>
          </button>
        </div>
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
      <div class="fc-ic" :style="{ background: fc.bg, color: fc.color }">
        <svg v-if="fc.icon==='check'" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l3.5 3.5L13 5"/></svg>
        <svg v-else-if="fc.icon==='star'" viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 1.5l2 4.5 5 .5-3.7 3.4 1 4.9L8 12.4 3.7 14.8l1-4.9L1 6.5l5-.5z"/></svg>
        <svg v-else viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M9 1L3 9h4l-1 6 7-9H9z"/></svg>
      </div>
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
    0 40px 90px rgba(11,18,32,.18),
    0 18px 40px rgba(11,18,32,.08),
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
.status-bar{
  position:absolute;top:0;left:0;right:0;height:46px;
  display:flex;justify-content:space-between;align-items:flex-end;
  padding:0 30px 6px;font-size:12px;font-weight:600;color:var(--text);z-index:4;
  pointer-events:none;
}
.status-right{display:flex;align-items:center;gap:4px;color:var(--text)}

.screen{
  position:absolute;inset:0;
  padding:52px 16px 56px;
  display:flex;flex-direction:column;gap:12px;
}
.screen-center{justify-content:center;align-items:center;text-align:center}

.s-top{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--text-2)}
.s-back{font-size:22px;line-height:1;color:var(--primary)}
.s-title{color:var(--text);font-weight:600;font-size:15px;flex:1}
.s-meta{font-size:11.5px;color:var(--text-2);background:var(--surface);padding:3px 8px;border-radius:999px}

.tabs{display:flex;gap:4px;background:var(--surface);border-radius:10px;padding:3px}
.tab{flex:1;text-align:center;padding:7px;font-size:11.5px;color:var(--text-2);border-radius:8px;font-weight:500;white-space:nowrap}
.tab.is-on{background:#fff;color:var(--text);box-shadow:var(--shadow-1)}

.input-card{
  background:var(--surface);border-radius:14px;padding:14px;
  display:flex;flex-direction:column;gap:8px;
}
.type-line{font-size:13px;line-height:1.4}
.type-line.muted{color:var(--text-2);font-size:11.5px}
.type-line.url{color:var(--text);font-weight:500;font-size:12px;font-family:ui-monospace,Menlo,monospace;word-break:break-all}
.hint{font-size:10.5px;color:var(--text-2);margin-top:2px}
.caret{display:inline-block;width:1.5px;height:12px;background:var(--primary);vertical-align:middle;animation:blink 1s infinite}
@keyframes blink{50%{opacity:0}}

.screen-cta{
  background:#0B1220;color:#fff;border-radius:11px;
  padding:11px;font-weight:600;font-size:13px;letter-spacing:-.005em;
}
.chips{display:flex;gap:6px;flex-wrap:wrap}
.chips span{font-size:11px;padding:4px 9px;background:transparent;border:1px solid var(--border);border-radius:999px;color:var(--text-2);font-weight:500}

/* loading */
.orbit-lg{position:relative;width:70px;height:70px;margin-bottom:18px}
.orbit-lg span{position:absolute;width:14px;height:14px;border-radius:50%;left:50%;top:50%;margin:-7px}
.orbit-lg span:nth-child(1){background:var(--primary);animation:orbit 2s linear infinite}
.orbit-lg span:nth-child(2){background:var(--secondary);animation:orbit 2s linear infinite -.66s}
.orbit-lg span:nth-child(3){background:var(--primary-2);animation:orbit 2s linear infinite -1.33s}
@keyframes orbit{from{transform:rotate(0) translateX(28px) rotate(0)}to{transform:rotate(360deg) translateX(28px) rotate(-360deg)}}
.load-title{font-size:15px;font-weight:600;margin-bottom:14px}
.load-steps{display:flex;flex-direction:column;gap:7px;font-size:12px;color:var(--text-2);align-items:flex-start;width:100%;padding:0 28px;margin-bottom:18px}
.load-step{display:flex;align-items:center;gap:8px}
.load-step.done{color:#15803d}
.load-step.doing{color:var(--primary)}

/* segments */
.seg{display:flex;gap:3px;background:var(--surface);border-radius:10px;padding:3px;font-size:12px}
.seg span{flex:1;text-align:center;padding:7px;border-radius:8px;color:var(--text-2);font-weight:500}
.seg .is-on{background:#fff;color:var(--text);box-shadow:var(--shadow-1)}

.sum-card{background:var(--surface);border-radius:14px;padding:13px}
.sum-card h4{margin:0 0 6px;font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-2)}
.sum-card p{margin:0;font-size:12.5px;line-height:1.5}
.sum-card-2{background:#FBFAF6;border:1px solid var(--border)}
.sum-card-2 h4{color:var(--primary)}
.bullets-list{margin:0;padding-left:14px;font-size:12px;line-height:1.6;display:flex;flex-direction:column;gap:2px}

/* quiz */
.q{font-size:14px;font-weight:600;line-height:1.35}
.opts{display:flex;flex-direction:column;gap:7px}
.opt{background:var(--surface);padding:11px 13px;border-radius:11px;font-size:12.5px;font-weight:500;border:2px solid transparent}
.opt.is-correct{background:#fff;border-color:var(--primary);color:var(--primary);display:flex;align-items:center;justify-content:space-between}
.progress{height:6px;background:var(--surface);border-radius:3px;overflow:hidden}
.progress.mini{height:4px}
.progress span{display:block;height:100%;background:linear-gradient(90deg,#FF6B1A,#1E5EFF);transition:width 1s var(--ease)}

/* game */
.clue{font-size:12.5px;color:var(--text);background:var(--surface);padding:11px;border-radius:11px;line-height:1.4}
.tiles{display:flex;gap:6px;justify-content:center;padding:8px 0}
.tiles span{width:34px;height:42px;background:#fff;border:1.5px solid var(--primary);color:var(--primary);border-radius:8px;display:grid;place-items:center;font-weight:800;font-size:18px;font-family:var(--serif);font-style:italic}
.keys{display:grid;grid-template-columns:repeat(6,1fr);gap:4px}
.keys span{background:var(--surface);padding:7px 0;text-align:center;font-size:11.5px;font-weight:600;border-radius:6px}
.keys .used{opacity:.3}
.keys .wrong{background:#fee2e2;color:#dc2626;opacity:1}
.keys .pulse{background:var(--text);color:#fff;animation:pulseKey 1.6s infinite}
@keyframes pulseKey{0%,100%{box-shadow:0 0 0 0 rgba(11,18,32,.25)}50%{box-shadow:0 0 0 6px rgba(11,18,32,0)}}
.lives{display:flex;gap:3px;justify-content:center;color:#EF4444}
.lives svg.dim{opacity:.2}

/* library */
.search{background:var(--surface);padding:9px 12px;border-radius:10px;font-size:12.5px;color:var(--text-2);display:flex;gap:8px;align-items:center}
.lib-card{background:#fff;border:1px solid var(--border);border-radius:12px;padding:10px;display:flex;align-items:center;gap:10px}
.lib-ic{width:32px;height:32px;border-radius:8px;display:grid;place-items:center;font-size:11px;font-weight:700;flex-shrink:0;font-family:var(--serif);font-style:italic}
.lib-meta{flex:1;display:flex;flex-direction:column;line-height:1.25}
.lib-meta b{font-size:12.5px;font-weight:600}
.lib-meta span{font-size:10.5px;color:var(--text-2)}
.dot{width:8px;height:8px;border-radius:50%}
.dot.ok{background:#22C55E}
.dot.mid{background:var(--accent)}
.dot.low{background:#EF4444}

/* tabbar */
.tabbar{position:absolute;bottom:0;left:0;right:0;height:46px;display:flex;justify-content:space-around;align-items:center;border-top:1px solid var(--border);background:#fff;color:var(--text-2)}
.tabbar button{padding:0;display:grid;place-items:center}
.tabbar .on{color:var(--primary)}

/* floating cards */
.float-card{
  position:absolute;background:#fff;border-radius:14px;padding:11px 13px;
  display:flex;align-items:center;gap:10px;
  box-shadow:var(--shadow-2);border:1px solid var(--border);
  font-size:13px;z-index:5;
}
.float-card b{display:block;font-size:13px;font-weight:600}
.float-card span{display:block;font-size:11px;color:var(--text-2)}
.fc-ic{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;font-weight:700;font-size:14px}
.fc-1{top:12%;left:-30px}
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
