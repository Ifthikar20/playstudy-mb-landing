<script setup>
import { ref } from 'vue';
import { motion } from 'motion-v';

/* The four mini-games PlayStudy ships with. */
const games = [
  {
    id: 'guess',
    title: 'Guess the Word',
    color: '#FF6B1A',
    desc: 'Tap letters to reveal the hidden term. 6 lives, confetti on a win.',
    badge: 'Flame engine',
  },
  {
    id: 'flash',
    title: 'Flashcards',
    color: '#1E5EFF',
    desc: 'Flip a card to check yourself — swipe right if you got it, left to try again.',
    badge: 'Spaced repetition',
  },
  {
    id: 'match',
    title: 'Match Pairs',
    color: '#FFB347',
    desc: 'Memory mode. Match terms to their definitions before the clock runs out.',
    badge: 'Memory mode',
  },
  {
    id: 'fill',
    title: 'Fill the Blank',
    color: '#16A34A',
    desc: 'Drag the right word into the gap to complete the sentence.',
    badge: 'Cloze deletion',
  },
];

/* tiny state for the flashcard preview */
const flipped = ref(false);

/* match-pairs preview state */
const matched = ref(new Set());
const tapMatch = (id) => {
  if (matched.value.has(id)) return;
  const n = new Set(matched.value); n.add(id); matched.value = n;
  if (matched.value.size >= 3) {
    setTimeout(() => { matched.value = new Set(); }, 1400);
  }
};

const reveal = (i) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] },
});
</script>

<template>
  <section class="games" id="games">
    <motion.div class="section-head"
      :initial="{ opacity: 0, y: 24 }"
      :while-in-view="{ opacity: 1, y: 0 }"
      :viewport="{ once: true, amount: 0.4 }"
      :transition="{ duration: 0.7 }"
    >
      <span class="eyebrow">Mini-games</span>
      <h2>Four ways to <em>play your way</em> to remembering it.</h2>
      <p>Every study set ships with four interactive modes. Tap any preview to try it.</p>
    </motion.div>

    <div class="game-grid">
      <!-- 1. GUESS THE WORD -->
      <motion.article class="g-card" :style="{ '--c': games[0].color }" v-bind="reveal(0)" :while-hover="{ y: -8 }">
        <div class="g-head">
          <span class="g-badge">{{ games[0].badge }}</span>
          <h3>{{ games[0].title }}</h3>
          <p>{{ games[0].desc }}</p>
        </div>
        <div class="g-vis g-vis-guess">
          <div class="tile" v-for="(l, i) in 'ATOM'.split('')" :key="i" :style="{ animationDelay: i * 0.15 + 's' }">{{ l }}</div>
        </div>
      </motion.article>

      <!-- 2. FLASHCARDS -->
      <motion.article class="g-card" :style="{ '--c': games[1].color }" v-bind="reveal(1)" :while-hover="{ y: -8 }">
        <div class="g-head">
          <span class="g-badge">{{ games[1].badge }}</span>
          <h3>{{ games[1].title }}</h3>
          <p>{{ games[1].desc }}</p>
        </div>
        <div class="g-vis g-vis-flash" @click="flipped = !flipped">
          <motion.div
            class="card3d"
            :animate="{ rotateY: flipped ? 180 : 0 }"
            :transition="{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }"
          >
            <div class="face front">
              <span class="face-tag">Term</span>
              <b>Mitochondria</b>
            </div>
            <div class="face back">
              <span class="face-tag">Definition</span>
              <b>The cell's powerhouse — produces ATP for energy.</b>
            </div>
          </motion.div>
          <span class="flash-hint">Tap to flip ↻</span>
        </div>
      </motion.article>

      <!-- 3. MATCH PAIRS -->
      <motion.article class="g-card" :style="{ '--c': games[2].color }" v-bind="reveal(2)" :while-hover="{ y: -8 }">
        <div class="g-head">
          <span class="g-badge">{{ games[2].badge }}</span>
          <h3>{{ games[2].title }}</h3>
          <p>{{ games[2].desc }}</p>
        </div>
        <div class="g-vis g-vis-match">
          <button
            v-for="p in [
              { id: 1, t: 'Photosynthesis', side: 'L' },
              { id: 1, t: 'Plant energy', side: 'R' },
              { id: 2, t: 'Mitosis', side: 'L' },
              { id: 2, t: 'Cell division', side: 'R' },
              { id: 3, t: 'DNA', side: 'L' },
              { id: 3, t: 'Genetic code', side: 'R' },
            ]"
            :key="p.side + p.id"
            class="match-tile"
            :class="{ on: matched.has(p.id), [p.side === 'L' ? 'left' : 'right']: true }"
            @click="tapMatch(p.id)"
          >{{ p.t }}</button>
        </div>
      </motion.article>

      <!-- 4. FILL THE BLANK -->
      <motion.article class="g-card" :style="{ '--c': games[3].color }" v-bind="reveal(3)" :while-hover="{ y: -8 }">
        <div class="g-head">
          <span class="g-badge">{{ games[3].badge }}</span>
          <h3>{{ games[3].title }}</h3>
          <p>{{ games[3].desc }}</p>
        </div>
        <div class="g-vis g-vis-fill">
          <div class="sentence">
            Mitochondria produce
            <motion.span
              class="blank filled"
              :animate="{ scale: [1, 1.08, 1] }"
              :transition="{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }"
            >ATP</motion.span>
            for cellular energy.
          </div>
          <div class="word-bank">
            <span class="bank">ATP</span>
            <span class="bank">DNA</span>
            <span class="bank">RNA</span>
          </div>
        </div>
      </motion.article>
    </div>
  </section>
</template>

<style scoped>
.games{padding:40px 24px 100px;max-width:1100px;margin:0 auto}
h2 em{font-family:var(--serif);font-style:italic;font-weight:400;color:var(--secondary);padding:0 .05em}

.game-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}

.g-card{
  position:relative;
  background:#fff;border:1px solid var(--border);border-radius:18px;
  padding:20px;display:flex;flex-direction:column;gap:14px;
  overflow:hidden;
  transition:box-shadow .5s, border-color .5s;
}
.g-card::before{
  content:"";position:absolute;inset:0;
  background:radial-gradient(circle at 20% 0%, var(--c), transparent 60%);
  opacity:0;transition:opacity .5s;pointer-events:none;
}
.g-card:hover{box-shadow:var(--shadow-2);border-color:transparent}
.g-card:hover::before{opacity:.08}

.g-head{display:flex;flex-direction:column;gap:8px;position:relative;z-index:1}
.g-badge{
  font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;
  color:var(--c);background:color-mix(in srgb, var(--c) 12%, transparent);
  padding:4px 10px;border-radius:999px;width:fit-content;
}
.g-head h3{margin:0;font-size:17px;font-weight:700;letter-spacing:-.01em}
.g-head p{margin:0;color:var(--text-2);font-size:13px;line-height:1.5}

.g-vis{
  height:130px;border-radius:14px;
  background:#FBFAF6;
  background-image:
    linear-gradient(rgba(30,94,255,.06) 1px,transparent 1px),
    linear-gradient(90deg, rgba(30,94,255,.06) 1px,transparent 1px);
  background-size:18px 18px;
  border:1px solid var(--border);
  position:relative;overflow:hidden;
  display:grid;place-items:center;
}

/* GUESS — tiles flip in */
.g-vis-guess{gap:8px;display:flex}
.tile{
  width:38px;height:48px;border-radius:8px;
  background:#fff;border:1.5px solid var(--c);
  color:var(--c);font-weight:800;font-size:20px;display:grid;place-items:center;
  font-family:var(--serif);font-style:italic;
  animation:tileBounce 2.6s ease-in-out infinite;
}
@keyframes tileBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-10px) rotate(-3deg)}}

/* FLASHCARD */
.g-vis-flash{perspective:900px;cursor:pointer}
.card3d{
  position:relative;width:200px;height:100px;transform-style:preserve-3d;
}
.face{
  position:absolute;inset:0;border-radius:12px;background:#fff;border:1px solid var(--border);
  box-shadow:var(--shadow-1);
  padding:14px;display:flex;flex-direction:column;justify-content:space-between;
  backface-visibility:hidden;
}
.face-tag{font-size:9.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--c);font-weight:700}
.face b{font-size:15px;font-weight:700;letter-spacing:-.01em;line-height:1.25}
.back{background:linear-gradient(135deg, color-mix(in srgb,var(--c) 8%, #fff), #fff);transform:rotateY(180deg)}
.back b{font-size:12px;font-weight:500;line-height:1.45}
.flash-hint{position:absolute;bottom:6px;right:10px;font-size:10px;color:var(--text-2)}

/* MATCH */
.g-vis-match{
  display:grid;grid-template-columns:1fr 1fr;gap:5px;padding:12px;
}
.match-tile{
  background:#fff;border:1.5px solid var(--border);border-radius:8px;
  padding:6px 4px;font-size:11px;font-weight:600;color:var(--text);
  transition:all .35s var(--ease);text-align:center;
}
.match-tile:hover{border-color:var(--c)}
.match-tile.on{background:var(--c);color:#fff;border-color:var(--c);transform:scale(1.04)}

/* FILL */
.g-vis-fill{flex-direction:column;gap:10px;padding:14px 18px;display:flex;justify-content:center;align-items:center}
.sentence{font-size:12.5px;line-height:1.6;color:var(--text);text-align:center}
.blank{
  display:inline-block;padding:2px 10px;border-radius:8px;
  border-bottom:2px dashed var(--c);font-weight:700;
}
.blank.filled{background:color-mix(in srgb,var(--c) 14%,transparent);color:var(--c);border-bottom-color:transparent}
.word-bank{display:flex;gap:6px}
.bank{background:#fff;border:1px solid var(--border);padding:5px 12px;border-radius:999px;font-size:11.5px;font-weight:600;color:var(--text-2)}

@media (max-width:760px){
  .game-grid{grid-template-columns:1fr}
}
</style>
