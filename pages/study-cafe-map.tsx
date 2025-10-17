import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { IFooterOptions, ModalLayout } from "../modals/Modals";
import StudyPageMap from "../pageTemplates/studyPage/studyPageMap/StudyPageMap";

function StudyMap() {
  const { data: session } = useSession();

  const router = useRouter();
  const [isModal, setIsModal] = useState(false);
  console.log(3, session);

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
