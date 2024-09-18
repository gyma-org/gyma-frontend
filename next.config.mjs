/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

// PWA configuration
const nextConfig = withPWA({
  dest: "public", // Destination for PWA assets (like service worker)
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true, // to register Service Worker
  skipWaiting: true, // register faster
});

export default nextConfig;
