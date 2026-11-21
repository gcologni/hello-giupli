/* Hello Babi: interfaccia. Logica in kids.js (lezioni) e ../srs.js (memoria delle parole), corso in data.js. */
(() => {
  'use strict';
  const { units, items } = window.BABI_COURSE;
  const SRS = window.SRS, KIDS = window.KIDS;
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const lessons = KIDS.makeLessons(units, items);
  const unitById = Object.fromEntries(units.map((u) => [u.id, u]));
  const KEY = 'hello-babi-v1';
  const app = document.getElementById('app');
  const rng = Math.random;
  const shuffle = (a) => SRS.shuffle(a, rng);
  const pick = (a) => a[Math.floor(rng() * a.length)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  const ICON = {
    speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4ZM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6 6.4 5Z"/></svg>',
  };

  /* ---------------- Stato salvato ---------------- */
  // tick = numero di lezioni finite: è l'orologio del ripasso, al posto dei giorni.
  const defaults = () => ({ v: 1, cards: {}, done: {}, tick: 0, stickers: 0, lessonsPlayed: 0, settings: { accent: 'en-GB', slow: false, sound: true } });
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && typeof s.cards === 'object') { const d = defaults(); return { ...d, ...s, settings: { ...d.settings, ...(s.settings || {}) } }; }
      }
    } catch (e) { /* si parte da zero */ }
    return defaults();
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignora */ } }
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { /* ignora */ }

  /* ---------------- Voce e suoni ---------------- */
  const Voice = {
    list: [], ok: 'speechSynthesis' in window,
    load() { if (this.ok) this.list = speechSynthesis.getVoices() || []; },
    pick() {
      const pref = S.settings.accent, norm = (v) => (v.lang || '').replace('_', '-');
      const en = this.list.filter((v) => /^en/i.test(norm(v)));
      return en.find((v) => norm(v) === pref && /enhanced|premium|natural/i.test(v.name)) || en.find((v) => norm(v) === pref) || en[0] || null;
    },
    say(text, slow) {
      if (!this.ok) return;
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(SRS.forSpeech(text));
        const v = this.pick(); if (v) u.voice = v;
        u.lang = v ? v.lang : S.settings.accent;
        u.rate = slow || S.settings.slow ? 0.55 : 0.8;
        u.pitch = 1.1;
        u.onstart = () => $$('.play-big').forEach((b) => b.classList.add('playing'));
        u.onend = u.onerror = () => $$('.play-big').forEach((b) => b.classList.remove('playing'));
        speechSynthesis.speak(u);
      } catch (e) { /* ignora */ }
    },
  };
  Voice.load();
  if (Voice.ok) speechSynthesis.onvoiceschanged = () => Voice.load();

  let ac = null;
  function tone(f, d, type, vol, delay) {
    if (!S.settings.sound) return;
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      const t0 = ac.currentTime + (delay || 0), o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t0);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + d + 0.05);
    } catch (e) { /* ignora */ }
  }
  const sfx = {
    ok: () => { tone(988, 0.12, 'triangle', 0.12); tone(1480, 0.22, 'triangle', 0.1, 0.09); },
    no: () => tone(300, 0.25, 'sine', 0.08),
    hop: () => tone(520, 0.12, 'sine', 0.08),
    win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.25, 'triangle', 0.1, i * 0.1)),
  };

  /* ---------------- Testi ---------------- */
  const PRAISE = ['Bravissima!', 'Evviva!', 'Giusto!', 'Super!', 'Che brava!', 'Perfetto!', 'Sì, così!', 'Grande Babi!', 'Wow!'];
  const SOFT = ['Quasi!', 'Ci riproviamo dopo!', 'Niente paura!', 'Oops!', 'Tranquilla!'];
  const MASCOT_OK = ['🐰', '🐴', '🦄'];
  const MASCOT_NO = ['🐰', '🐴'];

  /* ---------------- Utilità ---------------- */
  const tick = () => S.tick || 0;
  const introduced = () => items.filter((it) => S.cards[it.id]);
  function ensureCard(id) { if (!S.cards[id]) { S.cards[id] = SRS.newCard(tick()); save(); } }
  const firstWord = (s) => s.split(/[ ,(]/)[0].toLowerCase();
  function distractors(it, n) {
    const ok = (x) => x.id !== it.id && !!x.k === !!it.k && x.pr !== it.pr && firstWord(x.it) !== firstWord(it.it) && x.em !== it.em;
    const pool = items.filter(ok);
    const unit = shuffle(pool.filter((x) => x.u === it.u));
    const known = shuffle(pool.filter((x) => S.cards[x.id]));
    const rest = shuffle(pool.slice());
    const out = [];
    for (const x of [...unit, ...known, ...rest]) { if (!out.includes(x)) out.push(x); if (out.length >= n) break; }
    return out;
  }
  const starsHtml = (n) => [0, 1, 2].map((i) => `<span class="${i < n ? '' : 'off'}">★</span>`).join('');
  function carrotsHtml(c) {
    const m = SRS.mastery(c);
    return `<div class="carrots" aria-label="${m} carote su 5">${[0, 1, 2, 3, 4].map((i) => `<span class="${i < m ? '' : 'off'}">🥕</span>`).join('')}</div>`;
  }
  function bindSay(root = document) {
    $$('[data-say]', root).forEach((b) => b.addEventListener('click', () => Voice.say(b.dataset.say, b.dataset.slow === '1')));
  }
  const nextLesson = () => lessons[KIDS.unlockedCount(S, lessons) - 1];
  const allDone = () => lessons.every((l) => S.done[l.n]);

  /* ---------------- Navigazione ---------------- */
  let tab = 'path';
  let run = null;
  function render() {
    if (run) return renderStep();
    if (tab === 'album') return renderAlbum();
    if (tab === 'words') return renderWords();
    if (tab === 'grown') return renderGrownups();
    return renderPath();
  }
  function tabbar() {
    const b = (id, label, icon) => `<button data-tab="${id}" ${tab === id ? 'aria-current="page"' : ''}><span class="ti" aria-hidden="true">${icon}</span><span>${label}</span></button>`;
    return `<div class="tabbar"><nav>${b('path', 'Gioca', '🐴')}${b('album', 'Figurine', '⭐')}${b('words', 'Parole', '📖')}${b('grown', 'Per i grandi', '⚙️')}</nav></div>`;
  }
  function bindTabs() { $$('[data-tab]').forEach((b) => b.addEventListener('click', () => { tab = b.dataset.tab; render(); scrollTo(0, 0); })); }

  /* ---------------- Percorso ---------------- */
  function renderPath() {
    const nl = nextLesson();
    const unlocked = KIDS.unlockedCount(S, lessons);
    const first = !S.lessonsPlayed;
    const finished = allDone();
    const bubble = first ? 'Ciao Babi! Io sono <b>Fiocco</b>. Impariamo l\'inglese con Stella la pony?'
      : finished ? 'Hai finito tutto il percorso! Rigioca le lezioni o fai un <b>gioco libero</b>.'
      : `Pronta per la <b>lezione ${nl.n}</b>? Puoi farne quante vuoi!`;
    let html = '';
    let lastUnit = null;
    lessons.forEach((l) => {
      if (l.u !== lastUnit) {
        if (lastUnit) html += '</div>';
        const u = unitById[l.u];
        html += `<div class="unit-head"><span aria-hidden="true">${u.em}</span>${esc(u.title)}</div><div class="trail">`;
        lastUnit = l.u;
      }
      const done = S.done[l.n];
      const open = l.n <= unlocked;
      const cls = done ? 'done' : open ? 'next' : 'locked';
      html += `<div class="node ${cls}"><button class="stone" data-lesson="${l.n}" ${open ? '' : 'disabled'} aria-label="Lezione ${l.n}${open ? '' : ', chiusa'}">${open ? l.n : '🔒'}</button>
        <div class="stars" aria-label="${done || 0} stelle">${done ? starsHtml(done) : ''}</div></div>`;
    });
    html += '</div>';
    const words = introduced().length;
    app.innerHTML = `<div class="wrap screen">
      <h1 class="hello">Hello, <span>Babi!</span></h1>
      <div class="mascots"><div class="mascot" aria-hidden="true">🐰</div><div class="bubble">${bubble}</div></div>
      ${finished ? '' : `<button class="btn go block" id="play">${first ? 'Iniziamo!' : `Gioca la lezione ${nl.n}`}</button>`}
      ${words >= 6 ? '<button class="btn soft block" id="free">Gioco libero: ripassa le parole</button>' : ''}
      <div class="counters">
        <div class="counter"><b>${Object.keys(S.done).length}</b><span>lezioni</span></div>
        <div class="counter"><b>${words}</b><span>parole</span></div>
        <div class="counter"><b>${S.stickers}</b><span>figurine</span></div>
      </div>
      ${html}
    </div>${tabbar()}`;
    bindTabs();
    const p = $('#play'); if (p) p.addEventListener('click', () => startLesson(nl));
    const f = $('#free'); if (f) f.addEventListener('click', () => startLesson(null));
    $$('[data-lesson]').forEach((b) => b.addEventListener('click', () => startLesson(lessons[+b.dataset.lesson - 1])));
  }

  /* ---------------- Figurine ---------------- */
  function renderAlbum() {
    const cells = KIDS.STICKERS.map((s, i) => i < S.stickers
      ? `<div class="sticker" aria-label="Figurina ${i + 1}">${s}</div>`
      : `<div class="sticker off" aria-label="Figurina da vincere">?</div>`).join('');
    app.innerHTML = `<div class="wrap screen">
      <h1 class="hello">Le mie <span>figurine</span></h1>
      <p class="lead">Ogni lezione nuova finita ti regala una figurina. Ne hai ${S.stickers} su ${KIDS.STICKERS.length}!</p>
      <div class="album">${cells}</div>
    </div>${tabbar()}`;
    bindTabs();
  }

  /* ---------------- Parole ---------------- */
  function renderWords() {
    const groups = units.map((u) => {
      const list = items.filter((x) => x.u === u.id && S.cards[x.id]);
      if (!list.length) return '';
      return `<div class="group-title">${u.em} ${esc(u.title)}</div>` + list.map((it) => `
        <div class="word-row"><div class="e" aria-hidden="true">${it.em}</div>
          <div class="w"><b lang="en">${esc(it.en)}</b><span>${esc(it.it)}</span>${carrotsHtml(S.cards[it.id])}</div>
          <button class="speak" data-say="${esc(it.en)}" aria-label="Ascolta ${esc(it.en)}">${ICON.speaker}</button></div>`).join('');
    }).join('');
    app.innerHTML = `<div class="wrap screen">
      <h1 class="hello">Le mie <span>parole</span></h1>
      <p class="lead">Più carote ha una parola, meglio te la ricordi. Tocca per ascoltarla.</p>
      ${groups ? `<div class="list">${groups}</div>` : '<div class="empty"><div class="e" aria-hidden="true">🥕</div><p>Qui arrivano le parole che impari. Fai la prima lezione!</p></div>'}
    </div>${tabbar()}`;
    bindTabs(); bindSay();
  }

  /* ---------------- Per i grandi ---------------- */
  function renderGrownups() {
    const s = S.settings, voice = Voice.pick();
    app.innerHTML = `<div class="wrap screen">
      <h1 class="hello">Per i <span>grandi</span></h1>
      <section class="card">
        <h3>Come funziona</h3>
        <p>${lessons.length} lezioni brevi, da 3-4 minuti, con ${items.length} parole e frasi. Babi può farne quante vuole, una dopo l'altra. Ogni lezione porta 2-4 parole nuove e ripassa quelle vecchie che ricorda meno. Le parole sbagliate tornano poco dopo.</p>
      </section>
      <section class="card">
        <h3>Accento della voce</h3>
        <div class="seg">
          <button data-accent="en-GB" aria-pressed="${s.accent === 'en-GB'}">Inglese (UK)</button>
          <button data-accent="en-US" aria-pressed="${s.accent === 'en-US'}">Americano (US)</button>
        </div>
        <div class="toggle"><div><h3>Voce sempre lenta</h3></div><button class="switch" role="switch" id="slow" aria-checked="${s.slow}" aria-label="Voce sempre lenta"></button></div>
        <div class="toggle"><div><h3>Suonini</h3></div><button class="switch" role="switch" id="sound" aria-checked="${s.sound}" aria-label="Suonini"></button></div>
        <button class="btn soft" data-say="Hello Babi! I love horses and bunnies!">${ICON.speaker}Prova la voce</button>
        <p>${voice ? 'Voce in uso: ' + esc(voice.name) : 'La voce inglese si carica al primo ascolto.'}</p>
      </section>
      <section class="card">
        <h3>Salva i progressi</h3>
        <p>I progressi restano su questo dispositivo. Per spostarli, copia il codice e incollalo sul nuovo.</p>
        <textarea id="backup" readonly aria-label="Codice di salvataggio"></textarea>
        <button class="btn soft" id="copy">Copia il codice</button>
        <textarea id="restore" placeholder="Incolla qui il codice" aria-label="Codice da ripristinare"></textarea>
        <button class="btn soft" id="doRestore">Ripristina</button>
        <div class="msg" id="msg" role="status"></div>
      </section>
      <section class="card">
        <h3>Ricomincia da zero</h3>
        <button class="btn ghost" id="reset">Cancella i progressi</button>
        <div id="resetConfirm" hidden class="row-btns"><button class="btn soft" id="resetNo">No</button><button class="btn primary" id="resetYes">Sì, cancella</button></div>
      </section>
    </div>${tabbar()}`;
    bindTabs(); bindSay();
    $('#backup').value = btoa(unescape(encodeURIComponent(JSON.stringify(S))));
    const msg = (t, err) => { const m = $('#msg'); m.textContent = t; m.classList.toggle('err', !!err); };
    $$('[data-accent]').forEach((b) => b.addEventListener('click', () => { S.settings.accent = b.dataset.accent; save(); renderGrownups(); Voice.say('Hello Babi!'); }));
    $('#slow').addEventListener('click', () => { S.settings.slow = !S.settings.slow; save(); renderGrownups(); });
    $('#sound').addEventListener('click', () => { S.settings.sound = !S.settings.sound; save(); renderGrownups(); });
    $('#copy').addEventListener('click', () => {
      const ta = $('#backup');
      navigator.clipboard.writeText(ta.value).then(() => msg('Codice copiato.'), () => { ta.select(); msg('Seleziona il testo e copialo a mano.', true); });
    });
    $('#doRestore').addEventListener('click', () => {
      try {
        const data = JSON.parse(decodeURIComponent(escape(atob($('#restore').value.trim()))));
        if (!data || typeof data.cards !== 'object' || typeof data.done !== 'object') throw new Error('formato');
        const d = defaults(); S = { ...d, ...data, settings: { ...d.settings, ...(data.settings || {}) } }; save();
        renderGrownups(); msg('Progressi ripristinati.');
      } catch (e) { msg('Il codice non è valido.', true); }
    });
    $('#reset').addEventListener('click', () => { $('#resetConfirm').hidden = false; });
    $('#resetNo').addEventListener('click', () => { $('#resetConfirm').hidden = true; });
    $('#resetYes').addEventListener('click', () => { const keep = S.settings; S = defaults(); S.settings = keep; save(); tab = 'path'; render(); });
  }

  /* ---------------- Lezione ---------------- */
  function startLesson(lesson) {
    const plan = KIDS.planLesson(S, lesson, items, tick());
    const steps = KIDS.buildSteps(plan, S, byId, rng);
    if (!steps.length) return;
    run = { lesson, plan, steps, i: 0, graded: new Set(), answers: 0, ok: 0, again: {} };
    Voice.say(''); // sblocca la voce su iPhone dentro il tocco
    renderStep();
  }

  function shell(inner, foot = '') {
    const pct = Math.round((run.i / run.steps.length) * 100);
    return `<div class="wrap lesson">
      <div class="topbar"><button class="icon-btn" id="quit" aria-label="Esci">${ICON.close}</button>
        <div class="track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i><span class="runner" style="left:${Math.max(4, pct)}%" aria-hidden="true">🐴</span></div>
        <div class="goal" aria-hidden="true">🥕</div></div>
      <div class="ex" id="ex">${inner}</div>
      <div class="foot">${foot}</div>
    </div>`;
  }

  function renderStep() {
    const st = run.steps[run.i];
    if (!st) return finishLesson();
    run.settled = false;
    const view = STEPS[st.t](st);
    app.innerHTML = shell(view.html, view.foot || '');
    $('#quit').addEventListener('click', askQuit);
    bindSay($('#ex'));
    if (view.bind) view.bind();
    scrollTo(0, 0);
  }
  function next() { run.i += 1; renderStep(); }

  function askQuit() {
    const el = document.createElement('div');
    el.className = 'sheet neutral';
    el.innerHTML = `<div class="in"><div class="who"><span class="m" aria-hidden="true">🐰</span><h3>Vuoi smettere?</h3></div>
      <p class="note">Le parole che hai già fatto restano salvate.</p>
      <button class="btn go block" id="stay">Continuo a giocare</button><button class="btn ghost block" id="leave">Esco</button></div>`;
    document.body.appendChild(el);
    $('#stay').addEventListener('click', () => el.remove());
    $('#leave').addEventListener('click', () => { el.remove(); run = null; if (Voice.ok) speechSynthesis.cancel(); render(); });
  }

  function settle(it, ok, note) {
    if (run.settled) return;
    run.settled = true;
    run.answers += 1; if (ok) run.ok += 1;
    if (!run.graded.has(it.id)) {
      run.graded.add(it.id);
      ensureCard(it.id);
      S.cards[it.id] = SRS.grade(S.cards[it.id], ok, tick());
      save();
    }
    if (!ok && (run.again[it.id] || 0) < 2) {
      run.again[it.id] = (run.again[it.id] || 0) + 1;
      run.steps.splice(Math.min(run.steps.length, run.i + 3), 0, { t: KIDS.easyFor(it), id: it.id });
    }
    if (ok) { sfx.ok(); Voice.say(it.en); } else { sfx.no(); setTimeout(() => Voice.say(it.en), 350); }
    const ex = $('#ex'); if (ex) ex.classList.add('locked');
    $$('#ex button.opt, #ex .tile').forEach((b) => { b.disabled = true; });
    const el = document.createElement('div');
    el.className = 'sheet ' + (ok ? 'ok' : 'no');
    el.setAttribute('role', 'status');
    el.innerHTML = `<div class="in">
      <div class="who"><span class="m" aria-hidden="true">${pick(ok ? MASCOT_OK : MASCOT_NO)}</span><h3>${ok ? pick(PRAISE) : pick(SOFT)}</h3></div>
      ${note ? `<p class="note">${note}</p>` : ''}
      <div class="ans"><span aria-hidden="true">${it.em}</span> <b lang="en">${esc(it.en)}</b> = ${esc(it.it)}</div>
      ${ok ? '' : `<p class="note">si legge <b>${esc(it.pr)}</b></p>`}
      <button class="btn ${ok ? 'go' : 'primary'} block" id="next">Avanti</button></div>`;
    document.body.appendChild(el);
    $('#next').addEventListener('click', () => { el.remove(); next(); });
  }

  function bindOptions(it) {
    $$('#ex .opt').forEach((b) => b.addEventListener('click', () => {
      if (run.settled) return;
      const ok = b.dataset.id === it.id;
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) { const r = $(`#ex .opt[data-id="${CSS.escape(it.id)}"]`); if (r) r.classList.add('right'); }
      settle(it, ok);
    }));
  }
  const picOpts = (opts) => `<div class="options pics">${opts.map((o) => `<button class="opt" data-id="${o.id}" aria-label="${esc(o.it)}"><span class="e" aria-hidden="true">${o.em}</span>${esc(o.it)}</button>`).join('')}</div>`;
  const autoPlay = (it) => { const p = () => Voice.say(it.en); const b = $('#play'); if (b) b.addEventListener('click', p); setTimeout(p, 300); };

  const STEPS = {
    intro(st) {
      const it = byId[st.id];
      ensureCard(it.id);
      return {
        html: `<div class="kicker">${it.k === 'p' ? 'Una frase nuova!' : 'Una parola nuova!'}</div>
          <div class="pic-xl" aria-hidden="true">${it.em}</div>
          <div class="en-xl" lang="en">${esc(it.en)}</div>
          <div class="audio-row"><button class="audio-btn" data-say="${esc(it.en)}">${ICON.speaker}Ascolta</button>
            <button class="audio-btn" data-say="${esc(it.en)}" data-slow="1"><span aria-hidden="true">🐢</span>Piano</button></div>
          <div class="it-md">${esc(it.it)}</div>
          <div class="say">si legge <b>${esc(it.pr)}</b></div>
          ${it.hk ? `<div class="hook">${esc(it.hk)}</div>` : ''}`,
        foot: '<button class="btn go block" id="go">Ok, ho capito!</button>',
        bind() { setTimeout(() => Voice.say(it.en), 300); $('#go').addEventListener('click', () => { sfx.hop(); next(); }); },
      };
    },
    listen(st) {
      const it = byId[st.id];
      return {
        html: `<div class="kicker">Ascolta e tocca la figura giusta</div>
          <button class="play-big" id="play" aria-label="Ascolta">${ICON.speaker}</button>
          <button class="btn ghost" data-say="${esc(it.en)}" data-slow="1">🐢 Più piano</button>
          ${picOpts(shuffle([it, ...distractors(it, 2)]))}`,
        bind() { autoPlay(it); bindOptions(it); },
      };
    },
    en2pic(st) {
      const it = byId[st.id];
      return {
        html: `<div class="kicker">Quale figura è?</div>
          <div class="en-lg" lang="en">${esc(it.en)}</div>
          <div class="audio-row"><button class="audio-btn" data-say="${esc(it.en)}">${ICON.speaker}Ascolta</button></div>
          ${picOpts(shuffle([it, ...distractors(it, 2)]))}`,
        bind() { setTimeout(() => Voice.say(it.en), 300); bindOptions(it); },
      };
    },
    pic2en(st) {
      const it = byId[st.id];
      const opts = shuffle([it, ...distractors(it, 2)]);
      return {
        html: `<div class="kicker">Come si dice in inglese?</div>
          <div class="pic-lg" aria-hidden="true">${it.em}</div>
          <div class="it-md">${esc(it.it)}</div>
          <div class="options">${opts.map((o) => `<button class="opt" lang="en" data-id="${o.id}">${esc(o.en)}</button>`).join('')}</div>`,
        bind() { bindOptions(it); },
      };
    },
    listenP(st) {
      const it = byId[st.id];
      const opts = shuffle([it, ...distractors(it, 2)]);
      return {
        html: `<div class="kicker">Ascolta la frase: cosa vuol dire?</div>
          <button class="play-big" id="play" aria-label="Ascolta">${ICON.speaker}</button>
          <button class="btn ghost" data-say="${esc(it.en)}" data-slow="1">🐢 Più piano</button>
          <div class="options">${opts.map((o) => `<button class="opt" data-id="${o.id}" style="font-size:20px"><span aria-hidden="true">${o.em}</span> ${esc(o.it)}</button>`).join('')}</div>`,
        bind() { autoPlay(it); bindOptions(it); },
      };
    },
    spell(st) { return tileStep(byId[st.id], KIDS.letterTiles(byId[st.id].en, rng), '', 'Metti in ordine le lettere'); },
    build(st) {
      const it = byId[st.id];
      const words = SRS.tiles(it.en);
      let order = shuffle(words.slice());
      if (order.join(' ') === words.join(' ') && words.length > 1) order = order.reverse();
      return tileStep(it, order, ' ', 'Metti in ordine le parole');
    },
    match(st) {
      const list = st.ids.map((id) => byId[id]);
      const left = shuffle(list.slice()), right = shuffle(list.slice());
      return {
        html: `<div class="kicker">Trova le coppie!</div>
          <p class="say">Tocca una parola e poi la sua figura.</p>
          <div class="match">
            <div class="col">${left.map((o) => `<button class="mt" lang="en" data-side="l" data-id="${o.id}">${esc(o.en)}</button>`).join('')}</div>
            <div class="col">${right.map((o) => `<button class="mt" data-side="r" data-id="${o.id}" aria-label="${esc(o.it)}"><span class="e" aria-hidden="true">${o.em}</span></button>`).join('')}</div>
          </div>`,
        bind() {
          let sel = null, remaining = list.length;
          $$('#ex .mt').forEach((b) => b.addEventListener('click', () => {
            if (b.classList.contains('ok')) return;
            if (b.dataset.side === 'l') Voice.say(byId[b.dataset.id].en);
            if (!sel || sel.dataset.side === b.dataset.side) { if (sel) sel.classList.remove('sel'); sel = b; b.classList.add('sel'); return; }
            if (sel.dataset.id === b.dataset.id) {
              sel.classList.add('ok'); b.classList.add('ok'); sfx.ok(); sel = null; remaining -= 1;
              if (!remaining) {
                run.answers += 1; run.ok += 1;
                setTimeout(() => {
                  const el = document.createElement('div');
                  el.className = 'sheet ok';
                  el.innerHTML = `<div class="in"><div class="who"><span class="m" aria-hidden="true">🦄</span><h3>${pick(PRAISE)}</h3></div><p class="note">Tutte le coppie trovate!</p><button class="btn go block" id="next">Avanti</button></div>`;
                  document.body.appendChild(el);
                  $('#next').addEventListener('click', () => { el.remove(); next(); });
                }, 250);
              }
            } else {
              sfx.no();
              [sel, b].forEach((x) => { x.classList.remove('no'); void x.offsetWidth; x.classList.add('no'); });
              sel.classList.remove('sel'); sel = null;
            }
          }));
        },
      };
    },
  };

  /** Tessere da mettere in ordine: lettere per compitare, parole per le frasi. */
  function tileStep(it, pieces, joiner, title) {
    const chosen = [];
    const label = (w) => (joiner ? (['I', 'Babi'].includes(w) ? w : w.toLowerCase()) : w);
    return {
      html: `<div class="kicker">${title}</div>
        <div class="pic-lg" aria-hidden="true">${it.em}</div>
        <div class="it-md">${esc(it.it)}</div>
        <div class="audio-row"><button class="audio-btn" data-say="${esc(it.en)}">${ICON.speaker}Ascolta</button></div>
        <div class="build-ans" id="ans" aria-label="La tua risposta"></div>
        <div class="build-pool" id="pool">${pieces.map((w, i) => `<button class="tile" data-i="${i}" lang="en">${esc(label(w))}</button>`).join('')}</div>`,
      foot: '<button class="btn go block" id="check" disabled>Controlla</button>',
      bind() {
        const ans = $('#ans'), pool = $('#pool'), check = $('#check');
        const draw = () => {
          ans.innerHTML = chosen.map((i, k) => `<button class="tile" data-k="${k}" lang="en">${esc(label(pieces[i]))}</button>`).join('');
          $$('.tile', pool).forEach((b) => b.classList.toggle('used', chosen.includes(+b.dataset.i)));
          check.disabled = chosen.length !== pieces.length;
          $$('.tile', ans).forEach((b) => b.addEventListener('click', () => { if (!run.settled) { chosen.splice(+b.dataset.k, 1); draw(); } }));
        };
        $$('.tile', pool).forEach((b) => b.addEventListener('click', () => {
          if (run.settled || chosen.includes(+b.dataset.i)) return;
          chosen.push(+b.dataset.i); sfx.hop(); draw();
        }));
        check.addEventListener('click', () => {
          const said = chosen.map((i) => pieces[i]).join(joiner);
          const ok = SRS.normalize(said) === SRS.normalize(joiner ? it.en : it.en.toLowerCase());
          settle(it, ok, ok ? '' : `Hai scritto: ${esc(said)}`);
        });
        draw();
      },
    };
  }

  /* ---------------- Fine lezione ---------------- */
  function finishLesson() {
    const r = run; run = null;
    const st = KIDS.stars(r.answers, r.ok);
    let sticker = null;
    if (r.lesson) {
      const before = S.done[r.lesson.n];
      if (!before && S.stickers < KIDS.STICKERS.length) { sticker = KIDS.STICKERS[S.stickers]; S.stickers += 1; }
      S.done[r.lesson.n] = Math.max(before || 0, st);
    }
    S.tick = tick() + 1;
    S.lessonsPlayed = (S.lessonsPlayed || 0) + 1;
    save();
    sfx.win();
    const nl = allDone() ? null : nextLesson();
    const confetti = Array.from({ length: 18 }, (_, i) =>
      `<span style="left:${(i * 5.7) % 100}%;animation-duration:${2.6 + (i % 5) * 0.6}s;animation-delay:${(i % 6) * 0.2}s">${['🥕', '⭐', '🐰', '🐴', '💗', '🌸'][i % 6]}</span>`).join('');
    app.innerHTML = `<div class="confetti" aria-hidden="true">${confetti}</div>
      <div class="wrap done">
        <h1>${r.lesson ? `Lezione ${r.lesson.n} <span>finita!</span>` : 'Gioco libero <span>finito!</span>'}</h1>
        <div class="big-stars" aria-label="${st} stelle su 3">${starsHtml(st)}</div>
        <p class="lead">${st === 3 ? 'Perfetta! Stella la pony è fierissima di te.' : st === 2 ? 'Bravissima! Fiocco salta di gioia.' : 'Brava! Le parole difficili torneranno presto, così le impari.'}</p>
        ${sticker ? `<div class="sticker-won"><b>Nuova figurina!</b><div class="s" aria-hidden="true">${sticker}</div></div>` : ''}
        ${nl ? `<button class="btn go block" id="nextLesson">Lezione ${nl.n}, andiamo!</button>` : ''}
        <button class="btn soft block" id="back">Torna al percorso</button>
      </div>`;
    const n = $('#nextLesson'); if (n) n.addEventListener('click', () => startLesson(nl));
    $('#back').addEventListener('click', () => { tab = 'path'; render(); scrollTo(0, 0); });
  }

  render();
})();
