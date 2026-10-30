import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { exigirUsuarioPagina } from "@/lib/auth";
import { idBanco } from "@/lib/erros";
import { dadosPainel } from "@/lib/painel";

import { paraJson } from "../../../formato";
import { Painel } from "./painel";

export const metadata: Metadata = { title: "Painel ao vivo" };

export default async function PaginaPainel({
  params,
}: PageProps<"/admin/eleicoes/[id]/painel">) {
  await exigirUsuarioPagina();
  const id = idBanco.safeParse(Number((await params).id));
  const dados = id.success ? await dadosPainel(id.data) : null;
  if (!dados) notFound();
  // Mesmo formato que a API devolve no polling: datas como texto.
  return <Painel inicial={paraJson(dados)} />;
}
