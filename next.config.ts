import type { NextConfig } from "next";

const config: NextConfig = {
  async headers() {
    return [
      ...[
        "/",
        "/experience/:path*",
        "/skills",
        "/contact",
        "/build-log/:path*",
        "/privacy",
        "/learning",
        "/work/:path*",
        "/lab/:path*",
        "/demos/:path*",
        "/access/:path*",
        "/admin/:path*",
        "/protected/:path*",
        "/invite/:path*",
      ].map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      })),
      {
        source: "/invite/:path*",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
    ];
  },
};

export default config;
