import { z } from "zod";

import { desativarUsuario } from "@/lib/usuarios";

import { idDaRota, lerCorpo, rotaGod } from "../../../comum";

const corpoMotivo = z.object({ motivo: z.string() });

/** Desativa o usuário: ele perde o acesso na próxima requisição. */
export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/usuarios/[id]/desativar">,
) {
  return rotaGod(req, async (usuario) => {
    const { motivo } = await lerCorpo(req, corpoMotivo);
    await desativarUsuario({
      alvoId: await idDaRota(ctx.params),
      usuarioId: usuario.id,
      motivo,
    });
  });
}
