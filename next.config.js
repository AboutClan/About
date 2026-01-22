/** @type {import('next').NextConfig} */
import withPWAInit from "next-pwa";

const isProduction = process.env.NODE_ENV === "production";

const withPWA = withPWAInit({
  dest: "public",
  disable: !isProduction,
  sourcemap: !isProduction,
});

const nextConfig = withPWA({
  // ✅ env: {} 블록은 제거 권장
  // - NEXT_PUBLIC_* 는 빌드 타임에 박히고
  // - 서버 전용 변수는 런타임에 process.env로 읽는 게 안전함

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

  compiler: {
    styledComponents: true,
  },

  // ⚠️ Set-Cookie를 headers()로 박는 건 보통 역효과가 많아서 추천 안 함.
  // 지금 네가 쿠키 처리 때문에 넣은 거라면, 실제로 원하는 쿠키를 여기서 "고정값"으로 넣으면 의미가 없음.
  // 필요하면 API 응답(NextAuth/서버)에서 Set-Cookie로 내려야 함.
  async headers() {
    return [];
  },
});

module.exports = nextConfig;
