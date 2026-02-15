import type { NextConfig } from "next"

const backendApiOrigin = process.env.BACKEND_API_ORIGIN?.replace(/\/$/, "")

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://img.icons8.com/**"),
      new URL("https://flagsapi.com/**"),
    ],
  },
  async rewrites() {
    if (!backendApiOrigin) return []

    return [
      {
        source: "/api/:path*",
        destination: `${backendApiOrigin}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
