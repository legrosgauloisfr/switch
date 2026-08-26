import { useCatalogStore } from "@/store/useCatalogStore";
import type { ContentService } from "@/services/types";
import type { AdviceItem, FaqItem, NotificationItem } from "@/types";

export class LocalContentService implements ContentService {
  async faq() {
    return useCatalogStore
      .getState()
      .faq.filter((f) => f.published)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  async faqAll() {
    return [...useCatalogStore.getState().faq].sort((a, b) => a.sortOrder - b.sortOrder);
  }
  async saveFaq(item: FaqItem) {
    useCatalogStore.getState().upsertFaq(item);
    return item;
  }
  async removeFaq(id: string) {
    useCatalogStore.getState().deleteFaq(id);
  }
  async reorderFaq(id: string, dir: -1 | 1) {
    useCatalogStore.getState().reorderFaq(id, dir);
  }

  async advice() {
    return useCatalogStore
      .getState()
      .advice.filter((a) => a.published)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  async adviceAll() {
    return [...useCatalogStore.getState().advice].sort((a, b) => a.sortOrder - b.sortOrder);
  }
  async saveAdvice(item: AdviceItem) {
    useCatalogStore.getState().upsertAdvice(item);
    return item;
  }
  async removeAdvice(id: string) {
    useCatalogStore.getState().deleteAdvice(id);
  }
  async reorderAdvice(id: string, dir: -1 | 1) {
    useCatalogStore.getState().reorderAdvice(id, dir);
  }

  async notifications() {
    return useCatalogStore
      .getState()
      .notifications.filter((n) => n.published)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  async notificationsAll() {
    return [...useCatalogStore.getState().notifications].sort((a, b) => b.createdAt - a.createdAt);
  }
  async saveNotification(n: NotificationItem) {
    useCatalogStore.getState().upsertNotification(n);
    return n;
  }
  async removeNotification(id: string) {
    useCatalogStore.getState().deleteNotification(id);
  }
}
