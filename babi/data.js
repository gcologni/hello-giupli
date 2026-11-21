/* Il corso di Babi: capitoli in ordine, parole e frasi in ordine di apprendimento.
   Campi: id, u (capitolo), en, it, pr (come si legge, all'italiana), em (immagine), hk (trucco), k: 'p' per le frasi. */
(function (root) {
  'use strict';
  const units = [
    { id: 'ciao', title: 'Ciao!', em: '👋' },
    { id: 'animali', title: 'Animali', em: '🐴' },
    { id: 'colori', title: 'Colori', em: '🎨' },
    { id: 'numeri', title: 'Numeri', em: '🔢' },
    { id: 'presento', title: 'Mi presento', em: '💬' },
    { id: 'pappa', title: 'La pappa', em: '🥕' },
    { id: 'famiglia', title: 'Famiglia', em: '🏡' },
    { id: 'corpo', title: 'Il corpo', em: '👀' },
    { id: 'maneggio', title: 'Al maneggio', em: '🏇' },
    { id: 'emozioni', title: 'Emozioni', em: '😊' },
    { id: 'fuori', title: 'Fuori', em: '🌈' },
    { id: 'giochi', title: 'Giochi', em: '🧸' },
    { id: 'cuore', title: 'Frasi del cuore', em: '💗' },
  ];

  const items = [];
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const w = (u, en, it, pr, em, hk) => items.push({ id: slug(en), u, en, it, pr, em, hk });
  const p = (u, en, it, pr, em, hk) => items.push({ id: 'p-' + slug(en), u, en, it, pr, em, hk, k: 'p' });

  w('ciao', 'hello', 'ciao', 'hel-lóu', '👋', 'Come Hello Kitty!');
  w('ciao', 'yes', 'sì', 'iès', '👍', 'Yes! Si grida quando si vince.');
  w('ciao', 'no', 'no', 'nóu', '🙅‍♀️', 'Come in italiano, con una "u" in fondo.');
  w('ciao', 'bye', 'ciao (quando vai via)', 'bài', '🚶‍♀️', 'Bye bye! Si saluta con la manina.');
  w('ciao', 'please', 'per favore', 'plìis', '🙏', 'Plìis, con gli occhioni dolci.');
  w('ciao', 'thank you', 'grazie', 'tènk iù', '💐', 'Si dice quando ricevi un regalo.');

  w('animali', 'horse', 'cavallo', 'hòrs', '🐴', 'Hòrs! Il cavallo corre forte.');
  w('animali', 'bunny', 'coniglietto', 'bàni', '🐰', 'Come Bugs Bunny, il coniglio dei cartoni.');
  w('animali', 'dog', 'cane', 'dòg', '🐶', 'Dog fa "bau bau".');
  w('animali', 'cat', 'gatto', 'kèt', '🐱', 'Cat è corto corto, come la coda di un gattino che scappa.');
  w('animali', 'cow', 'mucca', 'kàu', '🐮', 'Kàu... la mucca fa "muuu".');
  w('animali', 'pig', 'maiale', 'pig', '🐷', 'Peppa Pig è una maialina!');
  w('animali', 'duck', 'papera', 'dak', '🦆', 'Paperino si chiama Donald Duck.');
  w('animali', 'sheep', 'pecora', 'sciìip', '🐑', 'Sciìip, come il verso di una pecorella timida.');

  w('colori', 'pink', 'rosa', 'pink', '🩷', 'La Pantera Rosa è la Pink Panther.');
  w('colori', 'red', 'rosso', 'rèd', '🔴', 'Red è rosso come una fragola.');
  w('colori', 'blue', 'blu', 'blùu', '🔵', 'Quasi uguale: blu!');
  w('colori', 'green', 'verde', 'grìin', '🟢', 'Grìin come l\'erba del prato.');
  w('colori', 'yellow', 'giallo', 'ièlou', '🟡', 'Ièlou come il sole.');
  w('colori', 'purple', 'viola', 'pèrpol', '🟣', 'Pèrpol: il colore dell\'unicorno.');
  w('colori', 'orange', 'arancione', 'òrinj', '🟠', 'Orange è anche l\'arancia!');
  w('colori', 'white', 'bianco', 'uàit', '⚪', 'Uàit come la neve.');
  w('colori', 'black', 'nero', 'blèk', '⚫', 'Blèk come la notte.');
  w('colori', 'brown', 'marrone', 'bràun', '🟤', 'Bràun come tanti cavalli.');

  w('numeri', 'one', 'uno', 'uàn', '1️⃣');
  w('numeri', 'two', 'due', 'tùu', '2️⃣', 'Tùu: tu e io siamo in due.');
  w('numeri', 'three', 'tre', 'thrìi', '3️⃣', 'Three e tre si somigliano.');
  w('numeri', 'four', 'quattro', 'fóor', '4️⃣', 'Il cavallo ha four zampe.');
  w('numeri', 'five', 'cinque', 'fàiv', '5️⃣', 'High five: batti il cinque!');
  w('numeri', 'six', 'sei', 'siks', '6️⃣');
  w('numeri', 'seven', 'sette', 'sèven', '7️⃣', 'Seven sono i tuoi anni!');
  w('numeri', 'eight', 'otto', 'éit', '8️⃣');
  w('numeri', 'nine', 'nove', 'nàin', '9️⃣');
  w('numeri', 'ten', 'dieci', 'tèn', '🔟', 'Ten come le dita delle mani.');

  p('presento', 'I am Babi', 'io sono Babi', 'ài em Babi', '🙋‍♀️', 'I = io, am = sono.');
  p('presento', 'I am seven', 'ho sette anni', 'ài em sèven', '7️⃣', 'In inglese si dice "io sono sette".');
  p('presento', 'What is your name?', 'come ti chiami?', 'uòt is iòr nèim', '❓', 'name = nome.');
  p('presento', 'Hello, my friend!', 'ciao, amica mia!', 'hel-lóu, mài frènd', '🤝', 'friend = amico o amica.');

  w('pappa', 'carrot', 'carota', 'kèrot', '🥕', 'Il cibo preferito dei coniglietti!');
  w('pappa', 'apple', 'mela', 'èpol', '🍎', 'Anche i cavalli adorano le mele.');
  w('pappa', 'banana', 'banana', 'banàna', '🍌', 'Uguale all\'italiano!');
  w('pappa', 'strawberry', 'fragola', 'stròberi', '🍓', 'Stròberi: lunga ma buonissima.');
  w('pappa', 'bread', 'pane', 'brèd', '🍞');
  w('pappa', 'milk', 'latte', 'milk', '🥛', 'Come la cioccolata Milka.');
  w('pappa', 'water', 'acqua', 'uóter', '💧');
  w('pappa', 'cake', 'torta', 'kéik', '🎂', 'La torta di compleanno!');

  w('famiglia', 'mum', 'mamma', 'mam', '👩', 'Mum, quasi come mamma.');
  w('famiglia', 'dad', 'papà', 'dèd', '👨', 'Dad, il papà.');
  w('famiglia', 'sister', 'sorella', 'sìster', '👭');
  w('famiglia', 'brother', 'fratello', 'bràdher', '👬');
  w('famiglia', 'baby', 'bebè', 'bèibi', '👶', 'Quasi come bebè!');
  w('famiglia', 'grandma', 'nonna', 'grènma', '👵', 'Grand-ma: la mamma grande.');
  w('famiglia', 'grandpa', 'nonno', 'grènpa', '👴', 'Grand-pa: il papà grande.');
  w('famiglia', 'friend', 'amico, amica', 'frènd', '🤝');

  w('corpo', 'eyes', 'occhi', 'àis', '👀', 'Àis: due occhi che guardano.');
  w('corpo', 'nose', 'naso', 'nóus', '👃', 'Nose e naso iniziano uguali.');
  w('corpo', 'mouth', 'bocca', 'màuth', '👄');
  w('corpo', 'ear', 'orecchio', 'ìar', '👂', 'I coniglietti hanno le ears lunghe lunghe!');
  w('corpo', 'hand', 'mano', 'hènd', '✋');
  w('corpo', 'foot', 'piede', 'fut', '🦶', 'Foot come il football: si gioca coi piedi.');
  w('corpo', 'hair', 'capelli', 'hèar', '💇‍♀️');
  w('corpo', 'teeth', 'denti', 'tìith', '🦷');

  w('maneggio', 'pony', 'pony', 'pòuni', '🎠', 'Uguale all\'italiano!');
  w('maneggio', 'ride', 'cavalcare', 'ràid', '🏇', 'Ride: si va a cavallo.');
  w('maneggio', 'run', 'correre', 'ran', '🏃‍♀️', 'Run run run, corri!');
  w('maneggio', 'jump', 'saltare', 'giamp', '🤸‍♀️', 'Il cavallo fa jump sull\'ostacolo.');
  w('maneggio', 'fast', 'veloce', 'fàst', '⚡', 'Fast fast, velocissimo!');
  w('maneggio', 'slow', 'piano, lento', 'slóu', '🐢', 'Slow come una tartaruga.');
  w('maneggio', 'big', 'grande', 'big', '🐘', 'Big come un elefante.');
  w('maneggio', 'small', 'piccolo', 'smòol', '🐭', 'Small come un topolino.');

  w('emozioni', 'happy', 'felice', 'hèpi', '😊', 'Happy come il compleanno: Happy birthday!');
  w('emozioni', 'sad', 'triste', 'sèd', '😢');
  w('emozioni', 'angry', 'arrabbiato', 'èngri', '😠');
  w('emozioni', 'sleepy', 'assonnato', 'slìipi', '😴');
  w('emozioni', 'scared', 'spaventato', 'skèard', '😱');
  w('emozioni', 'hungry', 'affamato', 'hàngri', '😋', 'Hungry: ho una fame da cavallo!');

  w('fuori', 'sun', 'sole', 'san', '☀️');
  w('fuori', 'moon', 'luna', 'mùun', '🌙', 'Mùun: la luna fa "uuu" coi lupi.');
  w('fuori', 'star', 'stella', 'stàar', '⭐', 'Star come Stella, la pony!');
  w('fuori', 'rain', 'pioggia', 'rèin', '🌧️');
  w('fuori', 'tree', 'albero', 'trìi', '🌳');
  w('fuori', 'flower', 'fiore', 'flàuer', '🌸');
  w('fuori', 'rainbow', 'arcobaleno', 'rèinbou', '🌈', 'Rain + bow: l\'arco della pioggia.');
  w('fuori', 'snow', 'neve', 'snóu', '❄️');

  w('giochi', 'ball', 'palla', 'bòol', '⚽');
  w('giochi', 'teddy bear', 'orsacchiotto', 'tèdi bèar', '🧸');
  w('giochi', 'book', 'libro', 'buk', '📖');
  w('giochi', 'bike', 'bici', 'bàik', '🚲');
  w('giochi', 'car', 'macchina', 'kàar', '🚗');
  w('giochi', 'kite', 'aquilone', 'kàit', '🪁');
  w('giochi', 'balloon', 'palloncino', 'balùun', '🎈');

  p('cuore', 'I like horses', 'mi piacciono i cavalli', 'ài làik hòrses', '🐴');
  p('cuore', 'I love my bunny', 'voglio bene al mio coniglietto', 'ài lav mài bàni', '🐰');
  p('cuore', 'My horse is white', 'il mio cavallo è bianco', 'mài hòrs is uàit', '🦄');
  p('cuore', 'Let\'s play!', 'giochiamo!', 'lèts plèi', '🎉');
  p('cuore', 'I love you, mum', 'ti voglio bene, mamma', 'ài lav iù, mam', '💗');

  root.BABI_COURSE = { units, items };
  if (typeof module === 'object' && module.exports) module.exports = root.BABI_COURSE;
})(typeof self !== 'undefined' ? self : globalThis);
