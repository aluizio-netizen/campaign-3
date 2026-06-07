// Gera prisma/media-manifest.json a partir de public/media (apenas a LISTA de
// nomes de arquivos — sem a mídia em si). Esse manifesto é versionado e usado
// por prisma/import-media.ts para criar a biblioteca no banco mesmo em
// ambientes (Render) onde public/media não está presente.
//
// Rode localmente sempre que adicionar/remover áudios ou páginas:
//   node scripts/build-media-manifest.mjs
import { readdirSync, existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const mediaDir = join(root, "public", "media");

function listSorted(dir, ext) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(ext))
    .sort((a, b) => {
      const na = parseInt(a.match(/(\d+)/)?.[1] ?? "0", 10);
      const nb = parseInt(b.match(/(\d+)/)?.[1] ?? "0", 10);
      return na - nb;
    });
}

function scan(kind, ext) {
  const base = join(mediaDir, kind);
  if (!existsSync(base)) return {};
  const out = {};
  for (const key of readdirSync(base, { withFileTypes: true })) {
    if (key.isDirectory()) {
      out[key.name] = listSorted(join(base, key.name), ext);
    }
  }
  return out;
}

const manifest = {
  generatedAt: "static", // não usar Date — manter determinístico
  audio: scan("audio", ".mp3"),
  pages: scan("pages", ".png"),
};

const outPath = join(root, "prisma", "media-manifest.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");

const tracks = Object.values(manifest.audio).reduce((s, a) => s + a.length, 0);
const pages = Object.values(manifest.pages).reduce((s, a) => s + a.length, 0);
console.log(
  `Manifesto gerado: ${tracks} faixas, ${pages} páginas -> prisma/media-manifest.json`
);
