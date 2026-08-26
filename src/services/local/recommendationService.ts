import { useCatalogStore } from "@/store/useCatalogStore";
import { buildRecommendation } from "@/lib/recommendation";
import type { RecommendationService } from "@/services/types";
import type { OnboardingAnswers } from "@/types";

export class LocalRecommendationService implements RecommendationService {
  async build(answers: OnboardingAnswers) {
    const { products, liquids } = useCatalogStore.getState();
    return buildRecommendation(products, liquids, answers);
  }
}
