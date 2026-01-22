/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === "production";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: !isProduction,
  sourcemap: !isProduction,
});

const nextConfig = withPWA({
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    domains: [
      "study-about.club",
      "localhost",
      "studyabout.s3.ap-northeast-2.amazonaws.com",
      "p.kakaocdn.net",
      "k.kakaocdn.net",
      "user-images.githubusercontent.com",
      "img1.kakaocdn.net",
      "t1.kakaocdn.net",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "studyabout.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "user-images.githubusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "p.kakaocdn.net", pathname: "/**" },
      { protocol: "http", hostname: "p.kakaocdn.net", pathname: "/**" },
      { protocol: "https", hostname: "k.kakaocdn.net", pathname: "/**" },
      { protocol: "http", hostname: "k.kakaocdn.net", pathname: "/**" },
      { protocol: "http", hostname: "t1.kakaocdn.net", pathname: "/**" },
      { protocol: "http", hostname: "img1.kakaocdn.net", pathname: "/**" },
      { protocol: "https", hostname: "*.cloudfront.net", pathname: "/**" },
    ],
    deviceSizes: [320, 450],
    imageSizes: [16, 32, 40, 48, 60, 72, 80, 120, 240, 300, 360, 450, 600],
  },

  compiler: { styledComponents: true },

  async headers() {
    return [];
  },
});

module.exports = nextConfig;
