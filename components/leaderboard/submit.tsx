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
	const [errorMessage, setErrorMessage] = useState<string>("An unknown error occured.");


	useEffect(() => {
		fetchUserAttributes().then((user) => {
			setUsername(user.preferred_username);
		}).catch((error) => {
			console.log(error);
		});
	}, [submitDialogActive]);



	const submitToDB = async (time: any) => {

		setIsSubmitting(true);
		if (!username) return console.log("Username not found when submitting to leaderboard.");

		// Check if user already submitted a time
		//
		const { data: existingEntry } = await client.models.Leaderboard.list({
			filter: {
				userId: { eq: user.userId },
				mode: { eq: gameModeActive as "normal" | "bossFight" }
			}
		});

		if (existingEntry?.length > 0) {

			// Check if new time is lower than existing time
			if (time >= existingEntry[0].time) {
				setIsSubmitting(false);
				setSubmissionError(true);
				setErrorMessage("You did better before!");
				return;
			}

			// Update existing entry with better time
			const { errors } = await client.models.Leaderboard.update({
				id: existingEntry[0].id,
				time: time
			});

			if (errors) {
				setIsSubmitting(false);
				setSubmissionError(true);
				setErrorMessage("Error updating your entry.");
				return;
			}

			setIsSubmitting(false);
			setSubmissionSuccess(true);
			return;
		}


		// Create new entry if none exists
		const { errors } = await client.models.Leaderboard.create({
			userId: user.userId,
			username: username,
			mode: gameModeActive === "none" ? null : (gameModeActive as "normal" | "bossFight"),
			time: time
		});

		if (errors) {
			setIsSubmitting(false);
			setSubmissionError(true);
			setErrorMessage("Error creating your entry.");
			return;
		}

		setIsSubmitting(false);
		setSubmissionSuccess(true);
		return;
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
		setSubmissionSuccess(false);
		setSubmissionError(false);
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
								{submissionError && <>{errorMessage}</>}
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