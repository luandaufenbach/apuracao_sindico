// Cliente da API pública (src/app/api/e/[codigo]/) para as telas do eleitor e
// do telão, no navegador. Os tipos espelham as respostas das rotas: recusa de
// regra volta com 200 e `{ ok: false, erro }`; os demais erros, com status HTTP
// e `{ mensagem }`, viram ErroApi.

export type StatusEleicao = "rascunho" | "aberta" | "encerrada" | "publicada";

export type Candidato = {
  id: number;
  nome: string;
  /** Data URL de 400 px, ou null. */
  foto: string | null;
  proposta: string | null;
  apartamento: { bloco: string; rotulo: string } | null;
};

export type Eleicao = {
  empreendimento: string;
  titulo: string;
  status: StatusEleicao;
  candidatos: Candidato[];
};

export type Apartamento = {
  id: number;
  bloco: string;
  rotulo: string;
  jaVotou: boolean;
  bloqueado: boolean;
  soMesa: boolean;
};

export type Dica = { tipo: "cpf" | "cnpj"; prefixo: string };

export type Sugestao = {
  apartamentoId: number;
  bloco: string;
  rotulo: string;
  /** Horário do voto (ISO), se o apartamento já votou. */
  votouEm: string | null;
};

export type RespostaVerificar =
  | { ok: true; token: string }
  | {
      ok: false;
      erro: "eleicao_fechada" | "ja_votou" | "bloqueado" | "documento_invalido";
    }
  | { ok: false; erro: "nao_confere"; tentativasRestantes: number }
  | { ok: false; erro: "outro_apto"; sugestoes: Sugestao[] };

/** Outro apartamento do mesmo documento, com o token para votar sem digitar de novo. */
export type Proximo = {
  apartamentoId: number;
  bloco: string;
  rotulo: string;
  token: string;
};

export type RespostaVotar =
  | { ok: true; comprovante: string; horario: string; proximos: Proximo[] }
  | { ok: false; erro: "eleicao_fechada" | "ja_votou" | "bloqueado" };

/** Rota leve, sem fotos: a que as telas consultam em polling. */
export type Telao = {
  status: StatusEleicao;
  totalApartamentos: number;
  votaram: number;
  /** Só com a eleição publicada (R11). */
  resultado?: { candidatoId: number; nome: string; votos: number }[];
};

/** Erro HTTP da API (400, 401, 404, 500) ou falha de rede (status 0). */
export class ErroApi extends Error {
  constructor(
    readonly status: number,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = "ErroApi";
  }
}

const SEM_CONEXAO = "Sem conexão. Confira a internet e tente de novo.";
const INESPERADO = "Erro inesperado. Tente de novo.";

/** Qualquer falha como ErroApi; de `chamar` só sai outra coisa no cancelamento. */
export const comoErroApi = (falha: unknown) =>
  falha instanceof ErroApi ? falha : new ErroApi(0, INESPERADO);

export const mensagemDe = (falha: unknown) => comoErroApi(falha).message;

/** Sem resposta nesse tempo, a chamada vira falha de rede (e o polling segue). */
const LIMITE_MS = 15_000;

function comLimite(signal: AbortSignal | null | undefined) {
  // AbortSignal.any é de 2024: sem ele, fica só o sinal de quem chamou.
  if (typeof AbortSignal.any !== "function") return signal;
  const limite = AbortSignal.timeout(LIMITE_MS);
  return signal ? AbortSignal.any([signal, limite]) : limite;
}

async function chamar<T>(caminho: string, init: RequestInit = {}): Promise<T> {
  let resposta: Response;
  let corpo: { mensagem?: unknown } | null;
  try {
    resposta = await fetch(caminho, {
      cache: "no-store",
      ...init,
      signal: comLimite(init.signal),
    });
    // Com 200, o corpo que cai no meio é falha de rede: o voto pode ter sido
    // gravado sem o comprovante chegar.
    corpo = await resposta.json().catch((erro) => {
      if (resposta.ok) throw erro;
      return null;
    });
  } catch (erro) {
    // Cancelamento não é falha de rede: quem cancelou ignora o erro.
    if (init.signal?.aborted) throw erro;
    throw new ErroApi(0, SEM_CONEXAO);
  }
  if (!resposta.ok || corpo === null) {
    throw new ErroApi(
      resposta.status,
      typeof corpo?.mensagem === "string" ? corpo.mensagem : INESPERADO,
    );
  }
  return corpo as T;
}

const enviar = (corpo: unknown, signal?: AbortSignal): RequestInit => ({
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(corpo),
  signal,
});

const base = (codigo: string) => `/api/e/${encodeURIComponent(codigo)}`;

export const apiPublica = {
  /** Traz as fotos dos candidatos: uma chamada por tela, nunca em polling. */
  eleicao: (codigo: string, signal?: AbortSignal) =>
    chamar<Eleicao>(base(codigo), { signal }),
  apartamentos: (codigo: string, signal?: AbortSignal) =>
    chamar<Apartamento[]>(`${base(codigo)}/apartamentos`, { signal }),
  dica: (codigo: string, apartamentoId: number, signal?: AbortSignal) =>
    chamar<{ dicas: Dica[] }>(
      `${base(codigo)}/apartamentos/${apartamentoId}/dica`,
      { signal },
    ),
  verificar: (
    codigo: string,
    apartamentoId: number,
    documento: string,
    signal?: AbortSignal,
  ) =>
    chamar<RespostaVerificar>(
      `${base(codigo)}/verificar`,
      enviar({ apartamentoId, documento }, signal),
    ),
  votar: (
    codigo: string,
    token: string,
    candidatoId: number,
    signal?: AbortSignal,
  ) =>
    chamar<RespostaVotar>(
      `${base(codigo)}/votar`,
      enviar({ token, candidatoId }, signal),
    ),
  telao: (codigo: string, signal?: AbortSignal) =>
    chamar<Telao>(`${base(codigo)}/telao`, { signal }),
};
