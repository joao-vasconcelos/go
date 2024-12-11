/* * */

const createNextIntlPlugin = require('next-intl/plugin');

/* * */

const withNextIntl = createNextIntlPlugin();

/* * */

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	reactStrictMode: true,
	async redirects() {
		return [
			{
				destination: '/',
				permanent: true,
				source: '/dashboard',
			},
		];
	},
};

/* * */

module.exports = withNextIntl(nextConfig);
