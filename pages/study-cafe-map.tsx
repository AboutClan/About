import Head from "next/head";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { IFooterOptions, ModalLayout } from "../modals/Modals";
import StudyPageMap from "../pageTemplates/studyPage/studyPageMap/StudyPageMap";

function StudyMap() {
  const { data: session } = useSession();

  const router = useRouter();
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    if (session === null) {
      signIn("guest");
    }
  }, [session]);

  const onClose = () => {
    setIsModal(true);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "이 동",
      func: () => router.push("/login"),
    },
    sub: {
      text: "닫 기",
    },
  };

  return (
    <>
      <Head>
        <title>ABOUT 카공 지도</title>
        <meta property="og:title" content="ABOUT 카공 지도" key="og:title" />
        <meta
          property="og:description"
          content="카공 장소 고민, 이제 여기서 끝내세요!"
          key="og:description"
        />
        <meta
          property="og:image"
          content="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%ED%83%80/cafe-map.png"
          key="og:image"
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/study-cafe-map`}
          key="og:url"
        />
      </Head>
      <StudyPageMap isDefaultOpen onClose={onClose} isDown />
      {isModal && (
        <ModalLayout title="안내사항" footerOptions={footerOptions} setIsModal={setIsModal}>
          <p>
            현재 <b>게스트 뷰어</b>를 이용하고 있습니다.
            <br />
            20대 커뮤니티 <b>About</b>으로 이동하시겠습니까?
          </p>
        </ModalLayout>
      )}
    </>
  );
}

export default StudyMap;

export async function getServerSideProps() {
  return { props: {} }; // 빈 props여도 OK — SSR 강제됨
}
