<script setup>
import { motion } from 'motion-v';
/* Use a runtime-bound src so Vite's resolver doesn't try to bundle the
   asset at build time — it just needs to exist at runtime at /videos/. */
const videoSrc = '/videos/watercolor-.mp4';
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
      <video
        class="cta-video"
        autoplay
        loop
        muted
        playsinline
        preload="auto"
        aria-hidden="true"
      >
        <source :src="videoSrc" type="video/mp4" />
      </video>
      <div class="cta-overlay" aria-hidden="true"></div>

      <div class="cta-inner">
        <span class="cta-eyebrow">Free · iOS &amp; Android</span>
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
      </div>
    </motion.div>
  </section>
</template>

<style scoped>
.cta{padding:60px 24px 120px;max-width:1240px;margin:0 auto}
.cta-card{
  position:relative;overflow:hidden;
  border-radius:32px;
  isolation:isolate;
  background:#0B1220;          /* fallback while the video loads */
  box-shadow:var(--shadow-2);
  min-height:380px;
  color:#fff;
}
.cta-video{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;
  z-index:0;
  /* gentle motion + slight zoom so the watercolour fills the card without harsh edges */
  transform:scale(1.04);
  filter:saturate(1.05) contrast(.98);
}
.cta-overlay{
  position:absolute;inset:0;z-index:1;
  background:
    radial-gradient(ellipse 80% 70% at 30% 20%, rgba(11,18,32,.35), transparent 70%),
    linear-gradient(135deg, rgba(11,18,32,.55) 0%, rgba(11,18,32,.30) 45%, rgba(11,18,32,.55) 100%);
}
.cta-inner{
  position:relative;z-index:2;
  padding:88px 40px;text-align:center;
  display:flex;flex-direction:column;align-items:center;gap:14px;
}
.cta-eyebrow{
  display:inline-block;
  font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;
  color:#fff;background:rgba(255,255,255,.14);
  border:1px solid rgba(255,255,255,.22);
  backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
  padding:5px 12px;border-radius:999px;
  margin-bottom:6px;
}
.cta-card h2{
  font-size:clamp(34px,5vw,60px);font-weight:700;letter-spacing:-.03em;
  margin:0;line-height:1.04;color:#fff;
  text-shadow:0 2px 24px rgba(0,0,0,.25);
}
.cta-card h2 em{
  font-family:var(--serif);font-style:italic;font-weight:400;font-size:1.12em;
  color:#fff;
  padding-left:.04em;
}
.cta-card p{color:rgba(255,255,255,.85);font-size:17px;max-width:540px;margin:6px auto 22px;text-shadow:0 1px 12px rgba(0,0,0,.25)}
.cta-row{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}

/* keep the glass-on-video buttons readable */
.btn-primary{box-shadow:0 10px 28px rgba(255,107,26,.4)}
.btn-dark{background:rgba(255,255,255,.95);color:#0B1220}
.btn-dark:hover{background:#fff}

@media (prefers-reduced-motion:reduce){
  .cta-video{display:none}
  .cta-card{background:linear-gradient(135deg,#1E5EFF,#0B1220)}
}
</style>
