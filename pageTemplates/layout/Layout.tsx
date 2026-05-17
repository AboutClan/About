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
import { clearAuthIntent, isAuthIntentActive } from "../../utils/authIntentUtils";
import { getTodayStr } from "../../utils/dateTimeUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";
import { parseUrlToSegments } from "../../utils/stringUtils";
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
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const segment = pathname?.split("/")?.[1];

  const PUBLIC_SEGMENT = ["register", "login"];

  const { data: session, status } = useSession();
  const token = useToken();

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
    pathname === "/faq";

  const isGuest = session?.user.name === "guest";
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
      if (!router?.query?.modal) {
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
        !router.query?.modal
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

  return (
    <>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />

      {(token || isPublicPage) && (
        <>
          <div
            id="root-modal"
            style={{
              ...(currentSegment?.[0] === "register" && currentSegment?.[1] === "auth"
                ? {}
                : NOT_PADDING_BOTTOM_NAV_SEGMENT.includes(currentSegment?.[0])
                ? {
                    paddingTop: `56px`,
                  }
                : !NOT_PADDING_NAV_SEGMENT.includes(currentSegment?.[0]) &&
                  !(currentSegment?.[0] === "store" && currentSegment?.[1]) &&
                  !(currentSegment?.[0] === "user" && currentSegment?.[1])
                ? {
                    paddingTop: `56px`,
                    paddingBottom: `var(--bottom-nav-height)`,
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
