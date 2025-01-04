/**
 * MAIN MENU
 * The main menu is an overlay that is only displayed when the "ActivateMainMenu" event is sent by the game.
 * Includes: a list of buttons to start different game modes or other features.
 * 
 */

"use client";

import { FC, useCallback, useEffect } from "react";
import Image from "next/image";
import { useApplicationStore } from "@/store/use-application-store";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { StarsBackground } from "../background/stars";
import { Meteors } from "../background/meteors";
import MainMenuBtn from "./main-menu-btn";
import NavigableMenu, { MenuItem } from "../ui/navigable-menu";
import { MoveRight } from "lucide-react";
import { MainMenuSectionPrimary, MainMenuSectionSecondary, MainMenuSection } from "./main-menu-section";

interface MainMenuProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void
}


const MainMenu: FC<MainMenuProps> = ({
	addEventListener,
	removeEventListener,
	sendMessage
}) => {


	// Access global states
	const {
		mainMenuActive,
		setMainMenuActive,
		setGameModeActive,
		setCustomGameLaunchedFrom,
		setGeneratedLevelData,
		setIsLevelGeneratorActive,
		setLevelBrowserActive,
		setLeaderboardDialogActive
	} = useApplicationStore();


	// Listens for the "ActivateMainMenu" event and sets the main menu active
	const handleSetMainMain = useCallback(() => {
		setMainMenuActive(true);
		setGameModeActive('none');
		setCustomGameLaunchedFrom('none');
		setGeneratedLevelData(undefined);
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
	}

	const handleStartBossFightMode = () => {
		setMainMenuActive(false);
		setGameModeActive('bossFight');
		sendMessage("MainMenuManager", "StartBossFight");
	}


	return (
		<div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#4F2C7D] via-[#200643] to-[#05001c]">

			{/* <StarsBackground className="absolute z-20" /> */}
			<div className="absolute top-0 right-0 z-20 w-full h-full -scale-x-100">
				<Meteors number={20} />
			</div>

			{/* <div className="absolute top-0 left-0 z-20 opacity-50 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#4F2C7D] via-[#200643] to-[#05001c]" /> */}

			<Image
				src="/bg.jpg"
				width={2560}
				height={1080}
				quality={100}
				priority
				alt="logo"
				className="absolute z-10 top-0 left-0 object-cover object-bottom w-full h-full"
			/>
			{/* <Image src="/logo.png" alt="logo" width={720} height={215} className="relative z-50 w-2/3 h-auto max-w-xl " priority /> */}

			<div className="absolute top-0 left-20 w-1/4 h-full bg-background/90 z-30 px-6 flex flex-col justify-center items-center space-y-8">
				<Image src="/logo.png" alt="logo" width={720} height={215} className="w-2/3 h-auto max-w-xl relative z-50" priority />

				<MainMenuSection title="Normal Mode">
					<MainMenuSectionPrimary>
						<MainMenuBtn onClick={handleStartNormalMode} title="Play Demo" />
					</MainMenuSectionPrimary>

					<MainMenuSectionSecondary>
						<MainMenuBtn onClick={handleStartTutorial} title="Tutorial" />
						<MainMenuBtn onClick={handleStartBossFightMode} title="Boss Fight" />
					</MainMenuSectionSecondary>
				</MainMenuSection>


				<MainMenuSection title="AI Generated Levels">
					<MainMenuSectionPrimary>
						<MainMenuBtn onClick={() => setIsLevelGeneratorActive(true)} title="Generate & Play" />
						<MainMenuBtn onClick={() => setLevelBrowserActive(true)} title="Level Browser" />
					</MainMenuSectionPrimary>
				</MainMenuSection>


				<MainMenuSection title="Other">
					<MainMenuSectionPrimary>
						<MainMenuBtn onClick={() => setLeaderboardDialogActive(true)} title="Leaderboards" />
					</MainMenuSectionPrimary>

					<MainMenuSectionSecondary>
						<MainMenuBtn onClick={handleStartTutorial} title="Credits" />
						<MainMenuBtn onClick={handleStartBossFightMode} title="Sign Out" />
					</MainMenuSectionSecondary>
				</MainMenuSection>

			</div>
		</div>
	)
}

export default MainMenu;