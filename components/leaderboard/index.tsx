/**
 * LEADERBOARD COMPONENT
 * This is a basic implementation for the hackathon,
 * in a real world situation we would work on making 
 * the leaderboard more efficient with caching and pagination.
 * 
 */

"use client";

import { useEffect, useState } from "react";
import { useApplicationStore } from "@/store/use-application-store";

import { Schema } from "@/amplify/data/resource";
import { client } from "../amplify/amplify-client-config";
import { formatTime } from "@/lib/format-numbers";

import Dialog from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { StarsBackground } from "../background/stars";

import { ChevronLeft } from "lucide-react";


type ActiveTab = "normal" | "bossFight";


const Leaderboard = () => {

	const { leaderboardDialogActive, setLeaderboardDialogActive } = useApplicationStore();

	const [activeTab, setActiveTab] = useState<ActiveTab>("normal");
	const [leaderboard, setLeaderboard] = useState<Array<Schema["Leaderboard"]["type"]>>([]);


	// COMMON STYLES
	//
	const styles = {
		button: `py-1 px-3 rounded-full text-sm font-semibold text-muted-foreground`,
		activeButton: `bg-primary !text-black`,
	}


	// FETCH LEADERBOARD
	//
	function fetchLeaderboard() {
		client.models.Leaderboard.observeQuery().subscribe({
			next: (data,) => {
				const sorted = data.items.sort((a, b) => a.time - b.time);
				setLeaderboard([...sorted]);
			},
		});
	}

	// Fetch leaderboard on first load to better experience.
	useEffect(() => {
		fetchLeaderboard();
	}, []);


	// async function handleDeleteLeaderboardEntry(id: any) {
	// 	await client.models.Leaderboard.delete({ id })
	// }


	return (
		<Dialog
			open={leaderboardDialogActive}
			onOpenChange={setLeaderboardDialogActive}
			className="overflow-hidden max-w-xl h-[calc(100vh_-_10rem)]"
		>
			<StarsBackground className="absolute z-0" />

			<div className="relative z-10">

				{/* LEADERBOARD HEADER */}
				<div className="mb-8 flex items-center">
					<Button variant={"outline"} size={"icon"} className="mr-4" onClick={() => setLeaderboardDialogActive(false)}>
						<ChevronLeft />
					</Button>
					<h3 className="font-orbitron text-2xl tracking-wider">Leaderboard</h3>
					<div className="bg-secondary rounded-full p-1 ml-auto">
						<button className={`${styles.button} ${activeTab === "normal" && styles.activeButton}`} onClick={() => setActiveTab("normal")}>Normal Mode</button>
						<button className={`${styles.button} ${activeTab === "bossFight" && styles.activeButton}`} onClick={() => setActiveTab("bossFight")}>Boss Fight</button>
					</div>
				</div>

				{/* LEADERBOARD TABLE HEAD */}
				<div className="mb-4 px-4">
					<div className="grid grid-cols-[4rem_1fr_6rem] text-sm text-muted-foreground border px-4 py-2 rounded-xl bg-secondary/20">
						<div>Rank</div>
						<div>Player</div>
						<div className="text-right">Time</div>
					</div>
				</div>

				{/* LEADERBOARD ENTRIES */}
				<ScrollArea className="h-[calc(100vh_-_21rem)] px-4">
					<div className="space-y-2">
						{leaderboard.filter((item) => item.mode === activeTab).map((item, index) => (
							<div key={index} className="grid grid-cols-[4rem_1fr_10rem] items-center border px-4 py-2 rounded-xl text-sm">
								<div>#{index + 1}</div>
								<div>{item.username}</div>
								<div className="text-right">{formatTime(item.time)}</div>
								{/* <button onClick={() => handleDeleteLeaderboardEntry(item.id)}>Delete</button> */}
							</div>
						))}
					</div>
				</ScrollArea>

			</div>
		</Dialog>
	)
}

export default Leaderboard;