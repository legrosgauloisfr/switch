import { sb } from "@/services/supabase/helpers";
import type { TutorialService } from "@/services/types";
import type { Tutorial } from "@/types";

type TutorialRow = {
  id: string;
  title: string;
  category: string;
  duration_min: number;
  intro: string | null;
  image_url: string | null;
  published: boolean;
  grid_summary: string | null;
  tutorial_steps: { n: number; text: string }[];
};

const SELECT = "*,tutorial_steps(*)";

function mapTutorial(row: TutorialRow): Tutorial {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    durationMin: row.duration_min,
    intro: row.intro ?? "",
    image: row.image_url ?? undefined,
    gridSummary: row.grid_summary ?? row.intro ?? row.title,
    steps: [...(row.tutorial_steps ?? [])].sort((a, b) => a.n - b.n),
    published: row.published,
  };
}

export class SupabaseTutorialService implements TutorialService {
  async list() {
    const { data, error } = await sb().from("tutorials").select(SELECT).eq("published", true).order("sort_order");
    if (error) throw error;
    return (data as TutorialRow[]).map(mapTutorial);
  }
  async listAll() {
    const { data, error } = await sb().from("tutorials").select(SELECT).order("sort_order");
    if (error) throw error;
    return (data as TutorialRow[]).map(mapTutorial);
  }
  async get(id: string) {
    const { data, error } = await sb().from("tutorials").select(SELECT).eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapTutorial(data as TutorialRow) : undefined;
  }
  async save(tutorial: Tutorial) {
    const client = sb();
    const { error: upsertError } = await client.from("tutorials").upsert({
      id: tutorial.id,
      title: tutorial.title,
      category: tutorial.category,
      duration_min: tutorial.durationMin,
      intro: tutorial.intro,
      image_url: tutorial.image ?? null,
      published: tutorial.published,
      grid_summary: tutorial.gridSummary,
    });
    if (upsertError) throw upsertError;

    await client.from("tutorial_steps").delete().eq("tutorial_id", tutorial.id);
    if (tutorial.steps.length) {
      const { error } = await client
        .from("tutorial_steps")
        .insert(tutorial.steps.map((s) => ({ tutorial_id: tutorial.id, n: s.n, text: s.text })));
      if (error) throw error;
    }

    return tutorial;
  }
  async remove(id: string) {
    const { error } = await sb().from("tutorials").delete().eq("id", id);
    if (error) throw error;
  }
  async duplicate(id: string) {
    const source = await this.get(id);
    if (!source) return undefined;
    const copy: Tutorial = { ...source, id: crypto.randomUUID(), title: `${source.title} (copie)`, published: false };
    return this.save(copy);
  }
}
