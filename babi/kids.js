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
  const STICKERS = ['🐴', '🐰', '🦄', '🥕', '🐇', '🌈', '🎠', '🍎', '⭐', '🐣', '🦋', '🌸', '🍓', '🎀', '🐱', '🐶', '🐑', '🐥', '🌻', '🍦', '🧁', '🐞', '🦔', '🐿️', '🐢', '🦊', '🐼', '🐨', '🦒', '👑'];

  /** Divide ogni capitolo in lezioni da 3-4 novità, il più possibile uguali. */
  function makeLessons(units, items) {
    const out = [];
    units.forEach((u) => {
      const list = items.filter((i) => i.u === u.id);
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

  /** Lezioni giocabili: tutte quelle finite più la prossima. */
  function unlockedCount(state, lessons) {
    const done = state.done || {};
    let k = 0;
    while (k < lessons.length && done[lessons[k].n]) k++;
    return Math.min(lessons.length, k + 1);
  }

  /** Novità della lezione più qualche parola vecchia da ripassare. Rigiocare una lezione la ripassa tutta. */
  function planLesson(state, lesson, items, tick) {
    const cards = state.cards || {};
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

  /** Prima si riconosce con le figure, poi si sceglie la parola, poi si compone con le lettere. */
  function exerciseFor(item, box, rng) {
    if (item.k === 'p') return box >= 2 ? 'build' : 'listenP';
    if (box <= 1) return rng() < 0.5 ? 'listen' : 'en2pic';
    if (box === 2) return 'pic2en';
    return canSpell(item) && rng() < 0.6 ? 'spell' : 'pic2en';
  }
  const easyFor = (item) => (item.k === 'p' ? 'listenP' : 'listen');

  const stepIds = (s) => (s.ids ? s.ids : [s.id]);
  const clash = (a, b) => !!a && !!b && b.t !== 'intro' && a.t !== 'match' && b.t !== 'match' && stepIds(a).some((id) => stepIds(b).includes(id));
  const hasClash = (seq, head) => seq.some((st, i) => clash(st, i === 0 ? head : seq[i - 1]));
  function spreadOut(tail, head, rng) {
    for (let tries = 0; tries < 200 && hasClash(tail, head); tries++) SRS.shuffle(tail, rng);
    return tail;
  }

  function buildSteps(plan, state, byId, rng) {
    const cards = state.cards || {};
    const fresh = plan.fresh.map((id) => byId[id]);
    const steps = [];
    fresh.forEach((it, i) => {
      steps.push({ t: 'intro', id: it.id });
      steps.push({ t: easyFor(it), id: it.id });
      if (i > 0) steps.push({ t: fresh[i - 1].k === 'p' ? 'listenP' : 'en2pic', id: fresh[i - 1].id });
    });
    const freshWords = fresh.filter((x) => x.k !== 'p');
    const mixed = plan.review.map((id) => ({ t: exerciseFor(byId[id], (cards[id] && cards[id].box) || 0, rng), id }));
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

  return { LESSON_SIZE, STICKERS, makeLessons, unlockedCount, planLesson, canSpell, exerciseFor, easyFor, buildSteps, stars, letterTiles };
});
