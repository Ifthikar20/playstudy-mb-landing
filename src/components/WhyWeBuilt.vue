<script setup>
import { motion } from 'motion-v';

const stats = [
  { n: '1 in 5', t: 'people have a learning difference', s: 'Dyslexia, ADHD, dyspraxia, dyscalculia — yet most study tools are built for the other four.' },
  { n: '15%', t: 'of students have dyslexia', s: 'Walls of text are exhausting. Active, visual, repeated exposure works far better than re-reading.' },
  { n: '8 sec', t: 'is the average focused attention span', s: 'Long-form text is harder to finish than ever. Short loops of read, recall, play keep attention alive.' },
  { n: '2×', t: 'better recall with active learning', s: 'Quizzing yourself beats passive review. Playing beats quizzing. That ordering is what PlayStudy is built around.' },
];

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] },
});
</script>

<template>
  <section class="why" id="why">
    <motion.div class="why-head" v-bind="fadeUp(0)">
      <span class="eyebrow">Why we built this</span>
      <h2>
        Reading isn't how <br/>
        <em>everyone</em> learns.
      </h2>
      <p>
        Textbooks, lectures and 20-page PDFs assume one kind of brain. For students with
        dyslexia, ADHD, or simply a body that's tired at 11 pm, a wall of text isn't
        learning — it's a wall. PlayStudy was built to turn that wall into something you
        can <em>play your way through</em>.
      </p>
    </motion.div>

    <div class="stats">
      <motion.article
        v-for="(s, i) in stats"
        :key="s.n"
        class="stat"
        v-bind="fadeUp(i + 1)"
      >
        <div class="stat-n">{{ s.n }}</div>
        <div class="stat-t">{{ s.t }}</div>
        <p>{{ s.s }}</p>
      </motion.article>
    </div>

    <motion.div class="pledge" v-bind="fadeUp(stats.length + 1)">
      <div class="pledge-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20M2 12h20M4.5 4.5l15 15M19.5 4.5l-15 15"/>
        </svg>
      </div>
      <p>
        Every screen is dyslexia-aware: short sentences, generous spacing, no walls of
        prose, and the option to play instead of read. Every quiz, flashcard and
        mini-game is generated from <em>your</em> source — your notes, your link, your
        PDF — so the material stays yours.
      </p>
    </motion.div>
  </section>
</template>

<style scoped>
.why{padding:80px 24px 100px;max-width:1100px;margin:0 auto;position:relative}
.why-head{max-width:680px;margin:0 auto 56px;text-align:center}
.why-head h2{
  font-size:clamp(34px,4.6vw,56px);font-weight:700;letter-spacing:-.03em;line-height:1.04;margin:10px 0 18px;
}
.why-head h2 em{
  font-family:var(--serif);font-style:italic;font-weight:400;font-size:1.12em;
  background:linear-gradient(120deg,#FF6B1A,#1E5EFF);
  -webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:-.02em;
}
.why-head p{font-size:16.5px;line-height:1.65;color:var(--text-2);margin:0}
.why-head p em{font-family:var(--serif);font-style:italic;color:var(--text);font-weight:400}

.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:48px}
.stat{
  background:#fff;border:1px solid var(--border);border-radius:16px;
  padding:20px;display:flex;flex-direction:column;gap:6px;
  transition:box-shadow .4s, border-color .4s;
}
.stat:hover{box-shadow:var(--shadow-1);border-color:#d8d2c8}
.stat-n{
  font-family:var(--serif);font-style:italic;font-weight:400;
  font-size:42px;line-height:1;letter-spacing:-.02em;
  background:linear-gradient(120deg,#FF6B1A,#1E5EFF);
  -webkit-background-clip:text;background-clip:text;color:transparent;
}
.stat-t{font-size:13px;font-weight:600;color:var(--text);line-height:1.35}
.stat p{margin:6px 0 0;font-size:12.5px;color:var(--text-2);line-height:1.5}

.pledge{
  display:flex;gap:18px;align-items:flex-start;
  background:#FBFAF6;border:1px solid var(--border);border-radius:18px;
  padding:22px 24px;
  background-image:
    linear-gradient(rgba(30,94,255,.06) 1px,transparent 1px),
    linear-gradient(90deg, rgba(30,94,255,.06) 1px,transparent 1px);
  background-size:24px 24px;
  position:relative;overflow:hidden;
}
.pledge-mark{
  flex-shrink:0;width:40px;height:40px;border-radius:12px;
  background:#fff;border:1px solid var(--border);
  display:grid;place-items:center;color:var(--primary);
}
.pledge p{margin:0;font-size:14.5px;line-height:1.65;color:var(--text)}
.pledge p em{font-family:var(--serif);font-style:italic;color:var(--primary);font-weight:400}

@media (max-width:860px){
  .stats{grid-template-columns:repeat(2,1fr)}
}
@media (max-width:520px){
  .stats{grid-template-columns:1fr}
}
</style>
