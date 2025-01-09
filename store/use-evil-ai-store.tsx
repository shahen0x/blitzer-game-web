/**
 * AI OVERLORD'S STORE
 * This store controls the ai overlord's voicelines
 * NOTE: Each voiceline included in this store is default or a fallback
 * Since the AI generation may be slow or fail, this is used as a failsafe.
 * 
 */

import { create } from "zustand";

interface EvilAiStore {
	evilAiPanelActive: boolean;
	setEvilAiPanelActive: (evilAiPanelActive: boolean) => void;


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
	stopAudio: () => void;
	pauseAudio: () => void;
	resumeAudio: () => void;
}

export const useEvilAiStore = create<EvilAiStore>((set) => ({
	evilAiPanelActive: false,
	setEvilAiPanelActive: (evilAiPanelActive) => set({ evilAiPanelActive }),


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
	setVoicelinesSpawn: (voicelinesSpawn) => set({ voicelinesSpawn }),


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

	stopAudio: () => set((state) => {
		if (state.audio) {
			state.audio.pause();
			URL.revokeObjectURL(state.audio.src);
		}
		return { audio: null, evilAiPanelActive: false };
	}),

	pauseAudio: () => set((state) => {
		if (state.audio) {
			state.audio.pause();
		}
		return { audio: state.audio };
	}),

	resumeAudio: () => set((state) => {
		if (state.audio) {
			state.audio.play();
		}
		return { audio: state.audio };
	}),
}));