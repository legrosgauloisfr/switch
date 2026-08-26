import { isSupabaseConfigured } from "@/lib/supabase/config";

import { LocalContentService } from "@/services/local/contentService";
import { LocalJournalService } from "@/services/local/journalService";
import { LocalProductService, LocalLiquidService } from "@/services/local/productService";
import { LocalRecommendationService } from "@/services/local/recommendationService";
import { LocalTutorialService } from "@/services/local/tutorialService";
import { LocalTaxonomyService } from "@/services/local/taxonomyService";
import { LocalAccessoryService, LocalArticleService, LocalPartsService } from "@/services/local/partsService";

import { SupabaseContentService } from "@/services/supabase/contentService";
import { SupabaseProductService, SupabaseLiquidService } from "@/services/supabase/productService";
import { SupabaseRecommendationService } from "@/services/supabase/recommendationService";
import { SupabaseTutorialService } from "@/services/supabase/tutorialService";
import { SupabaseTaxonomyService } from "@/services/supabase/taxonomyService";
import { SupabaseAccessoryService, SupabaseArticleService, SupabasePartsService } from "@/services/supabase/partsService";

// The catalog/content layer swaps to the real Supabase tables the moment a project is
// configured (see lib/supabase/config.ts) — local-only (localStorage) stays as the fallback
// for running the app with zero setup. journalService stays local-only either way: it's
// per-visitor personal data, not admin-managed catalog content, and the mobile app doesn't
// have its own Supabase auth yet (only the admin back-office does).
const useSupabase = isSupabaseConfigured();

export const productService = useSupabase ? new SupabaseProductService() : new LocalProductService();
export const liquidService = useSupabase ? new SupabaseLiquidService() : new LocalLiquidService();
export const tutorialService = useSupabase ? new SupabaseTutorialService() : new LocalTutorialService();
export const contentService = useSupabase ? new SupabaseContentService() : new LocalContentService();
export const recommendationService = useSupabase ? new SupabaseRecommendationService() : new LocalRecommendationService();
export const taxonomyService = useSupabase ? new SupabaseTaxonomyService() : new LocalTaxonomyService();
export const partsService = useSupabase ? new SupabasePartsService() : new LocalPartsService();
export const accessoryService = useSupabase ? new SupabaseAccessoryService() : new LocalAccessoryService();
export const articleService = useSupabase ? new SupabaseArticleService() : new LocalArticleService();

export const journalService = new LocalJournalService();
