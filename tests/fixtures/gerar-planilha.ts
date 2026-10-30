// Grava a planilha fictícia em disco para testar a importação pelo navegador:
//   npx tsx tests/fixtures/gerar-planilha.ts [caminho.xlsx]
// O .gitignore ignora *.xlsx, então o arquivo gerado nunca entra no git.
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { gerarPlanilhaControleVendas } from "./planilha-controle-vendas";

const destino = resolve(
  process.argv[2] ?? "tests/fixtures/controle-vendas-ficticio.xlsx",
);
gerarPlanilhaControleVendas()
  .then((conteudo) => writeFile(destino, conteudo))
  .then(() => console.log(`Planilha fictícia gravada em ${destino}`));
