/**
 * MAIN MENU
 * The main menu is an overlay that is only displayed when the "ActivateMainMenu" event is sent by the game.
 * Includes: a list of buttons to start different game modes or other features.
 * 
 */

"use client";

import { FC, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useApplicationStore } from "@/store/use-application-store";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import MainMenuBtn from "./main-menu-btn";
import { MainMenuSectionPrimary, MainMenuSectionSecondary, MainMenuSection } from "./main-menu-section";
import { Button } from "../ui/button";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useSurvivalModeStore } from "@/store/use-survival-mode-store";
import useLevelGenerator from "@/hooks/use-level-generator";
import AIRecording from "../ai-recording";



interface MainMenuProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void
}


// Helper function to check tutorial completion
const isTutorialCompleted = (): boolean => {
	return localStorage.getItem('tutorialCompleted') === "true";
};


const MainMenu: FC<MainMenuProps> = ({
	addEventListener,
	removeEventListener,
	sendMessage
}) => {

	// Hooks
	const router = useRouter();

	// Global States
	const {
		mainMenuActive,
		setMainMenuActive,
		setGameModeActive,
		setIsLevelGeneratorActive,
		setLevelBrowserActive,
		setLeaderboardDialogActive,
		setCreditsDialogActive
	} = useApplicationStore();

	const { gridData, setGridData } = useSurvivalModeStore();
	const { generateLevel } = useLevelGenerator();


	// Force first time players to play the tutorial
	const [showTutorial, setShowTutorial] = useState(false);

	useEffect(() => {
		setShowTutorial(!isTutorialCompleted());
	}, []);


	// Listens for the "ActivateMainMenu" event and sets the main menu active
	const handleSetMainMain = useCallback(() => {
		setMainMenuActive(true);
		setGameModeActive('none');
		setShowTutorial(!isTutorialCompleted());
	}, []);

	useEffect(() => {
		addEventListener("ActivateMainMenu", handleSetMainMain);
		return () => removeEventListener("ActivateMainMenu", handleSetMainMain);
	}, [addEventListener, removeEventListener, handleSetMainMain]);


	// If the main menu is not active, don't render anything
	if (!mainMenuActive) return null;


	// Start game modes
	function handleStartNormalMode() {
		setMainMenuActive(false);
		setGameModeActive('normal');
		sendMessage("MainMenuManager", "StartNormalMode");
	}

	function handleStartTutorial() {
		setMainMenuActive(false);
		setGameModeActive('tutorial');
		sendMessage("MainMenuManager", "StartTutorial");
		localStorage.setItem('tutorialCompleted', 'true');
	}

	const handleStartBossFightMode = () => {
		setMainMenuActive(false);
		setGameModeActive('bossFight');
		sendMessage("MainMenuManager", "StartBossFight");
	}

	const handleStartSurvivalMode = async () => {
		setMainMenuActive(false);
		setGameModeActive('survival');
		sendMessage("MainMenuManager", "StartSurvivalMode", `{grid: ${gridData}}`);

		// PreGenerate a new AI level
		const generatedLevel = await generateLevel();
		if (generatedLevel) setGridData(generatedLevel);
	}


	const handleStartFootageScene = () => {
		setMainMenuActive(false);
		setGameModeActive('bossFight');
		sendMessage("MainMenuManager", "StartFootageScene");
	}


	const handleSignOut = async () => {
		await signOut();
		window.location.reload();
	}


	return (
		<div className="fixed top-0 left-0 z-40 w-2/4 h-full flex justify-center items-center">

			<div className="relative z-30 flex flex-col justify-center items-center space-y-8">
				<AIRecording />
			</div>
		</div>
	)
}

export default MainMenu;