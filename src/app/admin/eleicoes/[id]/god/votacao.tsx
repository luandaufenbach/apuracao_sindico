"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Botao } from "@/ui/botao";

import estilos from "../../../admin.module.css";
import { chamarApi } from "../../../cliente";
import { contar, NOME_STATUS } from "../../../formato";
import { DialogoMotivo } from "../../../motivo";
import { Alerta } from "../../../pecas";
import proprio from "./god.module.css";
import type { EleicaoGod } from "./tipos";

/** Reabrir votação encerrada e zerar eleição de teste. */
export function Votacao({ eleicao }: { eleicao: EleicaoGod }) {
  const router = useRouter();
  const [dialogo, setDialogo] = useState<"reabrir" | "zerar" | null>(null);
  const [entendi, setEntendi] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  // Até a página voltar com o novo status, os botões ficam parados.
  const [atualizando, iniciar] = useTransition();

  function fechar() {
    setDialogo(null);
    setEntendi(false);
  }

  function feito(mensagem: string) {
    fechar();
    setAviso(mensagem);
    iniciar(() => router.refresh());
  }

  return (
    <div className={estilos.pilha}>
      {aviso && <Alerta tom="sucesso">{aviso}</Alerta>}
      <div className={estilos.grade2}>
        <section className={estilos.cartao}>
          <h2 className={estilos.cartaoTitulo}>Reabrir votação</h2>
          <p className={estilos.texto}>
            Volta a votação encerrada para aberta: o link e o QR aceitam votos
            de novo. O horário do encerramento fica no log.
          </p>
          {eleicao.status === "encerrada" ? (
            <Botao
              variante="contorno"
              iconeEsquerda="refresh-cw"
              carregando={atualizando}
              onClick={() => setDialogo("reabrir")}
            >
              Reabrir votação
            </Botao>
          ) : (
            <p className={proprio.condicao}>
              {eleicao.status === "publicada"
                ? "O resultado já foi publicado: a votação não reabre."
                : `Só votação encerrada reabre. Esta está ${NOME_STATUS[eleicao.status].toLowerCase()}.`}
            </p>
          )}
        </section>

        <section className={estilos.cartao}>
          <h2 className={estilos.cartaoTitulo}>Zerar eleição</h2>
          <p className={estilos.texto}>
            Apaga todos os votos, válidos e anulados, e as tentativas, e volta a
            eleição para rascunho. O log de auditoria fica. Só para eleição de
            teste, como o ensaio geral.
          </p>
          {eleicao.teste ? (
            <Botao
              variante="contorno"
              iconeEsquerda="triangle-alert"
              carregando={atualizando}
              onClick={() => setDialogo("zerar")}
            >
              Zerar eleição de teste
            </Botao>
          ) : (
            <p className={proprio.condicao}>
              Esta é uma eleição real: ela não pode ser zerada.
            </p>
          )}
        </section>
      </div>

      {dialogo === "reabrir" && (
        <DialogoMotivo
          titulo="Reabrir a votação?"
          descricao="O link de voto volta a aceitar votos até alguém encerrar de novo."
          rotuloConfirmar="Reabrir votação"
          aoFechar={fechar}
          aoConfirmar={async (motivo) => {
            await chamarApi(`/api/admin/eleicoes/${eleicao.id}/reabrir`, {
              corpo: { motivo },
            });
            feito("Votação reaberta.");
          }}
        />
      )}
      {dialogo === "zerar" && (
        <DialogoMotivo
          titulo="Zerar a eleição de teste?"
          descricao="Os votos são apagados de vez. Não dá para desfazer."
          rotuloConfirmar="Zerar eleição"
          podeConfirmar={entendi}
          aoFechar={fechar}
          aoConfirmar={async (motivo) => {
            const r = await chamarApi<{ votosApagados: number }>(
              `/api/admin/eleicoes/${eleicao.id}/zerar`,
              { corpo: { motivo } },
            );
            feito(
              `Eleição zerada: ${contar(r.votosApagados, "voto apagado", "votos apagados")}. Ela voltou para rascunho.`,
            );
          }}
        >
          <label className={estilos.marcar}>
            <input
              type="checkbox"
              checked={entendi}
              onChange={(e) => setEntendi(e.target.checked)}
            />
            Entendo que todos os votos desta eleição serão apagados.
          </label>
        </DialogoMotivo>
      )}
    </div>
  );
}
