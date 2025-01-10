"use client";

import { FC, use, useCallback, useEffect, useRef, useState } from "react";



import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";

import { useApplicationStore } from "@/store/use-application-store";
import Image from "next/image";
import { BorderBeam } from "../ui/border-beam";
import usePickVoicelines from "./use-pick-voicelines";
import useGenerateVoicelines from "./use-generate-voicelines";
import useGenerateAudio from "./use-generate-audio";
import useOverlordStore, { VoicelineType } from "@/store/use-overlord-store";


interface OverlordDialogProps {
	type: VoicelineType;
	isActive: boolean;
	setIsActive: (isActive: boolean) => void;
}

const OverlordDialog: FC<OverlordDialogProps> = ({ type, isActive, setIsActive }) => {

	const { pickVoiceline } = useOverlordStore();
	const [voiceLine, setVoiceLine] = useState<string | null>(null);

	useEffect(() => {
		if (isActive) {
			const voiceline = pickVoiceline(type);
			setVoiceLine(voiceline);
			console.log("✅✅✅✅✅ voiceline:", voiceline);
			setTimeout(() => {
				setIsActive(false);
			}, 3000);
		}

	}, [isActive]);




	return isActive ? (
		<div className={`
			absolute max-w-96 flex items-center gap-4 cursor-default select-none z-40 left-10 bottom-64
			`}>
			{/* ${menuDeathActive ? "z-[100]" : "z-40"}
			${menuDeathActive ? "left-1/2 -translate-x-1/2 top-52" : "left-10 bottom-64"} */}

			<figure className="shrink-0 overflow-hidden w-20 h-20 rounded-xl bg-white/50 border-2 border-red-600 shadow-md">
				<Image src="/overlord.jpg" width={200} height={200} priority quality={100} alt="AI Overlord" className="w-auto h-auto" onDragStart={(e) => e.preventDefault()} />
			</figure>

			<div className="w-full backdrop-blur-sm bg-black/60 rounded-xl px-4 py-2 font-orbitron">
				<BorderBeam size={100} colorFrom="#dc2626" colorTo="#f87171" borderWidth={2} duration={5} />
				{voiceLine || "I am the Overlord!"}
				{/* <button onClick={pause}>Pause</button> */}
			</div>

		</div>
	) : null;
}

export default OverlordDialog;