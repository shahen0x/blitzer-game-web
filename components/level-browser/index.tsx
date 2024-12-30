"use client";

import { useApplicationStore } from "@/store/use-application-store";
import { FC, useEffect, useState } from "react";
import Dialog from "../ui/dialog";
import { StarsBackground } from "../background/stars";
import { client } from "../amplify/amplify-client-config";
import { Schema } from "@/amplify/data/resource";

import { StorageImage } from '@aws-amplify/ui-react-storage';
import { remove } from 'aws-amplify/storage';

interface LevelBrowserProps {

}

const LevelBrowser: FC<LevelBrowserProps> = () => {

	const { levelBrowserActive, setLevelBrowserActive } = useApplicationStore();
	const [levels, setLevels] = useState<Array<Schema["AiLevel"]["type"]>>([]);
	console.log(levels);

	function fetchLevels() {
		client.models.AiLevel.observeQuery().subscribe({
			next: (data) => {
				setLevels([...data.items]);
			},
		});
	}


	async function deleteLevel(id: string, path: string) {
		await client.models.AiLevel.delete({ id });
		await remove({ path }).catch((error) => {
			console.log(error);
		});
	}

	useEffect(() => {
		fetchLevels();
	}, []);


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
				<div className="grid grid-cols-3 gap-2">
					{levels.map((level, index) => (
						<div key={index} className="w-full h-full flex justify-center items-center">
							<button onClick={() => deleteLevel(level.id, level.cover || "")}>del</button>
							{level.cover &&
								<StorageImage alt="cat" path={level.cover} />
							}
						</div>
					))}
				</div>

			</div>
		</Dialog>
	)
}

export default LevelBrowser;