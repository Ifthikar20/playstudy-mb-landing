<script setup>
const items = ['📚 History','🧬 Biology','⚗️ Chemistry','📐 Math','💻 CS','🌍 Geography','🧠 Psychology','🎨 Art','🪐 Physics','📖 Literature'];
</script>

<template>
  <section class="trust">
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        <span v-for="(t,i) in [...items, ...items]" :key="i">{{ t }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trust{padding:32px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);overflow:hidden;background:#fff}
.marquee{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
.marquee-track{display:flex;gap:48px;animation:marquee 30s linear infinite;width:max-content}
.marquee-track span{font-size:17px;font-weight:600;color:var(--text-2);white-space:nowrap}
@keyframes marquee{to{transform:translateX(-50%)}}
</style>
