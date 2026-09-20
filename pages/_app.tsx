import "dayjs/locale/ko";
import "@/styles/globals.css";
import "@/styles/variable.css";

import { ChakraProvider } from "@chakra-ui/react";
import dayjs from "dayjs";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

import Layout from "@/pageTemplates/layout/Layout";
import theme from "@/theme";

dayjs.locale("ko");

const DEFAULT_TITLE = "어바웃: 20대 커뮤니티형 동아리";
const CAFE_MAP_TITLE = "카공지도 | 내 근처 카공 카페 찾기";

/**
 * 카공지도로 노출돼야 하는 경로인지.
 * "/" 는 카공지도.com 루트 전용이다. about20s.club 의 "/" 는 getServerSideProps 에서
 * /home 으로 보내므로 여기까지 렌더되지 않는다. (pages/index.tsx 참고)
 */
const isCafeMapRoute = (pathname: string) =>
  pathname === "/" || pathname === "/cafe-map" || pathname.startsWith("/cafe-map/");

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
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
        {/* 구글 검색결과 제목은 og:title 이 아니라 <title> 을 본다.
            Layout 이 토큰 없는 SSR 에서는 children 을 렌더하지 않아 페이지의 next/head 가
            서버 HTML 에 안 실린다. 그래서 카공지도 분기를 Layout 바깥인 여기서 처리한다. */}
        <title>{isCafeMapRoute(router.pathname) ? CAFE_MAP_TITLE : DEFAULT_TITLE}</title>
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
