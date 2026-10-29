"use client";

import type { TipoDocumento } from "@/lib/documento";

import e from "./eleitor.module.css";
import {
  formatarDocumento,
  limparDocumento,
  MASCARA,
  tipoExibido,
} from "./formato";

/**
 * Campo de CPF ou CNPJ com máscara: o que falta digitar aparece em cinza
 * (`126.___.___-__`). `valor` tem só letras e dígitos, sem pontuação.
 */
export function CampoDocumento({
  id,
  rotulo,
  tipo,
  valor,
  aoMudar,
  invalido,
  descricao,
}: {
  id: string;
  rotulo: string;
  /** Tipo das dicas; null quando o apartamento tem CPF e CNPJ. */
  tipo: TipoDocumento | null;
  valor: string;
  aoMudar: (valor: string) => void;
  invalido?: boolean;
  /** Id do texto de erro (aria-describedby). */
  descricao?: string;
}) {
  const tipoAtual = tipoExibido(tipo, valor);
  const formatado = formatarDocumento(valor, tipoAtual);
  const mascara = MASCARA[tipoAtual];
  return (
    <div className={e.campo}>
      <label htmlFor={id} className={e.rotulo}>
        {rotulo}
      </label>
      <div className={`${e.controle} ${invalido ? e.controleInvalido : ""}`}>
        <span className={e.mascara} aria-hidden="true">
          <span>{formatado}</span>
          {mascara.slice(formatado.length)}
        </span>
        <input
          id={id}
          name="documento"
          className={e.entrada}
          value={formatado}
          onChange={(ev) => aoMudar(limparDocumento(ev.target.value))}
          // Cursor no fim: a máscara só acompanha quem digita em sequência.
          onFocus={(ev) => {
            const campo = ev.currentTarget;
            requestAnimationFrame(() =>
              campo.setSelectionRange(campo.value.length, campo.value.length),
            );
          }}
          inputMode={tipo === "cpf" ? "numeric" : "text"}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          enterKeyHint="go"
          aria-invalid={invalido || undefined}
          aria-describedby={descricao}
        />
      </div>
    </div>
  );
}
