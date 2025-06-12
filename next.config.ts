import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL(
        "https://img.icons8.com/?size=100&id=22984&format=png&color=1A1A1A"
      ),
    ],
  },
}

export default nextConfig
