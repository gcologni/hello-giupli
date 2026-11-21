'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const KIDS = require('../babi/kids.js');
const SRS = require('../srs.js');
const { units, items } = require('../babi/data.js');

const byId = Object.fromEntries(items.map((i) => [i.id, i]));
const seeded = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const lessons = KIDS.makeLessons(units, items);

test('il corso di Babi ha id unici e campi completi', () => {
  const ids = new Set();
  for (const it of items) {
    assert.ok(!ids.has(it.id), 'id doppio: ' + it.id);
    ids.add(it.id);
    for (const f of ['en', 'it', 'pr', 'em']) assert.ok(it[f], `${it.id} senza ${f}`);
  }
});

test('ogni parola sta in una sola lezione, da 2 a 4 novità ciascuna', () => {
  const seen = lessons.flatMap((l) => l.ids);
  assert.equal(seen.length, items.length);
  assert.equal(new Set(seen).size, items.length);
  lessons.forEach((l) => assert.ok(l.ids.length >= 2 && l.ids.length <= 4, `lezione ${l.n}: ${l.ids.length}`));
  lessons.forEach((l, i) => assert.equal(l.n, i + 1));
});

test('si può giocare la prossima lezione subito, senza aspettare il giorno dopo', () => {
  assert.equal(KIDS.unlockedCount({ done: {} }, lessons), 1);
  assert.equal(KIDS.unlockedCount({ done: { 1: 3 } }, lessons), 2);
  assert.equal(KIDS.unlockedCount({ done: { 1: 3, 2: 1, 3: 2 } }, lessons), 4);
});

test('la lezione porta le sue novità e almeno 2 ripassi quando ci sono parole vecchie', () => {
  const state = { cards: {} };
  const p1 = KIDS.planLesson(state, lessons[0], items, 0);
  assert.deepEqual(p1.fresh, lessons[0].ids);
  assert.deepEqual(p1.review, []);
  lessons[0].ids.forEach((id) => { state.cards[id] = SRS.grade(null, true, 0); });
  const p2 = KIDS.planLesson(state, lessons[1], items, 1);
  assert.deepEqual(p2.fresh, lessons[1].ids);
  assert.ok(p2.review.length >= 2 && p2.review.length <= 4);
  p2.review.forEach((id) => assert.ok(lessons[0].ids.includes(id)));
});

test('rigiocare una lezione finita la ripassa tutta, senza novità', () => {
  const state = { cards: {} };
  lessons[0].ids.forEach((id) => { state.cards[id] = SRS.grade(null, true, 0); });
  const p = KIDS.planLesson(state, lessons[0], items, 1);
  assert.deepEqual(p.fresh, []);
  lessons[0].ids.forEach((id) => assert.ok(p.review.includes(id)));
});

test('gioco libero senza lezione: ripasso di 6-8 parole', () => {
  const state = { cards: {} };
  items.slice(0, 12).forEach((it, i) => { state.cards[it.id] = { box: i % 4, due: 99, last: i }; });
  const p = KIDS.planLesson(state, null, items, 1);
  assert.equal(p.fresh.length, 0);
  assert.ok(p.review.length >= 6 && p.review.length <= 8);
});

test('i passi della lezione: prima la presentazione, mai la stessa parola due volte di fila', () => {
  const state = { cards: {} };
  items.slice(0, 10).forEach((it, i) => { state.cards[it.id] = { box: i % 5, due: 0 }; });
  for (let seed = 1; seed < 40; seed++) {
    const plan = KIDS.planLesson(state, lessons[3], items, 5);
    const steps = KIDS.buildSteps(plan, state, byId, seeded(seed));
    const introAt = {};
    steps.forEach((s, i) => {
      const ids = s.ids || [s.id];
      if (s.t === 'intro') introAt[s.id] = i;
      ids.forEach((id) => { if (plan.fresh.includes(id) && s.t !== 'intro') assert.ok(introAt[id] < i); });
      if (i > 0 && steps[i - 1].t !== 'intro' && s.t !== 'match' && steps[i - 1].t !== 'match') {
        const prev = steps[i - 1].ids || [steps[i - 1].id];
        assert.ok(!ids.some((id) => prev.includes(id)), `seed ${seed} passo ${i}`);
      }
    });
    assert.ok(steps.length >= 12 && steps.length <= 24, 'lezione di ' + steps.length + ' passi');
  }
});

test('compitare con le lettere solo per parole corte, mai nell\'ordine giusto', () => {
  assert.ok(KIDS.canSpell(byId.cat));
  assert.ok(!KIDS.canSpell(byId.strawberry));
  assert.ok(!KIDS.canSpell(byId['teddy-bear']));
  for (let s = 1; s < 30; s++) assert.notEqual(KIDS.letterTiles('dog', seeded(s)).join(''), 'dog');
});

test('stelle: mai zero', () => {
  assert.equal(KIDS.stars(10, 10), 3);
  assert.equal(KIDS.stars(10, 9), 3);
  assert.equal(KIDS.stars(10, 7), 2);
  assert.equal(KIDS.stars(10, 2), 1);
});
