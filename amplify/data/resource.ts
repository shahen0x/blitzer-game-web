import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
	Todo: a
		.model({
			content: a.string(),
		})
		.authorization((allow) => [allow.publicApiKey()]),

	UserProfile: a
		.model({
			userId: a.string().required(),
			username: a.string(),
			// leaderboard: a.hasOne('Leaderboard', 'userId'),
		})
		.authorization((allow) => [
			allow.owner().to(['create', 'read', 'update']),
			// allow.publicApiKey(),
		]),

	Leaderboard: a
		.model({
			userId: a.string().required(),
			// userProfile: a.belongsTo('UserProfile', 'userId'),
			score: a.string().required(),
		})
		.authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: "apiKey",
		apiKeyAuthorizationMode: {
			expiresInDays: 30,
		},
	},
});