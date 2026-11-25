/* Hello Giupli: interfaccia. La logica del ripasso sta in srs.js, il corso in data.js. */
(() => {
  'use strict';
  const { levels, units, items } = window.COURSE;
  const SRS = window.SRS;
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const unitById = Object.fromEntries(units.map((u) => [u.id, u]));
  const levelByLv = Object.fromEntries(levels.map((l) => [l.lv, l]));
  // Prima voce di ogni capitolo: prima di presentarla arriva la regoletta del capitolo.
  const firstOfUnit = new Set(units.map((u) => (items.find((i) => i.u === u.id) || {}).id).filter(Boolean));
  const KEY = 'hello-giupli-v1';
  const app = document.getElementById('app');
  const rng = Math.random;
  const shuffle = (a) => SRS.shuffle(a, rng);
  const pick = (a) => a[Math.floor(rng() * a.length)];
  const today = () => SRS.dayNumber(new Date());
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  /* ---------------- Icone ---------------- */
  const HEART_PATH = 'M12 21.6 10.3 20C4.3 14.6.3 11 .3 6.6.3 3 3.1.3 6.7.3c2 0 4 .9 5.3 2.4C13.3 1.2 15.3.3 17.3.3 20.9.3 23.7 3 23.7 6.6c0 4.4-4 8-10 13.4L12 21.6Z';
  const ICON = {
    heart: (cls = '') => `<svg class="${cls}" viewBox="0 0 24 22" aria-hidden="true"><path d="${HEART_PATH}"/></svg>`,
    speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4ZM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6 6.4 5Z"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 11.5h3V21h5.5v-6h3v6H19v-9.5h3L12 3Z"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h11a3 3 0 0 1 3 3v15H7a2 2 0 0 1-2-2V3Zm2 15v1h10v-1H7Zm3-11v2h6V7h-6Z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m19.4 13 .1-1-.1-1 2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 0 0-1.7-1L15 3.3h-4l-.4 2.6c-.6.3-1.2.6-1.7 1l-2.5-1-2 3.5L6.5 11l-.1 1 .1 1-2.1 1.6 2 3.5 2.5-1c.5.4 1.1.7 1.7 1l.4 2.6h4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.5-2.1-1.6ZM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/></svg>',
  };

  /* ---------------- Stato salvato ---------------- */
  const defaults = () => ({ v: 1, cards: {}, days: {}, settings: { accent: 'en-GB', slow: false, sound: true } });
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && typeof s.cards === 'object') {
          const d = defaults();
          return { ...d, ...s, settings: { ...d.settings, ...(s.settings || {}) } };
        }
      }
    } catch (e) { /* storage non disponibile: si parte da zero */ }
    return defaults();
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignora */ } }
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { /* ignora */ }

  /* ---------------- Voce inglese ---------------- */
  const Voice = {
    list: [],
    ok: 'speechSynthesis' in window,
    load() { if (this.ok) this.list = speechSynthesis.getVoices() || []; },
    pick() {
      const pref = S.settings.accent;
      const norm = (v) => (v.lang || '').replace('_', '-');
      const en = this.list.filter((v) => /^en/i.test(norm(v)));
      return en.find((v) => norm(v) === pref && /enhanced|premium|natural/i.test(v.name))
        || en.find((v) => norm(v) === pref && v.localService)
        || en.find((v) => norm(v) === pref)
        || en[0] || null;
    },
    say(text, slow) {
      if (!this.ok) return;
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(SRS.forSpeech(text));
        const v = this.pick();
        if (v) u.voice = v;
        u.lang = v ? v.lang : S.settings.accent;
        u.rate = slow || S.settings.slow ? 0.6 : 0.88;
        u.onstart = () => $$('.play-big').forEach((b) => b.classList.add('playing'));
        u.onend = u.onerror = () => $$('.play-big').forEach((b) => b.classList.remove('playing'));
        speechSynthesis.speak(u);
      } catch (e) { /* ignora */ }
    },
  };
  Voice.load();
  if (Voice.ok) speechSynthesis.onvoiceschanged = () => Voice.load();

  /* ---------------- Suoni ---------------- */
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
    ok: () => { tone(880, 0.12, 'triangle', 0.12); tone(1320, 0.2, 'triangle', 0.1, 0.08); },
    no: () => tone(330, 0.25, 'sine', 0.08),
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, 'triangle', 0.1, i * 0.11)),
  };

  /* ---------------- Testi ---------------- */
  const PRAISE = ['Brava!', 'Bravissima!', 'Perfetto!', 'Giusto!', 'Che brava!', 'Esatto!', 'Sì, così!', 'Grande Giupli!', 'Ottimo!'];
  const SOFT = ['Quasi!', 'Niente paura', 'Ci siamo quasi', 'Succede a tutti', 'Tranquilla'];
  const DAYS = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const dateLabel = (d = new Date()) => `${cap(DAYS[d.getDay()])} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  /* ---------------- Utilità del corso ---------------- */
  const card = (id) => S.cards[id];
  const introduced = () => items.filter((it) => S.cards[it.id]);
  const learnedCount = () => items.filter((it) => SRS.isLearned(S.cards[it.id])).length;
  function ensureCard(id) { if (!S.cards[id]) { S.cards[id] = SRS.newCard(today()); save(); } }
  const firstWord = (s) => s.split(/[ ,(]/)[0].toLowerCase();

  /** Scelte sbagliate plausibili: prima parole già viste, poi dello stesso capitolo. Mai sinonimi o parole che suonano uguali. */
  function distractors(it, n) {
    const ok = (x) => x.id !== it.id && !!x.k === !!it.k && x.pr !== it.pr && firstWord(x.it) !== firstWord(it.it) && x.en.toLowerCase() !== it.en.toLowerCase();
    const pool = items.filter(ok);
    const known = shuffle(pool.filter((x) => S.cards[x.id]));
    const unit = shuffle(pool.filter((x) => x.u === it.u));
    const rest = shuffle(pool.slice());
    const out = [];
    for (const x of [...known, ...unit, ...rest]) { if (!out.includes(x)) out.push(x); if (out.length >= n) break; }
    return out;
  }

  function heartsHtml(c) {
    const m = SRS.mastery(c);
    return `<div class="hearts" aria-label="${m} su 5">${[0, 1, 2, 3, 4].map((i) => ICON.heart(i < m ? 'on' : '')).join('')}</div>`;
  }
  const audioBtns = (text) => `<div class="audio-row">
      <button class="audio-btn" data-say="${esc(text)}">${ICON.speaker}Ascolta</button>
      <button class="audio-btn" data-say="${esc(text)}" data-slow="1"><span aria-hidden="true">🐢</span>Piano</button>
    </div>`;
  function bindSay(root = document) {
    $$('[data-say]', root).forEach((b) => b.addEventListener('click', () => Voice.say(b.dataset.say, b.dataset.slow === '1')));
  }

  /* ---------------- Navigazione ---------------- */
  let tab = 'home';
  let run = null;

  function render() {
    if (run) return renderStep();
    if (tab === 'words') return renderWords();
    if (tab === 'settings') return renderSettings();
    return renderHome();
  }
  function tabbar() {
    const b = (id, label, icon) => `<button data-tab="${id}" ${tab === id ? 'aria-current="page"' : ''}>${icon}<span>${label}</span></button>`;
    return `<div class="tabbar"><nav>${b('home', 'Oggi', ICON.home)}${b('words', 'Le mie parole', ICON.book)}${b('settings', 'Impostazioni', ICON.gear)}</nav></div>`;
  }
  function bindTabs() {
    $$('[data-tab]').forEach((b) => b.addEventListener('click', () => { tab = b.dataset.tab; render(); scrollTo(0, 0); }));
  }

  /* ---------------- Oggi ---------------- */
  function renderHome() {
    const t = today();
    const done = !!(S.days[t] && S.days[t].done);
    const plan = SRS.planSession(S, items, t);
    const first = introduced().length === 0;
    const st = SRS.streak(S, t);
    const learned = learnedCount();
    const inProgress = introduced().length - learned;

    let lesson;
    if (!done) {
      const minutes = Math.max(5, Math.round((plan.fresh.length * 5 + plan.review.length) * 0.4));
      lesson = `<section class="today">
        <h2>${first ? 'La tua prima lezione' : 'La lezione di oggi'}</h2>
        <p>${first ? 'Iniziamo dalle basi: poche parole, tanti piccoli giochi. Nessuna fretta.' : 'Un po\' di ripasso e qualche parola nuova. Piano piano.'}</p>
        <div class="chips">
          <span class="chip">circa ${minutes} minuti</span>
          ${plan.fresh.length ? `<span class="chip">${plural(plan.fresh.length, 'novità', 'novità')}</span>` : ''}
          ${plan.review.length ? `<span class="chip">${plural(plan.review.length, 'ripasso', 'ripassi')}</span>` : ''}
        </div>
        <button class="btn white block" id="start">Inizia</button>
      </section>`;
    } else {
      lesson = `<section class="today">
        <h2>Fatto anche oggi!</h2>
        <p>Le parole si fissano meglio dormendoci sopra. Ci vediamo domani.</p>
        ${introduced().length ? '<button class="btn white block" id="extra">Ripasso extra, 3 minuti</button>' : ''}
      </section>`;
    }

    const missed = SRS.missedDay(S, t);
    const missedName = missed === null ? '' : missed === t - 1 ? 'ieri' : DAYS[new Date(missed * 86400000).getUTCDay()];
    const recover = missed === null ? '' : `<section class="card recover">
        <h3>Hai saltato ${missed === t - 1 ? 'ieri' : esc(missedName)}?</h3>
        <p>Nessun problema. Con un ripasso di 5 minuti recuperi il giorno: il suo cuore si accende e i giorni di fila tornano. Puoi recuperare un giorno al giorno, fino a una settimana indietro.</p>
        <button class="btn soft block" id="recover">Recupera ${esc(missedName)}</button>
      </section>`;

    const now = new Date();
    const dow = (now.getDay() + 6) % 7;
    const week = ['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((l, i) => {
      const d = t - dow + i;
      const ok = S.days[d] && S.days[d].done;
      const rec = ok && S.days[d].recovered;
      return `<div class="day ${ok ? 'lit' : ''} ${rec ? 'rec' : ''} ${d === t ? 'today-mark' : ''}" ${rec ? 'title="Giorno recuperato"' : ''}>${ICON.heart()}<span>${l}</span></div>`;
    }).join('');
    const weekNote = st >= 2 ? `<b>${st} giorni di fila.</b> Continua così!`
      : st === 1 ? 'Un giorno alla volta: è così che si impara.'
      : first ? 'Ogni lezione fatta accende un cuore.' : 'Bentornata! Riprendiamo da dove eri rimasta.';

    const nextUnit = plan.fresh.length ? byId[plan.fresh[0]].u : null;
    let lastLv = null;
    const path = units.map((u) => {
      const list = items.filter((x) => x.u === u.id);
      const seen = list.filter((x) => S.cards[x.id]).length;
      const lrn = list.filter((x) => SRS.isLearned(S.cards[x.id])).length;
      const cls = lrn === list.length ? 'done' : (seen > 0 || u.id === nextUnit) ? 'now' : 'locked';
      const badge = cls === 'done' ? 'Imparato' : cls === 'now' ? 'In corso' : '';
      let head = '';
      if (u.lv !== lastLv) {
        const lv = levelByLv[u.lv];
        const lvItems = items.filter((x) => unitById[x.u].lv === u.lv);
        const started = lvItems.some((x) => S.cards[x.id]);
        head = `<div class="level-banner lv${u.lv} ${started || u.lv === 1 ? '' : 'closed'}"><span class="le" aria-hidden="true">${lv.em}</span>
          <div><small>Livello ${u.lv}</small><b>${esc(lv.title)}</b>${started || u.lv === 1 ? '' : `<em>Arriva dopo il livello ${u.lv - 1}: ${lvItems.length} parole e frasi nuove</em>`}</div></div>`;
        lastLv = u.lv;
      }
      return head + `<div class="unit ${cls}"><div class="ue" aria-hidden="true">${u.em}</div>
        <div class="ut"><b>${esc(u.title)}</b><span>${esc(u.sub)}</span><div class="bar"><i style="width:${Math.round((lrn / list.length) * 100)}%"></i></div></div>
        <div class="badge">${badge}</div></div>`;
    }).join('');

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const standalone = window.navigator.standalone || matchMedia('(display-mode: standalone)').matches;
    const inFrame = window.self !== window.top;
    const install = isIOS && !standalone && !inFrame ? `<div class="install"><b>Mettila sul telefono come un'app</b>In Safari tocca il tasto Condividi, poi "Aggiungi alla schermata Home".</div>` : '';

    app.innerHTML = `<div class="wrap screen">
      <header>
        <div class="eyebrow">${dateLabel(now)}</div>
        <h1 class="hello">Hello, <span>Giupli!</span></h1>
        <p class="lead">${first ? 'Qui impari l\'inglese con calma, 10 minuti al giorno.' : 'Ciao! Pronta per il tuo inglese di oggi?'}</p>
      </header>
      ${install}
      ${lesson}
      ${recover}
      <section class="card"><div class="week">${week}</div><p class="week-note">${weekNote}</p></section>
      <section class="stats">
        <div class="stat"><b>${learned}</b><span>parole che sai</span></div>
        <div class="stat"><b>${inProgress}</b><span>in allenamento</span></div>
      </section>
      <h2 class="section">Il tuo percorso</h2>
      <section class="path">${path}</section>
    </div>${tabbar()}`;
    bindTabs();
    const s = $('#start'); if (s) s.addEventListener('click', () => startSession('normal'));
    const x = $('#extra'); if (x) x.addEventListener('click', () => startSession('extra'));
    const rc = $('#recover'); if (rc) rc.addEventListener('click', () => startSession('recover', missed));
  }

  /* ---------------- Le mie parole ---------------- */
  function renderWords() {
    const groups = units.map((u) => {
      const list = items.filter((x) => x.u === u.id && S.cards[x.id]);
      if (!list.length) return '';
      return `<div class="group-title">${u.em} ${esc(u.title)}</div>` + list.map((it) => `
        <div class="word-row"><div class="e" aria-hidden="true">${it.em}</div>
          <div class="w"><b>${esc(it.en)}</b><span>${esc(it.it)} · si legge ${esc(it.pr)}</span>${heartsHtml(card(it.id))}</div>
          <button class="speak" data-say="${esc(it.en)}" aria-label="Ascolta ${esc(it.en)}">${ICON.speaker}</button></div>`).join('');
    }).join('');
    app.innerHTML = `<div class="wrap screen">
      <header><div class="eyebrow">Il tuo dizionario</div><h1 class="hello">Le mie <span>parole</span></h1>
      ${(() => { const seen = units.filter((u) => items.some((x) => x.u === u.id && S.cards[x.id])); return seen.length ? `<details class="rules"><summary>Le regolette (${seen.length})</summary><div class="rules-list">${seen.map(tipCard).join('')}</div></details>` : ''; })()}
      <p class="lead">I cuori mostrano quanto le ricordi. Tocca l'altoparlante per riascoltarle.</p></header>
      ${groups ? `<section class="learned-list">${groups}</section>` : `<div class="empty"><div class="e" aria-hidden="true">🌱</div><p>Qui compariranno le parole che impari. Fai la prima lezione dalla scheda Oggi.</p></div>`}
    </div>${tabbar()}`;
    bindTabs(); bindSay();
  }

  /* ---------------- Impostazioni ---------------- */
  function renderSettings() {
    const s = S.settings;
    const voice = Voice.pick();
    app.innerHTML = `<div class="wrap screen">
      <header><div class="eyebrow">Impostazioni</div><h1 class="hello">Come la <span>vuoi tu</span></h1></header>
      <section class="card setting">
        <h3>Accento della voce</h3>
        <div class="seg">
          <button data-accent="en-GB" aria-pressed="${s.accent === 'en-GB'}">Inglese (UK)</button>
          <button data-accent="en-US" aria-pressed="${s.accent === 'en-US'}">Americano (US)</button>
        </div>
        <div class="toggle"><div><h3>Voce sempre lenta</h3><p>Utile all'inizio per sentire bene ogni suono.</p></div>
          <button class="switch" role="switch" id="slow" aria-checked="${s.slow}" aria-label="Voce sempre lenta"></button></div>
        <div class="toggle"><div><h3>Suonini</h3><p>Il "ding" quando rispondi.</p></div>
          <button class="switch" role="switch" id="sound" aria-checked="${s.sound}" aria-label="Suonini"></button></div>
        <button class="btn soft" data-say="Hello Giupli! How are you today?">${ICON.speaker}Prova la voce</button>
        <p>${voice ? 'Voce in uso: ' + esc(voice.name) : Voice.ok ? 'La voce inglese si carica al primo ascolto.' : 'Questo browser non legge ad alta voce: usa la pronuncia scritta.'}</p>
      </section>
      <section class="card setting">
        <h3>Salva i tuoi progressi</h3>
        <p>I progressi restano su questo telefono. Se cambi telefono, copia questo codice e incollalo nella nuova app.</p>
        <textarea id="backup" readonly aria-label="Codice di salvataggio"></textarea>
        <button class="btn soft" id="copy">Copia il codice</button>
        <h3>Ripristina da un codice</h3>
        <textarea id="restore" placeholder="Incolla qui il codice" aria-label="Codice da ripristinare"></textarea>
        <button class="btn soft" id="doRestore">Ripristina</button>
        <div class="msg" id="msg" role="status"></div>
      </section>
      <section class="card setting">
        <h3>Ricomincia da zero</h3>
        <p>Cancella tutte le parole imparate e i giorni fatti.</p>
        <button class="btn ghost danger" id="reset">Cancella i progressi</button>
        <div id="resetConfirm" hidden class="setting">
          <p><b>Sei sicura?</b> Non si può annullare.</p>
          <div class="row-btns"><button class="btn soft" id="resetNo">No, lascia stare</button><button class="btn primary" id="resetYes">Sì, cancella</button></div>
        </div>
      </section>
    </div>${tabbar()}`;
    bindTabs(); bindSay();
    const enc = () => btoa(unescape(encodeURIComponent(JSON.stringify(S))));
    $('#backup').value = enc();
    const msg = (t, err) => { const m = $('#msg'); m.textContent = t; m.classList.toggle('err', !!err); };
    $$('[data-accent]').forEach((b) => b.addEventListener('click', () => { S.settings.accent = b.dataset.accent; save(); renderSettings(); Voice.say('Hello Giupli!'); }));
    $('#slow').addEventListener('click', () => { S.settings.slow = !S.settings.slow; save(); renderSettings(); });
    $('#sound').addEventListener('click', () => { S.settings.sound = !S.settings.sound; save(); renderSettings(); if (S.settings.sound) sfx.ok(); });
    $('#copy').addEventListener('click', () => {
      const ta = $('#backup');
      navigator.clipboard.writeText(ta.value).then(() => msg('Codice copiato.'), () => { ta.select(); msg('Seleziona il testo e copialo a mano.', true); });
    });
    $('#doRestore').addEventListener('click', () => {
      try {
        const data = JSON.parse(decodeURIComponent(escape(atob($('#restore').value.trim()))));
        if (!data || typeof data.cards !== 'object') throw new Error('formato');
        const d = defaults();
        S = { ...d, ...data, settings: { ...d.settings, ...(data.settings || {}) } }; save();
        renderSettings(); msg('Progressi ripristinati.');
      } catch (e) { msg('Il codice non è valido. Controlla di averlo copiato tutto.', true); }
    });
    $('#reset').addEventListener('click', () => { $('#resetConfirm').hidden = false; });
    $('#resetNo').addEventListener('click', () => { $('#resetConfirm').hidden = true; });
    $('#resetYes').addEventListener('click', () => { const keep = S.settings; S = defaults(); S.settings = keep; save(); tab = 'home'; render(); });
  }

  /* ---------------- Lezione ---------------- */
  function startSession(mode, recoverDay) {
    const t = today();
    let plan = SRS.planSession(S, items, t, { mode: mode === 'recover' ? 'extra' : mode });
    if (!plan.fresh.length && !plan.review.length) plan = SRS.planSession(S, items, t, { mode: 'extra' });
    const steps = SRS.buildSteps(plan, S, byId, rng, { firstOfUnit });
    run = { mode, plan, steps, i: 0, graded: new Set(), answers: 0, ok: 0, again: {}, start: Date.now(), day: t, recoverDay };
    Voice.say(''); // sblocca la voce su iPhone dentro il tocco
    renderStep();
  }

  function shell(inner, foot = '') {
    const pct = Math.round((run.i / run.steps.length) * 100);
    return `<div class="wrap lesson">
      <div class="topbar"><button class="icon-btn" id="quit" aria-label="Esci dalla lezione">${ICON.close}</button>
        <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
        <div class="count">${run.i + 1}/${run.steps.length}</div></div>
      <div class="ex" id="ex">${inner}</div>
      <div class="foot">${foot}</div>
    </div>`;
  }

  function renderStep() {
    const st = run.steps[run.i];
    if (!st) return finishSession();
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
    const left = run.steps.length - run.i;
    const el = document.createElement('div');
    el.className = 'sheet neutral';
    el.innerHTML = `<div class="in"><h3>Ti fermi qui?</h3>
      <p class="note">Quello che hai fatto è già salvato. ${run.mode === 'normal' ? `Per finire la lezione di oggi mancano ${plural(left, 'esercizio', 'esercizi')}.` : ''}</p>
      <button class="btn primary block" id="stay">Continuo</button><button class="btn ghost block" id="leave">Esco</button></div>`;
    document.body.appendChild(el);
    $('#stay').addEventListener('click', () => el.remove());
    $('#leave').addEventListener('click', () => { el.remove(); run = null; if (Voice.ok) speechSynthesis.cancel(); render(); });
  }

  /** Registra la risposta. Solo il primo tentativo del giorno cambia la memoria della parola. */
  function settle(it, ok, note) {
    if (run.settled) return;
    run.settled = true;
    run.answers += 1; if (ok) run.ok += 1;
    if (!run.graded.has(it.id)) {
      run.graded.add(it.id);
      ensureCard(it.id);
      if (run.mode === 'normal' || !ok) S.cards[it.id] = SRS.grade(S.cards[it.id], ok, today());
      save();
    }
    if (!ok) {
      const n = run.again[it.id] || 0;
      if (n < 2) {
        run.again[it.id] = n + 1;
        const at = Math.min(run.steps.length, run.i + 3);
        run.steps.splice(at, 0, { t: SRS.easyFor(it), id: it.id, again: true });
      }
    }
    if (ok) { sfx.ok(); Voice.say(it.en); } else { sfx.no(); setTimeout(() => Voice.say(it.en), 350); }
    const ex = $('#ex'); if (ex) ex.classList.add('locked');
    $$('#ex button.opt, #ex .tile, #ex input').forEach((b) => { b.disabled = true; });
    const el = document.createElement('div');
    el.className = 'sheet ' + (ok ? 'ok' : 'no');
    el.setAttribute('role', 'status');
    el.innerHTML = `<div class="in">
      <h3>${ok ? pick(PRAISE) : pick(SOFT)}</h3>
      ${note ? `<p class="note">${note}</p>` : ''}
      ${ok ? '' : '<div class="lbl">La risposta giusta</div>'}
      <div class="ans"><b>${esc(it.en)}</b> = ${esc(it.it)}</div>
      ${ok ? '' : `<div class="say">si legge <b>${esc(it.pr)}</b></div>`}
      ${!ok && it.hk ? `<div class="hook"><span>Trucco per ricordarla</span>${esc(it.hk)}</div>` : ''}
      ${!ok ? '<p class="note">La ritroverai tra poco, così si fissa.</p>' : ''}
      <button class="btn primary block" id="next">Avanti</button></div>`;
    document.body.appendChild(el);
    const go = () => { el.remove(); next(); };
    $('#next').addEventListener('click', go);
    $('#next').focus({ preventScroll: true });
  }

  /** Opzioni a scelta: la risposta arriva al tocco, senza un secondo pulsante. */
  function bindOptions(it, onPick) {
    $$('#ex .opt').forEach((b) => b.addEventListener('click', () => {
      if (run.settled) return;
      const ok = b.dataset.id === it.id;
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) { const r = $(`#ex .opt[data-id="${CSS.escape(it.id)}"]`); if (r) r.classList.add('right'); }
      if (onPick) onPick(b.dataset.id);
      settle(it, ok);
    }));
  }

  /** Regoletta del capitolo con esempi da ascoltare. */
  function tipCard(u) {
    const t = u.tip;
    return `<div class="tip-card"><div class="tip-head"><span aria-hidden="true">${u.em}</span><b>${esc(t.title)}</b></div>
      <p>${esc(t.text)}</p>
      <div class="tip-ex">${t.ex.map(([en, it]) => `<button class="ex-row" data-say="${esc(en)}">${ICON.speaker}<b lang="en">${esc(en)}</b><span>${esc(it)}</span></button>`).join('')}</div></div>`;
  }

  /** Tessere per comporre una frase. extra: parole in più da scartare. */
  function tilesStep(it, extra, title) {
    const words = SRS.tiles(it.en);
    const pieces = words.concat(extra);
    let order = shuffle(pieces.map((w, i) => i));
    if (!extra.length && order.every((v, i) => v === i) && pieces.length > 1) order = order.reverse();
    const chosen = [];
    const label = (w) => (['I', 'Giupli', 'Italy', 'Italian', 'English', 'London'].includes(w) ? w : w.toLowerCase());
    return {
      html: `<div class="kicker">${title}</div>
        <div class="emoji-lg" aria-hidden="true">${it.em}</div>
        <div class="it-lg">${esc(it.it)}</div>
        ${extra.length ? '<p class="say">Attenta: ci sono parole in più!</p>' : ''}
        <div class="build-ans" id="ans" aria-label="La tua frase"></div>
        <div class="build-pool" id="pool">${order.map((i) => `<button class="tile" data-i="${i}" lang="en">${esc(label(pieces[i]))}</button>`).join('')}</div>`,
      foot: `<button class="btn primary block" id="check" disabled>Controlla</button>`,
      bind() {
        const ans = $('#ans'), pool = $('#pool'), check = $('#check');
        const draw = () => {
          ans.innerHTML = chosen.map((i, k) => `<button class="tile" data-k="${k}" lang="en">${esc(label(pieces[i]))}</button>`).join('');
          $$('.tile', pool).forEach((b) => b.classList.toggle('used', chosen.includes(+b.dataset.i)));
          check.disabled = extra.length ? chosen.length === 0 : chosen.length !== words.length;
          $$('.tile', ans).forEach((b) => b.addEventListener('click', () => { if (run.settled) return; chosen.splice(+b.dataset.k, 1); draw(); }));
        };
        $$('.tile', pool).forEach((b) => b.addEventListener('click', () => {
          if (run.settled || chosen.includes(+b.dataset.i)) return;
          chosen.push(+b.dataset.i); draw();
        }));
        check.addEventListener('click', () => {
          const said = chosen.map((i) => pieces[i]).join(' ');
          const ok = SRS.normalize(said) === SRS.normalize(it.en);
          settle(it, ok, ok ? '' : `Hai composto: ${esc(said)}`);
        });
        draw();
      },
    };
  }

  /** Parole plausibili da aggiungere come trappola: prese dalle altre frasi, mai già presenti in questa. */
  function extraWords(it, n) {
    const own = new Set(SRS.tiles(it.en).map((w) => w.toLowerCase()));
    const pool = [];
    items.forEach((x) => { if (x.k === 'p' && x.id !== it.id) SRS.tiles(x.en).forEach((w) => { const lw = w.toLowerCase(); if (!own.has(lw) && !pool.includes(lw)) pool.push(lw); }); });
    return shuffle(pool).slice(0, n);
  }

  const STEPS = {
    tip(st) {
      const u = unitById[st.u];
      return {
        html: `<div class="kicker">Regoletta · ${esc(u.title)}</div>
          <div class="emoji-xl" aria-hidden="true">💡</div>
          ${tipCard(u)}`,
        foot: '<button class="btn primary block" id="go">Ho capito</button>',
        bind() { setTimeout(() => Voice.say(u.tip.ex[0][0]), 300); $('#go').addEventListener('click', next); },
      };
    },

    buildX(st) { const it = byId[st.id]; return tilesStep(it, extraWords(it, 2), 'Componi la frase'); },

    gap(st) {
      const it = byId[st.id];
      const words = SRS.tiles(it.en);
      const k = SRS.gapIndex(it.en);
      const answer = words[k].toLowerCase();
      const pool = [];
      items.forEach((x) => SRS.tiles(x.en).forEach((w) => { const lw = w.toLowerCase(); if (lw !== answer && w.length >= 3 && !pool.includes(lw)) pool.push(lw); }));
      const opts = shuffle([answer, ...shuffle(pool).slice(0, 2)]);
      const keepCase = (w, i) => (i === 0 || ['I', 'Italy', 'Italian', 'English', 'London', 'Giupli'].includes(w) ? w : w.toLowerCase());
      const shown = words.map((w, i) => (i === k ? '<span class="blank">?</span>' : esc(keepCase(w, i)))).join(' ');
      return {
        html: `<div class="kicker">Completa la frase</div>
          <div class="emoji-lg" aria-hidden="true">${it.em}</div>
          <div class="it-lg">${esc(it.it)}</div>
          <div class="gap-line" lang="en">${shown}</div>
          <div class="options">${opts.map((w) => `<button class="opt en" lang="en" data-word="${esc(w)}">${esc(w)}</button>`).join('')}</div>`,
        bind() {
          $$('#ex [data-word]').forEach((b) => b.addEventListener('click', () => {
            if (run.settled) return;
            const ok = b.dataset.word === answer;
            b.classList.add(ok ? 'right' : 'wrong');
            if (!ok) { const r = $$('#ex [data-word]').find((x) => x.dataset.word === answer); if (r) r.classList.add('right'); }
            const blank = $('#ex .blank'); if (blank) { blank.textContent = answer; blank.classList.add('filled'); }
            settle(it, ok);
          }));
        },
      };
    },

    dictation(st) {
      const it = byId[st.id];
      return {
        html: `<div class="kicker">Dettato: ascolta e scrivi</div>
          <button class="play-big" id="play" aria-label="Ascolta">${ICON.speaker}</button>
          <button class="btn ghost" data-say="${esc(it.en)}" data-slow="1">🐢 Ascolta piano</button>
          <div class="field"><input id="answer" lang="en" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="Scrivi quello che senti, in inglese">
          <div class="hint" id="hint">Scrivi in inglese quello che senti. Non servono maiuscole né punteggiatura.</div></div>`,
        foot: `<div class="row-btns"><button class="btn soft" id="help">Aiutino</button><button class="btn soft" id="dunno">Non lo so</button></div>
          <button class="btn primary block" id="check">Controlla</button>`,
        bind() {
          const inp = $('#answer');
          const p = () => Voice.say(it.en);
          $('#play').addEventListener('click', p); setTimeout(p, 300);
          $('#help').addEventListener('click', () => { $('#hint').innerHTML = `Vuol dire: <b>${esc(it.it)}</b>`; Voice.say(it.en, true); });
          $('#dunno').addEventListener('click', () => settle(it, false));
          const check = () => {
            if (run.settled) return;
            if (!inp.value.trim()) { inp.focus(); return; }
            const r = SRS.checkTyped(inp.value, it.en);
            if (r === 'exact') settle(it, true);
            else if (r === 'close') settle(it, true, `Quasi perfetto! Si scrive <b>${esc(it.en)}</b>.`);
            else settle(it, false, `Hai scritto: ${esc(inp.value)}`);
          };
          $('#check').addEventListener('click', check);
          inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
        },
      };
    },

    intro(st) {
      const it = byId[st.id];
      ensureCard(it.id);
      return {
        html: `<div class="kicker">${it.k === 'p' ? 'Frase nuova' : 'Parola nuova'}</div>
          <div class="emoji-xl" aria-hidden="true">${it.em}</div>
          <div class="en-xl" lang="en">${esc(it.en)}</div>
          ${audioBtns(it.en)}
          <div class="say">si legge <b>${esc(it.pr)}</b></div>
          <div class="mean">${esc(it.it)}</div>
          ${it.hk ? `<div class="hook"><span>Trucco per ricordarla</span>${esc(it.hk)}</div>` : ''}`,
        foot: '<button class="btn primary block" id="go">Ho capito</button>',
        bind() { setTimeout(() => Voice.say(it.en), 250); $('#go').addEventListener('click', next); },
      };
    },

    listen(st) {
      const it = byId[st.id];
      const opts = shuffle([it, ...distractors(it, 2)]);
      return {
        html: `<div class="kicker">Ascolta e scegli</div>
          <button class="play-big" id="play" aria-label="Ascolta">${ICON.speaker}</button>
          <button class="btn ghost" data-say="${esc(it.en)}" data-slow="1">🐢 Ascolta piano</button>
          <div class="options pics">${opts.map((o) => `<button class="opt" data-id="${o.id}"><span class="e" aria-hidden="true">${o.em}</span>${esc(o.it)}</button>`).join('')}</div>`,
        bind() { const p = () => Voice.say(it.en); $('#play').addEventListener('click', p); setTimeout(p, 250); bindOptions(it); },
      };
    },

    listenP(st) {
      const it = byId[st.id];
      const opts = shuffle([it, ...distractors(it, 2)]);
      return {
        html: `<div class="kicker">Ascolta la frase</div>
          <button class="play-big" id="play" aria-label="Ascolta">${ICON.speaker}</button>
          <button class="btn ghost" data-say="${esc(it.en)}" data-slow="1">🐢 Ascolta piano</button>
          <p class="say">Cosa vuol dire?</p>
          <div class="options">${opts.map((o) => `<button class="opt" data-id="${o.id}">${esc(o.it)}</button>`).join('')}</div>`,
        bind() { const p = () => Voice.say(it.en); $('#play').addEventListener('click', p); setTimeout(p, 250); bindOptions(it); },
      };
    },

    enIt(st) {
      const it = byId[st.id];
      const opts = shuffle([it, ...distractors(it, 2)]);
      return {
        html: `<div class="kicker">Cosa vuol dire?</div>
          <div class="en-lg" lang="en">${esc(it.en)}</div>
          <div class="audio-row"><button class="audio-btn" data-say="${esc(it.en)}">${ICON.speaker}Ascolta</button></div>
          <div class="options">${opts.map((o) => `<button class="opt" data-id="${o.id}">${esc(o.it)}</button>`).join('')}</div>`,
        bind() { setTimeout(() => Voice.say(it.en), 250); bindOptions(it); },
      };
    },

    itEn(st) {
      const it = byId[st.id];
      const opts = shuffle([it, ...distractors(it, 2)]);
      return {
        html: `<div class="kicker">Come si dice in inglese?</div>
          <div class="emoji-lg" aria-hidden="true">${it.em}</div>
          <div class="it-lg">${esc(it.it)}</div>
          <div class="options">${opts.map((o) => `<button class="opt en" lang="en" data-id="${o.id}">${esc(o.en)}</button>`).join('')}</div>`,
        bind() { bindOptions(it); },
      };
    },

    type(st) {
      const it = byId[st.id];
      let hints = 0;
      return {
        html: `<div class="kicker">Scrivilo in inglese</div>
          <div class="emoji-lg" aria-hidden="true">${it.em}</div>
          <div class="it-lg">${esc(it.it)}</div>
          <div class="field"><input id="answer" lang="en" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="La tua risposta in inglese">
          <div class="hint" id="hint">Si legge <b>${esc(it.pr)}</b></div></div>`,
        foot: `<div class="row-btns"><button class="btn soft" id="help">Aiutino</button><button class="btn soft" id="dunno">Non lo so</button></div>
          <button class="btn primary block" id="check">Controlla</button>`,
        bind() {
          const inp = $('#answer');
          setTimeout(() => inp.focus(), 200);
          $('#help').addEventListener('click', () => {
            hints = Math.min(hints + 1, Math.max(1, it.en.length - 1));
            $('#hint').innerHTML = `Inizia con <b>${esc(it.en.slice(0, hints))}${'_'.repeat(Math.max(0, it.en.length - hints))}</b>`;
            Voice.say(it.en, true);
          });
          $('#dunno').addEventListener('click', () => settle(it, false));
          const check = () => {
            if (run.settled) return;
            const r = SRS.checkTyped(inp.value, it.en);
            if (!inp.value.trim()) { inp.focus(); return; }
            if (r === 'exact') settle(it, true);
            else if (r === 'close') settle(it, true, `Quasi perfetto! Si scrive <b>${esc(it.en)}</b>.`);
            else settle(it, false, `Hai scritto: ${esc(inp.value)}`);
          };
          $('#check').addEventListener('click', check);
          inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
        },
      };
    },

    build(st) {
      const it = byId[st.id];
      const words = SRS.tiles(it.en);
      let order = shuffle(words.map((w, i) => i));
      if (order.every((v, i) => v === i) && words.length > 1) order = order.reverse();
      const chosen = [];
      const label = (w) => (['I', 'Giupli'].includes(w) ? w : w.toLowerCase());
      return {
        html: `<div class="kicker">Componi la frase</div>
          <div class="emoji-lg" aria-hidden="true">${it.em}</div>
          <div class="it-lg">${esc(it.it)}</div>
          <div class="build-ans" id="ans" aria-label="La tua frase"></div>
          <div class="build-pool" id="pool">${order.map((i) => `<button class="tile" data-i="${i}" lang="en">${esc(label(words[i]))}</button>`).join('')}</div>`,
        foot: '<button class="btn primary block" id="check" disabled>Controlla</button>',
        bind() {
          const ans = $('#ans'), pool = $('#pool'), check = $('#check');
          const draw = () => {
            ans.innerHTML = chosen.map((i, k) => `<button class="tile" data-k="${k}" lang="en">${esc(label(words[i]))}</button>`).join('');
            $$('.tile', pool).forEach((b) => b.classList.toggle('used', chosen.includes(+b.dataset.i)));
            check.disabled = chosen.length !== words.length;
            $$('.tile', ans).forEach((b) => b.addEventListener('click', () => { if (run.settled) return; chosen.splice(+b.dataset.k, 1); draw(); }));
          };
          $$('.tile', pool).forEach((b) => b.addEventListener('click', () => {
            if (run.settled || chosen.includes(+b.dataset.i)) return;
            chosen.push(+b.dataset.i); draw();
          }));
          check.addEventListener('click', () => {
            const said = chosen.map((i) => words[i]).join(' ');
            settle(it, SRS.normalize(said) === SRS.normalize(it.en), SRS.normalize(said) === SRS.normalize(it.en) ? '' : `Hai composto: ${esc(said)}`);
          });
          draw();
        },
      };
    },

    match(st) {
      const list = st.ids.map((id) => byId[id]);
      const left = shuffle(list.slice()), right = shuffle(list.slice());
      return {
        html: `<div class="kicker">Trova le coppie</div>
          <p class="say">Tocca una parola inglese e poi il suo significato.</p>
          <div class="match">
            <div class="col">${left.map((o) => `<button class="mt en" lang="en" data-side="l" data-id="${o.id}">${esc(o.en)}</button>`).join('')}</div>
            <div class="col">${right.map((o) => `<button class="mt" data-side="r" data-id="${o.id}"><span class="e" aria-hidden="true">${o.em}</span>${esc(o.it)}</button>`).join('')}</div>
          </div>`,
        bind() {
          let sel = null, left = list.length;
          $$('#ex .mt').forEach((b) => b.addEventListener('click', () => {
            if (b.classList.contains('ok')) return;
            if (b.dataset.side === 'l') Voice.say(byId[b.dataset.id].en);
            if (!sel || sel.dataset.side === b.dataset.side) {
              if (sel) sel.classList.remove('sel');
              sel = b; b.classList.add('sel'); return;
            }
            if (sel.dataset.id === b.dataset.id) {
              sel.classList.add('ok'); b.classList.add('ok'); sfx.ok(); sel = null; left -= 1;
              if (!left) {
                run.answers += 1; run.ok += 1;
                setTimeout(() => {
                  const el = document.createElement('div');
                  el.className = 'sheet ok';
                  el.innerHTML = `<div class="in"><h3>${pick(PRAISE)}</h3><p class="note">Tutte le coppie trovate.</p><button class="btn primary block" id="next">Avanti</button></div>`;
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

  /* ---------------- Fine lezione ---------------- */
  function finishSession() {
    const t = run.day;
    const d = S.days[t] || { done: false, ok: 0, total: 0, fresh: 0, review: 0, minutes: 0 };
    d.ok += run.ok; d.total += run.answers;
    d.minutes += Math.max(1, Math.round((Date.now() - run.start) / 60000));
    if (run.mode === 'normal') { d.done = true; d.fresh += run.plan.fresh.length; d.review += run.plan.review.length; }
    else d.extra = (d.extra || 0) + 1;
    S.days[t] = d;
    if (run.mode === 'recover' && typeof run.recoverDay === 'number') {
      const m = S.days[run.recoverDay] || { ok: 0, total: 0, fresh: 0, review: 0, minutes: 0 };
      S.days[run.recoverDay] = { ...m, done: true, recovered: true };
      S.lastRecover = t;
    }
    save();
    const r = run; run = null;
    const st = SRS.streak(S, t);
    const pct = r.answers ? Math.round((r.ok / r.answers) * 100) : 100;
    const words = r.plan.fresh.map((id) => byId[id]);
    sfx.win();
    app.innerHTML = `<div class="floaters" aria-hidden="true">${Array.from({ length: 14 }, (_, i) =>
      ICON.heart().replace('<svg', `<svg style="left:${(i * 7.3) % 100}%;animation-duration:${3 + (i % 5) * 0.7}s;animation-delay:${(i % 7) * 0.25}s"`)).join('')}</div>
      <div class="wrap done">
        ${ICON.heart('big-heart')}
        <h1>${r.mode === 'normal' ? 'Lezione <span>finita!</span>' : r.mode === 'recover' ? 'Giorno <span>recuperato!</span>' : 'Ripasso <span>fatto!</span>'}</h1>
        <p class="lead">${pct >= 85 ? 'Sei andata benissimo.' : pct >= 60 ? 'Brava! Gli errori di oggi tornano domani, così si fissano.' : 'Oggi era tosta, ma ce l\'hai fatta. È proprio così che si impara.'}</p>
        <section class="stats">
          <div class="stat"><b>${r.ok}/${r.answers}</b><span>risposte giuste</span></div>
          <div class="stat"><b>${st}</b><span>${st === 1 ? 'giorno di fila' : 'giorni di fila'}</span></div>
        </section>
        ${words.length ? `<h2 class="section">Le novità di oggi</h2><section class="learned-list">${words.map((it) => `
          <div class="word-row"><div class="e" aria-hidden="true">${it.em}</div><div class="w"><b>${esc(it.en)}</b><span>${esc(it.it)}</span></div>
          <button class="speak" data-say="${esc(it.en)}" aria-label="Ascolta ${esc(it.en)}">${ICON.speaker}</button></div>`).join('')}</section>` : ''}
        <button class="btn primary block" id="home">Torna a Oggi</button>
      </div>`;
    bindSay();
    $('#home').addEventListener('click', () => { tab = 'home'; render(); scrollTo(0, 0); });
  }

  /* ---------------- Avvio ---------------- */
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !run) render(); });
  render();
})();
