import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS } from "@/data/seed/products";
import { LIQUIDS } from "@/data/seed/liquids";
import { TUTORIALS } from "@/data/seed/tutorials";
import { BRANDS } from "@/data/seed/brands";
import { CATEGORIES } from "@/data/seed/categories";
import { FLAVORS } from "@/data/seed/flavors";
import { FAQ } from "@/data/seed/faq";
import { ADVICE, NOTIFICATIONS } from "@/data/seed/advice";
import { CARTRIDGES, RESISTANCES } from "@/data/seed/cartridges";
import { ACCESSORIES } from "@/data/seed/accessories";
import { ARTICLES } from "@/data/seed/articles";
import type {
  Accessory,
  AdviceItem,
  Article,
  Brand,
  Cartridge,
  Category,
  FaqItem,
  Flavor,
  Liquid,
  NotificationItem,
  Product,
  Resistance,
  Tutorial,
} from "@/types";

// The writable content layer behind the admin back-office. Today it persists to
// localStorage; a Supabase-backed catalog would expose the exact same shape (and the
// same store surface — see services/local/*), so nothing above this file has to change
// when that swap happens.

export const genId = (prefix: string) =>
  `${prefix}-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random().toString(36).slice(2)}`;

interface CatalogState {
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  products: Product[];
  liquids: Liquid[];
  tutorials: Tutorial[];
  brands: Brand[];
  categories: Category[];
  flavors: Flavor[];
  faq: FaqItem[];
  advice: AdviceItem[];
  cartridges: Cartridge[];
  resistances: Resistance[];
  accessories: Accessory[];
  articles: Article[];
  notifications: NotificationItem[];

  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => Product | undefined;

  upsertLiquid: (l: Liquid) => void;
  deleteLiquid: (id: string) => void;
  duplicateLiquid: (id: string) => Liquid | undefined;

  upsertTutorial: (t: Tutorial) => void;
  deleteTutorial: (id: string) => void;
  duplicateTutorial: (id: string) => Tutorial | undefined;

  upsertBrand: (b: Brand) => void;
  deleteBrand: (id: string) => void;

  upsertCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;

  upsertFlavor: (f: Flavor) => void;
  deleteFlavor: (id: string) => void;

  upsertFaq: (f: FaqItem) => void;
  deleteFaq: (id: string) => void;
  reorderFaq: (id: string, dir: -1 | 1) => void;

  upsertAdvice: (a: AdviceItem) => void;
  deleteAdvice: (id: string) => void;
  reorderAdvice: (id: string, dir: -1 | 1) => void;

  upsertCartridge: (c: Cartridge) => void;
  deleteCartridge: (id: string) => void;

  upsertResistance: (r: Resistance) => void;
  deleteResistance: (id: string) => void;

  upsertAccessory: (a: Accessory) => void;
  deleteAccessory: (id: string) => void;
  duplicateAccessory: (id: string) => Accessory | undefined;

  upsertArticle: (a: Article) => void;
  deleteArticle: (id: string) => void;
  reorderArticle: (id: string, dir: -1 | 1) => void;

  upsertNotification: (n: NotificationItem) => void;
  deleteNotification: (id: string) => void;

  resetToDefaults: () => void;
}

function upsertBy<T extends { id: string }>(list: T[], item: T): T[] {
  const i = list.findIndex((x) => x.id === item.id);
  if (i === -1) return [item, ...list];
  const next = list.slice();
  next[i] = item;
  return next;
}

function reorderBySort<T extends { id: string; sortOrder: number }>(
  list: T[],
  id: string,
  dir: -1 | 1
): T[] {
  const sorted = [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  const i = sorted.findIndex((x) => x.id === id);
  const j = i + dir;
  if (i === -1 || j < 0 || j >= sorted.length) return list;
  [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
  return sorted.map((item, idx) => ({ ...item, sortOrder: idx }));
}

const DEFAULTS = {
  products: PRODUCTS,
  liquids: LIQUIDS,
  tutorials: TUTORIALS,
  brands: BRANDS,
  categories: CATEGORIES,
  flavors: FLAVORS,
  faq: FAQ,
  advice: ADVICE,
  cartridges: CARTRIDGES,
  resistances: RESISTANCES,
  accessories: ACCESSORIES,
  articles: ARTICLES,
  notifications: NOTIFICATIONS,
};

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      ...DEFAULTS,

      upsertProduct: (p) => set((s) => ({ products: upsertBy(s.products, p) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      duplicateProduct: (id) => {
        const source = get().products.find((p) => p.id === id);
        if (!source) return undefined;
        const copy: Product = { ...source, id: genId("product"), name: `${source.name} (copie)`, active: false };
        set((s) => ({ products: [copy, ...s.products] }));
        return copy;
      },

      upsertLiquid: (l) => set((s) => ({ liquids: upsertBy(s.liquids, l) })),
      deleteLiquid: (id) => set((s) => ({ liquids: s.liquids.filter((l) => l.id !== id) })),
      duplicateLiquid: (id) => {
        const source = get().liquids.find((l) => l.id === id);
        if (!source) return undefined;
        const copy: Liquid = { ...source, id: genId("liquid"), name: `${source.name} (copie)`, active: false };
        set((s) => ({ liquids: [copy, ...s.liquids] }));
        return copy;
      },

      upsertTutorial: (t) => set((s) => ({ tutorials: upsertBy(s.tutorials, t) })),
      deleteTutorial: (id) => set((s) => ({ tutorials: s.tutorials.filter((t) => t.id !== id) })),
      duplicateTutorial: (id) => {
        const source = get().tutorials.find((t) => t.id === id);
        if (!source) return undefined;
        const copy: Tutorial = { ...source, id: genId("tutorial"), title: `${source.title} (copie)`, published: false };
        set((s) => ({ tutorials: [copy, ...s.tutorials] }));
        return copy;
      },

      upsertBrand: (b) => set((s) => ({ brands: upsertBy(s.brands, b) })),
      deleteBrand: (id) => set((s) => ({ brands: s.brands.filter((b) => b.id !== id) })),

      upsertCategory: (c) => set((s) => ({ categories: upsertBy(s.categories, c) })),
      deleteCategory: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      upsertFlavor: (f) => set((s) => ({ flavors: upsertBy(s.flavors, f) })),
      deleteFlavor: (id) => set((s) => ({ flavors: s.flavors.filter((f) => f.id !== id) })),

      upsertFaq: (f) => set((s) => ({ faq: upsertBy(s.faq, f) })),
      deleteFaq: (id) => set((s) => ({ faq: s.faq.filter((f) => f.id !== id) })),
      reorderFaq: (id, dir) => set((s) => ({ faq: reorderBySort(s.faq, id, dir) })),

      upsertAdvice: (a) => set((s) => ({ advice: upsertBy(s.advice, a) })),
      deleteAdvice: (id) => set((s) => ({ advice: s.advice.filter((a) => a.id !== id) })),
      reorderAdvice: (id, dir) => set((s) => ({ advice: reorderBySort(s.advice, id, dir) })),

      upsertCartridge: (c) => set((s) => ({ cartridges: upsertBy(s.cartridges, c) })),
      deleteCartridge: (id) => set((s) => ({ cartridges: s.cartridges.filter((c) => c.id !== id) })),

      upsertResistance: (r) => set((s) => ({ resistances: upsertBy(s.resistances, r) })),
      deleteResistance: (id) => set((s) => ({ resistances: s.resistances.filter((r) => r.id !== id) })),

      upsertAccessory: (a) => set((s) => ({ accessories: upsertBy(s.accessories, a) })),
      deleteAccessory: (id) => set((s) => ({ accessories: s.accessories.filter((a) => a.id !== id) })),
      duplicateAccessory: (id) => {
        const source = get().accessories.find((a) => a.id === id);
        if (!source) return undefined;
        const copy: Accessory = { ...source, id: genId("accessory"), name: `${source.name} (copie)`, active: false };
        set((s) => ({ accessories: [copy, ...s.accessories] }));
        return copy;
      },

      upsertArticle: (a) => set((s) => ({ articles: upsertBy(s.articles, a) })),
      deleteArticle: (id) => set((s) => ({ articles: s.articles.filter((a) => a.id !== id) })),
      reorderArticle: (id, dir) => set((s) => ({ articles: reorderBySort(s.articles, id, dir) })),

      upsertNotification: (n) => set((s) => ({ notifications: upsertBy(s.notifications, n) })),
      deleteNotification: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

      resetToDefaults: () => set({ ...DEFAULTS }),
    }),
    {
      name: "switch-catalog-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (s) => ({
        products: s.products,
        liquids: s.liquids,
        tutorials: s.tutorials,
        brands: s.brands,
        categories: s.categories,
        flavors: s.flavors,
        faq: s.faq,
        advice: s.advice,
        cartridges: s.cartridges,
        resistances: s.resistances,
        accessories: s.accessories,
        articles: s.articles,
        notifications: s.notifications,
      }),
    }
  )
);
