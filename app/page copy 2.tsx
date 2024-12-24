"use client";

// import { revalidatePath } from "next/cache";

// import { AuthGetCurrentUserServer, cookiesClient } from "@/utils/amplify-utils";

import Logout from "@/components/amplify/logout";
import Leaderboard from "./_leaderboard/leaderboard";

export default function App() {
	// const user = await AuthGetCurrentUserServer();
	// const { data: todos } = await cookiesClient.models.Todo.list();
	// const { data: leaderboard } = await cookiesClient.models.Leaderboard.list({});

	// console.log("user", user);

	// async function wipeLeaderboard() {
	// 	"use server";

	// 	const { data: allRecords } = await cookiesClient.models.Leaderboard.list();
	// 	for (const record of allRecords) {
	// 		await cookiesClient.models.Leaderboard.delete({ id: record.id });
	// 		console.log("deleted", record.id);

	// 	}
	// }

	// wipeLeaderboard()


	// async function addTodo(data: FormData) {
	// 	"use server";
	// 	const title = data.get("title") as string;
	// 	const create = await cookiesClient.models.Todo.create({
	// 		content: title,
	// 	});
	// 	console.log(create);
	// 	revalidatePath("/");
	// }

	// async function addScore(data: FormData) {
	// 	"use server";
	// 	try {
	// 		if (user) {
	// 			const scoreValue = data.get("score");
	// 			if (scoreValue === null) throw new Error("Score is required.");
	// 			const score = parseFloat(scoreValue.toString());

	// 			const create = await cookiesClient.models.Leaderboard.create({
	// 				userId: user.userId,
	// 				score: score
	// 			});
	// 			// console.log(create);

	// 			revalidatePath("/");
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }

	return (
		<>
			{/* <div>
				{user && <Logout />}
				{user?.userId || "Not logged in"}
			</div>
			<div>
				<form action={addScore}>
					<input type="number" name="score" />
					<button type="submit">Add score</button>
				</form>
			</div> */}
			<h3>Server</h3>
			<ul>
				{/* {todos && todos.map((todo) => <li key={todo.id}>{todo.content}</li>)} */}
				{/* {leaderboard && leaderboard.map((entry) => <li key={entry.id}>{entry.score}</li>)} */}
			</ul>
			<h3>Client</h3>
			<Leaderboard />

		</>
	);
}