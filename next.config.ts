import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://img.icons8.com/**"),
      new URL("https://flagsapi.com/**"),
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/backend/:path*",
  //       destination: "http://localhost:3001/:path*", // NestJS server
  //     },
  //   ]
  // },
}

export default nextConfig
