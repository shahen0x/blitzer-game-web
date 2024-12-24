"use client";

import { FC, useEffect, useState } from "react";

import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { Button } from "@/components/ui/button";

const client = generateClient<Schema>();

interface LeaderboardProps {

}

const Leaderboard: FC<LeaderboardProps> = () => {

	const [leaderboard, setLeaderboard] = useState<Array<Schema["Leaderboard"]["type"]>>([]);

	const fetchLeaderboard = async () => {
		const { data } = await client.models.Leaderboard.list({

		});
		setLeaderboard(data);
	}

	function listLeaderboard() {
		const sub = client.models.Leaderboard.observeQuery().subscribe({
			next: ({ items, isSynced }) => {
				const sortedItems = [...items].sort((a, b) => b.score - a.score);
				setLeaderboard([...sortedItems])
			},
		});

		return () => sub.unsubscribe();
	}

	useEffect(() => {
		listLeaderboard();
	}, []);

	return (
		<div>
			<ul>
				{leaderboard.map((entry) => (
					<li
						key={entry.id}
					// onClick={() => deleteTodo(todo.id)}
					>
						{entry.score}
					</li>
				))}
			</ul>

			<Button>Click me</Button>
		</div>
	)
}

export default Leaderboard;