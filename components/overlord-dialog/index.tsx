"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useEvilAiStore } from "@/store/use-evil-ai-store";
import useOverlordStore, { voicelineType } from "@/store/use-overlord-store";



import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import useRandomVoiceline from "../../hooks/use-random-voiceline";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import useAiVoiceline from "@/hooks/use-ai-voiceline";
import { useApplicationStore } from "@/store/use-application-store";
import Image from "next/image";
import { BorderBeam } from "../ui/border-beam";
import usePickVoicelines from "./use-pick-voicelines";
import useGenerateVoicelines from "./use-generate-voicelines";
import useGenerateAudio from "./use-generate-audio";


interface OverlordDialogProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void;
}

const OverlordDialog: FC<OverlordDialogProps> = ({ addEventListener, removeEventListener, sendMessage }) => {

	const { menuDeathActive } = useApplicationStore();
	const { overlordDialogActive, setOverlordDialogActive, voicelineType, setVoicelineType, activeVoiceline, setActiveVoiceline, voicelinesSpawn, voicelinesDeath, voicelinesBeforeBossFight, voicelinesAfterBossFight, setVoicelinesSpawn, setVoicelinesDeath, setVoicelinesBeforeBossFight, setVoicelinesAfterBossFight } = useOverlordStore();
	useGenerateVoicelines();
	const { pickVoiceline } = usePickVoicelines();
	const { generateAudio } = useGenerateAudio();


	/**
	 * Overlord Voiceline Event
	 */
	const voicelineEvents = useCallback((voicelineType: any) => {
		handleVoicelines(voicelineType);
	}, []);

	useEffect(() => {
		addEventListener("PlayVoiceline", voicelineEvents);
		return () => removeEventListener("PlayVoiceline", voicelineEvents);
	}, [addEventListener, removeEventListener, voicelineEvents]);


	/**
	 * Handle Voicelines
	 */
	const handleVoicelines = async (voicelineType: voicelineType) => {
		setVoicelineType(voicelineType);
		const voiceline = await pickVoiceline();
		generateAudio(voiceline, handleCanPlaythrough, handleAudioEnd);

	}

	const handleCanPlaythrough = () => {

		setOverlordDialogActive(true);
	}


	const handleAudioEnd = () => {
		setOverlordDialogActive(false);
		setActiveVoiceline(null);
		setVoicelineType("none");
		// setTimeout(() => {
		// }, 2000);
	};


	useEffect(() => {
		if (overlordDialogActive) {
			sendMessage("AudioManager", "SetVolume", 0.1);
		} else {
			sendMessage("AudioManager", "SetVolume", 1);
		}
	}, [overlordDialogActive]);




























	return overlordDialogActive ? (
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
				{activeVoiceline || "I am the Overlord!"}
				{/* <button onClick={pause}>Pause</button> */}
			</div>

		</div>
	) : null;
}

export default OverlordDialog;