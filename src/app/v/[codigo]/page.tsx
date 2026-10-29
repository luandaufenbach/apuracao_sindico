import type { Metadata, Viewport } from "next";

import { Eleitor } from "./eleitor";

export const metadata: Metadata = { title: "Votação para síndico" };

export const viewport: Viewport = { themeColor: "#000000" };

export default async function Pagina({ params }: PageProps<"/v/[codigo]">) {
  const { codigo } = await params;
  return <Eleitor codigo={codigo} />;
}
