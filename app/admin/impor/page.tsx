import type { Metadata } from "next";
import { mockImportService } from "@/lib/services/import-mock";
import { ImportManagementView } from "@/components/admin/import/import-management-view";

export const metadata: Metadata = {
  title: "Tinjau Impor | Admin DapurCuan",
  description: "Manajemen dan kurasi antrean impor data resep dan bahan masakan dari sumber eksternal berlisensi terbuka.",
};

export default async function AdminImportPage() {
  const [initialCandidates, sources] = await Promise.all([
    mockImportService.getImportCandidates(),
    mockImportService.getImportSources(),
  ]);

  return (
    <ImportManagementView
      initialCandidates={initialCandidates}
      sources={sources}
    />
  );
}
