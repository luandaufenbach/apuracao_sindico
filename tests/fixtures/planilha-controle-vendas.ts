// Planilha fictícia no layout da "Controle de Vendas" (docs/ESPECIFICACAO.md):
// abas `Bloco 01` a `Bloco 04`, `Folha1` oculta e `0` vazia, legenda nas linhas
// 1 a 5, cabeçalho na 6 com dois "CPF" e dados a partir da 7. Traz todas as
// variações que o importador precisa tratar. Os dados são gerados por código:
// a planilha real nunca entra no repositório.
import ExcelJS from "exceljs";

import { digitosCnpj, digitosCpf } from "@/lib/documento";

const cpf = (base9: string) => base9 + digitosCpf(base9);
const pontuarCpf = (d: string) =>
  `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
const pontuarCnpj = (d: string) =>
  `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;

const NOMES = ["Ana", "Bruno", "Carla", "Diego", "Elisa", "Fábio", "Gabriela"];
const SOBRENOMES = ["Almeida", "Barros", "Cardoso", "Duarte", "Esteves"];
let sequencia = 0;
function novaPessoa() {
  const n = sequencia++;
  return {
    nome: `${NOMES[n % NOMES.length]} ${SOBRENOMES[n % SOBRENOMES.length]} Fictício ${n}`,
    // Bases distintas e sem dígitos todos iguais.
    cpf: cpf(String(100_000_000 + n * 7_919).padStart(9, "0")),
  };
}

/** Documentos especiais, expostos para os testes conferirem. */
export const DOCUMENTOS = {
  cnpj: (() => {
    const base = "11222333" + "0001";
    return base + digitosCnpj(base);
  })(),
  /** CPF de um investidor com 3 apartamentos. */
  investidor: cpf("529982247"),
  /** CPF com dígito verificador errado (o certo é outro). */
  dvErrado: (() => {
    const certo = cpf("390533447");
    return certo.slice(0, 9) + String((Number(certo[9]) + 1) % 10) + certo[10];
  })(),
};

type Linha = {
  unidade: string;
  status: string;
  comprador?: string;
  documento?: string;
  conjuge?: string;
  documentoConjuge?: string;
};

/** O que a importação da planilha deve encontrar. */
export const ESPERADO = {
  blocos: ["Bloco 01", "Bloco 02", "Bloco 03", "Bloco 04"],
  abasIgnoradas: ["Folha1", "0"],
  apartamentos: 48,
  boxes: 3,
  porCnpj: 1,
  // Sem documento: 2 permutas, 1 vendido sem CPF, CPF de 10 e de 12 dígitos,
  // DV errado (todos no Bloco 01).
  soMesa: 6,
  documentosEmVariosAptos: 1,
};

function linhasDoBloco(bloco: number): Linha[] {
  const linhas: Linha[] = [];
  for (let andar = 1; andar <= 3; andar++) {
    for (let u = 1; u <= 4; u++) {
      const p = novaPessoa();
      const casado = (andar + u) % 2 === 0;
      const conjuge = casado ? novaPessoa() : undefined;
      linhas.push({
        unidade: `Ap ${andar}0${u}`,
        status: "VENDIDO",
        comprador: p.nome,
        documento: pontuarCpf(p.cpf),
        conjuge: conjuge?.nome,
        documentoConjuge: conjuge && pontuarCpf(conjuge.cpf),
      });
    }
  }
  const ap = (numero: string) =>
    linhas.find((l) => l.unidade === `Ap ${numero}`)!;
  const permuta = { nome: "Permutante Fictício", documento: undefined };

  if (bloco === 1) {
    // Sufixo PCD na unidade.
    ap("102").unidade = "Ap 102 PCD";
    // Permuta sem documento, com status em minúsculas e misturado.
    Object.assign(ap("103"), {
      status: "permuta",
      comprador: permuta.nome,
      documento: "",
      conjuge: undefined,
      documentoConjuge: undefined,
    });
    Object.assign(ap("104"), {
      status: "Permuta",
      comprador: permuta.nome,
      documento: "",
      conjuge: undefined,
      documentoConjuge: undefined,
    });
    // Vendido sem documento.
    Object.assign(ap("201"), {
      status: "vendido",
      documento: "",
      conjuge: undefined,
      documentoConjuge: undefined,
    });
    // CPF com 10 e com 12 dígitos.
    Object.assign(ap("202"), {
      documento: "1234567890",
      conjuge: undefined,
      documentoConjuge: undefined,
    });
    Object.assign(ap("203"), {
      documento: "123456789012",
      conjuge: undefined,
      documentoConjuge: undefined,
    });
    // Dígito verificador errado.
    Object.assign(ap("204"), {
      documento: pontuarCpf(DOCUMENTOS.dvErrado),
      conjuge: undefined,
      documentoConjuge: undefined,
    });
    // CNPJ na coluna de CPF: apartamento comprado por empresa.
    Object.assign(ap("301"), {
      comprador: "Empresa Fictícia Ltda",
      documento: pontuarCnpj(DOCUMENTOS.cnpj),
      conjuge: undefined,
      documentoConjuge: undefined,
    });
    // Unidade em cessão: o comprador novo vem depois de "Cessão".
    ap("302").comprador =
      "Comprador Antigo Fictício-Cessão Comprador Novo Fictício";
  }
  // O mesmo CPF em 3 apartamentos, em blocos diferentes.
  if (bloco <= 3) {
    Object.assign(ap("304"), {
      comprador: "Investidor Fictício",
      documento: pontuarCpf(DOCUMENTOS.investidor),
    });
  }
  // Boxes não são apartamentos.
  if (bloco <= 3) {
    linhas.push({
      unidade: `Box Extra ${bloco}01`,
      status: "VENDIDO",
      comprador: "Dono do Box Fictício",
      documento: pontuarCpf(cpf("111444777")),
    });
  }
  return linhas;
}

const LEGENDA = [
  "CONTROLE DE VENDAS - RESIDENCIAL FICTÍCIO",
  "Legenda: VENDIDO / PERMUTA",
  "Atualizado em 28/10/2026",
  "",
  "",
];
const CABECALHO = [
  "Unidade",
  "Status",
  "Data da venda",
  "Valor",
  "Comprador",
  "CPF",
  "E-mail",
  "Cônjuge",
  "CPF",
  "Telefone",
  "Corretor",
];

/** Gera a planilha .xlsx em memória. Cada chamada gera os mesmos dados. */
export async function gerarPlanilhaControleVendas(): Promise<Uint8Array> {
  sequencia = 0;
  const livro = new ExcelJS.Workbook();

  const tipologias = livro.addWorksheet("Folha1", { state: "hidden" });
  tipologias.addRow(["Tipologia", "Área"]);
  tipologias.addRow(["2 quartos", "58,4"]);
  livro.addWorksheet("0");

  for (let b = 1; b <= 4; b++) {
    const aba = livro.addWorksheet(`Bloco 0${b}`);
    LEGENDA.forEach((texto, i) => (aba.getCell(i + 1, 1).value = texto));
    aba.getRow(6).values = CABECALHO;
    linhasDoBloco(b).forEach((l, i) => {
      aba.getRow(7 + i).values = [
        l.unidade,
        l.status,
        "15/03/2025",
        "R$ 350.000,00",
        l.comprador ?? "",
        l.documento ?? "",
        "fulano@exemplo.test",
        l.conjuge ?? "",
        l.documentoConjuge ?? "",
        "(48) 90000-0000",
        "Corretor Fictício",
      ];
    });
  }
  return new Uint8Array(await livro.xlsx.writeBuffer());
}
