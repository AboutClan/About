import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/globals.css";
import "../styles/variable.css";

import { ChakraProvider } from "@chakra-ui/react";
import { config } from "@fortawesome/fontawesome-svg-core";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

import Layout from "../pageTemplates/layout/Layout";
import theme from "../theme";

config.autoAddCss = false;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryOnMount: true,
      refetchOnReconnect: false,
      retry: 2,
      staleTime: 1 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <RecoilRoot>
            <ChakraProvider theme={theme}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ChakraProvider>
          </RecoilRoot>
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
