/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  scope: "/app",
});

// images configuration
const nextConfig = {
  images: {
    domains: ['194.5.188.48'], // image host
  },
  ...pwaConfig,
};

export default nextConfig;
