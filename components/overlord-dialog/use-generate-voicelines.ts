import { Schema } from "@/amplify/data/resource";
import useOverlordStore from "@/store/use-overlord-store";
import { generateClient } from "aws-amplify/api";
import { useEffect, useRef } from "react";

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


interface Voicelines {
	spawn: string[];
	death: string[];
	beforeBossFight: string[];
	afterBossFight: string[];
}

const useGenerateVoicelines = () => {

	const hasRun = useRef(false);
	const { setVoicelinesSpawn, setVoicelinesDeath, setVoicelinesBeforeBossFight, setVoicelinesAfterBossFight } = useOverlordStore();

	const handleGenerateVoicelines = async () => {
		console.log("⚙️ Generating AI Overlord's voicelines.");
		const { data } = await client.generations.GenerateAiVoiceline({ instructions: voicelineInstructions });

		if (data) {
			const parsedData: Voicelines = JSON.parse(data);
			setVoicelinesSpawn(parsedData.spawn);
			setVoicelinesDeath(parsedData.death);
			setVoicelinesBeforeBossFight(parsedData.beforeBossFight);
			setVoicelinesAfterBossFight(parsedData.afterBossFight);
			console.log("✅ AI Overlord's voicelines generated!");
		}
	}

	useEffect(() => {
		if (hasRun.current) return;
		hasRun.current = true;

		handleGenerateVoicelines();
	}, []);
}

export default useGenerateVoicelines;