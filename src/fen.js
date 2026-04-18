"use strict";

// ── Correspondance cssClass → lettre FEN ─────────────────────────────────────
const CSS_TO_FEN = {
  wp: "P", wn: "N", wb: "B", wr: "R", wq: "Q", wk: "K",
  bp: "p", bn: "n", bb: "b", br: "r", bq: "q", bk: "k",
};

const PIECE_NAMES = { P:"Pion", N:"Cavalier", B:"Fou", R:"Tour", Q:"Dame", K:"Roi" };
const PROMO_NAMES = { q:"Dame", r:"Tour", b:"Fou", n:"Cavalier" };
const FILE_LETTER = ["", "a", "b", "c", "d", "e", "f", "g", "h"];

// Positions initiales pour détecter les droits de roque
// square-XY : X=col(1=a…8=h), Y=rang
const CASTLING_STARTS = {
  K: { king: "51", rook: "81" },  // e1, h1
  Q: { king: "51", rook: "11" },  // e1, a1
  k: { king: "58", rook: "88" },  // e8, h8
  q: { king: "58", rook: "18" },  // e8, a8
};

/**
 * Extrait les pièces d'un fragment HTML contenant des divs chess.com.
 * @param {string} html
 * @returns {Object} pieces — clé "XY" (ex "64" = f4), valeur lettre FEN
 */
function parsePieces(html) {
  const pieces = {};
  const re = /class="piece\s([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const classes = m[1].split(/\s+/);
    const square  = classes.find(c => /^square-\d{2}$/.test(c));
    const type    = classes.find(c => CSS_TO_FEN[c]);
    if (square && type) pieces[square.slice(7)] = CSS_TO_FEN[type];
  }
  return pieces;
}

/**
 * Détecte les droits de roque en cherchant rois et tours sur cases initiales.
 * @param {Object} pieces
 * @returns {string} ex: "KQkq" ou "-"
 */
function detectCastling(pieces) {
  let r = "";
  for (const [right, { king, rook }] of Object.entries(CASTLING_STARTS)) {
    const kingLetter = right === right.toUpperCase() ? "K" : "k";
    const rookLetter = right === right.toUpperCase() ? "R" : "r";
    if (pieces[king] === kingLetter && pieces[rook] === rookLetter) r += right;
  }
  return r || "-";
}

/**
 * Construit la chaîne FEN complète.
 * @param {Object} pieces
 * @param {string} turn  "w" | "b"
 * @param {string} castling
 * @param {string} ep    case en-passant ou "-"
 * @returns {string} FEN
 */
function buildFen(pieces, turn, castling, ep) {
  const ranks = [];
  for (let rank = 8; rank >= 1; rank--) {
    let s = ""; let empty = 0;
    for (let file = 1; file <= 8; file++) {
      const letter = pieces[`${file}${rank}`];
      if (letter) { if (empty) { s += empty; empty = 0; } s += letter; }
      else empty++;
    }
    if (empty) s += empty;
    ranks.push(s);
  }
  return `${ranks.join("/")} ${turn} ${castling} ${ep} 0 1`;
}

/**
 * Formate un coup UCI (ex "d2d3") en description lisible.
 * @param {string} move   coup UCI (4 ou 5 caractères)
 * @param {Object} pieces état du plateau avant le coup
 * @returns {string}
 */
function formatMove(move, pieces) {
  if (!move || move === "(none)") return "Aucun coup trouvé.";

  const fromFile = move.charCodeAt(0) - 96;
  const fromRank = parseInt(move[1]);
  const toFile   = move.charCodeAt(2) - 96;
  const toRank   = parseInt(move[3]);
  const promo    = move[4];

  const piece    = pieces[`${fromFile}${fromRank}`];
  const captured = pieces[`${toFile}${toRank}`];
  const pieceName = piece ? PIECE_NAMES[piece.toUpperCase()] : "?";
  const color     = piece && piece === piece.toUpperCase() ? "blanc" : "noir";

  let desc = `${pieceName} ${color}  ${move.slice(0, 2)} → ${move.slice(2, 4)}`;
  if (captured) {
    const capColor = captured === captured.toUpperCase() ? "blanc" : "noir";
    desc += `  ×  ${PIECE_NAMES[captured.toUpperCase()]} ${capColor}`;
  }
  if (promo) desc += `  →  ${PROMO_NAMES[promo] || promo}`;
  return desc;
}

module.exports = { parsePieces, detectCastling, buildFen, formatMove, CSS_TO_FEN, PIECE_NAMES, FILE_LETTER };
