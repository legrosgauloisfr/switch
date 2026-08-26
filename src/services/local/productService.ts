import { useCatalogStore } from "@/store/useCatalogStore";
import type { LiquidService, ProductService } from "@/services/types";
import type { Liquid, Product } from "@/types";

export class LocalProductService implements ProductService {
  async list() {
    return useCatalogStore.getState().products.filter((p) => p.active);
  }
  async listAll() {
    return useCatalogStore.getState().products;
  }
  async get(id: string) {
    return useCatalogStore.getState().products.find((p) => p.id === id);
  }
  async save(product: Product) {
    useCatalogStore.getState().upsertProduct(product);
    return product;
  }
  async remove(id: string) {
    useCatalogStore.getState().deleteProduct(id);
  }
  async duplicate(id: string) {
    return useCatalogStore.getState().duplicateProduct(id);
  }
}

export class LocalLiquidService implements LiquidService {
  async list() {
    return useCatalogStore.getState().liquids.filter((l) => l.active);
  }
  async listAll() {
    return useCatalogStore.getState().liquids;
  }
  async get(id: string) {
    return useCatalogStore.getState().liquids.find((l) => l.id === id);
  }
  async save(liquid: Liquid) {
    useCatalogStore.getState().upsertLiquid(liquid);
    return liquid;
  }
  async remove(id: string) {
    useCatalogStore.getState().deleteLiquid(id);
  }
  async duplicate(id: string) {
    return useCatalogStore.getState().duplicateLiquid(id);
  }
}
