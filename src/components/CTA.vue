<script setup>
import { motion } from 'motion-v';
</script>

<template>
  <section class="cta" id="download">
    <motion.div
      class="cta-card"
      :initial="{ opacity: 0, y: 40, scale: 0.96 }"
      :while-in-view="{ opacity: 1, y: 0, scale: 1 }"
      :viewport="{ once: true, amount: 0.3 }"
      :transition="{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }"
    >
      <div class="cta-blob"></div>
      <div class="cta-blob cta-blob-2"></div>
      <h2>Stop re-reading. <br/><em>Start playing.</em></h2>
      <p>PlayStudy is a free download. Bring any topic — leave with a study set that fits in your pocket.</p>
      <div class="cta-row">
        <motion.a class="btn btn-primary" href="#"
          :while-hover="{ y: -3, scale: 1.04 }"
          :while-tap="{ scale: 0.96 }">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M16.5 12c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.6 1.3 10.1.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8 1.5 0 2 .8 3.3.8 1.4 0 2.3-1.2 3.1-2.4 1-1.4 1.4-2.7 1.4-2.8-.1 0-2.8-1.1-2.8-4zm-2.6-7.3c.7-.8 1.2-2 1-3.2-1.1.1-2.3.7-3 1.6-.7.7-1.3 2-1.1 3.1 1.2.1 2.4-.6 3.1-1.5z"/></svg>
          App Store
        </motion.a>
        <motion.a class="btn btn-dark" href="#"
          :while-hover="{ y: -3, scale: 1.04 }"
          :while-tap="{ scale: 0.96 }">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M3.6 2.3 14 12 3.6 21.7c-.4-.2-.6-.6-.6-1V3.3c0-.4.2-.8.6-1z"/></svg>
          Google Play
        </motion.a>
      </div>
    </motion.div>
  </section>
</template>

<style scoped>
.cta{padding:60px 24px 120px;max-width:1240px;margin:0 auto}
.cta-card{
  position:relative;overflow:hidden;
  background:#fff;
  border:1px solid var(--border);
  color:var(--text);border-radius:32px;
  padding:80px 40px;text-align:center;
  isolation:isolate;
  box-shadow:var(--shadow-2);
}
.cta-blob{position:absolute;width:500px;height:500px;border-radius:50%;filter:blur(80px);z-index:-1;animation:float 10s ease-in-out infinite;background:#FF6B1A;top:-100px;left:-100px;opacity:.22}
.cta-blob-2{background:#1E5EFF;bottom:-150px;right:-100px;left:auto;top:auto;opacity:.18;animation-delay:-5s}
@keyframes float{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,-20px) scale(1.1)}}
.cta-card h2{font-size:clamp(34px,5vw,60px);font-weight:800;letter-spacing:-.03em;margin:0 0 16px;line-height:1.05}
.cta-card p{color:var(--text-2);font-size:17px;max-width:540px;margin:0 auto 32px}
.cta-row{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
</style>
