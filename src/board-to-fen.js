#!/usr/bin/env node
/**
 * board_to_fen.js — CLI : lit board.html et affiche le FEN + positions.
 *
 * Usage : node src/board_to_fen.js [--html <path>] [--turn w|b]
 *                                  [--castling <str>] [--ep <sq>]
 */
"use strict";

const fs   = require("fs");
const path = require("path");
const { parsePieces, detectCastling, buildFen, PIECE_NAMES, FILE_LETTER } = require("./fen");

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { html: "./src/board.html", turn: "w", castling: null, ep: "-" };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--html")     opts.html     = args[++i];
    if (args[i] === "--turn")     opts.turn     = args[++i];
    if (args[i] === "--castling") opts.castling = args[++i];
    if (args[i] === "--ep")       opts.ep       = args[++i];
  }
  return opts;
}

function printBoard(pieces) {
  console.log("\n  Échiquier (vue blanche) :");
  console.log("  ┌───┬───┬───┬───┬───┬───┬───┬───┐");
  for (let rank = 8; rank >= 1; rank--) {
    let row = `${rank} │`;
    for (let file = 1; file <= 8; file++) {
      row += ` ${pieces[`${file}${rank}`] || " "} │`;
    }
    console.log(" " + row);
    if (rank > 1) console.log("  ├───┼───┼───┼───┼───┼───┼───┼───┤");
  }
  console.log("  └───┴───┴───┴───┴───┴───┴───┴───┘");
  console.log("    a   b   c   d   e   f   g   h\n");
}

function main() {
  const opts     = parseArgs();
  const htmlPath = path.resolve(opts.html);
  if (!fs.existsSync(htmlPath)) { console.error(`[ERR] Fichier introuvable : ${htmlPath}`); process.exit(1); }

  const pieces   = parsePieces(fs.readFileSync(htmlPath, "utf8"));
  const count    = Object.keys(pieces).length;
  if (count === 0) { console.error("[ERR] Aucune pièce trouvée."); process.exit(1); }

  const castling = opts.castling ?? detectCastling(pieces);
  const fen      = buildFen(pieces, opts.turn, castling, opts.ep);

  console.log(`[OK] ${count} pièces trouvées.\n`);
  printBoard(pieces);
  console.log("FEN :", fen);
  console.log("\nCommandes Stockfish :");
  console.log(`  position fen ${fen}`);
  console.log(`  go depth 20`);

  console.log("\nDétail :");
  for (const [sq, letter] of Object.entries(pieces).sort()) {
    const color = letter === letter.toUpperCase() ? "blanc" : "noir";
    console.log(`  ${letter}  ${FILE_LETTER[+sq[0]]}${sq[1]}  (${PIECE_NAMES[letter.toUpperCase()]} ${color})`);
  }
}

main();
