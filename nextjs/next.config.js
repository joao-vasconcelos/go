/* * */

const withNextIntl = require('next-intl/plugin')();

/* * */

module.exports = withNextIntl({
  output: 'standalone',
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
        permanent: true,
      },
    ];
  },
});
