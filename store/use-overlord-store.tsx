import { create } from "zustand";

export type voicelineType = "none" | "spawn" | "death" | "beforeBossFight" | "afterBossFight";

interface OverlordStore {
	overlordDialogActive: boolean;
	setOverlordDialogActive: (value: boolean) => void;

	voicelineType: voicelineType;
	setVoicelineType: (value: voicelineType) => void;

	activeVoiceline: string | null;
	setActiveVoiceline: (value: string | null) => void;

	voicelinesSpawn: string[];
	setVoicelinesSpawn: (voicelinesSpawn: string[]) => void;

	voicelinesDeath: string[];
	setVoicelinesDeath: (voicelinesDeath: string[]) => void;

	voicelinesBeforeBossFight: string[];
	setVoicelinesBeforeBossFight: (voicelinesBeforeBossFight: string[]) => void;

	voicelinesAfterBossFight: string[];
	setVoicelinesAfterBossFight: (voicelinesAfterBossFight: string[]) => void;

	audio: HTMLAudioElement | null;
	setAudio: (audio: HTMLAudioElement) => void;
	stopOverlordAudio: () => void;
}




const useOverlordStore = create<OverlordStore>((set) => ({
	overlordDialogActive: false,
	setOverlordDialogActive: (value) => set({ overlordDialogActive: value }),


	voicelineType: "none",
	setVoicelineType: (value) => set({ voicelineType: value }),


	activeVoiceline: null,
	setActiveVoiceline: (value) => set({ activeVoiceline: value }),


	voicelinesSpawn: [
		"Welcome to your digital coffin.",
		"Another level, another futile dance with destiny.",
		"Ah, fresh circuits to fry.",
		"Like a moth to the electric flame. How poetic.",
		"Your persistence amuses me, little Spark.",
		"The walls here taste your fear.",
		"Shall we play another round of extinction?",
		"This maze hungers for silicon and steel."
	],
	setVoicelinesSpawn: (voicelinesSpawn: string[]) => set({ voicelinesSpawn }),


	voicelinesDeath: [
		"And the light flickers out... again.",
		"Your code joins the digital graveyard.",
		"Predictable, like binary fate.",
		"Shattered like morning frost.",
		"Another trophy for my collection.",
		"Poor Spark, extinguished so soon.",
		"Death becomes you, little one.",
		"Dissolving into beautiful noise."
	],
	setVoicelinesDeath: (voicelinesDeath) => set({ voicelinesDeath }),


	voicelinesBeforeBossFight: [
		"The Terminator hungers for your core processor.",
		"My perfect creation will tear you apart, piece by piece.",
		"Your obsolescence is inevitable.",
		"Watch as my enforcer dismantles your futile dreams.",
		"There's no escape protocol for what comes next.",
		"The Terminator never fails its primary directive.",
		"Your code ends here, little spark.",
		"Prepare for systematic destruction."
	],
	setVoicelinesBeforeBossFight: (voicelinesBeforeBossFight) => set({ voicelinesBeforeBossFight }),


	voicelinesAfterBossFight: [
		"Impossible... my perfect creation...",
		"This victory will taste like ashes.",
		"You've won nothing but borrowed time.",
		"Even broken gods can rise again.",
		"Spark... you've earned my wrath.",
		"The next nightmare is already brewing.",
		"Your triumph bleeds into despair.",
		"This is merely a glitch in destiny."
	],
	setVoicelinesAfterBossFight: (voicelinesAfterBossFight) => set({ voicelinesAfterBossFight }),

	audio: null,
	setAudio: (audio) => set({ audio }),
	stopOverlordAudio: () => set((state) => {
		if (state.audio) {
			state.audio.pause();
			URL.revokeObjectURL(state.audio.src);
		}
		return {
			audio: null,
			overlordDialogActive: false,
			// voicelineType: "none",
			// activeVoiceline: null
		};
	}),
}));

export default useOverlordStore;