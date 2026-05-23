<script setup>
const items = ['History','Biology','Chemistry','Mathematics','Computer Science','Geography','Psychology','Art','Physics','Literature','Economics','Philosophy'];
</script>

<template>
  <section class="trust">
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        <template v-for="(t,i) in [...items, ...items]" :key="i">
          <span class="m-item">{{ t }}</span>
          <span class="m-sep">·</span>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trust{padding:32px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);overflow:hidden;background:#fff}
.marquee{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
.marquee-track{display:flex;align-items:center;gap:24px;animation:marquee 40s linear infinite;width:max-content}
.m-item{font-family:var(--serif);font-style:italic;font-size:22px;font-weight:400;color:var(--text);white-space:nowrap;letter-spacing:-.01em}
.m-sep{font-size:18px;color:var(--text-2);opacity:.5}
@keyframes marquee{to{transform:translateX(-50%)}}
</style>
