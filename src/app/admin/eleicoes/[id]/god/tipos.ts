// Dados que a página do godmode passa para as abas. As datas chegam como texto,
// no mesmo formato das respostas da API que as abas consultam depois.
import type { StatusEleicao } from "@/lib/eleicoes";
import type {
  ItemAuditoria,
  VotoEncontrado,
  VotosDoDocumento,
} from "@/lib/godmode";

import type { Json } from "../../../formato";

export type { Json };

export type EleicaoGod = {
  id: number;
  titulo: string;
  status: StatusEleicao;
  teste: boolean;
  empreendimento: string;
};

export type ApartamentoGod = {
  id: number;
  bloco: string;
  rotulo: string;
  votou: boolean;
  bloqueado: boolean;
  soMesa: boolean;
};

export type CandidatoGod = {
  id: number;
  nome: string;
  foto: string | null;
  proposta: string | null;
  /** `Bloco 01, Ap 101`, se o candidato mora no empreendimento. */
  apartamento: string | null;
};

export type UsuarioGod = { id: number; nome: string };

export type DocumentoGod = Json<VotosDoDocumento>;
export type VotoGod = Json<VotoEncontrado>;
export type PaginaAuditoria = Json<{
  itens: ItemAuditoria[];
  proximo: number | null;
}>;

/** `Bloco 01, Ap 101`, como no painel. */
export const nomeApto = (a: { bloco: string; rotulo: string }) =>
  `${a.bloco}, ${a.rotulo}`;
