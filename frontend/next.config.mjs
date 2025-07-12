/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',       // ← wichtig für Docker‑Build
};
export default nextConfig;
