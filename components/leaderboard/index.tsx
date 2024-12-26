"use client";

import { FC } from "react";
import Dialog from "../ui/dialog";
import { StarsBackground } from "../background/stars";
import { useApplicationStore } from "@/store/use-application-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";



interface LeaderboardProps {

}

const Leaderboard: FC<LeaderboardProps> = () => {

	const { leaderboardDialogActive, setLeaderboardDialogActive } = useApplicationStore();

	return (
		<Dialog
			open={leaderboardDialogActive}
			onOpenChange={setLeaderboardDialogActive}
			className="max-w-xl min-h-[calc(100vh_-_10rem)]"
		>
			<StarsBackground className="absolute z-0" />

			<div className="relative z-10 h-full">
				<Tabs defaultValue="normal" className="h-full">

					<div className="mb-4 flex items-center">
						<Button variant={"outline"} size={"icon"} className="mr-4" onClick={() => setLeaderboardDialogActive(false)}>
							<ChevronLeft />
						</Button>
						<h3 className="font-orbitron text-2xl tracking-wider">Leaderboard</h3>
						<TabsList className="ml-auto">
							<TabsTrigger value="normal">Normal Mode</TabsTrigger>
							<TabsTrigger value="boss">Boss Fight</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent className="h-full" value="normal">
						<ScrollArea className="h-[calc(100%_-_60px)] rounded-2xl border p-4">
							Jokester began sneaking into the castle in the middle of the night and leaving
							jokes all over the place: under the king's pillow, in his soup, even in the
							royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
							then, one day, the people of the kingdom discovered that the jokes left by
							Jokester were so funny that they couldn't help but laugh. And once they
							started laughing, they couldn't stop.
						</ScrollArea>
					</TabsContent>
					<TabsContent className="h-full" value="boss">Change your password here.</TabsContent>
				</Tabs>
			</div>

		</Dialog>
	)
}

export default Leaderboard;