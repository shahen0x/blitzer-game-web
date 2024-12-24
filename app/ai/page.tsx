"use client";

import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { Schema } from "@/amplify/data/resource";
import { useState } from "react";

import {
	Button,
	Flex,
	Heading,
	Loader,
	Text,
	TextAreaField,
	View,
} from "@aws-amplify/ui-react";


const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIConversation, useAIGeneration } = createAIHooks(client);

export default function AIPage() {
	const [description, setDescription] = useState("");
	const [{ data, isLoading, hasError, messages }, generateRecipe] =
		useAIGeneration("generateRecipe");

	const handleClick = () => {
		generateRecipe({ description });


	};

	console.log("data", data);
	console.log("hasError", hasError);
	console.log("messages", messages);

	return (
		<Flex direction="column" className="bg-white p-10">
			<Flex direction="row">
				<TextAreaField
					autoResize
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					label="Description"
				/>
				<Button onClick={handleClick}>Generate</Button>
			</Flex>
			{isLoading ? (
				<Loader variation="linear" />
			) : (
				<>
					<Heading level={2}>{data?.name}</Heading>
					<View as="ul">
						{data?.ingredients?.map((ingredient) => (
							<Text as="li" key={ingredient}>
								{ingredient}
							</Text>
						))}
					</View>
					<Text>{data?.instructions}</Text>
				</>
			)}
		</Flex>
	);
}