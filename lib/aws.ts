import { PollyClient } from '@aws-sdk/client-polly';

// Initialize the Polly client
const polly = new PollyClient({
	region: 'us-west-2',
	credentials: {
		accessKeyId: process.env.AMPLIFY_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY || '',
	},
});

export default polly;