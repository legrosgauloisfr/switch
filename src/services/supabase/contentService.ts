import { sb } from "@/services/supabase/helpers";
import { relativeTimeFr } from "@/lib/relativeTime";
import type { ContentService } from "@/services/types";
import type { AdviceItem, FaqItem, NotificationItem } from "@/types";

type FaqRow = { id: string; question: string; answer: string; published: boolean; sort_order: number };
type AdviceRow = { id: string; tag: string; text: string; published: boolean; sort_order: number };
type NotificationRow = {
  id: string;
  title: string;
  body: string;
  unread: boolean;
  published: boolean;
  created_at: string;
};

const mapFaq = (r: FaqRow): FaqItem => ({ id: r.id, question: r.question, answer: r.answer, published: r.published, sortOrder: r.sort_order });
const mapAdvice = (r: AdviceRow): AdviceItem => ({ id: r.id, tag: r.tag, text: r.text, published: r.published, sortOrder: r.sort_order });
const mapNotification = (r: NotificationRow): NotificationItem => ({
  id: r.id,
  title: r.title,
  text: r.body,
  when: relativeTimeFr(r.created_at),
  unread: r.unread,
  published: r.published,
  createdAt: new Date(r.created_at).getTime(),
});

export class SupabaseContentService implements ContentService {
  async faq() {
    const { data, error } = await sb().from("faq_items").select("*").eq("published", true).order("sort_order");
    if (error) throw error;
    return (data as FaqRow[]).map(mapFaq);
  }
  async faqAll() {
    const { data, error } = await sb().from("faq_items").select("*").order("sort_order");
    if (error) throw error;
    return (data as FaqRow[]).map(mapFaq);
  }
  async saveFaq(item: FaqItem) {
    const { error } = await sb()
      .from("faq_items")
      .upsert({ id: item.id, question: item.question, answer: item.answer, published: item.published, sort_order: item.sortOrder });
    if (error) throw error;
    return item;
  }
  async removeFaq(id: string) {
    const { error } = await sb().from("faq_items").delete().eq("id", id);
    if (error) throw error;
  }
  async reorderFaq(id: string, dir: -1 | 1) {
    await reorder(sb(), "faq_items", await this.faqAll(), id, dir);
  }

  async advice() {
    const { data, error } = await sb().from("advice_items").select("*").eq("published", true).order("sort_order");
    if (error) throw error;
    return (data as AdviceRow[]).map(mapAdvice);
  }
  async adviceAll() {
    const { data, error } = await sb().from("advice_items").select("*").order("sort_order");
    if (error) throw error;
    return (data as AdviceRow[]).map(mapAdvice);
  }
  async saveAdvice(item: AdviceItem) {
    const { error } = await sb()
      .from("advice_items")
      .upsert({ id: item.id, tag: item.tag, text: item.text, published: item.published, sort_order: item.sortOrder });
    if (error) throw error;
    return item;
  }
  async removeAdvice(id: string) {
    const { error } = await sb().from("advice_items").delete().eq("id", id);
    if (error) throw error;
  }
  async reorderAdvice(id: string, dir: -1 | 1) {
    await reorder(sb(), "advice_items", await this.adviceAll(), id, dir);
  }

  async notifications() {
    const { data, error } = await sb()
      .from("notifications")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as NotificationRow[]).map(mapNotification);
  }
  async notificationsAll() {
    const { data, error } = await sb().from("notifications").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data as NotificationRow[]).map(mapNotification);
  }
  async saveNotification(n: NotificationItem) {
    const { error } = await sb()
      .from("notifications")
      .upsert({ id: n.id, title: n.title, body: n.text, unread: n.unread, published: n.published });
    if (error) throw error;
    return n;
  }
  async removeNotification(id: string) {
    const { error } = await sb().from("notifications").delete().eq("id", id);
    if (error) throw error;
  }
}

// Shared by reorderFaq/reorderAdvice: both tables use the same {id, sort_order} shape.
async function reorder(
  client: ReturnType<typeof sb>,
  table: "faq_items" | "advice_items",
  all: { id: string; sortOrder: number }[],
  id: string,
  dir: -1 | 1
) {
  const sorted = [...all].sort((a, b) => a.sortOrder - b.sortOrder);
  const i = sorted.findIndex((x) => x.id === id);
  const j = i + dir;
  if (i === -1 || j < 0 || j >= sorted.length) return;
  [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
  for (let idx = 0; idx < sorted.length; idx++) {
    if (sorted[idx].sortOrder === idx) continue;
    const { error } = await client.from(table).update({ sort_order: idx }).eq("id", sorted[idx].id);
    if (error) throw error;
  }
}
