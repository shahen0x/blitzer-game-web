"use client";

import { FC } from "react";
import { useApplicationStore } from "@/store/use-application-store";
import Dialog from "../ui/dialog";

interface LevelSelectorProps {

}

const LevelSelector: FC<LevelSelectorProps> = () => {


	const { isLevelSelectorActive, setIsLevelSelectorActive } = useApplicationStore();


	return (
		<Dialog
			open={true}
			onOpenChange={setIsLevelSelectorActive}
			title="AI Levels / Generator"
			className="max-w-5xl min-h-[calc(100vh_-_10rem)]"
		>
			test
		</Dialog>
	)
}

export default LevelSelector;