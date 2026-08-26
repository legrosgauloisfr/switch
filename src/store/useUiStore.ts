import { create } from "zustand";
import type { Product } from "@/types";

// Ephemeral, non-persisted UI state — the shop-redirect bottom sheet (brief screen "shop")
// can be triggered from product detail or compare, so it lives above both as a global overlay.
interface UiState {
  shopProduct: Product | null;
  openShop: (product: Product) => void;
  closeShop: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  shopProduct: null,
  openShop: (product) => set({ shopProduct: product }),
  closeShop: () => set({ shopProduct: null }),
}));
