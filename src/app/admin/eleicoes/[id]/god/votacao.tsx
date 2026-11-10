"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Botao } from "@/ui/botao";

import estilos from "../../../admin.module.css";
import { chamarApi } from "../../../cliente";
import { NOME_STATUS } from "../../../formato";
import { DialogoMotivo } from "../../../motivo";
import { Alerta } from "../../../pecas";
import proprio from "./god.module.css";
import type { EleicaoGod } from "./tipos";

/** Reabrir votação encerrada. */
export function Votacao({ eleicao }: { eleicao: EleicaoGod }) {
  const router = useRouter();
  const [dialogo, setDialogo] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  // Até a página voltar com o novo status, o botão fica parado.
  const [atualizando, iniciar] = useTransition();

  return (
    <div className={estilos.pilha}>
      {aviso && <Alerta tom="sucesso">{aviso}</Alerta>}
      <section className={estilos.cartao}>
        <h2 className={estilos.cartaoTitulo}>Reabrir votação</h2>
        <p className={estilos.texto}>
          Volta a votação encerrada para aberta: o link e o QR aceitam votos de
          novo. O horário do encerramento fica no log.
        </p>
        {eleicao.status === "encerrada" ? (
          <Botao
            variante="contorno"
            iconeEsquerda="refresh-cw"
            carregando={atualizando}
            onClick={() => setDialogo(true)}
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

      {dialogo && (
        <DialogoMotivo
          titulo="Reabrir a votação?"
          descricao="O link de voto volta a aceitar votos até alguém encerrar de novo."
          rotuloConfirmar="Reabrir votação"
          aoFechar={() => setDialogo(false)}
          aoConfirmar={async (motivo) => {
            await chamarApi(`/api/admin/eleicoes/${eleicao.id}/reabrir`, {
              corpo: { motivo },
            });
            setDialogo(false);
            setAviso("Votação reaberta.");
            iniciar(() => router.refresh());
          }}
        />
      )}
    </div>
  );
}
