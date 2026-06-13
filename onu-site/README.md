# ONU & Model UN — site de trabalho do delegado (Aluizio Educação)

Site **estático** (HTML + CSS + JS, sem backend) para o aluno estudar e preencher
os materiais de preparação para simulações Model UN. O progresso é salvo
automaticamente no navegador do aluno (`localStorage`) — nada é enviado a servidores.

## Conteúdo / seções

- **Curso** — planejamento aula por aula (5 aulas, blocos de tempo).
- **Glossário** — termos ONU/MUN com busca.
- **Órgãos** — tabela “qual órgão para qual problema”.
- **Procedimento** — cheat sheet de moções e pontos.
- **Documentos** — editores de *Position Paper* e *Draft Resolution* (salvam sozinhos) + banco de verbos.
- **Fundos** — passo a passo de obtenção de recursos + worksheet.
- **Blocos** — mapa de aliados/oposição e roteiro do discurso de abertura.
- **Checklist** — pré-simulação + rubrica de autoavaliação.
- **Exemplo** — caso resolvido (crise humanitária no Chifre da África) com botão para carregar nos formulários.

## Rodar localmente

Abra o `index.html` no navegador (duplo clique). Para servir via HTTP:

```bash
cd onu-site
python3 -m http.server 8000
# acesse http://localhost:8000
```

## Publicar em onu.aluizio.education

O site é 100% estático — qualquer host de site estático serve. Em todos os casos,
defina **a pasta `onu-site/` como diretório de publicação** (publish directory) e
**sem comando de build**.

### Opção A — Netlify / Vercel / Cloudflare Pages
1. Crie um novo site/projeto apontando para este repositório.
2. Build command: *(vazio)*. Publish directory: `onu-site`.
3. Em **Domains**, adicione `onu.aluizio.education`.
4. No seu DNS, crie um registro **CNAME** `onu` apontando para o host indicado
   pela plataforma (ex.: `seu-site.netlify.app`).

### Opção B — Render (Static Site)
1. New → **Static Site**, conecte o repositório.
2. Publish directory: `onu-site`. Build command: *(vazio)*.
3. Settings → Custom Domain → `onu.aluizio.education` e siga o CNAME indicado.

### DNS (resumo)
| Tipo | Nome | Valor |
|------|------|-------|
| CNAME | `onu` | host fornecido pelo provedor de hospedagem |

> Propagação de DNS e emissão de HTTPS (Let's Encrypt) costumam levar de minutos a
> algumas horas.

## Personalização

- **Logo/marca:** o cabeçalho usa o monograma “AE”. Para usar a logo oficial,
  troque o `<span class="mark">` em `index.html` por `<img src="assets/logo.png" ...>`.
- **Cores:** ajuste as variáveis em `assets/styles.css` (`:root`).
- **Conteúdo:** todo o texto (aulas, glossário, exemplo etc.) está em estruturas de
  dados no topo de `assets/app.js` — fácil de editar.
- **Contato/rodapé:** edite os placeholders `[e-mail]` / `[WhatsApp]` em `index.html`.
