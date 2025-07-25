/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['static.tildacdn.com', 'localhost', 'via.placeholder.com'],
  },
}

module.exports = nextConfig 