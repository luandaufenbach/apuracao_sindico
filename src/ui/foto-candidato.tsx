import type { Candidato } from "@/lib/api-publica";

/** Até duas iniciais do nome, para quem não tem foto. */
export const iniciais = (nome: string) =>
  nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

/**
 * Foto do candidato ou, sem foto, as iniciais num quadrado azul (como os
 * ícones do Lumen). Cada tela passa a classe de cada caso.
 */
export function FotoCandidato({
  candidato,
  classeFoto,
  classeIniciais,
}: {
  candidato: Pick<Candidato, "nome" | "foto">;
  classeFoto: string;
  classeIniciais: string;
}) {
  if (!candidato.foto) {
    return (
      <span className={classeIniciais} aria-hidden="true">
        {iniciais(candidato.nome)}
      </span>
    );
  }
  // Data URL de 400 px vinda do cadastro: o next/image não otimiza data URL.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={candidato.foto} alt="" className={classeFoto} />;
}
