"use client";

import { useApplicationStore } from "@/store/use-application-store";
import { FC } from "react";

interface DebugProps {

}

const Debug: FC<DebugProps> = () => {

	const {
		mainMenuActive,
		gameModeActive,
		customGameLaunchedFrom,
		isLevelGeneratorActive,
		generatedLevelData,
		levelBrowserActive,
		submitDialogActive,
		leaderboardDialogActive,
		menuPauseActive,
		menuDeathActive,
	} = useApplicationStore();

	return (
		<div className="absolute bottom-0 right-0 z-[9999] w-80 p-4 bg-background">
			<h1>Debug</h1>
			<p>Main Menu: {mainMenuActive ? 'true' : 'false'}</p>
			<p>Game Mode: {gameModeActive}</p>
			<p>Launched From: {customGameLaunchedFrom}</p>
			<p>Level Generator: {isLevelGeneratorActive ? 'true' : 'false'}</p>
			<p>Generated Level Data: {generatedLevelData}</p>
			<p>Level Browser: {levelBrowserActive ? 'true' : 'false'}</p>
			<p>Submit Dialog: {submitDialogActive ? 'true' : 'false'}</p>
			<p>Leaderboard Dialog: {leaderboardDialogActive ? 'true' : 'false'}</p>
			<p>Menu Pause: {menuPauseActive ? 'true' : 'false'}</p>
			<p>Menu Death: {menuDeathActive ? 'true' : 'false'}</p>
		</div>
	)
}

export default Debug;