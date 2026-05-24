/* PlayStudy — Space Shooter
 * Self-contained HTML5 canvas game, hosted statically and embedded in the
 * Flutter app via a WebView (JS channel "PlayStudy") or an <iframe> on web.
 *
 * Host -> game:  window.PlayStudyInit({ quiz: [...] })  OR  postMessage({type:'init', quiz})
 * Game -> host:  {type:'ready'} | {type:'score',score} | {type:'reward',reason} | {type:'gameover',score}
 */
(function () {
  'use strict';

  var QUIZ = [];

  function postToHost(msg) {
    try {
      if (window.PlayStudy && typeof window.PlayStudy.postMessage === 'function') {
        window.PlayStudy.postMessage(JSON.stringify(msg));
      } else if (window.parent && window.parent !== window) {
        window.parent.postMessage(msg, '*');
      }
    } catch (e) { /* no-op */ }
  }

  window.PlayStudyInit = function (payload) {
    try { QUIZ = (payload && payload.quiz) || []; } catch (e) { QUIZ = []; }
  };
  window.addEventListener('message', function (e) {
    if (e && e.data && e.data.type === 'init') QUIZ = e.data.quiz || [];
  });
  try {
    var qp = new URLSearchParams(location.search).get('quiz');
    if (qp) QUIZ = JSON.parse(decodeURIComponent(escape(atob(qp))));
  } catch (e) { /* ignore */ }

  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.floor(W * DPR); canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  var ship, bullets, enemies, eBullets, stars, particles, nebulae;
  var score, best = 0, lives, wave, state, fireT, spawnT, toSpawn, t, bonuses;
  var shake = 0, muzzle = 0;

  function reset() {
    ship = { x: W / 2, y: H - 90, w: 38, h: 30, cool: 0 };
    bullets = []; enemies = []; eBullets = []; particles = [];
    stars = [];
    for (var i = 0; i < 110; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, z: 0.3 + Math.random() * 1.4, tw: Math.random() * Math.PI * 2 });
    nebulae = [
      { x: W * 0.25, y: H * 0.3, r: W * 0.45, c: 'rgba(90,40,160,0.30)' },
      { x: W * 0.8, y: H * 0.65, r: W * 0.5, c: 'rgba(20,90,160,0.28)' },
      { x: W * 0.55, y: H * 0.1, r: W * 0.35, c: 'rgba(160,30,90,0.22)' },
    ];
    score = 0; lives = 3; wave = 0; fireT = 0; spawnT = 0; toSpawn = 0; t = 0; bonuses = 0;
    state = 'play';
    startWave();
  }

  function startWave() {
    wave++;
    toSpawn = 4 + wave * 2;
    spawnT = 0;
  }

  function spawnEnemy() {
    var size = 26;
    enemies.push({
      x: 30 + Math.random() * (W - 60), y: -size,
      w: size, h: size, hp: 1 + (wave > 3 ? 1 : 0),
      vy: 40 + Math.random() * 30 + wave * 4,
      sway: Math.random() * Math.PI * 2, fire: 1 + Math.random() * 2.5,
    });
  }

  // ---- Input ----------------------------------------------------------------
  var pointerActive = false;
  function moveTo(clientX) { ship.x = Math.max(ship.w / 2, Math.min(W - ship.w / 2, clientX)); }
  canvas.addEventListener('pointerdown', function (e) {
    if (state === 'over') { hideOverlay(); reset(); return; }
    if (state !== 'play') return;
    pointerActive = true; moveTo(e.clientX);
  });
  canvas.addEventListener('pointermove', function (e) { if (pointerActive && state === 'play') moveTo(e.clientX); });
  window.addEventListener('pointerup', function () { pointerActive = false; });
  var keys = {};
  window.addEventListener('keydown', function (e) { keys[e.code] = true; if (state === 'over' && e.code === 'Space') { hideOverlay(); reset(); } });
  window.addEventListener('keyup', function (e) { keys[e.code] = false; });

  // ---- Quiz overlay ---------------------------------------------------------
  var overlay = document.getElementById('overlay');
  var card = document.getElementById('card');
  function pickQuestion() { return QUIZ.length ? QUIZ[Math.floor(Math.random() * QUIZ.length)] : null; }

  function showQuiz(onResolve, title, sub) {
    var q = pickQuestion();
    if (!q) { onResolve(false); return; }
    state = 'quiz';
    card.innerHTML = '';
    var h = document.createElement('h2'); h.textContent = title || 'Bonus question';
    var s = document.createElement('p'); s.className = 'sub'; s.textContent = sub || 'Correct = reward + shield';
    var prompt = document.createElement('div'); prompt.className = 'prompt'; prompt.textContent = q.prompt || '';
    card.appendChild(h); card.appendChild(s); card.appendChild(prompt);
    var choices = q.choices || [], answered = false;
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
          onResolve(correct);
        }, 700);
      };
      card.appendChild(b);
    });
    overlay.classList.add('show');
  }
  function hideOverlay() { overlay.classList.remove('show'); }

  function explode(x, y, color, n) {
    for (var i = 0; i < (n || 14); i++) {
      particles.push({ x: x, y: y, vx: (Math.random() - 0.5) * 320, vy: (Math.random() - 0.5) * 320, life: 0.5 + Math.random() * 0.3, c: color, r: 2 + Math.random() * 3 });
    }
    shake = Math.min(0.5, shake + (n && n > 16 ? 0.35 : 0.15));
  }

  function gameOver() {
    state = 'over'; best = Math.max(best, score);
    postToHost({ type: 'gameover', score: score });
    card.innerHTML = '';
    var h = document.createElement('h2'); h.textContent = 'Game over';
    var sub = document.createElement('p'); sub.className = 'sub'; sub.textContent = 'Score ' + score + '  •  Best ' + best;
    var btn = document.createElement('button'); btn.className = 'bigbtn'; btn.textContent = 'Play again';
    btn.onclick = function () { hideOverlay(); reset(); };
    card.appendChild(h); card.appendChild(sub); card.appendChild(btn);
    overlay.classList.add('show');
  }

  function loseLife() {
    lives--; explode(ship.x, ship.y, '#ff5a6e', 22);
    if (lives <= 0) {
      // One quiz chance to revive with a fresh life.
      if (QUIZ.length && bonuses < 3) {
        bonuses++;
        showQuiz(function (ok) {
          if (ok) { lives = 1; eBullets = []; state = 'play'; }
          else gameOver();
        }, 'Answer to revive', 'Correct = back in the fight');
      } else gameOver();
    }
  }

  function rectHit(a, b) {
    return Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2;
  }

  function update(dt) {
    t += dt;
    if (shake > 0) shake -= dt;
    if (muzzle > 0) muzzle -= dt;
    stars.forEach(function (st) { st.y += st.z * 60 * dt; st.tw += dt * 4; if (st.y > H) { st.y = 0; st.x = Math.random() * W; } });
    if (state !== 'play') return;

    if (keys['ArrowLeft']) ship.x -= 320 * dt;
    if (keys['ArrowRight']) ship.x += 320 * dt;
    ship.x = Math.max(ship.w / 2, Math.min(W - ship.w / 2, ship.x));

    // auto-fire
    ship.cool -= dt;
    if (ship.cool <= 0) { ship.cool = 0.22; bullets.push({ x: ship.x, y: ship.y - 20, vy: -560, w: 5, h: 14 }); muzzle = 0.08; }

    // spawn wave
    if (toSpawn > 0) {
      spawnT -= dt;
      if (spawnT <= 0) { spawnEnemy(); toSpawn--; spawnT = 0.45; }
    } else if (enemies.length === 0) {
      startWave();
    }

    for (var i = bullets.length - 1; i >= 0; i--) {
      var b = bullets[i]; b.y += b.vy * dt;
      if (b.y < -20) { bullets.splice(i, 1); continue; }
      for (var k = enemies.length - 1; k >= 0; k--) {
        if (rectHit(b, enemies[k])) {
          bullets.splice(i, 1); enemies[k].hp--;
          if (enemies[k].hp <= 0) {
            explode(enemies[k].x, enemies[k].y, '#7cf2ff', 16);
            enemies.splice(k, 1); score += 10; postToHost({ type: 'score', score: score });
          } else { explode(b.x, b.y, '#ffd166', 5); }
          break;
        }
      }
    }

    for (var e = enemies.length - 1; e >= 0; e--) {
      var en = enemies[e];
      en.y += en.vy * dt; en.sway += dt * 2; en.x += Math.sin(en.sway) * 30 * dt;
      en.fire -= dt;
      if (en.fire <= 0) { en.fire = 1.4 + Math.random() * 1.8; eBullets.push({ x: en.x, y: en.y + en.h / 2, vy: 200 + wave * 8, w: 5, h: 12 }); }
      if (en.y > H + 30) { enemies.splice(e, 1); loseLife(); if (state !== 'play') return; continue; }
      if (rectHit(en, ship)) { enemies.splice(e, 1); loseLife(); if (state !== 'play') return; }
    }

    for (var f = eBullets.length - 1; f >= 0; f--) {
      var eb = eBullets[f]; eb.y += eb.vy * dt;
      if (eb.y > H + 20) { eBullets.splice(f, 1); continue; }
      if (rectHit(eb, ship)) { eBullets.splice(f, 1); loseLife(); if (state !== 'play') return; }
    }

    for (var p = particles.length - 1; p >= 0; p--) {
      var pt = particles[p]; pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.life -= dt;
      if (pt.life <= 0) particles.splice(p, 1);
    }
  }

  function drawShip() {
    ctx.save(); ctx.translate(ship.x, ship.y);
    if (muzzle > 0) { // muzzle flash at the nose
      ctx.globalAlpha = muzzle / 0.08;
      var mg = ctx.createRadialGradient(0, -ship.h / 2, 0, 0, -ship.h / 2, 18);
      mg.addColorStop(0, '#bff6ff'); mg.addColorStop(1, 'rgba(90,209,255,0)');
      ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(0, -ship.h / 2, 18, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = '#5ad1ff';
    ctx.beginPath();
    ctx.moveTo(0, -ship.h / 2);
    ctx.lineTo(ship.w / 2, ship.h / 2);
    ctx.lineTo(0, ship.h / 3);
    ctx.lineTo(-ship.w / 2, ship.h / 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(0, -2, 5, 0, Math.PI * 2); ctx.fill();
    // thruster
    ctx.fillStyle = 'rgba(255,160,60,' + (0.5 + 0.5 * Math.sin(t * 30)) + ')';
    ctx.beginPath(); ctx.moveTo(-6, ship.h / 2); ctx.lineTo(0, ship.h / 2 + 12 + Math.sin(t * 40) * 4); ctx.lineTo(6, ship.h / 2); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function render() {
    ctx.save();
    if (shake > 0) {
      var sh = shake * 16;
      ctx.translate((Math.random() - 0.5) * sh, (Math.random() - 0.5) * sh);
    }
    ctx.fillStyle = '#05060f'; ctx.fillRect(-20, -20, W + 40, H + 40);

    // nebula clouds
    nebulae.forEach(function (n) {
      var ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      ng.addColorStop(0, n.c); ng.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ng; ctx.fillRect(-20, -20, W + 40, H + 40);
    });

    // twinkling stars
    stars.forEach(function (st) {
      ctx.globalAlpha = (0.3 + st.z * 0.4) * (0.6 + 0.4 * Math.sin(st.tw));
      ctx.fillStyle = '#cdd6ff';
      ctx.fillRect(st.x, st.y, st.z * 1.6, st.z * 1.6);
    });
    ctx.globalAlpha = 1;

    // bullets with glow
    ctx.shadowColor = '#5ad1ff'; ctx.shadowBlur = 8;
    ctx.fillStyle = '#9af9ff';
    bullets.forEach(function (b) { ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h); });
    ctx.shadowColor = '#ff5a6e';
    ctx.fillStyle = '#ff7b8e';
    eBullets.forEach(function (b) { ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h); });
    ctx.shadowBlur = 0;

    // enemies
    enemies.forEach(function (en) {
      ctx.save(); ctx.translate(en.x, en.y);
      ctx.fillStyle = en.hp > 1 ? '#ff8bd0' : '#b388ff';
      ctx.beginPath();
      ctx.moveTo(0, en.h / 2);
      ctx.lineTo(en.w / 2, -en.h / 2);
      ctx.lineTo(-en.w / 2, -en.h / 2);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#05060f';
      ctx.fillRect(-5, -4, 10, 5);
      ctx.restore();
    });

    // particles
    particles.forEach(function (pt) {
      var sz = pt.r || 3;
      ctx.globalAlpha = Math.max(0, pt.life * 1.8); ctx.fillStyle = pt.c;
      ctx.fillRect(pt.x, pt.y, sz, sz); ctx.globalAlpha = 1;
    });

    drawShip();

    // HUD
    ctx.fillStyle = '#fff'; ctx.font = '700 22px -apple-system, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Score ' + score, 16, 34);
    ctx.textAlign = 'right';
    ctx.fillText('Wave ' + wave, W - 16, 34);
    ctx.textAlign = 'left';
    for (var i = 0; i < lives; i++) {
      ctx.fillStyle = '#ff5a6e';
      ctx.beginPath(); ctx.arc(22 + i * 22, 56, 7, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.033, (now - last) / 1000); last = now;
    update(dt); render();
    requestAnimationFrame(frame);
  }
  reset();
  postToHost({ type: 'ready' });
  requestAnimationFrame(frame);
})();
