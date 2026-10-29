# Apuração de síndico

App web para eleger o síndico na entrega de um empreendimento: um voto válido por apartamento.

## Fonte da verdade

- `docs/ESPECIFICACAO.md`: regras, modelo de dados, API, segurança e estrutura de pastas.
- `docs/ROTEIRO.md`: fases F0 a F7. Cada fase roda numa sessão nova; leia a sua fase antes de começar.
- Design: skill `/lumen-design` (`.claude/skills/lumen-design`). Tokens e fontes ficam em `src/ui/lumen`, aplicados no layout raiz.

## Convenções

- Nomes de domínio em português sem acento: `apartamento`, `bloco`, `eleicao`, `voto`, `candidato`.
- Interface em pt-BR: textos, mensagens de erro, datas e `lang="pt-BR"`.
- Toda entrada é validada com Zod.
- Segredos só em variáveis de ambiente (`.env`, modelo em `.env.example`).
- A planilha real nunca entra no repositório; `*.xlsx` está no `.gitignore`. Seed e testes usam dados fictícios gerados por código.
- O schema do banco congela depois da F1. Se precisar mudar, pare e pergunte.
- Scripts fora do Next (seed etc.) importam `src/db/carregar-env.ts` antes de ler `process.env`.
- Commits e PRs sem atribuição ao Claude: nada de `Co-Authored-By` nem "Generated with Claude Code". O único autor é o dono do repositório.
- Commit e push só quando o usuário pedir.

## Comandos

- `npm run dev`: servidor de desenvolvimento em http://localhost:3000.
- `npm test`: Vitest (`tests/unit`).
- `npm run lint`, `npm run typecheck`, `npm run format`.
- `npm run db:generate`: gera migração a partir de `src/db/schema.ts`.
- `npm run db:migrate`: aplica as migrações de `src/db/migrations` no `DATABASE_URL`.
- `npm run db:seed`: popula o banco com dados fictícios.

@AGENTS.md
