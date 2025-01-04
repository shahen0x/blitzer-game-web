/**
 * SUBMIT TO LEADERBOARD
 * This component is used to submit the player's time to the leaderboard.
 */

"use client";

import { FC, useCallback, useEffect, useState } from "react";
import Dialog from "../ui/dialog";
import { useApplicationStore } from "@/store/use-application-store";
import Ripple from "../ui/ripple";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { client } from "../amplify/amplify-client-config";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "../ui/button";



interface SubmitToLeaderboardProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void;
}

const SubmitToLeaderboard: FC<SubmitToLeaderboardProps> = ({
	addEventListener,
	removeEventListener,
	sendMessage
}) => {

	const {
		submitDialogActive,
		setSubmitDialogActive,
		gameModeActive
	} = useApplicationStore();

	const { user } = useAuthenticator();
	const [username, setUsername] = useState<string | undefined>(undefined);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionSuccess, setSubmissionSuccess] = useState(false);
	const [submissionError, setSubmissionError] = useState(false);


	useEffect(() => {
		fetchUserAttributes().then((user) => {
			setUsername(user.preferred_username);
		}).catch((error) => {
			console.log(error);
		});
	}, [submitDialogActive]);



	const submitToDB = async (time: any) => {

		if (!username) return console.log("Username not found when submitting to leaderboard.");

		const { data, errors } = await client.models.Leaderboard.create({
			userId: user.userId,
			username: username,
			mode: gameModeActive === "none" ? null : (gameModeActive as "normal" | "bossFight"),
			time: time,
		});

		if (errors) {
			setSubmissionError(true);
			setIsSubmitting(false);
			return;
		}

		if (data) {
			setSubmissionSuccess(true);
			setIsSubmitting(false);
			return;
		}
	}

	const handleSubmitScore = useCallback((time: any) => {
		setSubmitDialogActive(true);
		if (gameModeActive === "custom") return;
		setIsSubmitting(true);
		submitToDB(time);
	}, [gameModeActive, username]);

	useEffect(() => {
		addEventListener("SubmitTime", handleSubmitScore);
		return () => removeEventListener("SubmitTime", handleSubmitScore);
	}, [addEventListener, removeEventListener, handleSubmitScore]);


	function handleExitGame() {
		setSubmitDialogActive(false);
		sendMessage("UICanvas", "ExitToMainMenu");
	}


	return (
		<Dialog
			open={submitDialogActive}
			onOpenChange={() => { }}
			className="overflow-hidden h-[26rem] p-0"
		>
			<div className="relative z-50 flex flex-col items-center justify-center">

				{gameModeActive !== "custom" && isSubmitting && <Ripple />}

				<div className="text-center space-y-4">
					<h3 className="font-orbitron text-2xl text-center">
						{gameModeActive === "custom" && <>You completed the level.</>}
						{gameModeActive !== "custom" &&
							<>
								{isSubmitting && <>Submitting to <br /> Leaderboard</>}
								{submissionSuccess && <>Submission Successful!</>}
								{submissionError && <>Submission Error!</>}
							</>
						}
					</h3>

					{(gameModeActive === "custom" || submissionSuccess || submissionError) &&
						<Button variant={"secondary"} onClick={handleExitGame} tabIndex={-1}>Exit to Main Menu</Button>
					}
				</div>

			</div>
		</Dialog>
	)
}

export default SubmitToLeaderboard;