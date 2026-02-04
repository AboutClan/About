import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect } from "react";

import { GROUP_OG_MAPPING } from "../group/[id]";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = String(ctx.params?.id ?? "");
  const groupId = String(ctx.query?.groupId ?? "");
  const m = GROUP_OG_MAPPING[groupId];

  const og = groupId
    ? {
        title: `번개 모임`,
        description: m?.title
          ? `[${m.title}]에서 진행하는 번개 모임!`
          : "공유된 번개 모임을 확인해보세요!",
        url: `https://about20s.club/s/gather/${id}?groupId=${groupId}`,
        image:
          m?.image ??
          "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%ED%83%80/thumbnail.jpg",
      }
    : {
        title: "번개 모임",
        description: "공유된 번개 모임을 확인해보세요!",
        url: `https://about20s.club/gather/${id}`,
        image:
          "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%ED%83%80/thumbnail.jpg",
      };

  return {
    props: { id, og, groupId },
  };
};

export default function ShareParticipationsGroup({ id, og, groupId }) {
  useEffect(() => {
    if (!id) return;
  window.location.replace(`https://about20s.club/_open?dl=gather/${id}`);
  }, [id, groupId]);

  return (
    <>
      <Head>
        <meta property="og:title" content={og.title} key="og:title2" />

        <meta property="og:description" content={og.description} key="og:description2" />

        <meta property="og:image" content={og.image} key="og:image2" />
        <meta property="og:url" content={og.url} key="og:url2" />
      </Head>
    </>
  );
}
