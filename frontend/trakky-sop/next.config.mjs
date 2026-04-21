/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // 👈 Required to generate 'out' folder
  images: {
    unoptimized: true, // 👈 Needed for next/image to work in static export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storyset.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  trailingSlash: true, // optional but helps with static hosting
};

export default nextConfig;
