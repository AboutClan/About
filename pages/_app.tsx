import "dayjs/locale/ko";
import "../styles/globals.css";
import "../styles/variable.css";

import { ChakraProvider } from "@chakra-ui/react";
import dayjs from "dayjs";
import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

import Layout from "../pageTemplates/layout/Layout";
import theme from "../theme";

dayjs.locale("ko");

type CustomAppProps = AppProps & {
  host?: string;
};

function MyApp({ Component, pageProps: { session, ...pageProps }, host }: CustomAppProps) {
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

      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <SessionProvider session={session}>
            <RecoilRoot>
              <ChakraProvider theme={theme}>
                <Layout host={host}>
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

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    host: appContext.ctx.req?.headers.host,
  };
};

export default MyApp;
