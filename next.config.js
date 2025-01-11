/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires

const isProduction = process.env.NODE_ENV === "production";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa")({
  dest: "public",
  disable: typeof window === "undefined" || !isProduction,
  sourcemap: !isProduction,
});
//2
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseNextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "studyabout.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**", // 모든 경로 허용
      },
      {
        protocol: "https",
        hostname: "localhost:3000",
        pathname: "/**", // 모든 경로 허용
      },
      {
        protocol: "https",
        hostname: "user-images.githubusercontent.com",
        pathname: "/**", // 모든 경로 허용
      },
      {
        protocol: "https",
        hostname: "p.kakaocdn.net",
        pathname: "/**", // 모든 경로 허용
      },
      {
        protocol: "http",
        hostname: "p.kakaocdn.net",
        pathname: "/**", // 모든 경로 허용
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
        pathname: "/**", // 모든 경로 허용
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
        pathname: "/**", // 모든 경로 허용
      },
      {
        protocol: "http",
        hostname: "t1.kakaocdn.net",
        pathname: "/**", // 모든 경로 허용
      },
      {
        protocol: "http",
        hostname: "img1.kakaocdn.net",
        pathname: "/**", // 모든 경로 허용
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
        pathname: "/**", // 모든 경로 허용
      },
    ],
    deviceSizes: [320, 420, 768, 1024, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  compiler: {
    styledComponents: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Set-Cookie",
            value: "cookieName=cookieValue; Path=/; HttpOnly; Secure; SameSite=None;",
          },
        ],
      },
    ];
  },
};

const nextConfig = withPWA(baseNextConfig);

module.exports = nextConfig;
