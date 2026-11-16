/* Il corso: capitoli in ordine e parole/frasi in ordine di apprendimento.
   Campi: id, u (capitolo), en, it, pr (come si legge, all'italiana), em (immagine), hk (trucco per ricordare), k: 'p' per le frasi. */
(function (root) {
  'use strict';
  const units = [
    { id: 'saluti', title: 'Ciao!', sub: 'I saluti', em: '👋' },
    { id: 'persone', title: 'Io e te', sub: 'Le persone', em: '💑' },
    { id: 'frasi1', title: 'Piacere!', sub: 'Le prime frasi', em: '💬' },
    { id: 'famiglia', title: 'Famiglia', sub: 'Mamma, papà e gli altri', em: '🏡' },
    { id: 'bar', title: 'Al bar', sub: 'Cose da bere e mangiare', em: '☕' },
    { id: 'frasi2', title: 'Ordinare', sub: 'Frasi per il bar', em: '🧾' },
    { id: 'numeri', title: 'Numeri', sub: 'Da 1 a 10', em: '🔢' },
    { id: 'colori', title: 'Colori', sub: 'Il rosa e gli altri', em: '🎨' },
    { id: 'casa', title: 'Casa', sub: 'Le cose di casa', em: '🏠' },
    { id: 'frasi3', title: 'Aiuto!', sub: 'Frasi salva-vita', em: '🛟' },
    { id: 'giorni', title: 'Giorni', sub: 'La settimana', em: '📅' },
    { id: 'verbi', title: 'Azioni', sub: 'I primi verbi', em: '🏃‍♀️' },
    { id: 'viaggio', title: 'In vacanza', sub: 'Viaggi e SPA', em: '🏖️' },
    { id: 'frasi4', title: 'Amore', sub: 'Frasi del cuore', em: '💗' },
  ];

  const items = [];
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const w = (u, en, it, pr, em, hk) => items.push({ id: slug(en), u, en, it, pr, em, hk });
  const p = (u, en, it, pr, em, hk) => items.push({ id: 'p-' + slug(en), u, en, it, pr, em, hk, k: 'p' });

  // 1. Saluti
  w('saluti', 'hello', 'ciao', 'hel-lóu', '👋', 'Come Hello Kitty: la gattina che ti saluta.');
  w('saluti', 'yes', 'sì', 'iès', '👍', 'Yes! Si grida quando si vince: sì!');
  w('saluti', 'no', 'no', 'nóu', '🙅‍♀️', 'Come in italiano, ma finisce con una "u": nóu.');
  w('saluti', 'please', 'per favore', 'plìis', '🙏', 'Plìis... detto con gli occhi dolci: per favore!');
  w('saluti', 'thank you', 'grazie', 'tènk iù', '💐', 'thank = ringraziare, you = te: ti ringrazio.');
  w('saluti', 'sorry', 'scusa', 'sòri', '😅', 'Chi dice "sòri" sorride per farsi perdonare.');
  w('saluti', 'goodbye', 'arrivederci', 'gud-bài', '🚶‍♀️', 'good = buono, bye = ciao: un "buon ciao".');
  w('saluti', 'hi', 'ehi, ciao (veloce)', 'hài', '🙋‍♀️', 'Corto e simpatico: "hài", come in "hai visto?"');

  // 2. Persone
  w('persone', 'I', 'io', 'ài', '🙋‍♀️', '"Ahi!" dico io quando mi faccio male. Si scrive sempre maiuscola.');
  w('persone', 'you', 'tu', 'iù', '👉', 'Come YouTube: il canale dove trasmetti tu.');
  w('persone', 'love', 'amore', 'lav', '❤️', 'Love story: una storia d\'amore.');
  w('persone', 'friend', 'amico, amica', 'frènd', '🤝', 'Come la serie "Friends": gli amici.');
  w('persone', 'man', 'uomo', 'mèn', '👨', 'Superman, Spider-Man: tutti uomini.');
  w('persone', 'woman', 'donna', 'uùman', '👩', 'Wonder Woman: la donna meravigliosa.');
  w('persone', 'wife', 'moglie', 'uàif', '👰‍♀️', 'Come il Wi-Fi: la moglie è sempre connessa al cuore.');
  w('persone', 'husband', 'marito', 'hàs-band', '🤵', '"Has band": il marito ha la sua band.');

  // 3. Prime frasi
  p('frasi1', 'How are you?', 'come stai?', 'hàu ar iù', '😊', 'how = come, are = stai, you = tu.');
  p('frasi1', 'I am fine', 'sto bene', 'ài em fàin', '😌', 'fine = bene. Una cosa "fine" è una cosa che va bene.');
  p('frasi1', 'My name is Giupli', 'mi chiamo Giupli', 'mài nèim is Giupli', '📛', 'name = nome: "il mio nome è Giupli".');
  p('frasi1', 'Nice to meet you', 'piacere di conoscerti', 'nàis tu mìit iù', '🤗', 'nice = bello. Vuol dire: è bello conoscerti.');

  // 4. Famiglia
  w('famiglia', 'mother', 'mamma, madre', 'màdher', '👩‍👧', 'Mother e mamma iniziano con la "m". Il "th" si dice con la lingua tra i denti.');
  w('famiglia', 'father', 'papà, padre', 'fàdher', '👨‍👧', 'Father e padre: cambia solo la prima lettera.');
  w('famiglia', 'family', 'famiglia', 'fèmili', '👨‍👩‍👧‍👦', 'Quasi uguale: family, famiglia.');
  w('famiglia', 'baby', 'bimbo piccolo', 'bèibi', '👶', 'Quasi come "bebè".');
  w('famiglia', 'sister', 'sorella', 'sìster', '👭', 'Come il film "Sister Act": le sorelle che cantano.');
  w('famiglia', 'brother', 'fratello', 'bràdher', '👬', 'Big Brother è il Grande Fratello.');
  w('famiglia', 'son', 'figlio', 'san', '👦', 'Si dice come "sun", il sole: il figlio è il tuo sole.');
  w('famiglia', 'daughter', 'figlia', 'dóoter', '👧', 'Sembra "dottore": tua figlia farà la dottoressa. La "gh" non si legge.');

  // 5. Al bar
  w('bar', 'coffee', 'caffè', 'kòfi', '☕', 'Quasi come caffè, ma si dice "kòfi".');
  w('bar', 'water', 'acqua', 'uóter', '💧', 'Come il "water" del bagno: c\'è sempre l\'acqua!');
  w('bar', 'tea', 'tè', 'tìi', '🍵', 'Il tè, con una "i" lunga: tìi.');
  w('bar', 'milk', 'latte', 'milk', '🥛', 'Come la Milka: cioccolato al latte.');
  w('bar', 'cake', 'torta', 'kéik', '🎂', 'Come il plumcake e il cake design: le torte.');
  w('bar', 'sugar', 'zucchero', 'sciùgar', '🍬', 'Sciùgar: lo zucchero si scioglie nel caffè.');
  w('bar', 'bread', 'pane', 'brèd', '🍞', 'Brad Pitt mangia il pane: Brad, bread.');
  w('bar', 'wine', 'vino', 'uàin', '🍷', 'Wine e vino: tutti e due hanno "in".');

  // 6. Ordinare
  p('frasi2', 'A coffee, please', 'un caffè, per favore', 'e kòfi, plìis', '☕', 'Due parole che conosci già: coffee e please.');
  p('frasi2', 'How much is it?', 'quanto costa?', 'hàu mac is it', '💶', 'how much = quanto. Si chiede alla cassa.');
  p('frasi2', 'Thank you very much', 'grazie mille', 'tènk iù vèri mac', '🥰', 'very much = moltissimo: grazie moltissimo.');
  p('frasi2', 'The bill, please', 'il conto, per favore', 'dhe bil, plìis', '🧾', 'bill = conto. Come la "bolletta".');

  // 7. Numeri
  w('numeri', 'one', 'uno', 'uàn', '1️⃣', 'One, "uàn": come "uno" detto in fretta.');
  w('numeri', 'two', 'due', 'tùu', '2️⃣', 'Tùu: tu e io siamo in due.');
  w('numeri', 'three', 'tre', 'thrìi', '3️⃣', 'Three e tre si somigliano. Lingua tra i denti per il "th".');
  w('numeri', 'four', 'quattro', 'fóor', '4️⃣', 'Quattro amici "fuori": four.');
  w('numeri', 'five', 'cinque', 'fàiv', '5️⃣', 'High five: batti il cinque!');
  w('numeri', 'six', 'sei', 'siks', '6️⃣', 'Six e sei iniziano tutti e due con la "s".');
  w('numeri', 'seven', 'sette', 'sèven', '7️⃣', 'Seven e sette: quasi gemelli.');
  w('numeri', 'eight', 'otto', 'éit', '8️⃣', 'Éit: la "gh" non si legge, come in daughter.');
  w('numeri', 'nine', 'nove', 'nàin', '9️⃣', 'Nine e nove: tutte e due con la "n".');
  w('numeri', 'ten', 'dieci', 'tèn', '🔟', '"Tèn-go" dieci dita.');

  // 8. Colori
  w('colori', 'pink', 'rosa', 'pink', '🩷', 'La Pantera Rosa è la "Pink Panther". Il tuo colore!');
  w('colori', 'red', 'rosso', 'rèd', '🔴', 'Red Bull: il toro rosso.');
  w('colori', 'blue', 'blu', 'blùu', '🔵', 'Quasi uguale all\'italiano: blu.');
  w('colori', 'green', 'verde', 'grìin', '🟢', 'Il green pass era verde.');
  w('colori', 'yellow', 'giallo', 'ièlou', '🟡', 'Yellow Submarine dei Beatles: il sottomarino giallo.');
  w('colori', 'white', 'bianco', 'uàit', '⚪', 'White Christmas: il Natale bianco.');
  w('colori', 'black', 'nero', 'blèk', '⚫', 'Black Friday: il venerdì nero degli sconti.');
  w('colori', 'purple', 'viola', 'pèrpol', '🟣', 'Purple come porpora: il viola dei re.');

  // 9. Casa
  w('casa', 'house', 'casa', 'hàus', '🏠', 'Il Dottor House: si chiama proprio "casa".');
  w('casa', 'door', 'porta', 'dóor', '🚪', 'Una porta d\'oro: "d\'oor".');
  w('casa', 'key', 'chiave', 'kìi', '🔑', 'Chi apre la porta? La chiave: "kìi".');
  w('casa', 'bed', 'letto', 'bèd', '🛏️', 'Bed & Breakfast: letto e colazione.');
  w('casa', 'window', 'finestra', 'uìndou', '🪟', 'Windows del computer: le finestre.');
  w('casa', 'kitchen', 'cucina', 'kìcen', '🍳', 'Kitchen somiglia a "chicken", il pollo: si cucina in cucina.');
  w('casa', 'table', 'tavolo', 'téibol', '🍽️', 'Table e tavolo: iniziano tutti e due con "ta".');
  w('casa', 'chair', 'sedia', 'cèer', '🪑', 'C\'era una sedia: "cèer".');

  // 10. Aiuto!
  p('frasi3', 'Can you help me?', 'mi puoi aiutare?', 'ken iù hèlp mi', '🆘', 'help = aiuto, come la canzone dei Beatles.');
  p('frasi3', 'I don\'t understand', 'non capisco', 'ài dóunt anderstènd', '🤷‍♀️', 'don\'t = non. Ti salva in ogni situazione.');
  p('frasi3', 'Can you repeat, please?', 'puoi ripetere, per favore?', 'ken iù ripìit, plìis', '🔁', 'repeat = ripetere: quasi uguale!');
  p('frasi3', 'Where is the bathroom?', 'dov\'è il bagno?', 'uèer is dhe bàthrum', '🚻', 'where = dove. bath = bagno, room = stanza.');

  // 11. Giorni
  w('giorni', 'today', 'oggi', 'tudéi', '📍', 'to-day: questo giorno, cioè oggi.');
  w('giorni', 'Monday', 'lunedì', 'màndei', '🌙', 'Moon day: il giorno della luna. Anche "lunedì" viene da luna!');
  w('giorni', 'Tuesday', 'martedì', 'tiùsdei', '✌️', '"Tue" ricorda "two": il secondo giorno della settimana.');
  w('giorni', 'Wednesday', 'mercoledì', 'uènsdei', '✉️', 'Si scrive con una "d" che non si legge: si dice "uènsdei".');
  w('giorni', 'Thursday', 'giovedì', 'thèrsdei', '🔨', 'Thor\'s day: il giorno di Thor e del suo martello.');
  w('giorni', 'Friday', 'venerdì', 'fràidei', '🍤', 'Fry day: il giorno del fritto di pesce.');
  w('giorni', 'Saturday', 'sabato', 'sèterdei', '🪐', 'Saturn day: il giorno di Saturno.');
  w('giorni', 'Sunday', 'domenica', 'sàndei', '☀️', 'Sun day: il giorno del sole.');

  // 12. Azioni
  w('verbi', 'eat', 'mangiare', 'ìit', '🍝', 'Una "i" lunga, come chi ha fame: iiit!');
  w('verbi', 'drink', 'bere', 'drink', '🥤', 'Come il drink al bar.');
  w('verbi', 'sleep', 'dormire', 'slìip', '😴', 'Quasi come "slip", ma con la "i" lunga: slìip.');
  w('verbi', 'go', 'andare', 'góu', '🏃‍♀️', 'Ready, steady, go! Pronti, partenza, via!');
  w('verbi', 'like', 'piacere', 'làik', '😍', 'Come i "like" sui social: mi piace!');
  w('verbi', 'want', 'volere', 'uònt', '🤲', 'I want = io voglio.');
  w('verbi', 'see', 'vedere', 'sìi', '👀', 'Sìi, vedo! "See" si dice come il nostro "sì".');
  w('verbi', 'help', 'aiutare', 'hèlp', '🛟', 'Help! dei Beatles: aiuto!');

  // 13. In vacanza
  w('viaggio', 'hotel', 'albergo', 'houtèl', '🏨', 'Uguale all\'italiano, con l\'accento in fondo: houtèl.');
  w('viaggio', 'room', 'camera', 'rùum', '🛎️', 'Il room service ti porta tutto in camera.');
  w('viaggio', 'sea', 'mare', 'sìi', '🌊', 'Sea e see si dicono uguale: vedo il mare!');
  w('viaggio', 'beach', 'spiaggia', 'bìic', '🏖️', 'Bìic suona come "bici": in spiaggia in bici.');
  w('viaggio', 'sun', 'sole', 'san', '🌞', 'Come Sunday, il giorno del sole.');
  w('viaggio', 'relax', 'rilassarsi', 'rilèks', '🧖‍♀️', 'Quasi uguale: relax, come alla SPA del 20 novembre!');
  w('viaggio', 'towel', 'asciugamano', 'tàuel', '🛁', 'Tàuel somiglia a "tovaglia".');
  w('viaggio', 'swim', 'nuotare', 'suìm', '🏊‍♀️', 'Swimming pool è la piscina.');

  // 14. Amore
  p('frasi4', 'I love you', 'ti amo', 'ài lav iù', '💗', 'I = io, love = amo, you = te. La frase più bella.');
  p('frasi4', 'Happy birthday!', 'buon compleanno!', 'hèpi bèrthdei', '🎂', 'birth = nascita, day = giorno: il giorno in cui sei nata.');
  p('frasi4', 'Good night', 'buona notte', 'gud nàit', '🌙', 'night = notte. Good = buono, come in goodbye.');
  p('frasi4', 'See you tomorrow', 'ci vediamo domani', 'sìi iù tumòrou', '👋', 'see = vedere, tomorrow = domani.');

  root.COURSE = { units, items };
  if (typeof module === 'object' && module.exports) module.exports = root.COURSE;
})(typeof self !== 'undefined' ? self : globalThis);
