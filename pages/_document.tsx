import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
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
          <meta property="og:locale" content="ko_KR" key="og:locale" />
          <meta
            property="og:site_name"
            content={process.env.NEXT_PUBLIC_NEXTAUTH_URL}
            key="og:site_name"
          />
          <meta charSet="utf-8" key="charset" />

          <script src="https://www.cookiepayments.com/js/cookiepayments-1.1.4.js" defer></script>
          {/* <script src="https://sandbox.cookiepayments.com/js/cookiepayments-1.1.4.js"></script> */}

          <script
            defer
            src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=kyi1yirf4s&submodules=geocoder"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
