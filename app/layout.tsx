import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VitrineAuto Marketplace",
  description: "Marketplace automotivo para varejo, lojistas e oportunidades de repasse.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
