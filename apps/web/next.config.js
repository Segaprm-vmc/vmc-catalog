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
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/api/images/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:8000/uploads/:path*',
      },
    ]
  },
}

module.exports = nextConfig 