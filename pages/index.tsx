import { GetServerSideProps } from "next";

function Index() {
  return null;
}
export default Index;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: `/home`,
    },
    props: {},
  };
};
