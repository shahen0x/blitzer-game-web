import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

// Initialize the Polly client
const polly = new PollyClient({
	region: 'us-west-2',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
	},
});

export default polly;