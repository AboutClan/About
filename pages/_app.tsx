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
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
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
      </Head>
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
