const s3Origin = "https://studyabout.s3.ap-northeast-2.amazonaws.com";

export default function loader({ src, width, quality }) {
  const url = new URL(src);
  const isS3Url = url.origin === s3Origin;

  if (isS3Url) {
    return `https://d15r8f9iey54a4.cloudfront.net${url.pathname}`;
  }

  // NOTE
  // Next.js에 의해 최적화된 이미지를 요청하는 URL
  // S3가 아닌 나머지 이미지는 최적화를 거쳐 웹서버에서 이미지를 가져오도록 함
  // Next.js 내부 구현에 의존한거라 Hacky한 방식
  return `/_next/image/?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
``;
