# Missão Inglês 🪖

Plataforma web premium para **brasileiros aprenderem inglês** voltado a contextos
de missão/operações, com progressão por níveis (A1 → B1), aulas curtas em formato
de **missões por etapas**, exercícios, flashcards, quizzes, treino de pronúncia,
**Professor de IA** e certificado.

> Interface 100% em **português do Brasil**; o conteúdo ensina **inglês** e o
> Professor IA interage principalmente em inglês, explicando em português quando
> necessário.

O nome do produto é configurável em [`src/config/site.ts`](src/config/site.ts).

---

## ✨ Funcionalidades

- **Área pública**: landing elegante (níveis, professor IA, FAQ, preço placeholder).
- **Autenticação** (NextAuth/credenciais): cadastro, login, logout, sessão JWT.
- **Dashboard** do aluno: progresso, nível atual, próxima missão, indicadores
  (aulas, quizzes, média, pronúncia, sequência).
- **Curso** em 3 níveis e **10 aulas completas** com 12 seções pedagógicas cada
  (objetivo, aquecimento, vocabulário, gramática em PT-BR, diálogo, frases,
  exercícios, quiz, missão final, checklist).
- **Quizzes** por aula com correção automática (múltipla escolha, completar,
  tradução, ordenar palavras, identificar erro) e resposta livre para IA.
- **Flashcards** com revisão por aula/nível e marcação fácil/médio/difícil.
- **Professor IA** com modos (conversação, correção, simulação, pronúncia,
  revisão, plano de estudo), histórico e modo **demo** sem API key.
- **Pronúncia**: ouvir modelo (TTS do navegador), gravar voz (MediaRecorder) e
  nota simulada — estrutura pronta para STT/avaliação real.
- **Certificado** ao concluir as aulas com aproveitamento mínimo (imprimível).
- **Painel admin**: alunos, progresso, notas, aulas, quizzes, flashcards,
  certificados, bloqueio de acesso.
- **Pagamento**: **não implementado** nesta fase (placeholder). Todos os alunos
  têm acesso liberado. Estrutura de banco pronta para integração futura
  (Stripe, Mercado Pago, Hotmart, Kiwify).

---

## 🧱 Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Prisma ORM** — SQLite no local, **PostgreSQL** em produção
- **NextAuth** (credenciais + JWT) com `bcryptjs`
- Camada de IA desacoplada (`src/lib/ai/`) com providers `demo | openai | anthropic`

### Banco de dados (importante)

O schema é **dual-provider** para rodar localmente sem infraestrutura:

- **Local (padrão):** SQLite — `DATABASE_URL="file:./dev.db"`.
- **Produção/Render:** PostgreSQL — troque uma linha no schema (veja Deploy).

Por isso o schema evita `enum` e tipos específicos de Postgres; os "enums" vivem
em [`src/lib/constants.ts`](src/lib/constants.ts).

---

## 🚀 Rodando localmente

Pré-requisitos: **Node 18+** (testado no Node 24).

```bash
# 1. Instalar dependências (gera o Prisma Client automaticamente)
npm install

# 2. Variáveis de ambiente
cp .env.example .env       # no Windows: copy .env.example .env
#   ajuste NEXTAUTH_SECRET (gere com: openssl rand -base64 32)

# 3. Criar o banco (SQLite) a partir do schema
npm run db:push

# 4. Popular dados iniciais (curso, 10 aulas, admin e aluno demo)
npm run db:seed

# 5. Subir em desenvolvimento
npm run dev
# abre em http://localhost:3000
```

### Contas demo (criadas pelo seed)

| Papel | E-mail                     | Senha      |
|-------|----------------------------|------------|
| Admin | `admin@missaoingles.com`   | `admin123` |
| Aluno | `aluno@missaoingles.com`   | `aluno123` |

> Os valores vêm de `ADMIN_EMAIL/ADMIN_PASSWORD` e `DEMO_STUDENT_*` no `.env`.
> **Troque as senhas em produção.**

### Scripts úteis

| Script              | O que faz                                            |
|---------------------|------------------------------------------------------|
| `npm run dev`       | Servidor de desenvolvimento                          |
| `npm run build`     | `prisma generate` + build de produção                |
| `npm run start`     | Servidor de produção                                 |
| `npm run db:push`   | Sincroniza o schema com o banco                      |
| `npm run db:seed`   | Popula o conteúdo inicial (aulas guiadas + contas)   |
| `npm run db:import-media` | Importa a mídia real (áudios/páginas) p/ o banco |
| `npm run db:reset`  | Recria o banco do zero e re-semeia                   |
| `npm run db:studio` | Abre o Prisma Studio                                 |
| `npm run typecheck` | Checagem de tipos                                    |

---

## 📚 Material real do curso (Campaign 3)

O curso real é montado a partir do **seu** material: os **áudios** (137 faixas) e
as **páginas escaneadas** do livro (242 páginas). A plataforma apenas **hospeda
esses arquivos** e oferece um **editor** — o texto das unidades é fornecido por
você (administrador), não gerado automaticamente a partir do livro.

> ⚠️ Material de terceiros: garanta que você tem o direito de distribuir esse
> conteúdo aos alunos antes de publicá-lo.

### Onde fica a mídia

- Áudios: `public/media/audio/<album>/track-NN.mp3`
- Páginas: `public/media/pages/<colecao>/page-NNN.png`

Essa pasta é **pesada (~600 MB)** e está no `.gitignore` (não vai para o git).

### Importar a mídia para o banco

```bash
# depois de extrair os arquivos para public/media (já feito no ambiente local)
npm run db:import-media
```

Isso cria a biblioteca (álbuns/faixas e coleções/páginas) e o curso
**Campaign 3**. Os alunos já podem ouvir os áudios e folhear o livro em
**Material do curso** no app.

### Montar as unidades (admin)

Entre como admin e vá em **Admin → Unidades**:

- Crie cada unidade (título, objetivo, texto/markdown, vocabulário).
- **Anexe** as faixas de áudio e as páginas do livro à unidade.
- **Publique** quando estiver pronta — ela aparece para os alunos.

### Produção (Render): mídia em object storage

O sistema de arquivos do Render é efêmero. Para produção, hospede `public/media`
em um bucket (Cloudflare R2 / AWS S3) e ajuste os `src` das faixas/páginas para
as URLs públicas do bucket (ou sirva por um proxy). O modelo de dados já guarda
o caminho/URL em `AudioTrack.src` e `BookPage.src`.

---

## 🤖 Configurando a IA (opcional)

Sem `AI_API_KEY`, o Professor IA funciona em **modo demonstração** (respostas
simuladas). Para ativar IA real, edite o `.env`:

```bash
AI_PROVIDER="openai"          # ou "anthropic"
AI_API_KEY="sua-chave"
AI_MODEL="gpt-4o-mini"        # ou "claude-3-5-sonnet-latest"
```

A troca de provider é feita só por variável de ambiente — veja
[`src/lib/ai/ai-provider.ts`](src/lib/ai/ai-provider.ts). Nenhuma chave é
hardcodada.

---

## ☁️ Deploy no Render

1. **PostgreSQL — automático.** Não edite o schema. O provider é definido pela
   variável **`DATABASE_PROVIDER=postgresql`** (o `render.yaml` já faz isso, e o
   build roda `scripts/set-db-provider.mjs` antes do Prisma).

2. **Via Blueprint (recomendado):** o repositório já inclui
   [`render.yaml`](render.yaml). No Render: *New → Blueprint*, selecione o repo.
   Ele cria um PostgreSQL e o Web Service com:
   - **Build:** `npm install && npm run db:provider && npx prisma db push && npm run build`
   - **Start:** `npm run start`

3. **Variáveis de ambiente** (defina as marcadas como `sync: false`):
   - `DATABASE_PROVIDER` — já definido como `postgresql` no blueprint.
   - `DATABASE_URL` — preenchido automaticamente pelo banco do Render.
   - `NEXT_PUBLIC_MEDIA_BASE_URL` — URL do bucket onde você subiu `public/media`
     (ver abaixo). Ex.: `https://cdn.seusite.com`.
   - `NEXTAUTH_SECRET` — gerado automaticamente (ou defina o seu).
   - `NEXTAUTH_URL` — a URL pública do serviço (ex.: `https://missao-ingles.onrender.com`).
   - `ADMIN_PASSWORD`, `DEMO_STUDENT_PASSWORD` — senhas fortes.
   - `AI_PROVIDER` / `AI_API_KEY` / `AI_MODEL` — opcionais (padrão demo).

4. **Suba a mídia para um bucket** (o disco do Render é efêmero):

   ```powershell
   # AWS S3
   ./scripts/upload-media.ps1 -Bucket SEU-BUCKET
   # Cloudflare R2
   ./scripts/upload-media.ps1 -Bucket SEU-BUCKET -EndpointUrl "https://<accountid>.r2.cloudflarestorage.com"
   ```

   Depois aponte `NEXT_PUBLIC_MEDIA_BASE_URL` para a URL pública do bucket/CDN.
   Os caminhos no banco (`/media/...`) são concatenados a essa base
   (ver [`src/lib/media.ts`](src/lib/media.ts)).

5. **Popular o conteúdo (uma vez):** no Shell do serviço no Render, rode:

   ```bash
   npm run db:seed            # aulas guiadas + contas demo
   npm run db:import-media    # biblioteca de áudios/páginas + curso Campaign 3
   ```

   > O seed/import **não** rodam no build automaticamente para não apagar o
   > progresso dos alunos a cada deploy. Rode-os manualmente quando quiser
   > (re)carregar o conteúdo.

### Deploy manual (sem Blueprint)

- Crie um **PostgreSQL** no Render e copie a *Internal Database URL*.
- Crie um **Web Service** (Node) apontando para o repo:
  - Build Command: `npm install && npx prisma db push && npm run build`
  - Start Command: `npm run start`
  - Defina as variáveis acima.
- Rode `npm run db:seed` uma vez no Shell.

---

## 🗂️ Estrutura do projeto

```
prisma/
  schema.prisma          # modelos (User, Course, Level, Lesson, Quiz, ...)
  seed.ts                # popula curso, 10 aulas, admin e aluno demo
src/
  app/
    (app)/               # área autenticada (dashboard, curso, aula, quiz, ...)
      admin/             # painel administrativo
    api/                 # rotas de API (auth, register, progress, quiz, ai, ...)
    login/  cadastro/    # autenticação
    page.tsx             # landing pública
  components/
    ui/                  # primitivos (Button, Card, Input, Badge, ...)
    app/                 # componentes da área logada (chat IA, quiz, flashcards)
    public/  shared/     # layout público e componentes compartilhados
  content/               # conteúdo das 10 aulas (TypeScript tipado) + seed source
  lib/
    ai/                  # camada de IA (provider demo/openai/anthropic)
    auth.ts db.ts queries.ts progress.ts quiz.ts constants.ts utils.ts
  config/site.ts         # ⚙️ nome/marca/preço — edite aqui para renomear
```

---

## 🔒 Segurança / qualidade

- Validação de formulários com **Zod**.
- Rotas privadas protegidas por **middleware** + checagem de sessão server-side.
- Autorização de **admin** (`requireAdmin`) nas páginas e APIs administrativas.
- Senhas com **bcrypt**; segredos só via `.env` (há `.env.example`).
- Tipagem forte e separação clara entre UI, dados (Prisma) e serviços de IA.

---

## 🧭 Roadmap (preparado, não implementado)

- Pagamento real (Stripe / Mercado Pago / Hotmart / Kiwify) — campos já no `User`.
- TTS/STT reais e avaliação de pronúncia.
- Upload de vídeos das aulas.
- Múltiplos cursos/idiomas, turmas e professores humanos.
