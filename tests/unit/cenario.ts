// Cenário fictício por teste, num empreendimento próprio. Os testes apagam só o
// que criaram, então rodam no mesmo banco do seed sem estragá-lo.
import { inArray } from "drizzle-orm";

import { db } from "@/db";
import { apagarEmpreendimentos } from "@/db/apagar";
import {
  apartamento,
  candidato,
  comprador,
  eleicao,
  empreendimento,
  logAuditoria,
  usuarioAdmin,
} from "@/db/schema";
import { digitosCpf } from "@/lib/documento";

const cpf = (base9: string) => base9 + digitosCpf(base9);

const criados = { empreendimentos: [] as number[], usuarios: [] as number[] };
let contador = 0;

export type Cenario = Awaited<ReturnType<typeof criarCenario>>;

// O RETURNING não garante a ordem das linhas: os ids são achados pela chave.
function porChave<T, K>(linhas: T[], chave: (l: T) => K, id: (l: T) => number) {
  const mapa = new Map(linhas.map((l) => [chave(l), id(l)]));
  return (k: K) => {
    const achado = mapa.get(k);
    if (achado === undefined) throw new Error(`cenário sem ${String(k)}`);
    return achado;
  };
}

export async function criarCenario(
  status: "rascunho" | "aberta" | "encerrada" | "publicada" = "aberta",
) {
  const s = `${process.pid}-${Date.now()}-${++contador}`;
  const [emp] = await db
    .insert(empreendimento)
    .values({ nome: `Teste ${s}` })
    .returning({ id: empreendimento.id });
  criados.empreendimentos.push(emp.id);

  const numeros = ["101", "102", "201", "202", "301", "401"] as const;
  const aptoDe = porChave(
    await db
      .insert(apartamento)
      .values(
        numeros.map((numero) => ({
          empreendimentoId: emp.id,
          bloco: "Bloco 01",
          numero,
          rotulo: `Ap ${numero}`,
        })),
      )
      .returning({ id: apartamento.id, numero: apartamento.numero }),
    (a) => a.numero,
    (a) => a.id,
  );
  const [a101, a102, a201, a202, a301, a401] = numeros.map(aptoDe);

  const doc = {
    a101: cpf("111444777"),
    a102c1: cpf("123456789"),
    a102c2: cpf("987654321"),
    // Mesmo CPF nos aptos 201 e 202.
    multi: cpf("529982247"),
    // CNPJ alfanumérico.
    cnpj: "12ABC34501DE35",
    // CPF válido que não é de nenhum comprador do empreendimento.
    estranho: cpf("390533447"),
  };
  const compradorDe = porChave(
    await db
      .insert(comprador)
      .values([
        { apartamentoId: a101, nome: "Comprador 101", documento: doc.a101 },
        { apartamentoId: a102, nome: "Comprador 102", documento: doc.a102c1 },
        { apartamentoId: a102, nome: "Cônjuge 102", documento: doc.a102c2 },
        { apartamentoId: a201, nome: "Investidor", documento: doc.multi },
        { apartamentoId: a202, nome: "Investidor", documento: doc.multi },
        {
          apartamentoId: a301,
          nome: "Empresa Fictícia Ltda",
          documento: doc.cnpj,
        },
        // 401 só vota pela mesa.
        { apartamentoId: a401, nome: "Permuta", documento: null },
      ])
      .returning({
        id: comprador.id,
        apartamentoId: comprador.apartamentoId,
        documento: comprador.documento,
      }),
    (c) => `${c.apartamentoId}/${c.documento}`,
    (c) => c.id,
  );

  const [el] = await db
    .insert(eleicao)
    .values({
      empreendimentoId: emp.id,
      codigo: `teste-${s}`,
      titulo: "Eleição de teste",
      status,
      teste: true,
    })
    .returning({ id: eleicao.id });

  const candidatoDe = porChave(
    await db
      .insert(candidato)
      .values([
        { eleicaoId: el.id, nome: "Candidato A", ordem: 1 },
        { eleicaoId: el.id, nome: "Candidato B", ordem: 2 },
      ])
      .returning({ id: candidato.id, ordem: candidato.ordem }),
    (c) => c.ordem,
    (c) => c.id,
  );

  const usuarios = await db
    .insert(usuarioAdmin)
    .values([
      {
        nome: "Operador",
        email: `operador-${s}@teste.test`,
        senhaHash: "-",
        papel: "operador",
      },
      {
        nome: "God",
        email: `god-${s}@teste.test`,
        senhaHash: "-",
        papel: "god",
      },
      {
        nome: "Ex-god",
        email: `exgod-${s}@teste.test`,
        senhaHash: "-",
        papel: "god",
        ativo: false,
      },
    ])
    .returning({ id: usuarioAdmin.id, email: usuarioAdmin.email });
  criados.usuarios.push(...usuarios.map((u) => u.id));
  const usuarioDe = porChave(
    usuarios,
    (u) => u.email.split("-")[0],
    (u) => u.id,
  );

  return {
    eleicaoId: el.id,
    apto: { a101, a102, a201, a202, a301, a401 },
    comprador: {
      c101: compradorDe(`${a101}/${doc.a101}`),
      c102a: compradorDe(`${a102}/${doc.a102c1}`),
      c102b: compradorDe(`${a102}/${doc.a102c2}`),
      c201: compradorDe(`${a201}/${doc.multi}`),
      c202: compradorDe(`${a202}/${doc.multi}`),
      c301: compradorDe(`${a301}/${doc.cnpj}`),
    },
    doc,
    candidatos: [candidatoDe(1), candidatoDe(2)],
    operadorId: usuarioDe("operador"),
    godId: usuarioDe("god"),
    godInativoId: usuarioDe("exgod"),
  };
}

/** Apaga tudo que os cenários criaram e fecha o pool. */
export async function limparCenarios(): Promise<void> {
  await apagarEmpreendimentos(db, criados.empreendimentos);
  if (criados.usuarios.length > 0) {
    await db
      .delete(logAuditoria)
      .where(inArray(logAuditoria.usuarioId, criados.usuarios));
    await db
      .delete(usuarioAdmin)
      .where(inArray(usuarioAdmin.id, criados.usuarios));
  }
  await db.$client.end();
}
