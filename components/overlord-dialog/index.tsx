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
	isTriggered: boolean;
	setIsTriggered: (isTriggered: boolean) => void;
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void;
}

const OverlordDialog: FC<OverlordDialogProps> = ({ type, isTriggered, setIsTriggered, sendMessage }) => {

	const [voiceLine, setVoiceLine] = useState<string | null>(null);
	const [playVoiceline, setPlayVoiceline] = useState<boolean>(false);
	const { menuDeathActive } = useApplicationStore();
	const { pickVoiceline, audio, setAudio } = useOverlordStore();
	const { generateAudio } = useGenerateAudio();

	useEffect(() => {
		if (!isTriggered) return;
		handleVoicelines();
	}, [isTriggered]);


	const handleVoicelines = () => {
		const voiceline = pickVoiceline(type);
		if (!voiceline) return;
		setVoiceLine(voiceline);
		generateAudio(voiceline, handleCanPlaythrough, handleAudioEnd);
	}

	const handleCanPlaythrough = () => {
		setPlayVoiceline(true);
	}

	const handleAudioEnd = () => {
		setIsTriggered(false);
		setPlayVoiceline(false);
		setVoiceLine(null);
	};


	useEffect(() => {
		if (playVoiceline) {
			sendMessage("AudioManager", "SetVolume", 0.1);
		} else {
			sendMessage("AudioManager", "SetVolume", 1);
		}
	}, [playVoiceline]);


	useEffect(() => {
		if (!audio) {
			setIsTriggered(false);
			setPlayVoiceline(false);
			setVoiceLine(null);
		}
	}, [audio]);


	return playVoiceline ? (
		<div className={`
			absolute max-w-96 flex items-center gap-4 cursor-default select-none
			${menuDeathActive ? "z-[100]" : "z-40"}
			${menuDeathActive ? "left-1/2 -translate-x-1/2 top-52" : "left-10 bottom-64"}
			`}>

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