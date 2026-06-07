/**
 * Importa a mídia real do curso (áudios + páginas escaneadas) já extraída em
 * public/media para o banco, criando a biblioteca e o curso "Campaign 3".
 *
 * Os ARQUIVOS são do usuário (hospedados localmente). Esta importação só
 * registra caminhos/ordem — não lê nem reproduz o conteúdo textual do material.
 *
 * Rode com: npm run db:import-media
 */
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const db = new PrismaClient();
const PUBLIC = path.join(process.cwd(), "public", "media");

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
    const files = listSorted(dir, ".mp3");
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
    const files = listSorted(dir, ".png");
    if (files.length === 0) {
      console.warn(`  ⚠ Sem páginas em ${c.key} (${dir})`);
      continue;
    }
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
          })),
        },
      },
    });
    totalPages += files.length;
    console.log(`  ✔ ${c.title}: ${files.length} páginas`);
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
