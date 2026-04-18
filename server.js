"use strict";

const express = require("express");
const path    = require("path");
const app     = express();
const PORT    = 3000;

// UI statique
app.use(express.static(path.join(__dirname, "public")));

// Stockfish WASM (requis par le Web Worker)
app.use("/stockfish", express.static(path.join(__dirname, "node_modules/stockfish/bin")));

app.listen(PORT, () => {
  console.log(`\n  ChessBot Analyzer → http://localhost:${PORT}\n`);
});
