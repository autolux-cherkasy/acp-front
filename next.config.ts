import type { NextConfig } from "next";

function getApiRemotePattern() {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!rawApiUrl) return undefined;

  try {
    const url = new URL(rawApiUrl);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: "/uploads/**",
    };
  } catch {
    return undefined;
  }
}

const apiRemotePattern = getApiRemotePattern();

// Backend origin the /api/v1 and /uploads paths are proxied to, so the browser
// always talks to its own origin and never triggers CORS.
const apiProxyTarget = process.env.API_PROXY_TARGET?.trim().replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: apiRemotePattern ? [apiRemotePattern] : [],
  },
  async rewrites() {
    if (!apiProxyTarget) return [];

    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiProxyTarget}/api/v1/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${apiProxyTarget}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
