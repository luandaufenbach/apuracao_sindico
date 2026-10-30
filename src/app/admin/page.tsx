import { redirect } from "next/navigation";

import { exigirUsuarioPagina } from "@/lib/auth";

export default async function Inicio() {
  await exigirUsuarioPagina();
  redirect("/admin/eleicoes");
}
