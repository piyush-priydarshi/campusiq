import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareState {
  compareIds: string[]; // List of college IDs currently compared (capped at 3)
  addCompareId: (id: string) => boolean; // Returns true if added successfully
  removeCompareId: (id: string) => void;
  clearCompare: () => void;
  isComparing: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareIds: [],
      addCompareId: (id) => {
        const current = get().compareIds;
        if (current.includes(id)) {
          return false;
        }
        if (current.length >= 3) {
          return false; // Capped at 3
        }
        set({ compareIds: [...current, id] });
        return true;
      },
      removeCompareId: (id) => {
        set({ compareIds: get().compareIds.filter((item) => item !== id) });
      },
      clearCompare: () => {
        set({ compareIds: [] });
      },
      isComparing: (id) => {
        return get().compareIds.includes(id);
      },
    }),
    {
      name: "campusiq-compare",
      skipHydration: true,
    }
  )
);
