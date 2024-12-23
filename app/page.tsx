// app/page.tsx

import { revalidatePath } from "next/cache";

import { AuthGetCurrentUserServer, cookiesClient } from "@/utils/amplify-utils";

import Logout from "@/components/logout";

async function App() {
	const user = await AuthGetCurrentUserServer();
	const { data: todos } = await cookiesClient.models.Todo.list();
	const { data: leaderboard } = await cookiesClient.models.Leaderboard.list();

	console.log(leaderboard);

	// async function wipeLeaderboard() {
	// 	"use server";

	// 	const { data: allRecords } = await cookiesClient.models.Leaderboard.list();
	// 	for (const record of allRecords) {
	// 		await cookiesClient.models.Leaderboard.delete({ id: record.id });
	// 		console.log("deleted", record.id);

	// 	}
	// }

	// wipeLeaderboard()


	async function addTodo(data: FormData) {
		"use server";
		const title = data.get("title") as string;
		const create = await cookiesClient.models.Todo.create({
			content: title,
		});
		console.log(create);
		revalidatePath("/");
	}

	async function addScore(data: FormData) {
		"use server";
		if (user) {
			const score = data.get("score") as string;
			const create = await cookiesClient.models.Leaderboard.create({
				userId: user.userId,
				score: score
			});
			console.log(create);

			revalidatePath("/");
		}

	}

	return (
		<>
			<h1>Hello, Amplify 👋</h1>
			{user && <Logout />}
			{user?.userId || "Not logged in"}
			<form action={addScore}>
				<input type="text" name="score" />
				<button type="submit">Add score</button>
			</form>

			<ul>
				{/* {todos && todos.map((todo) => <li key={todo.id}>{todo.content}</li>)} */}
				{leaderboard && leaderboard.map((entry) => <li key={entry.id}>{entry.score}</li>)}
			</ul>

		</>
	);
}

export default App;