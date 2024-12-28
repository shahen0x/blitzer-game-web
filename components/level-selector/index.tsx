"use client";

import { FC, useState } from "react";
import { useApplicationStore } from "@/store/use-application-store";
import Dialog from "../ui/dialog";
import { Button } from "../ui/button";
import FlickeringGrid from "../ui/flickering-grid";
import { BorderBeam } from "../ui/border-beam";
import LevelGenerator from "./level-generator";
import LevelBrowser from "./level-browser";


interface LevelSelectorProps {

}

const LevelSelector: FC<LevelSelectorProps> = () => {

	const { isLevelSelectorActive, setIsLevelSelectorActive } = useApplicationStore();
	const [isGeneratorActive, setIsGeneratorActive] = useState(false);

	return (
		<Dialog
			open={isGeneratorActive}
			onOpenChange={setIsLevelSelectorActive}
			title="AI Levels / Generator"
			className="max-w-5xl min-h-[calc(100vh_-_10rem)]"
		>

			{!isGeneratorActive &&
				<div className="overflow-hidden relative h-[110px] w-full border rounded-xl flex p-6">
					<BorderBeam />
					<FlickeringGrid
						className="z-0 absolute inset-0 size-full"
						squareSize={4}
						gridGap={6}
						color="#6B7280"
						maxOpacity={0.2}
						flickerChance={0.1}
						height={110}
						width={1024}
					/>
					<div className="relative z-10 w-full flex justify-between items-center">
						<div>
							<h2 className="font-bold text-2xl">AI Level Generator</h2>
							<p className="text-sm">AWS Bedrock generates challenges for you to solve!</p>
						</div>
						<Button onClick={() => setIsGeneratorActive(!isGeneratorActive)}>Generate & Play</Button>
					</div>
				</div>
			}

			{!isGeneratorActive ?
				<LevelBrowser />
				:
				<LevelGenerator
					isGeneratorActive={isGeneratorActive}
					setIsGeneratorActive={setIsGeneratorActive}
				/>
			}
		</Dialog>
	)
}

export default LevelSelector;