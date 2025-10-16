import { create } from "zustand";

export type UserRole = "creator" | "brand" | "admin";
export type OnboardingStatus = 1 | 2 | 3 | 4 | 5;

export interface User {
  id: string;
  email: string;
  username?: string;
  profileImageUrl?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  location?: string;
  role: UserRole;
  onboardingStatus: OnboardingStatus;
  isEmailVerified: boolean;
  isActive: boolean;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  otherSocial?: string;
  companyName?: string;
  shopAddress?: string;
  businessWebsite?: string;
  businessDescription?: string;
  categories?: string[];
  cardLast4?: string;
  cardBrand?: string;
  cardExpiry?: string;
  abn?: string;
  heardAboutUs?: string;
  notificationsEnabled: boolean;
  agreedToTerms: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  setUser: (newUser) =>
    set((state) => ({
      user: {
        ...(state.user || {}),
        ...newUser,
      },
    })),

  updateUser: (updates) =>
    set((state) => {
      console.log("Current user before update:", state.user); // debug line
      if (!state.user) return {}; // safeguard
      return {
        user: {
          ...state.user,
          ...updates,
        },
      };
    }),

  clearUser: () => set({ user: null }),
}));
