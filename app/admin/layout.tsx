import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AdminAuthBarrier } from "@/components/admin/admin-auth-barrier";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell admin>
      <AdminAuthBarrier>{children}</AdminAuthBarrier>
    </AppShell>
  );
}
