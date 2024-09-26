import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import Script from "next/script";
import { Fragment } from "react";
import { ServerStyleSheet } from "styled-components";

const NEXT_PUBLIC_NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [
          <Fragment key="styles">
            {initialProps.styles}
            {sheet.getStyleElement()}
          </Fragment>,
        ],
      };
    } finally {
      sheet.seal();
    }
  }
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            href="/fonts/subsetAppleSDGothicNeoB.woff2"
            as="font"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/subsetAppleSDGothicNeoR.woff2"
            as="font"
            crossOrigin="anonymous"
          />
          <link rel="manifest" href="/manifest.json" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="ABOUT" />
          <meta property="og:url" content="https://studyabout.herokuapp.com" />
          <meta property="og:description" content="대학생 스터디 동아리" />
          <meta property="og:image" content="/ogImage.jpg" />
          <meta property="og:locale" content="ko_KR" />
          <meta property="og:site_name" content="https://studyabout.herokuapp.com" />
          <meta charSet="utf-8" key="charset" />{" "}
          <Script src="https://kit.fontawesome.com/4071928605.js" crossOrigin="anonymous"></Script>
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script
            src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NEXT_PUBLIC_NAVER_CLIENT_ID}`}
            strategy="beforeInteractive"
          />
        </body>
      </Html>
    );
  }
}
