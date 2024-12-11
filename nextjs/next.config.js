/* * */

import createNextIntlPlugin from 'next-intl/plugin';

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

export default withNextIntl(nextConfig);
