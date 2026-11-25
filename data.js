/* Il corso: capitoli in ordine e parole/frasi in ordine di apprendimento.
   Campi: id, u (capitolo), en, it, pr (come si legge, all'italiana), em (immagine), hk (trucco per ricordare), k: 'p' per le frasi. */
(function (root) {
  'use strict';
  // Due livelli: le basi, poi in giro per il mondo (frasi vere e prime regole).
  const levels = [
    { lv: 1, title: 'Le basi', em: '🌱' },
    { lv: 2, title: 'In giro per il mondo', em: '✈️' },
  ];

  // tip: la regoletta del capitolo, con esempi da ascoltare [inglese, italiano].
  const T = (title, text, ex) => ({ title, text, ex });
  const units = [
    { id: 'saluti', lv: 1, title: 'Ciao!', sub: 'I saluti', em: '👋', tip: T('Hello e hi', 'Hello va bene sempre. Hi è più amichevole, si usa con amici e familiari.', [['hello', 'ciao'], ['goodbye', 'arrivederci']]) },
    { id: 'persone', lv: 1, title: 'Io e te', sub: 'Le persone', em: '💑', tip: T('"I" sempre maiuscola', 'I vuol dire "io" e si scrive sempre con la maiuscola, anche in mezzo alla frase.', [['I love you', 'ti amo']]) },
    { id: 'frasi1', lv: 1, title: 'Piacere!', sub: 'Le prime frasi', em: '💬', tip: T('Come stai?', 'A "How are you?" si risponde quasi sempre "I am fine, thank you".', [['How are you?', 'come stai?'], ['I am fine, thank you', 'sto bene, grazie']]) },
    { id: 'famiglia', lv: 1, title: 'Famiglia', sub: 'Mamma, papà e gli altri', em: '🏡', tip: T('My non cambia', 'My vuol dire mio, mia, miei, mie: è sempre uguale.', [['my mother', 'mia madre'], ['my family', 'la mia famiglia']]) },
    { id: 'bar', lv: 1, title: 'Al bar', sub: 'Cose da bere e mangiare', em: '☕', tip: T('A e an', 'Per dire "un, una" si usa a: a coffee. Davanti a una vocale diventa an: an apple.', [['a coffee', 'un caffè'], ['an apple', 'una mela']]) },
    { id: 'frasi2', lv: 1, title: 'Ordinare', sub: 'Frasi per il bar', em: '🧾', tip: T('Please alla fine', 'Aggiungi please alla fine e ogni richiesta diventa gentile.', [['A coffee, please', 'un caffè, per favore'], ['Water, please', 'acqua, per favore']]) },
    { id: 'numeri', lv: 1, title: 'Numeri', sub: 'Da 1 a 10', em: '🔢', tip: T('Contare', 'Dopo il 12, i numeri fino al 19 finiscono in "-teen": thirteen, fourteen...', [['one, two, three', 'uno, due, tre'], ['thirteen', 'tredici']]) },
    { id: 'colori', lv: 1, title: 'Colori', sub: 'Il rosa e gli altri', em: '🎨', tip: T('Prima il colore', 'Il colore va prima del nome: a pink dress, mai "a dress pink".', [['a pink dress', 'un vestito rosa'], ['a red car', 'una macchina rossa']]) },
    { id: 'casa', lv: 1, title: 'Casa', sub: 'Le cose di casa', em: '🏠', tip: T('The vale per tutto', 'The vuol dire il, lo, la, i, gli, le. Uno solo per tutti!', [['the door', 'la porta'], ['the keys', 'le chiavi']]) },
    { id: 'frasi3', lv: 1, title: 'Aiuto!', sub: 'Frasi salva-vita', em: '🛟', tip: T('Dire di no', 'Per dire "non" si mette don\'t davanti al verbo.', [['I don\'t understand', 'non capisco'], ['I don\'t know', 'non lo so']]) },
    { id: 'giorni', lv: 1, title: 'Giorni', sub: 'La settimana', em: '📅', tip: T('Giorni con la maiuscola', 'In inglese i giorni si scrivono sempre con la maiuscola. "Lunedì" si dice on Monday.', [['on Monday', 'lunedì'], ['See you on Friday', 'ci vediamo venerdì']]) },
    { id: 'verbi', lv: 1, title: 'Azioni', sub: 'I primi verbi', em: '🏃‍♀️', tip: T('Mi piace e vorrei', 'I like = mi piace. I want = voglio. I would like = vorrei, più gentile.', [['I like coffee', 'mi piace il caffè'], ['I would like a tea', 'vorrei un tè']]) },
    { id: 'viaggio', lv: 1, title: 'In vacanza', sub: 'Viaggi e SPA', em: '🏖️', tip: T('In vacanza', 'I am on holiday vuol dire "sono in vacanza".', [['I am on holiday', 'sono in vacanza'], ['a room for two', 'una camera per due']]) },
    { id: 'frasi4', lv: 1, title: 'Amore', sub: 'Frasi del cuore', em: '💗', tip: T('Gli auguri', 'Per fare gli auguri: Happy + la festa.', [['Happy birthday!', 'buon compleanno!'], ['Happy new year!', 'buon anno!']]) },

    { id: 'essere', lv: 2, title: 'Essere', sub: 'I am, you are, she is', em: '🪞', tip: T('Il verbo essere', 'I am, you are, he is, she is, we are, they are. Parlando si accorcia: I\'m, you\'re, she\'s.', [['I am tired', 'sono stanca'], ['she is happy', 'lei è felice'], ['they are here', 'loro sono qui']]) },
    { id: 'avere', lv: 2, title: 'Avere', sub: 'I have, she has', em: '🎁', tip: T('Il verbo avere', 'I have, you have, we have. Ma con he e she: has. Per dire no: I don\'t have.', [['I have a dog', 'ho un cane'], ['she has a cat', 'lei ha un gatto'], ['I don\'t have time', 'non ho tempo']]) },
    { id: 'ora', lv: 2, title: 'Che ore sono?', sub: 'Orari e momenti', em: '🕒', tip: T('Le ore', 'O\'clock per le ore precise: three o\'clock. Half past vuol dire "e mezza".', [['three o\'clock', 'le tre in punto'], ['half past seven', 'le sette e mezza']]) },
    { id: 'ristorante', lv: 2, title: 'Al ristorante', sub: 'Ordinare e pagare', em: '🍽️', tip: T('Vorrei', 'I would like vuol dire "vorrei": è il modo gentile di ordinare. Si accorcia in I\'d like.', [['I would like the fish', 'vorrei il pesce'], ['I\'d like a salad', 'vorrei un\'insalata']]) },
    { id: 'negozi', lv: 2, title: 'Shopping', sub: 'Negozi e prezzi', em: '🛍️', tip: T('Quanto costa?', 'How much is it? e How much does it cost? vogliono dire tutte e due "quanto costa?".', [['How much is it?', 'quanto costa?'], ['It is too expensive', 'è troppo caro']]) },
    { id: 'strada', lv: 2, title: 'Chiedere la strada', sub: 'Destra, sinistra, dritto', em: '🗺️', tip: T('Destra e sinistra', 'Left = sinistra, right = destra, straight on = dritto. Turn left = gira a sinistra.', [['turn left', 'gira a sinistra'], ['turn right', 'gira a destra']]) },
    { id: 'meteo', lv: 2, title: 'Che tempo fa?', sub: 'Il meteo', em: '🌦️', tip: T('Il tempo di adesso', 'It is sunny = c\'è il sole. It is raining = sta piovendo. La fine -ing dice che succede adesso.', [['It is sunny', 'c\'è il sole'], ['It is raining', 'sta piovendo']]) },
    { id: 'passato', lv: 2, title: 'Ieri', sub: 'Il passato', em: '⏮️', tip: T('Il passato', 'Molti verbi aggiungono -ed: play diventa played. Alcuni cambiano: go → went, eat → ate, is → was. Per le domande si usa did.', [['I played', 'ho giocato'], ['we went', 'siamo andati'], ['Did you sleep well?', 'hai dormito bene?']]) },
    { id: 'salute', lv: 2, title: 'Dal medico', sub: 'Salute e farmacia', em: '🩺', tip: T('Mi fa male', 'Per dire dove fa male: my + parte del corpo + hurts. My head hurts = mi fa male la testa.', [['My head hurts', 'mi fa male la testa'], ['I need a doctor', 'ho bisogno di un medico']]) },
    { id: 'parlare', lv: 2, title: 'Due chiacchiere', sub: 'Conoscere qualcuno', em: '🗣️', tip: T('Di dove sei?', 'Where are you from? vuol dire "di dove sei?". Si risponde: I am from Italy.', [['Where are you from?', 'di dove sei?'], ['I am from Italy', 'sono italiana']]) },
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

  // ---------- Livello 2: in giro per il mondo ----------
  p('essere', 'I am tired', 'sono stanca', 'ài em tàierd', '🥱', 'tired = stanco, stanca.');
  p('essere', 'You are beautiful', 'sei bellissima', 'iù ar biùtiful', '🌹');
  p('essere', 'He is my husband', 'lui è mio marito', 'hi is mài hàsband', '🤵', 'he = lui.');
  p('essere', 'She is my daughter', 'lei è mia figlia', 'sci is mài dóoter', '👧', 'she = lei.');
  p('essere', 'We are happy', 'siamo felici', 'uì ar hèpi', '🥰', 'we = noi.');
  p('essere', 'They are at home', 'sono a casa', 'dhèi ar et hóum', '🏡', 'they = loro. at home = a casa.');

  p('avere', 'I have two children', 'ho due figli', 'ài hèv tùu cìldren', '👧👦', 'children = figli, bambini.');
  p('avere', 'She has a dog', 'lei ha un cane', 'sci hès e dòg', '🐶', 'Con he e she si usa has.');
  p('avere', 'Do you have a pen?', 'hai una penna?', 'du iù hèv e pèn', '🖊️', 'Le domande iniziano con do.');
  p('avere', 'I don\'t have time', 'non ho tempo', 'ài dóunt hèv tàim', '⏳');
  p('avere', 'We have a big family', 'abbiamo una famiglia grande', 'uì hèv e big fèmili', '👨‍👩‍👧‍👦');

  w('ora', 'time', 'tempo, ora', 'tàim', '⏰', 'What time is it? Che ore sono?');
  w('ora', 'morning', 'mattina', 'mòrning', '🌅', 'Good morning = buongiorno.');
  w('ora', 'afternoon', 'pomeriggio', 'aftenùun', '🌤️', 'after + noon: dopo mezzogiorno.');
  w('ora', 'evening', 'sera', 'ìivning', '🌆', 'Good evening = buonasera.');
  w('ora', 'tomorrow', 'domani', 'tumòrou', '🌄', 'See you tomorrow: ci vediamo domani.');
  w('ora', 'yesterday', 'ieri', 'ièsterdei', '🗓️', 'yester-day: il giorno prima.');
  p('ora', 'What time is it?', 'che ore sono?', 'uòt tàim is it', '🕰️');
  p('ora', 'It is three o\'clock', 'sono le tre', 'it is thrìi oklòk', '🕒', 'o\'clock = in punto.');
  p('ora', 'It is half past seven', 'sono le sette e mezza', 'it is hàf past sèven', '🕢', 'half past = e mezza.');
  p('ora', 'See you at eight', 'ci vediamo alle otto', 'sìi iù et éit', '⌚');

  w('ristorante', 'menu', 'menù', 'mèniu', '📜');
  w('ristorante', 'fish', 'pesce', 'fisc', '🐟');
  w('ristorante', 'meat', 'carne', 'mìit', '🥩', 'Meat e meet (incontrare) si dicono uguale!');
  w('ristorante', 'chicken', 'pollo', 'cìken', '🍗', 'Attenta: kitchen è la cucina, chicken il pollo.');
  w('ristorante', 'salad', 'insalata', 'sèlad', '🥗');
  w('ristorante', 'dessert', 'dolce', 'disèrt', '🍰', 'Con una s sola, desert, è il deserto!');
  w('ristorante', 'glass', 'bicchiere', 'glàs', '🥂');
  w('ristorante', 'delicious', 'buonissimo', 'dilìsciös', '😋', 'Delicious come "delizioso".');
  p('ristorante', 'A table for two, please', 'un tavolo per due, per favore', 'e téibol for tùu, plìis', '👫');
  p('ristorante', 'Can I have the menu?', 'posso avere il menù?', 'ken ài hèv dhe mèniu', '🙋‍♀️');
  p('ristorante', 'I would like the fish', 'vorrei il pesce', 'ài uùd làik dhe fisc', '🎣');
  p('ristorante', 'Some water, please', 'dell\'acqua, per favore', 'sam uóter, plìis', '🚰');
  p('ristorante', 'It was delicious', 'era buonissimo', 'it uòs dilìsciös', '🤤');

  w('negozi', 'shop', 'negozio', 'sciòp', '🏪', 'Shopping: andare per negozi.');
  w('negozi', 'money', 'soldi', 'màni', '💰');
  w('negozi', 'price', 'prezzo', 'pràis', '🏷️');
  w('negozi', 'size', 'taglia', 'sàis', '📐');
  w('negozi', 'cheap', 'economico', 'cìip', '🪙');
  w('negozi', 'expensive', 'caro', 'ikspènsiv', '💎');
  w('negozi', 'card', 'carta (di credito)', 'kàard', '💳');
  w('negozi', 'cash', 'contanti', 'kèsc', '💵', 'Cash come la cassa.');
  p('negozi', 'How much does it cost?', 'quanto costa?', 'hàu mac das it kòst', '🤔');
  p('negozi', 'Can I try it on?', 'posso provarlo?', 'ken ài trài it on', '👗', 'try on = provare un vestito.');
  p('negozi', 'Do you have a smaller size?', 'avete una taglia più piccola?', 'du iù hèv e smòoler sàis', '🤏');
  p('negozi', 'I\'ll take it', 'lo prendo', 'àil téik it', '🛍️');
  p('negozi', 'Can I pay by card?', 'posso pagare con la carta?', 'ken ài pèi bai kàard', '🏧');

  w('strada', 'left', 'sinistra', 'lèft', '⬅️');
  w('strada', 'right', 'destra', 'ràit', '➡️');
  w('strada', 'street', 'strada, via', 'strìit', '🛣️');
  w('strada', 'station', 'stazione', 'stèiscion', '🚉');
  w('strada', 'airport', 'aeroporto', 'èrport', '✈️', 'Air = aria, port = porto: il porto dell\'aria.');
  w('strada', 'train', 'treno', 'trèin', '🚆');
  w('strada', 'bus', 'autobus', 'bas', '🚌');
  w('strada', 'ticket', 'biglietto', 'tìket', '🎫', 'Ticket come lo scontrino del ticket.');
  p('strada', 'Where is the station?', 'dov\'è la stazione?', 'uèar is dhe stèiscion', '🧭');
  p('strada', 'Turn left', 'gira a sinistra', 'tèrn lèft', '↩️');
  p('strada', 'Go straight on', 'vai dritto', 'góu strèit on', '⬆️');
  p('strada', 'Is it far?', 'è lontano?', 'is it fàar', '📍');
  p('strada', 'A ticket to London, please', 'un biglietto per Londra, per favore', 'e tìket tu lànden, plìis', '🇬🇧');

  w('meteo', 'weather', 'tempo (meteo)', 'uèdher', '🌦️');
  w('meteo', 'rain', 'pioggia', 'rèin', '🌧️');
  w('meteo', 'snow', 'neve', 'snóu', '❄️');
  w('meteo', 'wind', 'vento', 'uìnd', '🌬️', 'Il windsurf si fa col vento.');
  w('meteo', 'cloud', 'nuvola', 'klàud', '☁️', 'Il cloud del telefono: le foto sulla nuvola!');
  w('meteo', 'hot', 'caldo', 'hòt', '🥵', 'Hot dog: il panino caldo.');
  w('meteo', 'cold', 'freddo', 'kóuld', '🥶');
  w('meteo', 'warm', 'tiepido', 'uòrm', '🧣');
  p('meteo', 'What is the weather like?', 'che tempo fa?', 'uòt is dhe uèdher làik', '🌤️');
  p('meteo', 'It is sunny today', 'oggi c\'è il sole', 'it is sàni tudéi', '😎');
  p('meteo', 'It is raining', 'sta piovendo', 'it is rèining', '☔');
  p('meteo', 'It is very cold', 'fa molto freddo', 'it is vèri kóuld', '⛄');

  p('passato', 'I was at home', 'ero a casa', 'ài uòs et hóum', '🛋️', 'was = ero, era.');
  p('passato', 'We went to the sea', 'siamo andati al mare', 'uì uènt tu dhe sìi', '🏝️', 'went è il passato di go.');
  p('passato', 'I ate a pizza', 'ho mangiato una pizza', 'ài éit e pìtsa', '🍕', 'ate è il passato di eat.');
  p('passato', 'It was beautiful', 'è stato bellissimo', 'it uòs biùtiful', '✨');
  p('passato', 'I played with my daughter', 'ho giocato con mia figlia', 'ài plèid uìdh mài dóoter', '🧸', 'play + ed = played.');
  p('passato', 'Did you sleep well?', 'hai dormito bene?', 'did iù slìip uèl', '🛌', 'did serve per le domande al passato.');
  p('passato', 'I didn\'t understand', 'non ho capito', 'ài dìdent anderstènd', '😕');

  w('salute', 'doctor', 'medico', 'dòktor', '👩‍⚕️');
  w('salute', 'pharmacy', 'farmacia', 'fàrmasi', '🏥');
  w('salute', 'medicine', 'medicina', 'mèdsin', '💊');
  w('salute', 'head', 'testa', 'hèd', '🙆‍♀️');
  w('salute', 'tooth', 'dente', 'tùuth', '🦷', 'Un dente: tooth. Tanti denti: teeth.');
  w('salute', 'pain', 'dolore', 'pèin', '😣', 'Pain come "pena".');
  p('salute', 'I don\'t feel well', 'non mi sento bene', 'ài dóunt fìil uèl', '🤒');
  p('salute', 'My head hurts', 'mi fa male la testa', 'mài hèd hèrts', '🤕');
  p('salute', 'I need a doctor', 'ho bisogno di un medico', 'ài nìid e dòktor', '🩺');
  p('salute', 'Where is the pharmacy?', 'dov\'è la farmacia?', 'uèar is dhe fàrmasi', '⚕️');

  p('parlare', 'Where are you from?', 'di dove sei?', 'uèar ar iù from', '🌍');
  p('parlare', 'I am from Italy', 'sono italiana', 'ài em from ìtali', '🇮🇹');
  p('parlare', 'I live in Italy', 'vivo in Italia', 'ài liv in ìtali', '🏘️');
  p('parlare', 'Do you speak Italian?', 'parli italiano?', 'du iù spìik itàlian', '💬');
  p('parlare', 'I speak a little English', 'parlo un po\' di inglese', 'ài spìik e lìtol ìnglisc', '🤏');
  p('parlare', 'What do you do?', 'che lavoro fai?', 'uòt du iù dù', '💼', 'Letteralmente: cosa fai?');
  p('parlare', 'Me too!', 'anch\'io!', 'mi tùu', '🙌');

  root.COURSE = { levels, units, items };
  if (typeof module === 'object' && module.exports) module.exports = root.COURSE;
})(typeof self !== 'undefined' ? self : globalThis);
