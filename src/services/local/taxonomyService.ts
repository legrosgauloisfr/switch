import { useCatalogStore } from "@/store/useCatalogStore";
import type { TaxonomyService } from "@/services/types";
import type { Brand, Category, Flavor } from "@/types";

export class LocalTaxonomyService implements TaxonomyService {
  async brands() {
    return useCatalogStore.getState().brands;
  }
  async saveBrand(b: Brand) {
    useCatalogStore.getState().upsertBrand(b);
    return b;
  }
  async removeBrand(id: string) {
    useCatalogStore.getState().deleteBrand(id);
  }

  async categories() {
    return useCatalogStore.getState().categories;
  }
  async saveCategory(c: Category) {
    useCatalogStore.getState().upsertCategory(c);
    return c;
  }
  async removeCategory(id: string) {
    useCatalogStore.getState().deleteCategory(id);
  }

  async flavors() {
    return useCatalogStore.getState().flavors;
  }
  async saveFlavor(f: Flavor) {
    useCatalogStore.getState().upsertFlavor(f);
    return f;
  }
  async removeFlavor(id: string) {
    useCatalogStore.getState().deleteFlavor(id);
  }
}
