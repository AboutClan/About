import Head from "next/head";

interface ISeo {
  title: string;
  description?: string;
  url?: string; // 절대 URL
  image?: string; // 절대 URL (https)
}

function Seo({ title, description, url, image }: ISeo) {
  return (
    <Head>
      {title && <title>{title}</title>}

      {/* 전역에 없으면 아래 3개도 여기 두세요 */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ABOUT" />
      <meta property="og:locale" content="ko_KR" />

      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
    </Head>
  );
}

export default Seo;
