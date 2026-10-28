"use client";

import { useState, useEffect, useMemo } from "react";
import type { RecipeWithCost, RecipeIngredient, RecipeCategory, RecipeDifficulty, RecipeStatus } from "@/types/recipe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info,
  ShoppingBag,
  Utensils,
  PlayCircle,
  Check,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { RecipePreviewDialog } from "./recipe-preview-dialog";

interface RecipeEditorDialogProps {
  recipe: RecipeWithCost | null;
  isOpen: boolean;
  onSave: (recipe: RecipeWithCost, status: RecipeStatus) => void;
  onClose: () => void;
}

export function RecipeEditorDialog({
  recipe,
  isOpen,
  onSave,
  onClose,
}: RecipeEditorDialogProps) {
  // Form States
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<RecipeCategory>("makanan");
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>("mudah");
  const [baseServings, setBaseServings] = useState(2);
  const [prepMinutes, setPrepMinutes] = useState(10);
  const [cookMinutes, setCookMinutes] = useState(15);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Dynamic Lists
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [newTool, setNewTool] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [newStep, setNewStep] = useState("");

  // Nutrition State
  const [calories, setCalories] = useState(300);
  const [protein, setProtein] = useState(15);
  const [carbs, setCarbs] = useState(35);
  const [fat, setFat] = useState(10);
  const [fiber, setFiber] = useState(2);
  const [sugar, setSugar] = useState(3);
  const [sodium, setSodium] = useState(400);

  // Video State
  const [videoUrl, setVideoUrl] = useState("");
  const [embedAllowed, setEmbedAllowed] = useState(true);

  // Preview Dialog State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Active Tab: "basic" | "ingredients" | "steps" | "nutrition" | "video"
  const [activeTab, setActiveTab] = useState<"basic" | "ingredients" | "steps" | "nutrition" | "video">("basic");

  // Populate data when dialog opens
  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setSlug(recipe.slug);
      setCategory(recipe.category);
      setDifficulty(recipe.difficulty);
      setBaseServings(recipe.base_servings);
      setPrepMinutes(recipe.prep_minutes);
      setCookMinutes(recipe.cook_minutes);
      setDescription(recipe.description);
      setImageUrl(recipe.image_url);
      setIngredients(recipe.ingredients ? [...recipe.ingredients] : []);
      setTools(recipe.tools ? [...recipe.tools] : []);
      setSteps(recipe.steps ? [...recipe.steps] : []);
      setCalories(recipe.nutrition?.calories_kcal ?? 300);
      setProtein(recipe.nutrition?.protein_g ?? 15);
      setCarbs(recipe.nutrition?.carbs_g ?? 35);
      setFat(recipe.nutrition?.fat_g ?? 10);
      setFiber(recipe.nutrition?.fiber_g ?? 2);
      setSugar(recipe.nutrition?.sugar_g ?? 3);
      setSodium(recipe.nutrition?.sodium_mg ?? 400);
      setVideoUrl(recipe.video?.url ?? "");
      setEmbedAllowed(recipe.video?.embed_allowed ?? true);
    } else {
      // Default new recipe
      setName("");
      setSlug("");
      setCategory("makanan");
      setDifficulty("mudah");
      setBaseServings(2);
      setPrepMinutes(10);
      setCookMinutes(15);
      setDescription("");
      setImageUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640&q=80");
      setIngredients([
        {
          ingredient_id: `ing-${Date.now()}-1`,
          ingredient_name: "Bahan Utama",
          quantity: 200,
          unit: "gram",
          prep_note: "potong rapi",
          package_quantity: 250,
          package_unit: "gram",
          package_price: 15000,
        },
      ]);
      setTools(["Wajan anti-lengket", "Spatula"]);
      setSteps(["Siapkan seluruh bahan dan bumbu dapur.", "Masak hingga matang dan sajikan hangat."]);
      setCalories(280);
      setProtein(14);
      setCarbs(30);
      setFat(10);
      setFiber(2);
      setSugar(3);
      setSodium(350);
      setVideoUrl("");
      setEmbedAllowed(true);
    }
  }, [recipe, isOpen]);

  // Auto generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!recipe) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  // Helper to extract YouTube ID
  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : "";
  };

  // Ingredient Handlers
  const addIngredientRow = () => {
    setIngredients((prev) => [
      ...prev,
      {
        ingredient_id: `ing-${Date.now()}`,
        ingredient_name: "",
        quantity: 1,
        unit: "porsi",
        package_quantity: 1,
        package_unit: "paket",
        package_price: 5000,
      },
    ]);
  };

  const updateIngredient = (index: number, field: keyof RecipeIngredient, value: unknown) => {
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Tools Handlers
  const addTool = () => {
    if (!newTool.trim()) return;
    setTools((prev) => [...prev, newTool.trim()]);
    setNewTool("");
  };

  const removeTool = (index: number) => {
    setTools((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Steps Handlers
  const addStep = () => {
    if (!newStep.trim()) return;
    setSteps((prev) => [...prev, newStep.trim()]);
    setNewStep("");
  };

  const updateStep = (index: number, text: string) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[index] = text;
      return copy;
    });
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Live Cost Calculations
  const calculatedCosts = useMemo(() => {
    let shoppingCost = 0;
    let consumptionCost = 0;

    for (const ing of ingredients) {
      const pkgPrice = ing.package_price || 0;
      const pkgQty = ing.package_quantity || 1;
      const neededQty = ing.quantity || 1;

      // Belanja pasar dibulatkan ke kelipatan paket
      const batches = Math.ceil(neededQty / Math.max(1, pkgQty));
      shoppingCost += pkgPrice * batches;

      // Konsumsi proporsional
      const unitCost = pkgPrice / Math.max(1, pkgQty);
      consumptionCost += Math.round(unitCost * neededQty);
    }

    return {
      shoppingCost: Math.max(5000, shoppingCost),
      consumptionCost: Math.max(2000, consumptionCost),
      costPerServing: Math.round(shoppingCost / Math.max(1, baseServings)),
    };
  }, [ingredients, baseServings]);

  // Realtime Publication Validation Checklist (Syarat Kelengkapan Resep PRD)
  const validationChecklist = useMemo(() => {
    const checks = [
      {
        id: "name",
        label: "Nama resep minimal 3 karakter",
        passed: name.trim().length >= 3,
      },
      {
        id: "category",
        label: "Kategori masakan dipilih",
        passed: Boolean(category),
      },
      {
        id: "description",
        label: "Deskripsi resep minimal 10 karakter",
        passed: description.trim().length >= 10,
      },
      {
        id: "image",
        label: "URL foto masakan valid",
        passed: imageUrl.trim().startsWith("http"),
      },
      {
        id: "servings",
        label: "Porsi acuan minimal 1",
        passed: baseServings >= 1,
      },
      {
        id: "ingredients",
        label: "Minimal 1 bahan dengan harga kemasan pasar > Rp 0",
        passed:
          ingredients.length >= 1 &&
          ingredients.some((i) => i.ingredient_name.trim() && (i.package_price || 0) > 0),
      },
      {
        id: "steps",
        label: "Minimal 1 langkah instruksi memasak",
        passed: steps.length >= 1 && steps.some((s) => s.trim().length > 5),
      },
      {
        id: "nutrition",
        label: "Estimasi kalori & makronutrisi diisi (> 0)",
        passed: calories > 0 && protein >= 0 && carbs >= 0 && fat >= 0,
      },
    ];

    const allPassed = checks.every((c) => c.passed);
    const passedCount = checks.filter((c) => c.passed).length;

    return { checks, allPassed, passedCount, totalCount: checks.length };
  }, [name, category, description, imageUrl, baseServings, ingredients, steps, calories, protein, carbs, fat]);

  // Prepare current recipe object for preview or saving
  const currentRecipeObject: RecipeWithCost = useMemo(() => {
    const videoId = extractVideoId(videoUrl);
    return {
      id: recipe?.id || `recipe-${Date.now()}`,
      slug: slug || "resep-baru",
      name: name || "Resep Baru",
      description: description || "Deskripsi resep belum diisi.",
      category,
      difficulty,
      image_url: imageUrl,
      base_servings: baseServings,
      prep_minutes: prepMinutes,
      cook_minutes: cookMinutes,
      status: recipe?.status || "draft",
      created_at: recipe?.created_at || new Date().toISOString(),
      published_at: recipe?.published_at || (recipe?.status === "published" ? new Date().toISOString() : null),
      total_shopping_cost: calculatedCosts.shoppingCost,
      total_consumption_cost: calculatedCosts.consumptionCost,
      cost_per_serving: calculatedCosts.costPerServing,
      cost_status: "simulasi",
      ingredients,
      tools,
      steps,
      nutrition: {
        calories_kcal: calories,
        protein_g: protein,
        carbs_g: carbs,
        fat_g: fat,
        fiber_g: fiber,
        sugar_g: sugar,
        sodium_mg: sodium,
        source: "Data simulasi input editor",
        is_simulated: true,
      },
      video: videoUrl.trim()
        ? {
            platform: "youtube",
            url: videoUrl.trim(),
            video_id: videoId || "sample_id",
            is_verified: true,
            embed_allowed: embedAllowed,
            title: `Panduan Memasak ${name}`,
          }
        : undefined,
    };
  }, [
    recipe,
    slug,
    name,
    description,
    category,
    difficulty,
    imageUrl,
    baseServings,
    prepMinutes,
    cookMinutes,
    calculatedCosts,
    ingredients,
    tools,
    steps,
    calories,
    protein,
    carbs,
    fat,
    fiber,
    sugar,
    sodium,
    videoUrl,
    embedAllowed,
  ]);

  const handleSave = (targetStatus: RecipeStatus) => {
    if (targetStatus === "published" && !validationChecklist.allPassed) {
      alert("Resep belum memenuhi seluruh syarat publikasi. Harap lengkapi checklist validasi atau simpan sebagai Draft.");
      return;
    }

    const payload: RecipeWithCost = {
      ...currentRecipeObject,
      status: targetStatus,
      published_at: targetStatus === "published" ? new Date().toISOString() : null,
    };

    onSave(payload, targetStatus);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      >
        <div className="relative w-full max-w-4xl max-h-[95vh] flex flex-col rounded-2xl bg-card border shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40 shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {recipe ? "Edit Resep" : "Tambah Resep Baru"}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Status saat ini: <strong className="text-foreground capitalize">{recipe?.status || "Draft"}</strong>
                </span>
              </div>
              <h2 id="editor-title" className="text-xl font-bold truncate text-foreground">
                {name || "Resep Tanpa Nama"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Tutup editor"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto border-b bg-muted/20 px-6 shrink-0 gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "basic"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              1. Informasi Dasar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ingredients")}
              className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "ingredients"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              2. Bahan & Biaya ({ingredients.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("steps")}
              className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "steps"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              3. Alat & Langkah ({steps.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("nutrition")}
              className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "nutrition"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              4. Nutrisi & Gizi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("video")}
              className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "video"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              5. Video Tutorial
            </button>
          </div>

          {/* Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: INFORMASI DASAR */}
            {activeTab === "basic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="recipe-name" className="text-xs font-semibold text-foreground">
                      Nama Resep <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="recipe-name"
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Contoh: Nasi Goreng Spesial Telur"
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="recipe-slug" className="text-xs font-semibold text-foreground">
                      Slug URL (Unik) <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="recipe-slug"
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="nasi-goreng-spesial-telur"
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="recipe-category" className="text-xs font-semibold text-foreground">
                      Kategori <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="recipe-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as RecipeCategory)}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm capitalize focus:border-primary focus:outline-none"
                    >
                      <option value="makanan">Makanan</option>
                      <option value="minuman">Minuman</option>
                      <option value="camilan">Camilan</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="recipe-difficulty" className="text-xs font-semibold text-foreground">
                      Tingkat Kesulitan <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="recipe-difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as RecipeDifficulty)}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm capitalize focus:border-primary focus:outline-none"
                    >
                      <option value="mudah">Mudah</option>
                      <option value="sedang">Sedang</option>
                      <option value="sulit">Sulit</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="recipe-servings" className="text-xs font-semibold text-foreground">
                      Porsi Acuan (Base Servings) <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="recipe-servings"
                      type="number"
                      min={1}
                      max={20}
                      value={baseServings}
                      onChange={(e) => setBaseServings(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="recipe-prep" className="text-xs font-semibold text-foreground">
                      Waktu Persiapan (Menit)
                    </label>
                    <input
                      id="recipe-prep"
                      type="number"
                      min={0}
                      value={prepMinutes}
                      onChange={(e) => setPrepMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="recipe-cook" className="text-xs font-semibold text-foreground">
                      Waktu Memasak (Menit)
                    </label>
                    <input
                      id="recipe-cook"
                      type="number"
                      min={0}
                      value={cookMinutes}
                      onChange={(e) => setCookMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="recipe-desc" className="text-xs font-semibold text-foreground">
                    Deskripsi Ringkas Masakan <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="recipe-desc"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan aroma, cita rasa, dan keunggulan menu hidangan ini..."
                    className="w-full rounded-lg border bg-background p-3 text-sm focus:border-primary focus:outline-none"
                  />
                  <p className="text-[11px] text-muted-foreground">Minimal 10 karakter untuk memenuhi syarat publikasi.</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="recipe-image" className="text-xs font-semibold text-foreground">
                    URL Gambar Masakan <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="recipe-image"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  {imageUrl && (
                    <div className="relative aspect-video max-w-xs rounded-lg overflow-hidden border mt-2">
                      <Image src={imageUrl} alt="Preview gambar" fill className="object-cover" unoptimized />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: BAHAN & ESTIMASI BIAYA */}
            {activeTab === "ingredients" && (
              <div className="space-y-4">
                {/* Cost Live Preview Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border bg-primary/5">
                  <div>
                    <span className="text-[11px] text-muted-foreground font-medium">Total Shopping Cost:</span>
                    <p className="text-lg font-bold text-primary">Rp {calculatedCosts.shoppingCost.toLocaleString("id-ID")}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground font-medium">Consumption Cost:</span>
                    <p className="text-lg font-bold text-foreground">Rp {calculatedCosts.consumptionCost.toLocaleString("id-ID")}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground font-medium">Per Porsi ({baseServings} porsi):</span>
                    <p className="text-lg font-bold text-foreground">Rp {calculatedCosts.costPerServing.toLocaleString("id-ID")}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShoppingBag className="size-4 text-primary" />
                    Daftar Bahan & Paket Pembelian Pasar
                  </h3>
                  <Button type="button" size="sm" variant="outline" onClick={addIngredientRow} className="gap-1.5">
                    <Plus className="size-3.5" />
                    <span>Tambah Baris Bahan</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border bg-muted/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground">Bahan #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeIngredient(idx)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                          aria-label={`Hapus bahan ${ing.ingredient_name || idx + 1}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">Nama Bahan *</label>
                          <input
                            type="text"
                            value={ing.ingredient_name}
                            onChange={(e) => updateIngredient(idx, "ingredient_name", e.target.value)}
                            placeholder="Contoh: Telur Ayam"
                            className="w-full rounded border bg-background px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">Takaran Resep *</label>
                          <div className="flex gap-1.5">
                            <input
                              type="number"
                              min={0.1}
                              step="any"
                              value={ing.quantity}
                              onChange={(e) => updateIngredient(idx, "quantity", parseFloat(e.target.value) || 0)}
                              className="w-20 rounded border bg-background px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
                            />
                            <input
                              type="text"
                              value={ing.unit}
                              onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
                              placeholder="gram / butir"
                              className="flex-1 rounded border bg-background px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">Catatan Persiapan</label>
                          <input
                            type="text"
                            value={ing.prep_note || ""}
                            onChange={(e) => updateIngredient(idx, "prep_note", e.target.value)}
                            placeholder="iris tipis / cincang"
                            className="w-full rounded border bg-background px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-dashed">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">Ukuran Paket Pasar</label>
                          <div className="flex gap-1.5">
                            <input
                              type="number"
                              min={1}
                              value={ing.package_quantity || 1}
                              onChange={(e) => updateIngredient(idx, "package_quantity", parseFloat(e.target.value) || 1)}
                              className="w-20 rounded border bg-background px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
                            />
                            <input
                              type="text"
                              value={ing.package_unit || "bungkus"}
                              onChange={(e) => updateIngredient(idx, "package_unit", e.target.value)}
                              placeholder="gram / pack"
                              className="flex-1 rounded border bg-background px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">Harga Paket Pasar (Rp) *</label>
                          <input
                            type="number"
                            min={0}
                            step={500}
                            value={ing.package_price || 0}
                            onChange={(e) => updateIngredient(idx, "package_price", parseInt(e.target.value) || 0)}
                            placeholder="Contoh: 10000"
                            className="w-full rounded border bg-background px-2.5 py-1.5 text-xs font-semibold focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {ingredients.length === 0 && (
                    <div className="text-center p-8 border border-dashed rounded-xl bg-muted/10 text-xs text-muted-foreground">
                      Belum ada bahan. Klik tombol di atas untuk menambahkan bahan masakan.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: ALAT & LANGKAH MEMASAK */}
            {activeTab === "steps" && (
              <div className="space-y-6">
                {/* Tools Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Utensils className="size-4 text-primary" />
                    Alat Memasak yang Diperlukan
                  </h3>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTool();
                        }
                      }}
                      placeholder="Ketik nama alat lalu tekan Tambah (contoh: Wajan teflon)"
                      className="flex-1 rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                    />
                    <Button type="button" size="sm" onClick={addTool} className="shrink-0 gap-1">
                      <Plus className="size-3.5" /> Tambah
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 text-xs bg-muted px-3 py-1 rounded-full border text-foreground"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTool(idx)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label={`Hapus alat ${t}`}
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                    {tools.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">Belum ada alat memasak yang ditambahkan.</p>
                    )}
                  </div>
                </div>

                {/* Steps Section */}
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="text-sm font-bold text-foreground">Langkah-Langkah Memasak Berurutan</h3>

                  <div className="space-y-3">
                    {steps.map((st, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start p-3 rounded-xl border bg-muted/20">
                        <span className="size-6 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0 text-xs mt-1">
                          {idx + 1}
                        </span>
                        <textarea
                          rows={2}
                          value={st}
                          onChange={(e) => updateStep(idx, e.target.value)}
                          className="flex-1 rounded border bg-background p-2 text-xs leading-relaxed focus:border-primary focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeStep(idx)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded mt-1 transition-colors"
                          aria-label={`Hapus langkah ${idx + 1}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newStep}
                      onChange={(e) => setNewStep(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addStep();
                        }
                      }}
                      placeholder="Ketik instruksi langkah berikutnya lalu klik Tambah Langkah..."
                      className="flex-1 rounded-lg border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                    />
                    <Button type="button" size="sm" variant="outline" onClick={addStep} className="shrink-0 gap-1">
                      <Plus className="size-3.5" /> Tambah Langkah
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: NUTRISI & GIZI */}
            {activeTab === "nutrition" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl border bg-accent/30 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
                  <Info className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    Estimasi nutrisi dihitung <strong>per porsi penyajian standar</strong>. Data ini akan ditampilkan pada publik dengan label <strong>Data Simulasi</strong> sesuai standar PRD.
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Kalori (kkal) *</label>
                    <input
                      type="number"
                      min={0}
                      value={calories}
                      onChange={(e) => setCalories(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Protein (gram) *</label>
                    <input
                      type="number"
                      min={0}
                      value={protein}
                      onChange={(e) => setProtein(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Karbohidrat (g) *</label>
                    <input
                      type="number"
                      min={0}
                      value={carbs}
                      onChange={(e) => setCarbs(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Lemak (gram) *</label>
                    <input
                      type="number"
                      min={0}
                      value={fat}
                      onChange={(e) => setFat(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Serat (gram)</label>
                    <input
                      type="number"
                      min={0}
                      value={fiber}
                      onChange={(e) => setFiber(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Gula (gram)</label>
                    <input
                      type="number"
                      min={0}
                      value={sugar}
                      onChange={(e) => setSugar(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Natrium (mg)</label>
                    <input
                      type="number"
                      min={0}
                      value={sodium}
                      onChange={(e) => setSodium(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: VIDEO TUTORIAL */}
            {activeTab === "video" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl border bg-muted/30 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
                  <PlayCircle className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    Video tutorial opsional. Hanya tautan YouTube asli yang disarankan. Jika kreator membatasi pemutaran di situs lain, matikan opsi <strong>Izinkan Pemutaran Embed</strong> agar sistem otomatis menampilkan tombol alternatif ke YouTube.
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="video-url" className="text-xs font-semibold text-foreground">
                    URL Video YouTube
                  </label>
                  <input
                    id="video-url"
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  {videoUrl && (
                    <p className="text-[11px] text-muted-foreground">
                      ID Video Terdeteksi: <strong>{extractVideoId(videoUrl) || "Format URL belum dikenali"}</strong>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    id="embed-allowed"
                    type="checkbox"
                    checked={embedAllowed}
                    onChange={(e) => setEmbedAllowed(e.target.checked)}
                    className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="embed-allowed" className="text-xs font-medium text-foreground cursor-pointer">
                    Izinkan pemutaran langsung (Embed Iframe) di website DapurCuan
                  </label>
                </div>
              </div>
            )}

            {/* REALTIME PUBLICATION VALIDATION CHECKLIST */}
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">Checklist Validasi Publikasi PRD</span>
                  <Badge variant={validationChecklist.allPassed ? "success" : "warning"} className="text-[11px]">
                    {validationChecklist.passedCount}/{validationChecklist.totalCount} Terpenuhi
                  </Badge>
                </div>
                {validationChecklist.allPassed ? (
                  <span className="text-xs font-semibold text-success flex items-center gap-1">
                    <CheckCircle2 className="size-4" /> Siap Dipublikasikan
                  </span>
                ) : (
                  <span className="text-xs font-medium text-warning flex items-center gap-1">
                    <AlertCircle className="size-4" /> Belum Lengkap untuk Publish
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {validationChecklist.checks.map((c) => (
                  <div
                    key={c.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                      c.passed ? "bg-success/5 border-success/30 text-foreground" : "bg-muted/30 border-border text-muted-foreground"
                    }`}
                  >
                    {c.passed ? (
                      <Check className="size-3.5 text-success shrink-0" />
                    ) : (
                      <span className="size-3.5 rounded-full border border-muted-foreground/40 shrink-0" />
                    )}
                    <span className={c.passed ? "font-medium" : "line-through opacity-70"}>{c.label}</span>
                  </div>
                ))}
              </div>

              {!validationChecklist.allPassed && (
                <p className="text-[11px] text-muted-foreground">
                  *Resep yang belum lengkap tetap dapat disimpan dengan menekan tombol <strong>Simpan sebagai Draft</strong>.
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t bg-muted/40 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="gap-1.5 w-full sm:w-auto"
            >
              <Eye className="size-4" />
              <span>Pratinjau Resep</span>
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Batal
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSave("draft")}
                className="gap-1.5"
              >
                <span>Simpan sebagai Draft</span>
              </Button>

              <Button
                type="button"
                size="sm"
                disabled={!validationChecklist.allPassed}
                onClick={() => handleSave("published")}
                className={`gap-1.5 font-bold ${
                  validationChecklist.allPassed
                    ? "bg-success text-success-foreground hover:bg-success/90"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <Sparkles className="size-4" />
                <span>Publikasikan</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Preview Modal */}
      <RecipePreviewDialog
        recipe={currentRecipeObject}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
