"use client";

import useLevelGenerator from "@/hooks/use-level-generator";
import { useSurvivalModeStore } from "@/store/use-survival-mode-store";
import { FC, useCallback, useEffect, useState } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";

interface SurvivalManagerProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void
}

const SurvivalManager: FC<SurvivalManagerProps> = ({ addEventListener, removeEventListener, sendMessage }) => {

	const { gridData, setGridData } = useSurvivalModeStore();
	const [startNewLevel, setStartNewLevel] = useState(false);
	const { generateLevel } = useLevelGenerator();


	const requestSurvivalLevel = useCallback(() => {
		console.log("🔃 Requesting survival level...");
		setStartNewLevel(true);
	}, []);

	useEffect(() => {
		addEventListener("RequestSurvivalLevel", requestSurvivalLevel);
		return () => removeEventListener("RequestSurvivalLevel", requestSurvivalLevel);
	}, [addEventListener, removeEventListener, requestSurvivalLevel]);


	const handleStartNewRound = () => {
		// const level = "[[0,0,0,0,2,1,4,1,0,0,0,0,2,1,0,0,0,2,0,0],[0,2,3,1,0,0,0,5,1,2,0,3,1,4,1,2,0,1,0,0],[0,8,7,2,0,2,0,0,0,1,0,1,0,0,0,1,4,2,0,0],[0,1,0,1,4,1,2,0,0,5,1,2,0,2,3,1,0,6,1,0],[1,1,0,2,0,0,6,1,2,1,0,0,0,1,0,4,1,0,2,1],[0,2,0,1,3,0,0,0,0,4,1,3,0,5,0,0,2,0,0,0],[0,1,4,2,1,2,0,2,0,0,0,1,2,1,6,1,0,0,0,0],[0,3,0,0,0,5,1,1,2,0,0,0,0,0,2,5,1,1,0,0],[0,2,0,0,0,1,0,0,6,1,2,0,0,0,1,0,0,2,0,0]]";
		sendMessage("GameManager", "StartNewRound", `{grid: ${gridData}}`);
	}

	const handleGenerateNewLevel = async () => {
		// PreGenerate a new AI level
		const generatedLevel = await generateLevel();
		if (generatedLevel) setGridData(generatedLevel);
	}


	useEffect(() => {
		if (startNewLevel) {
			handleStartNewRound();
			setStartNewLevel(false);
			handleGenerateNewLevel();
		}
	}, [startNewLevel]);



	return (
		<>

		</>
	)
}

export default SurvivalManager;