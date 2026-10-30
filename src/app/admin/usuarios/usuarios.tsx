"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import type { ItemAuditoria } from "@/lib/godmode";
import { Botao } from "@/ui/botao";
import { Selo } from "@/ui/selo";

import estilos from "../admin.module.css";
import { chamarApi, mensagemDe } from "../cliente";
import { dataHora, type Json, NOME_ACAO } from "../formato";
import { DialogoMotivo } from "../motivo";
import { Alerta, Cabecalho, Campo } from "../pecas";
import proprio from "./usuarios.module.css";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  papel: "operador" | "god";
  ativo: boolean;
};

const VAZIO = { nome: "", email: "", senha: "", papel: "operador", motivo: "" };

// Sem 0/O/1/l/I, para ditar a senha sem confusão.
const ALFABETO = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
function gerarSenha(): string {
  const bytes = crypto.getRandomValues(new Uint32Array(12));
  return Array.from(bytes, (n) => ALFABETO[n % ALFABETO.length]).join("");
}

/** Usuários do painel: só o god cria e desativa, sempre com motivo. */
export function Usuarios({
  usuarios,
  historico,
  euId,
}: {
  usuarios: Usuario[];
  historico: Json<ItemAuditoria>[];
  euId: number;
}) {
  const router = useRouter();
  const [novo, setNovo] = useState(VAZIO);
  const [verSenha, setVerSenha] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [desativar, setDesativar] = useState<Usuario | null>(null);

  const mudar =
    (campo: keyof typeof VAZIO) => (e: { target: { value: string } }) =>
      setNovo((n) => ({ ...n, [campo]: e.target.value }));

  async function criar(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    setAviso(null);
    try {
      await chamarApi("/api/admin/usuarios", { corpo: novo });
      setAviso(
        `${novo.nome.trim()} pode entrar com ${novo.email.trim().toLowerCase()} e a senha definida.`,
      );
      setNovo(VAZIO);
      setVerSenha(false);
      router.refresh();
    } catch (falha) {
      setErro(mensagemDe(falha));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className={estilos.pagina}>
      <Cabecalho
        titulo="Usuários do painel"
        sub="Só o god cria e desativa usuários. Quem é desativado perde o acesso na hora."
      />
      <div className={estilos.pilha}>
        {aviso && <Alerta tom="sucesso">{aviso}</Alerta>}
        <div className={estilos.duas}>
          <section className={estilos.cartao}>
            <h2 className={estilos.cartaoTitulo}>
              Usuários ({usuarios.filter((u) => u.ativo).length} ativos)
            </h2>
            <div className={estilos.lista}>
              {usuarios.map((u) => (
                <div key={u.id} className={estilos.linha}>
                  <div className={estilos.linhaPrincipal}>
                    <span className={estilos.linhaTitulo}>{u.nome}</span>
                    <span className={estilos.linhaMeta}>{u.email}</span>
                  </div>
                  <Selo tom={u.papel === "god" ? "info" : "neutro"}>
                    {u.papel === "god" ? "God" : "Operador"}
                  </Selo>
                  {!u.ativo ? (
                    <Selo tom="perigo">Desativado</Selo>
                  ) : u.id === euId ? (
                    <Selo tom="sucesso">Você</Selo>
                  ) : (
                    <Botao
                      variante="contorno"
                      tamanho="p"
                      onClick={() => setDesativar(u)}
                    >
                      Desativar
                    </Botao>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className={estilos.cartao}>
            <h2 className={estilos.cartaoTitulo}>Novo usuário</h2>
            <form className={estilos.formulario} onSubmit={criar}>
              <Campo rotulo="Nome">
                <input
                  className={estilos.controle}
                  value={novo.nome}
                  onChange={mudar("nome")}
                  maxLength={120}
                  required
                />
              </Campo>
              <Campo rotulo="E-mail">
                <input
                  className={estilos.controle}
                  type="email"
                  value={novo.email}
                  onChange={mudar("email")}
                  maxLength={200}
                  autoComplete="off"
                  required
                />
              </Campo>
              <Campo
                rotulo="Senha"
                dica="De 8 a 72 caracteres. Passe para a pessoa em particular."
              >
                <input
                  className={`${estilos.controle} ${estilos.mono}`}
                  type={verSenha ? "text" : "password"}
                  value={novo.senha}
                  onChange={mudar("senha")}
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  required
                />
              </Campo>
              <div className={proprio.senha}>
                <label className={estilos.marcar}>
                  <input
                    type="checkbox"
                    checked={verSenha}
                    onChange={(e) => setVerSenha(e.target.checked)}
                  />
                  Mostrar a senha
                </label>
                <Botao
                  variante="fantasma"
                  tamanho="p"
                  iconeEsquerda="refresh-cw"
                  onClick={() => {
                    setNovo((n) => ({ ...n, senha: gerarSenha() }));
                    setVerSenha(true);
                  }}
                >
                  Gerar senha
                </Botao>
              </div>
              <Campo
                rotulo="Papel"
                dica="O god vê em quem cada apartamento votou e pode anular votos."
              >
                <select
                  className={estilos.controle}
                  value={novo.papel}
                  onChange={mudar("papel")}
                >
                  <option value="operador">Operador</option>
                  <option value="god">God</option>
                </select>
              </Campo>
              <Campo
                rotulo="Motivo"
                dica="Obrigatório. Fica no log de auditoria."
              >
                <textarea
                  className={estilos.controle}
                  value={novo.motivo}
                  onChange={mudar("motivo")}
                  maxLength={500}
                  rows={2}
                  required
                />
              </Campo>
              {erro && <Alerta>{erro}</Alerta>}
              <Botao type="submit" larguraTotal carregando={enviando}>
                Criar usuário
              </Botao>
            </form>
          </section>
        </div>

        <section className={estilos.cartao}>
          <h2 className={estilos.cartaoTitulo}>Histórico</h2>
          {historico.length === 0 ? (
            <p className={estilos.texto}>
              Nenhum usuário criado ou desativado.
            </p>
          ) : (
            <div className={estilos.lista}>
              {historico.map((h) => (
                <div key={h.id} className={estilos.linha}>
                  <div className={estilos.linhaPrincipal}>
                    <span>
                      {NOME_ACAO[h.acao] ?? h.acao}
                      {h.detalhe && `: ${h.detalhe}`}
                    </span>
                    <span className={estilos.linhaMeta}>
                      {dataHora(h.criadoEm)} · por {h.usuario ?? "—"}
                    </span>
                  </div>
                  {h.motivo && (
                    <span className={proprio.motivo}>{h.motivo}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {desativar && (
        <DialogoMotivo
          titulo={`Desativar ${desativar.nome}?`}
          descricao={`${desativar.email} perde o acesso ao painel na hora. O usuário não é apagado: o histórico dele fica no log.`}
          rotuloConfirmar="Desativar"
          aoFechar={() => setDesativar(null)}
          aoConfirmar={async (motivo) => {
            await chamarApi(`/api/admin/usuarios/${desativar.id}/desativar`, {
              corpo: { motivo },
            });
            setAviso(`${desativar.nome} foi desativado.`);
            setDesativar(null);
            router.refresh();
          }}
        />
      )}
    </main>
  );
}
