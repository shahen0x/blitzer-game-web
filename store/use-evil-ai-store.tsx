import { create } from "zustand";

interface EvilAiStore {
	evilAiPanelActive: boolean;
	setEvilAiPanelActive: (evilAiPanelActive: boolean) => void;
}

export const useEvilAiStore = create<EvilAiStore>((set) => ({
	evilAiPanelActive: false,
	setEvilAiPanelActive: (evilAiPanelActive) => set({ evilAiPanelActive })
}));