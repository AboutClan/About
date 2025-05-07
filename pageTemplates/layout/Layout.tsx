/* eslint-disable @next/next/no-before-interactive-script-outside-document */

import axios from "axios";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";

import BottomNav from "../../components/BottomNav";
import GuestBottomNav from "../../components/layouts/atoms/GuestBottomNav";
import PageTracker from "../../components/layouts/PageTracker";
import { useToken } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import { parseUrlToSegments } from "../../utils/stringUtils";
import { iPhoneNotchSize } from "../../utils/validationUtils";
import BaseModal from "./BaseModal";
import BaseScript from "./BaseScript";
import Seo from "./Seo";

export const BASE_BOTTOM_NAV_SEGMENT = ["home", "gather", "user", "studyPage", "group"];
export const NOT_PADDING_NAV_SEGMENT = ["login"];
export const NOT_PADDING_BOTTOM_NAV_SEGMENT = ["vote", "ranking", "board", "studyPageMap"];

const EXIT_DELAY = 2000;

interface BackActionMessage {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const GoogleAnalytics = dynamic(
  () => import("@next/third-parties/google").then((mod) => mod.GoogleAnalytics),
  {
    ssr: false, // 서버 사이드 렌더링 비활성화
  },
);
interface ILayout {
  children: React.ReactNode;
}

function Layout({ children }: ILayout) {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const token = useToken();
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const segment = pathname?.split("/")?.[1];
  const PUBLIC_SEGMENT = ["register", "login"];

  const { data: session, status } = useSession();

  const currentSegment = parseUrlToSegments(pathname);
  const isBottomNavCondition = useMemo(
    () => BASE_BOTTOM_NAV_SEGMENT.includes(currentSegment?.[0]) && !currentSegment?.[1],
    [currentSegment],
  );

  const isGuest = useMemo(() => session?.user?.name === "guest", [session]);

  const [isErrorModal, setIsErrorModal] = useState(false);

  useEffect(() => {
    if (
      PUBLIC_SEGMENT.includes(segment) ||
      pathname === "/user/info/policy" ||
      pathname === "/user/info/privacy"
    ) {
      return;
    }
    if (!isBottomNavCondition && isGuest) {
      toast(
        "info",
        "현재 게스트 뷰어를 사용하고 있습니다. 활동을 위해서는 앱을 통해 로그인해 주세요.",
      );
      return;
    }
    if (status === "loading" || session === undefined) return;

    /**아이폰 로그인 등 오류 */
    // if (!session?.user) {
    //   router.push("/login");
    //   toast(
    //     "warning",
    //     "계정 정보를 불러올 수 없습니다. 지속되는 경우 마이페이지에서 다시 로그인 해주세요!",
    //   );
    // }
  }, [session, status]);

  const exitAppRef = useRef<boolean>(false);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;

      try {
        const data: BackActionMessage = JSON.parse(event.data);
        if (data.name !== "backAction") return;

        handleBackAction();
      } catch (error) {
        console.error("Failed to parse message data:", error);
      }
    };

    const handleBackAction = () => {
      if (BASE_BOTTOM_NAV_SEGMENT.includes(segment)) {
        if (exitAppRef.current) {
          window.ReactNativeWebView?.postMessage("exitApp");
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
  }, [pathname]);

  return (
    <>
      <Seo title="ABOUT" />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      {/* {detectDevice() !== "PC" && (
        <Global
          styles={{
            "*:hover": {
              background: "inherit !important",
            },
          }}
        />
      )} */}
      {token && (
        <>
          <div
            id="root-modal"
            style={{
              ...(NOT_PADDING_BOTTOM_NAV_SEGMENT.includes(currentSegment?.[0])
                ? {
                    paddingTop: "56px",
                  }
                : !NOT_PADDING_NAV_SEGMENT.includes(currentSegment?.[0]) &&
                    !(currentSegment?.[0] === "store" && currentSegment?.[1]) &&
                    !(currentSegment?.[0] === "user" && currentSegment?.[1])
                  ? {
                      paddingTop: "56px",
                      paddingBottom: `calc(var(--bottom-nav-height) + ${iPhoneNotchSize()}px)`,
                    }
                  : {}),
            }}
          >
            {children}
          </div>
          <PageTracker />
          {isBottomNavCondition && <BottomNav />}
          {isGuest && isBottomNavCondition && <GuestBottomNav />}
          <BaseModal isGuest={isGuest} isError={isErrorModal} setIsError={setIsErrorModal} />
        </>
      )}
      <BaseScript />
    </>
  );
}

export default Layout;
