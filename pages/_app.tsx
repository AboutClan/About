import "dayjs/locale/ko";
import "../styles/globals.css";
import "../styles/variable.css";

import { ChakraProvider } from "@chakra-ui/react";
import dayjs from "dayjs";
import { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

import Layout from "../pageTemplates/layout/Layout";
import theme from "../theme";

dayjs.locale("ko");

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
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
        {/* 브라우저 탭 title 기본값. 페이지별로 덮어쓰고 싶으면 해당 페이지에서 next/head 의 <title> 로 override. */}
        <title>어바웃: 20대를 위한 모임 플랫폼</title>
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

export default MyApp;
