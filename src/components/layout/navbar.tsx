import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";

interface NavbarProps { admin?: boolean; }

const publicLinks = [
  { href: "/", label: "Beranda" },
  { href: "/rekomendasi", label: "Cari Resep" },
];
const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/resep", label: "Resep" },
  { href: "/admin/bahan", label: "Bahan & Harga" },
  { href: "/admin/impor", label: "Impor" },
];

export function Navbar({ admin = false }: NavbarProps) {
  const links = admin ? adminLinks : publicLinks;
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-page flex min-h-16 items-center justify-between gap-4">
        <BrandMark />
        <nav aria-label={admin ? "Navigasi admin" : "Navigasi utama"} className="hidden items-center gap-1 md:flex">
          {links.map((link) => <Link key={link.href} href={link.href} className="nav-link">{link.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          {!admin && <Link href="/rekomendasi" className="hidden min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[var(--button-primary-hover)] sm:inline-flex">Cari Resep</Link>}
          <details className="relative md:hidden">
            <summary className="grid min-h-11 min-w-11 cursor-pointer list-none place-items-center rounded-lg border text-sm font-semibold hover:bg-muted focus-visible:outline-none">Menu<span className="sr-only"> navigasi</span></summary>
            <nav aria-label="Navigasi mobile" className="absolute right-0 top-14 z-50 grid min-w-48 gap-1 rounded-xl border bg-card p-2 shadow-lg">
              {links.map((link) => <Link key={link.href} href={link.href} className="nav-link">{link.label}</Link>)}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
