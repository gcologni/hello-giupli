/* Logica pura della versione di Babi: lezioni libere, una dopo l'altra, senza calendario.
   Il tempo si misura in lezioni fatte (tick), non in giorni. Usa grade, shuffle e tiles da ../srs.js. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('../srs.js'));
  else root.KIDS = factory(root.SRS);
})(typeof self !== 'undefined' ? self : globalThis, function (SRS) {
  'use strict';
  const LESSON_SIZE = 4;
  const MAX_REVIEW = 4;
  const MIN_REVIEW = 2;
  const CHALLENGE_SIZE = 8;
  const STICKERS = ['🐴', '🐰', '🦄', '🥕', '🐇', '🌈', '🎠', '🍎', '⭐', '🐣', '🦋', '🌸', '🍓', '🎀', '🐱', '🐶', '🐑', '🐥', '🌻', '🍦',
    '🧁', '🐞', '🦔', '🐿️', '🐢', '🦊', '🐼', '🐨', '🦒', '👑', '🐎', '🦢', '🦩', '🐠', '🐬', '🦭', '🐧', '🦉', '🐝', '🍄',
    '🌷', '🍒', '🍉', '🍩', '🍭', '🎈', '🪁', '🎨', '🧸', '🪅', '💎', '🔮', '🏰', '🌙', '☀️', '❄️', '🍀', '🐉', '🌺', '🏆'];
  const COUNT_PICS = ['🐰', '🐴', '🥕', '🍎', '⭐', '🦋', '🌸', '🐣', '🍓', '🎈'];
  // Parole troppo piccole per il "completa la frase": si nasconde una parola che conta.
  const GAP_SKIP = new Set(['a', 'the', 'is', 'i', 'am', 'my', 'to', 'in', 'on', 'it', 'you', 'do', 'can', 'his', 'her', 'with', 'are', 'of', 'this']);

  /** Divide ogni capitolo in lezioni da 2-4 novità, il più possibile uguali. Numerate dall'1, in ordine. */
  function makeLessons(units, items) {
    const out = [];
    units.forEach((u) => {
      const list = items.filter((i) => i.u === u.id);
      if (!list.length) return;
      const n = Math.ceil(list.length / LESSON_SIZE);
      const base = Math.floor(list.length / n), extra = list.length % n;
      let at = 0;
      for (let k = 0; k < n; k++) {
        const size = base + (k < extra ? 1 : 0);
        out.push({ n: out.length + 1, u: u.id, ids: list.slice(at, at + size).map((i) => i.id) });
        at += size;
      }
    });
    return out;
  }

  /** Una gara per capitolo: ripassa tutto il capitolo e regala una coccarda. Non blocca il percorso. */
  function makeChallenges(units, items) {
    return units
      .map((u) => ({ id: 'sfida-' + u.id, u: u.id, ids: items.filter((i) => i.u === u.id).map((i) => i.id), challenge: true }))
      .filter((c) => c.ids.length);
  }

  /** Lezioni giocabili: tutte quelle finite più la prossima. */
  function unlockedCount(state, lessons) {
    const done = state.done || {};
    let k = 0;
    while (k < lessons.length && done[lessons[k].n]) k++;
    return Math.min(lessons.length, k + 1);
  }

  /** La gara si apre quando tutte le lezioni del capitolo sono finite. */
  function challengeOpen(state, lessons, unitId) {
    const done = state.done || {};
    const list = lessons.filter((l) => l.u === unitId);
    return list.length > 0 && list.every((l) => done[l.n]);
  }

  /** Novità della lezione più qualche parola vecchia da ripassare. Rigiocare una lezione la ripassa tutta. */
  function planLesson(state, lesson, items, tick, rng = Math.random) {
    const cards = state.cards || {};
    if (lesson && lesson.challenge) {
      return { fresh: [], review: SRS.shuffle(lesson.ids.slice(), rng).slice(0, CHALLENGE_SIZE) };
    }
    const fresh = lesson ? lesson.ids.filter((id) => !cards[id]) : [];
    const replay = lesson ? lesson.ids.filter((id) => cards[id]) : [];
    const inLesson = (id) => !!lesson && lesson.ids.includes(id);
    const others = items.filter((it) => cards[it.id] && !inLesson(it.id));
    const due = others
      .filter((it) => cards[it.id].due <= tick)
      .sort((a, b) => (cards[a.id].due - cards[b.id].due) || (cards[a.id].box - cards[b.id].box));
    const max = lesson ? MAX_REVIEW : 8;
    let review = due.slice(0, max).map((x) => x.id);
    const min = lesson ? MIN_REVIEW : 6;
    if (review.length < min) {
      const weak = others
        .filter((it) => !review.includes(it.id))
        .sort((a, b) => (cards[a.id].box - cards[b.id].box) || ((cards[a.id].last || 0) - (cards[b.id].last || 0)));
      review = review.concat(weak.slice(0, min - review.length).map((x) => x.id));
    }
    return { fresh, review: replay.concat(review) };
  }

  const canSpell = (item) => !item.k && /^[a-z]{3,6}$/i.test(item.en);

  /** Indice della parola da nascondere nel "completa la frase": la più lunga che conta, o -1. */
  function gapIndex(en) {
    const words = SRS.tiles(en);
    if (words.length < 2) return -1;
    let best = -1;
    words.forEach((w, i) => {
      if (GAP_SKIP.has(w.toLowerCase())) return;
      if (best < 0 || w.length > words[best].length) best = i;
    });
    return best;
  }
  const canGap = (item) => item.k === 'p' && gapIndex(item.en) >= 0;

  /** Esercizio adatto a quanto bene Babi conosce la parola: prima riconosce, poi sceglie, poi scrive e completa. */
  function exerciseFor(item, box, rng) {
    if (item.k === 'p') {
      if (box <= 1) return 'listenP';
      return canGap(item) && rng() < 0.5 ? 'gap' : 'build';
    }
    if (item.num && box >= 1 && rng() < 0.5) return 'count';
    if (box <= 1) return rng() < 0.5 ? 'listen' : 'en2pic';
    if (box === 2) return rng() < 0.6 ? 'pic2en' : 'truefalse';
    const r = rng();
    if (canSpell(item) && r < 0.45) return 'spell';
    return r < 0.75 ? 'pic2en' : 'truefalse';
  }
  const easyFor = (item) => (item.k === 'p' ? 'listenP' : 'listen');

  const stepIds = (s) => (s.ids ? s.ids : s.id ? [s.id] : []);
  const clash = (a, b) => !!a && !!b && b.t !== 'intro' && a.t !== 'match' && b.t !== 'match' && stepIds(a).some((id) => stepIds(b).includes(id));
  const hasClash = (seq, head) => seq.some((st, i) => clash(st, i === 0 ? head : seq[i - 1]));
  function spreadOut(tail, head, rng) {
    for (let tries = 0; tries < 200 && hasClash(tail, head); tries++) SRS.shuffle(tail, rng);
    return tail;
  }

  /**
   * Passi della lezione.
   * opts.firstOfUnit: id delle prime parole di ogni capitolo; prima di presentarle arriva la regoletta del capitolo.
   * opts.challenge: gara del capitolo; si apre con la regoletta e usa esercizi più difficili.
   */
  function buildSteps(plan, state, byId, rng, opts = {}) {
    const cards = state.cards || {};
    const fresh = plan.fresh.map((id) => byId[id]);
    const steps = [];
    if (opts.challenge && opts.unit) steps.push({ t: 'tip', u: opts.unit });
    fresh.forEach((it, i) => {
      if (opts.firstOfUnit && opts.firstOfUnit.has(it.id)) steps.push({ t: 'tip', u: it.u });
      steps.push({ t: 'intro', id: it.id });
      steps.push({ t: easyFor(it), id: it.id });
      if (i > 0) steps.push({ t: fresh[i - 1].k === 'p' ? 'listenP' : 'en2pic', id: fresh[i - 1].id });
    });
    const freshWords = fresh.filter((x) => x.k !== 'p');
    const boost = opts.challenge ? 2 : 0;
    const mixed = plan.review.map((id) => {
      const box = (cards[id] && cards[id].box) || 0;
      return { t: exerciseFor(byId[id], Math.max(box, boost), rng), id };
    });
    fresh.forEach((it) => mixed.push({ t: it.k === 'p' ? 'build' : 'pic2en', id: it.id }));
    const reviewWords = plan.review.filter((id) => byId[id].k !== 'p');
    if (freshWords.length >= 3) mixed.push({ t: 'match', ids: freshWords.slice(0, 4).map((x) => x.id) });
    else if (reviewWords.length >= 3) mixed.push({ t: 'match', ids: SRS.shuffle(reviewWords.slice(), rng).slice(0, 4) });
    spreadOut(SRS.shuffle(mixed, rng), steps[steps.length - 1], rng);
    steps.push(...mixed);
    return steps;
  }

  /** 3 stelle con al massimo 1 errore, 2 con al massimo 3, altrimenti 1. Mai zero. */
  function stars(answers, ok) {
    const miss = Math.max(0, answers - ok);
    return miss <= 1 ? 3 : miss <= 3 ? 2 : 1;
  }

  /** Lettere mescolate, mai nell'ordine giusto. */
  function letterTiles(word, rng) {
    const letters = word.toLowerCase().split('');
    let out = letters.slice();
    for (let i = 0; i < 20 && out.join('') === letters.join(''); i++) out = SRS.shuffle(letters.slice(), rng);
    if (out.join('') === letters.join('')) out = letters.slice().reverse();
    return out;
  }

  /** Per "Quanti sono?": due numeri vicini a quello giusto, presi fra i numeri del corso. */
  function countChoices(item, items, rng) {
    const others = items.filter((x) => x.num && x.id !== item.id);
    const near = SRS.shuffle(others.slice(), rng).sort((a, b) => Math.abs(a.num - item.num) - Math.abs(b.num - item.num)).slice(0, 4);
    return SRS.shuffle(near, rng).slice(0, 2);
  }

  /** Livello di una lezione e se è l'ultima del suo livello. */
  function levelOf(unitsById, lesson) { return (unitsById[lesson.u] && unitsById[lesson.u].lv) || 1; }

  return {
    LESSON_SIZE, CHALLENGE_SIZE, STICKERS, COUNT_PICS,
    makeLessons, makeChallenges, unlockedCount, challengeOpen, planLesson, canSpell, gapIndex, canGap,
    exerciseFor, easyFor, buildSteps, stars, letterTiles, countChoices, levelOf,
  };
});
