<script setup>
import { ref, computed } from 'vue';
import { motion } from 'motion-v';

/* ============ 1. GUESS THE WORD ============ */
const gw = {
  topic: 'Organic Chemistry',
  diff: 3,
  clue: 'Same molecular formula, different structure.',
  word: 'ISOMER',
};
const gwRevealed = ref(new Set());
const gwUsed = ref(new Set());
const gwLives = ref(6);
const gwWon = computed(() => [...new Set(gw.word)].every((c) => gwRevealed.value.has(c)));
const ROW1 = 'QWERTYUIOP'.split('');
const ROW2 = 'ASDFGHJKL'.split('');
const ROW3 = 'ZXCVBNM'.split('');
function gwGuess(ch) {
  if (gwWon.value || gwLives.value <= 0 || gwUsed.value.has(ch)) return;
  gwUsed.value = new Set(gwUsed.value).add(ch);
  if (gw.word.includes(ch)) gwRevealed.value = new Set(gwRevealed.value).add(ch);
  else gwLives.value--;
}
function gwReset() { gwRevealed.value = new Set(); gwUsed.value = new Set(); gwLives.value = 6; }
function gwKeyClass(ch) {
  if (!gwUsed.value.has(ch)) return '';
  return gw.word.includes(ch) ? 'hit' : 'miss';
}

/* ============ 2. FLASHCARDS ============ */
const fcCards = [
  { topic: 'Neuroscience', diff: 2, term: 'Myelin sheath', def: 'Fatty insulating layer around axons that speeds up signal transmission.' },
  { topic: 'Neuroscience', diff: 3, term: 'Synaptic pruning', def: 'The removal of weak neural connections to make the brain more efficient.' },
  { topic: 'Neuroscience', diff: 3, term: 'Neuroplasticity', def: 'The brain\'s ability to rewire itself by forming new connections.' },
];
const fcIndex = ref(0);
const fcFlipped = ref(false);
const fcCard = computed(() => fcCards[fcIndex.value]);
function fcNext() { fcFlipped.value = false; setTimeout(() => { fcIndex.value = (fcIndex.value + 1) % fcCards.length; }, 180); }

/* ============ 3. MATCH PAIRS ============ */
const mpTopic = 'Cell Biology';
const mpLeft = [
  { id: 'a', t: 'Ribosome' },
  { id: 'b', t: 'Golgi apparatus' },
  { id: 'c', t: 'Lysosome' },
];
const mpRight = [
  { id: 'b', t: 'Packages proteins' },
  { id: 'c', t: 'Digests waste' },
  { id: 'a', t: 'Builds proteins' },
];
const mpSel = ref(null);
const mpMatched = ref(new Set());
const mpWrong = ref(null);
function mpPick(side, id) {
  if (mpMatched.value.has(id) && side === 'L') return;
  if (side === 'L') { mpSel.value = id; return; }
  if (!mpSel.value) return;
  if (mpSel.value === id) {
    mpMatched.value = new Set(mpMatched.value).add(id);
    mpSel.value = null;
  } else {
    mpWrong.value = id;
    setTimeout(() => { mpWrong.value = null; mpSel.value = null; }, 450);
  }
}
function mpReset() { mpSel.value = null; mpMatched.value = new Set(); mpWrong.value = null; }

/* ============ 4. FILL THE BLANK ============ */
const fb = {
  topic: 'Genetics',
  diff: 3,
  before: 'During meiosis, homologous chromosomes swap segments in a process called',
  after: '.',
  answer: 'crossing over',
  options: ['translation', 'crossing over', 'mitosis'],
};
const fbPick = ref(null);
const fbCorrect = computed(() => fbPick.value === fb.answer);

const reveal = (i) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] },
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
      <h2>Four games. <em>Try them right here.</em></h2>
      <p>Every study set ships with all four. Have a go below.</p>
    </motion.div>

    <div class="rows">
      <!-- 1. GUESS THE WORD -->
      <motion.article class="row" style="--c:#FF6B1A" v-bind="reveal(0)">
        <div class="row-copy">
          <span class="row-tag">Guess the Word</span>
          <div class="row-topic">
            <span class="topic">{{ gw.topic }}</span>
            <span class="diff"><i v-for="n in 3" :key="n" :class="{ on: n <= gw.diff }"></i></span>
          </div>
          <p class="clue">{{ gw.clue }}</p>
        </div>
        <div class="row-vis">
          <div class="gw">
            <div class="gw-tiles">
              <span v-for="(l, i) in gw.word.split('')" :key="i" :class="{ on: gwRevealed.has(l) }">{{ gwRevealed.has(l) ? l : '' }}</span>
            </div>
            <div class="gw-pad">
              <div class="gw-row" v-for="(row, ri) in [ROW1, ROW2, ROW3]" :key="ri">
                <button v-for="ch in row" :key="ch" class="gw-key" :class="gwKeyClass(ch)" :disabled="gwUsed.has(ch) || gwWon || gwLives<=0" @click="gwGuess(ch)">{{ ch }}</button>
              </div>
            </div>
            <div class="gw-foot">
              <span class="gw-lives">
                <svg v-for="n in 6" :key="n" viewBox="0 0 16 16" width="12" height="12" :class="{ dim: n > gwLives }"><path d="M8 14s-5-3-5-7a3 3 0 0 1 5-2 3 3 0 0 1 5 2c0 4-5 7-5 7z" fill="currentColor"/></svg>
              </span>
              <span v-if="gwWon" class="gw-win">Nice — ISOMER!</span>
              <span v-else-if="gwLives<=0" class="gw-lose">It was ISOMER</span>
              <button v-if="gwWon || gwLives<=0" class="mini-reset" @click="gwReset">Again</button>
            </div>
          </div>
        </div>
      </motion.article>

      <!-- 2. FLASHCARDS -->
      <motion.article class="row flip" style="--c:#1E5EFF" v-bind="reveal(1)">
        <div class="row-copy">
          <span class="row-tag">Flashcards</span>
          <div class="row-topic">
            <span class="topic">{{ fcCard.topic }}</span>
            <span class="diff"><i v-for="n in 3" :key="n" :class="{ on: n <= fcCard.diff }"></i></span>
          </div>
          <p class="clue">Tap the card to flip. Card {{ fcIndex + 1 }} of {{ fcCards.length }}.</p>
        </div>
        <div class="row-vis">
          <div class="fc">
            <div class="fc-stage" @click="fcFlipped = !fcFlipped">
              <motion.div class="fc-card" :animate="{ rotateY: fcFlipped ? 180 : 0 }" :transition="{ duration: 0.55, ease: [0.2,0.8,0.2,1] }">
                <div class="fc-face fc-front">
                  <span class="fc-tag">Term</span>
                  <b>{{ fcCard.term }}</b>
                  <span class="fc-hint">Tap to reveal</span>
                </div>
                <div class="fc-face fc-back">
                  <span class="fc-tag">Definition</span>
                  <b>{{ fcCard.def }}</b>
                </div>
              </motion.div>
            </div>
            <button class="mini-reset" @click="fcNext">Next card →</button>
          </div>
        </div>
      </motion.article>

      <!-- 3. MATCH PAIRS -->
      <motion.article class="row" style="--c:#16A34A" v-bind="reveal(2)">
        <div class="row-copy">
          <span class="row-tag">Match Pairs</span>
          <div class="row-topic">
            <span class="topic">{{ mpTopic }}</span>
            <span class="diff"><i v-for="n in 3" :key="n" :class="{ on: n <= 3 }"></i></span>
          </div>
          <p class="clue">Tap a term, then its match. {{ mpMatched.size }} / 3 found.</p>
        </div>
        <div class="row-vis">
          <div class="mp">
            <div class="mp-col">
              <button v-for="l in mpLeft" :key="l.id" class="mp-tile"
                :class="{ sel: mpSel===l.id, done: mpMatched.has(l.id) }"
                :disabled="mpMatched.has(l.id)" @click="mpPick('L', l.id)">{{ l.t }}</button>
            </div>
            <div class="mp-col">
              <button v-for="r in mpRight" :key="r.id" class="mp-tile"
                :class="{ done: mpMatched.has(r.id), wrong: mpWrong===r.id }"
                :disabled="mpMatched.has(r.id)" @click="mpPick('R', r.id)">{{ r.t }}</button>
            </div>
          </div>
          <button v-if="mpMatched.size===3" class="mini-reset mp-reset" @click="mpReset">Reset</button>
        </div>
      </motion.article>

      <!-- 4. FILL THE BLANK -->
      <motion.article class="row flip" style="--c:#5856D6" v-bind="reveal(3)">
        <div class="row-copy">
          <span class="row-tag">Fill the Blank</span>
          <div class="row-topic">
            <span class="topic">{{ fb.topic }}</span>
            <span class="diff"><i v-for="n in 3" :key="n" :class="{ on: n <= fb.diff }"></i></span>
          </div>
          <p class="clue">Drop the right term into the gap.</p>
        </div>
        <div class="row-vis">
          <div class="fb">
            <p class="fb-sentence">
              {{ fb.before }}
              <span class="fb-blank" :class="{ ok: fbPick && fbCorrect, no: fbPick && !fbCorrect }">{{ fbPick || '—————' }}</span>{{ fb.after }}
            </p>
            <div class="fb-bank">
              <button v-for="o in fb.options" :key="o" class="fb-opt"
                :class="{ on: fbPick===o, ok: fbPick===o && fbCorrect, no: fbPick===o && !fbCorrect }"
                @click="fbPick = o">{{ o }}</button>
            </div>
            <span v-if="fbPick" class="fb-msg" :class="fbCorrect ? 'ok' : 'no'">
              {{ fbCorrect ? 'Correct — recombination!' : 'Not quite, try another.' }}
            </span>
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

.rows{display:flex;flex-direction:column;gap:16px}
.row{
  display:grid;grid-template-columns:.85fr 1.15fr;
  background:#fff;border:1px solid var(--border);border-radius:16px;
  overflow:hidden;transition:border-color .2s ease;
}
.row:hover{border-color:var(--text)}
.row.flip{direction:rtl}
.row.flip > *{direction:ltr}

/* ---- copy side: minimal ---- */
.row-copy{padding:26px 28px;display:flex;flex-direction:column;gap:10px;justify-content:center}
.row-tag{font-size:19px;font-weight:700;letter-spacing:-.015em;color:var(--text)}
.row-topic{display:flex;align-items:center;gap:10px}
.topic{font-size:12px;font-weight:600;color:var(--c);background:color-mix(in srgb,var(--c) 12%,transparent);padding:3px 10px;border-radius:999px}
.diff{display:inline-flex;gap:3px}
.diff i{width:14px;height:4px;border-radius:2px;background:var(--border)}
.diff i.on{background:var(--c)}
.clue{margin:0;font-size:13.5px;color:var(--text-2);line-height:1.5;font-family:var(--serif);font-style:italic;font-size:15px}

/* ---- visual side ---- */
.row-vis{
  position:relative;min-height:230px;
  background:#FBFAF6;
  background-image:
    linear-gradient(rgba(30,94,255,.05) 1px,transparent 1px),
    linear-gradient(90deg, rgba(30,94,255,.05) 1px,transparent 1px);
  background-size:20px 20px;
  border-left:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;padding:22px;
}
.row.flip .row-vis{border-left:0;border-right:1px solid var(--border)}

.mini-reset{
  font-size:12px;font-weight:600;color:var(--c);
  border:1px solid var(--border);background:#fff;padding:6px 14px;border-radius:999px;cursor:pointer;
}
.mini-reset:hover{border-color:var(--c)}

/* GUESS */
.gw{display:flex;flex-direction:column;gap:12px;align-items:center;width:100%;max-width:300px}
.gw-tiles{display:flex;gap:6px}
.gw-tiles span{
  width:36px;height:44px;background:#fff;border:1.5px solid var(--border);border-radius:8px;
  display:grid;place-items:center;font-weight:700;font-size:20px;color:var(--c);
  font-family:var(--serif);font-style:italic;
}
.gw-tiles span.on{border-color:var(--c);background:color-mix(in srgb,var(--c) 10%,#fff)}
.gw-pad{display:flex;flex-direction:column;gap:4px;width:100%}
.gw-row{display:flex;gap:4px;justify-content:center}
.gw-key{
  flex:1;max-width:26px;padding:7px 0;background:#fff;border:1px solid var(--border);border-radius:5px;
  font-size:11px;font-weight:700;color:var(--text);cursor:pointer;transition:all .15s;
}
.gw-key:hover:not(:disabled){border-color:var(--c);color:var(--c)}
.gw-key.hit{background:var(--c);color:#fff;border-color:var(--c)}
.gw-key.miss{background:#F3F4F6;color:#B0B4BC;border-color:transparent}
.gw-key:disabled{cursor:default}
.gw-foot{display:flex;align-items:center;gap:10px;min-height:20px}
.gw-lives{display:flex;gap:2px;color:#EF4444}
.gw-lives svg.dim{opacity:.2}
.gw-win{font-size:12.5px;font-weight:600;color:#16A34A}
.gw-lose{font-size:12.5px;font-weight:600;color:#EF4444}

/* FLASHCARDS */
.fc{display:flex;flex-direction:column;gap:14px;align-items:center;width:100%}
.fc-stage{perspective:1000px;cursor:pointer;width:100%;max-width:280px}
.fc-card{position:relative;width:100%;height:150px;transform-style:preserve-3d}
.fc-face{
  position:absolute;inset:0;border-radius:14px;background:#fff;border:1px solid var(--border);
  padding:16px;display:flex;flex-direction:column;justify-content:space-between;
  backface-visibility:hidden;
}
.fc-tag{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--c);font-weight:700}
.fc-front b{font-size:20px;font-weight:700;letter-spacing:-.01em}
.fc-back{transform:rotateY(180deg);background:color-mix(in srgb,var(--c) 5%,#fff)}
.fc-back b{font-size:14px;font-weight:500;line-height:1.5}
.fc-hint{font-size:10.5px;color:var(--text-2)}

/* MATCH */
.mp{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%;max-width:320px}
.mp-col{display:flex;flex-direction:column;gap:8px}
.mp-tile{
  background:#fff;border:1.5px solid var(--border);border-radius:9px;
  padding:11px 8px;font-size:12.5px;font-weight:600;color:var(--text);cursor:pointer;
  transition:all .2s;text-align:center;
}
.mp-tile:hover:not(:disabled){border-color:var(--c)}
.mp-tile.sel{border-color:var(--c);background:color-mix(in srgb,var(--c) 10%,#fff)}
.mp-tile.done{background:var(--c);color:#fff;border-color:var(--c)}
.mp-tile.wrong{border-color:#EF4444;animation:shake .4s}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.mp-reset{position:absolute;bottom:14px;right:14px}

/* FILL */
.fb{display:flex;flex-direction:column;gap:14px;align-items:center;width:100%;max-width:300px}
.fb-sentence{margin:0;font-size:14.5px;line-height:1.7;color:var(--text);text-align:center}
.fb-blank{
  display:inline-block;padding:2px 8px;border-radius:6px;font-weight:700;
  border-bottom:2px dashed var(--c);color:var(--c);min-width:80px;text-align:center;
}
.fb-blank.ok{background:#16A34A18;color:#16A34A;border-bottom-color:transparent}
.fb-blank.no{background:#EF444418;color:#EF4444;border-bottom-color:transparent}
.fb-bank{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.fb-opt{
  background:#fff;border:1px solid var(--border);padding:7px 14px;border-radius:999px;
  font-size:12.5px;font-weight:600;color:var(--text);cursor:pointer;transition:all .2s;
}
.fb-opt:hover{border-color:var(--c)}
.fb-opt.ok{background:#16A34A;color:#fff;border-color:#16A34A}
.fb-opt.no{background:#EF4444;color:#fff;border-color:#EF4444}
.fb-msg{font-size:12.5px;font-weight:600}
.fb-msg.ok{color:#16A34A}
.fb-msg.no{color:#EF4444}

@media (max-width:760px){
  .row{grid-template-columns:1fr}
  .row.flip{direction:ltr}
  .row-vis{border-left:0;border-top:1px solid var(--border)}
  .row.flip .row-vis{border-right:0;border-top:1px solid var(--border)}
}
</style>
