<script setup>
import { ref } from 'vue';
import { motion } from 'motion-v';

/* ---------- preview state ---------- */
const flipped = ref(false);
const matched = ref(new Set());
const tapMatch = (id) => {
  if (matched.value.has(id)) return;
  const n = new Set(matched.value); n.add(id); matched.value = n;
  if (matched.value.size >= 3) {
    setTimeout(() => { matched.value = new Set(); }, 1400);
  }
};
const blankFilled = ref('ATP');

/* ---------- game data ---------- */
const games = [
  {
    id: 'guess',
    color: '#FF6B1A',
    tag: 'Flame engine',
    title: 'Guess the Word',
    lede: 'Tap letters to reveal the hidden term before you run out of lives.',
    points: [
      { k: 'Mechanic', v: 'Hangman-style letter reveal with animated tile flips' },
      { k: 'Lives', v: '6 wrong guesses per round' },
      { k: 'Best for', v: 'Vocabulary, definitions, named-entity recall' },
      { k: 'Accessibility', v: 'High-contrast tiles, audio cue on correct, no time pressure' },
    ],
    badges: ['Vocab', 'Definitions', 'Names & dates'],
  },
  {
    id: 'flash',
    color: '#1E5EFF',
    tag: 'Spaced repetition',
    title: 'Flashcards',
    lede: 'Flip a card to check yourself — keep what you know, repeat what you don\'t.',
    points: [
      { k: 'Mechanic', v: 'Tap to flip 3D, swipe right (got it) / left (review)' },
      { k: 'Algorithm', v: 'SM-2 spaced repetition — harder cards return sooner' },
      { k: 'Best for', v: 'Term ↔ definition pairs, languages, formulas' },
      { k: 'Accessibility', v: 'Read-aloud on each card, OpenDyslexic font option' },
    ],
    badges: ['Languages', 'Formulas', 'Long-term recall'],
  },
  {
    id: 'match',
    color: '#FFB347',
    tag: 'Memory mode',
    title: 'Match Pairs',
    lede: 'Pair terms with the right definitions before the timer runs out.',
    points: [
      { k: 'Mechanic', v: 'Pick one from the left column, one from the right' },
      { k: 'Timer', v: 'Configurable: relaxed, 60s, or speed-round 30s' },
      { k: 'Best for', v: 'Concepts that come in pairs — cause/effect, term/definition' },
      { k: 'Accessibility', v: 'Pairs lock in colour, not just position; no flashing' },
    ],
    badges: ['Concepts', 'Pairs', 'Quick recap'],
  },
  {
    id: 'fill',
    color: '#16A34A',
    tag: 'Cloze deletion',
    title: 'Fill the Blank',
    lede: 'Drag the right word into the gap to complete the sentence in context.',
    points: [
      { k: 'Mechanic', v: 'Drag-and-drop word bank into highlighted gaps' },
      { k: 'Source', v: 'Sentences taken from the article you uploaded, never invented' },
      { k: 'Best for', v: 'Context, comprehension, scientific writing patterns' },
      { k: 'Accessibility', v: 'Works with tap-to-place, not only drag' },
    ],
    badges: ['Context', 'Comprehension', 'Writing patterns'],
  },
];

const reveal = (i) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] },
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
      <h2>Four <em>real</em> games. <br/>Not just a quiz in a costume.</h2>
      <p>Each study set ships with four interactive modes — built for different brains, different moods, and different topics.</p>
    </motion.div>

    <!-- ALTERNATING DETAIL ROWS -->
    <div class="rows">
      <motion.article
        v-for="(g, i) in games"
        :key="g.id"
        class="row"
        :class="{ flip: i % 2 === 1 }"
        :style="{ '--c': g.color }"
        v-bind="reveal(i)"
      >
        <!-- COPY SIDE -->
        <div class="row-copy">
          <span class="row-tag">{{ g.tag }}</span>
          <h3>{{ g.title }}</h3>
          <p class="row-lede">{{ g.lede }}</p>

          <dl class="row-grid">
            <template v-for="p in g.points" :key="p.k">
              <dt>{{ p.k }}</dt>
              <dd>{{ p.v }}</dd>
            </template>
          </dl>

          <div class="row-badges">
            <span v-for="b in g.badges" :key="b">{{ b }}</span>
          </div>
        </div>

        <!-- VISUAL SIDE -->
        <div class="row-vis">
          <!-- GUESS -->
          <div v-if="g.id==='guess'" class="vis-guess">
            <div class="vg-clue">Smallest unit of an element.</div>
            <div class="vg-tiles">
              <span v-for="(l, idx) in ['A','T','O','M']" :key="idx" :style="{ animationDelay: idx*0.12 + 's' }">{{ l }}</span>
            </div>
            <div class="vg-keys">
              <span v-for="k in ['Q','W','E','R','T','Y','U','I','O','P']" :key="k" :class="{ pulse: k==='O' }">{{ k }}</span>
            </div>
            <div class="vg-lives">
              <svg v-for="n in 6" :key="n" viewBox="0 0 16 16" width="11" height="11" :class="{ dim: n === 6 }"><path d="M8 14s-5-3-5-7a3 3 0 0 1 5-2 3 3 0 0 1 5 2c0 4-5 7-5 7z" fill="currentColor"/></svg>
            </div>
          </div>

          <!-- FLASH -->
          <div v-else-if="g.id==='flash'" class="vis-flash" @click="flipped = !flipped">
            <motion.div class="card3d"
              :animate="{ rotateY: flipped ? 180 : 0 }"
              :transition="{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }"
            >
              <div class="face front">
                <span class="face-tag">Term</span>
                <b>Mitochondria</b>
                <span class="face-foot">Tap to reveal</span>
              </div>
              <div class="face back">
                <span class="face-tag">Definition</span>
                <b>The cell's powerhouse — converts nutrients into ATP for energy.</b>
                <span class="face-foot swipe">← review · got it →</span>
              </div>
            </motion.div>
          </div>

          <!-- MATCH -->
          <div v-else-if="g.id==='match'" class="vis-match">
            <div class="match-timer"><span></span></div>
            <div class="match-grid">
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
                :class="{ on: matched.has(p.id) }"
                @click="tapMatch(p.id)"
              >{{ p.t }}</button>
            </div>
            <div class="match-foot">{{ matched.size }} / 3 pairs</div>
          </div>

          <!-- FILL -->
          <div v-else class="vis-fill">
            <div class="fill-sentence">
              Mitochondria produce
              <span class="blank" :class="{ filled: blankFilled }">{{ blankFilled || '_____' }}</span>
              for cellular energy.
            </div>
            <div class="fill-bank">
              <button
                v-for="w in ['ATP', 'DNA', 'RNA']"
                :key="w"
                class="bank"
                :class="{ used: blankFilled === w }"
                @click="blankFilled = blankFilled === w ? '' : w"
              >{{ w }}</button>
            </div>
            <div class="fill-foot">Tap a word to drop it in.</div>
          </div>
        </div>
      </motion.article>
    </div>
  </section>
</template>

<style scoped>
.games{padding:60px 24px 100px;max-width:1100px;margin:0 auto}
.section-head h2 em{
  font-family:var(--serif);font-style:italic;font-weight:400;
  background:linear-gradient(120deg,#FF6B1A,#1E5EFF);
  -webkit-background-clip:text;background-clip:text;color:transparent;
}

.rows{display:flex;flex-direction:column;gap:20px}
.row{
  display:grid;grid-template-columns:1fr 1fr;gap:0;
  background:#fff;border:1px solid var(--border);border-radius:18px;
  overflow:hidden;transition:box-shadow .4s, border-color .4s;
}
.row:hover{box-shadow:var(--shadow-1);border-color:#d8d2c8}
.row.flip{direction:rtl}
.row.flip > *{direction:ltr}

.row-copy{padding:28px 30px;display:flex;flex-direction:column;gap:12px;justify-content:center}
.row-tag{
  font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;
  color:var(--c);background:color-mix(in srgb,var(--c) 12%, transparent);
  padding:4px 10px;border-radius:999px;width:fit-content;
}
.row-copy h3{margin:0;font-size:22px;font-weight:700;letter-spacing:-.015em}
.row-lede{margin:0;font-size:14px;color:var(--text-2);line-height:1.55}

.row-grid{
  display:grid;grid-template-columns:auto 1fr;gap:6px 14px;margin:6px 0 4px;
}
.row-grid dt{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text-2);padding-top:2px}
.row-grid dd{margin:0;font-size:13px;color:var(--text);line-height:1.45}

.row-badges{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}
.row-badges span{
  font-size:11.5px;font-weight:500;color:var(--text-2);
  border:1px solid var(--border);padding:3px 9px;border-radius:999px;
}

/* ---------- VISUAL SIDE ---------- */
.row-vis{
  position:relative;min-height:280px;
  background:#FBFAF6;
  background-image:
    linear-gradient(rgba(30,94,255,.06) 1px,transparent 1px),
    linear-gradient(90deg, rgba(30,94,255,.06) 1px,transparent 1px);
  background-size:20px 20px;
  border-left:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;
  padding:24px;
}
.row.flip .row-vis{border-left:0;border-right:1px solid var(--border)}

/* GUESS */
.vis-guess{display:flex;flex-direction:column;gap:10px;align-items:center;width:100%}
.vg-clue{font-size:12px;color:var(--text-2);background:#fff;border:1px solid var(--border);padding:8px 12px;border-radius:10px;font-style:italic;font-family:var(--serif)}
.vg-tiles{display:flex;gap:6px}
.vg-tiles span{
  width:38px;height:46px;background:#fff;border:1.5px solid var(--c);color:var(--c);
  border-radius:8px;display:grid;place-items:center;font-weight:800;font-size:20px;
  font-family:var(--serif);font-style:italic;
  animation:tileBounce 2.6s ease-in-out infinite;
}
@keyframes tileBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px) rotate(-3deg)}}
.vg-keys{display:grid;grid-template-columns:repeat(10,1fr);gap:3px;width:100%;max-width:240px}
.vg-keys span{background:#fff;border:1px solid var(--border);padding:6px 0;font-size:10.5px;font-weight:700;text-align:center;border-radius:5px;color:var(--text-2)}
.vg-keys .pulse{background:var(--c);color:#fff;border-color:var(--c)}
.vg-lives{display:flex;gap:3px;color:#EF4444}
.vg-lives svg.dim{opacity:.2}

/* FLASH */
.vis-flash{perspective:1000px;cursor:pointer;width:100%;display:grid;place-items:center}
.card3d{position:relative;width:240px;height:150px;transform-style:preserve-3d}
.face{
  position:absolute;inset:0;border-radius:14px;background:#fff;border:1px solid var(--border);
  box-shadow:var(--shadow-1);padding:16px;
  display:flex;flex-direction:column;justify-content:space-between;
  backface-visibility:hidden;
}
.face-tag{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--c);font-weight:700}
.face b{font-size:18px;font-weight:700;letter-spacing:-.01em;line-height:1.25}
.face-foot{font-size:10.5px;color:var(--text-2)}
.back{background:linear-gradient(135deg, color-mix(in srgb,var(--c) 6%, #fff), #fff);transform:rotateY(180deg)}
.back b{font-size:13.5px;font-weight:500;line-height:1.45}
.face-foot.swipe{color:var(--c);font-weight:600}

/* MATCH */
.vis-match{width:100%;display:flex;flex-direction:column;gap:10px}
.match-timer{height:3px;background:var(--border);border-radius:2px;overflow:hidden}
.match-timer span{display:block;height:100%;width:55%;background:var(--c);animation:timer 6s linear infinite}
@keyframes timer{0%{width:100%}100%{width:0}}
.match-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.match-tile{
  background:#fff;border:1.5px solid var(--border);border-radius:8px;
  padding:9px 8px;font-size:12px;font-weight:600;color:var(--text);
  transition:all .35s var(--ease);text-align:center;
}
.match-tile:hover{border-color:var(--c)}
.match-tile.on{background:var(--c);color:#fff;border-color:var(--c)}
.match-foot{font-size:11.5px;color:var(--text-2);text-align:center;font-weight:500}

/* FILL */
.vis-fill{width:100%;display:flex;flex-direction:column;gap:14px;align-items:center}
.fill-sentence{font-size:14px;line-height:1.7;color:var(--text);text-align:center;max-width:280px}
.blank{
  display:inline-block;padding:2px 10px;border-radius:7px;
  border-bottom:2px dashed var(--c);font-weight:700;color:var(--c);
  min-width:60px;text-align:center;
}
.blank.filled{background:color-mix(in srgb,var(--c) 14%,transparent);border-bottom-color:transparent}
.fill-bank{display:flex;gap:6px}
.bank{
  background:#fff;border:1px solid var(--border);padding:5px 14px;
  border-radius:999px;font-size:12px;font-weight:600;color:var(--text);
  cursor:pointer;transition:all .25s;
}
.bank:hover{border-color:var(--c);color:var(--c)}
.bank.used{background:var(--c);color:#fff;border-color:var(--c);opacity:.5}
.fill-foot{font-size:11px;color:var(--text-2)}

@media (max-width:760px){
  .row{grid-template-columns:1fr}
  .row.flip{direction:ltr}
  .row-vis{border-left:0;border-top:1px solid var(--border);min-height:240px}
  .row.flip .row-vis{border-right:0;border-top:1px solid var(--border)}
}
</style>
