// Dados dos testes e2e, lidos do banco do seed. A API pública não devolve
// documento (R10), então os testes buscam no banco o CPF ou CNPJ que o
// "morador" digitaria. Os dados são fictícios e nunca vão para a saída.
import "../../src/db/carregar-env";

import { Pool } from "pg";

import { digitosCpf } from "../../src/lib/documento";

export const CODIGO = "demo";

let pool: Pool | null = null;
function banco(): Pool {
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
  return pool;
}

export async function consultar<T>(sql: string, params: unknown[] = []) {
  return (await banco().query(sql, params)).rows as T[];
}

export type AptoE2e = {
  id: number;
  bloco: string;
  rotulo: string;
  documentos: string[];
};

type Cadastro = {
  eleicaoId: number;
  aptos: AptoE2e[];
  /** Apartamentos com um só comprador, de CPF que não aparece em outro apto. */
  cpfUnico: AptoE2e[];
  /** Apartamentos comprados por empresa (um CNPJ). */
  cnpj: AptoE2e[];
  /** Apartamentos sem documento: só votam pela mesa. */
  soMesa: AptoE2e[];
  /** CPFs com mais de um apartamento, com os apartamentos de cada um. */
  multi: { documento: string; aptos: AptoE2e[] }[];
};

let cadastro: Promise<Cadastro> | null = null;

/** O cadastro da eleição "demo", na ordem do bloco e do número. */
export function lerCadastro(): Promise<Cadastro> {
  cadastro ??= (async () => {
    const [el] = await consultar<{ id: number; empreendimento_id: number }>(
      "SELECT id, empreendimento_id FROM eleicao WHERE codigo = $1",
      [CODIGO],
    );
    if (!el) throw new Error(`Eleição "${CODIGO}" não existe: rode o seed.`);
    const linhas = await consultar<{
      id: number;
      bloco: string;
      rotulo: string;
      documento: string | null;
    }>(
      `SELECT a.id, a.bloco, a.rotulo, c.documento
         FROM apartamento a JOIN comprador c ON c.apartamento_id = a.id
        WHERE a.empreendimento_id = $1
        ORDER BY a.bloco, a.numero::int, c.id`,
      [el.empreendimento_id],
    );
    const porId = new Map<number, AptoE2e>();
    for (const l of linhas) {
      const a = porId.get(l.id) ?? {
        id: l.id,
        bloco: l.bloco,
        rotulo: l.rotulo,
        documentos: [],
      };
      if (l.documento) a.documentos.push(l.documento);
      porId.set(l.id, a);
    }
    const aptos = [...porId.values()];
    const aptosDoDoc = new Map<string, AptoE2e[]>();
    for (const a of aptos) {
      for (const d of a.documentos) {
        aptosDoDoc.set(d, [...(aptosDoDoc.get(d) ?? []), a]);
      }
    }
    const umCompradorSo = (a: AptoE2e) =>
      linhas.filter((l) => l.id === a.id).length === 1;
    return {
      eleicaoId: el.id,
      aptos,
      cpfUnico: aptos.filter(
        (a) =>
          umCompradorSo(a) &&
          a.documentos.length === 1 &&
          a.documentos[0].length === 11 &&
          aptosDoDoc.get(a.documentos[0])!.length === 1,
      ),
      cnpj: aptos.filter(
        (a) => a.documentos.length === 1 && a.documentos[0].length === 14,
      ),
      soMesa: aptos.filter((a) => a.documentos.length === 0),
      multi: [...aptosDoDoc]
        .filter(([, lista]) => lista.length > 1)
        .map(([documento, lista]) => ({ documento, aptos: lista })),
    };
  })();
  return cadastro;
}

/**
 * Cada teste usa a sua fatia de apartamentos de CPF único, para os testes
 * rodarem em paralelo sem um mexer no apartamento do outro.
 */
export const FATIA = {
  cpf: 0,
  invalido: 1,
  bloqueio: 2,
  outroApto: 3, // e 4
  jaVotou: 5,
  anular: 6,
  multi: 7,
} as const;

/** CPF válido que não é de nenhum comprador do seed. */
export async function cpfEstranho(semente: number): Promise<string> {
  const { aptos } = await lerCadastro();
  const usados = new Set(aptos.flatMap((a) => a.documentos));
  for (let n = semente; ; n++) {
    const base = String(900_000_000 + n * 7919).slice(0, 9);
    const cpf = base + digitosCpf(base);
    if (!usados.has(cpf)) return cpf;
  }
}

/** CPF com o último dígito verificador trocado. */
export const comDigitoErrado = (cpf: string) =>
  cpf.slice(0, 10) + ((Number(cpf[10]) + 1) % 10);

/** CPF pontuado, como a pessoa veria (`123.456.789-09`). */
export const pontuarCpf = (cpf: string) =>
  `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;

export type VotoBanco = {
  id: number;
  status: "valido" | "anulado";
  origem: "documento" | "mesa";
  comprovante: string;
};

export function votosDoApto(eleicaoId: number, apartamentoId: number) {
  return consultar<VotoBanco>(
    `SELECT id, status, origem, comprovante FROM voto
      WHERE eleicao_id = $1 AND apartamento_id = $2 ORDER BY id`,
    [eleicaoId, apartamentoId],
  );
}

export async function situacaoDoApto(eleicaoId: number, apartamentoId: number) {
  const [s] = await consultar<{
    tentativas_falhas: number;
    bloqueado: boolean;
  }>(
    `SELECT tentativas_falhas, bloqueado FROM situacao_apartamento
      WHERE eleicao_id = $1 AND apartamento_id = $2`,
    [eleicaoId, apartamentoId],
  );
  return s ?? { tentativas_falhas: 0, bloqueado: false };
}

export async function fecharBanco() {
  await pool?.end();
  pool = null;
}
