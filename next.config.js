/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [{
			protocol: 'https',
			hostname: 'amplify-awsamplifygen2-us-blitzergamedrivebucketad-ie4o1kx6ltqu.s3.us-west-2.amazonaws.com'
		},
		{
			protocol: 'https',
			hostname: 'amplify-d2lg0lyt69spz7-ma-blitzergamedrivebucketad-6dpkp9uaa3cq.s3.us-west-2.amazonaws.com'
		}
		]
	},

	async headers() {
		return [
			{
				source: '/game/Build/:path*.wasm',
				headers: [
					{ key: 'Content-Type', value: 'application/wasm' },
					{ key: 'Access-Control-Allow-Origin', value: '*' },
				],
			},
			{
				source: '/game/Build/:path*.data',
				headers: [
					{ key: 'Content-Type', value: 'application/octet-stream' },
					{ key: 'Access-Control-Allow-Origin', value: '*' },
				],
			},
			{
				source: '/game/Build/:path*.json',
				headers: [
					{ key: 'Content-Type', value: 'application/json' },
					{ key: 'Access-Control-Allow-Origin', value: '*' },
				],
			},
		];
	},
}

module.exports = nextConfig
