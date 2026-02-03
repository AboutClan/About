/* eslint-disable @next/next/no-before-interactive-script-outside-document */

import { GoogleAnalytics } from "@next/third-parties/google";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import { useDeepLink } from "../../@natives/useDeepLink";
import BottomNav from "../../components/BottomNav";
import GuestBottomNav from "../../components/layouts/atoms/GuestBottomNav";
import PageTracker from "../../components/layouts/PageTracker";
import ForceUpdateModal from "../../components/overlay/UpdateModal";
import { useToken } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import { getTodayStr } from "../../utils/dateTimeUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";
import { parseUrlToSegments } from "../../utils/stringUtils";
import { isApp } from "../../utils/validationUtils";
import BaseModal from "./BaseModal";
import BaseScript from "./BaseScript";

export const BASE_BOTTOM_NAV_SEGMENT = ["home", "gather", "user", "studyPage", "group"];
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
  const token = useToken(); // ⚠️ 업데이트된 useToken을 사용한다고 가정
  useDeepLink({ token });
  // axios 기본 Authorization 헤더 세팅 (토큰 있을 때만)
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

  const isGuest = useMemo(() => session?.user?.name === "guest", [session]);
  const [isErrorModal, setIsErrorModal] = useState(false);

  // 전역 자동 게스트 로그인 시도 여부
  const guestSignInTriedRef = useRef(false);

  /**
   * 전역 자동 게스트 로그인
   * - redirect: false (URL 그대로 유지)
   * - 조건:
   *   - status !== 'loading'
   *   - status !== 'authenticated'
   *   - token 없음
   *   - PUBLIC / 약관 / 개인정보 / FAQ 페이지는 제외
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    // 세션 로딩 중이면 대기
    if (status === "loading") return;
    // 이미 로그인(일반 or 게스트) 되어 있으면 자동 게스트 불필요
    if (status === "authenticated") return;

    // 토큰이 이미 있다면 (이론상 status도 authenticated겠지만, 방어적으로 한 번 더 체크)
    if (token) return;
    // 비로그인 허용 페이지(로그인/회원가입/정책/FAQ)는 자동 게스트 로그인 안 함

    // 이미 시도했으면 다시 시도하지 않음
    if (guestSignInTriedRef.current) return;
    guestSignInTriedRef.current = true;
    if (
      PUBLIC_SEGMENT.includes(segment) ||
      pathname === "/user/info/policy" ||
      pathname === "/user/info/privacy" ||
      pathname === "/faq"
    ) {
      signIn("kakao", { redirect: false });
      return;
    }

    // ⚡ 여기서 게스트 로그인 (redirect: false)
    signIn("guest", {
      redirect: false,
      callbackUrl: router.asPath,
    }).catch((err) => {
      console.error("Guest sign-in failed:", err);
      // 실패해도 화면은 보여야 하므로 여기서 따로 막지는 않음
    });
  }, [status, token, pathname, segment, router.asPath]);

  /**
   * 카카오 인앱 브라우저에서 외부 브라우저로 여는 처리
   * (기존 기능 그대로 유지)
   */
  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   const useragt = navigator.userAgent.toLowerCase();
  //   const isKakao = useragt.includes("kakaotalk");
  //   if (!isKakao) return;

  //   const targetUrl = window.location.href;

  //   const handleLoad = () => {
  //     window.location.href = "kakaotalk://web/openExternal?url=" + encodeURIComponent(targetUrl);
  //   };

  //   window.addEventListener("load", handleLoad);
  //   return () => {
  //     window.removeEventListener("load", handleLoad);
  //   };
  // }, []);

  /**
   * 네이티브 WebView에서 backAction 메시지 처리
   * (기존 기능 그대로 유지)
   */
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

        if (firstPath === "group" && secondPath && secondPath !== "writing") {
          if (prevPath === "home") {
            router.replace("/home");
          } else {
            router.replace(`/group`);
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

  const [needUpdate, setneedUpdate] = useState(false);

  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   const onMessage = (event) => {
  //     const raw = event?.data;
  //     if (!raw || typeof raw !== "string") return;

  //     let data;
  //     try {
  //       data = JSON.parse(raw);
  //     } catch {
  //       return;
  //     }

  //     // RN -> Web에서 보내는 형태: { name: "deviceInfo", ... }
  //     if (data?.name !== "deviceInfo") return;

  //     // ✅ 이전 앱: appVersion이 아예 없음
  //     const hasAppVersion =
  //       typeof data?.appVersion === "string" && data.appVersion.trim().length > 0;

  //     if (!hasAppVersion) {
  //       setneedUpdate(true);
  //       return;
  //     }

  //     // ✅ 최신 앱: appVersion이 있음 (업데이트 필요 false로 내리기 원하면)
  //     setneedUpdate(false);
  //   };

  //   window.addEventListener("message", onMessage);
  //   document.addEventListener("message", onMessage);

  //   return () => {
  //     window.removeEventListener("message", onMessage);
  //     document.removeEventListener("message", onMessage);
  //   };
  // }, []);

  /**
   * 게스트 뷰어 안내 토스트
   * (기존 로직을 유지하되, guest 세션이 잡힌 뒤 동작)
   */
  // useEffect(() => {
  //   if (status === "loading" || session === undefined) return;

  //   if (
  //     PUBLIC_SEGMENT.includes(segment) ||
  //     pathname === "/user/info/policy" ||
  //     pathname === "/user/info/privacy" ||
  //     pathname === "/faq"
  //   ) {
  //     return;
  //   }
  //   console.log("ABOUT", pathname);
  //   if (
  //     !isBottomNavCondition &&
  //     isGuest &&
  //     pathname !== "/cafe-map" &&
  //     pathname !== "/payment/join-fee"
  //   ) {
  //     toast("info", "현재 게스트 뷰어를 이용중입니다.", null, true);
  //   }
  // }, [status, isBottomNavCondition, isGuest, pathname]);

  /**
   * OG 메타 태그 설정 (기존 그대로)
   */
  const { title, description, url, image } =
    pathname === "/cafe-map"
      ? {
          title: "ABOUT 카공 지도",
          description: "카공러들을 위한 진짜 카공 지도",
          url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/cafe-map`,
          image:
            "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%ED%83%80/cafe-map.png",
        }
      : pathname === "/s/lounge"
      ? {
          title: "카공 스터디 라운지",
          description: "스터디 확인, 신청, 변경 모두 이 곳에서!",
          url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/s/lounge`,
          image:
            "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/1.%EC%8A%A4%ED%84%B0%EB%94%94-%EB%A7%A4%EC%B9%AD-%EB%9D%BC%EC%9A%B4%EC%A7%80.png",
        }
      : {
          title: "About",
          description: "20대를 위한 모임 플랫폼",
          url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`,
          image:
            "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%ED%83%80/thumbnail.jpg",
        };

  return (
    <>
      <Head>
        {title && <meta property="og:title" content={title} />}
        {description && <meta property="og:description" content={description} />}
        {url && <meta property="og:url" content={url} />}
        {image && <meta property="og:image" content={image} />}
      </Head>

      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />

      {(token || isPublicPage) && (
        <>
          <div
            id="root-modal"
            style={{
              ...(NOT_PADDING_BOTTOM_NAV_SEGMENT.includes(currentSegment?.[0])
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
      {needUpdate && isApp() && <ForceUpdateModal onClose={() => setneedUpdate(false)} />}
      <BaseScript />
    </>
  );
}

export default Layout;
