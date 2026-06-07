// Ajusta o `provider` da datasource em prisma/schema.prisma conforme a variável
// de ambiente DATABASE_PROVIDER (padrão "sqlite").
//
//   Local:  DATABASE_PROVIDER ausente -> "sqlite"
//   Render: DATABASE_PROVIDER="postgresql"
//
// Roda automaticamente no `npm run build` (antes do prisma generate).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "..", "prisma", "schema.prisma");

const provider = (process.env.DATABASE_PROVIDER || "sqlite").toLowerCase();
const allowed = ["sqlite", "postgresql"];
if (!allowed.includes(provider)) {
  console.error(
    `[set-db-provider] DATABASE_PROVIDER inválido: "${provider}". Use: ${allowed.join(", ")}`
  );
  process.exit(1);
}

const schema = readFileSync(schemaPath, "utf8");
// Substitui apenas a linha `provider = "..."` dentro do bloco datasource.
const updated = schema.replace(
  /(datasource db\s*\{[^}]*?provider\s*=\s*)"(?:sqlite|postgresql)"/s,
  `$1"${provider}"`
);

if (updated === schema) {
  console.log(`[set-db-provider] provider já está como "${provider}".`);
} else {
  writeFileSync(schemaPath, updated);
  console.log(`[set-db-provider] provider definido como "${provider}".`);
}
