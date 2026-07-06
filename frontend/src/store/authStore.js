import { create } from "zustand";

// Deliberately in-memory only — never written to localStorage/sessionStorage.
// This is what makes it XSS-resistant: there's no storage API for a malicious
// script to read it from after the fact. It's repopulated via silent refresh
// (the httpOnly refresh cookie) whenever the app boots or a request 401s.
export const useAuthStore = create((set) => ({
    accessToken: null,
    setAccessToken: (token) => set({ accessToken: token }),
    clearAccessToken: () => set({ accessToken: null }),
}));