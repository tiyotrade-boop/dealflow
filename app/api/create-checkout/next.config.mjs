/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep firebase-admin out of the webpack bundle. Next.js otherwise tries to
  // bundle its internals for the serverless target, which mangles its exports
  // and causes "adminDb is not a function" / "is not defined" errors at runtime.
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin"],
  },
};

module.exports = nextConfig;