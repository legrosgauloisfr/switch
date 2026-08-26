import { sb } from "@/services/supabase/helpers";
import type { AccessoryService, ArticleService, PartsService } from "@/services/types";
import type { Accessory, Article, Cartridge, Resistance } from "@/types";

const mapCartridge = (r: Record<string, unknown>): Cartridge => ({
  id: r.id as string,
  deviceId: r.device_id as string,
  name: r.name as string,
  description: (r.description as string | null) ?? undefined,
  active: r.active as boolean,
});
const mapResistance = (r: Record<string, unknown>): Resistance => ({
  id: r.id as string,
  deviceId: r.device_id as string,
  name: r.name as string,
  ohm: r.ohm !== null && r.ohm !== undefined ? Number(r.ohm) : undefined,
  description: (r.description as string | null) ?? undefined,
  active: r.active as boolean,
});

export class SupabasePartsService implements PartsService {
  async cartridgesFor(deviceId: string) {
    const { data, error } = await sb().from("cartridges").select("*").eq("device_id", deviceId);
    if (error) throw error;
    return (data ?? []).map(mapCartridge);
  }
  async saveCartridge(c: Cartridge) {
    const { error } = await sb()
      .from("cartridges")
      .upsert({ id: c.id, device_id: c.deviceId, name: c.name, description: c.description ?? null, active: c.active });
    if (error) throw error;
    return c;
  }
  async removeCartridge(id: string) {
    const { error } = await sb().from("cartridges").delete().eq("id", id);
    if (error) throw error;
  }

  async resistancesFor(deviceId: string) {
    const { data, error } = await sb().from("resistances").select("*").eq("device_id", deviceId);
    if (error) throw error;
    return (data ?? []).map(mapResistance);
  }
  async saveResistance(r: Resistance) {
    const { error } = await sb()
      .from("resistances")
      .upsert({ id: r.id, device_id: r.deviceId, name: r.name, ohm: r.ohm ?? null, description: r.description ?? null, active: r.active });
    if (error) throw error;
    return r;
  }
  async removeResistance(id: string) {
    const { error } = await sb().from("resistances").delete().eq("id", id);
    if (error) throw error;
  }
}

const mapAccessory = (r: Record<string, unknown>): Accessory => ({
  id: r.id as string,
  brandId: (r.brand_id as string | null) ?? undefined,
  categoryId: (r.category_id as string | null) ?? undefined,
  name: r.name as string,
  description: (r.description as string | null) ?? undefined,
  priceEur: r.price_eur !== null && r.price_eur !== undefined ? Number(r.price_eur) : undefined,
  active: r.active as boolean,
});

export class SupabaseAccessoryService implements AccessoryService {
  async list() {
    const { data, error } = await sb().from("accessories").select("*").eq("active", true);
    if (error) throw error;
    return (data ?? []).map(mapAccessory);
  }
  async listAll() {
    const { data, error } = await sb().from("accessories").select("*");
    if (error) throw error;
    return (data ?? []).map(mapAccessory);
  }
  async save(a: Accessory) {
    const { error } = await sb().from("accessories").upsert({
      id: a.id,
      brand_id: a.brandId ?? null,
      category_id: a.categoryId ?? null,
      name: a.name,
      description: a.description ?? null,
      price_eur: a.priceEur ?? null,
      active: a.active,
    });
    if (error) throw error;
    return a;
  }
  async remove(id: string) {
    const { error } = await sb().from("accessories").delete().eq("id", id);
    if (error) throw error;
  }
  async duplicate(id: string) {
    const { data } = await sb().from("accessories").select("*").eq("id", id).maybeSingle();
    if (!data) return undefined;
    const source = mapAccessory(data);
    const copy: Accessory = { ...source, id: crypto.randomUUID(), name: `${source.name} (copie)`, active: false };
    return this.save(copy);
  }
}

type ArticleRow = {
  id: string;
  title: string;
  category: string;
  excerpt: string | null;
  body: string | null;
  image_url: string | null;
  published: boolean;
  sort_order: number;
};
const mapArticle = (r: ArticleRow): Article => ({
  id: r.id,
  title: r.title,
  category: r.category,
  excerpt: r.excerpt ?? "",
  body: r.body ?? "",
  image: r.image_url ?? undefined,
  published: r.published,
  sortOrder: r.sort_order,
});

export class SupabaseArticleService implements ArticleService {
  async list() {
    const { data, error } = await sb().from("articles").select("*").eq("published", true).order("sort_order");
    if (error) throw error;
    return (data as ArticleRow[]).map(mapArticle);
  }
  async listAll() {
    const { data, error } = await sb().from("articles").select("*").order("sort_order");
    if (error) throw error;
    return (data as ArticleRow[]).map(mapArticle);
  }
  async get(id: string) {
    const { data, error } = await sb().from("articles").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapArticle(data as ArticleRow) : undefined;
  }
  async save(a: Article) {
    const { error } = await sb().from("articles").upsert({
      id: a.id,
      title: a.title,
      category: a.category,
      excerpt: a.excerpt,
      body: a.body,
      image_url: a.image ?? null,
      published: a.published,
      sort_order: a.sortOrder,
    });
    if (error) throw error;
    return a;
  }
  async remove(id: string) {
    const { error } = await sb().from("articles").delete().eq("id", id);
    if (error) throw error;
  }
  async reorder(id: string, dir: -1 | 1) {
    const client = sb();
    const all = await this.listAll();
    const sorted = [...all].sort((a, b) => a.sortOrder - b.sortOrder);
    const i = sorted.findIndex((x) => x.id === id);
    const j = i + dir;
    if (i === -1 || j < 0 || j >= sorted.length) return;
    [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
    for (let idx = 0; idx < sorted.length; idx++) {
      if (sorted[idx].sortOrder === idx) continue;
      const { error } = await client.from("articles").update({ sort_order: idx }).eq("id", sorted[idx].id);
      if (error) throw error;
    }
  }
}
