// Types for External Recipe & Ingredient Import Pipeline (FE-012)

export type ImportStatus =
  | "pending"
  | "processing"
  | "needs_review"
  | "approved"
  | "rejected"
  | "failed";

export type ImportType = "recipe" | "ingredient";

export type LicenseType =
  | "CC-BY-4.0"
  | "CC0-PublicDomain"
  | "ODC-By"
  | "Proprietary-Restricted"
  | "Unknown-Unverified";

export interface ImportSource {
  id: string;
  name: string;
  base_url: string;
  default_license: LicenseType;
  is_verified_license: boolean;
  attribution_required: boolean;
  terms_note: string;
}

export type DuplicateMatchType =
  | "exact_id"
  | "exact_slug"
  | "similar_name"
  | "ingredient_fingerprint"
  | "none";

export interface DuplicateCandidate {
  is_duplicate: boolean;
  similarity_score: number; // 0 to 100
  match_type: DuplicateMatchType;
  existing_id?: string;
  existing_name?: string;
  reason: string;
}

export interface CandidateRecipeData {
  name: string;
  slug: string;
  category: string;
  description: string;
  base_servings: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  difficulty: "mudah" | "sedang" | "sulit";
  image_url: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    estimated_cost_idr?: number;
  }>;
  tools: string[];
  steps: Array<{
    step_number: number;
    instruction: string;
  }>;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  video_url?: string;
}

export interface CandidateIngredientData {
  name: string;
  canonical_unit: string;
  category: string;
  package_quantity: number;
  package_unit: string;
  package_price_idr: number;
  region_code: string;
  source: string;
}

export interface ValidationIssue {
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface ImportCandidate {
  id: string;
  batch_id: string;
  type: ImportType;
  source_id: string;
  source_name: string;
  source_url: string;
  external_id: string;
  license: LicenseType;
  license_notes: string;
  is_license_compliant: boolean; // False if proprietary or missing permission
  title: string;
  status: ImportStatus;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  reviewer_notes?: string;
  rejection_reason?: string;
  duplicate_check: DuplicateCandidate;
  validation_issues: ValidationIssue[];
  can_approve: boolean;
  recipe_data?: CandidateRecipeData;
  ingredient_data?: CandidateIngredientData;
}
