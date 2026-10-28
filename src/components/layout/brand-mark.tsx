import { CookingPot } from "lucide-react";
import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-lg font-bold text-foreground" aria-label="DapurCuan, kembali ke beranda">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground" aria-hidden="true"><CookingPot className="size-5" /></span>
      <span>Dapur<span className="text-primary">Cuan</span></span>
    </Link>
  );
}
