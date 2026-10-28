import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

interface AppShellProps { children: ReactNode; admin?: boolean; }

export function AppShell({ children, admin = false }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">Lewati ke isi utama</a>
      <Navbar admin={admin} />
      <main id="main-content" className="flex-1">{children}</main>
      {!admin && <Footer />}
    </div>
  );
}
