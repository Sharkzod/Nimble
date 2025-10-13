// stores/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id?: string;
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  balance?: number;
  pendingBalance?: number;
  role?: 'user' | 'vendor' | 'admin';
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean; // ✅ New flag
  setUser: (data: User) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
  login: (userData: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (state: boolean) => void; // ✅
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      hasHydrated: false,

      setUser: (data) => set({ user: data }),

      setToken: (token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", token);
        }
        set({ token });
      },

      clearUser: () => set({ user: null }),

      login: (userData, token) => {
        if (typeof window !== "undefined") {
          // Store in localStorage
          localStorage.setItem("authToken", token);

          // Also store in cookie
          const cookieSettings = [
            `authToken=${token}`,
            "path=/",
            `max-age=${60 * 60 * 24 * 7}`, // 7 days
            "SameSite=Lax",
            ...(process.env.NODE_ENV === "production" ? ["secure"] : []),
          ].join("; ");
          document.cookie = cookieSettings;
        }

        set({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        console.log("✅ Login successful - user and token stored");
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          document.cookie =
            "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });

        console.log("✅ Logout successful - all data cleared");
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        console.log("🔄 Rehydrating auth store...");
        return (state, error) => {
          if (error) {
            console.error("❌ Rehydration error:", error);
          } else if (state) {
            console.log("✅ Rehydration complete");
            console.log("Token:", state.token ? "✓" : "✗");
            console.log("User:", state.user ? "✓" : "✗");
            console.log("Authenticated:", state.isAuthenticated);

            // ✅ Mark hydration complete
            state.isLoading = false;
            state.hasHydrated = true;

            // ✅ Restore token to localStorage (for Axios interceptors)
            if (state.token && typeof window !== "undefined") {
              localStorage.setItem("authToken", state.token);
            }
          }
        };
      },
    }
  )
);
