import type { RecipeWithCost } from "@/types/recipe";
import { Clock, Users, ChefHat, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface RecipeCardProps {
  recipe: RecipeWithCost;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalMinutes = recipe.prep_minutes + recipe.cook_minutes;

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg" aria-label={`${recipe.name}, budget Rp ${recipe.total_shopping_cost.toLocaleString("id-ID")}, ${recipe.difficulty}`}>
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={recipe.image_url}
          alt={recipe.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={recipe.difficulty === "mudah" ? "success" : recipe.difficulty === "sedang" ? "warning" : "destructive"}>
            {recipe.difficulty}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-semibold leading-tight line-clamp-2">{recipe.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-4" aria-hidden="true" />
            <span>{totalMinutes} menit</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="size-4" aria-hidden="true" />
            <span>{recipe.scaled_servings ? `${recipe.scaled_servings} porsi` : `${recipe.base_servings} porsi`}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <ChefHat className="size-4" aria-hidden="true" />
            <span>{recipe.category}</span>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-lg font-bold text-primary">
            Rp {recipe.total_shopping_cost.toLocaleString("id-ID")}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-xs text-muted-foreground">estimasi biaya belanja</p>
            <span className="text-[10px] uppercase font-semibold tracking-wider bg-secondary/80 text-secondary-foreground px-1.5 py-0.5 rounded">
              Data Simulasi
            </span>
          </div>

          <div className="mt-3 rounded-lg bg-accent p-3">
            <div className="flex items-start gap-2">
              <Info className="size-4 shrink-0 mt-0.5 text-foreground/60" aria-hidden="true" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium">Estimasi nutrisi per porsi (data simulasi):</p>
                <p>
                  {recipe.nutrition.calories_kcal} kkal, {recipe.nutrition.protein_g}g protein, {recipe.nutrition.carbs_g}g karbohidrat
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <a href={`/resep/${recipe.slug}`}>Lihat Detail</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
