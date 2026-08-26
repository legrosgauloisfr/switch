import type {
  Accessory,
  AdviceItem,
  Article,
  Brand,
  Cartridge,
  Category,
  FaqItem,
  Flavor,
  JournalEntry,
  Liquid,
  NotificationItem,
  OnboardingAnswers,
  Product,
  RecommendationResult,
  Resistance,
  Tutorial,
} from "@/types";

// Every screen — mobile app AND admin — talks to these interfaces, never to the catalog
// store or a table directly. Swapping the `local` implementations in services/index.ts for
// `supabase` ones (services/supabase/*, to be added when the project is provisioned)
// requires zero changes to screen code.

export interface ProductService {
  list(): Promise<Product[]>;
  listAll(): Promise<Product[]>; // includes inactive — admin only
  get(id: string): Promise<Product | undefined>;
  save(product: Product): Promise<Product>;
  remove(id: string): Promise<void>;
  duplicate(id: string): Promise<Product | undefined>;
}

export interface LiquidService {
  list(): Promise<Liquid[]>;
  listAll(): Promise<Liquid[]>;
  get(id: string): Promise<Liquid | undefined>;
  save(liquid: Liquid): Promise<Liquid>;
  remove(id: string): Promise<void>;
  duplicate(id: string): Promise<Liquid | undefined>;
}

export interface TutorialService {
  list(): Promise<Tutorial[]>;
  listAll(): Promise<Tutorial[]>;
  get(id: string): Promise<Tutorial | undefined>;
  save(tutorial: Tutorial): Promise<Tutorial>;
  remove(id: string): Promise<void>;
  duplicate(id: string): Promise<Tutorial | undefined>;
}

export interface ContentService {
  faq(): Promise<FaqItem[]>;
  faqAll(): Promise<FaqItem[]>;
  saveFaq(item: FaqItem): Promise<FaqItem>;
  removeFaq(id: string): Promise<void>;
  reorderFaq(id: string, dir: -1 | 1): Promise<void>;

  advice(): Promise<AdviceItem[]>;
  adviceAll(): Promise<AdviceItem[]>;
  saveAdvice(item: AdviceItem): Promise<AdviceItem>;
  removeAdvice(id: string): Promise<void>;
  reorderAdvice(id: string, dir: -1 | 1): Promise<void>;

  notifications(): Promise<NotificationItem[]>;
  notificationsAll(): Promise<NotificationItem[]>;
  saveNotification(n: NotificationItem): Promise<NotificationItem>;
  removeNotification(id: string): Promise<void>;
}

export interface TaxonomyService {
  brands(): Promise<Brand[]>;
  saveBrand(b: Brand): Promise<Brand>;
  removeBrand(id: string): Promise<void>;

  categories(): Promise<Category[]>;
  saveCategory(c: Category): Promise<Category>;
  removeCategory(id: string): Promise<void>;

  flavors(): Promise<Flavor[]>;
  saveFlavor(f: Flavor): Promise<Flavor>;
  removeFlavor(id: string): Promise<void>;
}

export interface PartsService {
  cartridgesFor(deviceId: string): Promise<Cartridge[]>;
  saveCartridge(c: Cartridge): Promise<Cartridge>;
  removeCartridge(id: string): Promise<void>;

  resistancesFor(deviceId: string): Promise<Resistance[]>;
  saveResistance(r: Resistance): Promise<Resistance>;
  removeResistance(id: string): Promise<void>;
}

export interface AccessoryService {
  list(): Promise<Accessory[]>;
  listAll(): Promise<Accessory[]>;
  save(a: Accessory): Promise<Accessory>;
  remove(id: string): Promise<void>;
  duplicate(id: string): Promise<Accessory | undefined>;
}

export interface ArticleService {
  list(): Promise<Article[]>;
  listAll(): Promise<Article[]>;
  get(id: string): Promise<Article | undefined>;
  save(a: Article): Promise<Article>;
  remove(id: string): Promise<void>;
  reorder(id: string, dir: -1 | 1): Promise<void>;
}

export interface RecommendationService {
  build(answers: OnboardingAnswers): Promise<RecommendationResult>;
}

export interface JournalService {
  list(): Promise<JournalEntry[]>;
  add(label: string): Promise<JournalEntry>;
  remove(id: string): Promise<void>;
}
