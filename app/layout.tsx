import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "DapurCuan — Resep sesuai budget", template: "%s | DapurCuan" },
  description: "Temukan resep hemat yang sesuai budget, porsi, dan selera kamu.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
