"use client";

import { FC, useCallback, useEffect } from "react";
import Dialog from "../ui/dialog";
import { useApplicationStore } from "@/store/use-application-store";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { Button } from "../ui/button";

interface MenuDeathProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void;
}

const MenuDeath: FC<MenuDeathProps> = ({
	addEventListener,
	removeEventListener,
	sendMessage
}) => {

	const { menuDeathActive, setMenuDeathActive } = useApplicationStore();


	const handleSetDeathMenu = useCallback(() => {
		setMenuDeathActive(true);
	}, []);

	useEffect(() => {
		addEventListener("ActivateDeathMenu", handleSetDeathMenu);
		return () => removeEventListener("ActivateDeathMenu", handleSetDeathMenu);
	}, [addEventListener, removeEventListener, handleSetDeathMenu]);


	function handleRestartGame() {
		setMenuDeathActive(false);
		sendMessage("UICanvas", "RestartLevel")
	}

	function handleExitGame() {
		setMenuDeathActive(false);
		sendMessage("UICanvas", "ExitToMainMenu");
	}

	return (
		<Dialog
			open={menuDeathActive}
			onOpenChange={() => { }}
			className="overflow-hidden max-w-xs"
		>
			<div className="relative z-10 flex flex-col items-center justify-center">

				<div className="mb-6 text-center">
					<h2 className="text-3xl font-orbitron font-medium tracking-wide text-rose-500">You Died.</h2>
				</div>

				<div className="space-y-3 outline-none">
					<Button onClick={handleRestartGame} variant={"secondary"} className="w-full" tabIndex={-1}>Restart</Button>
					<Button onClick={handleExitGame} variant={"secondary"} className="w-full" tabIndex={-1}>Exit to Main Menu</Button>
				</div>
			</div>
		</Dialog>
	)
}

export default MenuDeath;