/* PlayStudy — Crossword
 * Builds an interlocking crossword from the study set's word game
 * (each entry = {word, clue}). Clues are listed below as Across / Down hints.
 *
 * Host -> game:  window.PlayStudyInit({ words: [{word,clue}] })  or
 *                postMessage({type:'init', words})  or  ?words=<base64url-json>
 * Game -> host:  {type:'ready'} | {type:'reward',reason} | {type:'solved'}
 */
(function () {
  'use strict';

  var WORDS = [];

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
    try { WORDS = (payload && payload.words) || []; build(); } catch (e) { /* ignore */ }
  };
  window.addEventListener('message', function (e) {
    if (e && e.data && e.data.type === 'init') { WORDS = e.data.words || []; build(); }
  });
  try {
    var qp = new URLSearchParams(location.search).get('words');
    if (qp) {
      var b = qp.replace(/-/g, '+').replace(/_/g, '/');
      WORDS = JSON.parse(decodeURIComponent(escape(atob(b))));
    }
  } catch (e) { /* ignore */ }

  // ---- Layout generation ----------------------------------------------------
  function generate(entries) {
    entries = entries
      .map(function (e) {
        return { word: String(e.word || '').toUpperCase().replace(/[^A-Z]/g, ''), clue: e.clue || '' };
      })
      .filter(function (e) { return e.word.length >= 2 && e.word.length <= 12; });

    var seen = {};
    entries = entries.filter(function (e) { if (seen[e.word]) return false; seen[e.word] = 1; return true; });
    entries.sort(function (a, b) { return b.word.length - a.word.length; });
    if (!entries.length) return [];

    var grid = {};
    var placed = [];
    function key(r, c) { return r + ',' + c; }
    function at(r, c) { return grid[key(r, c)]; }

    function fits(word, row, col, dir, requireCross) {
      var dr = dir === 'down' ? 1 : 0, dc = dir === 'across' ? 1 : 0;
      if (at(row - dr, col - dc) != null) return false;             // cell before start
      if (at(row + dr * word.length, col + dc * word.length) != null) return false; // after end
      var crossings = 0;
      for (var i = 0; i < word.length; i++) {
        var r = row + dr * i, c = col + dc * i;
        var ex = at(r, c);
        if (ex != null) {
          if (ex !== word[i]) return false;
          crossings++;
        } else if (dir === 'across') {
          if (at(r - 1, c) != null || at(r + 1, c) != null) return false; // no parallel touch
        } else {
          if (at(r, c - 1) != null || at(r, c + 1) != null) return false;
        }
      }
      return requireCross ? crossings > 0 : true;
    }

    function put(entry, row, col, dir) {
      var dr = dir === 'down' ? 1 : 0, dc = dir === 'across' ? 1 : 0;
      for (var i = 0; i < entry.word.length; i++) grid[key(row + dr * i, col + dc * i)] = entry.word[i];
      placed.push({ word: entry.word, clue: entry.clue, row: row, col: col, dir: dir });
    }

    put(entries[0], 0, 0, 'across');
    var leftovers = [];
    for (var e = 1; e < entries.length; e++) {
      var w = entries[e].word, done = false;
      for (var pi = 0; pi < placed.length && !done; pi++) {
        var p = placed[pi];
        for (var i = 0; i < p.word.length && !done; i++) {
          for (var j = 0; j < w.length && !done; j++) {
            if (p.word[i] !== w[j]) continue;
            var pr = p.row + (p.dir === 'down' ? i : 0);
            var pc = p.col + (p.dir === 'across' ? i : 0);
            var dir = p.dir === 'across' ? 'down' : 'across';
            var row = dir === 'down' ? pr - j : pr;
            var col = dir === 'across' ? pc - j : pc;
            if (fits(w, row, col, dir, true)) { put(entries[e], row, col, dir); done = true; }
          }
        }
      }
      if (!done) leftovers.push(entries[e]);
    }
    // Place words that couldn't interlock on their own rows below, so every
    // clue still appears in the puzzle (just not crossing).
    if (leftovers.length) {
      var maxRow = 0;
      Object.keys(grid).forEach(function (k) { maxRow = Math.max(maxRow, parseInt(k.split(',')[0], 10)); });
      var freeRow = maxRow + 2;
      leftovers.forEach(function (en) {
        put(en, freeRow, 0, 'across');
        freeRow += 2;
      });
    }
    return placed;
  }

  // ---- Build + render --------------------------------------------------------
  var cells = {};       // 'r,c' -> {sol, input, el}
  var entries = [];     // placed words with numbers + cell refs
  var selected = null;  // current entry

  function build() {
    var gridEl = document.getElementById('grid');
    var acrossEl = document.getElementById('across');
    var downEl = document.getElementById('down');
    gridEl.innerHTML = ''; acrossEl.innerHTML = ''; downEl.innerHTML = '';
    cells = {}; entries = []; selected = null;

    var placed = generate(WORDS);
    if (placed.length < 1) {
      gridEl.innerHTML = '<div class="empty">Not enough words to build a crossword for this set.</div>';
      return;
    }

    // Normalise coordinates to start at 0.
    var minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;
    placed.forEach(function (p) {
      var dr = p.dir === 'down' ? 1 : 0, dc = p.dir === 'across' ? 1 : 0;
      for (var i = 0; i < p.word.length; i++) {
        var r = p.row + dr * i, c = p.col + dc * i;
        if (r < minR) minR = r; if (c < minC) minC = c;
        if (r > maxR) maxR = r; if (c > maxC) maxC = c;
      }
    });
    var rows = maxR - minR + 1, cols = maxC - minC + 1;

    // Solution grid + per-cell start detection for numbering.
    var sol = {}, starts = {};
    placed.forEach(function (p) {
      p.row -= minR; p.col -= minC;
      var dr = p.dir === 'down' ? 1 : 0, dc = p.dir === 'across' ? 1 : 0;
      for (var i = 0; i < p.word.length; i++) sol[(p.row + dr * i) + ',' + (p.col + dc * i)] = p.word[i];
      starts[p.row + ',' + p.col] = true;
    });

    // Assign clue numbers in reading order.
    var num = 0, numAt = {};
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      if (starts[r + ',' + c]) { num++; numAt[r + ',' + c] = num; }
    }

    // Size cells to fit width.
    var avail = Math.min(window.innerWidth - 24, 520);
    var cs = Math.max(20, Math.min(38, Math.floor(avail / cols) - 2));
    gridEl.style.gridTemplateColumns = 'repeat(' + cols + ', ' + cs + 'px)';
    document.documentElement.style.setProperty('--cs', cs + 'px');

    for (var r2 = 0; r2 < rows; r2++) {
      for (var c2 = 0; c2 < cols; c2++) {
        var k = r2 + ',' + c2;
        var div = document.createElement('div');
        div.className = 'cell';
        if (sol[k] == null) { div.classList.add('block'); gridEl.appendChild(div); continue; }
        if (numAt[k]) { var b = document.createElement('span'); b.className = 'num'; b.textContent = numAt[k]; div.appendChild(b); }
        var inp = document.createElement('input');
        inp.maxLength = 1; inp.setAttribute('inputmode', 'latin');
        inp.dataset.r = r2; inp.dataset.c = c2;
        div.appendChild(inp);
        gridEl.appendChild(div);
        cells[k] = { sol: sol[k], input: inp, el: div };
        inp.addEventListener('focus', function () { onFocusCell(this); });
        inp.addEventListener('input', function () { onType(this); });
        inp.addEventListener('keydown', function (ev) { onKey(this, ev); });
      }
    }

    // Build clue entries with cell lists + render hints.
    placed.forEach(function (p) {
      var dr = p.dir === 'down' ? 1 : 0, dc = p.dir === 'across' ? 1 : 0;
      var list = [];
      for (var i = 0; i < p.word.length; i++) list.push((p.row + dr * i) + ',' + (p.col + dc * i));
      var entry = { dir: p.dir, num: numAt[p.row + ',' + p.col], clue: p.clue, cells: list, word: p.word };
      entries.push(entry);
    });
    entries.sort(function (a, b) { return a.num - b.num; });
    entries.forEach(function (entry) {
      var d = document.createElement('div');
      d.className = 'clue';
      d.textContent = entry.num + '. ' + entry.clue;
      d.onclick = function () { selectEntry(entry); };
      entry.clueEl = d;
      (entry.dir === 'across' ? acrossEl : downEl).appendChild(d);
    });

    selectEntry(entries[0]);
  }

  function entriesAt(r, c, dir) {
    return entries.filter(function (e) { return e.dir === dir && e.cells.indexOf(r + ',' + c) >= 0; })[0];
  }

  function onFocusCell(inp) {
    var r = +inp.dataset.r, c = +inp.dataset.c;
    if (selected && selected.cells.indexOf(r + ',' + c) >= 0) { highlight(); return; }
    var e = entriesAt(r, c, 'across') || entriesAt(r, c, 'down');
    if (e) { selected = e; highlight(); }
  }

  function selectEntry(entry) {
    selected = entry;
    highlight();
    var first = entry.cells.find(function (k) { return !cells[k].input.value; }) || entry.cells[0];
    cells[first].input.focus();
  }

  function highlight() {
    Object.keys(cells).forEach(function (k) { cells[k].el.classList.remove('active', 'word'); });
    entries.forEach(function (e) { e.clueEl.classList.remove('sel'); });
    if (!selected) return;
    selected.clueEl.classList.add('sel');
    selected.cells.forEach(function (k) { cells[k].el.classList.add('word'); });
  }

  function onType(inp) {
    inp.value = (inp.value || '').toUpperCase().replace(/[^A-Z]/g, '');
    var k = inp.dataset.r + ',' + inp.dataset.c;
    cells[k].el.classList.remove('correct', 'wrong');
    if (inp.value && selected) {
      var idx = selected.cells.indexOf(k);
      if (idx >= 0 && idx + 1 < selected.cells.length) cells[selected.cells[idx + 1]].input.focus();
    }
  }

  function onKey(inp, ev) {
    if (ev.key === 'Backspace' && !inp.value && selected) {
      var k = inp.dataset.r + ',' + inp.dataset.c;
      var idx = selected.cells.indexOf(k);
      if (idx > 0) { var prev = cells[selected.cells[idx - 1]].input; prev.value = ''; prev.focus(); ev.preventDefault(); }
    }
  }

  function toast(msg) {
    var t = document.getElementById('toast'), m = document.getElementById('toastMsg');
    m.textContent = msg; t.style.display = 'block';
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.style.display = 'none'; }, 1800);
  }

  function check() {
    var allFilled = true, allCorrect = true;
    Object.keys(cells).forEach(function (k) {
      var cell = cells[k]; var v = (cell.input.value || '').toUpperCase();
      cell.el.classList.remove('correct', 'wrong');
      if (!v) { allFilled = false; allCorrect = false; return; }
      if (v === cell.sol) cell.el.classList.add('correct');
      else { cell.el.classList.add('wrong'); allCorrect = false; }
    });
    // Mark fully-correct clues as done.
    entries.forEach(function (e) {
      var ok = e.cells.every(function (k) { return (cells[k].input.value || '').toUpperCase() === cells[k].sol; });
      e.clueEl.classList.toggle('done', ok);
    });
    if (allCorrect) {
      postToHost({ type: 'reward', reason: 'Guessed a word' });
      postToHost({ type: 'solved' });
      toast('Solved! 🎉');
    } else if (!allFilled) {
      toast('Keep going — fill every square.');
    } else {
      toast('Some letters are off — check the red squares.');
    }
  }

  function revealLetter() {
    if (!selected) return;
    var k = selected.cells.find(function (kk) {
      var v = (cells[kk].input.value || '').toUpperCase();
      return v !== cells[kk].sol;
    });
    if (!k) { toast('This word is already correct.'); return; }
    cells[k].input.value = cells[k].sol;
    cells[k].el.classList.add('correct');
  }

  document.getElementById('checkBtn').addEventListener('click', check);
  document.getElementById('revealBtn').addEventListener('click', revealLetter);
  window.addEventListener('resize', function () { if (entries.length) build(); });

  postToHost({ type: 'ready' });
  build(); // in case words arrived via ?words= before load
})();
