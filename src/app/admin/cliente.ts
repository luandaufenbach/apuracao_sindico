// Chamadas das telas do painel à API admin. O navegador manda o header Origin
// em todo POST e DELETE, que o servidor confere.

export class ErroApi extends Error {
  constructor(
    mensagem: string,
    readonly status: number,
  ) {
    super(mensagem);
    this.name = "ErroApi";
  }
}

/**
 * Chama a API e devolve o JSON. Erro vira ErroApi com a mensagem do servidor;
 * sessão vencida (401) leva ao login, menos no próprio login.
 */
export async function chamarApi<T = unknown>(
  url: string,
  {
    metodo = "POST",
    corpo,
    formulario,
  }: {
    metodo?: "GET" | "POST" | "DELETE";
    corpo?: unknown;
    formulario?: FormData;
  } = {},
  sinal?: AbortSignal,
): Promise<T> {
  const resposta = await fetch(url, {
    method: metodo,
    headers:
      corpo === undefined ? undefined : { "content-type": "application/json" },
    body:
      formulario ?? (corpo === undefined ? undefined : JSON.stringify(corpo)),
    signal: sinal,
  });
  let dados: unknown = null;
  try {
    dados = await resposta.json();
  } catch {
    // Resposta sem JSON: fica a mensagem genérica.
  }
  if (resposta.status === 401 && !url.endsWith("/api/admin/login")) {
    // Fora de componente não há router: carga completa até o login.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/admin/login");
  }
  if (!resposta.ok) {
    const mensagem =
      (dados as { mensagem?: string } | null)?.mensagem ??
      "Algo deu errado. Tente de novo.";
    throw new ErroApi(mensagem, resposta.status);
  }
  return dados as T;
}

export const mensagemDe = (erro: unknown) =>
  erro instanceof ErroApi
    ? erro.message
    : "Sem conexão com o servidor. Tente de novo.";
