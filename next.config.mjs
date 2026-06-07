/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Build não deve falhar por lint em CI/Render; rode `npm run lint` manualmente.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
