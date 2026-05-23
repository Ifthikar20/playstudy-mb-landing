<template>
  <footer class="foot">
    <div class="foot-inner">
      <div class="brand">
        <img class="brand-logo" src="/main-logo.png" alt="PlayStudy" width="26" height="26" />
        <span class="brand-name">PlayStudy</span>
      </div>
      <p>© 2026 PlayStudy. Made for curious minds.</p>
      <div class="foot-links">
        <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Support</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.foot{padding:40px 24px;border-top:1px solid var(--border)}
.foot-inner{max-width:1240px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
.foot p{color:var(--text-2);font-size:13.5px;margin:0}
.foot-links{display:flex;gap:18px;font-size:13.5px;color:var(--text-2)}
.foot-links a:hover{color:var(--text)}
.brand{display:flex;align-items:center;gap:10px;font-weight:700}
.brand-logo{width:26px;height:26px;object-fit:contain;display:block}
.brand-name{font-size:15px}
</style>
