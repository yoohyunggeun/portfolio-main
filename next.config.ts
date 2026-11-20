import type { NextConfig } from "next";

const config: NextConfig = {
  async headers() {
    return [
      ...["/", "/work/:path*", "/access", "/admin/:path*", "/protected/:path*", "/invite/:path*"].map(source => ({
        source, headers: [{ key: "Cache-Control", value: "private, no-store" }],
      })),
      { source: "/invite/:path*", headers: [{ key: "Referrer-Policy", value: "no-referrer" }] },
    ];
  },
};

export default config;
