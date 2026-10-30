"use client";

import { useRef, useState } from "react";

import { GRUPOS_ACAO, type GrupoAcao } from "@/lib/acoes";
import { Botao } from "@/ui/botao";
import { Selo } from "@/ui/selo";

import estilos from "../../../admin.module.css";
import { chamarApi, mensagemDe } from "../../../cliente";
import { dataHora, NOME_ACAO } from "../../../formato";
import { Alerta, Campo } from "../../../pecas";
import proprio from "./god.module.css";
import type { PaginaAuditoria, UsuarioGod } from "./tipos";

// Um rótulo para cada grupo que o servidor aceita: grupo novo sem rótulo não
// compila.
const NOME_GRUPO: Record<GrupoAcao, string> = {
  voto: "Votos",
  eleicao: "Eleição",
  documento: "Documento do eleitor",
  apto: "Apartamentos",
  candidato: "Candidatos",
  usuario: "Usuários",
  sessao: "Entradas no painel",
  empreendimento: "Empreendimentos",
  importacao: "Importação",
};
const GRUPOS = [
  { valor: "", rotulo: "Todas as ações" },
  ...GRUPOS_ACAO.map((g) => ({ valor: g, rotulo: NOME_GRUPO[g] })),
];

type Filtros = {
  escopo: "eleicao" | "tudo";
  grupo: string;
  usuarioId: string;
  godmode: boolean;
};
const INICIAIS: Filtros = {
  escopo: "eleicao",
  grupo: "",
  usuarioId: "",
  godmode: false,
};
const iniciais = (f: Filtros) =>
  f.escopo === "eleicao" && !f.grupo && !f.usuarioId && !f.godmode;

type Item = PaginaAuditoria["itens"][number];

/** Log de auditoria com filtros, do mais novo para o mais antigo. */
export function Auditoria({
  eleicaoId,
  inicial,
  usuarios,
}: {
  eleicaoId: number;
  inicial: PaginaAuditoria;
  usuarios: UsuarioGod[];
}) {
  const [filtros, setFiltros] = useState(INICIAIS);
  const [itens, setItens] = useState<Item[]>(inicial.itens);
  const [proximo, setProximo] = useState(inicial.proximo);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const ultima = useRef(0);

  // Cada ação do godmode refaz a página (router.refresh), que traz o log
  // novo. Nos filtros iniciais, a lista acompanha; com outro filtro, avisa.
  const [base, setBase] = useState(inicial);
  const [novidade, setNovidade] = useState(false);
  if (inicial !== base) {
    setBase(inicial);
    if (iniciais(filtros)) {
      setItens(inicial.itens);
      setProximo(inicial.proximo);
    } else {
      setNovidade(true);
    }
  }

  async function consultar(f: Filtros, antes?: number) {
    const busca = new URLSearchParams();
    if (f.escopo === "eleicao") busca.set("eleicaoId", String(eleicaoId));
    if (f.grupo) busca.set("grupo", f.grupo);
    if (f.usuarioId) busca.set("usuarioId", f.usuarioId);
    if (f.godmode) busca.set("godmode", "1");
    if (antes) busca.set("antes", String(antes));
    // Filtro trocado com uma consulta em andamento: só a última vale.
    const vez = ++ultima.current;
    setCarregando(true);
    setErro(null);
    try {
      const r = await chamarApi<PaginaAuditoria>(
        `/api/admin/auditoria?${busca}`,
        { metodo: "GET" },
      );
      if (vez !== ultima.current) return;
      setItens((atuais) => (antes ? [...atuais, ...r.itens] : r.itens));
      setProximo(r.proximo);
      if (!antes) setNovidade(false);
    } catch (falha) {
      if (vez === ultima.current) setErro(mensagemDe(falha));
    } finally {
      if (vez === ultima.current) setCarregando(false);
    }
  }

  function mudar(parte: Partial<Filtros>) {
    const novos = { ...filtros, ...parte };
    setFiltros(novos);
    consultar(novos);
  }

  return (
    <section className={estilos.cartao}>
      <div className={estilos.cartaoCabeca}>
        <h2 className={estilos.cartaoTitulo}>Auditoria</h2>
        <Botao
          variante="fantasma"
          tamanho="p"
          iconeEsquerda="refresh-cw"
          carregando={carregando}
          onClick={() => consultar(filtros)}
        >
          Atualizar
        </Botao>
      </div>
      <div className={proprio.filtros}>
        <Campo rotulo="Onde">
          <select
            className={`${estilos.controle} ${estilos.pequeno}`}
            value={filtros.escopo}
            onChange={(e) =>
              mudar({ escopo: e.target.value as Filtros["escopo"] })
            }
          >
            <option value="eleicao">Esta eleição</option>
            <option value="tudo">Todo o painel</option>
          </select>
        </Campo>
        <Campo rotulo="Ação">
          <select
            className={`${estilos.controle} ${estilos.pequeno}`}
            value={filtros.grupo}
            onChange={(e) => mudar({ grupo: e.target.value })}
          >
            {GRUPOS.map((g) => (
              <option key={g.valor} value={g.valor}>
                {g.rotulo}
              </option>
            ))}
          </select>
        </Campo>
        <Campo rotulo="Usuário">
          <select
            className={`${estilos.controle} ${estilos.pequeno}`}
            value={filtros.usuarioId}
            onChange={(e) => mudar({ usuarioId: e.target.value })}
          >
            <option value="">Todos</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>
        </Campo>
        <label className={estilos.marcar}>
          <input
            type="checkbox"
            checked={filtros.godmode}
            onChange={(e) => mudar({ godmode: e.target.checked })}
          />
          Só ações de godmode
        </label>
      </div>
      {erro && <Alerta>{erro}</Alerta>}
      {novidade && !erro && (
        <Alerta tom="info">Há ações novas no log. Toque em Atualizar.</Alerta>
      )}
      {itens.length === 0 ? (
        <p className={estilos.vazio}>Nenhuma ação com estes filtros.</p>
      ) : (
        <ol className={proprio.log}>
          {itens.map((i) => (
            <li key={i.id} className={proprio.logItem}>
              <span className={estilos.linhaMeta}>
                {dataHora(i.criadoEm)}
                {filtros.escopo === "tudo" && i.eleicao && ` · ${i.eleicao}`}
              </span>
              <span className={proprio.logAcao}>
                {NOME_ACAO[i.acao] ?? i.acao}
                {(i.detalhe ?? i.alvo) && (
                  <span className={estilos.linhaMeta}>
                    {" "}
                    · {i.detalhe ?? i.alvo}
                  </span>
                )}
              </span>
              <span className={proprio.logQuem}>
                {i.usuario ?? <Selo>Eleitor</Selo>}
              </span>
              {i.motivo && <span className={proprio.motivo}>{i.motivo}</span>}
              {i.dados && Object.keys(i.dados).length > 0 && (
                <details className={proprio.logDados}>
                  <summary>Dados</summary>
                  <pre>{JSON.stringify(i.dados, null, 2)}</pre>
                </details>
              )}
            </li>
          ))}
        </ol>
      )}
      {proximo && (
        <Botao
          variante="contorno"
          carregando={carregando}
          onClick={() => consultar(filtros, proximo)}
        >
          Carregar mais
        </Botao>
      )}
    </section>
  );
}
