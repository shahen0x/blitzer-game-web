"use client";

import { FC, useEffect, useState } from "react";
import { useApplicationStore } from "@/store/use-application-store";
import Dialog from "../ui/dialog";
import { Button } from "../ui/button";
import MorphingText from "../ui/morphing-text";
import LevelLoader from "./level-loader";
import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { Schema } from "@/amplify/data/resource";
import LevelPreview from "./level-preview";
import { convertToNumberArray } from "@/lib/convert-to-number-array";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";



const startScreenTexts = [
	"Welcome!",
	"The AI overlord shapes the world.",
	"Are you prepared?",
	"It builds, you survive.",
	"Adapt or be erased.",
	"Each move shapes your fate.",
	"It evolves, do you?",
	"The world bends to its will.",
	"Face what it creates.",
	"You’re a pawn in its game.",
	"Survive its design."
];

const creationTexts = [
	"Shaping your challenge...",
	"Designing the impossible...",
	"Building the unknown...",
	"It’s coming together...",
	"Crafting your path...",
	"Reality is forming...",
	"Piecing it all together...",
	"Constructing your doom...",
	"The world is taking shape...",
	"Assembling the chaos..."
];


interface LevelGeneratorProps {
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void;
}


enum GenerationStep {
	StartScreen,
	Generating,
	Generated,
	Error
}


const MAX_GENERATIONS = 10;
const STORAGE_KEY = 'levelGenerations';


// Init Amplify AI hook
const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIGeneration } = createAIHooks(client);

const LevelGenerator: FC<LevelGeneratorProps> = ({
	sendMessage
}) => {

	const {
		setMainMenuActive,
		setGameModeActive,
		isLevelGeneratorActive,
		setIsLevelGeneratorActive,
		setGeneratedLevelData,
		setCustomGameLaunchedFrom
	} = useApplicationStore();

	const [generationStep, setGenerationStep] = useState(GenerationStep.StartScreen);
	const [generationsUsed, setGenerationsUsed] = useState(0);
	const [{ data, isLoading, hasError, messages }, generateLevels] = useAIGeneration("GenerateLevels");


	// Initialize generations count from localStorage
	useEffect(() => {
		const storedGenerations = localStorage.getItem(STORAGE_KEY);
		const usedGenerations = storedGenerations ? parseInt(storedGenerations) : 0;
		setGenerationsUsed(usedGenerations);
	}, []);



	function generateInstructions() {
		// generate random seed number
		const seed = Math.floor(Math.random() * 1000);

		// define extraction point options
		const extractionPointOptions: string[] = [
			"top middle",
			"center middle",
			"bottom middle",
			"top right",
			"center right",
			"bottom right",
		];

		const instructions = "generate new level with seed number " + seed + ". Place the extraction point at the " + extractionPointOptions[seed % extractionPointOptions.length] + " of the grid";
		return instructions;
	}


	async function handleStartChallenge() {
		if (generationsUsed >= MAX_GENERATIONS) {
			return alert("You have used all your credits. Play more in the Level Browser.");
		}

		setGenerationStep(GenerationStep.Generating);

		// Update localStorage before generating
		const newGenerationCount = generationsUsed + 1;
		localStorage.setItem(STORAGE_KEY, newGenerationCount.toString());
		setGenerationsUsed(newGenerationCount);

		generateLevels({ instructions: generateInstructions() })
	}


	useEffect(() => {
		if (data) setGenerationStep(GenerationStep.Generated);
	}, [data]);



	const handleStartAILevelMode = () => {
		if (!data) return;
		const generatedLevel = convertToNumberArray(data);
		setGeneratedLevelData(generatedLevel);
		setIsLevelGeneratorActive(false);
		setMainMenuActive(false);
		setGameModeActive('custom');
		setCustomGameLaunchedFrom("ai-generator");
		sendMessage("MainMenuManager", "StartAILevelMode", JSON.stringify({ grid: generatedLevel }));
		setGenerationStep(GenerationStep.StartScreen);
	}


	const getGenerationsText = () => {
		return `${generationsUsed} / ${MAX_GENERATIONS} AI levels generated. ${generationsUsed >= MAX_GENERATIONS ? 'Play more in the Level Browser.' : ''}`;
	}


	return (
		<Dialog
			open={isLevelGeneratorActive}
			onOpenChange={(generationStep === GenerationStep.Generating || generationStep === GenerationStep.Generated) ? () => { } : setIsLevelGeneratorActive}
			className="max-w-5xl min-h-[calc(100vh_-_10rem)]"
		>
			<div className="relative z-10 h-full flex flex-col justify-center items-center space-y-10">

				{generationStep === GenerationStep.StartScreen &&
					<>
						<div className="w-full text-center space-y-1">
							<MorphingText texts={startScreenTexts} className="font-orbitron" />
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
						<MorphingText texts={creationTexts} className="font-orbitron" />
						<LevelLoader />
					</>
				}

				{(generationStep === GenerationStep.Generated && data) &&
					<>
						<h1 className="font-orbitron text-4xl">Your challenge is ready!</h1>
						<LevelPreview animate={true} initialGrid={convertToNumberArray(data)} />
						<Button variant={"orange"} size={"lg"} onClick={handleStartAILevelMode}>
							Play Challenge
						</Button>
					</>
				}

				<div className="absolute bottom-0 left-0 right-0 text-center text-muted-foreground text-sm">
					{getGenerationsText()}
				</div>
			</div>
		</Dialog>
	)
}

export default LevelGenerator;