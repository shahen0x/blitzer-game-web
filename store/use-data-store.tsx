import { create } from "zustand";
import { Schema } from "@/amplify/data/resource";

export type AiLevelWithCoverImage = Schema["AiLevel"]["type"] & {
	coverImage?: string;
};

interface DataStore {
	levels: Array<AiLevelWithCoverImage> | undefined;
	setLevels: (levels: Array<Schema["AiLevel"]["type"]>) => void;
}

export const useDataStore = create<DataStore>((set) => ({
	levels: undefined,
	setLevels: (levels) => set({ levels })
}));