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
          <svg viewBox="0 0 200 90" width="100%" height="80" aria-hidden="true">
            <!-- a stack of three "sources" entering an input slot -->
            <g transform="translate(8 14) rotate(-6)">
              <rect width="60" height="22" rx="6" fill="#fff" stroke="#1E5EFF" stroke-width="1.4" stroke-dasharray="3 3"/>
              <text x="10" y="15" font-family="ui-monospace,monospace" font-size="10" fill="#1E5EFF">https://…</text>
            </g>
            <g transform="translate(40 36) rotate(2)">
              <rect width="60" height="22" rx="6" fill="#fff" stroke="#FF6B1A" stroke-width="1.4"/>
              <text x="10" y="15" font-family="ui-monospace,monospace" font-size="10" fill="#FF6B1A">notes.pdf</text>
            </g>
            <g transform="translate(12 60) rotate(-3)">
              <rect width="86" height="22" rx="6" fill="#fff" stroke="#16A34A" stroke-width="1.4" stroke-dasharray="2 2"/>
              <text x="10" y="15" font-family="'Instrument Serif',serif" font-style="italic" font-size="12" fill="#16A34A">"the mitochondria…"</text>
            </g>
            <!-- arrow into the slot -->
            <path d="M118 46h44" stroke="#0B1220" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="2 3"/>
            <path d="M162 46l-5-4v8z" fill="#0B1220"/>
            <!-- the slot -->
            <rect x="170" y="32" width="22" height="28" rx="6" fill="#FBFAF6" stroke="#0B1220" stroke-width="1.6"/>
            <path d="M178 38v16M174 46h12" stroke="#FF6B1A" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
      </motion.li>

      <motion.li class="step" v-bind="reveal(1)" :while-hover="{ y: -4 }">
        <div class="step-num">02</div>
        <h3>AI builds the set</h3>
        <p>Summary, quiz questions, and game words — generated together, in seconds.</p>
        <div class="step-vis step-vis-2">
          <svg viewBox="0 0 200 90" width="100%" height="80" aria-hidden="true">
            <!-- A sketchy "brain / circuit" diagram with three outputs branching off -->
            <!-- central node -->
            <g transform="translate(40 30)">
              <rect x="0" y="0" width="48" height="32" rx="6" fill="#FBFAF6" stroke="#0B1220" stroke-width="1.6"/>
              <text x="24" y="21" font-family="'Instrument Serif',serif" font-style="italic" font-size="16" text-anchor="middle" fill="#0B1220">ai</text>
              <!-- input dots -->
              <circle cx="-6" cy="6" r="2.4" fill="#1E5EFF"/>
              <circle cx="-6" cy="16" r="2.4" fill="#FF6B1A"/>
              <circle cx="-6" cy="26" r="2.4" fill="#16A34A"/>
              <path d="M-4 6h4M-4 16h4M-4 26h4" stroke="#0B1220" stroke-width="1.2" stroke-linecap="round"/>
            </g>
            <!-- three branches out, dashed -->
            <path d="M88 36c20-2 30-18 50-18" stroke="#FF6B1A" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="2 3"/>
            <path d="M88 46h54" stroke="#1E5EFF" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="2 3"/>
            <path d="M88 56c20 2 30 18 50 18" stroke="#16A34A" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="2 3"/>
            <!-- output pills -->
            <g transform="translate(142 10)">
              <rect width="50" height="16" rx="8" fill="#fff" stroke="#FF6B1A" stroke-width="1.4"/>
              <text x="25" y="12" font-family="'Inter',sans-serif" font-size="9" font-weight="600" text-anchor="middle" fill="#FF6B1A">Summary</text>
            </g>
            <g transform="translate(142 38)">
              <rect width="50" height="16" rx="8" fill="#fff" stroke="#1E5EFF" stroke-width="1.4"/>
              <text x="25" y="12" font-family="'Inter',sans-serif" font-size="9" font-weight="600" text-anchor="middle" fill="#1E5EFF">Quiz</text>
            </g>
            <g transform="translate(142 66)">
              <rect width="50" height="16" rx="8" fill="#fff" stroke="#16A34A" stroke-width="1.4"/>
              <text x="25" y="12" font-family="'Inter',sans-serif" font-size="9" font-weight="600" text-anchor="middle" fill="#16A34A">Game</text>
            </g>
            <!-- tiny sparkles -->
            <path d="M100 14l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#FFB347"/>
          </svg>
        </div>
      </motion.li>

      <motion.li class="step" v-bind="reveal(2)" :while-hover="{ y: -4 }">
        <div class="step-num">03</div>
        <h3>Read · Recall · Play</h3>
        <p>Move through the three modes. Each one locks the material in a little deeper.</p>
        <div class="step-vis step-vis-3">
          <svg viewBox="0 0 200 90" width="100%" height="80" aria-hidden="true">
            <!-- A loop / cycle of three modes, drawn as a sketchy triangle of stations -->
            <!-- Read -->
            <g transform="translate(14 18)">
              <rect width="42" height="24" rx="12" fill="#fff" stroke="#FF6B1A" stroke-width="1.6"/>
              <text x="21" y="17" font-family="'Inter',sans-serif" font-size="11" font-weight="600" text-anchor="middle" fill="#FF6B1A">Read</text>
            </g>
            <!-- Recall -->
            <g transform="translate(78 50)">
              <rect width="52" height="24" rx="12" fill="#fff" stroke="#1E5EFF" stroke-width="1.6"/>
              <text x="26" y="17" font-family="'Inter',sans-serif" font-size="11" font-weight="600" text-anchor="middle" fill="#1E5EFF">Recall</text>
            </g>
            <!-- Play -->
            <g transform="translate(150 18)">
              <rect width="42" height="24" rx="12" fill="#fff" stroke="#16A34A" stroke-width="1.6"/>
              <text x="21" y="17" font-family="'Inter',sans-serif" font-size="11" font-weight="600" text-anchor="middle" fill="#16A34A">Play</text>
            </g>
            <!-- arcs between them, hand-drawn dashed -->
            <path d="M56 30c12 4 18 12 22 20" stroke="#0B1220" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="2 3" fill="none"/>
            <path d="M130 62c8-8 14-22 20-32" stroke="#0B1220" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="2 3" fill="none"/>
            <path d="M150 30c-30 0-60-10-94-10" stroke="#0B1220" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="2 3" fill="none"/>
            <!-- arrow heads -->
            <path d="M78 50l-4 0 2 4z" fill="#0B1220"/>
            <path d="M150 30l-4 2 0-4z" fill="#0B1220"/>
            <path d="M56 20l-2 2 4 1z" fill="#0B1220"/>
          </svg>
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
.step-vis{
  height:96px;border-radius:12px;
  background:#FBFAF6;
  background-image:
    linear-gradient(rgba(30,94,255,.06) 1px,transparent 1px),
    linear-gradient(90deg, rgba(30,94,255,.06) 1px,transparent 1px);
  background-size:14px 14px;
  border:1px solid var(--border);
  padding:6px 10px;display:flex;align-items:center;justify-content:center;overflow:hidden;
}
.step-vis svg{display:block;max-height:100%}
.step-vis-1 svg g, .step-vis-2 svg path{transition:transform .4s var(--ease)}
.step:hover .step-vis-1 svg g:nth-child(1){transform:translate(8px,14px) rotate(-3deg)}
.step:hover .step-vis-1 svg g:nth-child(3){transform:translate(12px,60px) rotate(-1deg)}

@media (max-width:960px){.steps{grid-template-columns:1fr}}
</style>
