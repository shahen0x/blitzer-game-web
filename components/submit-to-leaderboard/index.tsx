"use client";

import { FC, useCallback, useEffect } from "react";
import Dialog from "../ui/dialog";
import { useApplicationStore } from "@/store/use-application-store";
import { Orbitron } from "next/font/google";
import Ripple from "../ui/ripple";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";


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

	const { submitDialogActive, setSubmitDialogActive } = useApplicationStore();


	const handleSubmitScore = useCallback((time: any) => {
		setSubmitDialogActive(true);
		console.log(time);

	}, []);

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
			{/* <div className="absolute w-full h-full top-0 left-0 bg-green-500/10 " /> */}
		</Dialog>
	)
}

export default SubmitToLeaderboard;