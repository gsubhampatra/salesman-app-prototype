import { create } from "zustand";

interface UserState {
    isLogedIn: boolean;
    setIsLogedIn: (val: boolean) => void;
    isOnline: boolean;
    setIsOnline: (val: boolean) => void;
    userDetails: {
        name: string;
        email: string;
        id: number
    } | null;
    setUserDetails: (val: { name: string, email: string, id: number }) => void;
}

export const useUserStore = create<UserState>((set) => ({
    isLogedIn: false,
    setIsLogedIn: (val) => set(() => ({ isLogedIn: val })),
    isOnline: false,
    setIsOnline: (val) => set(() => ({ isOnline: val })),
    userDetails: null,
    setUserDetails: (val) => set(() => ({ userDetails: val })),
}));
