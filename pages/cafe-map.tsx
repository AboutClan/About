import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import CafeMapBottomNav from "@/components/CafeMapBottomNav";
import { IFooterOptions, ModalLayout } from "@/components/modals/Modals";
import { CAFE_MAP_INSTALL_POPUP, CAFE_MAP_REVIEW_POPUP } from "@/constants/keys/localStorage";
import CafeMapAppInstallDrawer from "@/features/cafeMap/screens/CafeMapAppInstallDrawer";
import CafeMapCommunityPage from "@/features/cafeMap/screens/CafeMapCommunityPage";
import CafeMapFeedPage from "@/features/cafeMap/screens/CafeMapFeedPage";
import CafeMapMyPage from "@/features/cafeMap/screens/CafeMapMyPage";
import CafeMapRankingPage from "@/features/cafeMap/screens/CafeMapRankingPage";
import CafeMapReviewRequestDrawer from "@/features/cafeMap/screens/CafeMapReviewRequestDrawer";
import CafeMapStudyPage from "@/features/cafeMap/screens/CafeMapStudyPage";
import {
  CAFE_MAP_ENGAGEMENT_EVENT,
  getCafeMapEngagementCount,
  increaseCafeMapVisitCount,
  INSTALL_POPUP_MIN_VISIT,
  isPopupBlocked,
  migrateLegacyPopupState,
  REVIEW_POPUP_MIN_VISIT,
} from "@/features/cafeMap/utils/cafeMapPopup";
import { clearCafeMapSession } from "@/features/cafeMap/utils/cafeMapSession";
import StudyPageMap from "@/features/studyMap/components/StudyPageMap";
import { useBackGuard } from "@/hooks/custom/useBackGuard";
import { gaEvent } from "@/libs/gtag";
import { isApp, isMobileWeb } from "@/utils/validationUtils";

function StudyMap() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const [isModal, setIsModal] = useState(false);
  const [isGuestModal, setIsGuestModal] = useState(false);
  const [showAppInstallDrawer, setShowAppInstallDrawer] = useState(false);
  const [showReviewDrawer, setShowReviewDrawer] = useState(false);
  const guestSignInTriedRef = useRef(false);

  // 게스트 안내 모달도 로컬 state라 히스토리에 없다. 뒤로가기로 닫히게 등록한다.
  // (설치 유도·리뷰 요청 드로어는 각 컴포넌트 안에서 스스로 등록한다.)
  useBackGuard(isModal, () => setIsModal(false));

  const activeTab = (router.query.tab as string) || "map";

  // 진입 횟수는 설치 유도·리뷰 요청 두 팝업의 공통 게이트라 한 곳에서만 올린다.
  const visitCountRef = useRef(0);

  useEffect(() => {
    migrateLegacyPopupState();
    visitCountRef.current = increaseCafeMapVisitCount();

    // 설치 유도: 모바일웹에서만. 첫 진입에 바로 띄우지 않고,
    // 카페 상세를 한 번이라도 봤거나 2회차 진입부터 노출한다.
    if (!isMobileWeb()) return;
    if (isPopupBlocked(CAFE_MAP_INSTALL_POPUP)) return;
    if (visitCountRef.current < INSTALL_POPUP_MIN_VISIT && getCafeMapEngagementCount() < 1) return;

    setShowAppInstallDrawer(true);
  }, []);

  useEffect(() => {
    // 리뷰 요청: 카공지도 앱에서만. 첫 실행부터 묻지 않고,
    // 3회차 이상 진입한 유저가 카페 상세 열람 같은 긍정 행동을 마친 직후에만 노출한다.
    if (!isApp()) return;

    const handleEngagement = () => {
      if (isPopupBlocked(CAFE_MAP_REVIEW_POPUP)) return;
      if (visitCountRef.current < REVIEW_POPUP_MIN_VISIT) return;

      setShowReviewDrawer(true);
    };

    window.addEventListener(CAFE_MAP_ENGAGEMENT_EVENT, handleEngagement);
    return () => window.removeEventListener(CAFE_MAP_ENGAGEMENT_EVENT, handleEngagement);
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
        // 여기가 카공지도를 의도적으로 벗어나는 유일한 지점이다. 표식을 지워야 이후 어바웃
        // 화면들의 뒤로가기가 카공지도로 되돌아오지 않는다.
        clearCafeMapSession();
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
      {activeTab === "ranking" && <CafeMapRankingPage />}
      {activeTab === "study" && <CafeMapStudyPage />}
      {activeTab === "community" && <CafeMapCommunityPage />}
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
    </>
  );
}

export default StudyMap;
