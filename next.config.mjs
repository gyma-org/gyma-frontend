/** @type {import('next').NextConfig} */
<<<<<<< HEAD
const nextConfig = {};
=======
import withPWA from 'next-pwa';

// PWA configuration
const nextConfig = withPWA({
  dest: 'public',  // Destination for PWA assets (like service worker)
  // disable: process.env.NODE_ENV === 'development',  // Disable PWA in development mode
  register: true,  // to register Service Worker
  skipWaiting: true, // register faster
});
>>>>>>> b0a01eb90408b4f555e3a74079add9668bf969a9

export default nextConfig;
