"use client"

import { create } from "zustand"

type SignInFormStore = {
  isOpen: boolean
  openSignIn: () => void
  closeSignIn: () => void
  toggleSignIn: () => void
}

export const useSignInForm = create<SignInFormStore>((set) => ({
  isOpen: false,
  openSignIn: () => set({ isOpen: true }),
  closeSignIn: () => set({ isOpen: false }),
  toggleSignIn: () => set((state) => ({ isOpen: !state.isOpen })),
}))
