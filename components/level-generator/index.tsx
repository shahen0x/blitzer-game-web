"use client";
import { FC, useEffect, useState } from "react";

import { useApplicationStore } from "@/store/use-application-store";
import Dialog from "../ui/dialog";
import { Button } from "../ui/button";
import { StarsBackground } from "../background/stars";
import MorphingText from "../ui/morphing-text";

import LevelLoader from "../level-selector/level-loader";

import { creationTexts, startScreenTexts } from "./ai-texts";
import { Orbitron } from "next/font/google";

import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { Schema } from "@/amplify/data/resource";
import LevelPreview from "../level-selector/level-preview";
import { convertToNumberArray } from "@/lib/convert-to-number-array";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";

const orbitron = Orbitron({
	weight: '500',
	subsets: ['latin'],
	display: 'swap',
});



interface LevelGeneratorProps {
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void
	children: React.ReactNode;
}



enum GenerationStep {
	StartScreen,
	Generating,
	Generated,
	Error
}



// INITIALIZE AWS AMPLIFY AI HOOKS
//
const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIConversation, useAIGeneration } = createAIHooks(client);



const LevelGenerator: FC<LevelGeneratorProps> = ({
	sendMessage,
	children,
}) => {

	const {
		setIsMainMenuActive,
		setGameModeActive,
		isLevelGeneratorActive,
		setIsLevelGeneratorActive
	} = useApplicationStore();

	const [generationStep, setGenerationStep] = useState(GenerationStep.StartScreen);
	const [{ data, isLoading, hasError, messages }, generateLevels] = useAIGeneration("GenerateLevels");

	function handleStartChallenge() {
		setGenerationStep(GenerationStep.Generating);
		generateLevels({ instructions: "generate new level" });
	}


	useEffect(() => {
		if (data) {
			setGenerationStep(GenerationStep.Generated);
			// setGeneratedLevel(convertToNumberArray(data));
		};
	}, [data]);



	const handleStartAILevelMode = () => {
		// const aiLevelGenerated = [[0, 0, 0, 0, 2, 1, 4, 1, 0, 0, 0, 0, 2, 1, 5, 1, 0, 0, 0, 0], [0, 2, 4, 1, 3, 0, 0, 2, 1, 0, 0, 2, 0, 0, 0, 2, 1, 3, 2, 0], [0, 1, 0, 0, 1, 0, 0, 0, 5, 1, 4, 1, 0, 0, 0, 0, 0, 1, 7, 0], [0, 2, 1, 0, 2, 1, 3, 0, 0, 2, 0, 5, 1, 2, 1, 4, 0, 2, 0, 0], [1, 6, 2, 6, 1, 2, 1, 4, 1, 6, 2, 1, 2, 6, 1, 3, 1, 5, 2, 1], [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0], [0, 2, 1, 4, 1, 3, 1, 5, 1, 2, 1, 3, 0, 0, 0, 2, 1, 4, 2, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 8, 0], [0, 0, 0, 0, 0, 2, 1, 5, 1, 0, 0, 0, 0, 2, 1, 3, 1, 2, 0, 0]];
		// console.log(JSON.stringify({ grid: aiLevelGenerated }));
		if (!data) return;
		const generatedLevel = convertToNumberArray(data);
		setIsLevelGeneratorActive(false);
		setIsMainMenuActive(false);
		setGameModeActive('ai');
		sendMessage("MainMenuManager", "StartAILevelMode", JSON.stringify({ grid: generatedLevel }));
		setGenerationStep(GenerationStep.StartScreen);
	}


	return (
		<Dialog
			open={isLevelGeneratorActive}
			onOpenChange={(generationStep === GenerationStep.Generating || generationStep === GenerationStep.Generated) ? () => { } : setIsLevelGeneratorActive}
			className="max-w-5xl min-h-[calc(100vh_-_10rem)]"
		>
			<StarsBackground className="absolute z-0" />
			<div className="relative z-10 h-full flex flex-col justify-center items-center space-y-10">

				{generationStep === GenerationStep.StartScreen &&
					<>
						<div className="w-full text-center space-y-1">
							<MorphingText texts={startScreenTexts} className={`${orbitron.className} `} />
						</div>

						<div className="flex items-center gap-2">
							<Button variant={"outline"} size={"lg"} onClick={() => setIsLevelGeneratorActive(false)}>
								Back
							</Button>

							<Button variant={"orange"} size={"lg"} onClick={handleStartChallenge}>
								Start Challenge
							</Button>
						</div>
					</>
				}

				{generationStep === GenerationStep.Generating &&
					<>
						<MorphingText texts={creationTexts} className={`${orbitron.className} `} />
						<LevelLoader />
					</>
				}

				{(generationStep === GenerationStep.Generated && data) &&
					<>
						<h1 className={`${orbitron.className} text-4xl`}>Your challenge is ready!</h1>
						<LevelPreview animate={true} initialGrid={convertToNumberArray(data)} />
						<Button variant={"orange"} size={"lg"} onClick={handleStartAILevelMode}>
							Play Challenge
						</Button>
					</>
				}

				<div className="absolute bottom-0 left-0 right-0 text-center text-muted-foreground text-sm"><span className="text-[#ff8a00]">1 / 3</span> AI levels left to generate. Play more in the Level Browser.</div>
			</div>
		</Dialog>
	)
}

export default LevelGenerator;