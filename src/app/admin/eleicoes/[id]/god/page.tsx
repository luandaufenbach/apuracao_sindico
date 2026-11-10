import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { exigirUsuarioPagina } from "@/lib/auth";
import { buscarEleicao } from "@/lib/eleicoes";
import { idBanco } from "@/lib/erros";
import { listarAuditoria, votosPorDocumento } from "@/lib/godmode";
import { dadosPainel } from "@/lib/painel";
import { listarUsuarios } from "@/lib/usuarios";

import { paraJson } from "../../../formato";
import { Godmode } from "./godmode";

export const metadata: Metadata = { title: "Godmode" };

// Só o god: o operador recebe 404, como em qualquer página que não é dele.
export default async function PaginaGodmode({
  params,
  searchParams,
}: PageProps<"/admin/eleicoes/[id]/god">) {
  await exigirUsuarioPagina(["god"]);
  const id = idBanco.safeParse(Number((await params).id));
  if (!id.success) notFound();
  const [el, painel, documentos, auditoria, usuarios] = await Promise.all([
    buscarEleicao(id.data),
    dadosPainel(id.data),
    votosPorDocumento(id.data),
    listarAuditoria({ eleicaoId: id.data }),
    listarUsuarios(),
  ]);
  if (!el || !painel || !documentos) notFound();
  const { aba } = await searchParams;

  return (
    <Godmode
      eleicao={{
        id: el.id,
        titulo: el.titulo,
        status: el.status,
        empreendimento: el.empreendimento,
      }}
      candidatos={el.candidatos.map((c) => ({
        id: c.id,
        nome: c.nome,
        foto: c.foto,
        proposta: c.proposta,
        apartamento: c.bloco && c.rotulo ? `${c.bloco}, ${c.rotulo}` : null,
      }))}
      apartamentos={painel.apartamentos.map((a) => ({
        id: a.id,
        bloco: a.bloco,
        rotulo: a.rotulo,
        votou: a.votouEm !== null,
        bloqueado: a.bloqueado,
        soMesa: a.soMesa,
      }))}
      documentos={paraJson(documentos)}
      auditoria={paraJson(auditoria)}
      usuarios={usuarios.map((u) => ({ id: u.id, nome: u.nome }))}
      abaInicial={typeof aba === "string" ? aba : undefined}
    />
  );
}
