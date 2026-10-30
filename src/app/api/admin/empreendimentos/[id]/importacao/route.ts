import { existeEmpreendimento } from "@/lib/cadastro";
import { EntradaInvalida, validar } from "@/lib/erros";
import {
  analisarPlanilha,
  compararComCadastro,
  gravarImportacao,
  lerArquivo,
  opcaoImportacao,
  TAMANHO_MAXIMO_ARQUIVO,
} from "@/lib/importacao";

import { ErroHttp, idDaRota, rotaAdmin } from "../../../comum";

// Linhas de cada aba que a tela mostra para o mapeamento manual de colunas.
const LINHAS_AMOSTRA = 12;

/**
 * Importação em etapas, sem estado no servidor: `etapa=estrutura` devolve as
 * abas e as primeiras linhas (para mapear colunas à mão); `etapa=previa` lê o
 * arquivo com o modelo escolhido e devolve a prévia; `etapa=confirmar`
 * reenvia o mesmo arquivo e a mesma opção, monta a prévia de novo e grava.
 */
export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/empreendimentos/[id]/importacao">,
) {
  return rotaAdmin(req, async (usuario) => {
    const empreendimentoId = await idDaRota(ctx.params);
    if (!(await existeEmpreendimento(empreendimentoId))) {
      throw new ErroHttp(404, "Empreendimento não encontrado.");
    }

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      throw new EntradaInvalida("Envie o arquivo num formulário multipart.");
    }
    const arquivo = form.get("arquivo");
    if (!(arquivo instanceof File)) {
      throw new EntradaInvalida("Escolha o arquivo da planilha.");
    }
    if (arquivo.size > TAMANHO_MAXIMO_ARQUIVO) {
      throw new EntradaInvalida("O arquivo passa de 5 MB.");
    }
    const planilha = await lerArquivo(
      arquivo.name,
      new Uint8Array(await arquivo.arrayBuffer()),
    );
    const etapa = form.get("etapa");
    if (etapa === "estrutura") {
      return {
        estrutura: planilha.abas.map((a) => ({
          nome: a.nome,
          oculta: a.oculta,
          amostra: a.linhas.slice(0, LINHAS_AMOSTRA),
        })),
      };
    }

    let opcaoJson: unknown;
    try {
      opcaoJson = JSON.parse(String(form.get("opcao") ?? ""));
    } catch {
      throw new EntradaInvalida("Escolha o modelo de colunas.");
    }
    const previa = analisarPlanilha(
      planilha,
      validar(opcaoImportacao, opcaoJson),
    );

    if (etapa === "confirmar") {
      const comparacao = await gravarImportacao({
        empreendimentoId,
        usuarioId: usuario.id,
        previa,
        arquivo: arquivo.name,
      });
      return { gravado: true, comparacao, resumo: previa.resumo };
    }
    return {
      gravado: false,
      previa,
      comparacao: await compararComCadastro(empreendimentoId, previa),
    };
  });
}
