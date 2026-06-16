/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  devIndicators: false,
  output: isGithubPages ? 'export' : undefined,
  basePath: isGithubPages ? '/Manifest' : '',
  assetPrefix: isGithubPages ? '/Manifest/' : '',
  trailingSlash: isGithubPages,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
