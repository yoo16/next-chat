import { create } from "zustand";

export const useLoadingStore = create<{
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
}>((set) => ({
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),
}));