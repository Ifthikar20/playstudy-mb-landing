<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { motion } from 'motion-v';

const scrolled = ref(false);

const onScroll = () => { scrolled.value = window.scrollY > 20; };

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          const y = t.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });
});
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
  <motion.nav
    class="nav"
    :class="{ scrolled }"
    :initial="{ y: -40, opacity: 0 }"
    :animate="{ y: 0, opacity: 1 }"
    :transition="{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }"
  >
    <a class="brand" href="#top" aria-label="PlayStudy home">
      <img class="brand-logo" src="/main-logo.png" alt="" />
      <span class="brand-name">PlayStudy</span>
    </a>
    <div class="nav-links">
      <a href="#why">Why</a>
      <a href="#features">Features</a>
      <a href="#how">How it works</a>
      <a href="#games">Games</a>
    </div>
    <a class="btn btn-primary btn-sm" href="#download">Get the app</a>
  </motion.nav>
</template>

<style scoped>
.nav{
  position:fixed;top:14px;left:50%;transform:translateX(-50%);
  z-index:50;
  display:flex;align-items:center;gap:32px;
  padding:10px 14px 10px 18px;
  background:rgba(255,255,255,.72);
  backdrop-filter:saturate(180%) blur(20px);
  -webkit-backdrop-filter:saturate(180%) blur(20px);
  border:1px solid var(--border);
  border-radius:999px;
  box-shadow:var(--shadow-1);
  transition:box-shadow .3s ease;
  max-width:calc(100% - 28px);
}
.nav.scrolled{box-shadow:0 8px 30px rgba(0,0,0,.08)}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;letter-spacing:-.01em}
.brand-logo{
  width:26px;height:26px;object-fit:contain;
  border-radius:7px;
  transition:transform .5s var(--ease);
}
.brand:hover .brand-logo{transform:rotate(-6deg) scale(1.08)}
.brand-name{font-size:15px}
.nav-links{display:flex;gap:22px;font-size:14px;color:var(--text-2)}
.nav-links a{transition:color .2s}
.nav-links a:hover{color:var(--text)}
@media (max-width:720px){.nav-links{display:none}}
</style>
