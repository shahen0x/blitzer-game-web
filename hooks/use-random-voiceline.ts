import { useEvilAiStore } from "@/store/use-evil-ai-store";
import { useState } from "react";

const useRandomVoiceline = () => {
	const {
		voicelinesSpawn,
		voicelinesDeath,
		voicelinesBeforeBossFight,
		voicelinesAfterBossFight,
		setEvilAiPanelActive,
	} = useEvilAiStore();

	const [currentVoiceline, setCurrentVoiceline] = useState<string | null>(null);

	// Tracks the last used index to minimize repetition
	const lastUsedIndices: { [key: string]: number | null } = {
		spawn: null,
		death: null,
		beforeBossfight: null,
		afterBossfight: null,
	};

	const getRandomVoiceline = (category: "spawn" | "death" | "beforeBossFight" | "afterBossFight") => {
		let voicelines: string[];

		switch (category) {
			case "spawn":
				voicelines = voicelinesSpawn;
				break;
			case "death":
				voicelines = voicelinesDeath;
				break;
			case "beforeBossFight":
				voicelines = voicelinesBeforeBossFight;
				break;
			case "afterBossFight":
				voicelines = voicelinesAfterBossFight;
				break;
			default:
				throw new Error("Invalid category");
		}

		if (!voicelines || voicelines.length === 0) return null;

		let randomIndex: number;

		// Avoid immediate repetition
		do {
			randomIndex = Math.floor(Math.random() * voicelines.length);
		} while (randomIndex === lastUsedIndices[category] && voicelines.length > 1);

		// Update the last used index and set the current voiceline
		lastUsedIndices[category] = randomIndex;
		const selectedVoiceline = voicelines[randomIndex];
		setCurrentVoiceline(selectedVoiceline);

		return selectedVoiceline;
	};

	return { getRandomVoiceline, currentVoiceline };
};

export default useRandomVoiceline;