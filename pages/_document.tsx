import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript
} from "next/document";
import Script from "next/script";
import { Fragment } from "react";
import { ServerStyleSheet } from "styled-components";

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
          <meta property="og:type" content="website" key="og:type" />
          <meta property="og:title" content="ABOUT" key="og:title" />
          <meta property="og:url" content={process.env.NEXT_PUBLIC_NEXTAUTH_URL} key="og:url" />
          <meta
            property="og:description"
            content="20대 모임 끝.판.왕! 스터디, 취미, 친목, 취업 등. 너가 찾던 모든 모임을 한 곳에!"
            key="og:description"
          />
          <meta property="og:image" content="/images/thumbnail.jpg" key="og:image" />
          <meta property="og:locale" content="ko_KR" key="og:locale" />
          <meta
            property="og:site_name"
            content={process.env.NEXT_PUBLIC_NEXTAUTH_URL}
            key="og:site_name"
          />
          <meta charSet="utf-8" key="charset" />
          <Script src="https://kit.fontawesome.com/4071928605.js" crossOrigin="anonymous"></Script>
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script
            src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=kyi1yirf4s&submodules=geocoder"
            strategy="beforeInteractive"
          ></Script>
        </body>
      </Html>
    );
  }
}
