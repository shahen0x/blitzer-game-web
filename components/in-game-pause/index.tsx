"use client";

import { useApplicationStore } from "@/store/use-application-store";
import { FC, useCallback, useEffect } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import Dialog from "../ui/dialog";
import { Button } from "../ui/button";

interface InGamePauseProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void;
}

const InGamePause: FC<InGamePauseProps> = ({
	addEventListener,
	removeEventListener,
	sendMessage
}) => {

	const { inGamePauseActive, setInGamePauseActive } = useApplicationStore();


	const handleSetPauseMenu = useCallback((sfxMute: any, musicMute: any) => {
		setInGamePauseActive(true);
		console.log(sfxMute, musicMute);

	}, []);

	useEffect(() => {
		addEventListener("ActivatePauseMenu", handleSetPauseMenu);
		return () => removeEventListener("ActivatePauseMenu", handleSetPauseMenu);
	}, [addEventListener, removeEventListener, handleSetPauseMenu]);



	const handleUnpauseMenu = useCallback(() => {
		setInGamePauseActive(false);
	}, []);

	useEffect(() => {
		addEventListener("DeactivatePauseMenu", handleUnpauseMenu);
		return () => removeEventListener("DeactivatePauseMenu", handleUnpauseMenu);
	}, [addEventListener, removeEventListener, handleUnpauseMenu]);


	function handleCloseMenu() {
		setInGamePauseActive(false);
		sendMessage("UICanvas", "TogglePauseGame")
	}

	function handleRestartLevel() {
		setInGamePauseActive(false);
		sendMessage("UICanvas", "RestartLevel")
	}


	function handleExit() {
		setInGamePauseActive(false);
		sendMessage("UICanvas", "ExitToMainMenu");
	}

	// function handleResumeGame() {
	// 	setInGamePauseActive(false);
	// 	sendMessage("UICanvas", "TogglePauseGame")
	// }



	// useEffect(() => {
	// 	if (inGamePauseActive === true) {
	// 		const handleKeyPress = (event: KeyboardEvent) => {
	// 			if (event.key.toLowerCase() === 'p') {
	// 				closePauseMenu();
	// 			}
	// 		};
	// 		window.addEventListener('keydown', handleKeyPress);
	// 		return () => window.removeEventListener('keydown', handleKeyPress);
	// 	}

	// }, [inGamePauseActive]);


	return (
		<Dialog
			open={inGamePauseActive}
			onOpenChange={() => { }}
			className="overflow-hidden max-w-xs h-64"
		>
			<div className="relative z-10">

				<h2 className="mb-6 text-3xl font-orbitron text-center tracking-wide">Paused</h2>

				<div className="space-y-3 outline-none">
					<Button onClick={handleCloseMenu} variant={"secondary"} className="w-full shadow-none" tabIndex={-1}>Resume</Button>
					<Button onClick={handleRestartLevel} variant={"secondary"} className="w-full" tabIndex={-1}>Restart</Button>
					<Button onClick={handleExit} variant={"secondary"} className="w-full" tabIndex={-1}>Exit to Main Menu</Button>
				</div>



				{/* test

				<button onClick={closePauseMenu}>Close</button> */}

			</div>
		</Dialog>
	);
}

export default InGamePause;