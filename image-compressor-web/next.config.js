/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: { apiURL: "https://localhost:44340/api" },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "azurecampstorage.blob.core.windows.net",
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
