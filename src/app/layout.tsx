import type { Metadata } from "next";

import "@/ui/lumen/styles.css";

export const metadata: Metadata = {
  title: "Apuração de síndico",
  description: "Eleição de síndico com um voto válido por apartamento.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
