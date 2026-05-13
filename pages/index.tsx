import { GetServerSideProps } from "next";

import CafeMapPage from "./cafe-map";

function Index() {
  return <CafeMapPage />;
}

export default Index;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const host = req.headers.host;

  const isCafeMapDomain = host === "xn--ob0b42knwutje.com" || host === "www.xn--ob0b42knwutje.com";

  if (isCafeMapDomain) {
    return {
      props: {},
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: "/home",
    },
    props: {},
  };
};
