# Dia do evento

Guia da equipe para a eleição de síndico na entrega do empreendimento: produção, ensaio geral, checklist do dia e plano B em papel.

- **URL de produção:** `https://______________.vercel.app`
- **Admin:** `<URL>/admin` (login com e-mail e senha)
- **Responsável técnico (deploy, banco, god):** ______________
- **Responsável por publicar o resultado:** ______________
- **Responsável pela mesa e pelo tablet:** ______________
- **Responsável pelo plano B em papel:** ______________

## 1. Produção

O app roda na Vercel, região São Paulo (`gru1`, em `vercel.json`), com banco Neon de produção também em São Paulo. Esse banco é separado do banco de desenvolvimento do `.env`.

### Variáveis de ambiente na Vercel

| Variável | De onde vem |
|---|---|
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | Integração Neon da Vercel (aba Storage). Ninguém copia nem cola. |
| `SESSION_SECRET` | Gerado no terminal e enviado direto para a Vercel, sem aparecer na tela. |
| `VOTO_TOKEN_SECRET` | Idem. |

Para gerar e enviar um segredo, rode uma vez por variável, na pasta do projeto:

```bash
node -e "process.stdout.write(require('crypto').randomBytes(32).toString('base64url'))" | vercel env add SESSION_SECRET production --sensitive
```

Trocar `SESSION_SECRET` desloga todo mundo. Trocar `VOTO_TOKEN_SECRET` invalida quem está no meio do voto. No dia do evento, não troque nenhum dos dois.

### Comandos contra o banco de produção

Os scripts `prod:*` leem o banco de produção do arquivo `.env.producao`. O git e o `vercel deploy` ignoram esse arquivo, e o Next não o carrega.

O `vercel env pull` não serve para isso: a integração Neon marca as variáveis como sensíveis e a CLI recebe só `[SENSITIVE]`. Crie o arquivo à mão, colando os valores do painel da Vercel (Storage → banco → aba ".env.local" → Show secret):

```
DATABASE_URL=...
DATABASE_URL_UNPOOLED=...
```

| Comando | O que faz |
|---|---|
| `npm run prod:migrate` | Aplica as migrações de `src/db/migrations` no banco de produção. |
| `npm run prod:criar-god` | Cria o primeiro god. Pede nome, e-mail e senha no terminal, e a senha não aparece. Para se já houver god ativo. |
| `npm run prod:ensaio` | Cria o empreendimento fictício "Ensaio geral (fictício)" e a eleição de teste. Rodar de novo só mostra o código e a tabela de documentos. |

- Nunca rode `npm run db:seed` em produção. O seed apaga e recria dados fictícios.
- Depois de usar o `.env.producao`, apague o arquivo. Ele tem a senha do banco.
- Os próximos usuários (operadores e outros gods) são criados pelo god em `/admin/usuarios`.

### Deploy

```bash
vercel deploy --prod
```

O `.vercelignore` impede que `.env*`, planilhas (`*.xlsx`, `*.xls`, `*.csv`), `tests/` e `.claude/` subam para a Vercel. Não faça deploy no dia do evento, a não ser para corrigir um erro que impeça a votação.

## 2. Ensaio geral

Faça o ensaio no local do evento, com os aparelhos do dia: telão, tablet da mesa e celulares de 4G de operadoras diferentes.

1. Rode `npm run prod:ensaio` para obter o código da eleição de teste e a tabela de documentos fictícios. Imprima a tabela para a equipe.
2. No admin, entre com o god e abra a eleição "Ensaio geral (teste)". Clique em **Abrir votação**.
3. Abra o telão em `/telao/<código>` e confira se o QR code fica legível do fundo da sala.
4. Cada pessoa da equipe escaneia o QR com o próprio celular, no 4G, e vota com um documento da tabela.
5. Teste os casos que vão acontecer no dia:
   - CPF de outro apartamento: aparece a sugestão do apartamento certo.
   - Três CPFs válidos que não conferem: o apartamento fica bloqueado. Desbloqueie pelo **Painel**.
   - O dono de dois apartamentos (Ap 301 dos dois blocos) vota em um e recebe o convite para votar no outro.
   - O CNPJ do Bloco 02 Ap 202.
   - Voto pela mesa no godmode para o Bloco 02 Ap 302, que não tem documento. A escolha é feita no tablet.
   - Anular um voto no godmode e votar de novo no mesmo apartamento.
6. Clique em **Encerrar** e depois em **Publicar resultado**. Confira o resultado no telão.
7. Abra o **Relatório** e salve em PDF pelo navegador (Imprimir → Salvar como PDF).
8. No godmode, clique em **Zerar eleição**, com motivo. Os votos são apagados e a eleição volta para rascunho. O ensaio pode ser repetido quantas vezes for preciso.

Depois do ensaio, a eleição de teste fica zerada. O empreendimento fictício pode continuar no banco: ele não aparece na eleição real.

## 3. Preparar a eleição real (antes do dia)

1. No admin de produção, crie o empreendimento e importe a planilha "Controle de Vendas" (`.xlsx` ou `.csv`). A planilha real nunca entra no repositório nem em nenhuma pasta do projeto.
2. Revise a prévia: apartamentos sem documento válido entram como "só pela mesa". Corrija os documentos que puder no cadastro do empreendimento.
3. Crie a eleição real **sem** marcar "teste". Uma eleição sem teste não pode ser zerada, só anulada voto a voto.
4. Cadastre os candidatos: nome, apartamento, foto e proposta.
5. Crie os usuários da equipe em `/admin/usuarios`: operador para quem acompanha o painel, god só para quem faz voto pela mesa e correções.
6. Se quiser treinar com a lista real, crie uma segunda eleição **com** "teste" no mesmo empreendimento, use só voto pela mesa e zere depois. Não use documentos de moradores reais para testar.
7. Imprima as cédulas e a lista do plano B (seção 5).

## 4. Checklist do dia

### Antes de abrir

- [ ] **Sinal 4G no local:** teste com chips de pelo menos três operadoras, no ponto onde os moradores vão ficar. Se o sinal for fraco, tenha uma rede Wi-Fi para os eleitores.
- [ ] **Telão com QR funcionando:** abra `/telao/<código da eleição real>` 30 min antes. Escaneie o QR do fundo da sala e confira se ele abre a tela de votação.
- [ ] **Tablet da mesa logado:** faça login no admin com um usuário god e deixe aberto o godmode da eleição real. Deixe o carregador na tomada.
- [ ] **Cédulas de papel numeradas por apartamento (plano B):** uma por apartamento, impressas, contadas e guardadas com a urna lacrada.
- [ ] **Lista de compradores impressa** para conferir documentos no plano B, guardada com a mesa.
- [ ] **Responsável por publicar o resultado** definido e logado no admin.
- [ ] Notebook de reserva com o admin logado e carregadores para tablet, notebook e celulares.
- [ ] Abra o app alguns minutos antes. Assim o banco Neon, que adormece sem uso, já está acordado.

### Durante

- [ ] Clique em **Abrir votação** na hora anunciada.
- [ ] Acompanhe o **Painel**: votaram, faltam, bloqueados e últimos votos.
- [ ] Apartamento bloqueado: confira o documento da pessoa e clique em **Desbloquear**.
- [ ] Apartamento "só pela mesa", ou pessoa sem celular: a mesa faz o voto pela mesa no godmode, com nome, documento e motivo. A pessoa escolhe o candidato no tablet.

### No fim

- [ ] Clique em **Encerrar** no horário combinado.
- [ ] Confira no painel o total de apartamentos que votaram.
- [ ] O responsável clica em **Publicar resultado**, e o telão passa a mostrar o resultado.
- [ ] **Exportar o relatório:** abra **Relatório** e salve em PDF (Imprimir → Salvar como PDF). Guarde o PDF em dois lugares e imprima uma via para as assinaturas.
- [ ] Recolha as cédulas de papel não usadas e as listas impressas. Destrua as listas com dados pessoais depois da ata.

## 5. Plano B em papel

O plano B mantém a votação andando se o app ficar inacessível no local. Os votos já gravados no sistema continuam valendo: o banco fica na nuvem e não depende da internet do salão.

### Material (preparado antes do dia)

- Uma **cédula por apartamento**, numerada com bloco e apartamento (ex.: "Bloco 01 — Ap 502"), com os candidatos na ordem do sistema e um quadrado para marcar. Cada cédula leva também um canhoto destacável com o mesmo número.
- **Lista de compradores** por apartamento, com nome e documento. Ela serve para a mesa conferir quem vota.
- Uma **urna** (caixa lacrada), canetas e uma **folha de ocorrências** (horário, apartamento, nome, documento conferido, assinatura).

### Quando acionar

- O telão ou os celulares não abrem o app por mais de **10 minutos**, mesmo no Wi-Fi e no 4G.
- O responsável técnico anuncia o plano B em voz alta e anota o horário na folha de ocorrências.

### Passo a passo

1. **Anote quem já votou.** Se o painel ainda abrir em algum aparelho, salve ou fotografe a lista de apartamentos que votaram. Esses apartamentos não recebem cédula.
2. **Confira a pessoa.** Ela informa bloco e apartamento. A mesa confere o documento na lista de compradores, como no voto pela mesa.
3. **Entregue a cédula** daquele apartamento e registre a entrega na folha de ocorrências: horário, apartamento, nome, documento e assinatura. A mesa fica com o canhoto. Cada apartamento recebe uma única cédula. Quem tem vários apartamentos recebe uma cédula para cada um.
4. **A pessoa vota em sigilo** e deposita a cédula dobrada na urna.
5. **Volta do sistema.** Quando o app voltar, a votação continua pelo app. Quem já votou em papel não vota de novo pelo app. A mesa avisa isso na hora.
6. **Lançar o papel no sistema.** O sistema só aceita voto com a eleição aberta. Lance as cédulas **antes** de clicar em Encerrar; se a eleição já estiver encerrada, use **Reabrir** no godmode, com motivo. Depois de encerrar a votação em papel, a mesa abre a urna diante de testemunhas e lança cada cédula como voto pela mesa no godmode:
   - Selecione o apartamento da cédula e informe nome e documento de quem votou, conforme a folha de ocorrências.
   - Use o motivo "Cédula de papel nº <bloco/ap>, plano B às <horário>".
   - Escolha o candidato marcado na cédula.
7. **Apartamento que votou duas vezes.** Se o sistema recusar a cédula porque o apartamento já tem voto válido, vale o voto do sistema. A cédula é anulada e anotada na folha de ocorrências. Ninguém anula voto do sistema para trocar por papel.
8. **Cédula rasurada, em branco ou com dois candidatos:** anote como nula na folha de ocorrências e não lance no sistema.
9. **Se o sistema não voltar no dia:** conte as cédulas na frente de testemunhas e registre a contagem em ata. Quando o sistema voltar, lance as cédulas como no passo 6, encerre, publique o resultado e anexe o relatório à ata.
10. **Guarde** as cédulas, os canhotos e a folha de ocorrências lacrados junto com a ata.

O relatório final lista cada voto pela mesa com o motivo. Assim, toda cédula de papel lançada fica registrada.
