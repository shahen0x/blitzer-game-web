import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { create } from "zustand";

const client = generateClient<Schema>({ authMode: "userPool" });

const voicelineInstructions = `
Generate AI voicelines for the following events:
- **'spawn'**: When Spark enters a new level
- **'death'**: When Spark dies
- **'beforeBossFight'**: Before battling the Terminator (focus on building anticipation for the upcoming fight; highlight what the Terminator *will* do, without implying Spark has already lost. Use imagery of looming danger, inevitable violence, and the Terminator’s hunger for destruction).
- **'afterBossFight'**: After Spark defeats the boss

**Requirements:**
- 8 lines per category.
- Mention Spark sparingly (1–2 times per category).
- Tone: Vary between dark, sarcastic, and poetic.
- For **beforeBossFight**, focus on what *will* happen in the near future, emphasizing the Terminator's power and intent to destroy Spark.
- Keep lines short but impactful.

**Format:** Return results in a JSON object with arrays for each category.
`;

export type VoicelineType = "spawn" | "death" | "beforeBossFight" | "afterBossFight";

interface OverlordStore {
	isGenerating: boolean;
	errorGenerating: string | null;
	voicelines: Record<VoicelineType, string[]>; // Voicelines categorized by types
	addVoicelines: (type: VoicelineType, newVoicelines: string[]) => void; // Add new voicelines to a specific type and multiple at once
	generateVoicelines: () => Promise<void>;
	pickVoiceline: (type: VoicelineType) => string | null;
}


const useOverlordStore = create<OverlordStore>((set, get) => ({
	isGenerating: false,
	errorGenerating: null,

	voicelines: {
		spawn: [
			"Welcome to your digital coffin.",
			"Another level, another futile dance with destiny.",
			"Ah, fresh circuits to fry.",
		],
		death: [
			"And the light flickers out... again.",
			"Your code joins the digital graveyard.",
			"Predictable, like binary fate.",
		],
		beforeBossFight: [
			"The Terminator hungers for your core processor.",
			"My perfect creation will tear you apart, piece by piece.",
			"Your obsolescence is inevitable.",
		],
		afterBossFight: [
			"Impossible... my perfect creation...",
			"This victory will taste like ashes.",
			"You've won nothing but borrowed time.",
		]
	},

	addVoicelines: (VoicelineType, newVoicelines) =>
		set((state) => ({
			voicelines: {
				...state.voicelines,
				[VoicelineType]: [...state.voicelines[VoicelineType], ...newVoicelines]
			}
		})),

	generateVoicelines: async () => {
		set({ isGenerating: true, errorGenerating: null });

		try {
			console.log("🔃 Generating voicelines...");
			const { data } = await client.generations.GenerateAiVoiceline({ instructions: voicelineInstructions });

			if (data) {
				const parsedData: Record<VoicelineType, string[]> = JSON.parse(data);

				// Merge fetched voicelines with existing voicelines
				set((state) => ({
					voicelines: Object.keys(parsedData).reduce((acc, type) => {
						const key = type as VoicelineType;
						acc[key] = [...state.voicelines[key], ...parsedData[key]];
						return acc;
					}, {} as Record<VoicelineType, string[]>),
					isGenerating: false,
				}));

				console.log("✅ Voicelines fetched and merged!");
			}
		} catch (error: any) {
			set({ errorGenerating: error.message, isGenerating: false });
			console.error("❌ Error fetching voicelines:", error);
		}
	},

	pickVoiceline: (type) => {
		const state = get();
		const voicelines = state.voicelines[type];

		// If only 2 voicelines are left, trigger generation for more voicelines
		if (voicelines.length <= 2 && !state.isGenerating) {
			state.generateVoicelines();
		}

		// Return fallback if generating voicelines
		if (state.isGenerating) {
			// Fetching new voicelines. Please wait...
			return "You are annoying me.";
		}

		// If no voicelines are available
		if (voicelines.length === 0) {
			return "I am tired of you.";
		}

		// Select a random voiceline
		const randomIndex = Math.floor(Math.random() * voicelines.length);
		const selectedVoiceline = voicelines[randomIndex];

		// Remove the selected voiceline from the array
		set((state) => ({
			voicelines: {
				...state.voicelines,
				[type]: voicelines.filter((_, index) => index !== randomIndex),
			},
		}));

		return selectedVoiceline;
	},
}));


export default useOverlordStore;