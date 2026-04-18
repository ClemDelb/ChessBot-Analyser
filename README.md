# Chesscan

[![Live](https://img.shields.io/badge/Live-chesscan.app-76c442?logo=google-chrome&logoColor=white)](https://chesscan.app/)
![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Stockfish](https://img.shields.io/badge/Stockfish-18_WASM-b58863)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)

**🌐 [https://chesscan.app/](https://chesscan.app/)**

Analyse de position d'échecs en temps réel à partir du HTML de chess.com. Colle le contenu d'un échiquier `wc-chess-board`, l'app génère le FEN et lance Stockfish 18 directement dans le navigateur via WebAssembly.

![Screenshot](public/images/img.png)

---

## Fonctionnalités

- **Parsing HTML chess.com** — extrait automatiquement les pièces depuis les classes CSS (`piece wp square-64`, etc.), dans n'importe quel ordre
- **Génération FEN** — détecte le trait, les droits de roque, construit la chaîne FEN complète
- **Analyse Stockfish 18 Lite** — moteur WASM single-thread, tourne entièrement dans le navigateur (pas de serveur d'analyse)
- **Visualisation** — échiquier rendu avec flèche SVG sur le meilleur coup, mise en surbrillance des cases
- **Barre d'évaluation** — score centipawn ou mat en N, avantage blanc/noir en temps réel
- **Tableau de progression** — suivi depth par depth pendant l'analyse

---

## Installation

```bash
git clone https://github.com/ton-repo/chessbot
cd chessbot
npm install
npm start
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## Utilisation

1. Sur chess.com, ouvrir les DevTools et copier le HTML du composant `<wc-chess-board>`
2. Coller dans la zone de texte à gauche
3. Choisir le trait (Blancs / Noirs)
4. Ajuster la profondeur si besoin (20 est amplement suffisant)
5. Cliquer **Analyser**

---

## CLI

Le projet inclut aussi deux outils en ligne de commande :

```bash
# Afficher le FEN et l'état du plateau depuis un fichier HTML
npm run fen -- --html src/board.html --turn w

# Lancer une analyse Stockfish en terminal
npm run analyse -- --html src/board.html --turn w --depth 20
```

---

## Structure

```
├── server.js               # Serveur Express (fichiers statiques + Stockfish WASM)
├── public/
│   └── index.html          # Interface web complète (UI + logique)
└── src/
    ├── fen.js              # Parsing HTML → pièces, génération FEN, formatage coups
    ├── board-to-fen.js     # CLI : afficher FEN + échiquier ASCII
    ├── analyse.js          # CLI : analyse Stockfish en terminal
    └── board.html          # Exemple de position pour les tests CLI
```
