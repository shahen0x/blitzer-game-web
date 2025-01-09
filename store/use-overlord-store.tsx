import { create } from "zustand";

type voicelineType = "none" | "spawn" | "death" | "beforeBossFight" | "afterBossFight";

interface OverlordStore {
	overlordDialogActive: boolean;
	setOverlordDialogActive: (value: boolean) => void;


	voicelineType: voicelineType;
	setVoicelineType: (value: voicelineType) => void;
}

const useOverlordStore = create<OverlordStore>((set) => ({
	overlordDialogActive: false,
	setOverlordDialogActive: (value) => set({ overlordDialogActive: value }),


	voicelineType: "none",
	setVoicelineType: (value) => set({ voicelineType: value }),

}));

export default useOverlordStore;