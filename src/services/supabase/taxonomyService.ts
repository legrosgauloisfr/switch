import { sb } from "@/services/supabase/helpers";
import type { TaxonomyService } from "@/services/types";
import type { Brand, Category, Flavor } from "@/types";

type BrandRow = { id: string; name: string; logo_url: string | null; description: string | null; active: boolean };
const mapBrand = (r: BrandRow): Brand => ({ id: r.id, name: r.name, logoUrl: r.logo_url ?? undefined, description: r.description ?? undefined, active: r.active });

export class SupabaseTaxonomyService implements TaxonomyService {
  async brands() {
    const { data, error } = await sb().from("brands").select("*").order("name");
    if (error) throw error;
    return (data as BrandRow[]).map(mapBrand);
  }
  async saveBrand(b: Brand) {
    const { error } = await sb()
      .from("brands")
      .upsert({ id: b.id, name: b.name, logo_url: b.logoUrl ?? null, description: b.description ?? null, active: b.active });
    if (error) throw error;
    return b;
  }
  async removeBrand(id: string) {
    const { error } = await sb().from("brands").delete().eq("id", id);
    if (error) throw error;
  }

  async categories() {
    const { data, error } = await sb().from("categories").select("*").order("name");
    if (error) throw error;
    return (data as Category[]).map((r) => ({ id: r.id, slug: r.slug, name: r.name, active: r.active }));
  }
  async saveCategory(c: Category) {
    const { error } = await sb().from("categories").upsert({ id: c.id, slug: c.slug, name: c.name, active: c.active });
    if (error) throw error;
    return c;
  }
  async removeCategory(id: string) {
    const { error } = await sb().from("categories").delete().eq("id", id);
    if (error) throw error;
  }

  async flavors() {
    const { data, error } = await sb().from("flavors").select("*").order("name");
    if (error) throw error;
    return (data as Flavor[]).map((r) => ({ id: r.id, name: r.name, active: r.active }));
  }
  async saveFlavor(f: Flavor) {
    const { error } = await sb().from("flavors").upsert({ id: f.id, name: f.name, active: f.active });
    if (error) throw error;
    return f;
  }
  async removeFlavor(id: string) {
    const { error } = await sb().from("flavors").delete().eq("id", id);
    if (error) throw error;
  }
}
