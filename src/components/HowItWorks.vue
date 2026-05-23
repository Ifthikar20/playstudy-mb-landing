<script setup>
import { motion } from 'motion-v';

const reveal = (i) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] },
});
</script>

<template>
  <section class="how" id="how">
    <motion.div class="section-head"
      :initial="{ opacity: 0, y: 24 }"
      :while-in-view="{ opacity: 1, y: 0 }"
      :viewport="{ once: true, amount: 0.4 }"
      :transition="{ duration: 0.7 }"
    >
      <span class="eyebrow">How it works</span>
      <h2>From paste to <em>play</em> in three steps.</h2>
    </motion.div>

    <ol class="steps">
      <motion.li class="step" v-bind="reveal(0)" :while-hover="{ y: -4 }">
        <div class="step-num">01</div>
        <h3>Drop the source</h3>
        <p>A link, a PDF, lecture notes — anything you'd normally read.</p>
        <div class="step-vis step-vis-1">
          <div class="mini-input">https://…</div>
          <div class="mini-input">notes.pdf</div>
          <div class="mini-input">"The mitochondria…"</div>
        </div>
      </motion.li>

      <motion.li class="step" v-bind="reveal(1)" :while-hover="{ y: -4 }">
        <div class="step-num">02</div>
        <h3>AI builds the set</h3>
        <p>Summary, quiz questions, and game words — generated together, in seconds.</p>
        <div class="step-vis step-vis-2">
          <div class="orbit"><span></span><span></span><span></span></div>
        </div>
      </motion.li>

      <motion.li class="step" v-bind="reveal(2)" :while-hover="{ y: -4 }">
        <div class="step-num">03</div>
        <h3>Read · Recall · Play</h3>
        <p>Move through the three modes. Each one locks the material in a little deeper.</p>
        <div class="step-vis step-vis-3">
          <span class="mode-pill" style="--c:#FF6B1A">Read</span>
          <span class="mode-pill" style="--c:#1E5EFF">Recall</span>
          <span class="mode-pill" style="--c:#FFB347">Play</span>
        </div>
      </motion.li>
    </ol>
  </section>
</template>

<style scoped>
.how{padding:40px 24px 100px;max-width:1100px;margin:0 auto}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;list-style:none;padding:0;margin:0}
.step{
  background:#fff;
  border:1px solid var(--border);border-radius:18px;
  padding:22px;position:relative;overflow:hidden;
  transition:box-shadow .5s;
}
.step:hover{box-shadow:var(--shadow-2)}
.step-num{
  font-size:14px;font-weight:700;color:var(--primary);
  background:rgba(255,107,26,.1);width:fit-content;padding:4px 10px;border-radius:999px;margin-bottom:16px;
}
.step h3{margin:0 0 6px;font-size:17px;font-weight:700;letter-spacing:-.01em}
.step p{margin:0 0 16px;color:var(--text-2);font-size:13.5px;line-height:1.5}
.step-vis{height:80px;border-radius:12px;background:var(--surface);padding:14px;display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap}

.mini-input{background:#fff;border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-size:12.5px;color:var(--text-2);font-family:monospace}
.step-vis-1 .mini-input{animation:slide 4s ease-in-out infinite}
.step-vis-1 .mini-input:nth-child(2){animation-delay:.4s}
.step-vis-1 .mini-input:nth-child(3){animation-delay:.8s}
@keyframes slide{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(-4px);opacity:.7}}

.orbit{position:relative;width:80px;height:80px}
.orbit span{position:absolute;width:14px;height:14px;border-radius:50%;left:50%;top:50%;margin:-7px}
.orbit span:nth-child(1){background:var(--primary);animation:orbit 3s linear infinite}
.orbit span:nth-child(2){background:var(--secondary);animation:orbit 3s linear infinite -1s}
.orbit span:nth-child(3){background:var(--primary-2);animation:orbit 3s linear infinite -2s}
@keyframes orbit{from{transform:rotate(0) translateX(34px) rotate(0)}to{transform:rotate(360deg) translateX(34px) rotate(-360deg)}}

.mode-pill{
  padding:10px 18px;background:#fff;border:2px solid var(--c);border-radius:999px;
  font-weight:600;font-size:14px;color:var(--c);
  animation:bobble 3s ease-in-out infinite;
}
.step-vis-3 .mode-pill:nth-child(2){animation-delay:.3s}
.step-vis-3 .mode-pill:nth-child(3){animation-delay:.6s}
@keyframes bobble{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

@media (max-width:960px){.steps{grid-template-columns:1fr}}
</style>
