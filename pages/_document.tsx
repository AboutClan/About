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
