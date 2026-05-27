import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedComparison {
  id: string;
  name: string;
  collegeIds: string[];
  createdAt: string;
}

interface SavedState {
  savedColleges: string[]; // List of bookmarked college IDs
  savedComparisons: SavedComparison[];
  toggleSavedCollege: (collegeId: string) => void;
  isCollegeSaved: (collegeId: string) => boolean;
  saveComparison: (name: string, collegeIds: string[]) => void;
  deleteComparison: (id: string) => void;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedColleges: [],
      savedComparisons: [],
      toggleSavedCollege: (collegeId) => {
        const current = get().savedColleges;
        if (current.includes(collegeId)) {
          set({ savedColleges: current.filter((id) => id !== collegeId) });
        } else {
          set({ savedColleges: [...current, collegeId] });
        }
      },
      isCollegeSaved: (collegeId) => {
        return get().savedColleges.includes(collegeId);
      },
      saveComparison: (name, collegeIds) => {
        const newComparison: SavedComparison = {
          id: Math.random().toString(36).substring(2, 11),
          name,
          collegeIds,
          createdAt: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        };
        set({ savedComparisons: [newComparison, ...get().savedComparisons] });
      },
      deleteComparison: (id) => {
        set({
          savedComparisons: get().savedComparisons.filter((c) => c.id !== id),
        });
      },
    }),
    {
      name: "campusiq-saved",
      skipHydration: true,
    }
  )
);
