import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { IFooterOptions, ModalLayout } from "../modals/Modals";
import Seo from "../pageTemplates/layout/Seo";
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
  const title = "ABOUT 카공 지도";
  const description = "카공 장소 고민, 이제 여기서 끝내세요!";
  const url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/study-cafe-map`;
  const image = "https://studyabout.s3.ap-northeast-2.amazonaws.com/기타/cafe-map.png";
  return (
    <>
      <Seo title={title} description={description} url={url} image={image} />
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
export async function getServerSideProps() {
  console.log(2);
  return { props: {} }; // 빈 props라도 OK (SSR 강제)
}

export default StudyMap;
