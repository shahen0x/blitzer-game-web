"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useEvilAiStore } from "@/store/use-evil-ai-store";

import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import useRandomVoiceline from "../../hooks/use-random-voiceline";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import useAiVoiceline from "@/hooks/use-ai-voiceline";
import { useApplicationStore } from "@/store/use-application-store";

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
	beforeBossfight: string[];
	afterBossfight: string[];
}

interface EvilAiVoicelinesProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void;
}

const EvilAiVoicelines: FC<EvilAiVoicelinesProps> = ({
	addEventListener,
	removeEventListener,
	sendMessage
}) => {


	const hasRun = useRef(false);
	const { menuPauseActive } = useApplicationStore();
	const {
		evilAiPanelActive,
		setEvilAiPanelActive,
		voicelinesSpawn,
		setVoicelinesSpawn,
		voicelinesDeath,
		setVoicelinesDeath,
		voicelinesBeforeBossFight,
		setVoicelinesBeforeBossFight,
		voicelinesAfterBossFight,
		setVoicelinesAfterBossFight
	} = useEvilAiStore();

	const { getRandomVoiceline, currentVoiceline } = useRandomVoiceline();
	const { generateAudio, stopAudio } = useAiVoiceline({ sendMessage });

	const handleGenerateVoicelines = async () => {
		const { data } = await client.generations.GenerateAiVoiceline({ instructions: voicelineInstructions });

		if (data) {
			const parsedData: Voicelines = JSON.parse(data);
			setVoicelinesSpawn(parsedData.spawn);
			setVoicelinesDeath(parsedData.death);
			setVoicelinesBeforeBossFight(parsedData.beforeBossfight);
			setVoicelinesAfterBossFight(parsedData.afterBossfight);
			console.log("✅ AI Overlord's voicelines generated!");
			console.log(parsedData);
		}

	}


	// Start generating ai voicelines on load
	useEffect(() => {
		// Ensure ai generation runs only once
		if (hasRun.current) return;
		hasRun.current = true;

		handleGenerateVoicelines();
		console.log("⚙️ Generating AI Overlord's voicelines.");
	}, []);


	const handleEventTriggered = useCallback((type: any) => {
		console.log("🔊 Activating voiceline.");
		getRandomVoiceline(type);
	}, [voicelinesAfterBossFight]);

	useEffect(() => {
		addEventListener("PlayVoiceline", handleEventTriggered);
		return () => removeEventListener("PlayVoiceline", handleEventTriggered);
	}, [addEventListener, removeEventListener, handleEventTriggered]);




	useEffect(() => {
		const handleVoiceline = async () => {
			if (!currentVoiceline) return;
			await generateAudio(currentVoiceline);
			setEvilAiPanelActive(true);
			sendMessage("AudioManager", "SetVolume", 0.1);
		}

		handleVoiceline();

	}, [currentVoiceline]);









	return evilAiPanelActive ? (
		<div className="absolute z-50 top-0 right-0 w-40 h-40 bg-white/10 rounded-xl">
			{currentVoiceline}

		</div>
	) : null;
}

export default EvilAiVoicelines;