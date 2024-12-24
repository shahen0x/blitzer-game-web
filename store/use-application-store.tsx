import { create } from 'zustand';

interface ApplicationStore {
	isUnityLoaded: boolean;
	setIsUnityLoaded: (isUnityLoaded: boolean) => void;

	isMainMenuActive: boolean;
	setIsMainMenuActive: (isMainMenuActive: boolean) => void;

	isLevelSelectorActive: boolean;
	setIsLevelSelectorActive: (isLevelSelectorActive: boolean) => void;
}

export const useApplicationStore = create<ApplicationStore>((set) => ({
	isUnityLoaded: false,
	setIsUnityLoaded: (isUnityLoaded) => set({ isUnityLoaded }),

	isMainMenuActive: false,
	setIsMainMenuActive: (isMainMenuActive) => set({ isMainMenuActive }),

	isLevelSelectorActive: false,
	setIsLevelSelectorActive: (isLevelSelectorActive) => set({ isLevelSelectorActive }),
}));