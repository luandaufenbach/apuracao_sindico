# Roteiro em fases e agentes

Cada fase roda numa sessão nova do Claude Code, aberta nesta pasta: um agente por fase. Sessão nova mantém o contexto pequeno e gasta menos tokens. Todo agente lê `CLAUDE.md` e `docs/ESPECIFICACAO.md` antes de começar.

Uma fase só termina quando o critério "Pronto quando" passa e `/code-review` não aponta bug.

## Ordem e paralelismo

```
F0 Fundação → F1 Banco e regras ─┬─→ F2 API do voto → F3 Telas públicas ─┐
                                 └─→ F4 Admin ──────→ F5 Godmode ─────────┴─→ F6 QA e carga → F7 Deploy e evento
```

- Depois da F1, a F2 e a F4 podem rodar ao mesmo tempo, cada uma na sua sessão. Elas mexem em pastas diferentes (`api/e` e `admin`).
- A F3 pode começar junto com a F2 usando os contratos da API da especificação.
- O schema do banco fica congelado depois da F1. Se uma fase precisar mudar o banco, o agente para e pergunta.

## F0 — Fundação

- **Agente:** setup.
- **Entrega:** projeto Next.js + TypeScript na raiz desta pasta, ESLint e Prettier, Drizzle conectado ao PostgreSQL, scripts `dev`, `test`, `db:migrate` e `db:seed`, `.env.example`, git, tokens e fontes do Lumen em `src/ui/lumen` aplicados no layout, `CLAUDE.md` com convenções.
- **Pronto quando:** `npm run dev` abre uma página com fundo preto e fonte Geist, e `npm run db:migrate` roda sem erro.
- **Prompt:**
  > Leia docs/ESPECIFICACAO.md (seções Stack e Estrutura de pastas). Crie o projeto Next.js com TypeScript na raiz desta pasta sem apagar docs/ nem .claude/. Configure Drizzle + PostgreSQL: use um PostgreSQL local se houver; se não houver, peça a URL de um banco Neon. Crie os scripts dev, test, db:migrate e db:seed, o .env.example e inicie o git. Copie tokens e fontes do Lumen (.claude/skills/lumen-design) para src/ui/lumen e aplique no layout. Escreva um CLAUDE.md curto apontando para docs/ e com as convenções de nomes. Não implemente telas nem regras.

## F1 — Banco e regras

- **Agente:** dados e regras.
- **Entrega:** `src/db/schema.ts` com todas as tabelas e o índice parcial `um_voto_por_apto`, migração, `seed.ts` fictício no formato da planilha real (4 blocos com cerca de 45 unidades, 1 ou 2 compradores por apartamento, apartamentos só pela mesa, CPF com mais de um apartamento, 3 candidatos, 1 operador e 1 god), `lib/documento.ts` (CPF e CNPJ, inclusive CNPJ alfanumérico: normalizar, validar dígito verificador, prefixo), `lib/regras-voto.ts` (verificar documento, votar, bloquear, sugerir apartamento, anular, mover) e `lib/auditoria.ts`.
- **Pronto quando:** `npm test` passa com testes de R1 a R8, incluindo dois votos simultâneos no mesmo apartamento em que só um grava, e `npm run db:seed` roda.
- **Prompt:**
  > Leia docs/ESPECIFICACAO.md (Regras e Modelo de dados). Implemente o schema em Drizzle com o índice parcial um_voto_por_apto, a migração, o seed fictício, src/lib/documento.ts, src/lib/regras-voto.ts e src/lib/auditoria.ts. Escreva testes Vitest para R1 a R8, incluindo concorrência: dois votos simultâneos no mesmo apartamento, só um grava. Não crie telas nem rotas.

## F2 — API do voto

- **Agente:** backend.
- **Entrega:** rotas públicas em `src/app/api/e/[codigo]/` com validação Zod, `lib/token.ts` (JWT com `jose`) e os códigos de erro da especificação. Testes de integração das rotas.
- **Pronto quando:** os testes passam e nenhuma rota pública devolve nome, telefone ou CPF além do prefixo (R10).
- **Prompt:**
  > Leia docs/ESPECIFICACAO.md (API pública e Regras). Implemente as rotas de src/app/api/e/[codigo]/ usando src/lib/regras-voto.ts, com Zod e o token JWT de 10 minutos em src/lib/token.ts. Erro de índice único vira ja_votou. Escreva testes de integração para cada rota e para R9 a R11. Não mexa no schema nem em telas.

## F3 — Telas públicas

- **Agente:** frontend, usando a skill `/lumen-design`.
- **Entrega:** fluxo do eleitor em `/v/[codigo]` com todos os estados (aguardando abertura, encerrada, já votou, bloqueado, documento inválido, não confere, sugestão de outro apartamento), comprovante e telão em `/telao/[codigo]` com QR code (lib `qrcode`) e polling de 2 s.
- **Pronto quando:** o fluxo completo funciona num celular de 375 px contra o seed, cada estado de erro aparece, e o telão fica legível de longe.
- **Prompt:**
  > Use a skill /lumen-design. Leia docs/ESPECIFICACAO.md (Fluxo do eleitor, Telão e API pública). Implemente src/app/v/[codigo]/ e src/app/telao/[codigo]/ consumindo a API pública, mobile-first, com todos os estados de erro descritos. O telão usa polling de 2 s e só mostra resultado com a eleição publicada. Não mexa na API nem no schema.

## F4 — Admin

- **Agente:** admin.
- **Entrega:** `lib/auth.ts` (login, sessão iron-session, papéis), empreendimentos, importação com mapeamento de colunas e prévia (`lib/importacao.ts` com exceljs), eleições, candidatos com foto, troca de status, painel ao vivo com botão de desbloquear e relatório imprimível.
- **Pronto quando:** dá para importar a planilha fictícia no layout real (4 abas de bloco), conduzir uma eleição do início ao fim pelo admin e salvar o relatório em PDF pelo navegador.
- **Prompt:**
  > Use a skill /lumen-design. Leia docs/ESPECIFICACAO.md (Papéis, Admin, API admin e Segurança). Implemente login com papéis, as telas de src/app/admin/ (exceto god/ e usuarios/) e as rotas de src/app/api/admin/ correspondentes. A importação aceita .xlsx e .csv, com mapeamento manual de colunas e prévia de erros. Toda ação grava log de auditoria. Gere em tests/fixtures uma planilha fictícia no layout da seção "Planilha Controle de Vendas", com todas as variações listadas lá. Nunca use a planilha real nos testes.

## F5 — Godmode

- **Agente:** god.
- **Entrega:** tela `admin/eleicoes/[id]/god` (voto pela mesa em lote, votos por documento, buscar voto, anular, mover, reabrir, zerar eleição de teste), auditoria e `admin/usuarios`, todos com motivo obrigatório e listados no relatório.
- **Pronto quando:** operador recebe 403 nas rotas god, anular libera o apartamento para votar de novo, e mover para um apartamento que já tem voto válido falha.
- **Prompt:**
  > Leia docs/ESPECIFICACAO.md (Godmode, Regras R7, R8 e R12, Segurança). Implemente src/app/admin/eleicoes/[id]/god/, src/app/admin/usuarios/ e as rotas god em src/app/api/admin/, checando o papel no servidor. Motivo obrigatório em toda ação, gravado em log_auditoria e exibido no relatório. Teste o 403 para operador.

## F6 — QA e carga

- **Agente:** QA.
- **Entrega:** testes Playwright dos fluxos (voto com CPF e com CNPJ; documento inválido; 3 erros, bloqueio e desbloqueio; documento de outro apartamento e sugestão; já votou; anular e votar de novo; voto pela mesa em lote no godmode) e script de carga em `tests/carga` com 300 votos em 60 s.
- **Pronto quando:** tudo passa e esta consulta volta vazia depois da carga:
  ```sql
  SELECT apartamento_id, count(*)
  FROM voto
  WHERE eleicao_id = $1 AND status = 'valido'
  GROUP BY apartamento_id
  HAVING count(*) > 1;
  ```
- **Prompt:**
  > Leia docs/ESPECIFICACAO.md inteira. Escreva os testes Playwright em tests/e2e para os fluxos listados em docs/ROTEIRO.md (F6) e um script Node em tests/carga que dispara 300 votos em 60 s, incluindo votos repetidos no mesmo apartamento. No fim, rode a consulta de duplicidade do roteiro e mostre o resultado. Corrija só bugs; não adicione funcionalidades.

## F7 — Deploy e dia do evento

- **Agente:** deploy.
- **Entrega:** app na Vercel com banco Neon, variáveis de ambiente, migração em produção, usuário god inicial, eleição de teste para ensaio e `docs/DIA-DO-EVENTO.md` com o checklist.
- **Checklist do evento:** testar o sinal 4G no local; telão com QR funcionando; tablet da mesa logado; cédulas de papel numeradas por apartamento como plano B; responsável por publicar o resultado; exportar o relatório no fim.
- **Pronto quando:** a equipe faz um ensaio geral numa eleição `teste`, que depois é zerada.
- **Prompt:**
  > Leia docs/ESPECIFICACAO.md (Stack e Segurança). Prepare o deploy na Vercel com banco Neon: variáveis de ambiente, migração em produção e criação do usuário god inicial por script. Crie uma eleição de teste para o ensaio. Escreva docs/DIA-DO-EVENTO.md com o checklist do roteiro (F7) e o passo a passo do plano B em papel.
