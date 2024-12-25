import { create } from 'zustand';

interface AiLevelStore {
	generatedLevel: number[][];
	setGeneratedLevel: (generatedLevel: number[][]) => void;

	triggerAiLevelMode: boolean;
	setTriggerAiLevelMode: (triggerAiLevelMode: boolean) => void;
}

export const useAiLevelStore = create<AiLevelStore>((set) => ({
	generatedLevel: [],
	setGeneratedLevel: (generatedLevel) => set({ generatedLevel }),

	triggerAiLevelMode: false,
	setTriggerAiLevelMode: (triggerAiLevelMode) => set({ triggerAiLevelMode }),
}));