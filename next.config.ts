import type { NextConfig } from "next";

/**
 * Set NEXT_PUBLIC_BASE_PATH=/appointment to serve this app under
 * datacrumbs.org/appointment. Leave it unset for local development so the app
 * stays at the root. See README-DEPLOY.md for the rewrite the main site needs.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  basePath,
};

export default nextConfig;
