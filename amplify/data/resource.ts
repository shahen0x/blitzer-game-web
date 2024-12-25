import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { levelGeneratorPrompt } from "./prompt";

const schema = a.schema({
	generateRecipe: a.generation({
		aiModel: a.ai.model('Claude 3.5 Sonnet v2'),
		systemPrompt: "You are a helpful assistant that generates recipes.",

		inferenceConfiguration: {
			maxTokens: 1000,
			temperature: 0.5,
			topP: 0.9,
		}
	})
		.arguments({
			description: a.string(),
		})
		.returns(
			a.customType({
				name: a.string(),
				ingredients: a.string().array(),
				instructions: a.string(),
			})
		)
		.authorization((allow) => allow.authenticated()),

	GenerateLevels: a.generation({
		aiModel: a.ai.model('Claude 3.5 Sonnet v2'),
		systemPrompt: levelGeneratorPrompt,
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
	})
		.authorization((allow) => [allow.authenticated().to(['create', 'read'])]),

	Todo: a
		.model({
			content: a.string(),
		})
		.authorization((allow) => [allow.authenticated()]),

	UserProfile: a
		.model({
			userId: a.string().required(),
			username: a.string(),
			// leaderboard: a.hasOne('Leaderboard', 'userId'),
		})
		.authorization((allow) => [
			allow.authenticated().to(['create', 'read', 'update']),
			// allow.publicApiKey(),
		]),

	Leaderboard: a
		.model({
			userId: a.string().required(),
			// userProfile: a.belongsTo('UserProfile', 'userId'),
			score: a.float().required(),
		})
		.authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: "userPool",
		// apiKeyAuthorizationMode: {
		// 	expiresInDays: 30,
		// },
	},
});