import { create } from 'zustand';

interface UserStore {
	user: Object;
	setUser: (user: []) => void;
}

export const useUserStore = create<UserStore>((set) => ({
	user: {},
	setUser: (user) => set({ user }),
}));