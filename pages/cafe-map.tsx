import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import CafeMapBottomNav from "../components/CafeMapBottomNav";
import { gaEvent } from "../libs/gtag";
import { IFooterOptions, ModalLayout } from "../modals/Modals";
import CafeMapArchivePage from "../pageTemplates/studyPage/CafeMapArchivePage";
import CafeMapFeedPage from "../pageTemplates/studyPage/CafeMapFeedPage";
import CafeMapMyPage from "../pageTemplates/studyPage/CafeMapMyPage";
import CafeMapStudyPage from "../pageTemplates/studyPage/CafeMapStudyPage";
import StudyPageMap from "../pageTemplates/studyPage/studyPageMap/StudyPageMap";

function StudyMap() {
  const { data: session } = useSession();

  const router = useRouter();
  const [isModal, setIsModal] = useState(false);
  const [isGuestModal, setIsGuestModal] = useState(false);

  const activeTab = (router.query.tab as string) || "map";

  useEffect(() => {
    // 게스트 세션 자동 생성. redirect: false 가 핵심 —
    // 디폴트 redirect:true 는 /api/auth/callback/guest → /cafe-map 풀 네비게이션을 일으켜
    // 디바이스 최초 진입 시 iOS Kakao 인앱 webview 에서 흰 화면 구간이 길게 노출됨.
    // 쿠키가 한 번 박히면 그 뒤로는 session !== null 이라 이 분기 자체를 안 탐.
    const temp = async () => {
      await signOut({ redirect: false });
      await signIn("guest", { redirect: false });
    };

    if (session === null) {
      temp();
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
      {activeTab === "map" && <StudyPageMap isDefaultOpen onClose={onClose} isDown isCafeMap />}
      {activeTab === "feed" && <CafeMapFeedPage />}
      {activeTab === "bookmark" && <CafeMapArchivePage />}
      {activeTab === "study" && <CafeMapStudyPage />}
      {activeTab === "profile" && <CafeMapMyPage />}
      <CafeMapBottomNav />
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
