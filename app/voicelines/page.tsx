"use client";

import { Button } from "@/components/ui/button";
import useVoicelinesStore from "@/store/use-overlord-store";
import { useEffect, useRef } from "react";

export default function VoicelinesPage() {

	const hasRun = useRef(false);
	const { voicelines, addVoicelines, generateVoicelines, isGenerating, pickVoiceline } = useVoicelinesStore();
	console.log(voicelines);

	// const handleAddVoicelines = () => {
	// 	addVoicelines("spawn", ["Hello", "World"]);
	// }

	const handlePickVoiceline = async () => {
		const voiceline = await pickVoiceline("spawn");
		const voiceline2 = await pickVoiceline("death");
		console.log(voiceline);
		// console.log(voiceline2);

	}

	// useEffect(() => {
	// 	if (hasRun.current) return;
	// 	hasRun.current = true;

	// 	generateVoicelines();
	// }, []);

	return (
		<div className="relative z-40">
			<h1>Voicelines</h1>
			{isGenerating ? "Generating new voicelines..." : "New voicelines generated!"}
			<Button onClick={handlePickVoiceline}>Pick Voicelines</Button>
		</div>
	);
}