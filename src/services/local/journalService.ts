import { useUserStore } from "@/store/useAppStore";
import type { JournalService } from "@/services/types";

// Backed by the persisted Zustand store for now. A Supabase implementation would instead
// read/write the `journal_entries` table — same interface, no caller changes.
export class LocalJournalService implements JournalService {
  async list() {
    return useUserStore.getState().journal;
  }
  async add(label: string) {
    return useUserStore.getState().addJournalEntry(label);
  }
  async remove(id: string) {
    useUserStore.getState().removeJournalEntry(id);
  }
}
