import "./carregar-env";

import { randomInt } from "node:crypto";
import { createInterface } from "node:readline/promises";

import { and, asc, eq } from "drizzle-orm";

import { registrarAuditoria } from "../lib/auditoria";
import {
  cnpjValido,
  cpfValido,
  digitosCnpj,
  digitosCpf,
} from "../lib/documento";
import { db } from "./index";
import {
  apartamento,
  candidato,
  comprador,
  eleicao,
  empreendimento,
  usuarioAdmin,
} from "./schema";

// Eleição de teste para o ensaio geral (docs/DIA-DO-EVENTO.md), num
// empreendimento fictício de 12 apartamentos. Roda em produção sem tocar nos
// dados reais e sem o seed:
//
//   npm run prod:ensaio    (banco de produção, lido de .env.producao)
//   npm run db:ensaio      (banco do .env)
//
// A eleição nasce em rascunho, com a flag `teste`: a equipe abre a votação pelo
// admin, vota, publica e zera no godmode quantas vezes quiser. Rodar de novo
// não duplica nada: só mostra a tabela de documentos.

const NOME_EMPREENDIMENTO = "Ensaio geral (fictício)";

// Sem 0/O/1/I/L, como em src/lib/eleicoes.ts.
const ALFABETO_CODIGO = "23456789abcdefghjkmnpqrstuvwxyz";
const gerarCodigo = () =>
  Array.from(
    { length: 8 },
    () => ALFABETO_CODIGO[randomInt(ALFABETO_CODIGO.length)],
  ).join("");

type ApartamentoEnsaio = {
  bloco: string;
  numero: string;
  nome: string;
  documento: string | null;
  obs: string;
};

// CPF fictício que repete bloco e número: Bloco 01 Ap 201 = 120.112.011-xx.
function cpfDe(b: number, numero: string): string {
  const base = `${b}${numero}`.repeat(3).slice(0, 9);
  const cpf = base + digitosCpf(base);
  if (!cpfValido(cpf)) throw new Error(`CPF fictício inválido: ${cpf}`);
  return cpf;
}

// CNPJ de exemplo das documentações (11.222.333/0001-81).
function cnpjFicticio(): string {
  const base = "112223330001";
  const cnpj = base + digitosCnpj(base);
  if (!cnpjValido(cnpj)) throw new Error(`CNPJ fictício inválido: ${cnpj}`);
  return cnpj;
}

function montarApartamentos(): ApartamentoEnsaio[] {
  const aptos: ApartamentoEnsaio[] = [];
  for (const b of [1, 2]) {
    for (const numero of ["101", "102", "201", "202", "301", "302"]) {
      aptos.push({
        bloco: `Bloco 0${b}`,
        numero,
        nome: `Morador Ensaio ${b}-${numero}`,
        documento: cpfDe(b, numero),
        obs: "",
      });
    }
  }
  const apto = (b: number, numero: string) =>
    aptos.find((a) => a.bloco === `Bloco 0${b}` && a.numero === numero)!;

  // Um dono com dois apartamentos: o comprovante oferece votar no outro.
  const dono = apto(1, "301");
  Object.assign(apto(2, "301"), {
    nome: dono.nome,
    documento: dono.documento,
    obs: "mesmo CPF do Bloco 01 Ap 301",
  });
  dono.obs = "mesmo CPF do Bloco 02 Ap 301";
  Object.assign(apto(2, "202"), {
    nome: "Empresa Ensaio Ltda",
    documento: cnpjFicticio(),
    obs: "CNPJ",
  });
  Object.assign(apto(2, "302"), {
    nome: "Permuta Ensaio",
    documento: null,
    obs: "só pela mesa (godmode)",
  });
  return aptos;
}

function formatar(doc: string | null): string {
  if (!doc) return "(sem documento)";
  if (doc.length === 11) {
    return doc.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }
  return doc.replace(/^(.{2})(.{3})(.{3})(.{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

function mostrarTabela(aptos: ApartamentoEnsaio[]) {
  console.log("\nDocumentos fictícios do ensaio:");
  for (const a of aptos) {
    const obs = a.obs ? `  ${a.obs}` : "";
    console.log(
      `  ${a.bloco}  Ap ${a.numero}  ${formatar(a.documento).padEnd(20)}${obs}`,
    );
  }
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida.");
  const aptos = montarApartamentos();

  const [existente] = await db
    .select({
      eleicaoId: eleicao.id,
      codigo: eleicao.codigo,
      status: eleicao.status,
    })
    .from(eleicao)
    .innerJoin(empreendimento, eq(empreendimento.id, eleicao.empreendimentoId))
    .where(
      and(
        eq(empreendimento.nome, NOME_EMPREENDIMENTO),
        eq(eleicao.teste, true),
      ),
    )
    .orderBy(asc(eleicao.id))
    .limit(1);
  if (existente) {
    console.log(
      `A eleição de ensaio já existe (id ${existente.eleicaoId}, ` +
        `código ${existente.codigo}, ${existente.status}).`,
    );
    mostrarLinks(existente.eleicaoId, existente.codigo);
    mostrarTabela(aptos);
    return;
  }

  // A criação fica no log de auditoria em nome do god.
  const [god] = await db
    .select({ id: usuarioAdmin.id })
    .from(usuarioAdmin)
    .where(and(eq(usuarioAdmin.papel, "god"), eq(usuarioAdmin.ativo, true)))
    .orderBy(asc(usuarioAdmin.id))
    .limit(1);
  if (!god) {
    throw new Error("Nenhum god ativo. Rode o criar-god antes do ensaio.");
  }

  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const confirma = await terminal.question(
      `Banco: ${new URL(url).hostname}\n` +
        `Criar "${NOME_EMPREENDIMENTO}" com a eleição de teste? (s/N) `,
    );
    if (confirma.trim().toLowerCase() !== "s") {
      console.log("Nada foi criado.");
      return;
    }
  } finally {
    terminal.close();
  }

  const ele = await db.transaction(async (tx) => {
    const [emp] = await tx
      .insert(empreendimento)
      .values({ nome: NOME_EMPREENDIMENTO })
      .returning({ id: empreendimento.id });
    await registrarAuditoria(
      {
        usuarioId: god.id,
        acao: "empreendimento.criar",
        alvo: `empreendimento:${emp.id}`,
        dados: { nome: NOME_EMPREENDIMENTO, origem: "script ensaio" },
      },
      tx,
    );

    const inseridos = await tx
      .insert(apartamento)
      .values(
        aptos.map(({ bloco, numero }) => ({
          empreendimentoId: emp.id,
          bloco,
          numero,
          rotulo: `Ap ${numero}`,
        })),
      )
      .returning({
        id: apartamento.id,
        bloco: apartamento.bloco,
        numero: apartamento.numero,
      });
    // O RETURNING não garante a ordem: liga cada linha pela chave única.
    const idPorChave = new Map(
      inseridos.map((a) => [`${a.bloco}/${a.numero}`, a.id]),
    );
    await tx.insert(comprador).values(
      aptos.map((a) => ({
        apartamentoId: idPorChave.get(`${a.bloco}/${a.numero}`)!,
        nome: a.nome,
        documento: a.documento,
      })),
    );

    const titulo = "Ensaio geral (teste)";
    const [el] = await tx
      .insert(eleicao)
      .values({
        empreendimentoId: emp.id,
        codigo: gerarCodigo(),
        titulo,
        teste: true,
      })
      .returning({ id: eleicao.id, codigo: eleicao.codigo });
    await registrarAuditoria(
      {
        eleicaoId: el.id,
        usuarioId: god.id,
        acao: "eleicao.criar",
        alvo: `eleicao:${el.id}`,
        dados: { titulo, teste: true, origem: "script ensaio" },
      },
      tx,
    );

    await tx.insert(candidato).values([
      {
        eleicaoId: el.id,
        nome: "Candidata Ana (ensaio)",
        proposta: "Candidata fictícia do ensaio geral.",
        ordem: 1,
      },
      {
        eleicaoId: el.id,
        nome: "Candidato Bruno (ensaio)",
        proposta: "Candidato fictício do ensaio geral.",
        ordem: 2,
      },
    ]);
    return el;
  });

  console.log(`Eleição de ensaio criada (id ${ele.id}, código ${ele.codigo}).`);
  mostrarLinks(ele.id, ele.codigo);
  mostrarTabela(aptos);
}

function mostrarLinks(eleicaoId: number, codigo: string) {
  console.log(
    `  Admin:  /admin/eleicoes/${eleicaoId}\n` +
      `  Eleitor: /v/${codigo}\n` +
      `  Telão:  /telao/${codigo}`,
  );
}

main()
  .catch((erro) => {
    console.error((erro as Error).message);
    process.exitCode = 1;
  })
  .finally(() => db.$client.end());
