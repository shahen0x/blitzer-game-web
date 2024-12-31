"use client";

import { useApplicationStore } from "@/store/use-application-store";
import { FC, use, useEffect, useState } from "react";
import Dialog from "../ui/dialog";
import { StarsBackground } from "../background/stars";
import { client } from "../amplify/amplify-client-config";
import { Schema } from "@/amplify/data/resource";

import { StorageImage } from '@aws-amplify/ui-react-storage';
import { remove } from 'aws-amplify/storage';
import LevelCard from "./level-card";
import { useDataStore } from "@/store/use-data-store";

interface LevelBrowserProps {

}

const LevelBrowser: FC<LevelBrowserProps> = () => {

	const { levelBrowserActive, setLevelBrowserActive } = useApplicationStore();
	const { levels } = useDataStore();

	return (
		<Dialog
			open={levelBrowserActive}
			onOpenChange={setLevelBrowserActive}
			className="max-w-5xl min-h-[calc(100vh_-_10rem)]"
		>
			<StarsBackground className="absolute z-0" />
			<div
				className="relative z-10 h-full flex flex-col justify-center items-center space-y-10 outline-none"
			>
				<div className="grid grid-cols-2 gap-4 w-full">
					{levels && levels.map((level, index) => (
						<LevelCard key={index} level={level} />
					))}
				</div>

			</div>
		</Dialog>
	)
}

export default LevelBrowser;