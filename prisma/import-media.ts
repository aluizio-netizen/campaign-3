/**
 * Importa a mídia real do curso (áudios + páginas escaneadas) já extraída em
 * public/media para o banco, criando a biblioteca e o curso "Campaign 3".
 *
 * Os ARQUIVOS são do usuário (digitalização do próprio exemplar). A importação
 * registra caminhos/ordem das imagens e, quando presente em prisma/book-text.json,
 * o texto OCR por página — material privado, servido somente atrás de login.
 *
 * Rode com: npm run db:import-media
 */
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const db = new PrismaClient();
const PUBLIC = path.join(process.cwd(), "public", "media");

// Manifesto versionado (lista de nomes de arquivos). Permite importar a
// biblioteca mesmo no Render, onde public/media não está presente.
type MediaManifest = {
  audio: Record<string, string[]>;
  pages: Record<string, string[]>;
};
function loadManifest(): MediaManifest | null {
  const p = path.join(process.cwd(), "prisma", "media-manifest.json");
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as MediaManifest;
  } catch {
    return null;
  }
}
const manifest = loadManifest();

// Texto OCR por página (gerado por scripts/build-book-text.mjs). Versionado
// apenas em repositório privado e servido atrás de login. Chave -> texto[].
type BookText = Record<string, string[]>;
function loadBookText(): BookText {
  const p = path.join(process.cwd(), "prisma", "book-text.json");
  if (!fs.existsSync(p)) return {};
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as BookText;
  } catch {
    return {};
  }
}
const bookText = loadBookText();

const ALBUMS = [
  { key: "album-1", title: "Áudios — Módulo 1", kind: "lesson", order: 1 },
  { key: "album-2", title: "Áudios — Módulo 2", kind: "lesson", order: 2 },
  { key: "album-3", title: "Áudios — Módulo 3", kind: "lesson", order: 3 },
  { key: "exercises-audio", title: "Áudios — Exercícios", kind: "exercise", order: 4 },
];

const COLLECTIONS = [
  { key: "book-a", title: "Livro — Parte 1", kind: "book", order: 1 },
  { key: "book-b", title: "Livro — Parte 2", kind: "book", order: 2 },
  { key: "exercises", title: "Livro de exercícios", kind: "exercise", order: 3 },
];

function listSorted(dir: string, ext: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(ext))
    .sort((a, b) => {
      const na = parseInt(a.match(/(\d+)/)?.[1] ?? "0", 10);
      const nb = parseInt(b.match(/(\d+)/)?.[1] ?? "0", 10);
      return na - nb;
    });
}

async function main() {
  console.log("🎧 Importando mídia do Campaign 3...");

  // Limpa biblioteca anterior (idempotente).
  await db.audioAlbum.deleteMany({});
  await db.bookCollection.deleteMany({});

  // ── Áudio ──────────────────────────────────────────────────────────────
  let totalTracks = 0;
  for (const a of ALBUMS) {
    const dir = path.join(PUBLIC, "audio", a.key);
    const files = manifest?.audio?.[a.key] ?? listSorted(dir, ".mp3");
    if (files.length === 0) {
      console.warn(`  ⚠ Sem faixas em ${a.key} (${dir})`);
      continue;
    }
    await db.audioAlbum.create({
      data: {
        key: a.key,
        title: a.title,
        kind: a.kind,
        order: a.order,
        tracks: {
          create: files.map((f, i) => ({
            order: i + 1,
            title: `Faixa ${i + 1}`,
            src: `/media/audio/${a.key}/${f}`,
          })),
        },
      },
    });
    totalTracks += files.length;
    console.log(`  ✔ ${a.title}: ${files.length} faixas`);
  }

  // ── Páginas ────────────────────────────────────────────────────────────
  let totalPages = 0;
  for (const c of COLLECTIONS) {
    const dir = path.join(PUBLIC, "pages", c.key);
    const files = manifest?.pages?.[c.key] ?? listSorted(dir, ".png");
    if (files.length === 0) {
      console.warn(`  ⚠ Sem páginas em ${c.key} (${dir})`);
      continue;
    }
    const texts = bookText[c.key] ?? [];
    await db.bookCollection.create({
      data: {
        key: c.key,
        title: c.title,
        kind: c.kind,
        order: c.order,
        pages: {
          create: files.map((f, i) => ({
            order: i + 1,
            src: `/media/pages/${c.key}/${f}`,
            text: texts[i] ?? "",
          })),
        },
      },
    });
    totalPages += files.length;
    const withText = texts.filter((t) => t && t.length > 0).length;
    console.log(`  ✔ ${c.title}: ${files.length} páginas (${withText} com texto)`);
  }

  // ── Curso real (Campaign 3) ──────────────────────────────────────────────
  const course = await db.course.upsert({
    where: { slug: "campaign-3" },
    update: {},
    create: {
      slug: "campaign-3",
      title: "Campaign 3 — Inglês para Missões",
      description:
        "Curso de inglês para missões com material real (áudios e livro). As unidades são montadas pelo administrador a partir do material do curso.",
      language: "en",
      estimatedHours: 30,
    },
  });

  console.log(
    `\n✅ Importado: ${totalTracks} faixas, ${totalPages} páginas. Curso: ${course.title}`
  );
  console.log(
    "ℹ As unidades são criadas/editadas no painel admin (Admin → Unidades)."
  );
}

main()
  .catch((e) => {
    console.error("❌ Erro no import:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
