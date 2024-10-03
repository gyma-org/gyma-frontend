/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";
import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  scope: "/app",
});

export default {
  ...pwaConfig,
};
