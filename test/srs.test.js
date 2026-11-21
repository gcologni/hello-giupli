// Esegui con: node --test test/
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const SRS = require('../srs.js');
const { items, units } = require('../data.js');

const byId = Object.fromEntries(items.map((i) => [i.id, i]));
const seeded = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const T = 20000;

test('il corso ha id unici e campi completi', () => {
  const ids = new Set();
  const unitIds = new Set(units.map((u) => u.id));
  for (const it of items) {
    assert.ok(!ids.has(it.id), 'id doppio: ' + it.id);
    ids.add(it.id);
    for (const f of ['en', 'it', 'pr', 'em']) assert.ok(it[f], `${it.id} senza ${f}`);
    assert.ok(unitIds.has(it.u), `${it.id} in un capitolo inesistente`);
  }
  assert.ok(items.length >= 90);
});

test('grade: risposta giusta sale di livello e allunga l\'attesa', () => {
  let c = SRS.grade(null, true, T);
  assert.equal(c.box, 1); assert.equal(c.due, T + 1);
  c = SRS.grade(c, true, T + 1);
  assert.equal(c.box, 2); assert.equal(c.due, T + 1 + 2);
  c = SRS.grade(c, true, T + 3);
  assert.equal(c.box, 3); assert.equal(c.due, T + 3 + 4);
  assert.ok(SRS.isLearned(c));
});

test('grade: un errore scende di due livelli ma mai sotto 1', () => {
  let c = { box: 5, due: T, right: 5, wrong: 0, seen: 5 };
  c = SRS.grade(c, false, T);
  assert.equal(c.box, 3); assert.equal(c.due, T + 4); assert.equal(c.wrong, 1);
  c = SRS.grade({ box: 1 }, false, T);
  assert.equal(c.box, 1); assert.equal(c.due, T + 1);
  c = SRS.grade({ box: SRS.MAX_BOX }, true, T);
  assert.equal(c.box, SRS.MAX_BOX);
});

test('primo giorno: 4 novità nell\'ordine del corso, nessun ripasso', () => {
  const plan = SRS.planSession({ cards: {}, days: {} }, items, T);
  assert.deepEqual(plan.review, []);
  assert.deepEqual(plan.fresh, items.slice(0, 4).map((i) => i.id));
});

test('molti ripassi: solo 2 novità e al massimo 12 ripassi', () => {
  const cards = {};
  items.slice(0, 20).forEach((it, i) => { cards[it.id] = { box: 1, due: T - (i % 3), right: 1, wrong: 0, seen: 1 }; });
  const plan = SRS.planSession({ cards, days: {} }, items, T);
  assert.equal(plan.review.length, SRS.MAX_REVIEW);
  assert.equal(plan.fresh.length, 2);
  assert.equal(plan.fresh[0], items[20].id);
});

test('giorni difficili: con meno del 70% di risposte giuste le novità scendono a 3', () => {
  const state = { cards: {}, days: { [T - 1]: { done: true, ok: 5, total: 10 } } };
  assert.equal(SRS.planSession(state, items, T).fresh.length, 3);
});

test('al massimo 2 frasi nuove al giorno', () => {
  const cards = {};
  items.filter((i) => i.k !== 'p').forEach((it) => { cards[it.id] = { box: 7, due: T + 30 }; });
  const plan = SRS.planSession({ cards, days: {} }, items, T);
  assert.ok(plan.fresh.length <= 2);
  plan.fresh.forEach((id) => assert.equal(byId[id].k, 'p'));
});

test('la lezione presenta ogni novità prima di esercitarla e non ripete la stessa parola di fila (tranne subito dopo la presentazione)', () => {
  const cards = {};
  items.slice(0, 12).forEach((it, i) => { cards[it.id] = { box: i % 5, due: T, right: 1, wrong: 0, seen: 1 }; });
  const state = { cards, days: {} };
  for (let seed = 1; seed < 40; seed++) {
    const plan = SRS.planSession(state, items, T);
    const steps = SRS.buildSteps(plan, state, byId, seeded(seed));
    const introAt = {};
    steps.forEach((s, i) => {
      if (s.t === 'intro') introAt[s.id] = i;
      const ids = s.ids || [s.id];
      ids.forEach((id) => { if (plan.fresh.includes(id) && s.t !== 'intro') assert.ok(introAt[id] < i, `${id} esercitata prima di essere presentata`); });
      if (i > 0 && steps[i - 1].t !== 'intro') {
        const prev = steps[i - 1].ids || [steps[i - 1].id];
        assert.ok(!ids.some((id) => prev.includes(id)), `stessa parola di fila al passo ${i} (seed ${seed})`);
      }
    });
    assert.ok(steps.length >= 20 && steps.length <= 40, 'lezione di ' + steps.length + ' esercizi');
  }
});

test('checkTyped perdona maiuscole, punteggiatura e un errore di battitura', () => {
  assert.equal(SRS.checkTyped('Hello', 'hello'), 'exact');
  assert.equal(SRS.checkTyped('  thank you! ', 'thank you'), 'exact');
  assert.equal(SRS.checkTyped('helo', 'hello'), 'close');
  assert.equal(SRS.checkTyped('yse', 'yes'), 'no');
  assert.equal(SRS.checkTyped('', 'yes'), 'no');
  assert.equal(SRS.checkTyped('I dont understand', "I don't understand"), 'close');
});

test('streak conta i giorni consecutivi, anche se oggi non è ancora fatto', () => {
  const days = { [T - 1]: { done: true }, [T - 2]: { done: true }, [T - 4]: { done: true } };
  assert.equal(SRS.streak({ days }, T), 2);
  days[T] = { done: true };
  assert.equal(SRS.streak({ days }, T), 3);
  assert.equal(SRS.streak({ days: {} }, T), 0);
});

test('tiles toglie la punteggiatura e tiene gli apostrofi', () => {
  assert.deepEqual(SRS.tiles("I don't understand"), ['I', "don't", 'understand']);
  assert.deepEqual(SRS.tiles('A coffee, please'), ['A', 'coffee', 'please']);
});

test('quando va bene il ritmo accelera: 5 novità sopra l\'80%, 6 sopra il 90%', () => {
  const cards = { [items[0].id]: { box: 2, due: T + 1 } };
  const s80 = { cards, days: { [T - 1]: { done: true, ok: 17, total: 20 } } };
  const s90 = { cards, days: { [T - 1]: { done: true, ok: 19, total: 20 } } };
  assert.equal(SRS.planSession(s80, items, T).fresh.length, 5);
  assert.equal(SRS.planSession(s90, items, T).fresh.length, 6);
});

test('forSpeech: la "I" da sola si legge "eye", il resto non cambia', () => {
  assert.equal(SRS.forSpeech('I'), 'eye');
  assert.equal(SRS.forSpeech(' I '), 'eye');
  assert.equal(SRS.forSpeech('I love you'), 'I love you');
  assert.equal(SRS.forSpeech('hello'), 'hello');
});

test('missedDay: propone il giorno saltato più recente, al massimo 7 giorni indietro e uno al giorno', () => {
  const cards = { hello: { box: 1, due: T, added: T - 10 } };
  const days = {};
  for (let d = T - 10; d < T; d++) days[d] = { done: true };
  delete days[T - 3];
  assert.equal(SRS.missedDay({ cards, days }, T), T - 3);
  delete days[T - 1];
  assert.equal(SRS.missedDay({ cards, days }, T), T - 1);
  assert.equal(SRS.missedDay({ cards, days, lastRecover: T }, T), null);
  const old = { cards, days: { ...days, [T - 1]: { done: true }, [T - 3]: { done: true } } };
  delete old.days[T - 9];
  assert.equal(SRS.missedDay(old, T), null, 'oltre i 7 giorni non si recupera');
  assert.equal(SRS.missedDay({ cards: {}, days: {} }, T), null, 'prima del primo giorno non c\'è nulla da recuperare');
});

test('un giorno recuperato ricuce i giorni di fila', () => {
  const days = { [T - 1]: { done: true, recovered: true }, [T - 2]: { done: true }, [T]: { done: true } };
  assert.equal(SRS.streak({ days }, T), 3);
});
