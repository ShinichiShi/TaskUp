/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.freepik.com", 
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com", 
      },
    ],
  },
};

module.exports = nextConfig;