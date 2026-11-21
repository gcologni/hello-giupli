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
