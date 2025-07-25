/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['static.tildacdn.com', 'localhost', 'via.placeholder.com', 'universalmotors.ru'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'universalmotors.ru',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/api/images/:path*',
      },
    ]
  },
}

module.exports = nextConfig 