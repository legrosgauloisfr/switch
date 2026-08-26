// Domain types. These mirror the Supabase schema 1:1 (see supabase/migrations/0001_init.sql)
// so the `local` service implementations can be swapped for `supabase` ones without any
// change to screen components.

export type QuestionType = "list" | "slider" | "chips" | "cards";

export interface QuestionOption {
  label: string;
  desc?: string;
  /** relative bar size hints used by the "cards" question type illustration */
  gaugeWidth?: string;
  gaugeHeight?: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  title: string;
  help?: string;
  multi?: boolean;
  options?: QuestionOption[];
}

export interface OnboardingAnswers {
  goal?: string;
  cigsPerDay: number;
  moments: string[];
  exp?: string;
  format?: string;
  simplicity?: string;
  budget?: string;
  flavors: string[];
}

export type FormatTag = "compact" | "standard" | "autonomous";
export type SimplicityTag = "simple" | "customizable" | "unsure";
export type BudgetTier = "low" | "mid" | "mid-high" | "high";

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  active: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  active: boolean;
}

export interface Flavor {
  id: string;
  name: string;
  active: boolean;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brandId?: string;
  kind: string;
  priceEur: number;
  runningCostLabel: string;
  simplicity: number; // 1-5
  autonomy: number; // 1-5
  formatTag: FormatTag;
  simplicityTag: SimplicityTag;
  budgetTier: BudgetTier;
  descriptionShort?: string;
  descriptionLong?: string;
  specs: ProductSpec[];
  images: string[];
  active: boolean;
}

export interface Liquid {
  id: string;
  name: string;
  brandId?: string;
  flavorTag: string; // matches a Flavor name (and an option label from the "flavors" quiz question)
  universe: string; // display group (Fruité, Frais, Gourmand, Classique, Boisson)
  description: string;
  specHint: string; // e.g. "10 ml · ≈ 6 €"
  images: string[];
  active: boolean;
}

export interface TutorialStep {
  n: number;
  text: string;
}

export interface Tutorial {
  id: string;
  title: string;
  category: string; // eyebrow label, e.g. "PRISE EN MAIN"
  durationMin: number;
  intro: string;
  steps: TutorialStep[];
  image?: string;
  gridSummary: string;
  published: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  published: boolean;
  sortOrder: number;
}

export interface AdviceItem {
  id: string;
  tag: string;
  text: string;
  published: boolean;
  sortOrder: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  text: string;
  when: string;
  unread: boolean;
  published: boolean;
  createdAt: number;
}

export interface Cartridge {
  id: string;
  deviceId: string; // Product.id this cartridge fits
  name: string;
  description?: string;
  active: boolean;
}

export interface Resistance {
  id: string;
  deviceId: string; // Product.id this resistance fits
  name: string;
  ohm?: number;
  description?: string;
  active: boolean;
}

export interface Accessory {
  id: string;
  brandId?: string;
  categoryId?: string;
  name: string;
  description?: string;
  priceEur?: number;
  active: boolean;
}

export interface Article {
  id: string;
  title: string;
  category: string; // e.g. "Guide", "Conseil pratique", "Réglementation"
  excerpt: string;
  body: string; // long-form text, paragraphs separated by blank lines
  image?: string;
  published: boolean;
  sortOrder: number;
}

export interface JournalEntry {
  id: string;
  label: string;
  whenLabel: string;
  createdAt: number;
}

export interface UserProfile {
  name: string;
  memberSinceDays: number;
}

export type CravingTrigger =
  | "Stress"
  | "Café"
  | "Repas"
  | "Ennui"
  | "Social"
  | "Autre";

export interface ScoredProduct {
  product: Product;
  score: number;
  rank: number;
  badge: string;
  why: string;
}

export interface NicotineRecommendation {
  doseMg: number;
  type: string;
  label: string;
  why: string;
  bands: { label: string; active: boolean }[];
}

export interface RecommendationResult {
  products: ScoredProduct[];
  nicotine: NicotineRecommendation;
  liquids: (Liquid & { specHint: string })[];
}
