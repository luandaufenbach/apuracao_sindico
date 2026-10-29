import type { Metadata } from "next";

import { Telao } from "./telao";

export const metadata: Metadata = { title: "Telão da votação" };

export default async function Pagina({ params }: PageProps<"/telao/[codigo]">) {
  const { codigo } = await params;
  return <Telao codigo={codigo} />;
}
