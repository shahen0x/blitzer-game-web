"use client";

import { Schema } from "@/amplify/data/resource";
import { useEvilAiStore } from "@/store/use-evil-ai-store";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";



const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIGeneration } = createAIHooks(client);

interface Voicelines {
	spawn: string[];
	death: string[];
	beforeBossfight: string[];
	afterBossfight: string[];
}

export default function Page() {
	// const [{ data, isLoading, hasError, messages }, generateAiVoiceline] = useAIGeneration("GenerateAiVoiceline");
	const [voicelines, setVoicelines] = useState<String[] | null>(null);
	const [currentVoiceline, setCurrentVoiceline] = useState<String | null>(null);
	const [lastIndex, setLastIndex] = useState<number | null>(null);


	// const { voicelinesSpawn, setVoicelinesSpawn } = useEvilAiStore();

	const handleGenerate = async () => {
		const { data, errors } = await client.generations.GenerateAiVoiceline({
			instructions: `
				Generate voicelines for the AI overlord taunting the player.
				Format: JSON with 4 arrays:
				'spawn': When Spark enters a new level
				'death': When Spark dies
				'beforeBossFight': Before Terminator battles
				'afterBossFight': After the player beats the boss

				Tone: Dark, threatening, discourage the player's hope of survival.
				Do not forget that spark is a little robot.
				Mention the player's name (a few times only).
				Keep the voicelines short and simple.
				Important: For each array, generate 8 voicelines.
			` });
		if (data) {
			const parsedData = JSON.parse(data);
			console.log("data:", parsedData);

		}
		console.log("errors:", errors);
		// generateAiVoiceline({
		// 	instructions: "generate",
		// });
	};

	// console.log(hasError)


	// useEffect(() => {
	// if (data) {
	// Parse the string data into an object
	// const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
	// setVoicelinesSpawn(parsedData.spawn || []);
	// console.log(data)


	// try {
	// 	const parsedData = JSON.parse(data);
	// 	if (Array.isArray(parsedData)) {
	// 		// Only set if it's a valid array
	// 		setVoicelines(parsedData);
	// 	} else {
	// 		console.error("Data is not an array:", parsedData);
	// 	}
	// } catch (error) {
	// 	console.error("Failed to parse data:", error);
	// }
	// }
	// }, [data]);

	// const selectRandomVoiceline = () => {
	// 	if (voicelines && voicelines.length > 0) {
	// 		let randomIndex;

	// 		// Ensure we get a new index different from the last
	// 		do {
	// 			randomIndex = Math.floor(Math.random() * voicelines.length);
	// 		} while (randomIndex === lastIndex);

	// 		setCurrentVoiceline(voicelines[randomIndex]);
	// 		// Update the last used index
	// 		setLastIndex(randomIndex);
	// 	}
	// };

	// const generateAudio = async (text: String) => {
	// 	try {
	// 		const response = await fetch('/api/ai', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify({ text }),
	// 		});

	// 		if (!response.ok) {
	// 			throw new Error('Failed to generate speech');
	// 		}

	// 		const audioBlob = await response.blob();
	// 		const audioUrl = URL.createObjectURL(audioBlob);
	// 		const audio = new Audio(audioUrl);

	// 		// Wait for audio to be loaded before playing
	// 		await new Promise((resolve, reject) => {
	// 			audio.preload = 'auto';  // Ensure audio is preloaded

	// 			// Handle successful loading
	// 			audio.oncanplaythrough = () => {
	// 				audio.play()
	// 					.then(resolve)
	// 					.catch(reject);
	// 			};

	// 			// Handle loading error
	// 			audio.onerror = (error) => {
	// 				reject(error);
	// 			};

	// 			// Clean up the URL object when done
	// 			audio.onended = () => {
	// 				URL.revokeObjectURL(audioUrl);
	// 			};

	// 			// Start loading the audio
	// 			audio.load();
	// 		});
	// 	} catch (error) {
	// 		console.error('Error:', error);
	// 	}
	// };


	// useEffect(() => {
	// 	if (voicelines) {
	// 		selectRandomVoiceline();
	// 	}
	// }, [voicelines]);


	// useEffect(() => {
	// 	if (currentVoiceline) {
	// 		generateAudio(currentVoiceline)
	// 	}
	// }, [currentVoiceline]);

	return (
		<div className="relative z-50">
			<button onClick={handleGenerate}>Generate</button>
			{/* {isLoading && <p>Loading...</p>}
			{hasError && messages && <p>Error: {messages[0].message}</p>} */}

			<br /><br />
			{/* <button onClick={selectRandomVoiceline}>Get Random Voiceline</button>
			{currentVoiceline && <p>Current Voiceline: {currentVoiceline}</p>} */}

			<br /><br />
			{voicelines && (
				<ul>
					{voicelines.map((voiceline, index) => (
						<li key={index}>{voiceline}</li>
					))}
				</ul>
			)}
		</div>
	)
}