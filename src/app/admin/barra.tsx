"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import type { Papel } from "@/lib/auth";
import { Botao } from "@/ui/botao";
import { Selo } from "@/ui/selo";

import estilos from "./admin.module.css";
import { chamarApi } from "./cliente";

const LINKS = [
  { href: "/admin/eleicoes", rotulo: "Eleições" },
  { href: "/admin/empreendimentos", rotulo: "Empreendimentos" },
];

export function Barra({ nome, papel }: { nome: string; papel: Papel }) {
  const caminho = usePathname();
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    setSaindo(true);
    try {
      await chamarApi("/api/admin/logout");
    } finally {
      // O refresh refaz o layout, que volta sem a barra.
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <header className={estilos.barra}>
      <Link href="/admin" className={estilos.marca}>
        Apuração
      </Link>
      <nav className={estilos.links} aria-label="Painel">
        {LINKS.map((l) => {
          const ativo = caminho.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`${estilos.link} ${ativo ? estilos.linkAtivo : ""}`}
              aria-current={ativo ? "page" : undefined}
            >
              {l.rotulo}
            </Link>
          );
        })}
      </nav>
      <div className={estilos.usuario}>
        <span className={estilos.nomeUsuario}>{nome}</span>
        <Selo tom={papel === "god" ? "info" : "neutro"}>
          {papel === "god" ? "God" : "Operador"}
        </Selo>
        <Botao
          variante="fantasma"
          tamanho="p"
          iconeEsquerda="log-out"
          carregando={saindo}
          onClick={sair}
        >
          Sair
        </Botao>
      </div>
    </header>
  );
}
