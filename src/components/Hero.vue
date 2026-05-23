<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { motion } from 'motion-v';
import PhoneMockup from './PhoneMockup.vue';

const blobs = ref(null);

const onScroll = () => {
  const y = window.scrollY;
  if (!blobs.value) return;
  blobs.value.querySelectorAll('.blob').forEach((b, i) => {
    b.style.translate = `0 ${y * (0.05 + i * 0.04)}px`;
  });
};
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] },
});
</script>

<template>
  <header class="hero" id="top">
    <div ref="blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>
    <div class="grid-bg" aria-hidden="true"></div>

    <div class="hero-inner">
      <div class="hero-copy">
        <motion.span class="pill" v-bind="fadeUp(0.05)">
          <span class="pill-dot"></span> New · AI-powered study sets
        </motion.span>
        <motion.h1 class="title" v-bind="fadeUp(0.15)">
          Turn <span class="grad">anything</span><br/>
          into a <span class="grad-2">study set</span>.
        </motion.h1>
        <motion.p class="lede" v-bind="fadeUp(0.25)">
          Paste a link, drop a file, or type. PlayStudy spins up a <b>Summary</b>, a <b>Quiz</b>, and a <b>Guess-the-Word</b> mini-game in seconds — so learning actually sticks.
        </motion.p>
        <motion.div class="cta-row" v-bind="fadeUp(0.35)">
          <motion.a class="btn btn-primary" href="#download"
            :while-hover="{ y: -3, scale: 1.03 }"
            :while-tap="{ scale: 0.97 }">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M16.5 12c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.6 1.3 10.1.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8 1.5 0 2 .8 3.3.8 1.4 0 2.3-1.2 3.1-2.4 1-1.4 1.4-2.7 1.4-2.8-.1 0-2.8-1.1-2.8-4zm-2.6-7.3c.7-.8 1.2-2 1-3.2-1.1.1-2.3.7-3 1.6-.7.7-1.3 2-1.1 3.1 1.2.1 2.4-.6 3.1-1.5z"/></svg>
            Download for iOS
          </motion.a>
          <motion.a class="btn btn-ghost" href="#download"
            :while-hover="{ y: -3 }"
            :while-tap="{ scale: 0.97 }">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M3.6 2.3 14 12 3.6 21.7c-.4-.2-.6-.6-.6-1V3.3c0-.4.2-.8.6-1zm11.7 7.4 2.8-1.6c.6-.3.6-1.2 0-1.5L5.6 0 14 8.4l1.3 1.3z"/></svg>
            Get on Android
          </motion.a>
        </motion.div>

        <motion.div class="hero-stats" v-bind="fadeUp(0.5)">
          <div><b>10s</b><span>from paste to play</span></div>
          <div><b>3-in-1</b><span>summary · quiz · game</span></div>
          <div><b>∞</b><span>topics supported</span></div>
        </motion.div>
      </div>

      <motion.div
        class="phone-wrap"
        :initial="{ opacity: 0, scale: 0.88, y: 40 }"
        :animate="{ opacity: 1, scale: 1, y: 0 }"
        :transition="{ duration: 1.1, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }"
      >
        <PhoneMockup />
      </motion.div>
    </div>

    <motion.a
      class="scroll-hint"
      href="#features"
      aria-label="Scroll"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 0.6 }"
      :transition="{ delay: 1.2, duration: 0.6 }"
    >
      <span></span>
    </motion.a>
  </header>
</template>

<style scoped>
.hero{
  position:relative;
  min-height:100vh;
  padding:120px 24px 80px;
  overflow:hidden;
  isolation:isolate;
}
.grid-bg{
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,.04) 1px,transparent 1px);
  background-size:48px 48px;
  mask-image:radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 75%);
  -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 75%);
  z-index:-1;
}
.blob{
  position:absolute;border-radius:50%;filter:blur(60px);opacity:.55;z-index:-1;
  animation:float 14s ease-in-out infinite;
}
.blob-1{width:520px;height:520px;background:#007AFF;top:-120px;left:-120px}
.blob-2{width:480px;height:480px;background:#5856D6;top:200px;right:-150px;animation-delay:-4s}
.blob-3{width:380px;height:380px;background:#22C55E;bottom:-100px;left:30%;animation-delay:-8s;opacity:.35}
@keyframes float{
  0%,100%{transform:translate(0,0) scale(1)}
  33%{transform:translate(40px,-30px) scale(1.08)}
  66%{transform:translate(-30px,30px) scale(.95)}
}

.hero-inner{
  max-width:1240px;margin:0 auto;
  display:grid;grid-template-columns:1.05fr .95fr;gap:60px;align-items:center;
}
.hero-copy{position:relative;z-index:2}

.pill{
  display:inline-flex;align-items:center;gap:8px;
  padding:6px 12px 6px 10px;
  font-size:12.5px;font-weight:500;
  background:rgba(0,122,255,.08);
  color:var(--primary);
  border:1px solid rgba(0,122,255,.18);
  border-radius:999px;
  margin-bottom:24px;
}
.pill-dot{width:6px;height:6px;border-radius:50%;background:var(--primary);box-shadow:0 0 0 4px rgba(0,122,255,.18);animation:pulse 2s infinite}
@keyframes pulse{50%{box-shadow:0 0 0 8px rgba(0,122,255,0)}}

.title{
  font-size:clamp(44px,7vw,84px);
  font-weight:800;
  line-height:1.02;
  letter-spacing:-.035em;
  margin:0 0 22px;
}
.lede{
  font-size:clamp(16px,1.4vw,18.5px);color:var(--text-2);
  max-width:540px;margin:0 0 32px;line-height:1.55;
}
.lede b{color:var(--text);font-weight:600}
.cta-row{display:flex;gap:12px;flex-wrap:wrap}
.hero-stats{display:flex;gap:36px;margin-top:48px;flex-wrap:wrap}
.hero-stats > div{display:flex;flex-direction:column}
.hero-stats b{font-size:26px;font-weight:700;letter-spacing:-.02em;
  background:linear-gradient(120deg,#007AFF,#5856D6);
  -webkit-background-clip:text;background-clip:text;color:transparent;}
.hero-stats span{font-size:12.5px;color:var(--text-2)}
.phone-wrap{position:relative;display:flex;justify-content:center;align-items:center;perspective:1400px}

.scroll-hint{
  position:absolute;bottom:30px;left:50%;transform:translateX(-50%);
  width:24px;height:38px;border:2px solid var(--text-2);border-radius:13px;
  display:grid;place-items:start center;padding-top:6px;
}
.scroll-hint span{width:3px;height:8px;background:var(--text-2);border-radius:2px;animation:scroll 1.6s infinite}
@keyframes scroll{0%{transform:translateY(0);opacity:1}100%{transform:translateY(14px);opacity:0}}

@media (max-width:960px){
  .hero{padding-top:130px}
  .hero-inner{grid-template-columns:1fr;gap:64px}
  .phone-wrap{order:2}
}
</style>
