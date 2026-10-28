import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container-page flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 DapurCuan. Masak hemat, makan nikmat.</p>
        <nav aria-label="Navigasi footer" className="flex gap-4">
          <Link href="/" className="rounded underline-offset-4 hover:text-foreground hover:underline">Beranda</Link>
          <Link href="/rekomendasi" className="rounded underline-offset-4 hover:text-foreground hover:underline">Rekomendasi</Link>
        </nav>
      </div>
    </footer>
  );
}
