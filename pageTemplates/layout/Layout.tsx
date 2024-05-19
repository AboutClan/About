/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { config } from "@fortawesome/fontawesome-svg-core";
import { GoogleAnalytics } from "@next/third-parties/google";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import BottomNav from "../../components/BottomNav";
import GuestBottomNav from "../../components/layouts/atoms/GuestBottomNav";
import PageTracker from "../../components/layouts/PageTracker";
import { useToken } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import { parseUrlToSegments } from "../../utils/stringUtils";
import BaseModal from "./BaseModal";
import BaseScript from "./BaseScript";
import Seo from "./Seo";

config.autoAddCss = false;

export const BASE_BOTTOM_NAV_SEGMENT = ["home", "statistics", "gather", "group"];
interface ILayout {
  children: React.ReactNode;
}

function Layout({ children }: ILayout) {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const token = useToken();

  const segment = pathname?.split("/")?.[1];
  const PUBLIC_SEGMENT = ["register", "login"];
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const [isErrorModal, setIsErrorModal] = useState(false);

  const currentSegment = parseUrlToSegments(pathname)?.[0];

  useEffect(() => {
    if (PUBLIC_SEGMENT.includes(segment)) return;
    if (session === undefined) return;
    const role = session?.user.role;
    if (role === "newUser") {
      router.push("/register/location");
      return;
    }
    if (role === "waiting") {
      router.push("/login?status=waiting");
      return;
    }
    if (!session?.user?.location) {
      toast(
        "warning",
        "업데이트가 필요합니다. 다시 로그인 해주세요! 반복되는 경우 관리자에게 문의 부탁드립니다!!",
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
          <div id="root-modal">{children}</div>
          <PageTracker />
          {BASE_BOTTOM_NAV_SEGMENT.includes(currentSegment) && <BottomNav />}
          {isGuest && BASE_BOTTOM_NAV_SEGMENT.includes(currentSegment) && <GuestBottomNav />}
          <BaseModal isGuest={isGuest} isError={isErrorModal} setIsError={setIsErrorModal} />
        </>
      )}
      <BaseScript />
    </>
  );
}

export default Layout;
