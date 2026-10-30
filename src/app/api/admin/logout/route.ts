import { conferirOrigem, sair } from "@/lib/auth";

import { responder } from "../comum";

export async function POST(req: Request) {
  return responder(async () => {
    conferirOrigem(req);
    await sair();
  });
}
