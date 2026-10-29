# Apuração de síndico — especificação

App web para eleger o síndico na entrega de um empreendimento. Regra central: **um voto válido por apartamento**. O morador vota pelo celular escaneando um QR code no telão, sem instalar app e sem criar conta.

## Stack

- Next.js (App Router) + TypeScript, deploy na Vercel.
- PostgreSQL (Neon em produção; local via instalação própria, Docker ou branch de dev no Neon). Escolhido pelo índice único parcial nativo, que garante a R1. O MySQL não tem índice parcial.
- Drizzle ORM + drizzle-kit para migrações. O Drizzle suporta o índice parcial da regra R1.
- Zod para validar toda entrada.
- UI com o design system Lumen (`.claude/skills/lumen-design`, skill `/lumen-design`). Mobile-first.
- Testes: Vitest (regras), Playwright (fluxos), script de carga em Node.
- Atualização ao vivo por polling a cada 2 s. Sem WebSocket.

Nomes de domínio em português sem acento (`apartamento`, `eleicao`, `voto`).

## Papéis

| Papel | Acesso | O que faz |
|---|---|---|
| Eleitor | Público, sem login, pelo link/QR da eleição | Escolhe bloco e apartamento, completa o CPF ou CNPJ, vota e recebe comprovante |
| Operador (admin) | Login, papel `operador` | Cadastros, importação da planilha, candidatos, abrir/encerrar votação, painel ao vivo, desbloquear apartamento, telão, relatório |
| God (godmode) | Login, papel `god` | Tudo do operador, mais: voto pela mesa, votos por documento, anular voto, mover voto, reabrir votação, zerar eleição de teste, auditoria, usuários |

Toda ação de operador ou god grava em `log_auditoria`. Ação de godmode exige motivo e aparece no relatório final.

### Quem vê o quê

- **Eleitor:** só o próprio comprovante.
- **Telão:** quantos apartamentos já votaram. O resultado por candidato só aparece depois de publicado.
- **Operador:** quais apartamentos votaram, com nome de quem votou, horário e origem. Não vê em quem cada apartamento votou.
- **God:** tudo, inclusive em quem cada apartamento votou, votos por documento, auditoria e usuários.
- **Usuários do painel:** só o god cria e desativa. Eleitor não tem conta.

Admin e godmode são o mesmo painel, com o mesmo login. O god vê a aba Godmode e o menu Usuários a mais, e o servidor confere o papel em cada rota.

## Fluxo do eleitor (`/v/[codigo]`)

O link funciona de qualquer lugar enquanto a votação estiver aberta. Não há checagem de presença.

1. Tela inicial com empreendimento, título e status. Antes da abertura: "A votação ainda não começou" (a tela se atualiza sozinha). Depois do encerramento: "Votação encerrada".
2. Escolhe o bloco.
3. Escolhe o apartamento numa grade. Apartamento que já votou aparece desabilitado com "já votou". Apartamento bloqueado mostra "procure a mesa". Apartamento sem nenhum comprador com documento válido mostra "vote na mesa".
4. "Complete o documento do comprador": CPF para pessoa, CNPJ da empresa para apartamento comprado por empresa. Com um comprador, o campo já vem com os 3 primeiros caracteres (`126.___.___-__` ou `12.3__.___/____-__`) e a pessoa completa o resto. Com mais de um, a dica lista os prefixos ("começa com 126 ou 045") e a pessoa digita o documento inteiro.
5. Validação:
   - Dígito verificador inválido: "Documento inválido". Não conta tentativa.
   - Documento de um comprador do apartamento: segue.
   - Documento de comprador de outro apartamento do mesmo empreendimento: "Este CPF é do Bloco A, apto 302. Votar pelo 302?" Não conta tentativa. Se o documento tiver mais de um apartamento, a tela lista todos. Se o 302 já votou: "O apto 302 já votou às 19:42. Procure a mesa."
   - Qualquer outro documento: "Documento não confere. Restam N tentativas." Na 3ª falha o apartamento fica bloqueado.
6. Escolhe o candidato em cards com foto, nome, apartamento e proposta curta.
7. Confirma: "Confirmar voto em Fulano pelo Bloco A, apto 101?"
8. Comprovante com apartamento, horário e código de 6 caracteres sem caracteres ambíguos (sem 0/O/1/I). Quem tem vários apartamentos vota um por um. Se o mesmo documento tiver outro apartamento que ainda não votou, o comprovante oferece "Votar pelo Bloco 02, Ap 305" sem pedir o documento de novo.

## Telão (`/telao/[codigo]`)

Página pública, só com dados agregados. Mostra o QR code do link de voto, o título, os candidatos, "142 de 180 apartamentos votaram" e uma barra de progresso. O resultado por candidato só aparece depois que o operador clica em "Publicar resultado".

## Admin (`/admin`)

- **Login** (`/admin/login`): e-mail e senha.
- **Empreendimentos**: criar e editar, inclusive apartamentos e compradores, para corrigir documentos antes do evento. Importar de .xlsx ou .csv:
  1. Upload do arquivo.
  2. Escolher o modelo de colunas. O modelo padrão é o da planilha "Controle de Vendas" (seção abaixo). Para outra planilha, mapear as colunas à mão.
  3. Prévia com problemas. Apartamento sem nenhum documento válido (vazio, dígitos a mais ou a menos, dígito verificador errado) entra como "só pela mesa", com aviso. CPF e CNPJ valem como documento. Documento repetido em apartamentos diferentes é normal: uma pessoa ou empresa pode ter vários.
  4. Confirmar.
- **Eleições**: criar (título, empreendimento, flag `teste`). Candidatos com nome, apartamento (opcional), foto redimensionada para 400 px, proposta de até 300 caracteres e ordem de exibição.
- **Status**: `rascunho` → `aberta` → `encerrada` → `publicada`, com os botões Abrir votação, Encerrar e Publicar resultado.
- **Painel ao vivo** (`painel`): contadores (votaram, faltam, bloqueados), grade de apartamentos colorida por situação, lista dos apartamentos que só votam pela mesa e últimos votos (apartamento, nome de quem votou, horário, origem). O candidato escolhido não aparece aqui. Apartamento bloqueado tem o botão Desbloquear, que zera as tentativas.
- **Relatório** (`relatorio`): página para imprimir ou salvar em PDF com empreendimento, eleição, horários de abertura e encerramento, total de apartamentos, apartamentos que votaram, votos por candidato, vencedor, lista de apartamentos que votaram, ações de godmode com motivo e espaço para assinaturas.

## Planilha "Controle de Vendas" (modelo padrão de importação)

Layout da planilha real do Res. São Lucas:

- Uma aba por bloco, de `Bloco 01` a `Bloco 04`. O bloco vem do nome da aba. As abas `Folha1` (oculta, tipologias) e `0` (vazia) são ignoradas.
- As linhas 1 a 5 são legenda. O cabeçalho fica na linha 6 e os dados começam na 7.
- As colunas são lidas pela posição, nunca pelo nome: há dois cabeçalhos "CPF".

| Coluna | Cabeçalho | Uso |
|---|---|---|
| A | Unidade | `Ap 101`, `Ap 502 PCD` ou `Box Extra 101`. O número é o primeiro grupo de dígitos; o rótulo inteiro aparece na tela. |
| B | Status | `VENDIDO` ou `PERMUTA`, com maiúsculas e minúsculas misturadas. Só informativo. |
| E | Comprador | Nome do comprador 1. |
| F | CPF | CPF ou CNPJ do comprador 1, como texto (`999.999.999-99` ou `99.999.999/9999-99`). |
| H | Cônjuge | Nome do comprador 2 (opcional). |
| I | CPF | CPF do comprador 2 (opcional). |

- Linhas `Box Extra` não são apartamentos e não votam. A importação ignora essas linhas e lista na prévia.
- As demais colunas (e-mail, telefones, valores, cobrança, corretor, contrato) nunca são importadas.
- Variações que o importador precisa tratar: documento vazio, CNPJ na coluna de CPF (vale como documento da empresa), CPF com 10 ou 12 dígitos, dígito verificador errado, status em minúsculas, sufixo `PCD` na unidade.
- Unidade em cessão: o Comprador vem como `Nome antigo-Cessão Nome novo`. O importador usa o nome que vem depois de "Cessão" e avisa na prévia para conferir se o CPF e o cônjuge já são do novo comprador. Se o cônjuge for do comprador antigo, ele não pode continuar cadastrado.
- Situação em 28/10/2026 (`Controle de Vendas Res. São Lucas3.xlsx`): 176 apartamentos e 3 boxes. 157 apartamentos votam por documento (153 por CPF e 4 por CNPJ) e 19 só pela mesa: 17 de permuta sem documento (4 pessoas) e 2 vendidos sem documento, deixados de lado por enquanto. Nenhum documento malformado. 13 CPFs aparecem em mais de um apartamento (até 3).

## Godmode (`/admin/eleicoes/[id]/god`, papel `god`)

- Voto pela mesa: o god seleciona um ou mais apartamentos que ainda não votaram (por padrão, os "só pela mesa") e informa nome e documento de quem vota, mais o motivo. A pessoa escolhe o candidato no tablet. Grava um voto por apartamento, com origem `mesa`. Assim o dono de permuta vota por todos os seus apartamentos de uma vez.
- Votos por documento: tabela com documento mascarado (`126.***.***-**`), nome, quantos apartamentos o documento tem no cadastro e quantos já votaram, do maior para o menor. Abrindo a linha, aparece cada apartamento com "votou às 19:42 em Fulano" ou "não votou".
- Buscar voto por apartamento ou comprovante. Só aqui aparece o candidato escolhido.
- Anular voto (motivo obrigatório): o status vira `anulado` e o apartamento fica livre para votar de novo.
- Mover voto para outro apartamento (motivo obrigatório). Falha se o destino já tem voto válido.
- Reabrir votação encerrada (motivo obrigatório).
- Zerar eleição, apenas quando `teste = true`.
- Auditoria: lista do `log_auditoria` com filtros.
- Usuários: criar e desativar operadores e gods.

## Regras que o código e os testes garantem

- **R1** — Um voto válido por apartamento por eleição. Quem tem vários apartamentos vota uma vez por apartamento. Quem garante é o índice parcial `um_voto_por_apto`, não a tela.
- **R2** — O servidor só aceita voto com a eleição `aberta`, checado na hora de gravar.
- **R3** — O documento (CPF ou CNPJ) precisa ser de um comprador do apartamento. Compara só letras e dígitos, sem pontuação (`123.456.789-09` = `12345678909`). O CNPJ pode ser alfanumérico (formato novo da Receita, a partir de julho de 2026): no cálculo do dígito verificador, cada caractere vale o código ASCII menos 48.
- **R4** — Documento com dígito verificador inválido não conta tentativa.
- **R5** — Três documentos válidos que não conferem bloqueiam o apartamento até o operador desbloquear. O contador sobe com incremento atômico no banco.
- **R6** — Documento de outro apartamento do empreendimento gera sugestão dos apartamentos certos e não conta tentativa. Um documento pode ter vários apartamentos.
- **R7** — Voto anulado nunca é apagado. A única exceção é zerar uma eleição de teste.
- **R8** — Toda ação de operador ou god grava log. Ação de godmode exige motivo.
- **R9** — Não limitar por IP: o Wi-Fi do evento e o 4G das operadoras compartilham IP entre muitas pessoas.
- **R10** — A API pública nunca devolve nome nem documento, apenas os 3 primeiros caracteres do documento na dica.
- **R11** — O resultado por candidato só fica público com a eleição `publicada`.
- **R12** — Voto pela mesa só pelo godmode, com nome, documento e motivo, e sempre um voto por apartamento.

## Modelo de dados (PostgreSQL)

```sql
CREATE TYPE status_eleicao AS ENUM ('rascunho', 'aberta', 'encerrada', 'publicada');
CREATE TYPE status_voto    AS ENUM ('valido', 'anulado');
CREATE TYPE origem_voto    AS ENUM ('documento', 'mesa');
CREATE TYPE papel_admin    AS ENUM ('operador', 'god');

CREATE TABLE empreendimento (
  id        SERIAL PRIMARY KEY,
  nome      TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE apartamento (
  id                SERIAL PRIMARY KEY,
  empreendimento_id INT  NOT NULL REFERENCES empreendimento(id),
  bloco             TEXT NOT NULL,   -- 'Bloco 01'
  numero            TEXT NOT NULL,   -- '502'
  rotulo            TEXT NOT NULL,   -- 'Ap 502 PCD', exibido na tela
  UNIQUE (empreendimento_id, bloco, numero)
);

CREATE TABLE comprador (
  id             SERIAL PRIMARY KEY,
  apartamento_id INT  NOT NULL REFERENCES apartamento(id),
  nome           TEXT NOT NULL,
  documento      VARCHAR(14)       -- CPF (11) ou CNPJ (14), sem pontuação; null: sem documento válido
);
-- apartamento sem comprador com documento preenchido = só vota pela mesa
CREATE INDEX comprador_documento ON comprador (documento);

CREATE TABLE eleicao (
  id                SERIAL PRIMARY KEY,
  empreendimento_id INT  NOT NULL REFERENCES empreendimento(id),
  codigo            TEXT NOT NULL UNIQUE,   -- aleatório, usado no link público
  titulo            TEXT NOT NULL,
  status            status_eleicao NOT NULL DEFAULT 'rascunho',
  teste             BOOLEAN NOT NULL DEFAULT false,
  aberta_em         TIMESTAMPTZ,
  encerrada_em      TIMESTAMPTZ
);

CREATE TABLE candidato (
  id             SERIAL PRIMARY KEY,
  eleicao_id     INT  NOT NULL REFERENCES eleicao(id),
  nome           TEXT NOT NULL,
  apartamento_id INT  REFERENCES apartamento(id),
  foto           TEXT,                     -- data URL de 400 px (MVP)
  proposta       TEXT,
  ordem          INT  NOT NULL DEFAULT 0
);

CREATE TABLE situacao_apartamento (
  eleicao_id        INT     NOT NULL REFERENCES eleicao(id),
  apartamento_id    INT     NOT NULL REFERENCES apartamento(id),
  tentativas_falhas INT     NOT NULL DEFAULT 0,
  bloqueado         BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (eleicao_id, apartamento_id)
);

CREATE TABLE voto (
  id             SERIAL PRIMARY KEY,
  eleicao_id     INT  NOT NULL REFERENCES eleicao(id),
  apartamento_id INT  NOT NULL REFERENCES apartamento(id),
  candidato_id   INT  NOT NULL REFERENCES candidato(id),
  comprador_id   INT  REFERENCES comprador(id),   -- null quando origem = 'mesa'
  documento      VARCHAR(14) NOT NULL,            -- do comprador verificado ou informado na mesa
  nome           TEXT NOT NULL,                   -- de quem votou: do comprador ou informado na mesa
  origem         origem_voto NOT NULL,
  comprovante    TEXT NOT NULL UNIQUE,
  status         status_voto NOT NULL DEFAULT 'valido',
  criado_em      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- R1: 1 voto válido por apto, mesmo com 2 cliques simultâneos
CREATE UNIQUE INDEX um_voto_por_apto
  ON voto (eleicao_id, apartamento_id)
  WHERE status = 'valido';

CREATE TABLE usuario_admin (
  id         SERIAL PRIMARY KEY,
  nome       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  papel      papel_admin NOT NULL,
  ativo      BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE log_auditoria (
  id         BIGSERIAL PRIMARY KEY,
  eleicao_id INT REFERENCES eleicao(id),
  usuario_id INT REFERENCES usuario_admin(id),   -- null = ação do eleitor
  acao       TEXT NOT NULL,                      -- ex.: 'voto.anular', 'apto.desbloquear', 'documento.falha'
  alvo       TEXT,
  motivo     TEXT,
  dados      JSONB,
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## API

### Pública (sem login)

| Método | Rota | Entrada → saída |
|---|---|---|
| GET | `/api/e/[codigo]` | → `{ empreendimento, titulo, status, candidatos[] }` |
| GET | `/api/e/[codigo]/apartamentos` | → `[{ id, bloco, rotulo, jaVotou, bloqueado, soMesa }]` |
| GET | `/api/e/[codigo]/apartamentos/[id]/dica` | → `{ dicas: [{ tipo: "cpf", prefixo: "126" }] }` |
| POST | `/api/e/[codigo]/verificar` | `{ apartamentoId, documento }` → `{ ok: true, token }` ou `{ ok: false, erro, tentativasRestantes?, sugestoes? }` |
| POST | `/api/e/[codigo]/votar` | `{ token, candidatoId }` → `{ comprovante, horario, proximos? }` |
| GET | `/api/e/[codigo]/telao` | → `{ totalApartamentos, votaram, resultado? }` |

- `erro`: `documento_invalido` · `nao_confere` · `outro_apto` · `bloqueado` · `ja_votou` · `eleicao_fechada`.
- `token`: JWT assinado com `jose`, válido por 10 min, com `eleicaoId`, `apartamentoId` e `compradorId`.
- Violação do índice `um_voto_por_apto` no insert vira `ja_votou`.
- `proximos`: outros apartamentos com o mesmo documento que ainda não votaram, cada um com `{ apartamentoId, rotulo, token }`.

### Admin (`/api/admin/...`, papel `operador` ou `god`)

Login e logout, empreendimentos, importação (prévia e confirmação), apartamentos e compradores, eleições, candidatos, troca de status, dados do painel, desbloquear apartamento e relatório.

### God (papel `god`)

`eleicoes/[id]/voto-mesa` (`{ apartamentoIds, candidatoId, nome, documento, motivo }`), `eleicoes/[id]/votos-por-documento`, `votos/[id]/anular`, `votos/[id]/mover`, `eleicoes/[id]/reabrir`, `eleicoes/[id]/zerar` (só eleição de teste), `auditoria`, `usuarios`.

## Segurança

- Senha com bcrypt. Sessão em cookie `httpOnly`, `secure` e `SameSite=Lax` (iron-session).
- Todo POST do admin confere o header `Origin`.
- As rotas god checam o papel no servidor. Esconder o botão não basta.
- Segredos só em variáveis de ambiente: `DATABASE_URL`, `SESSION_SECRET`, `VOTO_TOKEN_SECRET`.
- A planilha real nunca entra no repositório. Dados de desenvolvimento e teste são fictícios.
- O CNPJ é público (dá para consultar na Receita), então protege menos que o CPF. É aceito porque o evento é informal; a tabela de votos por documento do godmode ajuda a conferir.

## Fora do MVP

- 2º turno em caso de empate. A regra será decidida depois.

## Estrutura de pastas

```
apuracao/
├─ CLAUDE.md
├─ docs/                        ESPECIFICACAO.md, ROTEIRO.md
├─ .claude/skills/lumen-design/ design system
├─ src/
│  ├─ app/
│  │  ├─ v/[codigo]/            fluxo do eleitor + comprovante
│  │  ├─ telao/[codigo]/        telão
│  │  ├─ admin/
│  │  │  ├─ login/
│  │  │  ├─ empreendimentos/[id]/   apartamentos e importação
│  │  │  ├─ eleicoes/[id]/          configuração e candidatos
│  │  │  │  ├─ painel/
│  │  │  │  ├─ relatorio/
│  │  │  │  └─ god/
│  │  │  └─ usuarios/               só god
│  │  └─ api/
│  │     ├─ e/[codigo]/             API pública
│  │     └─ admin/                  API admin e god
│  ├─ db/          schema.ts, migrations/, seed.ts
│  ├─ lib/         documento.ts, regras-voto.ts, token.ts, auth.ts, auditoria.ts, importacao.ts
│  └─ ui/          componentes e tokens do Lumen adaptados
├─ tests/          unit/, e2e/, carga/
└─ .env.example
```
