"use client";

import { type FormEvent, type ReactNode, useId, useState } from "react";

import { Botao } from "@/ui/botao";
import { Dialogo } from "@/ui/dialogo";

import estilos from "./admin.module.css";
import { mensagemDe } from "./cliente";
import { Alerta, Campo } from "./pecas";

/**
 * Diálogo das ações de godmode (R8): o motivo é obrigatório e vai para o log
 * de auditoria e o relatório. Fica aberto enquanto montado; quem abre
 * desmonta ao fechar, e o motivo começa vazio a cada vez.
 */
export function DialogoMotivo({
  titulo,
  descricao,
  rotuloConfirmar,
  aoFechar,
  aoConfirmar,
  podeConfirmar = true,
  dicaMotivo,
  children,
}: {
  titulo: string;
  descricao?: ReactNode;
  rotuloConfirmar: string;
  aoFechar: () => void;
  /** Lança erro (ErroApi) com a mensagem que o diálogo mostra. */
  aoConfirmar: (motivo: string) => Promise<void>;
  podeConfirmar?: boolean;
  dicaMotivo?: string;
  children?: ReactNode;
}) {
  const id = useId();
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function confirmar(e: FormEvent) {
    e.preventDefault();
    if (!motivo.trim()) {
      setErro("Informe o motivo.");
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      await aoConfirmar(motivo.trim());
    } catch (falha) {
      setErro(mensagemDe(falha));
      setEnviando(false);
    }
  }

  return (
    <Dialogo
      aberto
      aoFechar={aoFechar}
      fixo={enviando}
      titulo={titulo}
      descricao={descricao}
      rodape={
        <>
          <Botao variante="contorno" onClick={aoFechar} disabled={enviando}>
            Cancelar
          </Botao>
          <Botao
            type="submit"
            form={id}
            carregando={enviando}
            disabled={!podeConfirmar}
          >
            {rotuloConfirmar}
          </Botao>
        </>
      }
    >
      <form id={id} className={estilos.formulario} onSubmit={confirmar}>
        {children}
        <Campo
          rotulo="Motivo"
          dica={
            dicaMotivo ??
            "Obrigatório. Fica no log de auditoria e no relatório final."
          }
        >
          <textarea
            className={estilos.controle}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            maxLength={500}
            rows={3}
            required
          />
        </Campo>
        {erro && <Alerta>{erro}</Alerta>}
      </form>
    </Dialogo>
  );
}
