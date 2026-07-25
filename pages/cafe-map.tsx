import dayjs from "dayjs";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import CafeMapBottomNav from "../components/CafeMapBottomNav";
import { CAFE_MAP_REVIEW_POPUP_AT } from "../constants/keys/localStorage";
import { usePointSubLogQuery } from "../hooks/user/queries";
import { gaEvent } from "../libs/gtag";
import { IFooterOptions, ModalLayout } from "../modals/Modals";
import CafeMapAppInstallDrawer from "../pageTemplates/studyPage/CafeMapAppInstallDrawer";
import CafeMapArchivePage from "../pageTemplates/studyPage/CafeMapArchivePage";
import CafeMapFeedPage from "../pageTemplates/studyPage/CafeMapFeedPage";
import CafeMapInstagramRewardModal, {
  CAFE_MAP_INSTAGRAM_REWARD_SUB,
} from "../pageTemplates/studyPage/CafeMapInstagramRewardModal";
import CafeMapMyPage from "../pageTemplates/studyPage/CafeMapMyPage";
import CafeMapReviewRequestDrawer from "../pageTemplates/studyPage/CafeMapReviewRequestDrawer";
import CafeMapStudyPage from "../pageTemplates/studyPage/CafeMapStudyPage";
import StudyPageMap from "../pageTemplates/studyPage/studyPageMap/StudyPageMap";
import { isApp, isMobileWeb } from "../utils/validationUtils";

const REVIEW_POPUP_INTERVAL_DAYS = 7;

function StudyMap() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const [isModal, setIsModal] = useState(false);
  const [isGuestModal, setIsGuestModal] = useState(false);
  const [showAppInstallDrawer, setShowAppInstallDrawer] = useState(false);
  const [showReviewDrawer, setShowReviewDrawer] = useState(false);
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const guestSignInTriedRef = useRef(false);

  const activeTab = (router.query.tab as string) || "map";

  // 카공지도 앱으로 접속해 회원가입을 완료한(role: cafe_user) 유저에게만 조회 —
  // 로그가 없으면(한 번도 지급받지 않았으면) 인스타 팔로우 리워드 팝업을 띄운다.
  const isCafeUser = isApp() && session?.user?.role === "cafe_user";

  const { data: instagramRewardLog } = usePointSubLogQuery(CAFE_MAP_INSTAGRAM_REWARD_SUB, {
    enabled: isCafeUser,
  });

  useEffect(() => {
    if (!isCafeUser) return;
    if (instagramRewardLog === undefined) return;
    if (instagramRewardLog) return;

    setShowInstagramModal(true);
  }, [isCafeUser, instagramRewardLog]);

  useEffect(() => {
    if (isMobileWeb()) {
      const savedAt = localStorage.getItem("cafeMapAppInstallDrawerHidden");
      const hiddenUntil = savedAt ? Number(savedAt) + 24 * 60 * 60 * 1000 : 0;
      if (Date.now() > hiddenUntil) setShowAppInstallDrawer(true);
    }
  }, []);

  useEffect(() => {
    // 카공지도 앱으로 접속한 경우에만 스토어 별점 리뷰를 요청한다.
    if (!isApp()) return;

    const savedAt = localStorage.getItem(CAFE_MAP_REVIEW_POPUP_AT);
    if (savedAt === "DONE") return;
    if (savedAt && dayjs().diff(dayjs(savedAt, "YYYYMMDD"), "day") < REVIEW_POPUP_INTERVAL_DAYS) {
      return;
    }

    setShowReviewDrawer(true);
  }, []);

  useEffect(() => {
    // 게스트 세션 자동 생성. redirect: false 가 핵심 —
    // 디폴트 redirect:true 는 /api/auth/callback/guest → /cafe-map 풀 네비게이션을 일으켜
    // 디바이스 최초 진입 시 iOS Kakao 인앱 webview 에서 흰 화면 구간이 길게 노출됨.
    if (status === "loading") return;
    if (guestSignInTriedRef.current) return;
    if (session) return; // 세션이 있으면(guest/member/newUser 모두) 건드리지 않음

    guestSignInTriedRef.current = true;

    const temp = async () => {
      await signOut({ redirect: false });
      await signIn("guest", { redirect: false });
    };

    temp();
  }, [session, status]);

  const onClose = () => {
    setIsModal(true);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "이 동",
      func: () => {
        localStorage.setItem("moving", "cafe-map");
        gaEvent("cafe_map_moving");
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
      {showAppInstallDrawer && (
        <CafeMapAppInstallDrawer onClose={() => setShowAppInstallDrawer(false)} />
      )}
      {showReviewDrawer && (
        <CafeMapReviewRequestDrawer onClose={() => setShowReviewDrawer(false)} />
      )}
      {showInstagramModal && (
        <CafeMapInstagramRewardModal onClose={() => setShowInstagramModal(false)} />
      )}
    </>
  );
}

export default StudyMap;
