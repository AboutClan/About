import "dayjs/locale/ko";
import "../styles/globals.css";
import "../styles/variable.css";

import { ChakraProvider } from "@chakra-ui/react";
import dayjs from "dayjs";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

dayjs.locale("ko");

import Script from "next/script";

import Layout from "../pageTemplates/layout/Layout";
import theme from "../theme";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 2,
            staleTime: 1 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
          },
        },
      }),
  );

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover"
        />
      </Head>
      {/* ✅ 가이드 그대로: jQuery 먼저 */}
      <Script src="https://code.jquery.com/jquery-1.12.4.min.js"></Script>

      {/* ✅ 가이드 그대로: cookiepayments 다음 */}
      <Script src="https://www.cookiepayments.com/js/cookiepayments-1.1.4.js"></Script>

      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <SessionProvider session={session}>
            <RecoilRoot>
              <ChakraProvider theme={theme}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ChakraProvider>
            </RecoilRoot>
          </SessionProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default App;
