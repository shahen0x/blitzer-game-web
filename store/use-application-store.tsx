import { create } from 'zustand';

export type GameMode = 'none' | 'normal' | 'ai' | 'bossFight';

interface ApplicationStore {

	mainMenuActive: boolean;
	setMainMenuActive: (mainMenuActive: boolean) => void;

	gameModeActive: GameMode;
	setGameModeActive: (gameModeActive: GameMode) => void;

	isLevelGeneratorActive: boolean;
	setIsLevelGeneratorActive: (isLevelGeneratorActive: boolean) => void;

	generatedLevelData: number[][] | undefined;
	setGeneratedLevelData: (generatedLevelData: number[][] | undefined) => void;

	levelBrowserActive: boolean;
	setLevelBrowserActive: (levelBrowserActive: boolean) => void;


	submitDialogActive: boolean;
	setSubmitDialogActive: (submitDialogActive: boolean) => void;

	leaderboardDialogActive: boolean;
	setLeaderboardDialogActive: (leaderboardDialogActive: boolean) => void;

}

export const useApplicationStore = create<ApplicationStore>((set) => ({

	mainMenuActive: false,
	setMainMenuActive: (mainMenuActive) => set({ mainMenuActive }),

	gameModeActive: 'none',
	setGameModeActive: (gameModeActive) => set({ gameModeActive }),

	isLevelGeneratorActive: false,
	setIsLevelGeneratorActive: (isLevelGeneratorActive) => set({ isLevelGeneratorActive }),

	generatedLevelData: undefined,
	setGeneratedLevelData: (generatedLevelData) => set({ generatedLevelData }),

	levelBrowserActive: false,
	setLevelBrowserActive: (levelBrowserActive) => set({ levelBrowserActive }),

	submitDialogActive: false,
	setSubmitDialogActive: (submitDialogActive) => set({ submitDialogActive }),

	leaderboardDialogActive: false,
	setLeaderboardDialogActive: (leaderboardDialogActive) => set({ leaderboardDialogActive }),


}));