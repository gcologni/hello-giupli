# Hello Giupli

Web app per imparare l'inglese da principianti, 10-15 minuti al giorno. Si installa sull'iPhone dalla schermata Home e funziona anche senza internet.

## Come si installa sull'iPhone

1. Apri l'indirizzo dell'app in **Safari**.
2. Tocca **Condividi** (il quadrato con la freccia).
3. Scegli **Aggiungi alla schermata Home**.

I progressi restano sul telefono. Per spostarli su un altro telefono: Impostazioni → Copia il codice, poi Ripristina sul nuovo telefono.

## Come funziona

- **Lezione del giorno:** al massimo 12 ripassi e da 2 a 6 parole nuove. Il numero di novità segue l'andamento degli ultimi giorni.
- **Ripasso a intervalli** (`srs.js`): ogni parola sale di livello quando la risposta è giusta e torna dopo 1, 2, 4, 7, 14, 30 e 60 giorni. Un errore la fa scendere di due livelli.
- **Esercizi in ordine di difficoltà:** ascolta e scegli, significato, inglese da scegliere, coppie, scrittura. Le frasi si ascoltano e poi si compongono.
- **Ogni parola** ha immagine, voce inglese (anche lenta), pronuncia scritta all'italiana e un trucco per ricordarla.
- **Giorni saltati:** un giorno saltato negli ultimi 7 si recupera con un ripasso di 5 minuti, uno al giorno. Nella settimana compare come un cuore più chiaro.

## Hello Babi

Nella cartella `babi/` c'è la versione per bambini, a tema cavalli e coniglietti: `gcologni.github.io/hello-giupli/babi/`.

- Nessuna lezione giornaliera: un percorso di lezioni brevi da 2-4 parole, da fare quante volte si vuole, una dopo l'altra.
- Tre livelli: il prato (parole di base), il bosco incantato (più parole, numeri fino a 20, domande), il castello dei pony (prime regole con frasi: colore prima del nome, plurali, can, in/on/under, my/his/her).
- Ogni capitolo si apre con una regoletta di Stella, con esempi da ascoltare. A fine capitolo una gara ripassa tutto e regala una coccarda; non blocca il percorso.
- Esercizi: ascolta e scegli, figura e parola, giusto o sbagliato, quanti sono (contare in inglese), coppie, lettere in ordine, frase in ordine, completa la frase.
- Il ripasso misura il tempo in lezioni fatte, non in giorni. Ogni lezione ripassa 2-4 parole vecchie.
- Esercizi con figure e voce, lettere da mettere in ordine per le parole corte. Stelline e una figurina per ogni lezione nuova.
- Progressi e cache separati da quelli di Giupli: si possono installare tutte e due sullo stesso telefono.
- Usa `../srs.js` per la memoria delle parole; la logica delle lezioni sta in `babi/kids.js`.

## File

| File | Contenuto |
|---|---|
| `index.html` | Pagina dell'app |
| `data.js` | Il corso: capitoli, parole e frasi |
| `srs.js` | Logica del ripasso, senza interfaccia |
| `app.js` | Interfaccia |
| `style.css` | Stile |
| `sw.js` | Funzionamento offline. Cambia `VERSION` a ogni rilascio. |
| `manifest.webmanifest`, `icons/` | Nome e icona sulla schermata Home |

## Sviluppo

```sh
npm test      # test della logica del ripasso
npm start     # apre l'app su http://localhost:8000
```

Per aggiungere parole, modifica `data.js`: l'ordine nel file è l'ordine in cui vengono insegnate.

## Pubblicazione

GitHub Pages: *Settings → Pages → Deploy from a branch*, ramo `main`, cartella `/ (root)`.
