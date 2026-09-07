/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 15는 상위 디렉터리의 무관한 lockfile을 workspace root로 추론할 수 있다.
  // 빌드 트레이스 기준점을 이 프로젝트로 명시 고정한다.
  outputFileTracingRoot: __dirname,

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "guide.about20s.club",
          },
        ],
        destination:
          "https://mewing-sombrero-e36.notion.site/13d86fb9086b80039300e211948103c7?pvs=73",
        permanent: false,
      },
      {
        source: "/SUMMER-MT",
        destination:
          "https://mewing-sombrero-e36.notion.site/About-Summer-MT-2026-37086fb9086b809bb537cf4166338d54?pvs=74",
        permanent: false,
      },

      {
        source: "/partner",
        destination: "https://study-about.club/user?activityDrawer=benefit",
        permanent: false,
      },
    ];
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/:path*",
  //       has: [
  //         {
  //           type: "host",
  //           value: "studyabout.herokuapp.com",
  //         },
  //       ],
  //       destination: "https://about-front.kro.kr/:path*",
  //       permanent: true,
  //     },
  //     {
  //       source: "/:path*",
  //       has: [
  //         {
  //           type: "host",
  //           value: "about-front.kro.kr",
  //         },
  //       ],
  //       destination: "/:path*",
  //       permanent: false, // 기존 요청 유지
  //     },
  //   ];
  // },
  // output: "standalone",
  images: {
    unoptimized: true,

    // 2) 최신 포맷으로 자동 변환 (용량↓)
    formats: ["image/avif", "image/webp"],

    domains: [
      "study-about.club",
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
    deviceSizes: [320, 450], // 반응형은 모바일 maxW까지만
    imageSizes: [16, 32, 40, 48, 60, 72, 80, 120, 240, 300, 360, 450, 600],
  },

  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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

module.exports = nextConfig;
