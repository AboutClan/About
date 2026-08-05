/* eslint-disable @typescript-eslint/no-explicit-any */

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ComponentType, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import AppDownloadModal from "../../components/overlay/AppDownloadModal";
import FriendInviteModal from "../../components/overlay/FriendInviteModal";
import GatherRecordDrawer from "../../components/overlay/GatherRecordDrawer";
import LimitModal from "../../components/overlay/LimitModal";
import NewbieBenefitModal from "../../components/overlay/NewbieBenefitModal";
import StudyRecordDrawer from "../../components/overlay/StudyRecordDrawer";
import ForceUpdateModal from "../../components/overlay/UpdateModal";
import {
  FRIEND_INVITE_AT,
  GATHER_REVIEW_MODAL_ID,
  HOME_APP_REVIEW_POPUP_AT,
  HOME_POPUP_DAILY_COUNT,
  MEMBERSHIP_AT,
} from "../../constants/keys/localStorage";
import { STUDY_ATTEND_AT } from "../../constants/keys/queryKeys";
import { MODAL_QUEUE_PRIORITY } from "../../constants/modalQueuePriority";
import { useToast } from "../../hooks/custom/CustomToast";
import { useSingleModalSlot } from "../../hooks/custom/useSingleModalSlot";
import { usePushServiceInitialize } from "../../hooks/FcmManger/mutaion";
import { useGatherReviewOneQuery } from "../../hooks/gather/queries";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import {
  usePointSubLogQuery,
  useUserInfoQuery,
  useUserMembershipLogQuery,
} from "../../hooks/user/queries";
import { hasShownHomeAutoPopupState } from "../../recoils/modalQueueRecoils";
import { CloseProps } from "../../types/components/modalTypes";
import { isPWA } from "../../utils/appEnvUtils";
import { checkAndSetLocalStorage } from "../../utils/storageUtils";
import { isApp, isMobileWeb } from "../../utils/validationUtils";
import HomeAppReviewRewardDrawer, { HOME_APP_REVIEW_REWARD_SUB } from "./HomeAppReviewRewardDrawer";

// 홈 화면 진입 시 자동으로 뜰 수 있는 팝업을 모두 여기 한곳에서 관리한다.
// 배열이 아니라 값 하나만 유지해, 여러 조건이 동시에 만족되어도 아래 useEffect의
// 체크 순서(=노출 우선순위)에서 가장 먼저 만족하는 팝업 "하나"만 선택된다.
type HomePopupType =
  | "forceUpdate"
  | "limit"
  | "membership"
  | "friend"
  | "gatherReview"
  | "studyRecord"
  | "appReview"
  | "appDownload";

interface HomePopupProps extends CloseProps {
  date?: unknown;
  id?: string;
}

const HOME_POPUP_COMPONENTS: Record<HomePopupType, ComponentType<HomePopupProps>> = {
  forceUpdate: ForceUpdateModal,
  limit: LimitModal,
  membership: NewbieBenefitModal,
  friend: FriendInviteModal,
  gatherReview: GatherRecordDrawer,
  studyRecord: StudyRecordDrawer,
  appReview: HomeAppReviewRewardDrawer,
  appDownload: AppDownloadModal,
};

// 하루에 이 체인(강제 업데이트 제외)이 보여줄 수 있는 팝업 최대 개수.
const HOME_POPUP_DAILY_LIMIT = 2;

const getTodayHomePopupCount = (): number => {
  const raw = localStorage.getItem(HOME_POPUP_DAILY_COUNT);
  if (!raw) return 0;

  const { date, count } = JSON.parse(raw);
  return date === dayjs().format("YYYYMMDD") ? count : 0;
};

const increaseTodayHomePopupCount = () => {
  localStorage.setItem(
    HOME_POPUP_DAILY_COUNT,
    JSON.stringify({ date: dayjs().format("YYYYMMDD"), count: getTodayHomePopupCount() + 1 }),
  );
};

function HomeInitialSetting() {
  const { data: session, status: sessionStatus } = useSession();
  const toast = useToast();

  const [isLegacyApp, setIsLegacyApp] = useState(false);
  const compareSemver = (a: string, b: string) => {
    const pa = a.split(".").map(Number);
    const pb = b.split(".").map(Number);

    const len = Math.max(pa.length, pb.length);
    for (let i = 0; i < len; i++) {
      const va = pa[i] || 0;
      const vb = pb[i] || 0;
      if (va > vb) return 1;
      if (va < vb) return -1;
    }
    return 0;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const allowedHosts = [
      "xn--ob0b42knwutje.com",
      "www.xn--ob0b42knwutje.com",
      "카공지도.com",
      "study-about.club",
      "www.study-about.club",
    ];

    const isValidHost = allowedHosts.includes(window.location.hostname);

    if (!isValidHost) return;

    const openExternalBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const currentUrl = window.location.href;

      const isKakaoInApp = /kakaotalk/i.test(userAgent);

      if (!isKakaoInApp) return;

      // Android: 크롬으로 강제 이동 (카카오톡 인앱 브라우저 자체 툴바를 벗어남)
      if (/android/i.test(userAgent)) {
        window.location.href =
          "intent://" +
          currentUrl.replace(/^https?:\/\//, "") +
          "#Intent;scheme=https;package=com.android.chrome;end";
        return;
      }

      // iOS
      window.location.href = "kakaotalk://web/openExternal?url=" + encodeURIComponent(currentUrl);
    };

    openExternalBrowser();
  }, []);

  usePushServiceInitialize({
    uid: session?.user?.uid,
  });
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;
      if (!isApp()) return;
      let data: any;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (data?.name !== "deviceInfo") return;

      const { platform, appVersion } = data;

      if (!platform) return;
      if (!appVersion) {
        setIsLegacyApp(true);
        return;
      }

      // ✅ Android <= 1.3.32
      if (platform === "android" && compareSemver(appVersion, "1.3.32") < 0) {
        setIsLegacyApp(true);
        return;
      }

      if (platform === "ios" && compareSemver(appVersion, "1.1.5") < 0) {
        setIsLegacyApp(true);
        return;
      }

      setIsLegacyApp(false);
    };

    window.addEventListener("message", onMessage);
    document.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("message", onMessage);
    };
  }, []);
  const router = useRouter();

  const isGuest = session
    ? session.user.name === "guest" || session.user.name === "게스트"
    : undefined;

  const { data: userInfo, isLoading: isLoadingUserInfo } = useUserInfoQuery({
    onSuccess(data) {
      if (data.isActive === false) {
        toast("warning", "신규 가입 페이지로 이동합니다.");
        router.push("/register/auth");
        return;
      }
      if (data.role === "secede") {
        toast("warning", "탈퇴한 회원입니다. 재가입 페이지로 이동합니다.");
        router.push("/register/auth");
        return;
      }
      if (data.role === "newUser" || data.role === "cafe_user") {
        router.push("/register/auth");
        return;
      }
      if (data.role === "waiting") {
        router.push("/register/access");
        return;
      }
    },
    onError() {
      toast("warning", "로그인 정보가 없습니다.");
      router.push("/login");
    },
  });
  const { mutate: setRole } = useUserInfoFieldMutation("role", {
    onSuccess() {
      toast("success", "동아리원이 되었습니다.");
    },
  });

  useEffect(() => {
    if (!userInfo?.role) return;

    if (userInfo?.role === "block") {
      router.push("/login");
      toast("error", "활동이 영구 정지된 멤버입니다.");
      return;
    }

    if (userInfo?.role === "newUser") {
      router.push("/register/auth");
      return;
    }

    if (userInfo?.role === "waiting") {
      router.push(`/register/access`);
      return;
    }
    if (userInfo?.role === "human") {
      const isPWALogin = isPWA();
      if (isPWALogin) {
        setRole({ role: "member" });
      }
    }
  }, [userInfo?.role]);

  const [isWeb, setIsWeb] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissed = sessionStorage.getItem("dismiss_app_download_modal") === "1";

    if (dismissed) return;
    if (isGuest !== false) return;

    setIsWeb(isMobileWeb());
  }, [isGuest]);

  // 아래는 예전에 UserSettingPopUp이 별도로 쓰던 데이터들. 팝업 판단을 한곳에서 하기 위해
  // 이 컴포넌트로 가져왔다.
  const { data: gatherReviewData } = useGatherReviewOneQuery();
  const studyRecordStr =
    typeof window !== "undefined" ? localStorage.getItem(STUDY_ATTEND_AT) : null;
  const studyRecord = studyRecordStr ? JSON.parse(studyRecordStr) : null;
  const { data: membershipLog, isLoading: isLoadingMembership } = useUserMembershipLogQuery();
  const { data: appReviewRewardLog } = usePointSubLogQuery(HOME_APP_REVIEW_REWARD_SUB, {
    enabled: isApp(),
  });

  const [activePopup, setActivePopup] = useState<HomePopupType | null>(null);
  // 아직 한 번도 최종 판단을 내리지 않았음을 나타낸다. 데이터가 캐시로 즉시 도착해도 이 판단은
  // useEffect가 한 번 실행돼야 반영되므로, 그 사이의 짧은 틈에도 homePopups 자리를 계속
  // 예약해두기 위해 별도로 추적한다(아래 isActive 참고).
  const [hasDecidedPopup, setHasDecidedPopup] = useState(false);
  const hasShownHomeAutoPopup = useRecoilValue(hasShownHomeAutoPopupState);
  const setHasShownHomeAutoPopup = useSetRecoilState(hasShownHomeAutoPopupState);

  // activePopup이 강제 업데이트가 아닌 무언가로 확정되면(=실제로 하나를 보여주기로 함) 이
  // 방문에서 "자동 팝업을 이미 하나 보여줬다"는 전역 플래그를 켠다. 이 팝업을 닫아도 플래그는
  // 꺼지지 않아, 뒤이어 다른 자동 팝업이 이어서 뜨는 일을 막는다. 같은 타이밍에 오늘 이
  // 체인이 보여준 팝업 개수도 하루 최대치(HOME_POPUP_DAILY_LIMIT)를 세도록 1 늘린다.
  // 강제 업데이트는 기술적으로 강제 노출되는 게이트일 뿐 이 배타/카운트 대상이 아니라서
  // 제외한다(닫으면 나머지 순위를 다시 판단해야 하므로). /home을 벗어나면(언마운트) 다음
  // 방문을 위해 플래그를 초기화한다(하루 카운트 자체는 localStorage에 남아 유지된다).
  useEffect(() => {
    if (activePopup !== null && activePopup !== "forceUpdate") {
      setHasShownHomeAutoPopup(true);
      increaseTodayHomePopupCount();
    }
  }, [activePopup, setHasShownHomeAutoPopup]);

  useEffect(() => {
    return () => setHasShownHomeAutoPopup(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2~8순위 판단에 쓰이는 데이터가 전부 도착했는지 여부.
  const isCorePopupDataReady =
    sessionStatus !== "loading" &&
    !isLoadingUserInfo &&
    gatherReviewData !== undefined &&
    !isLoadingMembership;

  // 2~7순위: 기존 UserSettingPopUp이 담당하던 팝업들. 위에서부터 순서대로 검사해 가장 먼저
  // 만족하는 조건 하나만 고른다. isCorePopupDataReady가 true일 때만 호출되므로 여기서 다시
  // 로딩 여부를 확인할 필요는 없다.
  const decideHomePopup = (): HomePopupType | null => {
    // 이 체인(강제 업데이트 제외)은 하루에 최대 HOME_POPUP_DAILY_LIMIT개까지만 보여준다.
    if (getTodayHomePopupCount() >= HOME_POPUP_DAILY_LIMIT) return null;

    // (원래 게이트: userInfo가 있고 게스트가 아닐 것 / 후기 데이터와 세션이 로딩 완료됐을 것)
    if (userInfo && !isGuest && session) {
      if (userInfo.point <= 0) return "limit";

      if (!membershipLog?.length && !checkAndSetLocalStorage(MEMBERSHIP_AT, 5)) {
        return "membership";
      }

      if (
        gatherReviewData &&
        localStorage.getItem(GATHER_REVIEW_MODAL_ID) !== gatherReviewData.id + ""
      ) {
        localStorage.setItem(GATHER_REVIEW_MODAL_ID, gatherReviewData.id + "");
        return "gatherReview";
      }

      if (
        studyRecord &&
        dayjs(studyRecord)?.isBefore(dayjs().startOf("day")) &&
        dayjs(studyRecord)?.add(1, "week").isAfter(dayjs())
      ) {
        return "studyRecord";
      }
      if (!checkAndSetLocalStorage(FRIEND_INVITE_AT, 7)) return "friend";

      if (
        isApp() &&
        appReviewRewardLog === false &&
        !checkAndSetLocalStorage(HOME_APP_REVIEW_POPUP_AT, 14)
      ) {
        return "appReview";
      }
    }

    // 8순위: 앱 설치 유도 (기존 AppDownloadModal 조건, 독립적인 게이트)
    if (isWeb && isGuest === false) return "appDownload";

    return null;
  };

  // 홈 화면에서 자동으로 뜨는 모든 팝업의 노출 우선순위를 결정한다. 판단에 필요한 데이터가
  // 모두 도착한 뒤, 딱 한 번만 계산해서 activePopup을 확정한다.
  useEffect(() => {
    // 1순위: 강제 업데이트 — 만족하면 나머지 순위는 전혀 검사하지 않는다.
    if (isLegacyApp) {
      setActivePopup(isApp() ? "forceUpdate" : null);
      setHasDecidedPopup(true);
      return;
    }

    // 이미 한 번 확정했다면 다시 계산하지 않는다. userInfo/session/membershipLog 등은
    // react-query/next-auth가 백그라운드 리패치 때마다 새 객체 참조를 내려줘서 이 effect를
    // 다시 실행시킬 수 있는데, decideHomePopup 내부의 checkAndSetLocalStorage는 호출할 때마다
    // 로컬스토리지에 "방금 봤음" 타임스탬프를 새로 남기는 부수효과가 있다. 재계산을 허용하면
    // 두 번째 호출에서 방금 자신이 찍은 타임스탬프 때문에 조건이 뒤바뀌어 activePopup이
    // (예: friend → appDownload/null) 흔들리고, 그 틈에 homePopups 자리가 풀려
    // 낮은 우선순위 후보(homeActivityDrawer 등)가 끼어드는 문제가 생긴다.
    if (hasDecidedPopup) return;

    // 판단에 필요한 데이터가 모두 도착하기 전까지는 아무것도 확정하지 않는다.
    if (!isCorePopupDataReady) return;

    // 강제 업데이트 다음으로는 homeActivityIntro('내 취향의 소모임 찾기')가 최우선이다.
    // 그게 이미 이 방문에서 뜨기로 결정됐다면(hasShownHomeAutoPopup), 이 체인(유저 설정
    // 팝업들/앱 설치 유도)은 아무것도 보여주지 않는다.
    if (hasShownHomeAutoPopup) {
      setActivePopup(null);
      setHasDecidedPopup(true);
      return;
    }

    setActivePopup(decideHomePopup());
    setHasDecidedPopup(true);
  }, [
    isLegacyApp,
    isCorePopupDataReady,
    hasShownHomeAutoPopup,
    userInfo,
    isGuest,
    gatherReviewData,
    session,
    membershipLog,
    studyRecord,
    appReviewRewardLog,
    isWeb,
  ]);

  // 최종 판단이 나기 전(hasDecidedPopup=false)에는 "이 화면엔 아직 결정 안 된 팝업이 있을 수
  // 있다"는 상태로 대기열의 homePopups 자리를 계속 예약해둔다. 그렇지 않으면 그 틈에
  // homeActivityDrawer가 먼저 떴다가 판단이 끝난 뒤 밀려나는 깜빡임이 생긴다. (강제 업데이트
  // 다음으로 최우선인 homeActivityIntro는 이 예약과 무관하게, 자신의 조건이 되면 곧바로 뜬다.)
  const isHomePopupDecisionPending = !hasDecidedPopup;

  // 강제 업데이트만 예외적으로 homeActivityIntro보다도 우선한다. activePopup이 forceUpdate일
  // 때만 최우선 순위를 쓰고, 그 외(유저 설정 팝업들/앱 설치 유도)는 homeActivityIntro보다
  // 낮은 순위를 써서, homeActivityIntro가 뜨기로 결정되면 이 체인이 밀리도록 한다.
  const homePopupsPriority =
    activePopup === "forceUpdate"
      ? MODAL_QUEUE_PRIORITY.homeForceUpdate
      : MODAL_QUEUE_PRIORITY.homePopups;

  // 소모임 둘러보기 안내(HomeActivityIntroPopup) 등 다른 화면의 팝업과도 동시에
  // 뜨지 않도록 전역 팝업 대기열에 후보로 등록한다.
  const isActive = useSingleModalSlot(
    "homePopups",
    homePopupsPriority,
    isHomePopupDecisionPending || activePopup !== null,
  );

  const closeActivePopup = () => {
    if (activePopup === "forceUpdate") {
      setIsLegacyApp(false);
      // 강제 업데이트 때문에 미뤄뒀던 나머지 순위를 닫은 뒤 한 번만 다시 판단한다.
      setHasDecidedPopup(false);
    }
    if (activePopup === "appDownload") {
      sessionStorage.setItem("dismiss_app_download_modal", "1");
      setIsWeb(false);
    }
    setActivePopup(null);
  };

  if (!isActive || !activePopup) return null;

  const Component = HOME_POPUP_COMPONENTS[activePopup];
  const props: Omit<HomePopupProps, "onClose"> =
    activePopup === "studyRecord"
      ? { date: studyRecord }
      : activePopup === "gatherReview"
      ? { date: gatherReviewData?.date, id: gatherReviewData?.id + "" }
      : {};

  return <Component {...props} onClose={closeActivePopup} />;
}

export default HomeInitialSetting;
