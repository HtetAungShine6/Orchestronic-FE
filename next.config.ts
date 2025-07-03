import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://img.icons8.com/**"),
      new URL("https://flagsapi.com/**"),
    ],
  },
}

export default nextConfig
