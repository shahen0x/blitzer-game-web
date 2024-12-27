import { create } from 'zustand';

export type GameMode = 'none' | 'normal' | 'ai' | 'bossFight';

interface ApplicationStore {
	isUnityLoaded: boolean;
	setIsUnityLoaded: (isUnityLoaded: boolean) => void;

	isMainMenuActive: boolean;
	setIsMainMenuActive: (isMainMenuActive: boolean) => void;

	gameModeActive: GameMode;
	setGameModeActive: (gameModeActive: GameMode) => void;

	isLevelGeneratorActive: boolean;
	setIsLevelGeneratorActive: (isLevelGeneratorActive: boolean) => void;


	submitDialogActive: boolean;
	setSubmitDialogActive: (submitDialogActive: boolean) => void;

	leaderboardDialogActive: boolean;
	setLeaderboardDialogActive: (leaderboardDialogActive: boolean) => void;



	isLevelSelectorActive: boolean;
	setIsLevelSelectorActive: (isLevelSelectorActive: boolean) => void;



}

export const useApplicationStore = create<ApplicationStore>((set) => ({
	isUnityLoaded: false,
	setIsUnityLoaded: (isUnityLoaded) => set({ isUnityLoaded }),

	isMainMenuActive: false,
	setIsMainMenuActive: (isMainMenuActive) => set({ isMainMenuActive }),

	// Used for setting which game mode is active
	gameModeActive: 'none',
	setGameModeActive: (gameModeActive) => set({ gameModeActive }),

	isLevelGeneratorActive: false,
	setIsLevelGeneratorActive: (isLevelGeneratorActive) => set({ isLevelGeneratorActive }),

	submitDialogActive: false,
	setSubmitDialogActive: (submitDialogActive) => set({ submitDialogActive }),

	leaderboardDialogActive: false,
	setLeaderboardDialogActive: (leaderboardDialogActive) => set({ leaderboardDialogActive }),


	isLevelSelectorActive: false,
	setIsLevelSelectorActive: (isLevelSelectorActive) => set({ isLevelSelectorActive }),


}));