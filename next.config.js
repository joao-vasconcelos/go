/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  // experimental: { appDir: true },
  async redirects() {
    return [
      {
        source: '/audits',
        destination: '/audits/documents',
        permanent: true,
      },
    ];
  },
};
