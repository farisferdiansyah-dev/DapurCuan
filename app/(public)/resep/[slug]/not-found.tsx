import Link from "next/link";
import { ChefHat, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecipeNotFound() {
  return (
    <div className="container mx-auto py-20 px-4 max-w-2xl text-center space-y-6">
      <div className="inline-flex items-center justify-center size-20 rounded-full bg-secondary/80 text-primary mx-auto">
        <ChefHat className="size-10" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Resep Tidak Ditemukan
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
          Maaf, resep masakan yang kamu cari belum tersedia atau mungkin sudah dipindahkan ke kategori lain.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Button variant="default" asChild className="w-full sm:w-auto">
          <Link href="/rekomendasi">
            <Search className="mr-2 size-4" />
            Cari Rekomendasi Resep
          </Link>
        </Button>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/">
            <Home className="mr-2 size-4" />
            Kembali ke Beranda
          </Link>
        </Button>
      </div>
    </div>
  );
}
