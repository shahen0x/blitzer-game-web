import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { levelGeneratorPrompt } from "./prompt";

const schema = a.schema({

	GenerateLevels: a.generation({
		aiModel: a.ai.model('Claude 3.5 Sonnet v2'),
		systemPrompt: levelGeneratorPrompt,
		inferenceConfiguration: {
			maxTokens: 1000,
			temperature: 0.5,
			topP: 0.9,
		}
	})
		.arguments({
			instructions: a.string(),
		})
		.returns(
			a.string()
		)
		.authorization((allow) => allow.authenticated()),



	AiLevel: a.model({
		grid: a.string(),
		generatedBy: a.string(),
		cover: a.string(),
	})
		.authorization((allow) => [allow.authenticated().to(['create', 'read'])]),



	Leaderboard: a
		.model({
			userId: a.string().required(),
			username: a.string().required(),
			mode: a.enum(["normal", "bossFight"]),
			time: a.float().required(),
		})
		.authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: "userPool",
	},
});