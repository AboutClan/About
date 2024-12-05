import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

function Index() {
  return null;
}
export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: `/home`,
      },
      props: {},
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: "/login?from=/",
    },
    props: {},
  };
};
