/* eslint-disable @next/next/no-before-interactive-script-outside-document */

import { GoogleAnalytics } from "@next/third-parties/google";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useDeepLink } from "../../@natives/useDeepLink";
import BottomNav from "../../components/BottomNav";
import GuestBottomNav from "../../components/layouts/atoms/GuestBottomNav";
import PageTracker from "../../components/layouts/PageTracker";
import { useToken } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import { useAppSafeAreaBottomCssVar } from "../../hooks/custom/useAppSafeAreaBottomCssVar";
import { HOME_ACTIVITY_DRAWER_QUERY_KEY } from "../../recoils/transferRecoils";
import { clearAuthIntent, isAuthIntentActive } from "../../utils/authIntentUtils";
import { getTodayStr } from "../../utils/dateTimeUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";
import { parseUrlToSegments } from "../../utils/stringUtils";
import { getBottomNavTotalHeight } from "../../utils/validationUtils";
import BaseModal from "./BaseModal";
import BaseScript from "./BaseScript";

export const BASE_BOTTOM_NAV_SEGMENT = ["home", "gather", "user", "studyPage", "community"];
export const NOT_PADDING_NAV_SEGMENT = ["login"];
export const NOT_PADDING_BOTTOM_NAV_SEGMENT = ["vote", "ranking", "board", "studyPageMap"];

const EXIT_DELAY = 2000;

interface BackActionMessage {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ILayout {
  children: React.ReactNode;
}

function Layout({ children }: ILayout) {
  console.log(3535353);
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const segment = pathname?.split("/")?.[1];

  const PUBLIC_SEGMENT = ["register", "login"];

  const { data: session, status } = useSession();
  const token = useToken();
  // document.documentElement에 --app-safe-area-bottom CSS 변수를 설정한다.
  // getSafeAreaBottom()을 쓰는 모든 컴포넌트가 이 변수를 상속받아 쓰므로,
  // 컴포넌트마다 에브리타임 분기를 따로 둘 필요가 없다.
  useAppSafeAreaBottomCssVar();

  useDeepLink({ token });

  axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";

  const currentSegment = parseUrlToSegments(pathname);

  const isBottomNavCondition = useMemo(
    () => BASE_BOTTOM_NAV_SEGMENT.includes(currentSegment?.[0]) && !currentSegment?.[1],
    [currentSegment],
  );

  const isPublicPage =
    PUBLIC_SEGMENT.includes(segment) ||
    pathname === "/user/info/policy" ||
    pathname === "/user/info/privacy" ||
    pathname === "/faq" ||
    pathname?.startsWith("/cafe-map/login") ||
    pathname === "/user/point/charge";

  const isGuest = session?.user.role === "guest";
  const [isErrorModal, setIsErrorModal] = useState(false);

  const guestSignInTriedRef = useRef(false);

  // 인증 완료 시 명시적 로그인 플래그 해제 (OAuth 성공/실패 후 새 페이지 로드로 리셋되지만
  // SPA 내 전환에서도 확실히 정리)
  useEffect(() => {
    if (status === "authenticated") clearAuthIntent();
  }, [status]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (status === "loading") return;
    if (status === "authenticated") return;
    if (token) return;
    if (guestSignInTriedRef.current) return;
    // 카카오·애플 등 명시적 소셜 로그인 진행 중이면 게스트 자동 로그인 건너뜀
    if (isAuthIntentActive()) return;

    guestSignInTriedRef.current = true;

    if (
      PUBLIC_SEGMENT.includes(segment) ||
      pathname === "/user/info/policy" ||
      pathname === "/user/info/privacy" ||
      pathname === "/faq"
    ) {
      return;
    }

    const process = async () => {
      if (isAuthIntentActive()) return;
      await signOut({ redirect: false });
      if (isAuthIntentActive()) return;
      await signIn("guest", {
        redirect: false,
        callbackUrl: router.asPath,
      }).catch((err) => {
        console.error("Guest sign-in failed:", err);
      });
    };

    process();
  }, [status, token, pathname, segment, router.asPath]);

  const exitAppRef = useRef<boolean>(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;

      try {
        const data: BackActionMessage = JSON.parse(event.data);

        if (data.name === "backAction") {
          handleBackAction();
        }
      } catch (error) {
        console.error("Failed to parse message data:", error);
      }
    };

    const handleBackAction = () => {
      const isOverlayOpen =
        !!router?.query?.modal || !!router?.query?.[HOME_ACTIVITY_DRAWER_QUERY_KEY];

      if (!isOverlayOpen) {
        const pathArr = pathname?.split("/");
        const firstPath = pathArr?.[1];
        const secondPath = pathArr?.[2];
        const prevPath = router?.query?.path;

        if (firstPath === "study" && secondPath !== "writing") {
          if (prevPath === "home") {
            router.replace("/home");
          } else {
            router.replace(`/studyPage?date=${getTodayStr()}`);
          }
          return;
        }

        if (firstPath === "gather" && secondPath && secondPath !== "writing") {
          if (prevPath === "home") {
            router.replace("/home");
          } else {
            router.replace(`/gather`);
          }
          return;
        }

        if (firstPath === "community" && secondPath && secondPath !== "writing") {
          if (prevPath === "home") {
            router.replace("/home");
          } else {
            router.replace(`/community`);
          }
          return;
        }
      }

      if (
        BASE_BOTTOM_NAV_SEGMENT.map((item) => "/" + item).includes(pathname) &&
        !isOverlayOpen
      ) {
        if (exitAppRef.current) {
          nativeMethodUtils.exitApp();
          return;
        }

        exitAppRef.current = true;
        toast("warning", "뒤로가기 버튼을 한 번 더 누르면 종료됩니다.");

        setTimeout(() => {
          exitAppRef.current = false;
        }, EXIT_DELAY);
      } else {
        router.back();
      }
    };

    document.addEventListener("message", handleMessage);

    return () => {
      document.removeEventListener("message", handleMessage);
    };
  }, [pathname, router, toast]);

  console.log(42, token, isPublicPage);
  return (
    <>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />

      {(token || isPublicPage) && (
        <>
          <div
            id="root-modal"
            style={{
              ...((currentSegment?.[0] === "register" && currentSegment?.[1] === "auth") ||
              (currentSegment?.[1] === "register" && currentSegment?.[2] === "auth")
                ? {}
                : NOT_PADDING_BOTTOM_NAV_SEGMENT.includes(currentSegment?.[0])
                ? {
                    paddingTop: `56px`,
                  }
                : currentSegment?.[0] === "group" && currentSegment?.[2] === "p"
                ? {
                    // /group/[id]/p 는 헤더 없는 단독 공개 미리보기 페이지라 상단 여백은
                    // 필요 없지만, 하단에 참여 신청 BottomButtonNav가 고정으로 떠 있어
                    // 마지막 콘텐츠가 가려지지 않도록 하단 여백은 유지한다.
                    paddingBottom: getBottomNavTotalHeight(),
                  }
                : !NOT_PADDING_NAV_SEGMENT.includes(currentSegment?.[0]) &&
                  !(currentSegment?.[0] === "cafe-map" && currentSegment?.[1] === "login") &&
                  !(currentSegment?.[0] === "store" && currentSegment?.[1]) &&
                  !(currentSegment?.[0] === "user" && currentSegment?.[1])
                ? {
                    paddingTop: `56px`,
                    // BottomNav의 실제 점유 높이(52px + safe-area)와 동일한 계산값을 사용해
                    // 마지막 콘텐츠가 BottomNav에 가려지지 않게 한다. safe-area 자체는
                    // --app-safe-area-bottom CSS 변수를 통해 전달되므로 여기서 별도 분기가 필요 없다.
                    paddingBottom: getBottomNavTotalHeight(),
                  }
                : {}),
              boxShadow: "0 1px 0 rgba(0,0,0,0.05)",
            }}
          >
            {children}
          </div>

          <PageTracker />

          {isBottomNavCondition && <BottomNav hasBottomNav={isGuest && isBottomNavCondition} />}
          {isGuest && isBottomNavCondition && <GuestBottomNav />}

          <BaseModal isGuest={isGuest} isError={isErrorModal} setIsError={setIsErrorModal} />
        </>
      )}

      <BaseScript />
    </>
  );
}

export default Layout;
