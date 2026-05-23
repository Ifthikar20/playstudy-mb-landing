<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

const glow = ref(null);
let raf;

onMounted(() => {
  let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
  let tx = gx, ty = gy;
  const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
  window.addEventListener('pointermove', onMove);
  const tick = () => {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    if (glow.value) glow.value.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
    raf = requestAnimationFrame(tick);
  };
  tick();
  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onMove);
    cancelAnimationFrame(raf);
  });
});
</script>

<template>
  <div ref="glow" class="cursor-glow" aria-hidden="true"></div>
</template>

<style scoped>
.cursor-glow{
  position:fixed;top:0;left:0;width:520px;height:520px;
  background:radial-gradient(circle, rgba(255,107,26,.22), rgba(30,94,255,.1) 40%, transparent 70%);
  border-radius:50%;
  pointer-events:none;
  transform:translate(-50%,-50%);
  z-index:0;
  mix-blend-mode:multiply;
  filter:blur(20px);
}
@media (pointer:coarse){.cursor-glow{display:none}}
</style>
