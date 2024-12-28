"use client";

import { base64ToBlob } from "@/lib/base64-to-blob";
import { useApplicationStore } from "@/store/use-application-store";
import { FC, useCallback, useEffect } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";

interface LevelUploaderProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	takeScreenshot: (dataType?: string, quality?: number) => string | undefined
}

const LevelUploader: FC<LevelUploaderProps> = ({
	addEventListener,
	removeEventListener,
	takeScreenshot
}) => {

	const { gameModeActive } = useApplicationStore();


	const handleTakeScreenshot = useCallback(() => {
		if (gameModeActive === "normal") handleClickTakeScreenshot();
	}, [handleClickTakeScreenshot]);

	useEffect(() => {
		addEventListener("TakeScreenshot", handleTakeScreenshot);
		return () => removeEventListener("TakeScreenshot", handleTakeScreenshot);
	}, [addEventListener, removeEventListener, handleTakeScreenshot]);


	async function handleClickTakeScreenshot() {
		const dataUrl = takeScreenshot("image/jpg", 0.1);
		if (dataUrl) {
			const blob = base64ToBlob(dataUrl, "image/jpg");
		}
	}

	return (
		<></>
	)
}

export default LevelUploader;