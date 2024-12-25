"use client";

import { Orbitron } from "next/font/google";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import LevelPreview from "./level-preview";
import { Button } from "../ui/button";

import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { Schema } from "@/amplify/data/resource";
import LevelLoader from "./level-loader";
import MorphingText from "../ui/morphing-text";
import ShimmerButton from "../ui/shimmer-button";

const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIConversation, useAIGeneration } = createAIHooks(client);

const orbitron = Orbitron({
	weight: '500',
	subsets: ['latin'],
	display: 'swap',
});

interface LevelGeneratorProps {
	isGeneratorActive: boolean;
	setIsGeneratorActive: Dispatch<SetStateAction<boolean>>
}


const texts = [
	"Building a new level",
	"Setting up the game",
];

enum GenerationStep {
	Generating,
	Generated,
	LimitReached,
	Error
}


const initialGrid = [
	[0, 0, 0, 2, 4, 1, 0, 0, 0, 6, 2, 0, 0, 0, 1, 5, 1, 0, 2, 2],
	[0, 1, 0, 1, 0, 2, 3, 1, 0, 3, 0, 0, 2, 1, 2, 0, 1, 2, 1, 0],
	[0, 1, 0, 0, 0, 0, 0, 1, 4, 1, 0, 0, 1, 0, 0, 0, 0, 5, 0, 0],
	[0, 1, 4, 1, 1, 0, 0, 0, 0, 2, 4, 1, 5, 0, 1, 3, 1, 2, 6, 0],
	[1, 7, 0, 0, 5, 1, 3, 6, 0, 0, 0, 0, 1, 4, 2, 0, 0, 0, 2, 1],
	[0, 0, 0, 0, 0, 0, 1, 5, 1, 5, 1, 0, 0, 0, 1, 3, 1, 0, 0, 0],
	[0, 1, 4, 2, 0, 0, 0, 0, 2, 0, 1, 3, 1, 0, 0, 0, 2, 1, 0, 2],
	[0, 0, 0, 3, 1, 2, 1, 0, 4, 0, 0, 0, 2, 4, 1, 0, 0, 5, 1, 1],
	[0, 0, 0, 1, 0, 0, 2, 5, 6, 3, 2, 0, 0, 0, 2, 1, 0, 0, 2, 0]
]


const convertToNumberArray = (input: string): number[][] => {
	try {
		// Use JSON.parse to convert the string to a number[][]
		const parsedData = JSON.parse(input);

		// Ensure the parsed data is a valid number[][]
		if (!Array.isArray(parsedData) || !parsedData.every(row => Array.isArray(row) && row.every(cell => typeof cell === "number"))) {
			throw new Error("Invalid data format");
		}

		return parsedData;
	} catch (error) {
		console.error("Error parsing input:", error);
		throw new Error("Failed to convert input to number[][]");
	}
};

const LevelGenerator: FC<LevelGeneratorProps> = ({
	isGeneratorActive,
	setIsGeneratorActive,
}) => {

	const [generationPhase, setGenerationPhase] = useState(GenerationStep.Generating);
	const [{ data, isLoading, hasError, messages }, generateLevels] =
		useAIGeneration("GenerateLevels");

	useEffect(() => {
		console.log("Generation started")
		if (generationPhase === GenerationStep.Generating) {
			generateLevels({ instructions: "generate new level" });

		}
	}, [isGeneratorActive]);

	useEffect(() => {
		console.log("Generation finished")
		if (data) setGenerationPhase(GenerationStep.Generated);
		console.log(data);
	}, [data]);

	return (
		<div className="h-full w-full flex flex-col justify-center items-center space-y-10">

			{generationPhase === GenerationStep.Generating &&
				<>
					<MorphingText texts={texts} className={`${orbitron.className} !text-3xl `} />
					<LevelLoader />
					<p className="mt-4 text-sm text-muted-foreground">You have 1/3 AI levels left to generate.</p>
				</>
			}

			{generationPhase === GenerationStep.Generated && data &&
				<>
					<h2 className={`${orbitron.className} text-3xl`}>Level Generated!</h2>
					{/* <LevelPreview animate={true} initialGrid={initialGrid} /> */}
					<LevelPreview animate={true} initialGrid={convertToNumberArray(data)} />
					<ShimmerButton className="shadow-2xl" shimmerColor="#00F6FF">
						<span className={`${orbitron.className} whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-wider text-[#00F6FF] dark:from-white dark:to-slate-900/10 lg:text-lg`}>
							Play Level
						</span>
					</ShimmerButton>
				</>
			}

			{/* <Button onClick={() => setIsGeneratorActive(!isGeneratorActive)}>Back</Button> */}
		</div>
	)
}

export default LevelGenerator;