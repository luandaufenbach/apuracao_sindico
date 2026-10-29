import "./carregar-env";

import { randomBytes } from "node:crypto";

import bcrypt from "bcryptjs";
import { and, eq, notLike } from "drizzle-orm";

import { cpfValido, digitosCnpj, digitosCpf } from "../lib/documento";
import { apagarEmpreendimentos } from "./apagar";
import { db } from "./index";
import {
  apartamento,
  candidato,
  comprador,
  eleicao,
  empreendimento,
  usuarioAdmin,
} from "./schema";

// Seed com dados fictícios no formato da planilha "Controle de Vendas"
// (docs/ESPECIFICACAO.md): 4 blocos de 44 apartamentos, 1 ou 2 compradores,
// apartamentos só pela mesa, CPFs com mais de um apartamento e CNPJs.
// Rodar de novo recria o empreendimento do seed; os outros dados ficam.

const NOME_EMPREENDIMENTO = "Residencial Fictício (seed)";
const CODIGO_ELEICAO = "demo";

if (process.env.NODE_ENV === "production") {
  throw new Error("O seed usa dados fictícios e não roda em produção.");
}

// Sorteio determinístico (mulberry32): o seed gera sempre os mesmos dados.
let estado = 2026;
function sorteio(): number {
  estado = (estado + 0x6d2b79f5) | 0;
  let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const umDe = <T>(lista: readonly T[]): T =>
  lista[Math.floor(sorteio() * lista.length)];
function embaralhar<T>(lista: T[]): T[] {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(sorteio() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}

const NOMES = [
  "Ana",
  "Bruno",
  "Carla",
  "Diego",
  "Elisa",
  "Fábio",
  "Gabriela",
  "Heitor",
  "Isabela",
  "João",
  "Karina",
  "Lucas",
  "Marina",
  "Nelson",
  "Olívia",
  "Paulo",
  "Renata",
  "Sérgio",
  "Tatiane",
  "Vitor",
];
const SOBRENOMES = [
  "Almeida",
  "Barros",
  "Cardoso",
  "Duarte",
  "Esteves",
  "Farias",
  "Gonçalves",
  "Horta",
  "Lacerda",
  "Moreira",
  "Nogueira",
  "Pacheco",
  "Queiroz",
  "Rezende",
  "Siqueira",
  "Teixeira",
  "Vasconcelos",
];
const nomePessoa = () =>
  `${umDe(NOMES)} ${umDe(SOBRENOMES)} ${umDe(SOBRENOMES)}`;

const usados = new Set<string>();
function novoCpf(): string {
  for (;;) {
    let base = "";
    for (let i = 0; i < 9; i++) base += Math.floor(sorteio() * 10);
    const cpf = base + digitosCpf(base);
    if (!usados.has(cpf) && cpfValido(cpf)) {
      usados.add(cpf);
      return cpf;
    }
  }
}
function novoCnpj(alfanumerico: boolean): string {
  const caracteres = alfanumerico
    ? "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    : "0123456789";
  let raiz = "";
  for (let i = 0; i < 8; i++) raiz += umDe([...caracteres]);
  const base = `${raiz}0001`;
  return base + digitosCnpj(base);
}

type CompradorSeed = { nome: string; documento: string | null };
type ApartamentoSeed = {
  bloco: string;
  numero: string;
  rotulo: string;
  compradores: CompradorSeed[];
};

function montarApartamentos(): ApartamentoSeed[] {
  const aptos: ApartamentoSeed[] = [];
  for (let b = 1; b <= 4; b++) {
    for (let andar = 1; andar <= 11; andar++) {
      for (let u = 1; u <= 4; u++) {
        const numero = `${andar}0${u}`;
        const pcd = andar === 1 && u === 2;
        aptos.push({
          bloco: `Bloco 0${b}`,
          numero,
          rotulo: `Ap ${numero}${pcd ? " PCD" : ""}`,
          compradores: [],
        });
      }
    }
  }

  const fila = embaralhar([...aptos]);
  const tirar = (n: number) => fila.splice(0, n);

  // Permuta sem documento: 4 pessoas com 17 apartamentos, só pela mesa.
  for (const qtd of [5, 4, 4, 4]) {
    const dono = nomePessoa();
    for (const a of tirar(qtd))
      a.compradores.push({ nome: dono, documento: null });
  }
  // Vendidos sem documento: também só pela mesa.
  for (const a of tirar(2))
    a.compradores.push({ nome: nomePessoa(), documento: null });
  // Comprados por empresa: CNPJ, um deles no formato alfanumérico.
  tirar(4).forEach((a, i) =>
    a.compradores.push({
      nome: `Empresa Fictícia ${i + 1} Ltda`,
      documento: novoCnpj(i === 0),
    }),
  );
  // 13 CPFs com mais de um apartamento (10 com 2 e 3 com 3).
  for (const qtd of [...Array(10).fill(2), 3, 3, 3]) {
    const pessoa = { nome: nomePessoa(), documento: novoCpf() };
    for (const a of tirar(qtd)) a.compradores.push({ ...pessoa });
  }
  // Os demais: um CPF por apartamento.
  for (const a of fila)
    a.compradores.push({ nome: nomePessoa(), documento: novoCpf() });

  // Cônjuge (comprador 2) em cerca de 60% dos apartamentos com CPF.
  for (const a of aptos) {
    const [c1] = a.compradores;
    if (c1.documento?.length === 11 && sorteio() < 0.6) {
      a.compradores.push({ nome: nomePessoa(), documento: novoCpf() });
    }
  }
  return aptos;
}

async function senhaDosUsuarios(): Promise<string> {
  const senha = process.env.SEED_SENHA;
  if (senha) return senha;
  const gerada = randomBytes(12).toString("base64url");
  console.log(
    `SEED_SENHA não definida. Senha gerada para os usuários do seed: ${gerada}`,
  );
  return gerada;
}

// O NODE_ENV não vem definido quando o seed roda pelo tsx. Por isso, um banco
// com eleição real ou usuário de verdade é tratado como produção e fica intacto.
async function exigirBancoDeDesenvolvimento() {
  const [eleicaoReal] = await db
    .select({ id: eleicao.id })
    .from(eleicao)
    .where(eq(eleicao.teste, false))
    .limit(1);
  const [usuarioReal] = await db
    .select({ id: usuarioAdmin.id })
    .from(usuarioAdmin)
    .where(
      and(
        notLike(usuarioAdmin.email, "%@exemplo.test"),
        notLike(usuarioAdmin.email, "%@teste.test"),
      ),
    )
    .limit(1);
  if (eleicaoReal || usuarioReal) {
    throw new Error(
      "O banco tem eleição real ou usuário fora do seed e parece ser de " +
        "produção. O seed só roda num banco de desenvolvimento.",
    );
  }
}

async function main() {
  await exigirBancoDeDesenvolvimento();
  const aptos = montarApartamentos();
  const senhaHash = await bcrypt.hash(await senhaDosUsuarios(), 12);

  await db.transaction(async (tx) => {
    // Apaga o empreendimento de um seed anterior, com tudo que depende dele.
    const antigos = await tx
      .select({ id: empreendimento.id })
      .from(empreendimento)
      .where(eq(empreendimento.nome, NOME_EMPREENDIMENTO));
    await apagarEmpreendimentos(
      tx,
      antigos.map((e) => e.id),
    );

    const [emp] = await tx
      .insert(empreendimento)
      .values({ nome: NOME_EMPREENDIMENTO })
      .returning({ id: empreendimento.id });

    const inseridos = await tx
      .insert(apartamento)
      .values(
        aptos.map(({ bloco, numero, rotulo }) => ({
          empreendimentoId: emp.id,
          bloco,
          numero,
          rotulo,
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
    const idDe = (a: ApartamentoSeed) =>
      idPorChave.get(`${a.bloco}/${a.numero}`)!;

    await tx
      .insert(comprador)
      .values(
        aptos.flatMap((a) =>
          a.compradores.map((c) => ({ apartamentoId: idDe(a), ...c })),
        ),
      );

    const [ele] = await tx
      .insert(eleicao)
      .values({
        empreendimentoId: emp.id,
        codigo: CODIGO_ELEICAO,
        titulo: "Eleição de síndico (teste)",
        status: "aberta",
        teste: true,
        abertaEm: new Date(),
      })
      .returning({ id: eleicao.id });

    // Candidatos moram em apartamentos com CPF próprio.
    const comCpf = aptos
      .filter((a) => a.compradores[0].documento?.length === 11)
      .map((a) => ({ a, id: idDe(a) }));
    const propostas = [
      "Transparência nas contas, com prestação mensal no grupo do condomínio.",
      "Manutenção preventiva e cotação com três fornecedores em toda obra.",
      "Mais segurança na portaria e regras claras para o salão de festas.",
    ];
    await tx.insert(candidato).values(
      propostas.map((proposta, i) => {
        const { a, id } = comCpf[i * 7];
        return {
          eleicaoId: ele.id,
          nome: a.compradores[0].nome,
          apartamentoId: id,
          proposta,
          ordem: i + 1,
        };
      }),
    );

    for (const u of [
      {
        nome: "Operador Fictício",
        email: "operador@exemplo.test",
        papel: "operador" as const,
      },
      {
        nome: "God Fictício",
        email: "god@exemplo.test",
        papel: "god" as const,
      },
    ]) {
      await tx
        .insert(usuarioAdmin)
        .values({ ...u, senhaHash })
        .onConflictDoUpdate({
          target: usuarioAdmin.email,
          set: { nome: u.nome, papel: u.papel, senhaHash, ativo: true },
        });
    }
  });

  const soMesa = aptos.filter((a) => a.compradores.every((c) => !c.documento));
  const porCnpj = aptos.filter(
    (a) => a.compradores[0].documento?.length === 14,
  );
  console.log(
    `Seed: ${aptos.length} apartamentos em 4 blocos, ${soMesa.length} só pela mesa, ` +
      `${porCnpj.length} por CNPJ. Eleição "${CODIGO_ELEICAO}" aberta, 3 candidatos, ` +
      `usuários operador@exemplo.test e god@exemplo.test.`,
  );
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(() => db.$client.end());
