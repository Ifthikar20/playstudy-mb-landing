/* PlayStudy — Flappy Quiz
 * A self-contained HTML5 canvas game, hosted statically and embedded in the
 * Flutter app via a WebView (JS channel "PlayStudy") or an <iframe> on web.
 *
 * Host -> game:  window.PlayStudyInit({ quiz: [...] })  OR  postMessage({type:'init', quiz})
 * Game -> host:  {type:'ready'} | {type:'score',score} | {type:'reward',reason} | {type:'gameover',score}
 */
(function () {
  'use strict';

  var QUIZ = [];

  // ---- Host messaging -------------------------------------------------------
  function postToHost(msg) {
    try {
      if (window.PlayStudy && typeof window.PlayStudy.postMessage === 'function') {
        window.PlayStudy.postMessage(JSON.stringify(msg)); // Flutter webview channel
      } else if (window.parent && window.parent !== window) {
        window.parent.postMessage(msg, '*'); // iframe host (Flutter web / browser)
      }
    } catch (e) { /* no-op */ }
  }

  window.PlayStudyInit = function (payload) {
    try { QUIZ = (payload && payload.quiz) || []; } catch (e) { QUIZ = []; }
  };

  window.addEventListener('message', function (e) {
    if (e && e.data && e.data.type === 'init') QUIZ = e.data.quiz || [];
  });

  // Fallback: quiz passed as ?quiz=<base64-json>
  try {
    var qp = new URLSearchParams(location.search).get('quiz');
    if (qp) {
      var b = qp.replace(/-/g, '+').replace(/_/g, '/');
      QUIZ = JSON.parse(decodeURIComponent(escape(atob(b))));
    }
  } catch (e) { /* ignore */ }

  // ---- Canvas setup ---------------------------------------------------------
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, DPR = 1;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  // ---- Game state -----------------------------------------------------------
  var GRAVITY = 1500, FLAP = -480, SPEED = 165, GAP = 190, PIPE_W = 70, PIPE_EVERY = 1.6;
  var GROUND_H = 90;
  var bird, pipes, score, best = 0, spawnT, t, state, invuln, particles, clouds, revives;
  var hillOffset = 0, cityOffset = 0, shake = 0, nextQuizAt = 2;

  function reset() {
    bird = { x: W * 0.28, y: H * 0.4, vy: 0, r: 16, rot: 0 };
    pipes = [];
    particles = [];
    clouds = [
      { x: W * 0.2, y: H * 0.18, s: 1 },
      { x: W * 0.6, y: H * 0.3, s: 0.7 },
      { x: W * 0.9, y: H * 0.12, s: 0.85 },
    ];
    score = 0; spawnT = 0; t = 0; invuln = 0; revives = 0; nextQuizAt = 2;
    state = 'ready'; // ready | play | quiz | over
  }
  reset();

  function flap() {
    if (state === 'ready') { state = 'play'; }
    if (state === 'play') {
      bird.vy = FLAP;
      for (var i = 0; i < 4; i++) {
        particles.push({ x: bird.x - 8, y: bird.y + 6, vx: -60 - Math.random() * 60, vy: 20 - Math.random() * 40, life: 0.4, c: '#fff' });
      }
    }
  }

  function spawnPipe() {
    var margin = 60;
    var top = margin + Math.random() * (H - GROUND_H - GAP - margin * 2);
    pipes.push({ x: W + PIPE_W, top: top, passed: false });
  }

  // ---- Input ----------------------------------------------------------------
  function onPress(e) {
    if (state === 'quiz') return; // overlay handles taps
    if (state === 'over') { hideOverlay(); reset(); return; }
    flap();
    if (e && e.preventDefault) e.preventDefault();
  }
  canvas.addEventListener('pointerdown', onPress);
  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') { onPress(e); }
  });

  // ---- Quiz overlay ---------------------------------------------------------
  var overlay = document.getElementById('overlay');
  var card = document.getElementById('card');

  function pickQuestion() {
    if (!QUIZ.length) return null;
    return QUIZ[Math.floor(Math.random() * QUIZ.length)];
  }

  // Generic question overlay. Calls onResult(correct) once answered.
  function askQuestion(title, sub, onResult) {
    var q = pickQuestion();
    if (!q) { onResult(false); return; }
    state = 'quiz';
    card.innerHTML = '';
    var h = document.createElement('h2'); h.textContent = title;
    var s = document.createElement('p'); s.className = 'sub'; s.textContent = sub;
    var prompt = document.createElement('div'); prompt.className = 'prompt'; prompt.textContent = q.prompt || '';
    card.appendChild(h); card.appendChild(s); card.appendChild(prompt);
    var choices = q.choices || [];
    var answered = false;
    choices.forEach(function (choice, idx) {
      var b = document.createElement('button');
      b.className = 'choice'; b.textContent = choice;
      b.onclick = function () {
        if (answered) return; answered = true;
        var correct = idx === q.correctIndex;
        b.classList.add(correct ? 'correct' : 'wrong');
        if (!correct) { var cb = card.children[3 + q.correctIndex]; if (cb) cb.classList.add('correct'); }
        setTimeout(function () {
          hideOverlay();
          if (correct) postToHost({ type: 'reward', reason: 'Super Dash checkpoint' });
          onResult(correct);
        }, 650);
      };
      card.appendChild(b);
    });
    overlay.classList.add('show');
  }

  // Mid-flight question (every few pipes). Correct = bonus + brief shield.
  function showPlayQuestion() {
    askQuestion('Quick question', 'Correct = bonus points + shield', function (correct) {
      if (correct) { score += 2; postToHost({ type: 'score', score: score }); invuln = 1.4; }
      bird.y = H * 0.4; bird.vy = 0; state = 'play';
    });
  }

  // On crash: answer to revive, otherwise game over.
  function showQuiz() {
    askQuestion('Answer to revive', 'Get it right to keep flying', function (correct) {
      if (correct) revive(); else gameOver();
    });
  }

  function hideOverlay() { overlay.classList.remove('show'); }

  function revive() {
    // Clear nearby pipes, recentre the bird, grant brief invulnerability.
    pipes = pipes.filter(function (p) { return p.x > bird.x + 160 || p.x < bird.x - 120; });
    bird.y = H * 0.4; bird.vy = 0; invuln = 1.6; state = 'play';
  }

  function gameOver() {
    state = 'over';
    best = Math.max(best, score);
    postToHost({ type: 'gameover', score: score });
    card.innerHTML = '';
    var h = document.createElement('h2'); h.textContent = 'Game over';
    var sub = document.createElement('p'); sub.className = 'sub';
    sub.textContent = 'Score ' + score + '  •  Best ' + best;
    var btn = document.createElement('button'); btn.className = 'bigbtn'; btn.textContent = 'Play again';
    btn.onclick = function () { hideOverlay(); reset(); };
    card.appendChild(h); card.appendChild(sub); card.appendChild(btn);
    overlay.classList.add('show');
  }

  // ---- Update + render ------------------------------------------------------
  function update(dt) {
    // clouds + parallax layers drift always
    clouds.forEach(function (c) { c.x -= 18 * c.s * dt; if (c.x < -80) { c.x = W + 80; c.y = 40 + Math.random() * (H * 0.4); } });
    cityOffset = (cityOffset + 22 * dt) % W;
    hillOffset = (hillOffset + 40 * dt) % W;
    if (shake > 0) shake -= dt;

    if (state !== 'play') return;
    t += dt;
    if (invuln > 0) invuln -= dt;

    bird.vy += GRAVITY * dt;
    bird.y += bird.vy * dt;
    bird.rot = Math.max(-0.5, Math.min(1.2, bird.vy / 600));

    spawnT += dt;
    if (spawnT >= PIPE_EVERY) { spawnT = 0; spawnPipe(); }

    for (var i = pipes.length - 1; i >= 0; i--) {
      var p = pipes[i];
      p.x -= SPEED * dt;
      if (!p.passed && p.x + PIPE_W < bird.x) {
        p.passed = true; score++; postToHost({ type: 'score', score: score });
        if (QUIZ.length && score >= nextQuizAt) { nextQuizAt = score + 3; showPlayQuestion(); return; }
      }
      if (p.x + PIPE_W < -10) pipes.splice(i, 1);
      if (invuln <= 0 && hitsPipe(p)) { onCrash(); return; }
    }

    if (bird.y + bird.r > H - GROUND_H) { bird.y = H - GROUND_H - bird.r; onCrash(); return; }
    if (bird.y - bird.r < 0) { bird.y = bird.r; bird.vy = 0; }

    for (var j = particles.length - 1; j >= 0; j--) {
      var pt = particles[j];
      pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.life -= dt;
      if (pt.life <= 0) particles.splice(j, 1);
    }
  }

  function hitsPipe(p) {
    var bx = bird.x, by = bird.y, r = bird.r * 0.85;
    if (bx + r < p.x || bx - r > p.x + PIPE_W) return false;
    return (by - r < p.top) || (by + r > p.top + GAP);
  }

  function onCrash() {
    for (var i = 0; i < 16; i++) {
      particles.push({ x: bird.x, y: bird.y, vx: (Math.random() - 0.5) * 320, vy: (Math.random() - 0.5) * 320, life: 0.6, c: '#ffcf33' });
    }
    shake = 0.4;
    if (QUIZ.length && revives < 3) { revives++; showQuiz(); }
    else { gameOver(); }
  }

  // Parallax city silhouette + rolling hills behind the play field.
  function drawBackdrop() {
    var horizon = H - GROUND_H;
    // sun glow
    ctx.save();
    var sx = W * 0.78, sy = H * 0.22;
    var sg = ctx.createRadialGradient(sx, sy, 8, sx, sy, 120);
    sg.addColorStop(0, 'rgba(255,243,196,0.95)');
    sg.addColorStop(1, 'rgba(255,243,196,0)');
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(sx, sy, 120, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff3c4';
    ctx.beginPath(); ctx.arc(sx, sy, 34, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // distant city skyline (slow parallax)
    ctx.fillStyle = 'rgba(120,160,200,0.45)';
    var span = W + 120;
    for (var bx = 0; bx < span; bx += 60) {
      var bh = 60 + Math.abs(Math.sin(bx * 0.7)) * 90;
      var x = ((bx - cityOffset) % span + span) % span - 60;
      ctx.fillRect(x, horizon - bh, 46, bh);
    }

    // rolling hills (faster parallax)
    ctx.fillStyle = '#8fd17a';
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    for (var hx = 0; hx <= W; hx += 20) {
      var y = horizon - 40 - Math.sin((hx + hillOffset) * 0.012) * 26;
      ctx.lineTo(hx, y);
    }
    ctx.lineTo(W, horizon); ctx.closePath(); ctx.fill();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function render() {
    ctx.save();
    if (shake > 0) {
      var s = shake * 14;
      ctx.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s);
    }
    // sky gradient
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#4ec0f7'); g.addColorStop(0.7, '#9bd9fb'); g.addColorStop(1, '#bfe9ff');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    drawBackdrop();

    // clouds
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    clouds.forEach(function (c) {
      var s = 26 * c.s;
      ctx.beginPath();
      ctx.arc(c.x, c.y, s, 0, Math.PI * 2);
      ctx.arc(c.x + s, c.y + 6, s * 0.8, 0, Math.PI * 2);
      ctx.arc(c.x - s, c.y + 6, s * 0.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // pipes
    pipes.forEach(function (p) {
      var pg = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
      pg.addColorStop(0, '#2fae5e'); pg.addColorStop(1, '#52d784');
      ctx.fillStyle = pg;
      roundRect(p.x, 0, PIPE_W, p.top, 8); ctx.fill();
      roundRect(p.x, p.top + GAP, PIPE_W, H - GROUND_H - (p.top + GAP), 8); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      roundRect(p.x + PIPE_W - 8, 0, 8, p.top, 4); ctx.fill();
      roundRect(p.x + PIPE_W - 8, p.top + GAP, 8, H - GROUND_H - (p.top + GAP), 4); ctx.fill();
    });

    // ground
    ctx.fillStyle = '#ded39a'; ctx.fillRect(0, H - GROUND_H, W, GROUND_H);
    ctx.fillStyle = '#c9bd80'; ctx.fillRect(0, H - GROUND_H, W, 10);

    // particles
    particles.forEach(function (pt) {
      ctx.globalAlpha = Math.max(0, pt.life * 1.6);
      ctx.fillStyle = pt.c;
      ctx.fillRect(pt.x, pt.y, 4, 4);
      ctx.globalAlpha = 1;
    });

    // bird
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rot);
    if (invuln > 0) ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * 30);
    ctx.fillStyle = '#ffce3a';
    ctx.beginPath(); ctx.arc(0, 0, bird.r, 0, Math.PI * 2); ctx.fill();
    ctx.save(); // animated flapping wing
    var wingFlap = Math.sin(t * 18) * 0.6 - (bird.vy < 0 ? 0.5 : 0);
    ctx.translate(-4, 2); ctx.rotate(wingFlap);
    ctx.fillStyle = '#ff9f1c';
    ctx.beginPath(); ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffb347';
    ctx.beginPath(); ctx.ellipse(0, 0, 6, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#fff'; // eye
    ctx.beginPath(); ctx.arc(7, -5, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.arc(9, -5, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff7b00'; // beak
    ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(24, 3); ctx.lineTo(14, 6); ctx.fill();
    ctx.restore();

    // HUD
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 4;
    ctx.font = '700 44px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeText(String(score), W / 2, 70);
    ctx.fillText(String(score), W / 2, 70);

    if (state === 'ready') {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.font = '600 20px -apple-system, sans-serif';
      ctx.fillText('Tap to flap', W / 2, H * 0.62);
    }
    ctx.restore();
  }

  // ---- Loop -----------------------------------------------------------------
  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    update(dt);
    render();
    requestAnimationFrame(frame);
  }
  postToHost({ type: 'ready' });
  requestAnimationFrame(frame);
})();
