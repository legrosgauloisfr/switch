import { buildRecommendation } from "@/lib/recommendation";
import { SupabaseProductService, SupabaseLiquidService } from "@/services/supabase/productService";
import type { RecommendationService } from "@/services/types";
import type { OnboardingAnswers } from "@/types";

const products = new SupabaseProductService();
const liquids = new SupabaseLiquidService();

export class SupabaseRecommendationService implements RecommendationService {
  async build(answers: OnboardingAnswers) {
    const [productList, liquidList] = await Promise.all([products.list(), liquids.list()]);
    return buildRecommendation(productList, liquidList, answers);
  }
}
