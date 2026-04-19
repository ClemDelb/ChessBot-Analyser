# Chesscan

[![Live](https://img.shields.io/badge/Live-chesscan.app-76c442?logo=google-chrome&logoColor=white)](https://chesscan.app/)
![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Stockfish](https://img.shields.io/badge/Stockfish-18_WASM-b58863)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)

**🌐 [https://chesscan.app/](https://chesscan.app/)**

Analyseur de position d'échecs gratuit propulsé par Stockfish 18 WebAssembly, fonctionnant entièrement dans le navigateur. Compose n'importe quelle position à la main ou importe-la depuis chess.com, puis obtiens le meilleur coup, le score d'évaluation et la barre d'avantage en temps réel.

![Screenshot](public/images/screenshots/app.png)

---

## Fonctionnalités

- **Échiquier interactif** — glisse-dépose les pièces pour composer librement n'importe quelle position, clic droit pour supprimer une pièce, bouton Réinitialiser pour revenir à la position de départ
- **Import chess.com** — colle le HTML d'un élément `<wc-chess-board>` pour charger instantanément une position depuis une partie en cours ou terminée
- **Stockfish 18 WASM** — moteur qui tourne entièrement dans le navigateur via WebAssembly, aucun serveur requis
- **Flèche du meilleur coup** — flèche SVG superposée sur l'échiquier indiquant le coup recommandé
- **Barre d'évaluation** — score centipawn ou mat en N, avantage blanc/noir en temps réel
- **Tableau de progression** — suivi depth par depth pendant l'analyse
- **Plusieurs thèmes de pièces** — Cburnett, Merida, Maestro, Alpha, Fresca et d'autres via le CDN Lichess
- **Mode clair & sombre**, interface en français et en anglais

---

## Utilisation

### Méthode 1 — Échiquier interactif

1. Le plateau se charge avec toutes les pièces en position de départ
2. Glisse-dépose les pièces pour composer ta position
3. Clic droit sur une pièce pour la supprimer
4. Sélectionne à qui de jouer et clique sur **Analyser**

### Méthode 2 — Import depuis chess.com

1. Ouvre une partie sur chess.com
2. Clic droit sur l'échiquier → **Inspecter** (ou F12)
3. Repère la balise `<wc-chess-board>` → clic droit → **Copier l'élément**
4. Colle le HTML dans la zone de texte à gauche
5. Sélectionne à qui de jouer et clique sur **Analyser**

> ⚠️ Cet outil est destiné à l'analyse de parties terminées et à l'entraînement uniquement. Son utilisation pendant une partie en ligne constitue de la triche et est strictement interdite.

---

## Extension navigateur

Une extension Chrome/Brave est disponible dans le dossier `extension/`. Elle extrait la position de l'échiquier depuis chess.com en un clic et l'envoie directement à Chesscan — sans passer par les DevTools.

---

## Installation

```bash
git clone https://github.com/ton-repo/chesscan
cd chesscan
npm install
npm start
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## CLI

```bash
# Afficher le FEN et l'état du plateau depuis un fichier HTML
npm run fen -- --html src/board.html --turn w

# Lancer une analyse Stockfish en terminal
npm run analyse -- --html src/board.html --turn w --depth 20
```

---

## Structure

```
├── server.js                   # Serveur Express (fichiers statiques + Stockfish WASM)
├── extension/                  # Extension Chrome/Brave
├── public/
│   └── index.html              # Interface web complète (UI + logique)
└── src/
    ├── fen.js                  # Parsing HTML → pièces, génération FEN, formatage coups
    ├── board-to-fen.js         # CLI : afficher FEN + échiquier ASCII
    ├── analyse.js              # CLI : analyse Stockfish en terminal
    └── board.html              # Exemple de position pour les tests CLI
```
