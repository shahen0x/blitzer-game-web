"use client";

import { FC, useCallback, useEffect, useState } from "react";
import Dialog from "../ui/dialog";
import { useApplicationStore } from "@/store/use-application-store";
import { Orbitron } from "next/font/google";
import Ripple from "../ui/ripple";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { client } from "../amplify/amplify-client-config";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";


const orbitron = Orbitron({
	weight: '500',
	subsets: ['latin'],
	display: 'swap',
});

interface SubmitToLeaderboardProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
}

const SubmitToLeaderboard: FC<SubmitToLeaderboardProps> = ({
	addEventListener,
	removeEventListener,
}) => {

	const {
		submitDialogActive,
		setSubmitDialogActive,
		gameModeActive
	} = useApplicationStore();

	const { user } = useAuthenticator();
	const [username, setUsername] = useState<string | undefined>(undefined);


	useEffect(() => {
		fetchUserAttributes().then((user) => {
			setUsername(user.preferred_username);
		}).catch((error) => {
			console.log(error);
		});
	}, [submitDialogActive]);



	const handleSubmitScore = useCallback((time: any) => {
		setSubmitDialogActive(true);
		if (!username) {
			console.log("Username not found when submitting to leaderboard.");
			return;
		}
		client.models.Leaderboard.create({
			userId: user.userId,
			username: username,
			// mode: gameModeActive === "none" ? null : (gameModeActive as "normal" | "bossFight"),
			mode: "bossFight",
			time: time,
		}).then(() => {
			console.log("submission success");
		}).catch((error) => {
			console.error("submission error: ", error);
		});
	}, [gameModeActive, username]);

	useEffect(() => {
		addEventListener("SubmitTime", handleSubmitScore);
		return () => removeEventListener("SubmitTime", handleSubmitScore);
	}, [addEventListener, removeEventListener, handleSubmitScore]);




	return (
		<Dialog
			open={submitDialogActive}
			onOpenChange={() => { }}
			className="overflow-hidden h-[26rem] flex justify-center items-center"
		>
			<h3 className={`${orbitron.className} text-2xl text-center`}>Submitting To <br /> Leaderboard</h3>
			<Ripple />
			<button onClick={() => setSubmitDialogActive(false)}>Close</button>
			{/* <div className="absolute w-full h-full top-0 left-0 bg-green-500/10 " /> */}
		</Dialog>
	)
}

export default SubmitToLeaderboard;