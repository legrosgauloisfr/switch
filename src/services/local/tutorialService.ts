import { useCatalogStore } from "@/store/useCatalogStore";
import type { TutorialService } from "@/services/types";
import type { Tutorial } from "@/types";

export class LocalTutorialService implements TutorialService {
  async list() {
    return useCatalogStore.getState().tutorials.filter((t) => t.published);
  }
  async listAll() {
    return useCatalogStore.getState().tutorials;
  }
  async get(id: string) {
    return useCatalogStore.getState().tutorials.find((t) => t.id === id);
  }
  async save(tutorial: Tutorial) {
    useCatalogStore.getState().upsertTutorial(tutorial);
    return tutorial;
  }
  async remove(id: string) {
    useCatalogStore.getState().deleteTutorial(id);
  }
  async duplicate(id: string) {
    return useCatalogStore.getState().duplicateTutorial(id);
  }
}
