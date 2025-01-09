"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useEvilAiStore } from "@/store/use-evil-ai-store";

import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import useRandomVoiceline from "../../hooks/use-random-voiceline";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import useAiVoiceline from "@/hooks/use-ai-voiceline";
import { useApplicationStore } from "@/store/use-application-store";
import Image from "next/image";
import { BorderBeam } from "../ui/border-beam";
import useOverlordStore from "@/store/use-overlord-store";


interface OverlordDialogProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void;
}

const OverlordDialog: FC<OverlordDialogProps> = ({ addEventListener, removeEventListener, sendMessage }) => {

	const hasRun = useRef(false);
	const { menuDeathActive } = useApplicationStore();
	const { overlordDialogActive, setOverlordDialogActive, voicelineType, setVoicelineType } = useOverlordStore();


	/**
	 * Overlord Voiceline Event
	 */
	const handleEventTriggered = useCallback((type: any) => {
		setVoicelineType(type);
		setOverlordDialogActive(true);
		setTimeout(() => {
			setOverlordDialogActive(false);
		}, 3000);

	}, []);

	useEffect(() => {
		addEventListener("PlayVoiceline", handleEventTriggered);
		return () => removeEventListener("PlayVoiceline", handleEventTriggered);
	}, [addEventListener, removeEventListener, handleEventTriggered]);


	return overlordDialogActive ? (
		<div className={`
			absolute max-w-96 flex items-center gap-4 cursor-default select-none
			${menuDeathActive && voicelineType === "death" ? "z-[100]" : "z-40"}
			${menuDeathActive && voicelineType === "death" ? "left-1/2 -translate-x-1/2 top-52" : "left-10 bottom-64"}
		`}>

			<figure className="shrink-0 overflow-hidden w-20 h-20 rounded-xl bg-white/50 border-2 border-red-600 shadow-md">
				<Image src="/overlord.jpg" width={200} height={200} priority quality={100} alt="AI Overlord" className="w-auto h-auto" onDragStart={(e) => e.preventDefault()} />
			</figure>

			<div className="w-full backdrop-blur-sm bg-black/60 rounded-xl px-4 py-2 font-orbitron">
				<BorderBeam size={100} colorFrom="#dc2626" colorTo="#f87171" borderWidth={2} duration={5} />
				My perfect creation will tear you apart, piece by piece.
			</div>

		</div>
	) : null;
}

export default OverlordDialog;