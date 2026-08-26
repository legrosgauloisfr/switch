import { sb } from "@/services/supabase/helpers";
import type { LiquidService, ProductService } from "@/services/types";
import type { Liquid, Product } from "@/types";

type DeviceRow = {
  id: string;
  brand_id: string | null;
  kind: string;
  name: string;
  price_eur: number;
  running_cost_label: string | null;
  simplicity: number;
  autonomy: number;
  format_tag: Product["formatTag"];
  simplicity_tag: Product["simplicityTag"];
  budget_tier: Product["budgetTier"];
  description_short: string | null;
  description_long: string | null;
  active: boolean;
  device_specs: { key: string; value: string; sort_order: number }[];
  device_images: { url: string; sort_order: number }[];
};

function mapProduct(row: DeviceRow): Product {
  return {
    id: row.id,
    name: row.name,
    brandId: row.brand_id ?? undefined,
    kind: row.kind,
    priceEur: Number(row.price_eur),
    runningCostLabel: row.running_cost_label ?? "",
    simplicity: row.simplicity,
    autonomy: row.autonomy,
    formatTag: row.format_tag,
    simplicityTag: row.simplicity_tag,
    budgetTier: row.budget_tier,
    descriptionShort: row.description_short ?? undefined,
    descriptionLong: row.description_long ?? undefined,
    specs: [...(row.device_specs ?? [])].sort((a, b) => a.sort_order - b.sort_order).map((s) => ({ key: s.key, value: s.value })),
    images: [...(row.device_images ?? [])].sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url),
    active: row.active,
  };
}

const SELECT = "*,device_specs(*),device_images(*)";

export class SupabaseProductService implements ProductService {
  async list() {
    const { data, error } = await sb().from("devices").select(SELECT).eq("active", true);
    if (error) throw error;
    return (data as DeviceRow[]).map(mapProduct);
  }
  async listAll() {
    const { data, error } = await sb().from("devices").select(SELECT).order("created_at", { ascending: false });
    if (error) throw error;
    return (data as DeviceRow[]).map(mapProduct);
  }
  async get(id: string) {
    const { data, error } = await sb().from("devices").select(SELECT).eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapProduct(data as DeviceRow) : undefined;
  }
  async save(product: Product) {
    const client = sb();
    const { error: upsertError } = await client.from("devices").upsert({
      id: product.id,
      brand_id: product.brandId ?? null,
      kind: product.kind,
      name: product.name,
      price_eur: product.priceEur,
      running_cost_label: product.runningCostLabel,
      simplicity: product.simplicity,
      autonomy: product.autonomy,
      format_tag: product.formatTag,
      simplicity_tag: product.simplicityTag,
      budget_tier: product.budgetTier,
      description_short: product.descriptionShort ?? null,
      description_long: product.descriptionLong ?? null,
      active: product.active,
    });
    if (upsertError) throw upsertError;

    await client.from("device_specs").delete().eq("device_id", product.id);
    if (product.specs.length) {
      const { error } = await client
        .from("device_specs")
        .insert(product.specs.map((s, i) => ({ device_id: product.id, key: s.key, value: s.value, sort_order: i })));
      if (error) throw error;
    }

    await client.from("device_images").delete().eq("device_id", product.id);
    if (product.images.length) {
      const { error } = await client
        .from("device_images")
        .insert(product.images.map((url, i) => ({ device_id: product.id, url, sort_order: i, is_primary: i === 0 })));
      if (error) throw error;
    }

    return product;
  }
  async remove(id: string) {
    const { error } = await sb().from("devices").delete().eq("id", id);
    if (error) throw error;
  }
  async duplicate(id: string) {
    const source = await this.get(id);
    if (!source) return undefined;
    const copy: Product = { ...source, id: crypto.randomUUID(), name: `${source.name} (copie)`, active: false };
    return this.save(copy);
  }
}

type LiquidRow = {
  id: string;
  brand_id: string | null;
  name: string;
  universe: string;
  description_short: string | null;
  spec_hint: string | null;
  active: boolean;
  liquid_images: { url: string; sort_order: number }[];
  liquid_flavors: { flavors: { name: string } | null }[];
};

const LIQUID_SELECT = "*,liquid_images(*),liquid_flavors(flavors(name))";

function mapLiquid(row: LiquidRow): Liquid {
  return {
    id: row.id,
    name: row.name,
    brandId: row.brand_id ?? undefined,
    flavorTag: row.liquid_flavors?.[0]?.flavors?.name ?? "",
    universe: row.universe,
    description: row.description_short ?? "",
    specHint: row.spec_hint ?? "",
    images: [...(row.liquid_images ?? [])].sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url),
    active: row.active,
  };
}

export class SupabaseLiquidService implements LiquidService {
  async list() {
    const { data, error } = await sb().from("liquids").select(LIQUID_SELECT).eq("active", true);
    if (error) throw error;
    return (data as unknown as LiquidRow[]).map(mapLiquid);
  }
  async listAll() {
    const { data, error } = await sb().from("liquids").select(LIQUID_SELECT).order("created_at", { ascending: false });
    if (error) throw error;
    return (data as unknown as LiquidRow[]).map(mapLiquid);
  }
  async get(id: string) {
    const { data, error } = await sb().from("liquids").select(LIQUID_SELECT).eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapLiquid(data as unknown as LiquidRow) : undefined;
  }
  async save(liquid: Liquid) {
    const client = sb();
    const { error: upsertError } = await client.from("liquids").upsert({
      id: liquid.id,
      brand_id: liquid.brandId ?? null,
      name: liquid.name,
      universe: liquid.universe,
      description_short: liquid.description,
      spec_hint: liquid.specHint,
      active: liquid.active,
    });
    if (upsertError) throw upsertError;

    await client.from("liquid_images").delete().eq("liquid_id", liquid.id);
    if (liquid.images.length) {
      const { error } = await client
        .from("liquid_images")
        .insert(liquid.images.map((url, i) => ({ liquid_id: liquid.id, url, sort_order: i, is_primary: i === 0 })));
      if (error) throw error;
    }

    await client.from("liquid_flavors").delete().eq("liquid_id", liquid.id);
    if (liquid.flavorTag) {
      const { data: flavor } = await client.from("flavors").select("id").eq("name", liquid.flavorTag).maybeSingle();
      if (flavor) {
        const { error } = await client.from("liquid_flavors").insert({ liquid_id: liquid.id, flavor_id: flavor.id });
        if (error) throw error;
      }
    }

    return liquid;
  }
  async remove(id: string) {
    const { error } = await sb().from("liquids").delete().eq("id", id);
    if (error) throw error;
  }
  async duplicate(id: string) {
    const source = await this.get(id);
    if (!source) return undefined;
    const copy: Liquid = { ...source, id: crypto.randomUUID(), name: `${source.name} (copie)`, active: false };
    return this.save(copy);
  }
}
