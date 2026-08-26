import type {
  BudgetTier,
  FormatTag,
  Liquid,
  NicotineRecommendation,
  OnboardingAnswers,
  Product,
  RecommendationResult,
  ScoredProduct,
} from "@/types";

// Recommendation engine. Scores every ACTIVE product against the user's actual answers —
// never a sponsor placement or a fixed order (brief §15-17). The "why" explanation is
// generated from which criteria actually matched (§16), not a canned sentence per product.

const FORMAT_BY_LABEL: Record<string, FormatTag> = {
  Compact: "compact",
  Classique: "standard",
  "Plus autonome": "autonomous",
};

const BUDGET_ORDER: BudgetTier[] = ["low", "mid", "mid-high", "high"];
const BUDGET_BY_LABEL: Record<string, BudgetTier> = {
  "Moins de 30 €": "low",
  "30–50 €": "mid",
  "50–80 €": "mid-high",
  "80 € et plus": "high",
};

function scoreProduct(product: Product, answers: OnboardingAnswers) {
  let score = 0;
  const matched: string[] = [];

  const formatTag = answers.format ? FORMAT_BY_LABEL[answers.format] : undefined;
  if (formatTag && product.formatTag === formatTag) {
    score += 3;
    matched.push("format");
  }

  const simplicityLabel = answers.simplicity;
  if (simplicityLabel === "Simple") {
    score += product.simplicity;
    if (product.simplicityTag === "simple") {
      score += 2;
      matched.push("simplicité");
    }
  } else if (simplicityLabel === "Personnalisable") {
    score += 5 - product.simplicity;
    if (product.simplicityTag === "customizable") {
      score += 2;
      matched.push("réglages");
    }
  } else {
    score += 1;
  }

  const budgetTier = answers.budget ? BUDGET_BY_LABEL[answers.budget] : undefined;
  if (budgetTier) {
    const distance = Math.abs(
      BUDGET_ORDER.indexOf(product.budgetTier) - BUDGET_ORDER.indexOf(budgetTier)
    );
    const budgetScore = Math.max(0, 3 - distance);
    score += budgetScore;
    if (distance === 0) matched.push("budget");
  }

  return { score, matched };
}

function whyFromMatches(matched: string[], answers: OnboardingAnswers): string {
  const bits: string[] = [];
  if (matched.includes("format") && answers.format) {
    bits.push(`un format ${answers.format.toLowerCase()}`);
  }
  if (matched.includes("simplicité")) {
    bits.push("quelque chose de simple à utiliser");
  }
  if (matched.includes("réglages")) {
    bits.push("un appareil que vous pouvez régler davantage");
  }
  if (matched.includes("budget") && answers.budget) {
    bits.push(`un budget autour de ${answers.budget}`);
  }
  if (!bits.length) {
    return "Cette option reste équilibrée sur l'ensemble de vos critères.";
  }
  const joined =
    bits.length === 1
      ? bits[0]
      : bits.slice(0, -1).join(", ") + " et " + bits[bits.length - 1];
  return `Vous avez indiqué rechercher ${joined}. Cette option correspond à ces préférences.`;
}

export function scoreProducts(
  products: Product[],
  answers: OnboardingAnswers
): ScoredProduct[] {
  const active = products.filter((p) => p.active);
  const scored = active
    .map((product) => {
      const { score, matched } = scoreProduct(product, answers);
      return { product, score, matched };
    })
    .sort((a, b) => b.score - a.score || a.product.priceEur - b.product.priceEur);

  const cheapestId = [...active].sort((a, b) => a.priceEur - b.priceEur)[0]?.id;

  return scored.map((entry, index) => {
    let badge = "AUTRE OPTION";
    if (index === 0) badge = "LE PLUS ADAPTÉ";
    else if (index === 1) badge = "ALTERNATIVE";
    else if (entry.product.id === cheapestId) badge = "OPTION BUDGET";

    return {
      product: entry.product,
      score: entry.score,
      rank: index,
      badge,
      why: whyFromMatches(entry.matched, answers),
    };
  });
}

const NICOTINE_BANDS = [
  { max: 9, doseMg: 6, type: "nicotine classique", label: "Léger" },
  { max: 19, doseMg: 10, type: "sels de nicotine", label: "Modéré" },
  { max: 29, doseMg: 16, type: "sels de nicotine", label: "Soutenu" },
  { max: 99, doseMg: 20, type: "sels de nicotine", label: "Élevé" },
] as const;

export function recommendNicotine(cigsPerDay: number): NicotineRecommendation {
  const index = NICOTINE_BANDS.findIndex((b) => cigsPerDay <= b.max);
  const band = NICOTINE_BANDS[index === -1 ? NICOTINE_BANDS.length - 1 : index];

  const why =
    band.label === "Léger"
      ? "Vous fumez peu : un taux bas limite le risque de sensation trop forte en gorge."
      : band.label === "Modéré"
      ? `Autour de ${cigsPerDay} cigarettes par jour, les sels de nicotine à ${band.doseMg} mg/ml passent en douceur tout en couvrant l'envie.`
      : band.label === "Soutenu"
      ? "Votre consommation est élevée : un taux plus soutenu évite de multiplier les bouffées au démarrage."
      : "Au-delà de 30 cigarettes par jour, démarrer haut puis redescendre progressivement est le schéma le plus courant.";

  return {
    doseMg: band.doseMg,
    type: band.type,
    label: band.label,
    why,
    bands: NICOTINE_BANDS.map((b) => ({ label: b.label, active: b.label === band.label })),
  };
}

export function pickLiquids(liquids: Liquid[], answers: OnboardingAnswers) {
  const active = liquids.filter((l) => l.active);
  const wanted = answers.flavors.length ? answers.flavors : ["Fruits rouges", "Frais", "Classique"];
  const picked = wanted
    .map((tag) => active.find((l) => l.flavorTag === tag))
    .filter((l): l is Liquid => !!l)
    .slice(0, 3);
  const list = picked.length ? picked : active.slice(0, 2);

  const dose = recommendNicotine(answers.cigsPerDay).doseMg;
  return list.map((l) => ({ ...l, specHint: `${dose} mg/ml · 10 ml · ≈ 6 €` }));
}

export function buildRecommendation(
  products: Product[],
  liquids: Liquid[],
  answers: OnboardingAnswers
): RecommendationResult {
  return {
    products: scoreProducts(products, answers),
    nicotine: recommendNicotine(answers.cigsPerDay),
    liquids: pickLiquids(liquids, answers),
  };
}
