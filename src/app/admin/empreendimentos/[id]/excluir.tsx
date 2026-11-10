"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Botao } from "@/ui/botao";

import estilos from "../../admin.module.css";
import { chamarApi } from "../../cliente";
import { DialogoMotivo } from "../../motivo";
import { Campo } from "../../pecas";

/** Exclusão do empreendimento pelo god: motivo e o nome digitado de novo. */
export function Excluir({
  empreendimentoId,
  nome,
}: {
  empreendimentoId: number;
  nome: string;
}) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [confirmacao, setConfirmacao] = useState("");

  function fechar() {
    setAberto(false);
    setConfirmacao("");
  }

  return (
    <section className={estilos.cartao}>
      <h2 className={estilos.cartaoTitulo}>Excluir empreendimento</h2>
      <p className={estilos.texto}>
        Apaga os apartamentos, os compradores e as eleições sem voto. Não dá
        para excluir se alguma eleição já tem voto.
      </p>
      <Botao
        variante="contorno"
        iconeEsquerda="triangle-alert"
        onClick={() => setAberto(true)}
      >
        Excluir empreendimento
      </Botao>
      {aberto && (
        <DialogoMotivo
          titulo="Excluir o empreendimento?"
          descricao="Apartamentos, compradores e eleições são apagados de vez. Não dá para desfazer."
          rotuloConfirmar="Excluir empreendimento"
          podeConfirmar={confirmacao.trim() === nome.trim()}
          dicaMotivo="Obrigatório. Fica no log de auditoria."
          aoFechar={fechar}
          aoConfirmar={async (motivo) => {
            await chamarApi(
              `/api/admin/empreendimentos/${empreendimentoId}/excluir`,
              { corpo: { motivo, confirmacao } },
            );
            router.replace("/admin/empreendimentos");
            router.refresh();
          }}
        >
          <Campo rotulo="Para confirmar, digite o nome" dica={nome}>
            <input
              className={estilos.controle}
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              autoComplete="off"
              maxLength={200}
            />
          </Campo>
        </DialogoMotivo>
      )}
    </section>
  );
}
