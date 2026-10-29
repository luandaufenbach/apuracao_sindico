// Schema do banco em Drizzle (docs/ESPECIFICACAO.md, seção "Modelo de dados").
// Congelado depois da F1: qualquer mudança passa pelo dono do projeto.
import { sql } from "drizzle-orm";
import {
  bigserial,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const statusEleicao = pgEnum("status_eleicao", [
  "rascunho",
  "aberta",
  "encerrada",
  "publicada",
]);
export const statusVoto = pgEnum("status_voto", ["valido", "anulado"]);
export const origemVoto = pgEnum("origem_voto", ["documento", "mesa"]);
export const papelAdmin = pgEnum("papel_admin", ["operador", "god"]);

const criadoEm = () =>
  timestamp("criado_em", { withTimezone: true }).notNull().defaultNow();

export const empreendimento = pgTable("empreendimento", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  criadoEm: criadoEm(),
});

export const apartamento = pgTable(
  "apartamento",
  {
    id: serial("id").primaryKey(),
    empreendimentoId: integer("empreendimento_id")
      .notNull()
      .references(() => empreendimento.id),
    bloco: text("bloco").notNull(), // 'Bloco 01'
    numero: text("numero").notNull(), // '502'
    rotulo: text("rotulo").notNull(), // 'Ap 502 PCD', exibido na tela
  },
  (t) => [unique().on(t.empreendimentoId, t.bloco, t.numero)],
);

// Apartamento sem comprador com documento preenchido só vota pela mesa.
export const comprador = pgTable(
  "comprador",
  {
    id: serial("id").primaryKey(),
    apartamentoId: integer("apartamento_id")
      .notNull()
      .references(() => apartamento.id),
    nome: text("nome").notNull(),
    // CPF (11) ou CNPJ (14), sem pontuação; null: sem documento válido.
    documento: varchar("documento", { length: 14 }),
  },
  (t) => [index("comprador_documento").on(t.documento)],
);

export const eleicao = pgTable("eleicao", {
  id: serial("id").primaryKey(),
  empreendimentoId: integer("empreendimento_id")
    .notNull()
    .references(() => empreendimento.id),
  codigo: text("codigo").notNull().unique(), // aleatório, usado no link público
  titulo: text("titulo").notNull(),
  status: statusEleicao("status").notNull().default("rascunho"),
  teste: boolean("teste").notNull().default(false),
  abertaEm: timestamp("aberta_em", { withTimezone: true }),
  encerradaEm: timestamp("encerrada_em", { withTimezone: true }),
});

export const candidato = pgTable("candidato", {
  id: serial("id").primaryKey(),
  eleicaoId: integer("eleicao_id")
    .notNull()
    .references(() => eleicao.id),
  nome: text("nome").notNull(),
  apartamentoId: integer("apartamento_id").references(() => apartamento.id),
  foto: text("foto"), // data URL de 400 px (MVP)
  proposta: text("proposta"),
  ordem: integer("ordem").notNull().default(0),
});

export const situacaoApartamento = pgTable(
  "situacao_apartamento",
  {
    eleicaoId: integer("eleicao_id")
      .notNull()
      .references(() => eleicao.id),
    apartamentoId: integer("apartamento_id")
      .notNull()
      .references(() => apartamento.id),
    tentativasFalhas: integer("tentativas_falhas").notNull().default(0),
    bloqueado: boolean("bloqueado").notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.eleicaoId, t.apartamentoId] })],
);

export const voto = pgTable(
  "voto",
  {
    id: serial("id").primaryKey(),
    eleicaoId: integer("eleicao_id")
      .notNull()
      .references(() => eleicao.id),
    apartamentoId: integer("apartamento_id")
      .notNull()
      .references(() => apartamento.id),
    candidatoId: integer("candidato_id")
      .notNull()
      .references(() => candidato.id),
    // null quando origem = 'mesa'
    compradorId: integer("comprador_id").references(() => comprador.id),
    // do comprador verificado ou informado na mesa
    documento: varchar("documento", { length: 14 }).notNull(),
    // de quem votou: do comprador ou informado na mesa
    nome: text("nome").notNull(),
    origem: origemVoto("origem").notNull(),
    comprovante: text("comprovante").notNull().unique(),
    status: statusVoto("status").notNull().default("valido"),
    criadoEm: criadoEm(),
  },
  // R1: 1 voto válido por apto, mesmo com 2 cliques simultâneos.
  (t) => [
    uniqueIndex("um_voto_por_apto")
      .on(t.eleicaoId, t.apartamentoId)
      .where(sql`${t.status} = 'valido'`),
  ],
);

export const usuarioAdmin = pgTable("usuario_admin", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  papel: papelAdmin("papel").notNull(),
  ativo: boolean("ativo").notNull().default(true),
});

export const logAuditoria = pgTable("log_auditoria", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  eleicaoId: integer("eleicao_id").references(() => eleicao.id),
  // null = ação do eleitor
  usuarioId: integer("usuario_id").references(() => usuarioAdmin.id),
  // ex.: 'voto.anular', 'apto.desbloquear', 'documento.falha'
  acao: text("acao").notNull(),
  alvo: text("alvo"),
  motivo: text("motivo"),
  dados: jsonb("dados").$type<Record<string, unknown>>(),
  criadoEm: criadoEm(),
});
