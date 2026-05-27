import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthModalOpen: false,
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      login: (email, name = "Scholar") =>
        set({
          user: { email, name: name || "Scholar" },
          isAuthModalOpen: false,
        }),
      logout: () => set({ user: null }),
    }),
    {
      name: "campusiq-auth",
      // Bypass window undefined in Next.js Server Components
      skipHydration: true,
    }
  )
);
