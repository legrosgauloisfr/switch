import { useCatalogStore } from "@/store/useCatalogStore";
import type { AccessoryService, ArticleService, PartsService } from "@/services/types";
import type { Accessory, Article, Cartridge, Resistance } from "@/types";

export class LocalPartsService implements PartsService {
  async cartridgesFor(deviceId: string) {
    return useCatalogStore.getState().cartridges.filter((c) => c.deviceId === deviceId);
  }
  async saveCartridge(c: Cartridge) {
    useCatalogStore.getState().upsertCartridge(c);
    return c;
  }
  async removeCartridge(id: string) {
    useCatalogStore.getState().deleteCartridge(id);
  }

  async resistancesFor(deviceId: string) {
    return useCatalogStore.getState().resistances.filter((r) => r.deviceId === deviceId);
  }
  async saveResistance(r: Resistance) {
    useCatalogStore.getState().upsertResistance(r);
    return r;
  }
  async removeResistance(id: string) {
    useCatalogStore.getState().deleteResistance(id);
  }
}

export class LocalAccessoryService implements AccessoryService {
  async list() {
    return useCatalogStore.getState().accessories.filter((a) => a.active);
  }
  async listAll() {
    return useCatalogStore.getState().accessories;
  }
  async save(a: Accessory) {
    useCatalogStore.getState().upsertAccessory(a);
    return a;
  }
  async remove(id: string) {
    useCatalogStore.getState().deleteAccessory(id);
  }
  async duplicate(id: string) {
    return useCatalogStore.getState().duplicateAccessory(id);
  }
}

export class LocalArticleService implements ArticleService {
  async list() {
    return useCatalogStore
      .getState()
      .articles.filter((a) => a.published)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  async listAll() {
    return [...useCatalogStore.getState().articles].sort((a, b) => a.sortOrder - b.sortOrder);
  }
  async get(id: string) {
    return useCatalogStore.getState().articles.find((a) => a.id === id);
  }
  async save(a: Article) {
    useCatalogStore.getState().upsertArticle(a);
    return a;
  }
  async remove(id: string) {
    useCatalogStore.getState().deleteArticle(id);
  }
  async reorder(id: string, dir: -1 | 1) {
    useCatalogStore.getState().reorderArticle(id, dir);
  }
}
