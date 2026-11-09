import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // pdfkit reads its built-in font metrics (AFM) from its package directory at
  // runtime, so it must stay an external package and its data files must be
  // traced into the standalone bundle along with our Cyrillic report fonts.
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/pdfkit/js/data/**/*", "./assets/fonts/**/*"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
