/* eslint-disable @next/next/no-before-interactive-script-outside-document */

import axios from "axios";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

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

export const BASE_BOTTOM_NAV_SEGMENT = ["home", "studyPage", "gather", "user", "group"];
export const NOT_PADDING_NAV_SEGMENT = ["login", "studyPage"];
export const NOT_PADDING_BOTTOM_NAV_SEGMENT = ["vote", "ranking", "board"];

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
    if (PUBLIC_SEGMENT.includes(segment)) return;
    if (!isBottomNavCondition && isGuest) {
      toast(
        "info",
        "현재 게스트 뷰어를 사용하고 있습니다. 활동을 위해서는 앱을 통해 로그인해 주세요.",
      );
      return;
    }
    if (status === "loading" || session === undefined) return;
    const role = session?.user.role;
    if (role === "newUser") {
      router.push("/login");
      toast(
        "info",
        "접속 권한이 없습니다. 다시 로그인 해주세요! 반복되는 경우 관리자에게 문의 부탁드립니다.",
      );
      return;
    }
    if (role === "waiting") {
      router.push("/login?status=waiting");
      return;
    }
    if (!session?.user?.location) {
      toast(
        "warning",
        "접속 권한이 없습니다. 다시 로그인 해주세요! 반복되는 경우 관리자에게 문의 부탁드립니다.",
      );
      signOut({ callbackUrl: `/login/?status=logout` });
    }
  }, [session]);

  return (
    <>
      <Seo title="ABOUT" />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      {token && (
        <>
          <div
            id="root-modal"
            style={
              NOT_PADDING_BOTTOM_NAV_SEGMENT.includes(currentSegment?.[0])
                ? {
                    paddingTop: "56px",
                  }
                : !NOT_PADDING_NAV_SEGMENT.includes(currentSegment?.[0]) &&
                  !(currentSegment?.[0] === "store" && currentSegment?.[1])
                ? {
                    paddingTop: "56px",
                    paddingBottom: `calc(var(--bottom-nav-height) + ${iPhoneNotchSize()}px`,
                  }
                : undefined
            }
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
