/* Il corso di Babi: capitoli in ordine, parole e frasi in ordine di apprendimento.
   Campi: id, u (capitolo), en, it, pr (come si legge, all'italiana), em (immagine), hk (trucco), k: 'p' per le frasi. */
(function (root) {
  'use strict';
  // Tre livelli: il prato (parole di base), il bosco (più parole), il castello (prime regole e frasi).
  const levels = [
    { lv: 1, title: 'Il prato', em: '🌼' },
    { lv: 2, title: 'Il bosco incantato', em: '🌳' },
    { lv: 3, title: 'Il castello dei pony', em: '🏰' },
  ];

  // tip: la regoletta del capitolo, spiegata da Stella la pony. ex: esempi da ascoltare [inglese, italiano].
  const T = (title, text, ex) => ({ title, text, ex });
  const units = [
    { id: 'ciao', lv: 1, title: 'Ciao!', em: '👋', tip: T('Salutare', 'Hello si dice a qualsiasi ora. Bye si dice quando vai via.', [['hello', 'ciao'], ['bye bye', 'ciao ciao']]) },
    { id: 'animali', lv: 1, title: 'Animali', em: '🐴', tip: T('Un animale: "a"', 'Davanti al nome si mette "a", che si legge "e": a horse, a cat.', [['a horse', 'un cavallo'], ['a cat', 'un gatto']]) },
    { id: 'colori', lv: 1, title: 'Colori', em: '🎨', tip: T('Di che colore è?', 'Per dire il colore: it is pink, cioè "è rosa".', [['It is pink', 'è rosa'], ['It is blue', 'è blu']]) },
    { id: 'numeri', lv: 1, title: 'Numeri', em: '🔢', tip: T('Contare', 'Prova a contare sulle dita in inglese!', [['one, two, three', 'uno, due, tre'], ['four, five', 'quattro, cinque']]) },
    { id: 'presento', lv: 1, title: 'Mi presento', em: '💬', tip: T('"I" vuol dire io', '"I" si legge "ài" e si scrive sempre maiuscola, anche in mezzo alla frase.', [['I am Babi', 'io sono Babi'], ['I am seven', 'ho sette anni']]) },
    { id: 'pappa', lv: 1, title: 'La pappa', em: '🥕', tip: T('Mi piace', 'I like vuol dire "mi piace". Ai coniglietti piacciono le carote!', [['I like apples', 'mi piacciono le mele'], ['I like cake', 'mi piace la torta']]) },
    { id: 'famiglia', lv: 1, title: 'Famiglia', em: '🏡', tip: T('My: mio, mia', 'My vuol dire mio o mia. Va bene per tutti: my mum, my dad.', [['my mum', 'la mia mamma'], ['my dad', 'il mio papà']]) },
    { id: 'corpo', lv: 1, title: 'Il corpo', em: '👀', tip: T('Due occhi', 'Quando sono più di uno si aggiunge una s: one hand, two hands.', [['two hands', 'due mani'], ['two eyes', 'due occhi']]) },
    { id: 'maneggio', lv: 1, title: 'Al maneggio', em: '🏇', tip: T('Grande e piccolo', 'Big e small vanno prima del nome: a big horse, a small pony.', [['a big horse', 'un cavallo grande'], ['a small pony', 'un pony piccolo']]) },
    { id: 'emozioni', lv: 1, title: 'Emozioni', em: '😊', tip: T('Come ti senti?', 'Per dire come stai: I am happy, I am sad.', [['I am happy', 'sono felice'], ['I am sleepy', 'ho sonno']]) },
    { id: 'fuori', lv: 1, title: 'Fuori', em: '🌈', tip: T('Che tempo fa?', 'It is sunny vuol dire "c\'è il sole". It is rainy: "piove".', [['It is sunny', 'c\'è il sole'], ['It is rainy', 'piove']]) },
    { id: 'giochi', lv: 1, title: 'Giochi', em: '🧸', tip: T('Giochiamo!', 'Let\'s play! vuol dire "giochiamo!". Si usa per invitare gli amici.', [['Let\'s play!', 'giochiamo!'], ['Let\'s go!', 'andiamo!']]) },
    { id: 'cuore', lv: 1, title: 'Frasi del cuore', em: '💗', tip: T('Voler bene', 'I love you si dice a chi vuoi tanto bene. I like vuol dire "mi piace".', [['I love you', 'ti voglio bene'], ['I like horses', 'mi piacciono i cavalli']]) },

    { id: 'bosco', lv: 2, title: 'Animali del bosco', em: '🦊', tip: T('Tanti animali', 'Per dire più animali si aggiunge la s: one frog, two frogs. Fox diventa foxes.', [['two frogs', 'due rane'], ['three foxes', 'tre volpi']]) },
    { id: 'vestiti', lv: 2, title: 'Vestiti', em: '👗', tip: T('Cosa indossi?', 'I wear vuol dire "indosso": I wear a dress, I wear boots.', [['I wear a hat', 'indosso un cappello'], ['I wear boots', 'indosso gli stivali']]) },
    { id: 'casa', lv: 2, title: 'La casa', em: '🏠', tip: T('Dove sei?', 'I am in the kitchen vuol dire "sono in cucina".', [['I am in the kitchen', 'sono in cucina'], ['I am in bed', 'sono a letto']]) },
    { id: 'scuola', lv: 2, title: 'A scuola', em: '🎒', tip: T('La maestra dice', 'In classe la teacher dice cose come: Open your book! Sit down!', [['Open your book!', 'apri il libro!'], ['Sit down!', 'siediti!']]) },
    { id: 'numeri2', lv: 2, title: 'Fino a 20', em: '🔟', tip: T('I numeri "-teen"', 'Dal 13 al 19 i numeri finiscono con "tìin": thirteen, fourteen... Venti si dice twenty.', [['thirteen', 'tredici'], ['fifteen', 'quindici'], ['twenty', 'venti']]) },
    { id: 'azioni', lv: 2, title: 'Cosa faccio?', em: '🤸‍♀️', tip: T('Io faccio', 'Per dire cosa fai: I + azione. I dance, I sing, I read.', [['I dance', 'io ballo'], ['I sing', 'io canto']]) },
    { id: 'contrari', lv: 2, title: 'I contrari', em: '↕️', tip: T('I contrari', 'Hot è il contrario di cold. Up è il contrario di down.', [['hot and cold', 'caldo e freddo'], ['up and down', 'su e giù']]) },
    { id: 'domande', lv: 2, title: 'Le domande', em: '❓', tip: T('Le parole delle domande', 'What vuol dire cosa. Where vuol dire dove. How many vuol dire quanti.', [['What is it?', 'cos\'è?'], ['Where is it?', 'dov\'è?'], ['How many?', 'quanti?']]) },

    { id: 'aggettivi', lv: 3, title: 'Un pony rosa', em: '🦄', tip: T('Prima il colore!', 'In inglese il colore va prima dell\'animale: a pink pony. Mai "a pony pink"!', [['a pink pony', 'un pony rosa'], ['a white horse', 'un cavallo bianco']]) },
    { id: 'plurali', lv: 3, title: 'Uno, due, tanti', em: '🐰', tip: T('Più di uno', 'Si aggiunge una s: cat, cats. Bunny diventa bunnies. Sheep invece non cambia mai!', [['two cats', 'due gatti'], ['five bunnies', 'cinque coniglietti'], ['two sheep', 'due pecore']]) },
    { id: 'sapere', lv: 3, title: 'So fare!', em: '🤸‍♀️', tip: T('Can e can\'t', 'Can vuol dire "so" o "posso". Can\'t vuol dire "non so" o "non posso".', [['I can jump', 'so saltare'], ['I can\'t fly', 'non so volare']]) },
    { id: 'dove', lv: 3, title: 'Dov\'è?', em: '📦', tip: T('In, on, under', 'In = dentro. On = sopra. Under = sotto.', [['in the box', 'dentro la scatola'], ['on the bed', 'sopra il letto'], ['under the table', 'sotto il tavolo']]) },
    { id: 'mio', lv: 3, title: 'Mio, suo', em: '🫶', tip: T('My, his, her', 'My = mio. His = di lui, her = di lei. Stella è una lei, Fiocco è un lui!', [['her name is Stella', 'il suo nome è Stella'], ['his name is Fiocco', 'il suo nome è Fiocco']]) },
    { id: 'giornata', lv: 3, title: 'La mia giornata', em: '🌅', tip: T('Buongiorno e buonanotte', 'Good morning si dice la mattina, good night la sera prima della nanna.', [['Good morning!', 'buongiorno!'], ['Good night!', 'buonanotte!']]) },
  ];

  const items = [];
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const w = (u, en, it, pr, em, hk, extra) => items.push({ id: slug(en), u, en, it, pr, em, hk, ...(extra || {}) });
  const n = (u, en, it, pr, em, num, hk) => w(u, en, it, pr, em, hk, { num });
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

  n('numeri', 'one', 'uno', 'uàn', '1️⃣', 1);
  n('numeri', 'two', 'due', 'tùu', '2️⃣', 2, 'Tùu: tu e io siamo in due.');
  n('numeri', 'three', 'tre', 'thrìi', '3️⃣', 3, 'Three e tre si somigliano.');
  n('numeri', 'four', 'quattro', 'fóor', '4️⃣', 4, 'Il cavallo ha four zampe.');
  n('numeri', 'five', 'cinque', 'fàiv', '5️⃣', 5, 'High five: batti il cinque!');
  n('numeri', 'six', 'sei', 'siks', '6️⃣', 6);
  n('numeri', 'seven', 'sette', 'sèven', '7️⃣', 7, 'Seven sono i tuoi anni!');
  n('numeri', 'eight', 'otto', 'éit', '8️⃣', 8);
  n('numeri', 'nine', 'nove', 'nàin', '9️⃣', 9);
  n('numeri', 'ten', 'dieci', 'tèn', '🔟', 10, 'Ten come le dita delle mani.');

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

  // ---------- Livello 2: il bosco incantato ----------
  w('bosco', 'fox', 'volpe', 'fòks', '🦊', 'La volpe furba: fox!');
  w('bosco', 'bear', 'orso', 'bèar', '🐻', 'Come il teddy bear, ma vero!');
  w('bosco', 'owl', 'gufo', 'àul', '🦉', 'Àul: il gufo fa "uuu" di notte.');
  w('bosco', 'frog', 'rana', 'fròg', '🐸', 'Frog, frog: la rana salta!');
  w('bosco', 'bird', 'uccellino', 'bèrd', '🐦', 'Angry Birds: gli uccellini arrabbiati.');
  w('bosco', 'butterfly', 'farfalla', 'bàterflai', '🦋', 'Butter + fly: una farfalla leggera che vola.');
  w('bosco', 'squirrel', 'scoiattolo', 'skuìrrel', '🐿️', 'Lo scoiattolo ha la coda a ricciolo.');
  w('bosco', 'hedgehog', 'riccio', 'hèjhog', '🦔', 'Il riccio è tutto spine.');

  w('vestiti', 'hat', 'cappello', 'hèt', '👒', 'Hat: il cappello sulla testa.');
  w('vestiti', 'dress', 'vestito', 'drès', '👗', 'Il vestito da principessa: dress!');
  w('vestiti', 'shoes', 'scarpe', 'sciùus', '👟', 'Le scarpe fanno "sciù sciù" quando corri.');
  w('vestiti', 'T-shirt', 'maglietta', 'tì-sciert', '👕', 'Uguale all\'italiano!');
  w('vestiti', 'socks', 'calzini', 'sòks', '🧦');
  w('vestiti', 'coat', 'cappotto', 'kóut', '🧥', 'Il coat ti tiene al caldo.');
  w('vestiti', 'boots', 'stivali', 'bùuts', '👢', 'Gli stivali per andare a cavallo!');
  w('vestiti', 'glasses', 'occhiali', 'glàsses', '👓');

  w('casa', 'house', 'casa', 'hàus', '🏠');
  w('casa', 'bed', 'letto', 'bèd', '🛏️', 'Bed: il lettino per fare la nanna.');
  w('casa', 'door', 'porta', 'dóor', '🚪', 'Una porta d\'oro: "d\'oor".');
  w('casa', 'window', 'finestra', 'uìndou', '🪟');
  w('casa', 'chair', 'sedia', 'cèer', '🪑', 'C\'era una sedia: "cèer".');
  w('casa', 'table', 'tavolo', 'téibol', '🍽️', 'Table e tavolo iniziano uguali.');
  w('casa', 'bath', 'bagnetto', 'bàth', '🛁', 'Il bagnetto con le bolle!');
  w('casa', 'kitchen', 'cucina', 'kìcen', '🍳');

  w('scuola', 'school', 'scuola', 'skùul', '🏫', 'Skùul: si scrive con la "ch" ma si legge "k".');
  w('scuola', 'teacher', 'maestra', 'tìicer', '👩‍🏫');
  w('scuola', 'pencil', 'matita', 'pènsil', '✏️');
  w('scuola', 'crayon', 'pastello', 'krèion', '🖍️');
  w('scuola', 'scissors', 'forbici', 'sìsors', '✂️');
  w('scuola', 'backpack', 'zaino', 'bèkpek', '🎒', 'Back = schiena, pack = pacco: il pacco sulla schiena!');
  w('scuola', 'ruler', 'righello', 'rùler', '📏');
  w('scuola', 'paper', 'foglio', 'pèiper', '📄');

  n('numeri2', 'eleven', 'undici', 'ilèven', '11', 11);
  n('numeri2', 'twelve', 'dodici', 'tuèlv', '12', 12);
  n('numeri2', 'thirteen', 'tredici', 'thertìin', '13', 13, 'Three + teen.');
  n('numeri2', 'fourteen', 'quattordici', 'fortìin', '14', 14, 'Four + teen.');
  n('numeri2', 'fifteen', 'quindici', 'fiftìin', '15', 15);
  n('numeri2', 'sixteen', 'sedici', 'sikstìin', '16', 16, 'Six + teen.');
  n('numeri2', 'seventeen', 'diciassette', 'seventìin', '17', 17, 'Seven + teen.');
  n('numeri2', 'eighteen', 'diciotto', 'eitìin', '18', 18);
  n('numeri2', 'nineteen', 'diciannove', 'naintìin', '19', 19, 'Nine + teen.');
  n('numeri2', 'twenty', 'venti', 'tuènti', '20', 20, 'Twenty: due volte ten.');

  w('azioni', 'eat', 'mangiare', 'ìit', '🍝', 'Iiit! Quando hai fame.');
  w('azioni', 'drink', 'bere', 'drink', '🥤');
  w('azioni', 'sleep', 'dormire', 'slìip', '🛌');
  w('azioni', 'play', 'giocare', 'plèi', '🎲', 'Play: come la PlayStation!');
  w('azioni', 'swim', 'nuotare', 'suìm', '🏊‍♀️');
  w('azioni', 'dance', 'ballare', 'dèns', '💃', 'Dance come "danza".');
  w('azioni', 'sing', 'cantare', 'sing', '🎤');
  w('azioni', 'read', 'leggere', 'rìid', '📚');
  w('azioni', 'draw', 'disegnare', 'dròo', '🖌️');
  w('azioni', 'climb', 'arrampicarsi', 'klàim', '🧗‍♀️', 'La "b" alla fine non si legge!');

  w('contrari', 'hot', 'caldo', 'hòt', '🔥', 'Hot dog: il panino caldo!');
  w('contrari', 'cold', 'freddo', 'kóuld', '🧊');
  w('contrari', 'up', 'su', 'ap', '⬆️');
  w('contrari', 'down', 'giù', 'dàun', '⬇️');
  w('contrari', 'open', 'aperto', 'óupen', '🔓');
  w('contrari', 'closed', 'chiuso', 'klóusd', '🔒');
  w('contrari', 'day', 'giorno', 'dèi', '🌞', 'Birthday: il giorno della nascita!');
  w('contrari', 'night', 'notte', 'nàit', '🌃');

  p('domande', 'What is it?', 'cos\'è?', 'uòt is it', '❓', 'what = cosa.');
  p('domande', 'It is a horse', 'è un cavallo', 'it is e hòrs', '🐴');
  p('domande', 'What colour is it?', 'di che colore è?', 'uòt kàlor is it', '🌈');
  p('domande', 'How many bunnies?', 'quanti coniglietti?', 'hàu mèni bànis', '🐰🐰🐰');
  p('domande', 'Where is the cat?', 'dov\'è il gatto?', 'uèar is dhe kèt', '🐱');
  p('domande', 'Do you like carrots?', 'ti piacciono le carote?', 'du iù làik kèrots', '🥕');
  p('domande', 'Yes, I do!', 'sì!', 'iès, ài dù', '👍', 'Si risponde così a "Do you like...?"');

  // ---------- Livello 3: il castello dei pony ----------
  p('aggettivi', 'a pink pony', 'un pony rosa', 'e pink pòuni', '🩷🐴');
  p('aggettivi', 'a white bunny', 'un coniglietto bianco', 'e uàit bàni', '🤍🐰');
  p('aggettivi', 'a brown horse', 'un cavallo marrone', 'e bràun hòrs', '🤎🐴');
  p('aggettivi', 'a big bear', 'un orso grande', 'e big bèar', '🐻');
  p('aggettivi', 'a small mouse', 'un topolino piccolo', 'e smòol màus', '🐭');
  p('aggettivi', 'a yellow duck', 'una papera gialla', 'e ièlou dak', '💛🦆');

  p('plurali', 'one cat', 'un gatto', 'uàn kèt', '🐱');
  p('plurali', 'two cats', 'due gatti', 'tùu kèts', '🐱🐱');
  p('plurali', 'three dogs', 'tre cani', 'thrìi dògs', '🐶🐶🐶');
  p('plurali', 'four horses', 'quattro cavalli', 'fóor hòrses', '🐴🐴🐴🐴');
  p('plurali', 'five bunnies', 'cinque coniglietti', 'fàiv bànis', '🐰🐰🐰🐰🐰', 'Bunny diventa bunnies.');
  p('plurali', 'two sheep', 'due pecore', 'tùu sciìip', '🐑🐑', 'Sheep non cambia mai!');

  p('sapere', 'I can jump', 'so saltare', 'ài ken giamp', '🤸‍♀️');
  p('sapere', 'I can swim', 'so nuotare', 'ài ken suìm', '🏊‍♀️');
  p('sapere', 'I can ride a horse', 'so andare a cavallo', 'ài ken ràid e hòrs', '🏇');
  p('sapere', 'Birds can fly', 'gli uccellini sanno volare', 'bèrds ken flài', '🐦');
  p('sapere', 'I can\'t fly', 'non so volare', 'ài kànt flài', '🙅‍♀️');
  p('sapere', 'Can you dance?', 'sai ballare?', 'ken iù dèns', '💃');

  p('dove', 'The bunny is in the box', 'il coniglietto è dentro la scatola', 'dhe bàni is in dhe bòks', '🐰📦');
  p('dove', 'The cat is on the bed', 'il gatto è sopra il letto', 'dhe kèt is on dhe bèd', '🐱🛏️');
  p('dove', 'The dog is under the table', 'il cane è sotto il tavolo', 'dhe dòg is ànder dhe téibol', '🐶🍽️');
  p('dove', 'The bird is in the tree', 'l\'uccellino è sull\'albero', 'dhe bèrd is in dhe trìi', '🐦🌳');

  p('mio', 'I have a bunny', 'ho un coniglietto', 'ài hèv e bàni', '🐇');
  p('mio', 'This is my mum', 'questa è la mia mamma', 'dhis is mài mam', '👩‍👧');
  p('mio', 'This is my horse', 'questo è il mio cavallo', 'dhis is mài hòrs', '🐎');
  p('mio', 'Her name is Stella', 'lei si chiama Stella', 'hèr nèim is Stella', '⭐');
  p('mio', 'His name is Fiocco', 'lui si chiama Fiocco', 'his nèim is Fiocco', '🎀');
  p('mio', 'I love my family', 'voglio bene alla mia famiglia', 'ài lav mài fèmili', '👨‍👩‍👧');

  p('giornata', 'Good morning!', 'buongiorno!', 'gud mòrning', '🌅');
  p('giornata', 'I eat breakfast', 'faccio colazione', 'ài ìit brèkfast', '🥣');
  p('giornata', 'I brush my teeth', 'mi lavo i denti', 'ài brasc mài tìith', '🪥');
  p('giornata', 'I go to school', 'vado a scuola', 'ài góu tu skùul', '🏫');
  p('giornata', 'I play with my friends', 'gioco con i miei amici', 'ài plèi uìdh mài frènds', '🤝');
  p('giornata', 'Good night!', 'buonanotte!', 'gud nàit', '😴');

  root.BABI_COURSE = { levels, units, items };
  if (typeof module === 'object' && module.exports) module.exports = root.BABI_COURSE;
})(typeof self !== 'undefined' ? self : globalThis);
