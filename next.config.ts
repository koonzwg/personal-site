import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Renders the resume PDF on the server; keep it out of the bundler.
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
