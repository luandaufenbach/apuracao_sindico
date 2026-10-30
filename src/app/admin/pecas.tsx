// Peças repetidas nas telas do painel.
import Link from "next/link";
import type { ReactNode } from "react";

import botao from "@/ui/botao.module.css";
import { Icone, type NomeIcone } from "@/ui/icone";
import { Selo } from "@/ui/selo";
import type { StatusEleicao } from "@/lib/eleicoes";

import estilos from "./admin.module.css";
import { NOME_STATUS, TOM_STATUS } from "./formato";

export function Cabecalho({
  olho,
  titulo,
  sub,
  acoes,
}: {
  olho?: ReactNode;
  titulo: ReactNode;
  sub?: ReactNode;
  acoes?: ReactNode;
}) {
  return (
    <header className={estilos.cabeca}>
      <div className={estilos.cabecaTexto}>
        {olho && <div className={estilos.olho}>{olho}</div>}
        <h1 className={estilos.titulo}>{titulo}</h1>
        {sub && <p className={estilos.sub}>{sub}</p>}
      </div>
      {acoes && <div className={estilos.acoes}>{acoes}</div>}
    </header>
  );
}

export function Campo({
  rotulo,
  dica,
  children,
}: {
  rotulo: string;
  dica?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className={estilos.campo}>
      <span className={estilos.rotuloCampo}>{rotulo}</span>
      {children}
      {dica && <span className={estilos.dica}>{dica}</span>}
    </label>
  );
}

const ALERTAS: Record<
  "erro" | "aviso" | "info" | "sucesso",
  { classe: string; icone: NomeIcone }
> = {
  erro: { classe: estilos.alertaErro, icone: "circle-x" },
  aviso: { classe: estilos.alertaAviso, icone: "triangle-alert" },
  info: { classe: estilos.alertaInfo, icone: "info" },
  sucesso: { classe: estilos.alertaSucesso, icone: "circle-check" },
};

export function Alerta({
  tom = "erro",
  children,
}: {
  tom?: keyof typeof ALERTAS;
  children: ReactNode;
}) {
  const { classe, icone } = ALERTAS[tom];
  return (
    <div
      className={`${estilos.alerta} ${classe}`}
      role={tom === "erro" ? "alert" : "status"}
    >
      <Icone nome={icone} tamanho={16} />
      <div>{children}</div>
    </div>
  );
}

export function SeloStatus({ status }: { status: StatusEleicao }) {
  return (
    <Selo tom={TOM_STATUS[status]} vivo={status === "aberta"}>
      {NOME_STATUS[status]}
    </Selo>
  );
}

/** Link com cara de botão (Button do Lumen), contorno por padrão. */
export function LinkBotao({
  href,
  icone,
  children,
  externo,
  variante = "contorno",
}: {
  href: string;
  icone?: NomeIcone;
  children: ReactNode;
  externo?: boolean;
  variante?: "primario" | "secundario" | "contorno" | "fantasma";
}) {
  const classe = `${botao.botao} ${botao[variante]} ${botao.m}`;
  const conteudo = (
    <>
      {icone && <Icone nome={icone} tamanho={16} />}
      {children}
    </>
  );
  return externo ? (
    <a href={href} target="_blank" rel="noreferrer" className={classe}>
      {conteudo}
    </a>
  ) : (
    <Link href={href} className={classe}>
      {conteudo}
    </Link>
  );
}
