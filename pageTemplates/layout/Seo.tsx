import Head from "next/head";

interface ISeo {
  title: string;
}

function Seo({ title }: ISeo) {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}

export default Seo;
