"use client";

import { Schema } from "@/amplify/data/resource";
import { useApplicationStore } from "@/store/use-application-store";
import { AiLevelWithCoverImage } from "@/store/use-data-store";
import { getUrl, remove } from "aws-amplify/storage";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { client } from "../amplify/amplify-client-config";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { convertToNumberArray } from "@/lib/convert-to-number-array";

interface LevelCardProps {
	level: AiLevelWithCoverImage;
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void;
}

const LevelCard: FC<LevelCardProps> = ({
	level,
	sendMessage
}) => {

	const { setMainMenuActive, setGameModeActive, setCustomGameLaunchedFrom, setLevelBrowserActive } = useApplicationStore();

	async function deleteLevel(id: string, path: string) {
		await client.models.AiLevel.delete({ id });
		await remove({ path }).catch((error) => {
			console.log(error);
		});
	}


	const handleStartAILevelMode = () => {
		if (!level.grid) return;
		const grid = convertToNumberArray(level.grid);
		setGameModeActive('custom');
		setCustomGameLaunchedFrom('level-browser');
		setMainMenuActive(false);
		setLevelBrowserActive(false);
		sendMessage("MainMenuManager", "StartAILevelMode", JSON.stringify({ grid }));
	}

	const formatDate = (isoString: string) => {
		const date = new Date(isoString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	};

	return (
		<button
			onClick={handleStartAILevelMode}
			className="group p-2 outline-none transition-colors rounded-2xl bg-white/5 hover:bg-primary/5 border hover:border-primary"
		>
			<div className="relative overflow-hidden transition-colors rounded-xl w-full h-60 flex justify-center items-center bg-[#13001c]">
				{level.coverImage &&
					<>
						<h4 className="absolute top-3 left-0 z-20 px-2 py-1 rounded-r-full bg-secondary text-xs">By {level.generatedBy}</h4>
						<h4 className="absolute top-10 left-0 z-20 px-2 py-1 rounded-r-full bg-secondary text-xs">{formatDate(level.createdAt)}</h4>
						<Image
							src={level.coverImage}
							width={600}
							height={338}
							priority
							quality={100}
							alt="level cover"
							className="absolute top-0 left-0 z-10 w-full h-full object-cover"
						/>
					</>
				}
				<LoaderCircle className="relative z-0 animate-spin" />
			</div>
			{/* <div onClick={() => deleteLevel(level.id, level.cover || "")}>del</div> */}
		</button>
	)
}

export default LevelCard;