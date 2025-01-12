"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import useGenerateAudio from "@/hooks/use-generate-audio";
import useOverlordStore from "@/store/use-overlord-store";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function OverlordPage() {

	const { pickVoiceline, audio, setAudio, audioStopped, setAudioStopped } = useOverlordStore();
	const { generateAudio } = useGenerateAudio();

	const [voiceLine, setVoiceLine] = useState<string | null>(null);

	const handleKeyPress = (event: KeyboardEvent): void => {
		if (event.key === 'p' || event.key === 'P') {
			const voiceline = pickVoiceline("spawn");
			if (!voiceline) return;
			setVoiceLine(voiceline);
			generateAudio(voiceline);
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, []);

	return (
		<div className="fixed top-0 left-0 w-screen h-screen bg-green-400 flex items-center justify-center">
			<div className={`
			relative top-28 max-w-96 flex items-center gap-4 cursor-default select-none scale-150 `}>

				<figure className="shrink-0 overflow-hidden w-20 h-20 rounded-xl bg-white/50 border-2 border-red-600 shadow-md">
					<Image src="/overlord.jpg" width={200} height={200} priority quality={100} alt="AI Overlord" className="w-auto h-auto" onDragStart={(e) => e.preventDefault()} />
				</figure>

				<div className="w-full backdrop-blur-sm bg-black/60 rounded-xl px-4 py-2 font-orbitron">
					<BorderBeam size={100} colorFrom="#dc2626" colorTo="#f87171" borderWidth={2} duration={5} />
					{voiceLine}
					{/* I am the overlord, and I will not be stopped by your greed. */}
				</div>

			</div>
		</div>
	)

}