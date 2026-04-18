#!/usr/bin/env node
/**
 * analyse.js — CLI : parse board.html, envoie à Stockfish, affiche le meilleur coup.
 *
 * Usage : node src/analyse.js [--html <path>] [--turn w|b] [--depth <n>]
 *                             [--castling <str>] [--ep <sq>]
 */
"use strict";

const fs         = require("fs");
const path       = require("path");
const initEngine = require("stockfish");
const { parsePieces, detectCastling, buildFen, formatMove } = require("./fen");

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { html: "./src/board.html", turn: "w", castling: null, ep: "-", depth: 20 };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--html")     opts.html     = args[++i];
    if (args[i] === "--turn")     opts.turn     = args[++i];
    if (args[i] === "--castling") opts.castling = args[++i];
    if (args[i] === "--ep")       opts.ep       = args[++i];
    if (args[i] === "--depth")    opts.depth    = parseInt(args[++i], 10);
  }
  return opts;
}

// Intercepte process.stdout pour filtrer le bruit du moteur WASM.
// Renvoie { restore, print } — print() écrit sur le vrai stdout.
function interceptStdout(onLine) {
  const originalWrite = process.stdout.write.bind(process.stdout);
  const print = (str) => originalWrite(str);
  let buffer = "";

  process.stdout.write = (chunk, encoding, cb) => {
    buffer += typeof chunk === "string" ? chunk : chunk.toString();
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) { if (line.trim()) onLine(line.trim(), print); }
    if (typeof encoding === "function") encoding();
    else if (typeof cb === "function") cb();
    return true;
  };

  return { restore: () => { process.stdout.write = originalWrite; }, print };
}

async function main() {
  const opts     = parseArgs();
  const htmlPath = path.resolve(opts.html);
  if (!fs.existsSync(htmlPath)) { process.stderr.write(`[ERR] Fichier introuvable : ${htmlPath}\n`); process.exit(1); }

  const pieces   = parsePieces(fs.readFileSync(htmlPath, "utf8"));
  if (Object.keys(pieces).length === 0) { process.stderr.write("[ERR] Aucune pièce trouvée.\n"); process.exit(1); }

  const castling  = opts.castling ?? detectCastling(pieces);
  const fen       = buildFen(pieces, opts.turn, castling, opts.ep);
  let lastDepth   = 0;

  const { restore, print } = interceptStdout((line, print) => {
    if (line.startsWith("info depth") && line.includes(" pv ")) {
      const dM = line.match(/depth (\d+)/);
      const sM = line.match(/score (cp|mate) (-?\d+)/);
      const pM = line.match(/ pv (\S+)/);
      if (!dM || !pM) return;
      const depth = parseInt(dM[1]);
      if (depth <= lastDepth) return;
      lastDepth = depth;
      let score = "     ";
      if (sM) score = sM[1] === "cp"
        ? `${+sM[2] >= 0 ? "+" : ""}${(+sM[2] / 100).toFixed(2)}`
        : `Mat ${Math.abs(+sM[2])}`;
      print(`  depth ${String(depth).padStart(2)}  score ${score.padStart(8)}  → ${pM[1]}\n`);
    }
    if (line.startsWith("bestmove")) {
      restore();
      const best = (line.match(/^bestmove (\S+)/) || [])[1] ?? null;
      process.stdout.write("\n══════════════════════════════════════════════\n");
      process.stdout.write(`  MEILLEUR COUP : ${best}\n`);
      process.stdout.write(`  ${formatMove(best, pieces)}\n`);
      process.stdout.write("══════════════════════════════════════════════\n\n");
      engine.sendCommand("quit");
    }
  });

  print(`\n[OK] ${Object.keys(pieces).length} pièces  |  Trait aux ${opts.turn === "w" ? "blancs" : "noirs"}  |  Profondeur : ${opts.depth}\n`);
  print(`[FEN] ${fen}\n\nAnalyse en cours...\n\n`);

  const engine = await initEngine("lite-single");
  engine.sendCommand("uci");
  engine.sendCommand("isready");
  engine.sendCommand(`position fen ${fen}`);
  engine.sendCommand(`go depth ${opts.depth}`);
}

main().catch((err) => { process.stderr.write(`[ERR] ${err.message}\n`); process.exit(1); });
