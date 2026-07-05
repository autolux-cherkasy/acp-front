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

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: apiRemotePattern ? [apiRemotePattern] : [],
  },
};

export default nextConfig;
