/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [{
			protocol: 'https',
			hostname: 'amplify-awsamplifygen2-us-blitzergamedrivebucketad-ie4o1kx6ltqu.s3.us-west-2.amazonaws.com'
		}]
	}
}

module.exports = nextConfig
