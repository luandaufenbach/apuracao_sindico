import type { Metadata } from "next";

import { exigirUsuarioPagina } from "@/lib/auth";
import { listarAuditoria } from "@/lib/godmode";
import { listarUsuarios } from "@/lib/usuarios";

import { paraJson } from "../formato";
import { Usuarios } from "./usuarios";

export const metadata: Metadata = { title: "Usuários" };

// Só o god: o operador recebe 404, como em qualquer página que não é dele.
export default async function PaginaUsuarios() {
  const eu = await exigirUsuarioPagina(["god"]);
  const [usuarios, historico] = await Promise.all([
    listarUsuarios(),
    listarAuditoria({ grupo: "usuario", limite: 50 }),
  ]);
  return (
    <Usuarios
      usuarios={usuarios}
      historico={paraJson(historico.itens)}
      euId={eu.id}
    />
  );
}
