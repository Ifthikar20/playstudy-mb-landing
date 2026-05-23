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
          <svg v-if="f.kind==='bars'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M4 5h16M4 12h16M4 19h10"/></svg>
          <svg v-else-if="f.kind==='quiz'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .8-1.5 1.3-1.5 2.5M12 17h.01"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>
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
  width:42px;height:42px;border-radius:12px;
  background:color-mix(in srgb, var(--c) 12%, transparent);
  color:var(--c);display:grid;place-items:center;margin-bottom:16px;
  transition:transform .5s var(--ease);
}
.feature:hover .f-ic{transform:rotate(-8deg) scale(1.05)}
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
