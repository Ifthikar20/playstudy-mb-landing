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
    <div class="paper-bg" aria-hidden="true"></div>
    <div class="paper-formulas" aria-hidden="true">
      <span class="f f-1">E = mc<sup>2</sup></span>
      <span class="f f-2">a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></span>
      <span class="f f-3">∫<sub>0</sub><sup>∞</sup> e<sup>−x</sup> dx = 1</span>
      <span class="f f-4">π ≈ 3.14159</span>
      <span class="f f-5">f(x) = sin(x)</span>
      <span class="f f-6">∇ · E = ρ ⁄ ε<sub>0</sub></span>
      <span class="f f-7">x = <span class="frac"><span class="num">−b ± √(b²−4ac)</span><span class="den">2a</span></span></span>
      <span class="f f-8">e<sup>iπ</sup> + 1 = 0</span>
      <span class="f f-9">lim<sub>x→0</sub> sin(x) ⁄ x = 1</span>
    </div>
    <div class="paper-fade" aria-hidden="true"></div>

    <div class="hero-inner">
      <div class="hero-copy">
        <motion.span class="pill" v-bind="fadeUp(0.05)">
          <span class="pill-dot"></span> New · AI-powered study sets
        </motion.span>
        <motion.h1 class="title" v-bind="fadeUp(0.15)">
          Learn anything, <br/>
          <em>Playfully.</em>
        </motion.h1>
        <motion.p class="lede" v-bind="fadeUp(0.25)">
          Paste a link, drop a file, or type. PlayStudy spins up a <b>Summary</b>, a <b>Quiz</b>, and a <b>Guess-the-Word</b> mini-game in seconds — so learning actually sticks.
        </motion.p>
        <motion.div class="cta-row" v-bind="fadeUp(0.35)">
          <a class="btn btn-primary" href="#download">Download for iOS</a>
          <a class="btn btn-secondary" href="#download">Get on Android</a>
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
.paper-bg{
  position:absolute;inset:0;z-index:-2;
  background-color:#FBFAF6;
  background-image:
    linear-gradient(rgba(30,94,255,.12) 1px,transparent 1px),
    linear-gradient(90deg, rgba(30,94,255,.12) 1px,transparent 1px),
    linear-gradient(rgba(30,94,255,.06) 1px,transparent 1px),
    linear-gradient(90deg, rgba(30,94,255,.06) 1px,transparent 1px);
  background-size:80px 80px, 80px 80px, 16px 16px, 16px 16px;
}
.paper-fade{
  position:absolute;inset:0;z-index:-1;pointer-events:none;
  background:
    radial-gradient(ellipse 90% 60% at 50% 110%, rgba(255,255,255,1) 30%, transparent 70%),
    linear-gradient(180deg, rgba(255,255,255,.5) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,.85) 100%);
}
.paper-formulas{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
.paper-formulas .f{
  position:absolute;
  font-family:var(--serif);font-style:italic;
  color:#1E5EFF;opacity:.28;
  font-size:22px;line-height:1;letter-spacing:-.005em;
  white-space:nowrap;
}
.paper-formulas sup{font-size:.65em;vertical-align:super;line-height:0}
.paper-formulas sub{font-size:.65em;vertical-align:sub;line-height:0}
.paper-formulas .frac{display:inline-flex;flex-direction:column;vertical-align:middle;font-size:.8em;line-height:1.05;text-align:center;margin:0 .15em}
.paper-formulas .frac .num{border-bottom:1px solid currentColor;padding:0 .2em}
.paper-formulas .frac .den{padding:0 .2em}
.f-1{top:14%;left:6%;transform:rotate(-6deg)}
.f-2{top:8%;right:7%;transform:rotate(4deg);font-size:24px}
.f-3{top:46%;left:3%;transform:rotate(-3deg);font-size:20px}
.f-4{top:62%;right:38%;transform:rotate(2deg);opacity:.22}
.f-5{bottom:18%;left:8%;transform:rotate(-4deg);font-size:21px}
.f-6{top:30%;right:12%;transform:rotate(-2deg);font-size:19px;opacity:.22}
.f-7{bottom:24%;right:6%;transform:rotate(3deg);font-size:18px}
.f-8{top:74%;left:36%;transform:rotate(-5deg);font-size:23px;opacity:.22}
.f-9{top:22%;left:34%;transform:rotate(2deg);opacity:.18}
@media (max-width:960px){
  .paper-formulas .f-3,.paper-formulas .f-4,.paper-formulas .f-8,.paper-formulas .f-9{display:none}
}
.blob{
  position:absolute;border-radius:50%;filter:blur(60px);opacity:.55;z-index:-1;
  animation:float 14s ease-in-out infinite;
}
.blob-1{width:520px;height:520px;background:#FF6B1A;top:-160px;left:-160px;opacity:.28}
.blob-2{width:480px;height:480px;background:#1E5EFF;top:160px;right:-180px;animation-delay:-4s;opacity:.22}
.blob-3{width:340px;height:340px;background:#FFB347;bottom:-120px;left:35%;animation-delay:-8s;opacity:.18}
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
  background:rgba(255,107,26,.1);
  color:var(--primary);
  border:1px solid rgba(255,107,26,.2);
  border-radius:999px;
  margin-bottom:24px;
}
.pill-dot{width:6px;height:6px;border-radius:50%;background:var(--primary);box-shadow:0 0 0 4px rgba(255,107,26,.18);animation:pulse 2s infinite}
@keyframes pulse{50%{box-shadow:0 0 0 8px rgba(255,107,26,0)}}

.title{
  font-size:clamp(44px,7vw,84px);
  font-weight:700;
  line-height:1.02;
  letter-spacing:-.035em;
  margin:0 0 22px;
}
.title em{
  font-family:var(--serif);
  font-style:italic;
  font-weight:400;
  font-size:1.18em;
  line-height:.95;
  letter-spacing:-.025em;
  background:linear-gradient(120deg,#FF6B1A 0%,#FF8A3D 40%,#1E5EFF 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  padding-left:.04em;
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
  background:linear-gradient(120deg,#FF6B1A,#1E5EFF);
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
