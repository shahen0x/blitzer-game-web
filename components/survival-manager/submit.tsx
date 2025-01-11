"use client";

import { FC, useCallback, useEffect, useState } from "react";
import Dialog from "../ui/dialog";
import { useSurvivalModeStore } from "@/store/use-survival-mode-store";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import useOverlordStore from "@/store/use-overlord-store";
import { Button } from "../ui/button";

interface SurvivalSubmitToLeaderboardProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void;
}

const SurvivalSubmitToLeaderboard: FC<SurvivalSubmitToLeaderboardProps> = ({ addEventListener, removeEventListener, sendMessage }) => {

	const { submitDialogActive, setSubmitDialogActive } = useSurvivalModeStore();
	const { stopOverlordAudio, setAudioStopped } = useOverlordStore();
	const [submissionData, setSubmissionData] = useState({
		time: 0,
		round: 1
	});


	const handleSubmitEvent = useCallback((time: any, round: any) => {
		setSubmitDialogActive(true);
		setSubmissionData({ time, round });
	}, []);

	useEffect(() => {
		addEventListener("SubmitSurvivalData", handleSubmitEvent);
		return () => removeEventListener("SubmitSurvivalData", handleSubmitEvent);
	}, [addEventListener, removeEventListener, handleSubmitEvent]);

	console.log(submissionData)


	function handleExitGame() {
		stopOverlordAudio();
		setAudioStopped(true);
		setSubmitDialogActive(false);
		sendMessage("UICanvas", "ExitToMainMenu");
	}

	return submitDialogActive ? (
		<Dialog
			open={submitDialogActive}
			onOpenChange={() => { }}
			className="overflow-hidden max-w-xs"
		>
			<div className="relative z-10 flex flex-col items-center justify-center">

				<div className="mb-6 text-center">
					<h2 className="text-3xl font-orbitron font-medium tracking-wide text-rose-500">You Died.</h2>
				</div>

				<div className="space-y-3 outline-none">
					<Button onClick={handleExitGame} variant={"secondary"} className="w-full" tabIndex={-1}>Exit to Main Menu</Button>
				</div>
			</div>
		</Dialog>
	) : null;
}

export default SurvivalSubmitToLeaderboard;