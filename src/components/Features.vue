<script setup>
import { motion } from 'motion-v';

const features = [
  {
    color: '#FF6B1A',
    title: 'Smart Summary',
    desc: 'Long articles, dense PDFs and lecture notes compressed into the bits that actually matter.',
    kind: 'bars',
  },
  {
    color: '#1E5EFF',
    title: 'Adaptive Quiz',
    desc: 'Multiple-choice questions tuned to the source material — instant feedback, no fluff.',
    kind: 'quiz',
  },
  {
    color: '#FFB347',
    title: 'Guess the Word',
    desc: 'A flame-powered mini-game with letter tiles, lives and a confetti burst when you nail it.',
    kind: 'tiles',
  },
];

const reveal = (i) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] },
});
</script>

<template>
  <section class="features" id="features">
    <motion.div class="section-head"
      :initial="{ opacity: 0, y: 24 }"
      :while-in-view="{ opacity: 1, y: 0 }"
      :viewport="{ once: true, amount: 0.4 }"
      :transition="{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }"
    >
      <span class="eyebrow">Why PlayStudy</span>
      <h2>Three ways to learn, <em>baked in</em>.</h2>
      <p>Each study set is built around how your brain actually remembers things — read, recall, play.</p>
    </motion.div>

    <div class="feature-grid">
      <motion.article
        v-for="(f, i) in features"
        :key="f.title"
        class="feature"
        :style="{ '--c': f.color }"
        v-bind="reveal(i)"
        :while-hover="{ y: -8 }"
      >
        <div class="f-ic">
          <!-- Smart Summary: a folded page with sketched ruled lines, a
               highlighter swoosh, a serif sigma collapsing it down to one key line. -->
          <svg v-if="f.kind==='bars'" viewBox="0 0 56 56" fill="none" stroke="currentColor" width="44" height="44" aria-hidden="true">
            <!-- highlight stripe behind -->
            <rect x="9" y="22" width="26" height="6" rx="3" fill="currentColor" opacity=".12"/>
            <!-- page with folded corner -->
            <path d="M12 8h22l8 8v28a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" stroke-width="1.7" stroke-linejoin="round"/>
            <path d="M34 8v8h8" stroke-width="1.7" stroke-linejoin="round"/>
            <!-- sketchy ruled lines -->
            <path d="M16 18h10" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M16 26h18" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M16 32c4 .4 8-.3 12 0 4 .3 8 0 10 .2" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="2 3"/>
            <path d="M16 38c5 .6 9-.4 14 .1" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="2 3"/>
            <!-- italic serif sigma badge -->
            <text x="40" y="48" font-family="'Instrument Serif', serif" font-style="italic" font-size="18" fill="currentColor">Σ</text>
          </svg>

          <!-- Adaptive Quiz: a hand-drawn radio group with one ticked and a
               branching arrow forking — represents "adaptive". -->
          <svg v-else-if="f.kind==='quiz'" viewBox="0 0 56 56" fill="none" stroke="currentColor" width="44" height="44" aria-hidden="true">
            <!-- three options drawn slightly askew -->
            <circle cx="14" cy="14" r="5.5" stroke-width="1.7"/>
            <circle cx="14" cy="30" r="5.5" stroke-width="1.7" fill="currentColor" fill-opacity=".14"/>
            <circle cx="14" cy="30" r="2" fill="currentColor"/>
            <circle cx="14" cy="46" r="5.5" stroke-width="1.7"/>
            <!-- hand-drawn check next to the selected one -->
            <path d="M22 28l3 4 8-9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- branching adaptive arrow -->
            <path d="M40 14c5 0 5 16 10 16" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="2 3"/>
            <path d="M40 46c5 0 5-16 10-16" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="2 3"/>
            <path d="M48 30l4-2v4z" fill="currentColor"/>
          </svg>

          <!-- Guess the Word: a row of dashed underlines with one filled
               serif-italic letter, plus a tiny pencil mark above. -->
          <svg v-else viewBox="0 0 56 56" fill="none" stroke="currentColor" width="44" height="44" aria-hidden="true">
            <!-- pencil tick -->
            <path d="M40 12l4-4 4 4-4 4z" stroke-width="1.6" stroke-linejoin="round"/>
            <path d="M40 12l-4 4" stroke-width="1.6" stroke-linecap="round"/>
            <!-- four letter slots -->
            <g stroke-width="2" stroke-linecap="round">
              <line x1="8" y1="40" x2="18" y2="40"/>
              <line x1="22" y1="40" x2="32" y2="40"/>
              <line x1="36" y1="40" x2="46" y2="40"/>
            </g>
            <!-- one revealed serif letter -->
            <rect x="22" y="22" width="10" height="14" rx="2" fill="currentColor" fill-opacity=".14" stroke-width="1.7"/>
            <text x="27" y="34" font-family="'Instrument Serif', serif" font-style="italic" font-size="14" font-weight="400" fill="currentColor" text-anchor="middle">a</text>
            <!-- empty slot ghost letters as dotted boxes -->
            <rect x="8" y="22" width="10" height="14" rx="2" stroke-width="1.4" stroke-dasharray="2 2"/>
            <rect x="36" y="22" width="10" height="14" rx="2" stroke-width="1.4" stroke-dasharray="2 2"/>
            <!-- caret -->
            <path d="M40 22v-3" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h3>{{ f.title }}</h3>
        <p>{{ f.desc }}</p>

        <div v-if="f.kind==='bars'" class="f-preview f-preview-1">
          <span></span><span></span><span></span><span></span>
        </div>
        <div v-else-if="f.kind==='quiz'" class="f-preview f-preview-2">
          <span>A</span><span class="hit">B</span><span>C</span><span>D</span>
        </div>
        <div v-else class="f-preview f-preview-3">
          <span>P</span><span>L</span><span>A</span><span>Y</span>
        </div>
      </motion.article>
    </div>
  </section>
</template>

<style scoped>
.features{padding:100px 24px;max-width:1100px;margin:0 auto}
.feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.feature{
  position:relative;
  background:#fff;
  border:1px solid var(--border);
  border-radius:18px;
  padding:22px;
  overflow:hidden;
  transition:box-shadow .5s ease, border-color .5s;
}
.feature::before{
  content:"";position:absolute;inset:0;
  background:radial-gradient(circle at 20% 0%, var(--c, #FF6B1A), transparent 60%);
  opacity:0;transition:opacity .5s;
}
.feature:hover{box-shadow:var(--shadow-2);border-color:transparent}
.feature:hover::before{opacity:.08}
.f-ic{
  width:64px;height:64px;border-radius:14px;
  background:#FBFAF6;
  background-image:
    linear-gradient(rgba(30,94,255,.07) 1px,transparent 1px),
    linear-gradient(90deg, rgba(30,94,255,.07) 1px,transparent 1px);
  background-size:12px 12px;
  border:1px solid var(--border);
  color:var(--c);display:grid;place-items:center;margin-bottom:16px;
  transition:transform .5s var(--ease), border-color .5s;
}
.feature:hover .f-ic{transform:translateY(-2px);border-color:var(--c)}
.feature h3{margin:0 0 6px;font-size:17px;font-weight:700;letter-spacing:-.01em}
.feature p{margin:0;color:var(--text-2);font-size:13.5px;line-height:1.5}
.f-preview{
  margin-top:16px;height:64px;border-radius:12px;
  background:var(--surface);padding:16px;
  display:flex;align-items:center;justify-content:center;gap:8px;
  position:relative;overflow:hidden;
}
.f-preview-1 span{height:6px;background:var(--c);border-radius:3px;display:block;animation:bar 2.4s var(--ease) infinite}
.f-preview-1 span:nth-child(1){width:80px;animation-delay:0s}
.f-preview-1 span:nth-child(2){width:60px;animation-delay:.15s;opacity:.7}
.f-preview-1 span:nth-child(3){width:90px;animation-delay:.3s;opacity:.5}
.f-preview-1 span:nth-child(4){width:50px;animation-delay:.45s;opacity:.3}
@keyframes bar{0%,100%{transform:scaleX(.6)}50%{transform:scaleX(1)}}

.f-preview-2 span{width:42px;height:42px;border-radius:10px;background:#fff;border:2px solid var(--border);display:grid;place-items:center;font-weight:700;font-size:14px}
.f-preview-2 .hit{background:var(--c);color:#fff;border-color:var(--c);animation:popIn .8s var(--ease) infinite alternate}
@keyframes popIn{from{transform:scale(.92)}to{transform:scale(1.06)}}

.f-preview-3 span{width:42px;height:48px;background:#fff;border:2px solid var(--c);border-radius:8px;display:grid;place-items:center;font-weight:800;color:var(--c);animation:tileFlip 3s ease-in-out infinite}
.f-preview-3 span:nth-child(2){animation-delay:.2s}
.f-preview-3 span:nth-child(3){animation-delay:.4s}
.f-preview-3 span:nth-child(4){animation-delay:.6s}
@keyframes tileFlip{0%,80%,100%{transform:rotateY(0)}40%{transform:rotateY(180deg);background:var(--c);color:#fff}}

@media (max-width:960px){.feature-grid{grid-template-columns:1fr}}
</style>
