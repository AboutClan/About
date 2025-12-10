import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { gaEvent } from "../libs/gtag";
import { IFooterOptions, ModalLayout } from "../modals/Modals";
import StudyPageMap from "../pageTemplates/studyPage/studyPageMap/StudyPageMap";

function StudyMap() {
  const { data: session } = useSession();

  const router = useRouter();
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inappdenyExecVanillajs = (callback: any) => {
      if (document.readyState !== "loading") callback();
      else document.addEventListener("DOMContentLoaded", callback);
    };

    inappdenyExecVanillajs(() => {
      const useragt = navigator.userAgent.toLowerCase();
      const targetUrl = location.href;

      // 카카오톡 or 인스타그램 인앱 브라우저 감지
      const isInAppBrowser = useragt.includes("instagram");
      if (isInAppBrowser) {
        if (useragt.includes("instagram")) {
          alert(
            "인스타그램 내에서는 일부 기능이 제한됩니다.\n외부 브라우저로 열면 더 원활하게 이용할 수 있어요!",
          );
          window.open(targetUrl, "_blank");
        }
      }
    });
  }, []);

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
      func: () => {
        localStorage.setItem("moving", "cafe-map");
        gaEvent("cafe-map-moving");
        router.push("/home");
      },
    },
    sub: {
      text: "닫 기",
    },
  };

  return (
    <>
      <StudyPageMap isDefaultOpen onClose={onClose} isDown isCafeMap />
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
