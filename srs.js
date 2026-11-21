/* Logica pura del ripasso: pianifica la lezione, sceglie gli esercizi, aggiorna la memoria di ogni parola.
   Nessun accesso al DOM: si usa uguale nel browser e nei test con Node. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SRS = factory();
})(typeof self !== 'undefined' ? self : globalThis, function () {
  'use strict';

  // Giorni di attesa per ogni livello di memoria (box). Box 0 = appena vista.
  const INTERVALS = [0, 1, 2, 4, 7, 14, 30, 60];
  const MAX_BOX = INTERVALS.length - 1;
  const NEW_PER_DAY = 4;
  const MAX_REVIEW = 12;
  const MAX_PHRASES_PER_DAY = 2;
  const LEARNED_BOX = 3;

  function dayNumber(date) {
    return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  }

  function shuffle(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function newCard(today) {
    return { box: 0, due: today, right: 0, wrong: 0, seen: 0, added: today };
  }

  /** Aggiorna una carta dopo il primo tentativo della giornata. Un errore fa scendere di due livelli, mai sotto 1. */
  function grade(card, ok, today) {
    const c = Object.assign(newCard(today), card || {});
    c.seen += 1;
    if (ok) { c.box = Math.min(MAX_BOX, c.box + 1); c.right += 1; }
    else { c.box = Math.max(1, c.box - 2); c.wrong += 1; }
    c.due = today + INTERVALS[c.box];
    c.last = today;
    return c;
  }

  /** Da 0 a 5 cuori. */
  function mastery(card) {
    if (!card) return 0;
    return Math.min(5, Math.ceil((card.box * 5) / MAX_BOX));
  }
  const isLearned = (card) => !!card && card.box >= LEARNED_BOX;

  function recentAccuracy(state, today, days = 3) {
    let ok = 0, total = 0;
    for (let d = today - 1, seen = 0; d >= today - 14 && seen < days; d--) {
      const log = state.days && state.days[d];
      if (log && log.total) { ok += log.ok; total += log.total; seen++; }
    }
    return total ? ok / total : 1;
  }

  function streak(state, today) {
    const days = state.days || {};
    let d = days[today] && days[today].done ? today : today - 1;
    let n = 0;
    while (days[d] && days[d].done) { n++; d--; }
    return n;
  }

  const RECOVER_WINDOW = 7;

  /** Primo giorno in cui Giupli ha usato l'app, o null. */
  function firstDay(state) {
    const days = Object.keys(state.days || {}).filter((d) => state.days[d].done).map(Number);
    const added = Object.values(state.cards || {}).map((c) => c.added).filter((d) => typeof d === 'number');
    const all = days.concat(added);
    return all.length ? Math.min(...all) : null;
  }

  /** Il giorno saltato più recente negli ultimi 7, se si può ancora recuperare. Uno al giorno. */
  function missedDay(state, today) {
    const first = firstDay(state);
    if (first === null || state.lastRecover === today) return null;
    const days = state.days || {};
    for (let d = today - 1; d >= Math.max(first, today - RECOVER_WINDOW); d--) {
      if (!(days[d] && days[d].done)) return d;
    }
    return null;
  }

  /** Testo per la voce: una "I" da sola viene letta "capital I", quindi le si fa dire "eye". */
  function forSpeech(text) {
    return String(text).trim() === 'I' ? 'eye' : String(text);
  }

  /** Quali parole ripassare e quali introdurre oggi. */
  function planSession(state, items, today, opts) {
    const mode = (opts && opts.mode) || 'normal';
    const cards = state.cards || {};
    const introduced = items.filter((it) => cards[it.id]);

    if (mode === 'extra') {
      const weakest = introduced.slice().sort((a, b) =>
        (cards[a.id].box - cards[b.id].box) || (cards[b.id].wrong - cards[a.id].wrong));
      return { review: weakest.slice(0, 8).map((x) => x.id), fresh: [] };
    }

    const due = introduced
      .filter((it) => cards[it.id].due <= today)
      .sort((a, b) => (cards[a.id].due - cards[b.id].due) || (cards[a.id].box - cards[b.id].box));
    const review = due.slice(0, MAX_REVIEW).map((x) => x.id);

    // Il ritmo segue Giupli: rallenta se fa fatica, accelera quando va bene e non ha arretrati.
    const acc = recentAccuracy(state, today);
    let n = NEW_PER_DAY;
    if (due.length >= 10) n = 2;
    else if (acc < 0.7) n = 3;
    else if (introduced.length && due.length < 8 && acc >= 0.9) n = 6;
    else if (introduced.length && due.length < 8 && acc >= 0.8) n = 5;

    const fresh = [];
    let phrases = 0;
    for (const it of items) {
      if (fresh.length >= n) break;
      if (cards[it.id]) continue;
      if (it.k === 'p') { if (phrases >= MAX_PHRASES_PER_DAY) break; phrases++; }
      fresh.push(it.id);
    }
    return { review, fresh };
  }

  /** Esercizio adatto a quanto bene è conosciuta una parola: prima si riconosce, poi si ricorda. */
  function exerciseFor(item, box, rng) {
    if (item.k === 'p') return box >= 2 ? 'build' : 'listenP';
    if (box <= 1) return rng() < 0.5 ? 'listen' : 'enIt';
    if (box === 2) return 'itEn';
    if (box === 3) return rng() < 0.5 ? 'itEn' : 'type';
    return 'type';
  }
  const easyFor = (item) => (item.k === 'p' ? 'listenP' : 'enIt');

  const stepIds = (s) => (s.ids ? s.ids : [s.id]);
  // Il gioco delle coppie usa tante parole insieme: può stare vicino a un esercizio su una di esse.
  const clash = (a, b) => !!a && !!b && a.t !== 'match' && b.t !== 'match' && stepIds(a).some((id) => stepIds(b).includes(id));

  const hasClash = (seq, head) => seq.some((st, i) => clash(st, i === 0 ? head : seq[i - 1]));

  /** Mescola la coda della lezione finché la stessa parola non compare in due esercizi di fila. */
  function spreadOut(tail, head, rng) {
    for (let tries = 0; tries < 200 && hasClash(tail, head); tries++) shuffle(tail, rng);
    return tail;
  }

  /** Sequenza degli esercizi della lezione. */
  function buildSteps(plan, state, byId, rng) {
    const cards = state.cards || {};
    const fresh = plan.fresh.map((id) => byId[id]);
    const steps = [];

    // 1. Presentazione di ogni novità, subito seguita da un esercizio facile.
    fresh.forEach((it, i) => {
      steps.push({ t: 'intro', id: it.id });
      steps.push({ t: it.k === 'p' ? 'listenP' : 'listen', id: it.id });
      if (i > 0) steps.push({ t: easyFor(fresh[i - 1]), id: fresh[i - 1].id });
    });

    // 2. Gioco delle coppie con le parole nuove: entra nel mescolamento, così non segue un esercizio sulla stessa parola.
    const freshWords = fresh.filter((x) => x.k !== 'p');

    // 3. Ripassi e novità mescolati.
    const mixed = plan.review.map((id) => {
      const it = byId[id];
      return { t: exerciseFor(it, (cards[id] && cards[id].box) || 0, rng), id };
    });
    fresh.forEach((it) => mixed.push({ t: it.k === 'p' ? 'build' : 'itEn', id: it.id }));
    if (freshWords.length >= 3) mixed.push({ t: 'match', ids: freshWords.slice(0, 4).map((x) => x.id) });
    const reviewWords = plan.review.filter((id) => byId[id].k !== 'p');
    if (reviewWords.length >= 4) mixed.push({ t: 'match', ids: shuffle(reviewWords.slice(), rng).slice(0, 4) });
    spreadOut(shuffle(mixed, rng), steps[steps.length - 1], rng);
    steps.push(...mixed);

    // 4. Ultimo giro sulle novità: la ripetizione a distanza fissa la memoria.
    const last = shuffle(fresh.map((it) => ({ t: it.k === 'p' ? 'build' : 'listen', id: it.id })), rng);
    spreadOut(last, steps[steps.length - 1], rng);
    steps.push(...last);
    return steps;
  }

  function normalize(s) {
    return String(s).toLowerCase().replace(/[’`]/g, "'").replace(/[.,!?;:"()]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }

  /** 'exact', 'close' (un errore di battitura su parole di almeno 4 lettere) o 'no'. */
  function checkTyped(input, target) {
    const a = normalize(input), b = normalize(target);
    if (!a) return 'no';
    if (a === b) return 'exact';
    if (b.length >= 4 && levenshtein(a, b) <= 1) return 'close';
    return 'no';
  }

  /** Parole della frase come tessere, senza punteggiatura. */
  function tiles(en) {
    return en.replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);
  }

  return {
    INTERVALS, MAX_BOX, NEW_PER_DAY, MAX_REVIEW, LEARNED_BOX,
    dayNumber, shuffle, newCard, grade, mastery, isLearned, recentAccuracy, streak, firstDay, missedDay, forSpeech, RECOVER_WINDOW,
    planSession, exerciseFor, easyFor, buildSteps, spreadOut, normalize, levenshtein, checkTyped, tiles,
  };
});
