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
      <h2>From paste to play in three steps.</h2>
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
          <span class="mode-pill" style="--c:#007AFF">Read</span>
          <span class="mode-pill" style="--c:#5856D6">Recall</span>
          <span class="mode-pill" style="--c:#22C55E">Play</span>
        </div>
      </motion.li>
    </ol>
  </section>
</template>

<style scoped>
.how{padding:60px 24px 120px;max-width:1240px;margin:0 auto}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;list-style:none;padding:0;margin:0}
.step{
  background:#fff;
  border:1px solid var(--border);border-radius:24px;
  padding:32px;position:relative;overflow:hidden;
  transition:box-shadow .5s;
}
.step:hover{box-shadow:var(--shadow-2)}
.step-num{
  font-size:14px;font-weight:700;color:var(--primary);
  background:rgba(0,122,255,.08);width:fit-content;padding:4px 10px;border-radius:999px;margin-bottom:16px;
}
.step h3{margin:0 0 8px;font-size:21px;font-weight:700;letter-spacing:-.01em}
.step p{margin:0 0 24px;color:var(--text-2);font-size:15px}
.step-vis{height:100px;border-radius:14px;background:var(--surface);padding:16px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}

.mini-input{background:#fff;border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-size:12.5px;color:var(--text-2);font-family:monospace}
.step-vis-1 .mini-input{animation:slide 4s ease-in-out infinite}
.step-vis-1 .mini-input:nth-child(2){animation-delay:.4s}
.step-vis-1 .mini-input:nth-child(3){animation-delay:.8s}
@keyframes slide{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(-4px);opacity:.7}}

.orbit{position:relative;width:80px;height:80px}
.orbit span{position:absolute;width:14px;height:14px;border-radius:50%;left:50%;top:50%;margin:-7px}
.orbit span:nth-child(1){background:var(--primary);animation:orbit 3s linear infinite}
.orbit span:nth-child(2){background:var(--secondary);animation:orbit 3s linear infinite -1s}
.orbit span:nth-child(3){background:var(--accent);animation:orbit 3s linear infinite -2s}
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
