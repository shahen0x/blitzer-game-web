"use client";

import { Schema } from "@/amplify/data/resource";
import { useApplicationStore } from "@/store/use-application-store";
import { AiLevelWithCoverImage } from "@/store/use-data-store";
import { getUrl, remove } from "aws-amplify/storage";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { client } from "../amplify/amplify-client-config";

interface LevelCardProps {
	level: AiLevelWithCoverImage
}

const LevelCard: FC<LevelCardProps> = ({ level }) => {

	async function deleteLevel(id: string, path: string) {
		await client.models.AiLevel.delete({ id });
		await remove({ path }).catch((error) => {
			console.log(error);
		});
	}

	return (
		<button
			className="group p-2 outline-none transition-colors rounded-2xl bg-white/5 hover:bg-primary/5 border hover:border-primary"
		>
			<div className="relative overflow-hidden transition-colors rounded-xl w-full h-80 flex justify-center items-center bg-[#13001c]">
				{level.coverImage &&
					<>
						<h4 className="absolute top-3 left-0 z-20 px-2 py-1 rounded-r-full bg-secondary text-xs">By {level.generatedBy}</h4>
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
				{/* <LoaderCircle className="animate-spin" /> */}
			</div>
			<div onClick={() => deleteLevel(level.id, level.cover || "")}>del</div>
		</button>
	)
}

export default LevelCard;