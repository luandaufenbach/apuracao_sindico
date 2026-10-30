import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { exigirUsuarioPagina } from "@/lib/auth";
import { buscarEmpreendimento } from "@/lib/cadastro";
import { idBanco } from "@/lib/erros";

import estilos from "../../../admin.module.css";
import { Cabecalho } from "../../../pecas";
import { Importador } from "./importador";

export const metadata: Metadata = { title: "Importar planilha" };

export default async function Importar({
  params,
}: PageProps<"/admin/empreendimentos/[id]/importar">) {
  await exigirUsuarioPagina();
  const id = idBanco.safeParse(Number((await params).id));
  const emp = id.success ? await buscarEmpreendimento(id.data) : null;
  if (!emp) notFound();
  return (
    <main className={estilos.pagina}>
      <Cabecalho
        olho={
          <>
            <Link href="/admin/empreendimentos">Empreendimentos</Link>
            <span>/</span>
            <Link href={`/admin/empreendimentos/${emp.id}`}>{emp.nome}</Link>
            <span>/</span>
          </>
        }
        titulo="Importar planilha"
        sub="Arquivo .xlsx ou .csv. Nada é gravado antes de você conferir a prévia."
      />
      <Importador empreendimentoId={emp.id} />
    </main>
  );
}
