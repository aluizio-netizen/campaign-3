/**
 * Gera prisma/book-text.json a partir dos .txt de OCR do material do livro.
 *
 * Os ARQUIVOS .txt são do usuário (digitalização do próprio exemplar) e o
 * resultado é versionado APENAS em repositório privado, servido atrás de login.
 *
 * Fatiamento por coleção:
 *   - book-a: txt do Adobe -> separa por form-feed (\f)
 *   - book-b / exercises: txt do script de OCR -> separa por "===== PAGINA n / N ====="
 *
 * Uso:
 *   node scripts/build-book-text.mjs
 *
 * Sobrescreva os caminhos de origem com env vars se necessário:
 *   BOOK_A_TXT, BOOK_B_TXT, EXERCISES_TXT
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const DL = path.join(os.homedir(), "Downloads");

const SOURCES = {
  "book-a": {
    file: process.env.BOOK_A_TXT ?? path.join(DL, "Adobe Scan 06 de jun. de 2026 (1).txt"),
    expected: 100,
    split: "formfeed",
  },
  "book-b": {
    file: process.env.BOOK_B_TXT ?? path.join(DL, "Campaign3_2.txt"),
    expected: 46,
    split: "marker",
  },
  exercises: {
    file: process.env.EXERCISES_TXT ?? path.join(DL, "Campaign3_Exc.txt"),
    expected: 96,
    split: "marker",
  },
};

const MARKER = /=+\s*PAGINA\s+\d+\s*\/\s*\d+\s*=+/gi;

function splitFormfeed(raw) {
  return raw.split("\f");
}

function splitMarker(raw) {
  // Remove o preâmbulo antes do 1º marcador, depois separa nos marcadores.
  const parts = raw.split(MARKER);
  if (parts.length > 1) parts.shift(); // descarta o que vem antes da PAGINA 1
  return parts;
}

function normalise(pages, expected, key) {
  let out = pages.map((p) => p.replace(/\r/g, "").trim());
  // Remove um último fragmento totalmente vazio (típico de trailing \f).
  while (out.length > expected && out[out.length - 1] === "") out.pop();

  if (out.length > expected) {
    console.warn(`  ⚠ ${key}: ${out.length} blocos > ${expected} esperados. Juntando excedente na última página.`);
    const head = out.slice(0, expected - 1);
    const tail = out.slice(expected - 1).join("\n\n");
    out = [...head, tail];
  } else if (out.length < expected) {
    console.warn(`  ⚠ ${key}: ${out.length} blocos < ${expected} esperados. Preenchendo o restante com vazio.`);
    while (out.length < expected) out.push("");
  }
  return out;
}

function main() {
  const result = {};
  for (const [key, cfg] of Object.entries(SOURCES)) {
    if (!fs.existsSync(cfg.file)) {
      console.warn(`  ⚠ ${key}: arquivo não encontrado — ${cfg.file}. Pulando.`);
      result[key] = [];
      continue;
    }
    const raw = fs.readFileSync(cfg.file, "utf8");
    const blocks = cfg.split === "formfeed" ? splitFormfeed(raw) : splitMarker(raw);
    const pages = normalise(blocks, cfg.expected, key);
    const nonEmpty = pages.filter((p) => p.length > 0).length;
    result[key] = pages;
    console.log(`  ✔ ${key}: ${pages.length} páginas (${nonEmpty} com texto)`);
  }

  const outPath = path.join(process.cwd(), "prisma", "book-text.json");
  fs.writeFileSync(outPath, JSON.stringify(result), "utf8");
  const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
  console.log(`\n✅ Gerado ${outPath} (${kb} KB)`);
}

main();
