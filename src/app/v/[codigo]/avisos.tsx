// Estados de tela cheia do apartamento escolhido: já votou, bloqueado e só
// pela mesa. As ações levam de volta à grade do bloco ou ao início.
import type { Apartamento } from "@/lib/api-publica";
import { Botao } from "@/ui/botao";

import type { Comprovante } from "./comprovantes";
import { formatarHora, nomeApartamento } from "./formato";
import { Aviso } from "./pecas";

type Acoes = { aoOutroApartamento: () => void; aoInicio: () => void };

function AcoesPadrao({ aoOutroApartamento, aoInicio }: Acoes) {
  return (
    <>
      <Botao
        variante="secundario"
        tamanho="g"
        larguraTotal
        onClick={aoOutroApartamento}
      >
        Escolher outro apartamento
      </Botao>
      <Botao variante="fantasma" tamanho="g" larguraTotal onClick={aoInicio}>
        Voltar ao início
      </Botao>
    </>
  );
}

export function AvisoJaVotou({
  apartamento,
  comprovante,
  conexaoCaiu,
  ...acoes
}: Acoes & {
  apartamento: Apartamento;
  /** Comprovante deste aparelho para o apartamento, se houver. */
  comprovante?: Comprovante;
  /** O voto foi enviado, a conexão caiu e o apartamento já aparece votado. */
  conexaoCaiu?: boolean;
}) {
  const olho = nomeApartamento(apartamento);
  if (comprovante) {
    return (
      <Aviso
        icone="circle-check"
        tom="sucesso"
        olho={olho}
        titulo="Você já votou por este apartamento"
        acoes={<AcoesPadrao {...acoes} />}
      >
        Comprovante {comprovante.codigo}, registrado às{" "}
        {formatarHora(comprovante.horario)}.
      </Aviso>
    );
  }
  if (conexaoCaiu) {
    return (
      <Aviso
        icone="info"
        tom="info"
        olho={olho}
        titulo="O voto deste apartamento já foi registrado"
        acoes={<AcoesPadrao {...acoes} />}
      >
        A conexão caiu antes do comprovante chegar. Procure a mesa para conferir
        o seu voto.
      </Aviso>
    );
  }
  return (
    <Aviso
      icone="circle-check"
      tom="aviso"
      olho={olho}
      titulo="Este apartamento já votou"
      acoes={<AcoesPadrao {...acoes} />}
    >
      Cada apartamento vota uma vez. Se ninguém da sua casa votou, procure a
      mesa.
    </Aviso>
  );
}

export function AvisoBloqueado({
  apartamento,
  ...acoes
}: Acoes & { apartamento: Apartamento }) {
  return (
    <Aviso
      icone="lock"
      tom="perigo"
      olho={nomeApartamento(apartamento)}
      titulo="Apartamento bloqueado. Procure a mesa."
      acoes={<AcoesPadrao {...acoes} />}
    >
      Três documentos não conferiram com os compradores. A mesa confere o
      documento e libera o voto.
    </Aviso>
  );
}

export function AvisoSoMesa({
  apartamento,
  ...acoes
}: Acoes & { apartamento: Apartamento }) {
  return (
    <Aviso
      icone="landmark"
      tom="aviso"
      olho={nomeApartamento(apartamento)}
      titulo="Este apartamento vota na mesa"
      acoes={<AcoesPadrao {...acoes} />}
    >
      Não há CPF ou CNPJ de comprador cadastrado para votar pelo celular.
      Procure a mesa do evento com um documento.
    </Aviso>
  );
}
