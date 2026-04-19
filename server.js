"use strict";

const express = require("express");
const path    = require("path");
const app     = express();
const PORT    = 3000;

// ── Security headers ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Content-Security-Policy", [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https://lichess1.org https://flagcdn.com data:",
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
    "worker-src 'self'",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join("; "));
  next();
});

// UI statique
app.use(express.static(path.join(__dirname, "public")));

// Stockfish WASM (requis par le Web Worker)
app.use("/stockfish", express.static(path.join(__dirname, "node_modules/stockfish/bin")));

app.listen(PORT, () => {
  console.log(`\n  Chesscan → http://localhost:${PORT}\n`);
});
