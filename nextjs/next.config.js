/* * */

const withNextIntl = require('next-intl/plugin')();

/* * */

module.exports = withNextIntl({
  output: 'standalone',
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cataas.com' }],
  },
});
